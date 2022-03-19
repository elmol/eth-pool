//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @dev ETHPool provides a service where people can deposit ETH and they will receive rewards.
 * Users must be able to take out their deposits along with their portion of rewards at any time.
 *  New rewards are deposited manually into the pool by the ETHPool team.
 */
contract ETHPool is Ownable {
    using SafeMath for uint256;

    event Deposit(address from, uint256 value);
    event Withdraw(address from, uint256 value);
    event DepositRewards(address from, uint256 value);

    uint256 private totalSupply = 0;
    uint256 private totalRewards = 0;
    mapping(address => uint256) private stake;
    mapping(address => uint256) private rewards;

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

    function balance(address account) public view returns (uint256) {
        uint256 deposited = stake[account];
        uint256 reward = deposited.mul(totalRewards.sub(rewards[account]));
        return  deposited.add(reward);
    }

    /**
     * @dev Only team can deposit rewards.
     *  The pool should not be emtpy.
     */
    function depositRewards() external payable onlyOwner {
        require(msg.value > 0, "Deposit must be greater than 0");
        require(totalSupply > 0, "Pool is empty");

        totalRewards = totalRewards.add(msg.value.div(totalSupply));

        emit DepositRewards(msg.sender, msg.value);
    }

    /**
     * @dev Anyone who have deposited to the pool can withdraw their entry deposit
     */
    function withdraw() external {
        uint256 toTransfer = this.balance(msg.sender);
        require(toTransfer > 0, "No ETH to withdraw");

        totalSupply = totalSupply.sub(stake[msg.sender]);
        stake[msg.sender] = 0;

        payable(msg.sender).transfer(toTransfer);

        emit Withdraw(msg.sender, toTransfer);
    }

    function _deposit() internal {
        require(msg.value > 0, "Deposit must be greater than 0");

        stake[msg.sender] = msg.value;
        rewards[msg.sender] = totalRewards;
        totalSupply = totalSupply.add(msg.value);

        emit Deposit(msg.sender, msg.value);
    }
}
