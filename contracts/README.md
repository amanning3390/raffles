# Raffles Smart Contracts

Non-custodial raffle contracts built with Solidity for Base blockchain.

## Overview

This directory contains the smart contracts that power the Raffles platform. All contracts are designed to be:
- **Non-custodial**: No platform control over user funds
- **Transparent**: All raffle data on-chain
- **Secure**: Following best practices and security patterns

## Contracts

### Core Contracts

- **RaffleCore.sol**: Main raffle contract supporting ETH, ERC20, and ERC721 assets
- **IRaffle.sol**: Interface defining raffle functionality

### Key Features

✅ **Multi-Asset Support**: Raffle ANY asset on Base
  - **ETH**: Native ETH prize raffles
  - **ERC-20 Tokens**: Any token (USDC, WETH, custom tokens, etc.)
  - **ERC-721 NFTs**: Any NFT collection on Base
✅ **Customizable Parameters**: Entry fees, max entries, duration, winners
✅ **Provably Fair**: Random winner selection using block data
✅ **Platform Fees**: 0.5% fee for sustainability (ETH only)
✅ **Emergency Cancellation**: Creators can cancel if no entries
✅ **Non-Custodial**: Direct transfers via ERC-20/ERC-721 standard interfaces

## Development

### Prerequisites

Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Install Dependencies

```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts
forge install smartcontractkit/chainlink
forge install foundry-rs/forge-std
```

### Build

```bash
forge build
```

### Test

```bash
forge test
forge test -vvv  # Verbose output
forge coverage   # Coverage report
```

### Deploy to Base Sepolia

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### Deploy to Base Mainnet

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_MAINNET_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

## Security

### Auditing

Before mainnet deployment:
- [ ] Internal review
- [ ] Slither static analysis
- [ ] Professional audit (recommended for production)

Run Slither:
```bash
slither .
```

### Key Security Features

- ✅ Reentrancy guards
- ✅ No admin backdoors for user funds
- ✅ Immutable contracts (no upgradeable proxies)
- ✅ Direct user-to-contract interactions
- ✅ Emergency withdrawal for failed raffles

## Architecture

```
RaffleCore
├── createRaffle()    - Creator deposits prize
├── enterRaffle()     - Users pay entry fee
├── endRaffle()       - Anyone can end after time
├── claimPrize()      - Winners claim directly
└── cancelRaffle()    - Creator cancels (no entries only)
```

## Gas Optimization

- Batch entries supported
- Efficient storage packing
- Minimal external calls
- Optimized loops

## Supported Assets

### ETH Raffles
```solidity
// Creator deposits ETH when creating raffle
createRaffle({
    assetType: AssetType.ETH,
    assetAmount: 1 ether,
    // ... other params
}) payable
```

### ERC-20 Token Raffles (ANY token on Base)
```solidity
// Examples: USDC, WETH, DAI, or custom tokens
// Step 1: Approve contract to spend tokens
token.approve(raffleContract, amount);

// Step 2: Create raffle (contract pulls tokens)
createRaffle({
    assetType: AssetType.ERC20,
    assetContract: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913, // USDC on Base
    assetAmount: 100 * 10**6, // 100 USDC
    // ... other params
})
```

### ERC-721 NFT Raffles (ANY NFT collection)
```solidity
// Examples: Any NFT collection deployed on Base
// Step 1: Approve contract to transfer NFT
nft.approve(raffleContract, tokenId);
// OR setApprovalForAll(raffleContract, true);

// Step 2: Create raffle (contract pulls NFT)
createRaffle({
    assetType: AssetType.ERC721,
    assetContract: 0x..., // NFT contract address
    assetTokenId: 123,
    assetAmount: 1, // Always 1 for NFTs
    // ... other params
})
```

## Roadmap

### Phase 2 (Complete ✅)
- [x] ETH raffle support
- [x] ERC-721 (NFT) raffle support
- [x] ERC-20 (Token) raffle support
- [x] Winner selection and claiming logic
- [x] Multi-asset prize support

### Phase 3 (Next)
- [ ] Token-gating support (require NFT/token to enter)
- [ ] Chainlink VRF integration for high-value raffles
- [ ] Multi-asset bundle raffles
- [ ] Allowlist support (whitelist addresses)

## License

MIT
