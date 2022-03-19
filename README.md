# ETH POOL

Exactly Finance challenge https://github.com/exactly-finance/challenge

> **disclaimer:** This code does merely have a _teaching purpose_.

## Assumptions

Team EOA management is out of scope of the pool and only team EOA can deposit rewards. By default, team account is the used to deploy the contract and it can be updated by transferOwnership method.

Participants are not able to do partial withdrawals.

EHT Pool contract is not stoppable.

## Deployed at KOVAN
```
ETHPool deployed to: 0x447Ca2Dccfd0f1D88AE7984fAc85574EF551d05f with Team address: 0x45756fED107d0aEA575a2dc0d49a1c5156b0b796
```
## Verification at KOVAN

```
$ npx hardhat verify --network kovan 0x447Ca2Dccfd0f1D88AE7984fAc85574EF551d05f
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/ETHPool.sol:ETHPool at 0x447Ca2Dccfd0f1D88AE7984fAc85574EF551d05f
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ETHPool on Etherscan.
https://kovan.etherscan.io/address/0x447Ca2Dccfd0f1D88AE7984fAc85574EF551d05f#code
``` 
## Test Coverage
```
--------------|----------|----------|----------|----------|----------------|
File          |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------|----------|----------|----------|----------|----------------|
 contracts/   |      100 |      100 |      100 |      100 |                |
  ETHPool.sol |      100 |      100 |      100 |      100 |                |
--------------|----------|----------|----------|----------|----------------|
All files     |      100 |      100 |      100 |      100 |                |
--------------|----------|----------|----------|----------|----------------|
```
# Gas Report
```
·-------------------------------|----------------------------|-------------|-----------------------------·
|      Solc version: 0.8.4      ·  Optimizer enabled: false  ·  Runs: 200  ·  Block limit: 30000000 gas  │
································|····························|·············|······························
|  Methods                                                                                               │
·············|··················|·············|··············|·············|···············|··············
|  Contract  ·  Method          ·  Min        ·  Max         ·  Avg        ·  # calls      ·  usd (avg)  │
·············|··················|·············|··············|·············|···············|··············
|  ETHPool   ·  deposit         ·      94894  ·      111994  ·     108194  ·           18  ·          -  │
·············|··················|·············|··············|·············|···············|··············
|  ETHPool   ·  depositRewards  ·      36177  ·       44771  ·      37405  ·            7  ·          -  │
·············|··················|·············|··············|·············|···············|··············
|  ETHPool   ·  withdraw        ·      40771  ·       49168  ·      44307  ·           19  ·          -  │
·············|··················|·············|··············|·············|···············|··············
|  Deployments                  ·                                          ·  % of limit   ·             │
································|·············|··············|·············|···············|··············
|  ETHPool                      ·          -  ·           -  ·    1028866  ·        3.4 %  ·          -  │
·-------------------------------|-------------|--------------|-------------|---------------|-------------·
```
## Hardhat commands

Advanced Sample Hardhat Project was used as project started, so you can the following documentation

> # Advanced Sample Hardhat Project
>
> This project demonstrates an advanced Hardhat use case, integrating other tools commonly used > alongside Hardhat in the ecosystem.
>
> The project comes with a sample contract, a test for that contract, a sample script that deploys that > contract, and an example of a task implementation, which simply lists the available accounts. It also > comes with a variety of other tools, preconfigured to work with the project code.
>
> Try running some of the following tasks:
>
> ```shell
> npx hardhat accounts
>npx hardhat compile
>npx hardhat clean
>npx hardhat test
>npx hardhat node
>npx hardhat help
>REPORT_GAS=true npx hardhat test
>npx hardhat coverage
>npx hardhat run scripts/deploy.ts
>TS_NODE_FILES=true npx ts-node scripts/deploy.ts
>npx eslint '**/*.{js,ts}'
>npx eslint '**/*.{js,ts}' --fix
>npx prettier '**/*.{json,sol,md}' --check
>npx prettier '**/*.{json,sol,md}' --write
>npx solhint 'contracts/**/*.sol'
>npx solhint 'contracts/**/*.sol' --fix
>```
>
># Etherscan verification
>
>To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's >supported by Etherscan, such as Ropsten.
>
>In this project, copy the .env.example file to a file named .env, and then edit it to fill in the >details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of >the account which will send the deployment transaction. With a valid .env file in place, first deploy >your contract:
>
>```shell
>hardhat run --network ropsten scripts/deploy.ts
>```
>
>Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this >command:
>
>```shell
>npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
>```
>
># Performance optimizations
>
>For faster runs of your tests and scripts, consider skipping ts-node's type checking by setting the >environment variable `TS_NODE_TRANSPILE_ONLY` to `1` in hardhat's environment. For more details see >[the documentation](https://hardhat.org/guides/typescript.html#performance-optimizations).

https://ethresear.ch/t/efficient-onchain-reward-distribution-pooled-payments-dividends/1924

http://batog.info/papers/scalable-reward-distribution.pdf

https://solidity-by-example.org/defi/staking-rewards/
https://github.com/Synthetixio/synthetix/blob/develop/contracts/StakingRewards.sol

1. https://www.youtube.com/watch?v=6ZO5aYg1GI8
2. https://www.youtube.com/watch?v=LWWsjw3cgDk
3. https://www.youtube.com/watch?v=YqpRwJDz3xg
4. https://www.youtube.com/watch?v=pFX1-kNrJFU

Synthetix Staking Rewards Contract Explained - Part 1 - More Math | DeFi

3K views
5 months ago

Smart Contract Programmer
This video explains how to derive another form of the same equation to calculate staking rewards.

6:54
NOW PLAYING
Synthetix Staking Rewards Contract Explained - Part 2 - Algorithm | DeFi

2.6K views
5 months ago

Smart Contract Programmer
This video explains how the Synthetix StakingRewards contract efficiently calculated rewards of stakers without using for loops.

5:22
NOW PLAYING

WATCH LATER
ADD TO QUEUE
Synthetix Staking Rewards Contract Explained - Part 3 - Code | DeFi

3.3K views
5 months ago


//foreach over array
https://hackernoon.com/implementing-staking-in-solidity-1687302a82cf