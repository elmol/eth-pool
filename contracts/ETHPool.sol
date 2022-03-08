//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract ETHPool {
    event Deposit(address from, uint256 value);
    event Withdraw(address from, uint256 value);

    mapping(address => uint256) private balance;

    function deposit() external payable {
        _deposit();
    }

    receive() external payable {
        _deposit();
    }

    function withdraw() external {
        uint256 toTransfer = balance[msg.sender];
        balance[msg.sender] = 0;

        payable(msg.sender).transfer(toTransfer);

        emit Withdraw(msg.sender, toTransfer);
    }

    function _deposit() internal {
        balance[msg.sender] = msg.value;

        emit Deposit(msg.sender, msg.value);
    }
}
