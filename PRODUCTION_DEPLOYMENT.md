# 🚀 Production Deployment Guide - Base Mainnet

This guide covers all steps required to deploy the Raffles application to **Base Mainnet** for production use.

## ⚠️ Pre-Deployment Checklist

Before deploying to production, ensure you have:

- [ ] **Thoroughly tested on Base Sepolia testnet**
- [ ] **Security audit completed** (highly recommended for production)
- [ ] **Code review completed**
- [ ] **All tests passing** (`forge test`)
- [ ] **Base Mainnet ETH** in deployment wallet (for gas fees)
- [ ] **All API keys obtained** (Alchemy, CDP, WalletConnect, Basescan)
- [ ] **Backup deployment wallet** (use a dedicated wallet, not your main wallet)
- [ ] **Emergency response plan** (know how to pause/upgrade if needed)

## 📋 Deployment Overview

The deployment process consists of three main phases:

1. **Smart Contract Deployment** - Deploy RaffleCore to Base Mainnet
2. **Frontend Configuration** - Configure environment variables for production
3. **Frontend Deployment** - Deploy Next.js app to Vercel

---

## 🔷 Phase 1: Smart Contract Deployment to Base Mainnet

### Step 1.1: Prepare Deployment Environment

1. **Navigate to contracts directory:**
   ```bash
   cd contracts
   ```

2. **Create/update `.env` file:**
   ```bash
   # If .env doesn't exist, create it
   # If it exists, ensure it has Base Mainnet configuration
   ```

3. **Configure `.env` for Base Mainnet:**
   ```bash
   # Deployment wallet private key (MUST start with 0x)
   PRIVATE_KEY=0x...your_private_key_here
   
   # Base Mainnet RPC URL (use Alchemy for better reliability)
   BASE_MAINNET_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
   # Or use public RPC: https://mainnet.base.org
   
   # Basescan API key for contract verification
   BASESCAN_API_KEY=your_basescan_api_key_here
   ```

   ⚠️ **CRITICAL SECURITY NOTES:**
   - Use a **dedicated deployment wallet** with minimal funds
   - **NEVER** commit `.env` files to version control
   - Store private keys securely (consider using hardware wallet for large deployments)
   - Keep only enough ETH for deployment + buffer (0.01-0.02 ETH should be sufficient)

### Step 1.2: Verify You Have Base Mainnet ETH

Check your deployment wallet balance:
```bash
source .env
cast balance $(cast wallet address $PRIVATE_KEY) --rpc-url $BASE_MAINNET_RPC_URL
```

You'll need approximately **0.01-0.02 ETH** for:
- Contract deployment (~0.005 ETH)
- Contract verification (~0.0001 ETH)
- Buffer for gas price fluctuations

**Get Base Mainnet ETH:**
- Bridge from Ethereum: https://bridge.base.org/
- Buy on Coinbase and withdraw to Base
- Use a DEX on Base

### Step 1.3: Build Contracts

```bash
forge build
```

Expected output:
```
[⠢] Compiling...
[⠆] Compiling 3 files with Solc 0.8.24
Compiler run successful!
```

### Step 1.4: Run Tests (CRITICAL)

**DO NOT SKIP THIS STEP!** Run all tests before deploying to mainnet:

```bash
forge test -vvv
```

Ensure all tests pass. If any tests fail, **DO NOT PROCEED** until they are fixed.

### Step 1.5: Deploy to Base Mainnet

**Option A: Using the deployment script (recommended)**

First, update `deploy.sh` to support Base Mainnet, or use the manual command below.

**Option B: Manual deployment command**

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

**Important parameters:**
- `--chain-id 8453` - Base Mainnet chain ID
- `--verify` - Automatically verify contract on Basescan
- `-vvvv` - Verbose output for debugging

### Step 1.6: Save Contract Address

After successful deployment, you'll see output like:
```
====================================
RaffleCore deployed to: 0x1234567890abcdef1234567890abcdef12345678
Deployer: 0xYourAddress...
====================================
```

**CRITICAL:** Copy and securely store:
- Contract address
- Deployment transaction hash
- Deployer address

### Step 1.7: Verify Contract on Basescan

If automatic verification failed, manually verify:

```bash
forge verify-contract \
  YOUR_CONTRACT_ADDRESS \
  src/RaffleCore.sol:RaffleCore \
  --chain-id 8453 \
  --etherscan-api-key $BASESCAN_API_KEY \
  --compiler-version 0.8.24
```

**Verify on Basescan:**
1. Visit: https://basescan.org/address/YOUR_CONTRACT_ADDRESS
2. Check "Contract" tab shows verified source code
3. Test "Read Contract" → `totalRaffles()` (should return 0)

### Step 1.8: Test Contract on Mainnet

**Create a small test raffle** to verify everything works:

1. Go to: https://basescan.org/address/YOUR_CONTRACT_ADDRESS#writeContract
2. Connect your wallet
3. Use `createRaffle` with minimal test parameters:
   - Prize: 0.001 ETH (small amount for testing)
   - Entry Fee: 0.0001 ETH
   - Max Entries: 5
   - Duration: 1 hour
   - Winners: 1

