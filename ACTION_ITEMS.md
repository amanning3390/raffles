# 📋 Action Items for Deployment - Complete Checklist

This document contains all the tasks YOU need to complete to deploy the raffle application. Follow these steps in order.

---

## ⚙️ PART 1: LOCAL ENVIRONMENT SETUP

### ✅ Action Item 1: Install Foundry (5 minutes)

**What**: Install the Foundry toolkit for Solidity development

**Why**: Required to compile and deploy smart contracts

**Instructions**:
1. Open your terminal on your local machine
2. Run the installation command:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   ```
3. Follow the on-screen instructions
4. After installation completes, run:
   ```bash
   foundryup
   ```
5. Verify installation:
   ```bash
   forge --version
   ```
   You should see output like: `forge 0.2.0 (...)`

**Troubleshooting**:
- **Mac/Linux**: If you get permission errors, you may need to run with `sudo`
- **Windows**: Install Windows Subsystem for Linux (WSL2) first, then run the commands in WSL
- **Alternative**: Use the installer from https://book.getfoundry.sh/getting-started/installation

**Success Criteria**: `forge --version` command works

---

## 💰 PART 2: GET TESTNET FUNDS

### ✅ Action Item 2: Create/Use a Test Wallet (3 minutes)

**What**: Set up a wallet specifically for deployment (NOT your main wallet)

**Why**: Safety - keep deployment separate from your main funds

**Instructions**:

**Option A - Create New Wallet in MetaMask:**
1. Open MetaMask extension
2. Click your account icon → "Add account or hardware wallet"
3. Select "Add a new account"
4. Name it "Raffle Deployment" or similar
5. Copy the wallet address

**Option B - Export Existing Wallet:**
1. Open MetaMask
2. Click the 3 dots → "Account details"
3. Click "Show private key"
4. Enter your password
5. Copy the private key (starts with 0x)
6. **IMPORTANT**: Never share this or commit it to git!

**Success Criteria**: You have a wallet address (0x...) and private key

---

### ✅ Action Item 3: Get Base Sepolia ETH (5 minutes)

**What**: Acquire free testnet ETH for Base Sepolia network

**Why**: Need ETH to pay for contract deployment gas fees (~0.001-0.002 ETH)

**Instructions**:
1. Copy your test wallet address from Action Item 2

2. Visit **Coinbase Base Sepolia Faucet**:
   - URL: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet
   - Paste your wallet address
   - Complete captcha
   - Click "Send me ETH"
   - Wait 1-2 minutes

3. **Backup Option - Alchemy Faucet** (if Coinbase faucet doesn't work):
   - URL: https://www.alchemy.com/faucets/base-sepolia
   - Sign in with email
   - Enter wallet address
   - Click "Send Me ETH"

4. **Verify you received the funds**:
   - Open MetaMask
   - Switch network to "Base Sepolia" (add it if needed)
   - Check your balance shows ~0.5 ETH or more

**How to Add Base Sepolia to MetaMask**:
- Click network dropdown → "Add network" → "Add a network manually"
- Enter:
  - Network name: `Base Sepolia`
  - RPC URL: `https://sepolia.base.org`
  - Chain ID: `84532`
  - Currency symbol: `ETH`
  - Block explorer: `https://sepolia.basescan.org`
- Click "Save"

**Success Criteria**: MetaMask shows ETH balance on Base Sepolia network

---

## 🔑 PART 3: GET API KEYS

### ✅ Action Item 4: Get Alchemy API Key (3 minutes)

**What**: Create a free Alchemy account and get an API key

**Why**: Provides reliable RPC endpoint for blockchain interactions

**Instructions**:
1. Go to https://www.alchemy.com/
2. Click "Sign Up" (top right)
3. Create account with email (free tier is fine)
4. After login, click "+ Create new app"
5. Fill in:
   - Name: "Raffles Base App"
   - Chain: Select "Base"
   - Network: Select "Base Sepolia"
6. Click "Create app"
7. Click on your new app → "API Key" button
8. Copy the API Key (not the HTTPS URL, just the key part)

**Success Criteria**: You have an API key like `abcd1234...`

---

### ✅ Action Item 5: Get Coinbase Developer Platform (CDP) API Key (3 minutes)

**What**: Create Coinbase Developer account for OnchainKit

**Why**: Required for OnchainKit wallet components

**Instructions**:
1. Go to https://portal.cdp.coinbase.com/
2. Sign in with Coinbase account (or create one)
3. Click "Create New Project" or use existing project
4. Fill in:
   - Project name: "Raffles"
   - Description: "Non-custodial raffle platform"
