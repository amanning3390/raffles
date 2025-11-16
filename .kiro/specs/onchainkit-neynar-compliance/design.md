# Design Document

## Overview

This design document outlines the architectural changes and implementation patterns needed to ensure full compliance with OnchainKit and Neynar SDK best practices. The design focuses on leveraging official SDK components, implementing proper authentication flows, optimizing performance, and ensuring type safety throughout the application.

The current implementation has a solid foundation but uses basic patterns. This design will upgrade to advanced SDK features, implement proper Farcaster integration, and ensure all blockchain interactions follow OnchainKit conventions.

## Architecture

### Current Architecture Issues

1. **OnchainKit Usage**: Currently using basic Wallet components but missing Transaction, Fund, and other advanced features
2. **Neynar Integration**: Placeholder implementation without actual SIWN authentication
3. **Type Safety**: Some areas lack proper TypeScript types from SDKs
4. **Error Handling**: Basic error handling without SDK-specific patterns
5. **Performance**: No caching strategy for Neynar API calls

### Proposed Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components  │  │    Hooks     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼──────┐  ┌────────▼────────┐
│  OnchainKit    │  │   Wagmi v2  │  │  Neynar SDK     │
│  Components    │  │   + Viem    │  │  (@neynar/react)│
└────────────────┘  └─────────────┘  └─────────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                ┌───────────▼───────────┐
                │   Base Blockchain     │
                │   Farcaster Network   │
                └───────────────────────┘
```

### Layer Responsibilities

**Presentation Layer (Components)**
- Use OnchainKit UI components for all blockchain-related UI
- Implement Neynar React components for Farcaster features
- Handle loading states and error boundaries
- Provide responsive, accessible interfaces

**Business Logic Layer (Hooks)**
- Wrap SDK functionality in custom hooks
- Implement caching with TanStack Query
- Handle error transformation and retry logic
- Manage state for complex flows

**Integration Layer (Providers)**
- Configure OnchainKit with proper settings
- Set up Wagmi with optimal connectors
- Initialize Neynar SDK with authentication
- Provide context to entire application

## Components and Interfaces

### 1. Enhanced Provider Configuration

**File**: `components/Providers.tsx`

**Changes**:
- Add proper OnchainKit configuration with all features
- Configure Neynar provider with authentication
- Add error boundaries for SDK failures
- Implement proper TypeScript types

**Interface**:
```typescript
interface ProvidersProps {
  children: ReactNode;
}

interface OnchainKitConfig {
  apiKey: string;
  chain: Chain;
  config: {
    appearance: {
      name: string;
      logo: string;
      mode: 'auto' | 'light' | 'dark';
      theme: 'default' | 'base' | 'cyberpunk';
    };
  };
}
```

### 2. Wallet Components Enhancement

**File**: `components/wallet/WalletConnect.tsx`

**Changes**:
- Use all OnchainKit Wallet components
- Add proper TypeScript types
- Implement error handling
- Add loading states

**Components to Use**:
- `Wallet` - Main wrapper
- `ConnectWallet` - Connection button
- `WalletDropdown` - Dropdown menu
- `WalletDropdownBasename` - Basename management
- `WalletDropdownLink` - External links
- `WalletDropdownDisconnect` - Disconnect action

### 3. Identity Components

**New File**: `components/identity/UserIdentity.tsx`

**Purpose**: Display user identity with OnchainKit components

**Components**:
```typescript
import {
  Identity,
  Avatar,
  Name,
  Address,
  EthBalance,
  Badge
} from '@coinbase/onchainkit/identity';

interface UserIdentityProps {
  address: Address;
  showBalance?: boolean;
  showBadge?: boolean;
  hasCopyAddressOnClick?: boolean;
}
```

### 4. Farcaster Authentication

**New File**: `components/farcaster/FarcasterAuth.tsx`

**Purpose**: Implement proper SIWN authentication flow

**Flow**:
1. User clicks "Connect Farcaster"
2. Generate SIWN message using Neynar SDK
3. Request signature from user's wallet
4. Verify signature with Neynar API
5. Store authentication state
6. Fetch and display user profile

**Interface**:
```typescript
interface FarcasterAuthProps {
  onSuccess?: (user: NeynarUser) => void;
  onError?: (error: Error) => void;
}