**Success Criteria:**
- ✅ Transaction succeeds
- ✅ Raffle appears in `totalRaffles()`
- ✅ Can read raffle details
- ✅ Can enter raffle (test with second wallet)

---

## 🎨 Phase 2: Frontend Configuration for Production

### Step 2.1: Update Environment Variables

Create/update `.env.local` in the project root:

```bash
# Return to project root
cd ..

# Create .env.local if it doesn't exist
# Or update existing one
```

**Production `.env.local` configuration:**

```bash
# Smart Contract Configuration
NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0x...YOUR_DEPLOYED_MAINNET_ADDRESS
NEXT_PUBLIC_CHAIN_ID=8453  # Base Mainnet chain ID

# Base Mainnet RPC Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# OnchainKit / Coinbase Developer Platform
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Raffles

# WalletConnect Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Application URL (update after Vercel deployment)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional: Farcaster/Neynar Integration
# NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_neynar_client_id
```

**Key differences from testnet:**
- `NEXT_PUBLIC_CHAIN_ID=8453` (Base Mainnet, not 84532)
- Contract address is your **mainnet** deployment
- `NEXT_PUBLIC_APP_URL` should be your production domain

### Step 2.2: Verify Wagmi Configuration

The `lib/wagmi.ts` file should already support Base Mainnet. Verify it includes:

```typescript
chains: [base, baseSepolia],  // Both chains supported
```

In production, the app will default to `base` (mainnet) when `NODE_ENV=production`.

### Step 2.3: Test Locally with Production Config

```bash
# Set NODE_ENV to production for testing
NODE_ENV=production npm run dev
```

Or build and test production build:
```bash
npm run build
npm start
```

**Test checklist:**
- [ ] App loads without errors
- [ ] Wallet connects successfully
- [ ] Network switches to Base Mainnet
- [ ] Can read contract data (totalRaffles, etc.)
- [ ] Can create a test raffle (use minimal amounts!)
- [ ] Can enter a raffle
- [ ] All pages load correctly

---

## 🌐 Phase 3: Frontend Deployment to Vercel

### Step 3.1: Prepare Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Configure for Base Mainnet production deployment"
   git push origin main
   ```

2. **Ensure `.env.local` is in `.gitignore`** (should not be committed)

### Step 3.2: Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**

1. **Go to Vercel:** https://vercel.com/
2. **Sign in** with GitHub
3. **Import Project:**
   - Click "Add New" → "Project"
   - Select your `raffles` repository
   - Click "Import"

4. **Configure Project Settings:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Add Environment Variables:**
   Click "Environment Variables" and add each:
   ```
   NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0x...YOUR_MAINNET_ADDRESS
   NEXT_PUBLIC_CHAIN_ID=8453
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
   NEXT_PUBLIC_CDP_API_KEY=your_cdp_key
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id
   NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Raffles
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
   
   **Important:** Set these for **Production** environment (not Preview/Development)

6. **Deploy:**
   - Click "Deploy"
   - Wait 2-5 minutes for build to complete
   - You'll get a URL like: `https://raffles-xyz.vercel.app`

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Step 3.3: Update App URL Environment Variable

After deployment, update `NEXT_PUBLIC_APP_URL` in Vercel with your actual production URL:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL
3. Redeploy (or it will auto-update on next push)

### Step 3.4: Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

---

## ✅ Post-Deployment Verification

### Step 4.1: Production Testing Checklist

Test the live production deployment:

- [ ] **Homepage loads** - https://your-app.vercel.app
- [ ] **Wallet connection works** - Can connect MetaMask, Coinbase Wallet, WalletConnect
- [ ] **Network detection** - App detects Base Mainnet correctly
- [ ] **Contract reads work** - Can see total raffles, raffle list
- [ ] **Create raffle flow** - Can create a raffle (test with small amounts)
- [ ] **Enter raffle flow** - Can enter an existing raffle
- [ ] **Raffle detail page** - Shows correct information
- [ ] **User profile** - Can view profile with created/entered raffles
- [ ] **Mobile responsive** - Works on mobile devices
- [ ] **Error handling** - Errors display correctly
- [ ] **Transaction notifications** - Toast notifications work

### Step 4.2: Monitor Deployment

1. **Check Vercel logs:**
   - Vercel Dashboard → Your Project → Deployments → View Function Logs

2. **Monitor contract on Basescan:**
   - https://basescan.org/address/YOUR_CONTRACT_ADDRESS
   - Watch for transactions and events

3. **Set up monitoring (recommended):**
   - Vercel Analytics
   - Sentry for error tracking
   - Alchemy Notify for contract events

### Step 4.3: Security Verification

- [ ] Contract is verified on Basescan
- [ ] No sensitive data in environment variables (check Vercel settings)
- [ ] `.env` files not committed to git
- [ ] Private keys secured (not in code or environment)
- [ ] HTTPS enabled (Vercel default)
- [ ] Security headers configured (already in `vercel.json`)

