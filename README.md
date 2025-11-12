# Raffles - Non-Custodial Raffle Platform on Base

A fully decentralized, non-custodial raffle application built on Base (Coinbase's Layer 2) with Farcaster integration.

## 🔒 Core Principles

- **Non-Custodial**: All funds locked in smart contracts. No platform custody.
- **No KYC**: Wallet-only authentication. Fully pseudonymous.
- **Transparent**: All raffle data verifiable on-chain.
- **Privacy-First**: Minimal data collection. No personal information required.

## 🚀 Features

- Create raffles for NFTs, ERC-20 tokens, or ETH
- Customizable raffle parameters (entry fee, duration, winner count)
- Token-gating options (require NFT/token ownership to enter)
- Farcaster social integration (optional)
- Provably fair winner selection
- Direct prize claiming from smart contracts

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS
- **Blockchain**: Base (Ethereum L2)
- **Web3**: OnchainKit, Wagmi, Viem
- **Social**: Neynar SDK (Farcaster)
- **Deployment**: Vercel
- **Smart Contracts**: Solidity (Foundry)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A wallet (Coinbase Wallet recommended)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your API keys:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔑 Required API Keys

- **Alchemy**: For Base RPC endpoint ([alchemy.com](https://www.alchemy.com/))
- **Neynar**: For Farcaster integration ([neynar.com](https://neynar.com/))
- **CDP API Key**: For OnchainKit ([portal.cdp.coinbase.com](https://portal.cdp.coinbase.com/))

## 🏗️ Project Structure

```
raffles/
├── app/              # Next.js App Router
├── components/       # React components
├── contracts/        # Smart contracts (Solidity)
├── lib/             # Utility functions
└── public/          # Static assets
```

## 🧪 Development Status

**Phase 1: Foundation** ✅ In Progress
- [x] Next.js setup
- [x] Tailwind CSS configuration
- [x] Basic project structure
- [ ] OnchainKit integration
- [ ] Neynar SDK integration
- [ ] Wallet connection

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
