// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract CourseRegistry is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant INSTRUCTOR_ROLE = keccak256("INSTRUCTOR_ROLE");

    struct Course {
        uint256 id;
        address instructor;
        string metadataHash; // IPFS hash
        uint256 priceUSD; // In USD cents
        bool isActive;
        uint256 revenueShareBps; // Payout to instructor in basis points
        uint256 requiredBadgeId; // NFT Gating: 0 means no requirement
    }

    mapping(uint256 => Course) public courses;
    mapping(address => bool) public verifiedInstructors;
    uint256 public courseCounter;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _admin) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
    }
    
    function createCourse(
        string memory _metadataHash,
        uint256 _priceUSD,
        uint256 _revenueShareBps,
        uint256 _requiredBadgeId
    ) external returns (uint256) {
        require(verifiedInstructors[msg.sender], "Not a verified instructor");
        require(_revenueShareBps <= 10000, "Revenue share exceeds 100%");
        
        courseCounter++;
        uint256 courseId = courseCounter;
        courses[courseId] = Course({
            id: courseId,
            instructor: msg.sender,
            metadataHash: _metadataHash,
            priceUSD: _priceUSD,
            isActive: true,
            revenueShareBps: _revenueShareBps,
            requiredBadgeId: _requiredBadgeId
        });
        
        // Emit event
        return courseId;
    }
    
    function verifyInstructor(address instructor) external onlyRole(ADMIN_ROLE) {
        verifiedInstructors[instructor] = true;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
