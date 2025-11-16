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
- OnchainKit v1.1+ (Coinbase's Base SDK for wallet, identity, transactions)
- Wagmi v2 + Viem (Web3 interactions)
- TanStack Query (State management and caching)
- Neynar SDK (Optional Farcaster integration)

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

## 🔧 OnchainKit Setup

This app uses OnchainKit for wallet connection, identity display, and transaction handling. OnchainKit is pre-configured but requires proper API keys.

### Configuration

OnchainKit is configured in `components/Providers.tsx` with:
- **Chain**: Base (mainnet) and Base Sepolia (testnet)
- **Wallet Support**: Coinbase Smart Wallet (preferred), MetaMask, WalletConnect
- **Features**: Identity (ENS/Basename), Avatar, Address display, Transaction components

### Required Environment Variables

```bash
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key_here
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### Key Features Used

1. **Wallet Components**: `ConnectWallet`, `WalletDropdown`, `WalletDropdownDisconnect`
2. **Identity Components**: `Avatar`, `Name`, `Address`, `EthBalance`, `Badge`
3. **Transaction Components**: `Transaction`, `TransactionButton`, `TransactionStatus`
4. **Smart Wallet**: Coinbase Smart Wallet with gasless transactions (when available)

For detailed OnchainKit usage, see `ONCHAINKIT_GUIDE.md`.

## 🎭 Neynar SDK Setup (Optional)

Neynar SDK enables Farcaster integration for social features. This is completely optional - the app works without it.

### What You Get With Neynar

- **SIWN Authentication**: Sign In With Neynar for Farcaster identity
- **User Profiles**: Display Farcaster usernames, avatars, and bios
- **Social Context**: Show Farcaster verification status
- **Enhanced UX**: Link wallet addresses to Farcaster identities

### Setup Steps

1. **Get API Keys**:
   ```bash
   # Sign up at https://neynar.com/
   # Create a project
   # Get your API key and Client ID
   ```

2. **Add to Environment**:
   ```bash
   NEYNAR_API_KEY=your_neynar_api_key_here
   NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_neynar_client_id_here
   ```

3. **Restart Dev Server**:
   ```bash
   npm run dev
   ```

### Graceful Degradation

If Neynar keys are not configured:
- App continues to work normally
- Farcaster features are hidden
- Wallet-only authentication is used
- No errors or warnings shown to users

For detailed Neynar integration, see `NEYNAR_GUIDE.md`.

## 🔑 Required API Keys

Get these API keys (all free tier available):

### Required Keys

1. **Alchemy API Key** (Required)
   - Sign up: https://www.alchemy.com/
   - Create a Base Sepolia app
   - Copy API key to `NEXT_PUBLIC_ALCHEMY_API_KEY`
   - Used for: RPC endpoints and blockchain data

2. **Coinbase Developer Platform (CDP) API Key** (Required)
   - Sign up: https://portal.cdp.coinbase.com/
   - Create project
   - Copy API key to `NEXT_PUBLIC_CDP_API_KEY`
   - Used for: OnchainKit features (wallet, identity, transactions)

3. **WalletConnect Project ID** (Required)
   - Sign up: https://cloud.reown.com/
   - Create project
   - Copy project ID to `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - Used for: WalletConnect wallet connections

### Optional Keys (For Enhanced Features)

4. **Neynar API Key** (Optional)
   - Sign up: https://neynar.com/
   - Create project and get API key
   - Copy API key to `NEYNAR_API_KEY`
   - Copy client ID to `NEXT_PUBLIC_NEYNAR_CLIENT_ID`
   - Used for: Farcaster integration (SIWN authentication, user profiles)
   - Note: App works without this - Farcaster features will be disabled

5. **Basescan API Key** (Optional)
   - Sign up: https://basescan.org/apis
   - Create API key
   - Used for: Contract verification on Basescan

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

## 🔍 Troubleshooting

### Wallet Connection Issues

**Problem**: "Wallet connection failed" or "Network error"
- **Solution**: Ensure you're on Base Sepolia network. Click network switcher in wallet UI.
- **Solution**: Check that `NEXT_PUBLIC_ALCHEMY_API_KEY` is set correctly.
- **Solution**: Try disconnecting and reconnecting your wallet.

**Problem**: "Unsupported network"
- **Solution**: Switch to Base Sepolia in your wallet or use the network switcher in the app.

**Problem**: Coinbase Smart Wallet not appearing
- **Solution**: Ensure `NEXT_PUBLIC_CDP_API_KEY` is set correctly.
- **Solution**: Clear browser cache and reload.

### Transaction Issues

**Problem**: "Transaction failed" or "Insufficient funds"
- **Solution**: Ensure you have enough ETH for gas fees on Base Sepolia.
- **Solution**: Get free testnet ETH from Base Sepolia faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

**Problem**: Transaction stuck in pending
- **Solution**: Check transaction on Basescan: https://sepolia.basescan.org/
- **Solution**: Wait a few minutes - Base Sepolia can be slow during high traffic.

**Problem**: "Contract not deployed" error
- **Solution**: Ensure you deployed the smart contract first (see `contracts/DEPLOYMENT.md`).
- **Solution**: Verify `NEXT_PUBLIC_RAFFLE_CORE_ADDRESS` matches your deployed contract.

### OnchainKit Issues

**Problem**: Identity components not showing ENS/Basename
- **Solution**: This is normal - not all addresses have ENS/Basename. Address will be shown instead.

**Problem**: "CDP API key invalid"
- **Solution**: Verify your CDP API key at https://portal.cdp.coinbase.com/
- **Solution**: Ensure key is set as `NEXT_PUBLIC_CDP_API_KEY` (with NEXT_PUBLIC_ prefix).

**Problem**: Transaction component not rendering
- **Solution**: Check browser console for errors.
- **Solution**: Ensure wallet is connected before attempting transactions.

### Neynar/Farcaster Issues

**Problem**: "Farcaster authentication failed"
- **Solution**: Ensure `NEYNAR_API_KEY` and `NEXT_PUBLIC_NEYNAR_CLIENT_ID` are set.
- **Solution**: Verify your Neynar API key is active at https://neynar.com/

**Problem**: Farcaster profile not loading
- **Solution**: This is normal if the wallet address is not linked to a Farcaster account.
- **Solution**: Check that the user has verified their address on Farcaster.

**Problem**: SIWN signature verification failed
- **Solution**: Ensure you're signing with the same wallet that's connected.
- **Solution**: Try disconnecting and reconnecting your wallet.

### Build/Development Issues

**Problem**: "Module not found" errors
- **Solution**: Run `npm install` to ensure all dependencies are installed.
- **Solution**: Delete `node_modules` and `.next`, then run `npm install` again.

**Problem**: TypeScript errors
- **Solution**: Run `npm run build` to see full error details.
- **Solution**: Ensure you're using Node.js 18+ and latest npm.

**Problem**: Environment variables not loading
- **Solution**: Ensure `.env.local` exists (not `.env`).
- **Solution**: Restart dev server after changing environment variables.
- **Solution**: Verify all `NEXT_PUBLIC_*` variables are prefixed correctly.

### Getting Help

- Check detailed guides: `ONCHAINKIT_GUIDE.md` and `NEYNAR_GUIDE.md`
- Review contract deployment: `contracts/DEPLOYMENT.md`
- Check deployment checklist: `DEPLOYMENT_CHECKLIST.md`
- Open an issue on GitHub with error details

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