interface NeynarUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  verifiedAddresses: Address[];
}
```

### 5. Farcaster Profile Display

**File**: `components/farcaster/FarcasterProfile.tsx`

**Changes**:
- Fetch real user data from Neynar SDK
- Display avatar, username, FID
- Show verification status
- Add link to Warpcast profile

**Data Source**: Neynar SDK `useNeynarUser` hook

### 6. Transaction Components

**New File**: `components/transaction/TransactionWrapper.tsx`

**Purpose**: Use OnchainKit Transaction components for better UX

**Components**:
```typescript
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction
} from '@coinbase/onchainkit/transaction';
```

**Use Cases**:
- Creating raffles
- Entering raffles
- Claiming prizes
- Any contract interaction

### 7. Enhanced Wagmi Configuration

**File**: `lib/wagmi.ts`

**Changes**:
- Update to latest Wagmi v2 patterns
- Configure proper connectors with metadata
- Add proper error handling
- Implement reconnection logic
- Add proper TypeScript types

**Configuration**:
```typescript
export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: 'Raffles',
      appLogoUrl: 'https://raffles.app/logo.png',
      preference: 'smartWalletOnly',
      version: '4',
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      metadata: {
        name: 'Raffles',
        description: 'Non-custodial raffle platform on Base',
        url: process.env.NEXT_PUBLIC_APP_URL!,
        icons: ['https://raffles.app/logo.png'],
      },
      showQrModal: true,
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [base.id]: http(
      `https://base-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
    [baseSepolia.id]: http(
      `https://base-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  },
});
```

### 8. Neynar SDK Integration

**New File**: `lib/neynar-client.ts`

**Purpose**: Centralized Neynar SDK client configuration

**Implementation**:
```typescript
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

export const neynarClient = new NeynarAPIClient({
  apiKey: process.env.NEYNAR_API_KEY!,
});

export async function getUserByFid(fid: number) {
  return neynarClient.fetchBulkUsers([fid]);
}

export async function getUserByAddress(address: Address) {
  return neynarClient.lookupUserByVerification(address);
}

