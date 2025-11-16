/**
 * Neynar SDK Type Definitions
 * Centralized type exports from @neynar/nodejs-sdk for type safety
 */

import type { Address } from 'viem';

/**
 * Custom app-specific Neynar user type
 * Simplified and optimized for our application needs
 */
export interface NeynarUser {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  verifiedAddresses: Address[];
  connectedAt?: Date;
}

/**
 * SIWN (Sign In With Neynar) message parameters
 */
export interface SIWNMessageParams {
  address: Address;
  domain: string;
  uri: string;
  statement?: string;
  nonce?: string;
}

/**
 * SIWN verification parameters
 */
export interface SIWNVerificationParams {
  message: string;
  signature: string;
}

/**
 * SIWN verification result
 */
export interface SIWNVerificationResult {
  success: boolean;
  fid?: number;
  message?: string;
  error?: string;
}

/**
 * Farcaster authentication state
 */
export interface FarcasterAuthState {
  user: NeynarUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Neynar API error response
 */
export interface NeynarAPIError {
  message: string;
  code?: string;
  statusCode?: number;
}

/**
 * Props for Farcaster authentication component
 */
export interface FarcasterAuthProps {
  onSuccess?: (user: NeynarUser) => void;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * Props for Farcaster profile display component
 */
export interface FarcasterProfileProps {
  fid?: number;
  address?: Address;
  showAvatar?: boolean;
  showBio?: boolean;
  className?: string;
}

/**
 * Neynar client configuration
 */
export interface NeynarClientConfig {
  apiKey: string;
  basePath?: string;
}

/**
 * User lookup parameters
 */
export interface UserLookupParams {
  fid?: number;
  address?: Address;
  username?: string;
}

/**
 * Type guard to check if error is a Neynar API error
 */
export function isNeynarAPIError(error: unknown): error is NeynarAPIError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as NeynarAPIError).message === 'string'
  );
}
