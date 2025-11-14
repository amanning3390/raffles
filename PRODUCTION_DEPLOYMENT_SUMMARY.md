# 🚀 Base Mainnet Production Deployment - Quick Summary

This is a condensed checklist for deploying to Base Mainnet. For detailed instructions, see `PRODUCTION_DEPLOYMENT.md`.

## ⚠️ Pre-Flight Checklist

- [ ] Tested on Base Sepolia testnet
- [ ] Security audit completed (recommended)
- [ ] All tests passing (`forge test`)
- [ ] Base Mainnet ETH in deployment wallet (~0.01-0.02 ETH)
- [ ] All API keys obtained (Alchemy, CDP, WalletConnect, Basescan)
- [ ] Using dedicated deployment wallet

---

## 📦 Phase 1: Smart Contract Deployment

### 1. Configure Environment
```bash
cd contracts
# Create/update .env with:
PRIVATE_KEY=0x...your_key
BASE_MAINNET_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
BASESCAN_API_KEY=your_key
```

### 2. Build & Test
```bash
forge build
forge test  # MUST PASS!
```

### 3. Deploy
```bash
# Option A: Use script (recommended)
./deploy-mainnet.sh

# Option B: Manual
source .env
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_MAINNET_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  --chain-id 8453 \
  -vvvv
```

### 4. Verify & Test
- [ ] Contract verified on Basescan: https://basescan.org/address/YOUR_ADDRESS
- [ ] Test transaction successful (create small test raffle)
- [ ] Save contract address securely

---

## 🎨 Phase 2: Frontend Configuration

### Update `.env.local`:
```bash
NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0x...YOUR_MAINNET_ADDRESS
NEXT_PUBLIC_CHAIN_ID=8453  # Base Mainnet
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key
NEXT_PUBLIC_CDP_API_KEY=your_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Raffles
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Test Locally:
```bash
npm run build
npm start
# Test all features work
```

---

## 🌐 Phase 3: Vercel Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Production deployment ready"
git push origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com/
2. Import your repository
3. Add all environment variables (from `.env.local`)
4. Deploy

### 3. Update App URL
- After deployment, update `NEXT_PUBLIC_APP_URL` in Vercel with actual URL

---

## ✅ Post-Deployment Verification

- [ ] Production site accessible
- [ ] Wallet connects successfully
- [ ] Network switches to Base Mainnet
- [ ] Can read contract data
- [ ] Can create raffle (test with small amount)
- [ ] Can enter raffle
- [ ] All pages work correctly
- [ ] Mobile responsive
- [ ] Monitoring set up

---

## 🔑 Required Environment Variables

### Contracts (`.env` in `contracts/`):
- `PRIVATE_KEY` - Deployment wallet private key
- `BASE_MAINNET_RPC_URL` - Base Mainnet RPC endpoint
- `BASESCAN_API_KEY` - For contract verification

### Frontend (`.env.local` in root):
- `NEXT_PUBLIC_RAFFLE_CORE_ADDRESS` - Deployed contract address
- `NEXT_PUBLIC_CHAIN_ID` - `8453` for Base Mainnet
- `NEXT_PUBLIC_ALCHEMY_API_KEY` - Alchemy API key
- `NEXT_PUBLIC_CDP_API_KEY` - Coinbase Developer Platform key
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID
- `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME` - App name
- `NEXT_PUBLIC_APP_URL` - Production URL

---

## 🔗 Important URLs

- **Base Mainnet Explorer:** https://basescan.org/
- **Base Documentation:** https://docs.base.org/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Alchemy Dashboard:** https://dashboard.alchemy.com/
- **WalletConnect Cloud:** https://cloud.reown.com/

---

## ⚠️ Critical Reminders

1. **Never commit `.env` files** with real private keys
2. **Use dedicated deployment wallet** with minimal funds
3. **Test thoroughly** on testnet before mainnet
4. **Start with small raffles** to build confidence
5. **Monitor contract** for suspicious activity
6. **Keep dependencies updated** for security

---

## 🆘 Quick Troubleshooting

**Deployment fails:**
- Check RPC URL is correct
- Verify sufficient ETH balance
- Check gas prices: https://basescan.org/gastracker

**Frontend build fails:**
- Verify all environment variables set in Vercel
- Check build logs for specific errors
- Test build locally first

**Contract not found:**
- Verify contract address is correct
- Check `NEXT_PUBLIC_CHAIN_ID=8453` (not 84532)
- Ensure environment variables are for Production environment

---

For detailed instructions, see `PRODUCTION_DEPLOYMENT.md`.