---

## 🔧 Troubleshooting

### Contract Deployment Issues

**"Insufficient funds for gas"**
- Get more Base Mainnet ETH
- Check gas price: https://basescan.org/gastracker
- Wait for lower gas prices if needed

**"Contract creation failed"**
- Check RPC URL is correct
- Try different RPC provider (Alchemy, Infura, QuickNode)
- Increase gas limit if needed

**"Verification failed"**
- Wait 1-2 minutes after deployment, then retry
- Verify compiler version matches (0.8.24)
- Check Basescan API key is valid

### Frontend Deployment Issues

**"Build failed on Vercel"**
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify `package.json` scripts are correct
- Check for TypeScript errors locally first

**"Contract address not found"**
- Verify `NEXT_PUBLIC_RAFFLE_CORE_ADDRESS` is set in Vercel
- Check address is correct (Base Mainnet address, not testnet)
- Ensure environment variable is set for Production environment

**"Wallet connection issues"**
- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Check WalletConnect project is active
- Ensure `NEXT_PUBLIC_APP_URL` matches your Vercel domain

**"RPC errors"**
- Verify `NEXT_PUBLIC_ALCHEMY_API_KEY` is set correctly
- Check Alchemy dashboard for rate limits
- Ensure API key has Base Mainnet access

---

## 📊 Production Monitoring

### Recommended Monitoring Setup

1. **Vercel Analytics:**
   - Enable in Vercel Dashboard → Analytics
   - Monitor page views, performance, errors

2. **Error Tracking:**
   - Set up Sentry or similar
   - Track frontend errors and user issues

3. **Contract Monitoring:**
   - Alchemy Notify for contract events
   - Basescan watchlists for contract activity
   - Set up alerts for large transactions

4. **Performance Monitoring:**
   - Vercel Speed Insights
   - Monitor API response times
   - Track contract call performance

---

## 🔐 Security Best Practices

### Smart Contract Security

- ✅ **Audit completed** before mainnet deployment
- ✅ **Use dedicated deployment wallet** with minimal funds
- ✅ **Multi-sig for platform fee recipient** (if applicable)
- ✅ **Test thoroughly** on testnet first
- ✅ **Monitor contract** for suspicious activity

### Frontend Security

- ✅ **HTTPS only** (Vercel default)
- ✅ **Security headers** configured (in `vercel.json`)
- ✅ **No sensitive data** in client-side code
- ✅ **Environment variables** secured in Vercel
- ✅ **Regular dependency updates** for security patches

### Operational Security

- ✅ **Backup private keys** securely (hardware wallet recommended)
- ✅ **Document deployment process** for team
- ✅ **Access control** for Vercel and API accounts
- ✅ **Monitor for vulnerabilities** regularly

---

## 📝 Deployment Checklist Summary

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Testnet deployment successful
- [ ] Base Mainnet ETH acquired
- [ ] All API keys obtained
- [ ] Deployment wallet prepared

### Smart Contract Deployment
- [ ] Contracts built successfully
- [ ] Deployed to Base Mainnet
- [ ] Contract verified on Basescan
- [ ] Test transaction successful
- [ ] Contract address saved securely

### Frontend Configuration
- [ ] `.env.local` configured for production
- [ ] All environment variables set
- [ ] Local production build tested
- [ ] Wagmi configuration verified

### Vercel Deployment
- [ ] Repository pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] Deployment successful
- [ ] Custom domain configured (if applicable)

### Post-Deployment
- [ ] Production site accessible
- [ ] Wallet connection works
- [ ] Contract interactions work
- [ ] All features tested
- [ ] Monitoring set up
- [ ] Documentation updated

---

## 🆘 Emergency Procedures

### If Contract Has Critical Bug

1. **Immediate Actions:**
   - Document the issue
   - Assess impact (funds at risk?)
   - Notify users if necessary

2. **Options:**
   - Deploy new contract version (if possible)
   - Pause frontend (remove from Vercel)
   - Communicate with community

3. **Prevention:**
   - Always audit before mainnet
   - Test thoroughly on testnet
   - Start with small-value raffles

### If Frontend Has Issues

1. **Quick Fix:**
   - Revert to previous Vercel deployment
   - Or disable problematic features

2. **Long-term:**
   - Fix issue in development
   - Test thoroughly
   - Redeploy

---

## 📚 Additional Resources

- **Base Documentation:** https://docs.base.org/
- **Basescan:** https://basescan.org/
- **Vercel Documentation:** https://vercel.com/docs
- **Foundry Book:** https://book.getfoundry.sh/
- **Wagmi Documentation:** https://wagmi.sh/
- **OnchainKit Documentation:** https://onchainkit.xyz/

---

## 🎉 Success!

Once all steps are complete, your Raffles application is live on Base Mainnet! 

**Remember:**
- Monitor the deployment regularly
- Keep dependencies updated
- Respond to user feedback
- Consider security audits for high-value raffles
- Start with small raffles to build confidence

**Good luck with your production deployment! 🚀**

