import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const ONE_ETH = ethers.utils.parseEther("1");

describe("ETHPool", () => {
  let pool: Contract;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;

  beforeEach(async () => {
    const ETHPool = await ethers.getContractFactory("ETHPool");
    pool = await ETHPool.deploy();
    await pool.deployed();
    [alice, bob] = await ethers.getSigners();
  });

  it("Should be initialized", async function () {
    // initialized
  });

  it("should allow to transfer ethers from any account", async () => {
    await expect(() =>
      alice.sendTransaction({ to: pool.address, value: ONE_ETH })
    ).to.changeEtherBalance(alice, ONE_ETH.mul(-1), { includeFee: false });
  });

  it("should allow to deposit ethers from any account", async () => {
    await expect(() =>
      pool.deposit({
        value: ONE_ETH,
      })
    ).to.changeEtherBalance(alice, ONE_ETH.mul(-1), { includeFee: false });
  });

  it("Should allow to withdraw eth from any account with enough eth", async () => {
    await pool.deposit({
      value: ONE_ETH,
    });
    await expect(() => pool.withdraw()).to.changeEtherBalance(alice, ONE_ETH, {
      includeFee: false,
    });
  });

  it("Should allow only withdraw what the account deposit", async () => {
    // alice deposit
    await pool.deposit({
      value: ONE_ETH,
    });
    // bob deposit
    await pool.connect(bob).deposit({
      value: ONE_ETH,
    });
    await expect(() => pool.withdraw()).to.changeEtherBalance(alice, ONE_ETH, {
      includeFee: false,
    });
  });

  it("Should allow only withdraw what the account transfer", async () => {
    // alice deposit
    alice.sendTransaction({ to: pool.address, value: ONE_ETH });
    // bob deposit
    await pool.connect(bob).deposit({
      value: ONE_ETH,
    });
    await expect(() => pool.withdraw()).to.changeEtherBalance(alice, ONE_ETH, {
      includeFee: false,
    });
  });

  it("Should emit a Deposit event when an account deposit ethers", async () => {
    await expect(
      pool.deposit({
        value: ONE_ETH,
      })
    )
      .to.emit(pool, "Deposit")
      .withArgs(alice.address, ONE_ETH);
  });

  it("Should emit a Withdraw event when an account withdraw ethers", async () => {
    // alice deposit
    await pool.deposit({
      value: ONE_ETH,
    });

    await expect(pool.withdraw())
      .to.emit(pool, "Withdraw")
      .withArgs(alice.address, ONE_ETH);
  });
});
