# 🎟️ Raffles - Non-Custodial Raffle Platform on Base

A fully decentralized, non-custodial raffle application built on Base (Coinbase's Layer 2). Raffle **anything** on-chain - ETH, ERC-20 tokens, or NFTs - with complete transparency and zero platform custody.

## 🔒 Core Principles

- **100% Non-Custodial**: All funds locked in smart contracts. Platform has ZERO custody.
- **No KYC Required**: Wallet-only authentication. Fully pseudonymous and privacy-first.
- **Provably Fair**: All raffle mechanics verifiable on-chain with transparent winner selection.
- **Multi-Asset Support**: Raffle ETH, any ERC-20 token, or any ERC-721 NFT on Base.

## ✨ Features

### For Creators
- ✅ Create raffles for ETH, any ERC-20 token, or any NFT
- ✅ Customizable parameters (entry fee, max entries, duration, winner count)
- ✅ Multiple winner support (1-10 winners per raffle)
- ✅ Automatic prize distribution to winners
- ✅ Entry fee collection (minus 0.5% platform fee)
- ✅ Cancel raffles with full refunds if needed

### For Participants
- ✅ Browse active raffles with filtering (All/ETH/Tokens/NFTs)
- ✅ Enter raffles with customizable entry count
- ✅ View live raffle stats and progress
- ✅ Automatic winner selection using provably fair randomness
- ✅ Direct prize claiming from smart contract
- ✅ Full refunds if raffle is cancelled

### Platform Features
- ✅ Modern, responsive UI with dark mode support
- ✅ Real-time raffle statistics
- ✅ User dashboard with created/entered/won raffles
- ✅ Wallet-based authentication (Coinbase Smart Wallet, MetaMask, WalletConnect)
- ✅ Toast notifications for transaction feedback
- ✅ Loading states and error handling

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router, React 19, TypeScript)
- Tailwind CSS v4 with custom design system
- OnchainKit (Coinbase's Base SDK)
- Wagmi v2 + Viem (Web3 interactions)
- TanStack Query (State management)

**Smart Contracts:**
- Solidity 0.8.24
- Foundry (Development framework)
- Multi-asset support (ETH, ERC-20, ERC-721)
- Non-custodial architecture
- Provably fair winner selection

**Deployment:**
- Vercel (Frontend hosting)
- Base Sepolia (Testnet)
- Base Mainnet (Production - coming soon)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- A Web3 wallet (Coinbase Wallet recommended)
- Base Sepolia ETH for testing (free from faucet)

### 1. Install Dependencies

```bash
npm install
```

### 2. Deploy Smart Contract

**IMPORTANT**: You must deploy the smart contract first before running the frontend.

See detailed instructions in:
- **Quick Guide**: `DEPLOYMENT_CHECKLIST.md`
- **Full Guide**: `contracts/DEPLOYMENT.md`

**Quick deployment:**
```bash
cd contracts
cp .env.example .env
# Edit .env with your private key and API keys
forge build
./deploy.sh
```

### 3. Configure Frontend

After deploying the contract, configure the frontend:

**Option A - Interactive Setup (Recommended):**
```bash
npm run setup
# Or: ./scripts/post-deploy-setup.sh
```

**Option B - Manual Setup:**
```bash
cp .env.example .env.local
# Edit .env.local and add:
# - Your deployed contract address
# - Alchemy API key
# - CDP API key
# - WalletConnect project ID
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Required API Keys

Get these API keys (all free tier available):

1. **Alchemy API Key** (Required)
   - Sign up: https://www.alchemy.com/
   - Create a Base Sepolia app
   - Copy API key to `NEXT_PUBLIC_ALCHEMY_API_KEY`

2. **Coinbase Developer Platform (CDP) API Key** (Required)
   - Sign up: https://portal.cdp.coinbase.com/
   - Create project
   - Copy API key to `NEXT_PUBLIC_CDP_API_KEY`

3. **WalletConnect Project ID** (Required)
   - Sign up: https://cloud.reown.com/
   - Create project
   - Copy project ID to `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

4. **Basescan API Key** (Optional, for contract verification)
   - Sign up: https://basescan.org/apis
   - Create API key

## 🏗️ Project Structure

```
raffles/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Homepage (raffle browser)
│   ├── create/                   # Create raffle flow
│   ├── raffle/[id]/             # Individual raffle detail
│   └── profile/[address]/       # User dashboard
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── error-boundary.tsx
│   ├── raffle/                  # Raffle-specific components
│   ├── wallet/                  # Wallet components
│   └── Navbar.tsx               # Navigation
├── contracts/                    # Smart contracts
│   ├── src/                     # Solidity source files
│   │   ├── RaffleCore.sol      # Main raffle contract
│   │   └── interfaces/         # Contract interfaces
│   ├── script/                  # Deployment scripts
│   ├── test/                    # Contract tests
│   └── DEPLOYMENT.md            # Deployment guide
├── hooks/                        # React hooks
│   └── useRaffleContract.ts    # Contract interaction hooks
├── lib/                          # Utility libraries
│   ├── contract.ts              # Contract ABI and config
│   ├── wagmi.ts                 # Wagmi configuration
│   └── neynar.ts                # Farcaster config (optional)
├── scripts/                      # Helper scripts
│   └── post-deploy-setup.sh    # Post-deployment setup
├── DEPLOYMENT_CHECKLIST.md      # Step-by-step deployment
└── README.md                     # This file
```

## 📋 Development Status

**Phase 1: Foundation** ✅ Complete
- [x] Next.js 14 setup with TypeScript
- [x] Tailwind CSS v4 configuration
- [x] Wagmi + OnchainKit integration
- [x] Wallet connection (Coinbase, MetaMask, WalletConnect)
- [x] Network switching (Base/Sepolia)
- [x] Neynar SDK setup (optional Farcaster integration)

**Phase 2: Smart Contracts** ✅ Complete
- [x] RaffleCore.sol with multi-asset support
- [x] ETH raffle functionality
- [x] ERC-20 token raffle functionality
- [x] ERC-721 NFT raffle functionality
- [x] Provably fair winner selection
- [x] Non-custodial architecture (no backdoors)
- [x] Deployment scripts and documentation

**Phase 3: Core App Features** ✅ Complete
- [x] Homepage with raffle browser and filters
- [x] Create raffle flow (multi-step form)
- [x] Raffle detail page with entry flow
- [x] User dashboard (created/entered/won)
- [x] Contract interaction hooks
- [x] Loading states and skeletons
- [x] Error handling and boundaries
- [x] Toast notification system
- [x] Responsive design with dark mode

**Phase 4: Testing & Deployment** 🔄 In Progress
- [ ] Deploy to Base Sepolia testnet
- [ ] Integration testing with live contracts
- [ ] User acceptance testing
- [ ] Bug fixes and optimizations

**Phase 5: Advanced Features** 📋 Planned
- [ ] Raffle discovery and search
- [ ] Token/NFT metadata display
- [ ] Raffle analytics and charts
- [ ] Social sharing (Farcaster frames)
- [ ] Email notifications (optional)
- [ ] Raffle templates

**Phase 6: Production Launch** 📋 Planned
- [ ] Security audit
- [ ] Deploy to Base Mainnet
- [ ] Production monitoring
- [ ] Documentation and guides
- [ ] Community launch

## 📄 License

MIT

## 🤝 Contributing

This is an open-source project. Contributions are welcome!

## ⚠️ Disclaimer

This application is provided as-is. Users are responsible for:
- Compliance with local laws regarding raffles/contests
- Understanding blockchain transactions are irreversible
- Securing their own private keys and wallets

No KYC is performed by this platform. Use at your own risk.
