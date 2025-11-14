# 📋 Base Mainnet Deployment Steps

This document outlines the exact steps needed to deploy the Raffles application to Base Mainnet production.

## Overview

The deployment process has **3 main phases**:

1. **Smart Contract Deployment** → Deploy `RaffleCore.sol` to Base Mainnet
2. **Frontend Configuration** → Configure environment variables for production
3. **Frontend Deployment** → Deploy Next.js app to Vercel

**Estimated Time:** 1-2 hours (depending on verification and testing)

---

## 🔷 Phase 1: Smart Contract Deployment

### Prerequisites

- [ ] Foundry installed (`forge --version`)
- [ ] Base Mainnet ETH in deployment wallet (~0.01-0.02 ETH)
- [ ] API keys: Alchemy, Basescan
- [ ] Dedicated deployment wallet (not your main wallet)

### Step 1.1: Get Base Mainnet ETH

You need real ETH on Base Mainnet for gas fees:

**Options:**
1. **Bridge from Ethereum:** https://bridge.base.org/
2. **Buy on Coinbase** and withdraw to Base network
3. **Use a DEX** on Base to swap tokens

**Amount needed:** ~0.01-0.02 ETH (for deployment + buffer)

### Step 1.2: Configure Contract Environment

```bash
cd contracts
```

Create or update `.env` file:

```bash
# Deployment wallet private key (MUST start with 0x)
PRIVATE_KEY=0x...your_private_key_here

# Base Mainnet RPC URL (use Alchemy for reliability)
BASE_MAINNET_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY

# Basescan API key (for contract verification)
BASESCAN_API_KEY=your_basescan_api_key_here
```

**⚠️ Security:**
- Never commit `.env` to git
- Use a dedicated wallet with minimal funds
- Store private key securely

### Step 1.3: Verify Wallet Balance

```bash
source .env
cast balance $(cast wallet address $PRIVATE_KEY) --rpc-url $BASE_MAINNET_RPC_URL
```

Should show at least 0.01 ETH.

### Step 1.4: Build Contracts

```bash
forge build
```

Expected: `Compiler run successful!`

### Step 1.5: Run Tests (CRITICAL)

```bash
forge test -vvv
```

**DO NOT SKIP:** All tests must pass before mainnet deployment.

### Step 1.6: Deploy to Base Mainnet

**Option A: Using deployment script (recommended)**

```bash
./deploy-mainnet.sh
```

The script will:
- Check prerequisites
- Verify wallet balance
- Run tests
- Deploy with verification

**Option B: Manual deployment**

```bash
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

**Key parameters:**
- `--chain-id 8453` = Base Mainnet
- `--verify` = Auto-verify on Basescan
- `-vvvv` = Verbose output

### Step 1.7: Save Contract Address

After deployment, you'll see:
```
====================================
RaffleCore deployed to: 0x1234...abcd
Deployer: 0xYourAddress...
====================================
```

**CRITICAL:** Save this address! You'll need it for frontend configuration.

### Step 1.8: Verify Contract on Basescan

1. Visit: https://basescan.org/address/YOUR_CONTRACT_ADDRESS
2. Check "Contract" tab shows verified source code
3. If not verified, manually verify:

```bash
forge verify-contract \
  YOUR_CONTRACT_ADDRESS \
  src/RaffleCore.sol:RaffleCore \
  --chain-id 8453 \
  --etherscan-api-key $BASESCAN_API_KEY \
  --compiler-version 0.8.24
```

### Step 1.9: Test Contract (Optional but Recommended)

Create a small test raffle on Basescan:

1. Go to: https://basescan.org/address/YOUR_CONTRACT_ADDRESS#writeContract
2. Connect wallet
3. Call `createRaffle` with minimal test parameters
4. Verify raffle was created

---

## 🎨 Phase 2: Frontend Configuration

### Step 2.1: Return to Project Root

```bash
cd ..  # Back to project root
```

### Step 2.2: Create/Update `.env.local`

Create `.env.local` in the project root:

```bash
# Smart Contract Configuration
NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0x...YOUR_MAINNET_CONTRACT_ADDRESS
NEXT_PUBLIC_CHAIN_ID=8453  # Base Mainnet (NOT 84532!)

