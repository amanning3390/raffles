# OnchainKit Integration Guide

This guide covers how OnchainKit is integrated into the Raffles application and how to use its components effectively.

## Table of Contents

- [Overview](#overview)
- [Setup and Configuration](#setup-and-configuration)
- [Wallet Components](#wallet-components)
- [Identity Components](#identity-components)
- [Transaction Components](#transaction-components)
- [Error Handling](#error-handling)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Overview

OnchainKit is Coinbase's official SDK for building onchain applications on Base. This application uses OnchainKit for:

- **Wallet Connection**: Coinbase Smart Wallet, MetaMask, WalletConnect
- **Identity Display**: ENS/Basename resolution, avatars, addresses
- **Transaction Handling**: Improved UX for contract interactions
- **Smart Wallet Features**: Gasless transactions (when available)

### Version

This app uses OnchainKit v1.1+. Always refer to the [official documentation](https://onchainkit.xyz/) for the latest features.

## Setup and Configuration

### 1. Environment Variables

Required environment variables in `.env.local`:

```bash
# Coinbase Developer Platform API Key (REQUIRED)
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key_here

# Alchemy API Key for RPC (REQUIRED)
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here

# WalletConnect Project ID (REQUIRED)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### 2. Provider Configuration

OnchainKit is configured in `components/Providers.tsx`:

```typescript
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base, baseSepolia } from 'wagmi/chains';

<OnchainKitProvider
  apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
  chain={chain}
  config={{
    appearance: {
      name: 'Raffles',
      logo: '/logo.png',
      mode: 'auto',
      theme: 'default',
    },
  }}
>
  {children}
</OnchainKitProvider>
```

**Configuration Options**:
- `apiKey`: Your CDP API key (required)
- `chain`: Current blockchain (Base or Base Sepolia)
- `appearance.name`: App name shown in wallet UI
- `appearance.logo`: App logo URL
- `appearance.mode`: 'auto', 'light', or 'dark'
- `appearance.theme`: 'default', 'base', or 'cyberpunk'

### 3. Wagmi Integration

OnchainKit works seamlessly with Wagmi v2. Configuration in `lib/wagmi.ts`:

```typescript
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'Raffles',
      preference: 'smartWalletOnly', // Prefer Smart Wallet
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
  ],
  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    [baseSepolia.id]: http(`https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
  },
});
```

## Wallet Components

### ConnectWallet Button

The main wallet connection component. Used in `components/wallet/WalletConnect.tsx`:

```typescript
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';

export function WalletConnect() {
  return (
    <Wallet>
      <ConnectWallet>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
      <WalletDropdown>
        <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
}
```

**Features**:
- Automatic wallet detection
- Smart Wallet preference
- Network switching
- Disconnect functionality
- Identity display in dropdown

### WalletDropdown Components

Additional dropdown components for enhanced functionality:

```typescript
import {
  WalletDropdownBasename,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';

<WalletDropdown>
  <Identity>...</Identity>
  <WalletDropdownBasename />
  <WalletDropdownLink
    icon="wallet"
    href="https://wallet.coinbase.com"
  >
    Wallet Dashboard
  </WalletDropdownLink>
  <WalletDropdownDisconnect />
</WalletDropdown>
```

## Identity Components

### Basic Identity Display

Display user identity with avatar, name, and address:

```typescript
import {
  Identity,
  Avatar,
  Name,
  Address,
  EthBalance,
} from '@coinbase/onchainkit/identity';

<Identity
  address={userAddress}
  hasCopyAddressOnClick
>
  <Avatar />
  <Name />
  <Address />
  <EthBalance />
</Identity>
```

### Individual Components

Use components separately for custom layouts:

```typescript
// Avatar only
<Avatar address={userAddress} className="h-10 w-10" />

// Name with ENS/Basename resolution
<Name address={userAddress} />

// Address with formatting
<Address address={userAddress} />

// ETH Balance
<EthBalance address={userAddress} />
```

### UserIdentity Component

Reusable component in `components/identity/UserIdentity.tsx`:

```typescript
interface UserIdentityProps {
  address: Address;
  showBalance?: boolean;
  showBadge?: boolean;
  hasCopyAddressOnClick?: boolean;
}

export function UserIdentity({
  address,
  showBalance = false,
  showBadge = false,
  hasCopyAddressOnClick = true,
}: UserIdentityProps) {
  return (
    <Identity
      address={address}
      hasCopyAddressOnClick={hasCopyAddressOnClick}
    >
      <Avatar />
      <Name>
        {showBadge && <Badge />}
      </Name>
      <Address />
      {showBalance && <EthBalance />}
    </Identity>
  );
}
```

**Usage**:
```typescript
// Simple display
<UserIdentity address={creatorAddress} />

// With balance
<UserIdentity address={creatorAddress} showBalance />

// With badge and balance
<UserIdentity address={creatorAddress} showBalance showBadge />
```

## Transaction Components

### Transaction Wrapper

Enhanced transaction handling with better UX. Used in `components/transaction/TransactionWrapper.tsx`:

```typescript
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';

interface TransactionWrapperProps {
  contracts: ContractFunctionParameters[];
  onSuccess?: (receipt: TransactionReceipt) => void;
  onError?: (error: Error) => void;
}

export function TransactionWrapper({
  contracts,
  onSuccess,
  onError,
}: TransactionWrapperProps) {
  return (
    <Transaction
      contracts={contracts}
      onSuccess={onSuccess}
      onError={onError}
    >
      <TransactionButton text="Execute Transaction" />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}
```

### Creating a Raffle

Example from `app/create/page.tsx`:

```typescript
import { TransactionWrapper } from '@/components/transaction/TransactionWrapper';
import { RAFFLE_CORE_ABI, RAFFLE_CORE_ADDRESS } from '@/lib/contract';

const contracts = [
  {
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'createRaffle',
    args: [
      prizeAmount,
      entryFee,
      maxEntries,
      duration,
      winnerCount,
    ],
    value: prizeAmount, // For ETH raffles
  },
];

<TransactionWrapper
  contracts={contracts}
  onSuccess={(receipt) => {
    console.log('Raffle created!', receipt);
    router.push(`/raffle/${raffleId}`);
  }}
  onError={(error) => {
    console.error('Failed to create raffle:', error);
  }}
/>
```

### Entering a Raffle

Example from `app/raffle/[id]/page.tsx`:

```typescript
const contracts = [
  {
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'enterRaffle',
    args: [raffleId, entryCount],
    value: entryFee * BigInt(entryCount),
  },
];

<TransactionWrapper
  contracts={contracts}
  onSuccess={() => {
    showToast('Successfully entered raffle!', 'success');
    refetchRaffleData();
  }}
  onError={(error) => {
    handleOnchainKitError(error);
  }}
/>
```

## Error Handling

### Error Handler Utility

Centralized error handling in `lib/error-handlers.ts`:

```typescript
export function handleOnchainKitError(error: Error): void {
  const message = error.message.toLowerCase();

  if (message.includes('user rejected') || message.includes('user denied')) {
    showToast('Transaction cancelled', 'info');
  } else if (message.includes('insufficient funds')) {
    showToast('Insufficient balance for this transaction', 'error');
  } else if (message.includes('network')) {
    showToast('Network error. Please check your connection', 'error');
  } else if (message.includes('gas')) {
    showToast('Gas estimation failed. Please try again', 'error');
  } else {
    showToast('Transaction failed. Please try again', 'error');
    console.error('OnchainKit error:', error);
  }
}
```

### Usage in Components

```typescript
import { handleOnchainKitError } from '@/lib/error-handlers';

<TransactionWrapper
  contracts={contracts}
  onError={handleOnchainKitError}
/>
```

### Error Boundary

Wrap OnchainKit components in error boundaries:

```typescript
import { ErrorBoundary } from '@/components/ui/error-boundary';

<ErrorBoundary fallback={<div>Failed to load wallet</div>}>
  <WalletConnect />
</ErrorBoundary>
```

## Common Patterns

### Pattern 1: Wallet-Gated Content

Show content only when wallet is connected:

```typescript
import { useAccount } from 'wagmi';

export function CreateRafflePage() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="text-center">
        <p>Connect your wallet to create a raffle</p>
        <WalletConnect />
      </div>
    );
  }

  return <CreateRaffleForm />;
}
```

### Pattern 2: Network Validation

Ensure user is on correct network:

```typescript
import { useAccount, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

export function NetworkGuard({ children }: { children: React.ReactNode }) {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  
  const targetChain = process.env.NEXT_PUBLIC_CHAIN_ID === '8453' ? base : baseSepolia;

  if (chain?.id !== targetChain.id) {
    return (
      <div>
        <p>Please switch to {targetChain.name}</p>
        <button onClick={() => switchChain({ chainId: targetChain.id })}>
          Switch Network
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
```

### Pattern 3: Transaction Status Tracking

Track transaction lifecycle:

```typescript
import { useState } from 'react';
import { TransactionReceipt } from 'viem';

export function RaffleEntry() {
  const [txStatus, setTxStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [txHash, setTxHash] = useState<string>();

  return (
    <TransactionWrapper
      contracts={contracts}
      onSuccess={(receipt: TransactionReceipt) => {
        setTxStatus('success');
        setTxHash(receipt.transactionHash);
      }}
      onError={() => {
        setTxStatus('error');
      }}
    />
  );
}
```

### Pattern 4: Conditional Identity Display

Show different identity info based on context:

```typescript
// In raffle list - minimal
<Identity address={creator} hasCopyAddressOnClick={false}>
  <Avatar className="h-8 w-8" />
  <Name />
</Identity>

// In raffle detail - full info
<Identity address={creator} hasCopyAddressOnClick>
  <Avatar className="h-12 w-12" />
  <Name><Badge /></Name>
  <Address />
  <EthBalance />
</Identity>
```

## Troubleshooting

### Issue: Wallet Not Connecting

**Symptoms**: ConnectWallet button doesn't respond or shows error

**Solutions**:
1. Verify `NEXT_PUBLIC_CDP_API_KEY` is set correctly
2. Check browser console for errors
3. Try clearing browser cache and cookies
4. Ensure you're using a supported wallet (Coinbase, MetaMask, WalletConnect)
5. Check that Wagmi config includes proper connectors

### Issue: Identity Components Not Showing Data

**Symptoms**: Avatar, Name, or Address components are blank

**Solutions**:
1. Verify the address is valid (use `isAddress()` from viem)
2. Check that OnchainKitProvider is wrapping your components
3. ENS/Basename may not exist for all addresses (this is normal)
4. Check network connectivity to CDP API

### Issue: Transaction Component Not Rendering

**Symptoms**: TransactionButton doesn't appear or is disabled

**Solutions**:
1. Ensure wallet is connected before rendering Transaction component
2. Verify contract address and ABI are correct
3. Check that user is on correct network
4. Ensure contract function parameters are valid
5. Check browser console for TypeScript errors

### Issue: "Insufficient Funds" Error

**Symptoms**: Transaction fails with insufficient funds message

**Solutions**:
1. Verify user has enough ETH for gas fees
2. For testnet, get free ETH from Base Sepolia faucet
3. Check that `value` parameter matches required amount
4. Ensure gas estimation is working (check RPC connection)

### Issue: Smart Wallet Not Appearing

**Symptoms**: Only seeing MetaMask/WalletConnect, not Coinbase Smart Wallet

**Solutions**:
1. Verify `NEXT_PUBLIC_CDP_API_KEY` is set
2. Check that coinbaseWallet connector has `preference: 'smartWalletOnly'`
3. Clear browser cache
4. Try in incognito/private browsing mode
5. Ensure you're using latest version of OnchainKit

### Issue: Network Switching Not Working

**Symptoms**: Can't switch between Base and Base Sepolia

**Solutions**:
1. Verify both chains are configured in Wagmi config
2. Check that RPC endpoints are working for both networks
3. Some wallets require manual network addition
4. Try disconnecting and reconnecting wallet

### Getting More Help

- **OnchainKit Docs**: https://onchainkit.xyz/
- **Base Docs**: https://docs.base.org/
- **Wagmi Docs**: https://wagmi.sh/
- **GitHub Issues**: Open an issue with error details and reproduction steps

## Best Practices

1. **Always validate addresses** before passing to Identity components
2. **Use error boundaries** around OnchainKit components
3. **Implement proper loading states** during wallet connection
4. **Cache identity data** when displaying multiple users
5. **Test on both mainnet and testnet** before production
6. **Handle network switching gracefully** with clear user feedback
7. **Use TypeScript types** from OnchainKit for type safety
8. **Implement retry logic** for failed transactions
9. **Show clear error messages** to users, not technical jargon
10. **Monitor CDP API usage** to stay within rate limits

## Additional Resources

- [OnchainKit Documentation](https://onchainkit.xyz/)
- [OnchainKit GitHub](https://github.com/coinbase/onchainkit)
- [Base Documentation](https://docs.base.org/)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
- [Wagmi Documentation](https://wagmi.sh/)
