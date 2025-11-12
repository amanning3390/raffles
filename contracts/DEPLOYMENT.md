# RaffleCore Deployment Guide

This guide will help you deploy the RaffleCore smart contract to Base Sepolia testnet.

## Prerequisites

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Get Base Sepolia ETH

You need Base Sepolia ETH to pay for deployment gas fees. Get it from:
- **Base Sepolia Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
- **Alchemy Faucet**: https://www.alchemy.com/faucets/base-sepolia
- **QuickNode Faucet**: https://faucet.quicknode.com/base/sepolia

You'll need approximately **0.001-0.002 ETH** for deployment.

### 3. Get Basescan API Key (Optional, for verification)

- Go to https://basescan.org/
- Sign up for a free account
- Navigate to API Keys section
- Create a new API key

## Step-by-Step Deployment

### Step 1: Set Up Environment Variables

```bash
cd contracts
cp .env.example .env
```

Edit `.env` and add:
```bash
# Your wallet private key (the one with Base Sepolia ETH)
PRIVATE_KEY=0x...your_private_key_here

# RPC URL (use default or get from Alchemy/Infura)
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# Basescan API key (for verification)
BASESCAN_API_KEY=your_basescan_api_key_here
```

⚠️ **IMPORTANT**: Never commit your `.env` file with real keys!

### Step 2: Build Contracts

```bash
forge build
```

You should see:
```
[⠢] Compiling...
[⠆] Compiling 3 files with 0.8.24
[⠰] Solc 0.8.24 finished in 2.15s
Compiler run successful!
```

### Step 3: Deploy to Base Sepolia

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY \
  -vvvv
```

Or use the simpler command if your `.env` is set up:
```bash
source .env
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

### Step 4: Save Contract Address

After deployment, you'll see:
```
====================================
RaffleCore deployed to: 0x1234567890abcdef1234567890abcdef12345678
Deployer: 0xYourAddress...
====================================
```

**Copy the contract address!** You'll need it for the frontend.

### Step 5: Verify on Basescan (if auto-verify failed)

If automatic verification failed, manually verify:

```bash
forge verify-contract \
  0x1234...YourContractAddress \
  src/RaffleCore.sol:RaffleCore \
  --chain-id 84532 \
  --etherscan-api-key $BASESCAN_API_KEY
```

### Step 6: Update Frontend Environment

Update `/home/user/raffles/.env.example` (and your actual `.env.local`):

```bash
# Smart Contract Addresses
NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0x1234...YourDeployedAddress
NEXT_PUBLIC_CHAIN_ID=84532  # Base Sepolia
```

### Step 7: Test Contract on Basescan

1. Go to https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
2. Click "Contract" tab
3. Click "Read Contract" - test `totalRaffles()` (should return 0)
4. Click "Write Contract" - connect your wallet
5. Try `createRaffle()` with test parameters

## Example Test Raffle

Create a simple ETH raffle to test:

**Parameters:**
```solidity
config: {
  creator: 0x0000... (will be set automatically)
  assetType: 0 (ETH)
  assetContract: 0x0000000000000000000000000000000000000000
  assetTokenId: 0
  assetAmount: 10000000000000000 (0.01 ETH in wei)
  entryFee: 1000000000000000 (0.001 ETH in wei)
  maxEntries: 10
  maxEntriesPerWallet: 5
  startTime: 1700000000 (current timestamp)
  endTime: 1700086400 (24 hours later)
  winnerCount: 1
  status: 0
}
```

**payableAmount (msg.value):** 10000000000000000 (0.01 ETH)

## Deployment to Base Mainnet

⚠️ **Only deploy to mainnet after:**
1. Thorough testing on Sepolia
2. Security audit (recommended)
3. Code review
4. Getting mainnet ETH (real money!)

```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $BASE_MAINNET_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  --etherscan-api-key $BASESCAN_API_KEY
```

## Troubleshooting

### Error: "insufficient funds"
- Get more Base Sepolia ETH from faucets
- Check your wallet balance: `cast balance YOUR_ADDRESS --rpc-url $BASE_SEPOLIA_RPC_URL`

### Error: "invalid private key"
- Make sure private key starts with `0x`
- Don't include quotes around the private key in `.env`

### Error: "contract creation failed"
- Check RPC URL is correct
- Try a different RPC provider (Alchemy, Infura, QuickNode)

### Verification failed
- Manually verify using `forge verify-contract` command above
- Check your Basescan API key is valid
- Wait a few minutes and try again

## Useful Commands

**Check deployment status:**
```bash
cast receipt TRANSACTION_HASH --rpc-url $BASE_SEPOLIA_RPC_URL
```

**Get contract code:**
```bash
cast code CONTRACT_ADDRESS --rpc-url $BASE_SEPOLIA_RPC_URL
```

**Call contract functions:**
```bash
cast call CONTRACT_ADDRESS "totalRaffles()" --rpc-url $BASE_SEPOLIA_RPC_URL
```

## Next Steps

After successful deployment:
1. ✅ Update frontend with contract address
2. ✅ Test creating a raffle from UI
3. ✅ Test entering a raffle
4. ✅ Test claiming prizes
5. ✅ Share with community for feedback

## Security Reminders

- 🔒 Never commit `.env` with real private keys
- 🔒 Use a dedicated deployment wallet (not your main wallet)
- 🔒 Test thoroughly on Sepolia before mainnet
- 🔒 Consider a professional audit for mainnet
- 🔒 Start with low-value raffles to test in production

## Resources

- **Base Sepolia Explorer**: https://sepolia.basescan.org/
- **Base Docs**: https://docs.base.org/
- **Foundry Book**: https://book.getfoundry.sh/
- **Base Faucet**: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
