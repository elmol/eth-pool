import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";

const ONE_ETH = ethers.utils.parseEther("1");

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

  it("should allow to transfer ethers from any account", async () => {
    await expect(() =>
      alice.sendTransaction({ to: pool.address, value: ONE_ETH })
    ).to.changeEtherBalance(alice, ONE_ETH.mul(-1), { includeFee: false });
  });

  it("should allow to deposit ethers from any account", async () => {
    await expect(() =>
      pool.connect(alice).deposit({
        value: ONE_ETH,
      })
    ).to.changeEtherBalance(alice, ONE_ETH.mul(-1), { includeFee: false });
    expect(await pool.balance(alice.address)).to.be.equal(ONE_ETH);
  });

  it("Should allow to withdraw eth from any account with enough eth", async () => {
    await pool.connect(alice).deposit({
      value: ONE_ETH,
    });
    await expect(() => pool.connect(alice).withdraw()).to.changeEtherBalance(
      alice,
      ONE_ETH,
      {
        includeFee: false,
      }
    );
  });

  it("Should allow only withdraw what the account deposit", async () => {
    // alice deposit
    await pool.connect(alice).deposit({
      value: ONE_ETH,
    });
    // bob deposit
    await pool.connect(bob).deposit({
      value: ONE_ETH,
    });
    await expect(() => pool.connect(alice).withdraw()).to.changeEtherBalance(
      alice,
      ONE_ETH,
      {
        includeFee: false,
      }
    );
  });

  it("Should allow only withdraw what the account transfer", async () => {
    // alice deposit
    alice.sendTransaction({ to: pool.address, value: ONE_ETH });
    // bob deposit
    await pool.connect(bob).deposit({
      value: ONE_ETH,
    });
    await expect(() => pool.connect(alice).withdraw()).to.changeEtherBalance(
      alice,
      ONE_ETH,
      {
        includeFee: false,
      }
    );
  });

  it("Should emit a Deposit event when an account deposit ethers", async () => {
    await expect(
      pool.connect(alice).deposit({
        value: ONE_ETH,
      })
    )
      .to.emit(pool, "Deposit")
      .withArgs(alice.address, ONE_ETH);
  });

  it("Should emit a Withdraw event when an account withdraw ethers", async () => {
    // alice deposit
    await pool.connect(alice).deposit({
      value: ONE_ETH,
    });

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

  it("Should account balance be 0 after withdraw", async () => {
    // alice deposit
    await pool.connect(alice).deposit({
      value: ONE_ETH,
    });

    // alice withdraw
    pool.connect(alice).withdraw();

    expect(await pool.connect(alice).balance(alice.address)).to.be.equal(0);
  });

  it("Should allow to the team deposit rewards to the pool", async () => {
    // alice deposit
    await pool.connect(alice).deposit({
      value: ONE_ETH,
    });

    expect(await ethers.provider.getBalance(pool.address), ONE_ETH.toString());

    await expect(() =>
      pool.connect(team).depositRewards({
        value: ONE_ETH,
      })
    ).to.changeEtherBalance(team, ONE_ETH.mul(-1), { includeFee: false });

    expect(
      await ethers.provider.getBalance(pool.address),
      ONE_ETH.mul(2).toString()
    );
  });

  it("Should deposit rewards be reverted if not team", async () => {
    await expect(
      pool.connect(alice).depositRewards({
        value: ONE_ETH,
      })
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should deposit rewards should be reverted if the pool is empty", async () => {
    expect(await ethers.provider.getBalance(pool.address), "1");
    await expect(
      pool.connect(team).depositRewards({
        value: ONE_ETH,
      })
    ).to.be.revertedWith("Pool is empty");
  });
});
