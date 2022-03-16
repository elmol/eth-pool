//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract ETHPool is Ownable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;
     
    event Deposit(address from, uint256 value);
    event Withdraw(address from, uint256 value);

    EnumerableSet.AddressSet private participants;
    mapping(address => uint256) public balance;

    receive() external payable {
        _deposit();
    }

    function deposit() external payable {
        _deposit();
    }

    function depositRewards() external payable onlyOwner {
        // @dev pool is empty if balance is 0 before deposit rewards
        require(address(this).balance > msg.value, "Pool is empty");

        // share of rewards proportionally
        uint256 participantsCount = participants.length();

        for (uint256 index = 0; index < participantsCount; index++) {
            address participant = participants.at(index);
            uint256 currentBalance = balance[participant];
            uint256 share = currentBalance.mul(100).div(address(this).balance.sub(msg.value));
            uint256 newBalance = currentBalance.add(share.mul(msg.value).div(100));
            balance[participant] = newBalance;
        }
    }

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
