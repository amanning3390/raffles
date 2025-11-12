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

✅ **ETH Raffles**: Native ETH prize raffles
✅ **Customizable Parameters**: Entry fees, max entries, duration, winners
✅ **Provably Fair**: Random winner selection using block data
✅ **Platform Fees**: 0.5% fee for sustainability
✅ **Emergency Cancellation**: Creators can cancel if no entries

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

## Roadmap

### Phase 2.1 (Current)
- [x] ETH raffle support
- [x] Basic winner selection
- [x] Entry and claiming logic

### Phase 2.2
- [ ] ERC-721 (NFT) raffle support
- [ ] ERC-20 (Token) raffle support
- [ ] Token-gating support

### Phase 2.3
- [ ] Chainlink VRF integration
- [ ] Multi-asset bundle raffles
- [ ] Allowlist support

## License

MIT