export async function generateSIWNMessage(address: Address) {
  return neynarClient.generateSignInMessage({
    address,
    domain: process.env.NEXT_PUBLIC_APP_URL!,
    uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/farcaster`,
  });
}

export async function verifySIWNSignature(
  message: string,
  signature: string
) {
  return neynarClient.verifySignInMessage({
    message,
    signature,
  });
}
```

### 9. Custom Hooks Enhancement

**File**: `hooks/useRaffleContract.ts`

**Changes**:
- Add proper error handling with OnchainKit patterns
- Implement transaction status tracking
- Add retry logic
- Use proper TypeScript types

**New Hooks**:
```typescript
// Enhanced hook with OnchainKit Transaction component
export function useCreateRaffleWithTransaction() {
  // Returns Transaction component props
}

// Hook for Neynar user data with caching
export function useFarcasterUser(address?: Address) {
  return useQuery({
    queryKey: ['farcaster-user', address],
    queryFn: () => getUserByAddress(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

### 10. Environment Variable Validation

**New File**: `lib/env.ts`

**Purpose**: Validate all required environment variables at build time

**Implementation**:
```typescript
const requiredEnvVars = {
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_CDP_API_KEY: process.env.NEXT_PUBLIC_CDP_API_KEY,
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_RAFFLE_CORE_ADDRESS: process.env.NEXT_PUBLIC_RAFFLE_CORE_ADDRESS,
} as const;

const optionalEnvVars = {
  NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
  NEXT_PUBLIC_NEYNAR_CLIENT_ID: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID,
} as const;

export function validateEnv() {
  const missing: string[] = [];
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
  
  // Warn about optional vars
  for (const [key, value] of Object.entries(optionalEnvVars)) {
    if (!value) {
      console.warn(`Optional environment variable not set: ${key}`);
    }
  }
}
```

## Data Models

### Farcaster User Model

```typescript
interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  verifiedAddresses: {
    ethAddresses: Address[];
  };
  connectedAt: Date;
}
```

### Authentication State Model

```typescript
interface AuthState {
  wallet: {
    address: Address | undefined;
    isConnected: boolean;
    connector: Connector | undefined;
  };
  farcaster: {
    user: FarcasterUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
}
```

### Transaction State Model

```typescript
interface TransactionState {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash?: Hash;
  error?: Error;
  receipt?: TransactionReceipt;
}
```

## Error Handling

### OnchainKit Error Handling

**Strategy**:
1. Catch errors from OnchainKit components
2. Transform to user-friendly messages
3. Display using toast system
4. Log to console in development
5. Track in production monitoring

**Error Types**:
- Wallet connection errors
- Transaction rejection
- Network errors
- Insufficient balance
- Contract errors

**Implementation**:
```typescript
function handleOnchainKitError(error: Error) {
  if (error.message.includes('User rejected')) {
    showToast('Transaction cancelled', 'info');
  } else if (error.message.includes('insufficient funds')) {
    showToast('Insufficient balance', 'error');
  } else if (error.message.includes('network')) {
    showToast('Network error. Please try again', 'error');
  } else {
    showToast('Transaction failed', 'error');
    console.error('OnchainKit error:', error);
  }
}
```

### Neynar Error Handling

**Strategy**:
1. Gracefully degrade when Neynar unavailable
2. Cache successful responses
3. Retry failed requests with exponential backoff
4. Show optional features as unavailable

**Error Types**:
- API key invalid
- Rate limiting
- Network errors
- User not found
- Signature verification failed

**Implementation**:
```typescript
function handleNeynarError(error: Error) {
  if (error.message.includes('API key')) {
    console.warn('Neynar API key invalid. Farcaster features disabled.');
    return null;
  } else if (error.message.includes('rate limit')) {
    showToast('Too many requests. Please try again later', 'warning');
  } else if (error.message.includes('not found')) {
    return null; // User doesn't have Farcaster
  } else {
    console.error('Neynar error:', error);
    return null;
  }
}
```

## Testing Strategy

### Unit Tests

**OnchainKit Components**:
- Test wallet connection flow
- Test transaction component rendering
- Test identity component display
- Mock OnchainKit hooks

**Neynar Integration**:
- Test SIWN flow
- Test user data fetching
- Test error handling
- Mock Neynar API responses

### Integration Tests

**Wallet Connection**:
- Test connecting with different wallets
- Test network switching
- Test disconnection
- Test reconnection on page reload

**Farcaster Authentication**:
- Test full SIWN flow
- Test signature verification
- Test user data display
- Test optional feature degradation

### E2E Tests

**Critical Flows**:
1. Connect wallet → Create raffle → Verify transaction
2. Connect wallet → Enter raffle → Verify entry
3. Connect Farcaster → View profile → Verify data
4. Switch networks → Verify state persistence

## Performance Optimizations

### OnchainKit Optimizations

1. **Code Splitting**: Lazy load OnchainKit components
2. **Memoization**: Memoize expensive component renders
3. **Batch Requests**: Use multicall for multiple contract reads
4. **Caching**: Cache blockchain data with TanStack Query

### Neynar Optimizations

1. **Caching**: Cache user data for 5 minutes
2. **Prefetching**: Prefetch user data on hover
3. **Pagination**: Implement pagination for user lists
4. **Image Optimization**: Use Next.js Image for avatars

### Implementation

```typescript
// Lazy load OnchainKit components
const Transaction = dynamic(
  () => import('@coinbase/onchainkit/transaction').then(mod => mod.Transaction),
  { ssr: false }
);

// Cache Neynar data
export function useFarcasterUser(address?: Address) {
  return useQuery({
    queryKey: ['farcaster-user', address],
    queryFn: () => getUserByAddress(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

// Batch contract reads
export function useRaffleData(raffleIds: bigint[]) {
  return useReadContracts({
    contracts: raffleIds.map(id => ({
      address: RAFFLE_CORE_ADDRESS,
      abi: RAFFLE_CORE_ABI,
      functionName: 'getRaffle',
      args: [id],
    })),
  });
}
```

## Security Considerations

### OnchainKit Security

1. **Wallet Connection**: Only use official connectors
2. **Transaction Signing**: Always show transaction details
3. **Network Validation**: Verify correct network before transactions
4. **Address Validation**: Validate all addresses before use

### Neynar Security

1. **API Key Protection**: Never expose API key in client code
2. **Signature Verification**: Always verify SIWN signatures server-side
3. **Rate Limiting**: Implement client-side rate limiting
4. **Data Validation**: Validate all Neynar API responses

### Implementation

```typescript
// Server-side SIWN verification
export async function POST(request: Request) {
  const { message, signature } = await request.json();
  
  // Verify signature server-side
  const result = await verifySIWNSignature(message, signature);
  
  if (!result.success) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 });
  }
  
  // Store authentication in secure session
  return Response.json({ user: result.user });
}
```

## Migration Strategy

### Phase 1: OnchainKit Enhancement
1. Update Providers.tsx with full OnchainKit config
2. Enhance WalletConnect.tsx with all components
3. Add Identity components throughout app
4. Update error handling

### Phase 2: Neynar Integration
1. Implement SIWN authentication flow
2. Add FarcasterAuth component
3. Update FarcasterProfile with real data
4. Add caching for Neynar API calls

### Phase 3: Transaction Components
1. Replace custom transaction handling with OnchainKit Transaction
2. Add transaction status tracking
3. Implement retry logic
4. Add transaction history

### Phase 4: Testing & Optimization
1. Add unit tests for all new components
2. Add integration tests for authentication flows
3. Implement performance optimizations
4. Add error tracking

## Dependencies

### Required Packages (Already Installed)
- `@coinbase/onchainkit`: ^1.1.2
- `@neynar/react`: ^1.2.22
- `wagmi`: ^2.19.3
- `viem`: ^2.39.0
- `@tanstack/react-query`: ^5.90.8

### Additional Packages Needed
- `@neynar/nodejs-sdk`: For server-side Neynar operations
- None - all required packages already installed

## Conclusion

This design provides a comprehensive approach to ensuring OnchainKit and Neynar SDK compliance. The implementation will leverage official components, implement proper authentication flows, optimize performance, and ensure type safety throughout the application. The phased migration strategy allows for incremental improvements while maintaining application stability.
