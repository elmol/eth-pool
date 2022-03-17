//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @dev ETHPool provides a service where people can deposit ETH and they will receive rewards.
 * Users must be able to take out their deposits along with their portion of rewards at any time.
 *  New rewards are deposited manually into the pool by the ETHPool team.
 */
contract ETHPool is Ownable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    event Deposit(address from, uint256 value);
    event Withdraw(address from, uint256 value);
    event DepositRewards(address from, uint256 value);

    EnumerableSet.AddressSet private participants;
    mapping(address => uint256) public balance;

    /**
     * @dev Deposit could be do by anyone who transfer ETH to the contract
     */
    receive() external payable {
        _deposit();
    }

    /**
     * @dev Anyone can deposit to the pool
     */
    function deposit() external payable {
        _deposit();
    }

    /**
     * @dev Only team can deposit rewards.
     *  The pool should not be emtpy.
     */
    function depositRewards() external payable onlyOwner {
        require(msg.value > 0, "Deposit must be greater than 0");

        // pool balance before deposit rewards
        uint256 poolBalance = address(this).balance.sub(msg.value);
        require(poolBalance > 0, "Pool is empty");

        // share of rewards proportionally
        uint256 participantsAmount = participants.length();
        for (uint256 index = 0; index < participantsAmount; index++) {
            address participant = participants.at(index);
            uint256 currentBalance = balance[participant];

            //amountToShare = totalRewards * participantBalance / poolBalance
            uint256 amountToShare = msg.value.mul(currentBalance).div(
                poolBalance
            );
            balance[participant] = currentBalance.add(amountToShare);
        }

        emit DepositRewards(msg.sender, msg.value);
    }

    /**
     * @dev Anyone who have deposited to the pool can withdraw their entry deposit
     */
    function withdraw() external {
        uint256 toTransfer = balance[msg.sender];
        require(toTransfer > 0, "No ETH to withdraw");

        balance[msg.sender] = 0;
        participants.remove(msg.sender);
        payable(msg.sender).transfer(toTransfer);

        emit Withdraw(msg.sender, toTransfer);
    }

    function _deposit() internal {
        require(msg.value > 0, "Deposit must be greater than 0");
        balance[msg.sender] = msg.value;
        participants.add(msg.sender);

        emit Deposit(msg.sender, msg.value);
    }
}
