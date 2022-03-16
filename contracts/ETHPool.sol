//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract ETHPool is Ownable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    uint256 private constant SHARE_RATIO_PRECISION = 10000;

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
        require(msg.value > 0, "Deposit must be greater than 0");

        // pool balance before deposit rewards
        uint256 poolBalance = address(this).balance.sub(msg.value);
        require(poolBalance > 0, "Pool is empty");

        // share of rewards proportionally
        uint256 participantsAmount = participants.length();
        for (uint256 index = 0; index < participantsAmount; index++) {
            address participant = participants.at(index);
            uint256 currentBalance = balance[participant];
            uint256 share = _calculateShareRate(poolBalance, currentBalance);
            uint256 newBalance = currentBalance.add(_calculateShareAmount(msg.value, share));
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

    function _calculateShareRate(
        uint256 poolBalance,
        uint256 participantBalance
    ) internal pure returns (uint256) {
        return participantBalance.mul(SHARE_RATIO_PRECISION).div(poolBalance);
    }

    function _calculateShareAmount(uint256 toShare, uint256 shareRatio)
        internal
        pure
        returns (uint256)
    {
        return shareRatio.mul(toShare).div(SHARE_RATIO_PRECISION);
    }
}
