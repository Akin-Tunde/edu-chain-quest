// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IStakingContract.sol";

contract RewardDistribution is Initializable, AccessControlUpgradeable, PausableUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant REWARD_MANAGER_ROLE = keccak256("REWARD_MANAGER_ROLE"); // The Backend Oracle

    struct RewardPool {
        bool isActive;
        uint256 dailyCap; // Max tokens a single user can earn per day
    }
    
    struct UserReward {
        uint256 earned;
        uint256 claimed;
        uint256 dailyEarned;
        uint256 lastActivityDate;
    }
    
    mapping(address => RewardPool) public rewardPools; // token address => pool
    mapping(address => mapping(address => UserReward)) public userRewards; // user => token => rewards
    address[] public supportedTokens;
    IStakingContract public stakingContract;

    event RewardAwarded(address indexed user, address indexed token, uint256 amount);
    event RewardClaimed(address indexed user, address indexed token, uint256 amount);
    event TokenDeposited(address indexed token, uint256 amount);
    event TokenAdded(address indexed token);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _admin, address _rewardManager) public initializer {
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        _grantRole(REWARD_MANAGER_ROLE, _rewardManager);
    }
    
    function addRewardToken(address tokenAddress, uint256 dailyCap) external onlyRole(ADMIN_ROLE) {
        require(!rewardPools[tokenAddress].isActive, "Token already supported");
        rewardPools[tokenAddress] = RewardPool({ isActive: true, dailyCap: dailyCap });
        supportedTokens.push(tokenAddress);
        emit TokenAdded(tokenAddress);
    }

    function depositTokens(address tokenAddress, uint256 amount) external onlyRole(ADMIN_ROLE) {
        require(rewardPools[tokenAddress].isActive, "Token not supported");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        emit TokenDeposited(tokenAddress, amount);
    }

    function awardReward(address user, address tokenAddress, uint256 amount) external onlyRole(REWARD_MANAGER_ROLE) nonReentrant whenNotPaused {
        require(rewardPools[tokenAddress].isActive, "Token not supported");
        require(amount > 0, "Amount must be > 0");
        UserReward storage userReward = userRewards[user][tokenAddress];

        if (block.timestamp >= userReward.lastActivityDate + 1 days) {
            userReward.dailyEarned = 0;
            userReward.lastActivityDate = block.timestamp;
        }

        require(userReward.dailyEarned + amount <= rewardPools[tokenAddress].dailyCap, "Daily cap exceeded");
        require(IERC20(tokenAddress).balanceOf(address(this)) >= amount, "Insufficient pool balance");

        userReward.earned += amount;
        userReward.dailyEarned += amount;
        emit RewardAwarded(user, tokenAddress, amount);
    }
    
    function claimAllRewards() external nonReentrant whenNotPaused {
        for (uint i = 0; i < supportedTokens.length; i++) {
            address token = supportedTokens[i];
            uint256 claimable = userRewards[msg.sender][token].earned - userRewards[msg.sender][token].claimed;
            if (claimable > 0) {
                userRewards[msg.sender][token].claimed += claimable;
                emit RewardClaimed(msg.sender, token, claimable);
                IERC20(token).transfer(msg.sender, claimable);
            }
        }
    }

    function setStakingContract(address _stakingAddress) external onlyRole(ADMIN_ROLE) {
        stakingContract = IStakingContract(_stakingAddress);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
