
## Description

Thank you for taking the time to go through this take home assignment. This is a Nest.js project with some basic structure, we set up a mock database that can be run inside of a docker container locally.

You can change anything on the project as you see fit to match best practices or personal preferences. Not all the tasks need to work end to end (especially the airdrop task, which would need to have actual escrow logic and a way to interact with the blockchain). The idea behind all of these tasks is to spark a technical conversation afterwards.

Following we will enumerate some of the tasks that we would like to see implemented on this project.

### Signatures

Implement a guard/middleware (your choosing) that takes a [EIP712 signature](https://eips.ethereum.org/EIPS/eip-712), recovers the address and checks if it matches the user's address in a db. If the user is on the db, then the function can continue. You can use this middleware/guard in any of the other tasks if you think that it makes sense to do so. You can use the module Authentication.

    We provide a message, domain, signature and expected wallet to test. 
    -Signature:0x510b43199699994167271a76d28c21b996e7679d7eec51245328502b3e8df26b719f7672f1cf521f87d97f7b6ebb6585c7794af38863954f56302d05986fe5291b
    - Expected wallet: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Note, this is anvil's default wallet #1, dont use this wallet ever for prod)
    - Message: "Enter your MML space here!"
    - Domain: {
    name: 'Somnia Network',
      version: '1',
      chainId: 11155111}
    - Types = {
      Message: [
      { name: 'contents', type: 'string' },],}

### Users

Implement a service that will check the NFT holding of a user on Ethereum mainnet. You can pick up the user from the db, or use the previous task's output to get their wallet. 

The nftHoldings type is empty, so you can design the structure that you think fits best. We would like to see the user's address, the token id and contract address of the NFTs that they hold and the total balance of NFTs that they hold per contract. 

You can use any library/API/SDK that you think is the best to check the NFT holdings of a user.

In case you dont know how to get all the NFTs from the user's wallet, it will be enough to ckeck the holdings from:

      - Bored Ape Yatch Club: 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D
      - Pudgy Penguins: 0xBd3531dA5CF5857e7CfAA92426877b022e612cf8
      - Azuki: 0xED5AF388653567Af2F388E6224dC7C4b3241C544

### Airdrop

Implement an endpoint that will check if the user has the required NFTs to participate in the airdrop. If the user has the required NFTs (on mainnet), then the function can continue and the user should receive 100 tokens (ERC20) (on mainnet). 

You can use the previous task's output to get the user's NFT holdings, or implement a separate middleware, guard or service to check if the user has the required NFTs. We provide the abi for both ERC721 and ERC20.

The NFT to check against is:
  - Bored Ape Yatch Club: 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D

The User should receive an airdrop from ApeCoin: 0x4d224452801ACEd8B2F0aebE155379bb5D594381.

Ideally we would do this interacting from an escrow contract, but this is out of the scope of the task so lets just assume that we are holding the funds in a company wallet 0x4d224452801ACEd8B2F0aebE155379bb5D594381 (dont use this wallet for prod, or anything else. This wallet its the first default wallet provided by Anvil and its Private Key is very well known)

The private key for the wallet is: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 (again, WARNING never send funds here, this is a widely known PK)


## Installation

```bash
$ yarn install
```
## Running the db
```bash
cd docker-test-database
```
```bash
docker compose up
```
If you want to see the contents of the db, you have an instance of pg admin on localhost:8000
You click on "Add a new server", name it as Somnia and then in connection:
- Host somnia_db
- username: somnia
- password: password
- save the connection

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

