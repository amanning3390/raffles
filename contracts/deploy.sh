#!/bin/bash

# RaffleCore Deployment Script for Base Sepolia
# Usage: ./deploy.sh

set -e

echo "🚀 Deploying RaffleCore to Base Sepolia..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "   Run: cp .env.example .env"
    echo "   Then edit .env with your private key"
    exit 1
fi

# Source environment variables
source .env

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Error: PRIVATE_KEY not set in .env"
    exit 1
fi

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Error: Foundry not installed!"
    echo "   Install: curl -L https://foundry.paradigm.xyz | bash && foundryup"
    exit 1
fi

echo "✅ Environment loaded"
echo ""

# Build contracts
echo "📦 Building contracts..."
forge build
echo ""

# Deploy
echo "🚀 Deploying to Base Sepolia..."
echo ""

if [ -z "$BASESCAN_API_KEY" ]; then
    echo "⚠️  No BASESCAN_API_KEY found, skipping verification"
    forge script script/Deploy.s.sol:DeployScript \
        --rpc-url $BASE_SEPOLIA_RPC_URL \
        --private-key $PRIVATE_KEY \
        --broadcast \
        -vvvv
else
    echo "✅ Deploying with verification"
    forge script script/Deploy.s.sol:DeployScript \
        --rpc-url $BASE_SEPOLIA_RPC_URL \
        --private-key $PRIVATE_KEY \
        --broadcast \
        --verify \
        --etherscan-api-key $BASESCAN_API_KEY \
        -vvvv
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Copy the contract address from above"
echo "   2. Update ../.env.local with:"
echo "      NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=YOUR_ADDRESS"
echo "   3. Test on Basescan Sepolia"
echo ""
