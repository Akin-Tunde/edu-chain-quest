// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./CourseRegistry.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CoursePayment is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    CourseRegistry public courseRegistry;
    address public platformTreasury;
    
    mapping(address => address) public tokenPriceFeeds; // payment token address -> Chainlink USD feed address

    event CoursePurchased(uint256 indexed courseId, address indexed user, address indexed paymentToken, uint256 amountPaidInToken);
    
    constructor(address _admin, address _courseRegistry, address _treasury) {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        courseRegistry = CourseRegistry(_courseRegistry);
        platformTreasury = _treasury;
    }

    function setTokenPriceFeed(address _token, address _feed) external onlyRole(ADMIN_ROLE) {
        tokenPriceFeeds[_token] = _feed;
    }

    function getAmountInToken(uint256 _amountUSD, address _token) public view returns (uint256) {
        address feed = tokenPriceFeeds[_token];
        require(feed != address(0), "Price feed not available for this token");
        AggregatorV3Interface priceFeed = AggregatorV3Interface(feed);
        (, int price, , , ) = priceFeed.latestRoundData();
        // Chainlink price feeds for crypto/USD have 8 decimals.
        // We assume payment tokens have 18 decimals.
        // amountUSD is in cents, so we multiply by 10**16 (18 - 2) to get the token equivalent.
        return (_amountUSD * (10**16)) * (10**18) / uint(price);
    }
    
    function purchaseCourse(uint256 _courseId, address _paymentToken) external {
        CourseRegistry.Course memory course = courseRegistry.courses(_courseId);
        require(course.isActive, "Course is not active");
        require(course.priceUSD > 0, "Course is not for sale");

        uint256 amountInToken = getAmountInToken(course.priceUSD, _paymentToken);
        IERC20 paymentToken = IERC20(_paymentToken);
        
        paymentToken.transferFrom(msg.sender, address(this), amountInToken);

        uint256 instructorShare = (amountInToken * course.revenueShareBps) / 10000;
        uint256 platformShare = amountInToken - instructorShare;
        
        paymentToken.transfer(course.instructor, instructorShare);
        paymentToken.transfer(platformTreasury, platformShare);

        emit CoursePurchased(_courseId, msg.sender, _paymentToken, amountInToken);
    }
}
