#!/bin/bash

# RaffleCore Deployment Script for Base Mainnet
# Usage: ./deploy-mainnet.sh
#
# ⚠️ WARNING: This deploys to Base MAINNET with REAL ETH
# Only run this after thorough testing on Base Sepolia!

set -e

echo "⚠️  WARNING: BASE MAINNET DEPLOYMENT"
echo "======================================"
echo "This will deploy to Base MAINNET using REAL ETH"
echo ""

# Confirmation prompt
read -p "Have you thoroughly tested on Base Sepolia? (yes/no): " CONFIRM_TESTNET
if [ "$CONFIRM_TESTNET" != "yes" ]; then
    echo "❌ Please test on Base Sepolia first!"
    exit 1
fi

read -p "Have you completed a security audit? (yes/no): " CONFIRM_AUDIT
if [ "$CONFIRM_AUDIT" != "yes" ]; then
    echo "⚠️  WARNING: Deploying without audit is risky!"
    read -p "Continue anyway? (yes/no): " CONTINUE_ANYWAY
    if [ "$CONTINUE_ANYWAY" != "yes" ]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

read -p "Are you using a dedicated deployment wallet? (yes/no): " CONFIRM_WALLET
if [ "$CONFIRM_WALLET" != "yes" ]; then
    echo "❌ Use a dedicated wallet for deployment!"
    exit 1
fi

echo ""
echo "🚀 Proceeding with Base Mainnet deployment..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "   Run: cp .env.example .env"
    echo "   Then edit .env with your private key and BASE_MAINNET_RPC_URL"
    exit 1
fi

# Source environment variables
source .env

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env"
    exit 1
fi

# Check if Base Mainnet RPC URL is set
if [ -z "$BASE_MAINNET_RPC_URL" ]; then
    echo "❌ Error: BASE_MAINNET_RPC_URL not set in .env"
    echo "   Add: BASE_MAINNET_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY"
    exit 1
fi

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Error: Foundry not installed!"
    echo "   Install: curl -L https://foundry.paradigm.xyz | bash && foundryup"
    exit 1
fi

# Check wallet balance
DEPLOYER_ADDRESS=$(cast wallet address $PRIVATE_KEY)
BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url $BASE_MAINNET_RPC_URL)
BALANCE_ETH=$(cast --to-unit $BALANCE ether)

echo "✅ Environment loaded"
echo "📊 Deployer address: $DEPLOYER_ADDRESS"
echo "💰 Balance: $BALANCE_ETH ETH"
echo ""

# Check if balance is sufficient
MIN_BALANCE=10000000000000000  # 0.01 ETH in wei
if [ $(cast --to-unit $BALANCE wei) -lt $MIN_BALANCE ]; then
    echo "⚠️  WARNING: Balance may be insufficient for deployment"
    echo "   Recommended: At least 0.01 ETH"
    read -p "Continue anyway? (yes/no): " CONTINUE_LOW_BALANCE
    if [ "$CONTINUE_LOW_BALANCE" != "yes" ]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi

echo ""

# Build contracts
echo "📦 Building contracts..."
forge build
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi
echo "✅ Build successful"
echo ""

# Run tests
echo "🧪 Running tests..."
forge test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed! DO NOT DEPLOY!"
    exit 1
fi
echo "✅ All tests passed"
echo ""

# Final confirmation
echo "🚀 Ready to deploy to Base Mainnet"
echo "   Chain ID: 8453"
echo "   Network: Base Mainnet"
echo "   Deployer: $DEPLOYER_ADDRESS"
echo ""
read -p "Deploy now? (yes/no): " FINAL_CONFIRM
if [ "$FINAL_CONFIRM" != "yes" ]; then
    echo "Deployment cancelled."
    exit 1
fi

echo ""
echo "🚀 Deploying to Base Mainnet..."
echo ""

# Deploy
if [ -z "$BASESCAN_API_KEY" ]; then
    echo "⚠️  No BASESCAN_API_KEY found, skipping verification"
    forge script script/Deploy.s.sol:DeployScript \
        --rpc-url $BASE_MAINNET_RPC_URL \
        --private-key $PRIVATE_KEY \
        --broadcast \
        --chain-id 8453 \
        -vvvv
else
    echo "✅ Deploying with verification"
    forge script script/Deploy.s.sol:DeployScript \
        --rpc-url $BASE_MAINNET_RPC_URL \
        --private-key $PRIVATE_KEY \
        --broadcast \
        --verify \
        --etherscan-api-key $BASESCAN_API_KEY \
        --chain-id 8453 \
        -vvvv
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Copy the contract address from above"
echo "   2. Verify contract on Basescan: https://basescan.org/address/YOUR_ADDRESS"
echo "   3. Update ../.env.local with:"
echo "      NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=YOUR_ADDRESS"
echo "      NEXT_PUBLIC_CHAIN_ID=8453"
echo "   4. Test contract on Basescan"
echo "   5. Deploy frontend to Vercel"
echo ""

