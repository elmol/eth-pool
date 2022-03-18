import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const ONE_ETH = ethers.constants.One;
const TWO_ETH = ethers.constants.Two;
const THREE_ETH = ONE_ETH.mul(3);
const NEGATIVE_ONE_ETH = ethers.constants.NegativeOne;

describe("ETHPool", () => {
  let pool: Contract;
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let team: SignerWithAddress;

  beforeEach(async () => {
    [team, alice, bob] = await ethers.getSigners();
    const ETHPool = await ethers.getContractFactory("ETHPool");
    pool = await ETHPool.deploy();
    await pool.deployed();
  });

  it("Should be initialized", async function () {
    // initialized
  });

  it("Should allow to transfer ethers from any account", async () => {
    await expect(() =>
      alice.sendTransaction({ to: pool.address, value: ONE_ETH })
    ).to.changeEtherBalance(alice, NEGATIVE_ONE_ETH, { includeFee: false });
  });

  it("Should allow to deposit ethers from any account", async () => {
    await expect(() =>
      pool.connect(alice).deposit({ value: ONE_ETH })
    ).to.changeEtherBalance(alice, NEGATIVE_ONE_ETH, { includeFee: false });
    expect(await pool.balance(alice.address)).to.be.equal(ONE_ETH);
  });

  it("Should allow to withdraw ethers from any account with enough funds", async () => {
    await pool.connect(alice).deposit({ value: ONE_ETH });
    await expect(() => pool.connect(alice).withdraw()).to.changeEtherBalance(
      alice,
      ONE_ETH,
      { includeFee: false }
    );
  });

  it("Should allow only withdraw what the account deposited", async () => {
    // alice deposit
    await pool.connect(alice).deposit({ value: ONE_ETH });
    // bob deposit
    await pool.connect(bob).deposit({ value: ONE_ETH });
    await expect(() => pool.connect(alice).withdraw()).to.changeEtherBalance(
      alice,
      ONE_ETH,
      { includeFee: false }
    );
  });

  it("Should allow only withdraw what the account transferred", async () => {
    // alice deposit
    alice.sendTransaction({ to: pool.address, value: ONE_ETH });
    // bob deposit
    await pool.connect(bob).deposit({ value: ONE_ETH });
    await expect(() => pool.connect(alice).withdraw()).to.changeEtherBalance(
      alice,
      ONE_ETH,
      { includeFee: false }
    );
  });

  it("Should emit a Deposit event when an account deposits ethers", async () => {
    await expect(pool.connect(alice).deposit({ value: ONE_ETH }))
      .to.emit(pool, "Deposit")
      .withArgs(alice.address, ONE_ETH);
  });

  it("Should emit a Withdraw event when an account withdraws ethers", async () => {
    // alice deposit
    await pool.connect(alice).deposit({ value: ONE_ETH });

    await expect(pool.connect(alice).withdraw())
      .to.emit(pool, "Withdraw")
      .withArgs(alice.address, ONE_ETH);
  });

  it("Should revert a 0 deposit transaction", async () => {
    await expect(pool.connect(alice).deposit({ value: 0 })).to.be.revertedWith(
      "Deposit must be greater than 0"
    );
  });

  it("Should revert a 0 transfer transaction", async () => {
    await expect(
      alice.sendTransaction({ to: pool.address })
    ).to.be.revertedWith("Deposit must be greater than 0");
  });

  it("Should revert a withdraw transaction from an account with 0 balance", async () => {
    await expect(pool.connect(alice).withdraw()).to.be.revertedWith(
      "No ETH to withdraw"
    );
  });

  it("Should leave the account balance at 0 after a withdrawal", async () => {
    // alice deposit
    await pool.connect(alice).deposit({ value: ONE_ETH });

    // alice withdraw
    pool.connect(alice).withdraw();

    expect(await pool.connect(alice).balance(alice.address)).to.be.equal(0);
  });

  it("Should allow the team to deposit rewards into the pool", async () => {
    // alice deposit
    await pool.connect(alice).deposit({ value: ONE_ETH });

    expect(await ethers.provider.getBalance(pool.address)).to.be.equal(ONE_ETH);
    await expect(() =>
      pool.connect(team).depositRewards({ value: ONE_ETH })
    ).to.changeEtherBalance(team, NEGATIVE_ONE_ETH, { includeFee: false });

    expect(await ethers.provider.getBalance(pool.address)).to.be.equal(TWO_ETH);
  });

  it("Should revert if the rewards deposit is not made by the team", async () => {
    await expect(
      pool.connect(alice).depositRewards({ value: ONE_ETH })
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should revert if the rewards deposit is done in an empty pool", async () => {
    expect(await ethers.provider.getBalance(pool.address)).to.be.equal(0);
    await expect(
      pool.connect(team).depositRewards({ value: ONE_ETH })
    ).to.be.revertedWith("Pool is empty");
  });
  it("Should allow a single participant to withdraw the entire rewards", async () => {
    // alice deposit
    await pool.connect(alice).deposit({ value: ONE_ETH });

    // team deposit rewards
    await pool.connect(team).depositRewards({ value: ONE_ETH });

    // alice withdraw
    await expect(() => pool.connect(alice).withdraw()).to.changeEtherBalance(
      alice,
      TWO_ETH,
      { includeFee: false }
    );

    expect(await ethers.provider.getBalance(pool.address)).to.be.equal(0);
  });

  it("Should be able to share rewards proportionally between all participants", async () => {
    // alice deposit
    await pool.connect(alice).deposit({ value: ONE_ETH });

    // bob deposit
    await pool.connect(bob).deposit({ value: ONE_ETH });

    // team deposit rewards
    await pool.connect(team).depositRewards({ value: TWO_ETH });

    // alice balance
    expect(await pool.connect(alice).balance(alice.address)).to.be.equal(
      TWO_ETH
    );

    // bob balance
    expect(await pool.connect(bob).balance(bob.address)).to.be.equal(TWO_ETH);

    // alice withdraw
    await expect(() => pool.connect(alice).withdraw()).to.changeEtherBalance(
      alice,
      TWO_ETH,
      { includeFee: false }
    );

    // bob withdraw
    await expect(() => pool.connect(bob).withdraw()).to.changeEtherBalance(
      bob,
      TWO_ETH,
      { includeFee: false }
    );

    expect(await ethers.provider.getBalance(pool.address)).to.be.equal(0);
  });

  it("Should not allow withdrawal of rewards awarded prior to deposit", async () => {
    // alice deposit
    await pool.connect(alice).deposit({ value: ONE_ETH });

    // team deposit rewards
    await pool.connect(team).depositRewards({ value: TWO_ETH });

    // bob deposit
    await pool.connect(bob).deposit({ value: ONE_ETH });

    // alice balance
    expect(await pool.connect(alice).balance(alice.address)).to.be.equal(
      THREE_ETH
    );

    // bob balance
    expect(await pool.connect(bob).balance(bob.address)).to.be.equal(ONE_ETH);

    // alice withdraw
    await expect(() => pool.connect(alice).withdraw()).to.changeEtherBalance(
      alice,
      THREE_ETH,
      { includeFee: false }
    );

    // bob withdraw
    await expect(() => pool.connect(bob).withdraw()).to.changeEtherBalance(
      bob,
      ONE_ETH,
      { includeFee: false }
    );
  });

  it("Should revert rewards deposits with 0 value", async () => {
    // alice deposit
    await pool.connect(alice).deposit({ value: ONE_ETH });

    await expect(
      pool.connect(team).depositRewards({ value: 0 })
    ).to.be.revertedWith("Deposit must be greater than 0");
  });

  it("Should emit a Deposit Rewards event when rewards are deposit", async () => {
    // alice deposit
    await pool.connect(alice).deposit({ value: ONE_ETH });

    await expect(pool.connect(team).depositRewards({ value: ONE_ETH }))
      .to.emit(pool, "DepositRewards")
      .withArgs(team.address, ONE_ETH);
  });
});
