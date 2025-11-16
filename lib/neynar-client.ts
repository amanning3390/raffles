import { NeynarAPIClient } from '@neynar/nodejs-sdk';
import type { Address } from 'viem';
import type {
  NeynarUser,
  NeynarClientConfig,
} from '@/types/neynar';

/**
 * Re-export NeynarUser type for convenience
 */
export type { NeynarUser } from '@/types/neynar';

/**
 * Neynar API user response type
 * Using any for now as the SDK types are not exported properly
 */
type NeynarUserResponse = any;

/**
 * Neynar SDK client for Farcaster integration
 * Handles user data fetching, SIWN authentication, and profile management
 */

/**
 * Initialize Neynar client only if API key is available
 * Singleton pattern to ensure single client instance
 */
let neynarClient: NeynarAPIClient | null = null;

if (process.env.NEYNAR_API_KEY) {
  neynarClient = new NeynarAPIClient({
    apiKey: process.env.NEYNAR_API_KEY,
  });
}

/**
 * Check if Neynar is configured and available
 * 
 * @returns true if Neynar client is initialized, false otherwise
 */
export function isNeynarAvailable(): boolean {
  return neynarClient !== null;
}

/**
 * Transform Neynar API user response to our simplified user type
 * Extracts only the fields we need for the application
 * 
 * @param user - Raw user response from Neynar API
 * @returns Simplified NeynarUser object
 */
function transformNeynarUser(user: NeynarUserResponse): NeynarUser {
  return {
    fid: user.fid,
    username: user.username,
    displayName: user.display_name || user.username,
    pfpUrl: user.pfp_url || '',
    bio: user.profile?.bio?.text || '',
    followerCount: user.follower_count || 0,
    followingCount: user.following_count || 0,
    verifiedAddresses: (user.verified_addresses?.eth_addresses || []) as Address[],
  };
}

/**
 * Fetch user data by Farcaster ID (FID)
 * 
 * @param fid - Farcaster user ID
 * @returns User data or null if not found
 * @throws Error if API request fails (except for not found)
 */
export async function getUserByFid(fid: number): Promise<NeynarUser | null> {
  if (!neynarClient) {
    console.warn('Neynar client not initialized. Farcaster features disabled.');
    return null;
  }

  try {
    const response = await neynarClient.fetchBulkUsers({ fids: [fid] });
    
    if (!response.users || response.users.length === 0) {
      return null;
    }

    const user = response.users[0];
    return transformNeynarUser(user);
  } catch (error) {
    console.error('Error fetching user by FID:', error);
    return null;
  }
}

/**
 * Fetch user data by Ethereum address
 * Looks up Farcaster profile associated with the given address
 * 
 * @param address - Ethereum address to lookup
 * @returns User data or null if not found
 * @throws Error if API request fails (except for not found)
 */
export async function getUserByAddress(address: Address): Promise<NeynarUser | null> {
  if (!neynarClient) {
    console.warn('Neynar client not initialized. Farcaster features disabled.');
    return null;
  }

  try {
    const response = await neynarClient.fetchBulkUsersByEthOrSolAddress({
      addresses: [address],
    });
    
    if (!response || !response[address] || response[address].length === 0) {
      return null;
    }

    const user = response[address][0];
    return transformNeynarUser(user);
  } catch (error) {
    // User not found is expected for addresses without Farcaster
    if (error instanceof Error && error.message.includes('not found')) {
      return null;
    }
    console.error('Error fetching user by address:', error);
    return null;
  }
}

/**
 * Note: SIWN (Sign In With Neynar) authentication is handled by the @neynar/react
 * package's NeynarAuthButton component. This provides a complete authentication flow
 * with signature generation and verification built-in.
 * 
 * For server-side verification of SIWN signatures, use the API route at
 * /api/auth/farcaster which will validate the signature and return user data.
 * 
 * Error handling for Neynar operations is centralized in lib/error-handlers.ts
 */