5. Navigate to "API Keys" section
6. Click "Create API Key"
7. Copy the API Key (save it securely)

**Success Criteria**: You have a CDP API key

---

### ✅ Action Item 6: Get WalletConnect Project ID (3 minutes)

**What**: Create WalletConnect Cloud project

**Why**: Enables WalletConnect wallet integration

**Instructions**:
1. Go to https://cloud.reown.com/ (formerly WalletConnect Cloud)
2. Sign in or create account
3. Click "Create New Project"
4. Fill in:
   - Project name: "Raffles"
   - Homepage URL: `http://localhost:3000` (for now)
5. Click "Create"
6. Copy the "Project ID" from the project dashboard

**Success Criteria**: You have a WalletConnect Project ID

---

### ✅ Action Item 7: Get Basescan API Key - OPTIONAL (3 minutes)

**What**: Get API key for contract verification on BaseScan

**Why**: Allows users to view and verify your contract source code

**Instructions**:
1. Go to https://basescan.org/
2. Click "Sign In" → "Sign Up" (top right)
3. Create free account with email
4. Verify email
5. After login, go to https://basescan.org/myapikey
6. Click "Add" to create new API key
7. Name it "Raffles Deployment"
8. Copy the API Key

**Success Criteria**: You have a Basescan API key (or skip if optional)

---

## 🚀 PART 4: DEPLOY SMART CONTRACT

### ✅ Action Item 8: Configure Contract Deployment (5 minutes)

**What**: Set up environment variables for contract deployment

**Why**: Tells Foundry where and how to deploy the contract

**Instructions**:
1. Navigate to the contracts directory:
   ```bash
   cd contracts
   ```

2. Create your environment file:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` in your text editor (VS Code, nano, etc.)

4. Replace the values:
   ```bash
   # Your wallet's private key from Action Item 2
   PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE

   # Use default or add your Alchemy key
   BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
   # Or use public RPC: https://sepolia.base.org

   # From Action Item 7 (or leave blank if skipped)
   BASESCAN_API_KEY=YOUR_BASESCAN_KEY_HERE

   # Leave this blank for now (will be filled after deployment)
   RAFFLE_CORE_ADDRESS=
   ```

5. Save the file

6. **IMPORTANT**: Verify `.env` is in `.gitignore`:
   ```bash
   cat .gitignore | grep .env
   ```
   You should see `.env` listed

**Security Note**: NEVER commit `.env` to git or share it publicly!

**Success Criteria**: `.env` file exists with your private key and API keys

---

### ✅ Action Item 9: Build Smart Contracts (2 minutes)

**What**: Compile the Solidity smart contracts

**Why**: Converts Solidity code to bytecode for deployment

**Instructions**:
1. Make sure you're in the `contracts` directory:
   ```bash
   pwd  # Should show: /path/to/raffles/contracts
   ```

2. Build the contracts:
   ```bash
   forge build
   ```

3. Expected output:
   ```
   [⠢] Compiling...
   [⠆] Compiling 3 files with Solc 0.8.24
   [⠰] Solc 0.8.24 finished in 2.15s
   Compiler run successful!
   ```

**Troubleshooting**:
- **Error: "forge: command not found"**: Go back to Action Item 1, Foundry isn't installed
- **Error: "Compilation failed"**: Check that all contract files are present in `src/` directory

**Success Criteria**: You see "Compiler run successful!" message

---

### ✅ Action Item 10: Deploy Contract to Base Sepolia (5 minutes)

**What**: Deploy the RaffleCore contract to Base Sepolia testnet

**Why**: This creates your live smart contract on the blockchain

**Instructions**:
1. Make sure you're in the `contracts` directory with `.env` configured

2. Load environment variables:
   ```bash
   source .env
   ```

3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

   **OR** run the full command:
   ```bash
   forge script script/Deploy.s.sol:DeployScript \
     --rpc-url $BASE_SEPOLIA_RPC_URL \
     --broadcast \
     --verify \
     --etherscan-api-key $BASESCAN_API_KEY \
     -vvvv
   ```

4. **Watch the output carefully**. You'll see:
   - Transaction being submitted
   - Waiting for confirmation
   - Deployment success message
   - **CONTRACT ADDRESS** (very important!)

5. Look for this output:
   ```
   ====================================
   RaffleCore deployed to: 0x1234567890abcdef1234567890abcdef12345678
   Deployer: 0xYourAddress...
   ====================================
   ```

6. **COPY THE CONTRACT ADDRESS** - you'll need it for the next steps!

7. Save the contract address somewhere safe (notepad, notes app, etc.)

**Troubleshooting**:
- **"Insufficient funds"**: Go back to Action Item 3, get more testnet ETH
- **"Nonce too low"**: Wait a minute and try again
- **"Network error"**: Check your internet connection, try different RPC URL
- **Verification failed**: That's okay! You can verify manually later

**Success Criteria**:
- Deployment succeeded
- You have the contract address (0x...)
- Transaction visible on https://sepolia.basescan.org/

---

### ✅ Action Item 11: Verify Deployment (3 minutes)

**What**: Confirm your contract is live on BaseScan

**Why**: Ensures deployment was successful and contract is accessible

**Instructions**:
1. Take your contract address from Action Item 10

2. Visit BaseScan:
   ```
   https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
   ```
   Replace `YOUR_CONTRACT_ADDRESS` with your actual address

3. You should see:
   - ✅ Contract creation transaction
   - ✅ Contract bytecode
   - ✅ (Ideally) "Contract" tab showing verified source code

4. Click "Contract" tab:
   - If verified: You'll see the Solidity source code
   - If not verified: You'll see bytecode only (we can verify later)

5. Test reading from the contract:
   - Click "Read Contract"
   - Find `totalRaffles` function
   - Click "Query"
   - Should return `0` (no raffles created yet)

**Success Criteria**: Contract appears on BaseScan and you can read from it

---

## 🎨 PART 5: CONFIGURE FRONTEND

### ✅ Action Item 12: Configure Frontend Environment (5 minutes)

**What**: Set up the frontend to connect to your deployed contract

**Why**: Links the UI to your smart contract

**Instructions**:

**Option A - Automated Setup (Recommended)**:
1. Return to project root:
   ```bash
   cd ..  # Go back from contracts/ to raffles/
   ```

2. Run the setup wizard:
   ```bash
   npm run setup
   ```

3. Follow the prompts:
   - Enter your contract address (from Action Item 10)
   - Choose "1" for Base Sepolia
   - Enter Alchemy API key (from Action Item 4)
   - Enter CDP API key (from Action Item 5)
   - Enter WalletConnect Project ID (from Action Item 6)

4. The script will create `.env.local` automatically

**Option B - Manual Setup**:
1. Copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in your editor

3. Fill in the values:
   ```bash
   # Your deployed contract address from Action Item 10
   NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0xYOUR_CONTRACT_ADDRESS

   # Base Sepolia testnet
   NEXT_PUBLIC_CHAIN_ID=84532

   # From Action Item 4
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

   # From Action Item 5
   NEXT_PUBLIC_CDP_API_KEY=your_cdp_key

   # From Action Item 6
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_id

   # OnchainKit config
   NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Raffles

   # App URL (for local development)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Save the file

