# Smart Contract Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Install Foundry (on your local machine)
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Get Test ETH
Visit the Base Sepolia faucet and get test ETH:
- **Coinbase Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **Alchemy Faucet**: https://www.alchemy.com/faucets/base-sepolia

You'll need approximately **0.001-0.002 ETH** for deployment.

### 3. Get API Keys (Optional but recommended)
- **Basescan API Key**: https://basescan.org/apis (for contract verification)
- **Alchemy RPC**: https://www.alchemy.com/ (optional, better RPC than public)

## 🚀 Deployment Steps

### Step 1: Configure Environment

Navigate to the contracts directory:
```bash
cd contracts
```

Create your `.env` file from the example:
```bash
cp .env.example .env
```

Edit `.env` with your details:
```bash
# Your wallet private key (the one with Base Sepolia ETH)
PRIVATE_KEY=0x...your_private_key_here

# RPC URL (can use default or Alchemy)
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
# Or with Alchemy: https://base-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Basescan API key (for verification)
BASESCAN_API_KEY=your_basescan_api_key_here
```

### Step 2: Build Contracts

```bash
forge build
```

Expected output:
```
[⠢] Compiling...
[⠆] Compiling 3 files with Solc 0.8.24
Compiler run successful!
```

### Step 3: Test Contracts (Optional but recommended)

```bash
forge test -vvv
```

### Step 4: Deploy to Base Sepolia

```bash
source .env
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  -vvvv
```

**Or use the helper script:**
```bash
./deploy.sh
```

### Step 5: Save Contract Address

After successful deployment, you'll see:
```
====================================
RaffleCore deployed to: 0x1234567890abcdef...
Deployer: 0xYourAddress...
====================================
```

**IMPORTANT**: Copy this contract address! You'll need it for the next steps.

## 🔗 Post-Deployment Steps

### Step 6: Verify Contract (if auto-verify failed)

```bash
forge verify-contract \
  YOUR_CONTRACT_ADDRESS \
  src/RaffleCore.sol:RaffleCore \
  --chain-id 84532 \
  --etherscan-api-key $BASESCAN_API_KEY
```

### Step 7: Update Frontend Configuration

Back in the main project directory:

1. Create/update `.env.local`:
```bash
cd ..  # Back to project root
cp .env.example .env.local
```

2. Edit `.env.local` and update:
```bash
# Smart Contract Address - UPDATE THIS!
NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0x...YOUR_DEPLOYED_ADDRESS

# Use Base Sepolia testnet
NEXT_PUBLIC_CHAIN_ID=84532

# Your Alchemy API key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# OnchainKit / Coinbase Developer Platform key
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Step 8: Test on BaseScan

1. Visit: https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
2. Click "Contract" tab → should show verified source code
3. Click "Read Contract" → test `totalRaffles()` (should return 0)
4. Click "Write Contract" → connect wallet and test creating a raffle

### Step 9: Test Frontend Integration

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3000
3. Connect your wallet (must be on Base Sepolia network)
4. Try creating a test raffle
5. Try entering the raffle
6. Test all flows

## 🧪 Create Test Raffle

Use these test parameters for your first raffle:

**Simple ETH Raffle:**
- Prize: 0.01 ETH
- Entry Fee: 0.001 ETH
- Max Entries: 10
- Duration: 24 hours
- Winners: 1

**On BaseScan Write Contract interface:**
```
assetType: 0 (ETH)
assetContract: 0x0000000000000000000000000000000000000000
assetTokenId: 0
assetAmount: 10000000000000000 (0.01 ETH in wei)
entryFee: 1000000000000000 (0.001 ETH in wei)
maxEntries: 10
maxEntriesPerWallet: 5
duration: 86400 (24 hours in seconds)
winnerCount: 1

payableAmount: 10000000000000000 (0.01 ETH)
```

## 🎯 Quick Commands Reference

**Check your wallet balance:**
```bash
cast balance YOUR_ADDRESS --rpc-url $BASE_SEPOLIA_RPC_URL
```

**Check deployment transaction:**
```bash
cast receipt TX_HASH --rpc-url $BASE_SEPOLIA_RPC_URL
```

**Call contract (read totalRaffles):**
```bash
cast call CONTRACT_ADDRESS "totalRaffles()" --rpc-url $BASE_SEPOLIA_RPC_URL
```

**Get contract bytecode:**
```bash
cast code CONTRACT_ADDRESS --rpc-url $BASE_SEPOLIA_RPC_URL
```

## ❌ Troubleshooting

### "insufficient funds for gas"
- Get more Base Sepolia ETH from faucets
- Check balance: `cast balance YOUR_ADDRESS --rpc-url $BASE_SEPOLIA_RPC_URL`

### "invalid private key"
- Ensure private key starts with `0x`
- Don't use quotes in `.env` file
- Export private key from MetaMask: Settings → Security → Export Private Key

### "nonce too low"
- Your wallet has a pending transaction
- Wait for it to complete or cancel it

### "contract creation code storage out of gas"
- Increase gas limit in deploy script
- Or use a different RPC endpoint (try Alchemy)

### Verification failed
- Wait a few minutes after deployment, then try manual verification
- Double-check Basescan API key is valid
- Ensure you're verifying on the correct network (Base Sepolia = chainId 84532)

## 🔒 Security Reminders

- ⚠️ **NEVER** commit `.env` files with real private keys
- ✅ Use a dedicated deployment wallet, not your main wallet
- ✅ Keep only small amounts of ETH in deployment wallet
- ✅ Test thoroughly on Sepolia before any mainnet deployment
- ✅ Consider a professional audit before deploying to mainnet
- ✅ Start with small-value raffles to test in production

## 📚 Resources

- **Base Sepolia Explorer**: https://sepolia.basescan.org/
- **Base Documentation**: https://docs.base.org/
- **Foundry Book**: https://book.getfoundry.sh/
- **Base Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **Alchemy**: https://www.alchemy.com/
- **WalletConnect**: https://cloud.reown.com/

## ✅ Deployment Complete Checklist

- [ ] Foundry installed
- [ ] Base Sepolia ETH acquired
- [ ] Contract built successfully
- [ ] Contract deployed to Base Sepolia
- [ ] Contract verified on BaseScan
- [ ] Contract address saved
- [ ] Frontend `.env.local` updated with contract address
- [ ] Test raffle created on BaseScan
- [ ] Frontend connects to wallet
- [ ] Can create raffle from UI
- [ ] Can enter raffle from UI
- [ ] Can view raffle details
- [ ] All pages working correctly

---

**Need help?** Check the full deployment guide in `DEPLOYMENT.md` or raise an issue.
