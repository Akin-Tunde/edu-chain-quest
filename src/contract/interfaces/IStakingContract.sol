// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IStakingContract
 * @dev Interface for the EDUStaking contract.
 * Allows other contracts (like a backend-facing multicall) to query staking data.
 */
interface IStakingContract {
    /**
     * @dev Returns a reward multiplier for a user based on their stake.
     * 10000 = 1x (no boost), 11000 = 1.1x (10% boost).
     */
    function getRewardMultiplier(address user) external view returns (uint256);

    /**
     * @dev Returns the total amount of EDU tokens staked by a user.
     */
    function getTotalStakedForUser(address user) external view returns (uint256);
}
