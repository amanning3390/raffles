# Neynar SDK Integration Guide

This guide covers how Neynar SDK is integrated into the Raffles application for optional Farcaster social features.

## Table of Contents

- [Overview](#overview)
- [Setup and Configuration](#setup-and-configuration)
- [SIWN Authentication](#siwn-authentication)
- [User Data Fetching](#user-data-fetching)
- [Farcaster Profile Display](#farcaster-profile-display)
- [Optional Feature Degradation](#optional-feature-degradation)
- [Error Handling](#error-handling)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

## Overview

Neynar SDK enables Farcaster integration for social features in the Raffles application. **This integration is completely optional** - the app works perfectly without it.

### What is Farcaster?

Farcaster is a decentralized social network protocol. Users can link their Ethereum addresses to their Farcaster identity, enabling social features in onchain applications.

### What You Get With Neynar

- **SIWN (Sign In With Neynar)**: Authenticate users with their Farcaster identity
- **User Profiles**: Display Farcaster usernames, avatars, and bios
- **Social Context**: Show verification status and social connections
- **Enhanced UX**: Link wallet addresses to recognizable social identities

### Version

This app uses:
- `@neynar/nodejs-sdk` for server-side operations
- `@neynar/react` for client-side components

## Setup and Configuration

### 1. Get Neynar API Keys

1. Sign up at [https://neynar.com/](https://neynar.com/)
2. Create a new project
3. Get your API Key and Client ID from the dashboard

### 2. Environment Variables

Add to `.env.local`:

```bash
# Server-side API key (keep secret)
NEYNAR_API_KEY=your_neynar_api_key_here

# Client-side Client ID (public)
NEXT_PUBLIC_NEYNAR_CLIENT_ID=your_neynar_client_id_here
```

**Important**:
- `NEYNAR_API_KEY` is server-side only (no `NEXT_PUBLIC_` prefix)
- `NEXT_PUBLIC_NEYNAR_CLIENT_ID` is safe to expose in client code
- Both are required for Farcaster features to work
- If either is missing, Farcaster features are automatically disabled

### 3. Neynar Client Configuration

Server-side client in `lib/neynar-client.ts`:

```typescript
import { NeynarAPIClient } from '@neynar/nodejs-sdk';

// Initialize client (only if API key exists)
export const neynarClient = process.env.NEYNAR_API_KEY
  ? new NeynarAPIClient({
      apiKey: process.env.NEYNAR_API_KEY,
    })
  : null;

// Helper to check if Neynar is configured
export function isNeynarConfigured(): boolean {
  return !!process.env.NEYNAR_API_KEY && !!process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;
}
```

### 4. Provider Configuration

Neynar provider in `components/Providers.tsx`:

```typescript
import { NeynarContextProvider } from '@neynar/react';

export function Providers({ children }: { children: ReactNode }) {
  const isNeynarEnabled = !!process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider {...onchainKitConfig}>
          {isNeynarEnabled ? (
            <NeynarContextProvider
              settings={{
                clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID!,
              }}
            >
              {children}
            </NeynarContextProvider>
          ) : (
            children
          )}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## SIWN Authentication

### Overview

SIWN (Sign In With Neynar) allows users to authenticate with their Farcaster identity by signing a message with their wallet.

### Authentication Flow

1. User clicks "Connect Farcaster"
2. Generate SIWN message with user's wallet address
3. Request signature from user's wallet
4. Verify signature server-side with Neynar API
5. Store authentication state
6. Fetch and display user's Farcaster profile

### Implementation

#### Client-Side Component

`components/farcaster/FarcasterAuth.tsx`:

```typescript
import { useAccount, useSignMessage } from 'wagmi';
import { useState } from 'react';

interface FarcasterAuthProps {
  onSuccess?: (user: FarcasterUser) => void;
  onError?: (error: Error) => void;
}

export function FarcasterAuth({ onSuccess, onError }: FarcasterAuthProps) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!address) return;

    try {
      setIsLoading(true);

      // Step 1: Generate SIWN message
      const messageResponse = await fetch('/api/auth/farcaster/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });

      const { message } = await messageResponse.json();

      // Step 2: Sign message with wallet
      const signature = await signMessageAsync({ message });

      // Step 3: Verify signature server-side
      const verifyResponse = await fetch('/api/auth/farcaster/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Signature verification failed');
      }

      const { user } = await verifyResponse.json();

      // Step 4: Success!
      onSuccess?.(user);
    } catch (error) {
      console.error('SIWN authentication failed:', error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={!address || isLoading}
      className="btn-primary"
    >
      {isLoading ? 'Connecting...' : 'Connect Farcaster'}
    </button>
  );
}
```

#### Server-Side API Routes

**Generate SIWN Message** (`app/api/auth/farcaster/message/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { neynarClient, isNeynarConfigured } from '@/lib/neynar-client';

export async function POST(request: NextRequest) {
  if (!isNeynarConfigured()) {
    return NextResponse.json(
      { error: 'Neynar not configured' },
      { status: 503 }
    );
  }

  try {
    const { address } = await request.json();

    const message = await neynarClient!.generateSignInMessage({
      address,
      domain: process.env.NEXT_PUBLIC_APP_URL!,
      uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/farcaster/verify`,
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Failed to generate SIWN message:', error);
    return NextResponse.json(
      { error: 'Failed to generate message' },
      { status: 500 }
    );
  }
}
```

**Verify SIWN Signature** (`app/api/auth/farcaster/verify/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { neynarClient, isNeynarConfigured } from '@/lib/neynar-client';

export async function POST(request: NextRequest) {
  if (!isNeynarConfigured()) {
    return NextResponse.json(
      { error: 'Neynar not configured' },
      { status: 503 }
    );
  }

  try {
    const { message, signature } = await request.json();

    // Verify signature with Neynar
    const result = await neynarClient!.verifySignInMessage({
      message,
      signature,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Fetch user data
    const user = await neynarClient!.fetchBulkUsers([result.fid]);

    return NextResponse.json({ user: user.users[0] });
  } catch (error) {
    console.error('Failed to verify SIWN signature:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
```

## User Data Fetching

### Fetching by FID (Farcaster ID)

```typescript
import { neynarClient } from '@/lib/neynar-client';

export async function getUserByFid(fid: number) {
  if (!neynarClient) return null;

  try {
    const response = await neynarClient.fetchBulkUsers([fid]);
    return response.users[0];
  } catch (error) {
    console.error('Failed to fetch user by FID:', error);
    return null;
  }
}
```

### Fetching by Wallet Address

```typescript
import { neynarClient } from '@/lib/neynar-client';
import { Address } from 'viem';

export async function getUserByAddress(address: Address) {
  if (!neynarClient) return null;

  try {
    const response = await neynarClient.lookupUserByVerification(address);
    return response;
  } catch (error) {
    // User may not have Farcaster account - this is normal
    return null;
  }
}
```

### Custom Hook with Caching

`hooks/useFarcasterUser.ts`:

```typescript
import { useQuery } from '@tanstack/react-query';
import { Address } from 'viem';

export function useFarcasterUser(address?: Address) {
  return useQuery({
    queryKey: ['farcaster-user', address],
    queryFn: async () => {
      if (!address) return null;

      const response = await fetch(`/api/farcaster/user?address=${address}`);
      if (!response.ok) return null;

      return response.json();
    },
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry if user doesn't have Farcaster
  });
}
```

**Usage**:
```typescript
const { data: farcasterUser, isLoading } = useFarcasterUser(address);

if (isLoading) return <Skeleton />;
if (!farcasterUser) return <div>No Farcaster profile</div>;

return <FarcasterProfile user={farcasterUser} />;
```

## Farcaster Profile Display

### FarcasterProfile Component

`components/farcaster/FarcasterProfile.tsx`:

```typescript
import Image from 'next/image';
import { FarcasterUser } from '@/types/neynar';

interface FarcasterProfileProps {
  user: FarcasterUser;
  showBio?: boolean;
  showStats?: boolean;
}

export function FarcasterProfile({
  user,
  showBio = false,
  showStats = false,
}: FarcasterProfileProps) {
  return (
    <div className="flex items-start gap-3">
      {/* Avatar */}
      <Image
        src={user.pfp_url}
        alt={user.display_name}
        width={48}
        height={48}
        className="rounded-full"
      />

      <div className="flex-1">
        {/* Display Name */}
        <div className="font-semibold">{user.display_name}</div>

        {/* Username */}
        <a
          href={`https://warpcast.com/${user.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:underline"
        >
          @{user.username}
        </a>

        {/* FID */}
        <div className="text-xs text-muted-foreground">
          FID: {user.fid}
        </div>

        {/* Bio (optional) */}
        {showBio && user.profile.bio.text && (
          <p className="mt-2 text-sm">{user.profile.bio.text}</p>
        )}

        {/* Stats (optional) */}
        {showStats && (
          <div className="mt-2 flex gap-4 text-sm">
            <span>{user.follower_count} followers</span>
            <span>{user.following_count} following</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Inline Farcaster Badge

Show a small Farcaster indicator next to usernames:

```typescript
export function FarcasterBadge({ fid }: { fid: number }) {
  return (
    <a
      href={`https://warpcast.com/~/profiles/${fid}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-purple-500 hover:underline"
      title="View on Farcaster"
    >
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
        {/* Farcaster logo SVG path */}
      </svg>
      Farcaster
    </a>
  );
}
```

## Optional Feature Degradation

### Graceful Degradation Strategy

The app is designed to work perfectly without Neynar configuration:

1. **Check Configuration**: Always check if Neynar is configured before using features
2. **Hide UI Elements**: Don't show Farcaster buttons/links if not configured
3. **Fallback Display**: Show wallet addresses when Farcaster profiles unavailable
4. **No Errors**: Never show errors to users about missing Farcaster features

### Implementation Pattern

```typescript
import { isNeynarConfigured } from '@/lib/neynar-client';

export function UserDisplay({ address }: { address: Address }) {
  const { data: farcasterUser } = useFarcasterUser(
    isNeynarConfigured() ? address : undefined
  );

  if (farcasterUser) {
    return <FarcasterProfile user={farcasterUser} />;
  }

  // Fallback to OnchainKit Identity
  return (
    <Identity address={address}>
      <Avatar />
      <Name />
      <Address />
    </Identity>
  );
}
```

### Conditional Feature Rendering

```typescript
export function ProfilePage({ address }: { address: Address }) {
  const isNeynarEnabled = isNeynarConfigured();

  return (
    <div>
      <UserIdentity address={address} />

      {/* Only show Farcaster link if configured */}
      {isNeynarEnabled && (
        <FarcasterLink address={address} />
      )}

      {/* Rest of profile... */}
    </div>
  );
}
```

### Environment-Based Feature Flags

```typescript
// lib/features.ts
export const features = {
  farcaster: isNeynarConfigured(),
  // Other optional features...
};

// Usage
import { features } from '@/lib/features';

if (features.farcaster) {
  // Show Farcaster features
}
```

## Error Handling

### Error Handler Utility

`lib/error-handlers.ts`:

```typescript
export function handleNeynarError(error: Error): void {
  const message = error.message.toLowerCase();

  if (message.includes('api key')) {
    console.warn('Neynar API key invalid. Farcaster features disabled.');
    return;
  }

  if (message.includes('rate limit')) {
    showToast('Too many requests. Please try again later', 'warning');
    return;
  }

  if (message.includes('not found')) {
    // User doesn't have Farcaster - this is normal
    return;
  }

  if (message.includes('network')) {
    console.error('Neynar network error:', error);
    return;
  }

  // Generic error
  console.error('Neynar error:', error);
}
```

### Usage in Components

```typescript
import { handleNeynarError } from '@/lib/error-handlers';

<FarcasterAuth
  onError={handleNeynarError}
  onSuccess={(user) => {
    console.log('Authenticated:', user);
  }}
/>
```

### API Route Error Handling

```typescript
export async function GET(request: NextRequest) {
  if (!isNeynarConfigured()) {
    // Return 503 Service Unavailable (not 500 Internal Server Error)
    return NextResponse.json(
      { error: 'Farcaster features not available' },
      { status: 503 }
    );
  }

  try {
    const data = await neynarClient!.someMethod();
    return NextResponse.json(data);
  } catch (error) {
    handleNeynarError(error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
```

## Common Patterns

### Pattern 1: Optional Farcaster Display

Show Farcaster profile if available, otherwise show wallet identity:

```typescript
export function CreatorDisplay({ address }: { address: Address }) {
  const { data: farcasterUser, isLoading } = useFarcasterUser(address);

  if (isLoading) {
    return <Skeleton className="h-12 w-48" />;
  }

  return (
    <div>
      {farcasterUser ? (
        <FarcasterProfile user={farcasterUser} />
      ) : (
        <Identity address={address}>
          <Avatar />
          <Name />
        </Identity>
      )}
    </div>
  );
}
```

### Pattern 2: Farcaster Authentication Gate

Require Farcaster authentication for certain features:

```typescript
export function SocialFeature() {
  const [farcasterUser, setFarcasterUser] = useState<FarcasterUser | null>(null);

  if (!isNeynarConfigured()) {
    return <div>This feature requires Farcaster integration</div>;
  }

  if (!farcasterUser) {
    return (
      <div>
        <p>Connect your Farcaster account to use this feature</p>
        <FarcasterAuth onSuccess={setFarcasterUser} />
      </div>
    );
  }

  return <SocialFeatureContent user={farcasterUser} />;
}
```

### Pattern 3: Prefetch on Hover

Improve UX by prefetching Farcaster data on hover:

```typescript
import { useQueryClient } from '@tanstack/react-query';

export function RaffleCard({ raffle }: { raffle: Raffle }) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    if (isNeynarConfigured()) {
      queryClient.prefetchQuery({
        queryKey: ['farcaster-user', raffle.creator],
        queryFn: () => getUserByAddress(raffle.creator),
      });
    }
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      {/* Raffle card content */}
    </div>
  );
}
```

### Pattern 4: Batch User Fetching

Fetch multiple Farcaster users efficiently:

```typescript
export async function getUsersByFids(fids: number[]) {
  if (!neynarClient || fids.length === 0) return [];

  try {
    // Neynar supports batch fetching up to 100 users
    const response = await neynarClient.fetchBulkUsers(fids);
    return response.users;
  } catch (error) {
    handleNeynarError(error as Error);
    return [];
  }
}

// Usage in component
const { data: users } = useQuery({
  queryKey: ['farcaster-users', participantFids],
  queryFn: () => getUsersByFids(participantFids),
  enabled: participantFids.length > 0,
});
```

## Troubleshooting

### Issue: "Neynar not configured" Error

**Symptoms**: API routes return 503 error

**Solutions**:
1. Verify `NEYNAR_API_KEY` is set in `.env.local`
2. Verify `NEXT_PUBLIC_NEYNAR_CLIENT_ID` is set
3. Restart dev server after adding environment variables
4. Check that variables don't have extra spaces or quotes

### Issue: SIWN Signature Verification Fails

**Symptoms**: Authentication fails after signing message

**Solutions**:
1. Ensure you're signing with the same wallet that's connected
2. Check that `NEXT_PUBLIC_APP_URL` matches your actual URL
3. Verify Neynar API key is valid and active
4. Try disconnecting and reconnecting wallet
5. Check browser console for detailed error messages

### Issue: User Profile Not Loading

**Symptoms**: Farcaster profile shows loading state indefinitely

**Solutions**:
1. This is normal if the wallet address is not linked to Farcaster
2. Check that the user has verified their address on Farcaster
3. Verify network connectivity to Neynar API
4. Check browser console for API errors
5. Ensure proper error handling shows fallback UI

### Issue: Rate Limiting

**Symptoms**: "Too many requests" error from Neynar

**Solutions**:
1. Implement proper caching with TanStack Query
2. Increase `staleTime` to reduce API calls
3. Use batch fetching for multiple users
4. Upgrade Neynar plan if needed
5. Implement request debouncing for user searches

### Issue: Images Not Loading

**Symptoms**: Farcaster avatars show broken image icon

**Solutions**:
1. Verify Next.js Image component is configured for Neynar domains
2. Add to `next.config.ts`:
   ```typescript
   images: {
     domains: ['i.imgur.com', 'res.cloudinary.com'],
   }
   ```
3. Check that `pfp_url` exists in user data
4. Implement fallback avatar for missing images

### Issue: Stale User Data

**Symptoms**: User profile shows outdated information

**Solutions**:
1. Reduce `staleTime` in useQuery configuration
2. Implement manual refetch on user action
3. Use `queryClient.invalidateQueries()` after profile updates
4. Consider implementing webhook for real-time updates

### Getting More Help

- **Neynar Docs**: https://docs.neynar.com/
- **Neynar Discord**: Join for community support
- **Farcaster Docs**: https://docs.farcaster.xyz/
- **GitHub Issues**: Open an issue with error details

## Best Practices

1. **Always check if Neynar is configured** before using features
2. **Implement graceful degradation** for missing Farcaster profiles
3. **Cache aggressively** to reduce API calls and improve performance
4. **Handle errors silently** - don't show Farcaster errors to users
5. **Use batch fetching** when displaying multiple users
6. **Prefetch on hover** for better perceived performance
7. **Validate API responses** before using data
8. **Implement retry logic** for transient failures
9. **Monitor API usage** to stay within rate limits
10. **Test without Neynar** to ensure app works in degraded mode

## Security Considerations

1. **Never expose `NEYNAR_API_KEY`** in client code
2. **Always verify signatures server-side**, never client-side
3. **Validate all user input** before passing to Neynar API
4. **Implement rate limiting** on your API routes
5. **Use HTTPS** for all API communications
6. **Store authentication state securely** (HTTP-only cookies)
7. **Implement CSRF protection** for authentication endpoints
8. **Sanitize user-generated content** from Farcaster profiles
9. **Validate FIDs and addresses** before database storage
10. **Monitor for suspicious activity** in authentication logs

## Additional Resources

- [Neynar Documentation](https://docs.neynar.com/)
- [Neynar API Reference](https://docs.neynar.com/reference)
- [Farcaster Protocol](https://docs.farcaster.xyz/)
- [SIWN Specification](https://docs.neynar.com/docs/sign-in-with-neynar-siwn)
- [Neynar React SDK](https://github.com/neynarxyz/react)
- [Neynar Node.js SDK](https://github.com/neynarxyz/nodejs-sdk)
