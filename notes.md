- **For signatures** Implement a guard that takes a signature, recovers the address and checks if it matches the user's address in a db. We need ot provide the text, the domain, the signature and expected user wallet. You may or may not use this guard on the rest of the project.

- **For alchemy/web3 api** Implement an endpoint that given the user address that we got from guard, returns all of this user NFT Holdings for Ethereum for a list of NFT collections. 
    We need to provide the list of NFT collections and the user address.

- **For contract interaction** If the user holds 1 NFTs of our collection, implement an endpoint that will mint another NFT to its address or an ERC20. We provide abi, token gating address, contract to interact with and a private key. 