**Success Criteria**: `.env.local` exists with all required values filled in

---

## 🧪 PART 6: TEST THE APPLICATION

### ✅ Action Item 13: Start Development Server (2 minutes)

**What**: Run the Next.js application locally

**Why**: Test that everything works before deploying to production

**Instructions**:
1. Make sure you're in the project root directory:
   ```bash
   pwd  # Should show: /path/to/raffles
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Wait for it to compile. You should see:
   ```
   ▲ Next.js 16.0.2
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

   ✓ Ready in 2.5s
   ```

5. Open your browser to: http://localhost:3000

**Troubleshooting**:
- **Port 3000 already in use**: Kill the other process or use `npm run dev -- -p 3001`
- **Compilation errors**: Make sure `.env.local` is properly configured
- **Module not found**: Run `npm install` again

**Success Criteria**: Website loads in browser

---

### ✅ Action Item 14: Connect Wallet (2 minutes)

**What**: Connect your MetaMask wallet to the application

**Why**: Required to interact with smart contracts

**Instructions**:
1. Open http://localhost:3000 in your browser

2. Click "Connect Wallet" button in the top right

3. Select your wallet option:
   - **MetaMask**: Click and approve connection
   - **Coinbase Wallet**: Scan QR code or use extension
   - **WalletConnect**: Scan QR code with mobile wallet

4. Make sure you're on **Base Sepolia** network:
   - Check network switcher in the navbar
   - If on wrong network, click to switch to Base Sepolia
   - Approve network switch in MetaMask

5. Your wallet address should appear in the navbar

**Troubleshooting**:
- **"Please switch to Base Sepolia"**: Click the network switcher and select Base Sepolia
- **Wallet won't connect**: Refresh the page and try again
- **Wrong network**: Manually switch to Base Sepolia in MetaMask

**Success Criteria**: Wallet connected and showing Base Sepolia network

---

### ✅ Action Item 15: Create Test Raffle (5 minutes)

**What**: Create your first raffle to test the contract

**Why**: Verifies smart contract is working correctly

**Instructions**:
1. Click "Create Raffle" in the navbar

2. **Step 1 - Choose Asset Type**:
   - Select "ETH" (simplest for testing)
   - Click "Next"

3. **Step 2 - Configure Raffle**:
   - Prize Amount: `0.01` (0.01 ETH)
   - Entry Fee: `0.001` (0.001 ETH)
   - Max Entries: `10`
   - Max Entries Per Wallet: `5`
   - Duration: `24` (24 hours)
   - Number of Winners: `1`
   - Click "Next"

4. **Step 3 - Review & Create**:
   - Review all settings
   - Click "Create Raffle"

5. **Approve Transaction in MetaMask**:
   - MetaMask popup will appear
   - Review the transaction (should send 0.01 ETH)
   - Click "Confirm"
   - Wait for confirmation (~2-5 seconds)

6. You should see:
   - Success toast notification
   - Redirected to raffle detail page or home

**Troubleshooting**:
- **"Insufficient funds"**: Make sure you have at least 0.012 ETH on Base Sepolia
- **Transaction failed**: Check MetaMask for error message
- **Nothing happens after clicking Create**: Check browser console for errors (F12)

**Success Criteria**:
- Transaction confirmed
- Raffle appears on homepage
- You can see raffle details

---

### ✅ Action Item 16: Enter Your Raffle (3 minutes)

**What**: Test entering a raffle

**Why**: Ensures entry mechanism works

**Instructions**:
1. From homepage, click on your created raffle

2. On raffle detail page:
   - Number of Entries: `2`
   - Total Cost should show: `0.002 ETH`
   - Click "Enter Raffle"

3. Approve transaction in MetaMask:
   - Should send 0.002 ETH
   - Click "Confirm"
   - Wait for confirmation

4. Page should update showing:
   - Your entries in the raffle
   - Updated progress bar
   - Your address in participants list

**Success Criteria**: Successfully entered raffle, can see your entries

---

### ✅ Action Item 17: Test Other Features (5 minutes)

**What**: Test remaining functionality

**Why**: Ensure all features work correctly

**Instructions**:

**A. Test Profile Dashboard**:
1. Click "Profile" in navbar (or your wallet address)
2. Should see:
   - Your stats (1 raffle created, 2 entries, etc.)
   - "Created" tab showing your raffle
   - "Entered" tab showing raffles you've entered
3. Try switching between tabs

**B. Test Filtering**:
1. Go to homepage
2. Click filter buttons: All / ETH / Tokens / NFTs
3. Raffles should filter accordingly

**C. Test Wallet Disconnect/Reconnect**:
1. Disconnect wallet (click wallet address → disconnect)
2. Reconnect wallet
3. Verify everything still works

**D. Test Mobile Responsiveness** (optional):
1. Open browser dev tools (F12)
2. Toggle device toolbar (mobile view)
3. Check that layout looks good on mobile

**Success Criteria**: All features work as expected

---

### ✅ Action Item 18: Verify Contract on BaseScan (3 minutes)

**What**: Make contract source code publicly viewable

**Why**: Transparency and trust - users can verify the contract code

**Instructions**:

**If auto-verification worked during deployment:**
- Skip this step, you're done!

**If auto-verification failed:**

1. Go to your contract on BaseScan:
   ```
   https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
   ```

2. Click "Contract" tab → "Verify and Publish"

3. Fill in the form:
   - Compiler Type: `Solidity (Single file)`
   - Compiler Version: `v0.8.24+commit.e11b9ed9`
   - License Type: `MIT`

4. Open `contracts/src/RaffleCore.sol` in your editor

5. Copy the entire file contents

6. Paste into BaseScan verification form

7. Click "Verify and Publish"

8. Wait for verification (30-60 seconds)

**Alternative - Use Foundry CLI**:
```bash
cd contracts
source .env
forge verify-contract \
  YOUR_CONTRACT_ADDRESS \
  src/RaffleCore.sol:RaffleCore \
  --chain-id 84532 \
  --etherscan-api-key $BASESCAN_API_KEY