# Base Mainnet RPC Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# OnchainKit / Coinbase Developer Platform
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Raffles

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Application URL (update after Vercel deployment)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional: Farcaster/Neynar
# NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_neynar_client_id
```

**Important:**
- `NEXT_PUBLIC_CHAIN_ID=8453` (Base Mainnet, not 84532 for Sepolia)
- Contract address is your **mainnet** deployment
- `NEXT_PUBLIC_APP_URL` will be updated after Vercel deployment

### Step 2.3: Test Production Build Locally

```bash
# Build production version
npm run build

# Test production server
npm start
```

**Test checklist:**
- [ ] App loads without errors
- [ ] Wallet connects
- [ ] Network shows Base Mainnet
- [ ] Can read contract data
- [ ] All pages work

---

## 🌐 Phase 3: Vercel Deployment

### Step 3.1: Prepare Repository

```bash
# Ensure .env.local is in .gitignore (should be by default)
git add .
git commit -m "Configure for Base Mainnet production"
git push origin main
```

### Step 3.2: Create Vercel Project

1. Go to: https://vercel.com/
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your `raffles` repository
5. Click "Import"

### Step 3.3: Configure Project Settings

Vercel should auto-detect Next.js. Verify:
- Framework Preset: **Next.js**
- Root Directory: `./`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Step 3.4: Add Environment Variables

In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0x...YOUR_MAINNET_ADDRESS
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
NEXT_PUBLIC_CDP_API_KEY=your_cdp_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Raffles
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:**
- Set these for **Production** environment
- You can also set for Preview/Development if needed
- `NEXT_PUBLIC_APP_URL` will be updated after first deployment

### Step 3.5: Deploy

1. Click "Deploy"
2. Wait 2-5 minutes for build
3. You'll get a URL like: `https://raffles-xyz.vercel.app`

### Step 3.6: Update App URL

After deployment:

