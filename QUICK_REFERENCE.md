# 🚀 Quick Reference Guide

Ultra-concise guide for experienced developers. For detailed instructions, see `ACTION_ITEMS.md`.

---

## 📦 Prerequisites

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Clone and install
git clone <repo>
cd raffles
npm install
```

---

## 💰 Get Test Funds

1. **Base Sepolia ETH**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
2. Need ~0.001-0.002 ETH for deployment

---

## 🔑 API Keys Needed

| Service | URL | Purpose |
|---------|-----|---------|
| Alchemy | https://www.alchemy.com/ | RPC endpoint |
| CDP | https://portal.cdp.coinbase.com/ | OnchainKit |
| WalletConnect | https://cloud.reown.com/ | Wallet connections |
| BaseScan | https://basescan.org/apis | Contract verification (optional) |

---

## 📝 Contract Deployment

```bash
# Configure environment
cd contracts
cp .env.example .env
# Edit .env with your private key and API keys

# Build contracts
forge build

# Deploy to Base Sepolia
source .env
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  -vvvv

# Or use helper script
./deploy.sh

# SAVE THE CONTRACT ADDRESS!
```

---

## 🎨 Frontend Configuration

```bash
# Return to project root
cd ..

# Option A: Automated setup
npm run setup

# Option B: Manual setup
cp .env.example .env.local
# Edit .env.local with your values
```

### Required `.env.local` Values:

```bash
NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_CHAIN_ID=84532  # Base Sepolia
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_CDP_API_KEY=your_cdp_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_wc_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Test Locally

```bash
# Start dev server
npm run dev

# Open browser
# http://localhost:3000

# Connect wallet (MetaMask on Base Sepolia)
# Create test raffle
# Enter raffle
# Verify all features work
```

---

## 🌐 Deploy to Production (Optional)

### Vercel Deployment:

1. Push to GitHub
2. Import to Vercel: https://vercel.com/
3. Add environment variables (same as `.env.local`)
4. Deploy

---

## 📋 Quick Test Raffle Parameters

For testing your first raffle:

```
Asset Type: ETH
Prize Amount: 0.01 ETH
Entry Fee: 0.001 ETH
Max Entries: 10
Max Per Wallet: 5
Duration: 24 hours
Winners: 1
```

---

## 🔗 Important URLs

**Base Sepolia**:
- Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- Explorer: https://sepolia.basescan.org/
- RPC: https://sepolia.base.org
- Chain ID: 84532

**Base Mainnet** (future):
- Explorer: https://basescan.org/
- RPC: https://mainnet.base.org
- Chain ID: 8453

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| `forge: command not found` | Install Foundry |
| `insufficient funds` | Get more Sepolia ETH |
| `nonce too low` | Wait and retry |
| Contract not found in UI | Check contract address in `.env.local` |
| Wallet won't connect | Refresh page, switch to Base Sepolia |
| Transaction reverts | Verify parameters and ETH balance |

---

## 📞 Full Documentation

- **Step-by-step guide**: `ACTION_ITEMS.md`
- **Deployment details**: `DEPLOYMENT_CHECKLIST.md`
- **Contract guide**: `contracts/DEPLOYMENT.md`
- **Project overview**: `README.md`

---

## ✅ Deployment Checklist

- [ ] Foundry installed
- [ ] Test wallet with Sepolia ETH
- [ ] All API keys obtained
- [ ] Contract deployed & verified
- [ ] Frontend configured
- [ ] Local testing complete
- [ ] (Optional) Production deployment

---

**Estimated Time**: 30-60 minutes for experienced developers

**Support**: See `ACTION_ITEMS.md` for detailed troubleshooting