```

**Success Criteria**: Contract tab on BaseScan shows verified source code with green checkmark

---

## 📤 PART 7: DEPLOY TO PRODUCTION (OPTIONAL)

### ✅ Action Item 19: Deploy to Vercel (10 minutes)

**What**: Deploy the frontend to Vercel for public access

**Why**: Makes your app accessible to everyone on the internet

**Instructions**:

1. **Push code to GitHub** (if not already):
   ```bash
   git add -A
   git commit -m "Ready for production deployment"
   git push origin claude/base-raffle-app-plan-011CV4nuBkHrRAKya1hQpvvi
   ```

2. **Create Vercel account**:
   - Go to https://vercel.com/
   - Sign up with GitHub
   - Authorize Vercel to access your repositories

3. **Import project**:
   - Click "Add New" → "Project"
   - Find your "raffles" repository
   - Click "Import"

4. **Configure project**:
   - Framework Preset: Next.js (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variables**:
   Click "Environment Variables" and add each from your `.env.local`:
   ```
   NEXT_PUBLIC_RAFFLE_CORE_ADDRESS=0xYOUR_ADDRESS
   NEXT_PUBLIC_CHAIN_ID=84532
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_key
   NEXT_PUBLIC_CDP_API_KEY=your_key
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
   NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Raffles
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

6. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://raffles-xyz.vercel.app`

7. **Test production deployment**:
   - Visit your Vercel URL
   - Connect wallet
   - Verify everything works

**Success Criteria**: App is live and accessible at your Vercel URL

---

## 🎉 PART 8: FINAL VERIFICATION

### ✅ Action Item 20: Complete Final Checklist (5 minutes)

**What**: Verify everything is working correctly

**Why**: Ensures deployment is fully successful

**Final Checklist**:

- [ ] Foundry installed and working
- [ ] Base Sepolia ETH in test wallet
- [ ] All API keys obtained and working
- [ ] Smart contract deployed to Base Sepolia
- [ ] Contract verified on BaseScan
- [ ] Frontend `.env.local` configured correctly
- [ ] Can connect wallet to app
- [ ] Can create raffles successfully
- [ ] Can enter raffles successfully
- [ ] Can view profile/dashboard
- [ ] All pages load without errors
- [ ] Contract address visible on BaseScan
- [ ] (Optional) App deployed to Vercel
- [ ] (Optional) Custom domain configured

**Success Criteria**: All items checked ✅

---

## 📝 REFERENCE INFORMATION

### Important URLs to Save:

1. **Your Deployed Contract**:
   ```
   https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS
   ```

2. **Local Development**:
   ```
   http://localhost:3000
   ```

3. **Production (if deployed)**:
   ```
   https://your-app.vercel.app
   ```

### Your Contract Address:
```
[Write it here after Action Item 10]
0x_______________________________________
```

### Important Commands:

**Start local development**:
```bash
npm run dev
```

**Build for production**:
```bash
npm run build
```

**Deploy contract**:
```bash
cd contracts && ./deploy.sh
```

**Configure frontend**:
```bash
npm run setup
```

---

## 🆘 TROUBLESHOOTING

### Common Issues:

**"Contract not found" in frontend:**
- Check `NEXT_PUBLIC_RAFFLE_CORE_ADDRESS` in `.env.local`
- Verify contract deployed successfully on BaseScan
- Restart dev server: `Ctrl+C` then `npm run dev`

**"Insufficient funds" when creating raffle:**
- Get more Base Sepolia ETH from faucet
- Check you're on Base Sepolia network in MetaMask

**"Transaction reverted":**
- Check you have enough ETH for gas + prize amount
- Verify all raffle parameters are valid (positive numbers)
- Check contract on BaseScan for any errors

**Wallet won't connect:**
- Refresh the page
- Clear browser cache
- Try different wallet/browser
- Check browser console (F12) for errors

**Build fails:**
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then `npm install`
- Check all environment variables are set correctly

---

## 📞 GETTING HELP

If you get stuck:

1. **Check browser console**: Press F12 → Console tab for error messages
2. **Check terminal output**: Look for error messages when running commands
3. **Verify environment variables**: Double-check all values in `.env.local`
4. **Review documentation**:
   - `DEPLOYMENT_CHECKLIST.md`
   - `contracts/DEPLOYMENT.md`
   - `README.md`

---

## ✅ COMPLETION

When all action items are complete:

**You will have:**
- ✅ Fully deployed RaffleCore smart contract on Base Sepolia
- ✅ Working frontend connected to your contract
- ✅ Ability to create and enter raffles
- ✅ Non-custodial raffle platform ready for testing
- ✅ (Optional) Live production deployment on Vercel

**Next steps:**
- Share with friends for testing
- Create test raffles with different assets (ERC-20 tokens, NFTs)
- Gather feedback
- Consider security audit before mainnet deployment

---

**Estimated Total Time**: 1-2 hours (depending on experience level)

**Good luck with your deployment! 🚀**