1. Copy your Vercel URL
2. Go to Vercel → Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` with your actual URL
4. Redeploy (or push a new commit to trigger redeploy)

### Step 3.7: Configure Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration
4. Update `NEXT_PUBLIC_APP_URL` to custom domain

---

## ✅ Phase 4: Post-Deployment Verification

### Step 4.1: Production Testing

Test the live production site:

- [ ] **Homepage loads** - https://your-app.vercel.app
- [ ] **Wallet connection** - MetaMask, Coinbase Wallet, WalletConnect
- [ ] **Network detection** - Shows Base Mainnet
- [ ] **Contract reads** - Can see raffles, total count
- [ ] **Create raffle** - Test with small amount (0.001 ETH)
- [ ] **Enter raffle** - Can enter existing raffles
- [ ] **Raffle details** - Detail page shows correct info
- [ ] **User profile** - Profile page works
- [ ] **Mobile responsive** - Works on mobile
- [ ] **Error handling** - Errors display correctly

### Step 4.2: Monitor Deployment

1. **Vercel Logs:**
   - Dashboard → Deployments → View Function Logs

2. **Basescan:**
   - Monitor contract: https://basescan.org/address/YOUR_CONTRACT_ADDRESS
   - Watch for transactions and events

3. **Set up monitoring (recommended):**
   - Vercel Analytics
   - Error tracking (Sentry)
   - Alchemy Notify for contract events

---

## 🔑 Required API Keys & Services

### 1. Alchemy (RPC Provider)
- **URL:** https://www.alchemy.com/
- **Purpose:** Base Mainnet RPC endpoint
- **Free tier:** Yes
- **Needed for:** Contract deployment, frontend RPC calls

### 2. Basescan (Contract Verification)
- **URL:** https://basescan.org/apis
- **Purpose:** Contract verification on Basescan
- **Free tier:** Yes
- **Needed for:** Contract verification

### 3. Coinbase Developer Platform (CDP)
- **URL:** https://portal.cdp.coinbase.com/
- **Purpose:** OnchainKit integration
- **Free tier:** Yes
- **Needed for:** Wallet connections, smart wallet features

### 4. WalletConnect
- **URL:** https://cloud.reown.com/
- **Purpose:** WalletConnect protocol
- **Free tier:** Yes
- **Needed for:** Wallet connections

---

## 🔐 Security Checklist

### Before Deployment
- [ ] Security audit completed (recommended)
- [ ] All tests passing
- [ ] Tested on Base Sepolia
- [ ] Using dedicated deployment wallet
- [ ] Private keys secured (not in code)
- [ ] `.env` files in `.gitignore`

### After Deployment
- [ ] Contract verified on Basescan
- [ ] No sensitive data in environment variables
- [ ] HTTPS enabled (Vercel default)
- [ ] Security headers configured
- [ ] Monitoring set up

---

## 🆘 Troubleshooting

### Contract Deployment Fails

**"Insufficient funds"**
- Get more Base Mainnet ETH
- Check balance: `cast balance ADDRESS --rpc-url $BASE_MAINNET_RPC_URL`

**"Contract creation failed"**
- Check RPC URL is correct
- Try different RPC provider
- Check gas prices: https://basescan.org/gastracker

**"Verification failed"**
- Wait 1-2 minutes, then retry
- Verify compiler version matches
- Check Basescan API key

### Frontend Issues

**"Build failed on Vercel"**
- Check build logs
- Verify all environment variables set
- Test build locally first

**"Contract not found"**
- Verify `NEXT_PUBLIC_RAFFLE_CORE_ADDRESS` is correct
- Check `NEXT_PUBLIC_CHAIN_ID=8453` (not 84532)
- Ensure environment variables are for Production

**"RPC errors"**
- Verify `NEXT_PUBLIC_ALCHEMY_API_KEY` is correct
- Check Alchemy dashboard for issues
- Ensure API key has Base Mainnet access

---

## 📊 Network Information

### Base Mainnet
- **Chain ID:** 8453
- **RPC URL:** https://mainnet.base.org (public) or Alchemy/Infura
- **Explorer:** https://basescan.org/
- **Native Token:** ETH
- **Gas Token:** ETH

### Base Sepolia (Testnet)
- **Chain ID:** 84532
- **RPC URL:** https://sepolia.base.org (public)
- **Explorer:** https://sepolia.basescan.org/
- **Faucet:** https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

---

## 📝 Final Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit (recommended)
- [ ] Base Mainnet ETH acquired
- [ ] All API keys obtained
- [ ] Deployment wallet prepared

### Smart Contract
- [ ] Contracts built
- [ ] Deployed to Base Mainnet
- [ ] Contract verified on Basescan
- [ ] Test transaction successful
- [ ] Contract address saved

### Frontend
- [ ] `.env.local` configured
- [ ] Production build tested locally
- [ ] All environment variables set

### Vercel
- [ ] Repository pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] App URL updated

### Post-Deployment
- [ ] Production site accessible
- [ ] All features tested
- [ ] Monitoring set up
- [ ] Documentation updated

---

## 🎉 Success!

Your Raffles application is now live on Base Mainnet!

**Next Steps:**
- Monitor the deployment
- Gather user feedback
- Keep dependencies updated
- Consider security audits for high-value raffles
- Start with small raffles to build confidence

---

## 📚 Additional Resources

- **Full Deployment Guide:** `PRODUCTION_DEPLOYMENT.md`
- **Quick Summary:** `PRODUCTION_DEPLOYMENT_SUMMARY.md`
- **Base Documentation:** https://docs.base.org/
- **Vercel Documentation:** https://vercel.com/docs
- **Foundry Book:** https://book.getfoundry.sh/

---

**Need help?** Review the detailed guides or check the troubleshooting section above.

