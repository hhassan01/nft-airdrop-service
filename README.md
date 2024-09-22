# NFT Airdrop and Signature Verification Service

This project implements core functionalities for **EIP712 signature verification**, **NFT holding checks**, and **ERC20 token airdrops** on the Ethereum mainnet. It provides a service for validating users through cryptographic signatures, retrieving their NFT holdings, and distributing airdrops based on specific NFT ownership criteria.

The project includes a mock database that can be run locally using Docker, with the ability to customize and extend functionality according to best practices.

## Features

### 1. EIP712 Signature Verification Guard
- Implements a middleware/guard that verifies a user's **EIP712 signature** by recovering their Ethereum address and matching it with the address stored in the database.
- This feature ensures that only users with valid signatures are allowed to proceed with certain operations.
- You can reuse this guard across other services within the project.

### 2. NFT Holding Service
- A service that checks the NFT holdings of a user on the **Ethereum mainnet**.
- Retrieves and stores the user's wallet address, the NFT contract address, token IDs, and the total balance of NFTs held for each contract.
- Can be integrated with external libraries, APIs, or SDKs to fetch the user's NFT holdings.
- Focuses on the following NFT collections:
  - **Bored Ape Yacht Club**: `0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`
  - **Pudgy Penguins**: `0xBd3531dA5CF5857e7CfAA92426877b022e612cf8`
  - **Azuki**: `0xED5AF388653567Af2F388E6224dC7C4b3241C544`

### 3. Airdrop Service
- An endpoint that checks if a user holds specific NFTs to qualify for an airdrop.
- If the user meets the criteria, they are awarded **100 ERC20 tokens** from a specified wallet on the Ethereum mainnet.
- For this project, the airdrop checks the ownership of **Bored Ape Yacht Club** NFTs and sends tokens from **ApeCoin** (`0x4d224452801ACEd8B2F0aebE155379bb5D594381`).

**Note**: This implementation assumes that the airdrop is distributed from a company-controlled wallet, without escrow logic.

## Installation

To set up the project, follow these steps:

1. Install dependencies:
   ```bash
   $ yarn install
   ```

2. Run the mock database using Docker:
   ```bash
   cd docker-test-database
   docker compose up
   ```

3. To view the contents of the database:
   - Open **pgAdmin** at `localhost:8000`.
   - Add a new server with the following details:
     - **Name**: Nft Airdrops
     - **Host**: `airdrops_db`
     - **Username**: `airdrops`
     - **Password**: `password`

## Running the Application

- For development:
  ```bash
  $ yarn run start
  ```

- For watch mode:
  ```bash
  $ yarn run start:dev
  ```

- For production:
  ```bash
  $ yarn run start:prod
  ```
