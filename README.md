# ETH POOL

Exactly Finance challenge https://github.com/exactly-finance/challenge

> **disclaimer:** This code does merely have a _teaching purpose_.

## Assumptions

Team EOA management is out of scope of the pool and only team EOA can deposit rewards. By default, team account is the used to deploy the contract and it can be updated by transferOwnership method.

Participants are not able to do partial withdrawals.

EHT Pool contract is not stoppable.

## Deployed at  KOVAN
ETHPool deployed to: 0x447Ca2Dccfd0f1D88AE7984fAc85574EF551d05f with Team address: 0x45756fED107d0aEA575a2dc0d49a1c5156b0b796

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
