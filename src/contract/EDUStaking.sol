// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IStakingContract.sol";

contract EDUStaking is Initializable, AccessControlUpgradeable, ReentrancyGuardUpgradeable, UUPSUpgradeable, IStakingContract {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lockPeriod; // in seconds
    }
    
    IERC20 public eduToken;
    mapping(address => StakeInfo[]) public userStakes;
    mapping(uint256 => uint256) public lockPeriodRates; // lock period => reward rate (APY in BPS)
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 31536000;

    event Staked(address indexed user, uint256 amount, uint256 lockPeriod, uint256 stakeIndex);
    event Unstaked(address indexed user, uint256 stakeIndex, uint256 principle, uint256 reward);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    function initialize(address _admin, address _eduToken) public initializer {
        __AccessControl_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(ADMIN_ROLE, _admin);
        eduToken = IERC20(_eduToken);

        lockPeriodRates[0] = 500; // Flexible: 5% APY
        lockPeriodRates[30 days] = 800; // 1 month: 8% APY
        lockPeriodRates[90 days] = 1200; // 3 months: 12% APY
    }
    
    function stake(uint256 amount, uint256 lockPeriod) external nonReentrant {
        require(lockPeriodRates[lockPeriod] > 0, "Invalid lock period");
        eduToken.transferFrom(msg.sender, address(this), amount);
        userStakes[msg.sender].push(StakeInfo({ amount: amount, startTime: block.timestamp, lockPeriod: lockPeriod }));
        emit Staked(msg.sender, amount, lockPeriod, userStakes[msg.sender].length - 1);
    }
    
    function unstake(uint256 stakeIndex) external nonReentrant {
        // FIX: Renamed 'stake' to 'stakeInfo' to resolve shadowing warning.
        StakeInfo storage stakeInfo = userStakes[msg.sender][stakeIndex];
        require(stakeInfo.amount > 0, "Stake does not exist or already withdrawn");
        require(block.timestamp >= stakeInfo.startTime + stakeInfo.lockPeriod, "Lock period not ended");

        uint256 principle = stakeInfo.amount;
        uint256 reward = calculateReward(stakeIndex);
        
        stakeInfo.amount = 0; // Mark as withdrawn
        
        eduToken.transfer(msg.sender, principle + reward);
        emit Unstaked(msg.sender, stakeIndex, principle, reward);
    }

    function calculateReward(uint256 stakeIndex) public view returns (uint256) {
        // FIX: Renamed 'stake' to 'stakeInfo' to resolve shadowing warning.
        StakeInfo storage stakeInfo = userStakes[msg.sender][stakeIndex];
        if (stakeInfo.amount == 0) return 0;
        uint256 stakingDuration = block.timestamp - stakeInfo.startTime;
        uint256 rewardRate = lockPeriodRates[stakeInfo.lockPeriod];
        return (stakeInfo.amount * rewardRate * stakingDuration) / (BASIS_POINTS * SECONDS_PER_YEAR);
    }

    function getTotalStakedForUser(address user) public view override returns (uint256) {
        uint256 totalUserStake = 0;
        for (uint i = 0; i < userStakes[user].length; i++) {
            if (userStakes[user][i].amount > 0) {
                totalUserStake += userStakes[user][i].amount;
            }
        }
        return totalUserStake;
    }

    function getRewardMultiplier(address user) public view override returns (uint256) {
        uint256 totalUserStake = getTotalStakedForUser(user);
        if (totalUserStake >= 100000 * 10**18) return 12000; // 20% boost
        if (totalUserStake >= 10000 * 10**18) return 11000; // 10% boost
        return 10000; // 1x base
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyRole(ADMIN_ROLE) {}
}
