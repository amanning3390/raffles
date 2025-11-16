'use client';

import { useState, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { useToast } from '@/components/ui/toast';
import { type NeynarUser } from '@/lib/neynar-client';
import type { FarcasterAuthState } from '@/types/neynar';
import { handleErrorWithToast, handleNeynarError } from '@/lib/error-handlers';

/**
 * Farcaster authentication component using SIWN (Sign In With Neynar)
 * 
 * This component implements the complete SIWN authentication flow:
 * 1. Generate SIWN message
 * 2. Request signature from user's wallet
 * 3. Verify signature with server-side API
 * 4. Store authentication state
 * 
 * Requirements: 3.1, 3.2, 4.3, 6.2
 */

/**
 * Props for FarcasterAuth component
 * Extends base FarcasterAuthProps with additional UI options
 */
interface FarcasterAuthProps {
  onSuccess?: (user: NeynarUser) => void;
  onError?: (error: Error) => void;
  buttonText?: string;
  className?: string;
}

/**
 * Internal authentication state
 * Similar to FarcasterAuthState but with string error for UI display
 */
interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: NeynarUser | null;
  error: string | null;
}

export function FarcasterAuth({
  onSuccess,
  onError,
  buttonText = 'Link Farcaster',
  className = '',
}: FarcasterAuthProps) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { showToast } = useToast();

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    error: null,
  });

  /**
   * Generate SIWN message for the user to sign
   */
  const generateSIWNMessage = useCallback(async (): Promise<string> => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    const domain = window.location.host;
    const uri = window.location.origin;
    const statement = 'Sign in to Raffles with your Farcaster account';
    const nonce = Math.random().toString(36).substring(2, 15);
    const issuedAt = new Date().toISOString();

    // Create SIWN message following EIP-4361 format
    const message = [
      `${domain} wants you to sign in with your Ethereum account:`,
      address,
      '',
      statement,
      '',
      `URI: ${uri}`,
      `Version: 1`,
      `Chain ID: 1`,
      `Nonce: ${nonce}`,
      `Issued At: ${issuedAt}`,
    ].join('\n');

    return message;
  }, [address]);

  /**
   * Verify the signed message with the server
   */
  const verifySignature = useCallback(
    async (message: string, signature: string): Promise<NeynarUser> => {
      const response = await fetch('/api/auth/farcaster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          signature,
          address,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Authentication failed');
      }

      const data = await response.json();
      
      if (!data.success || !data.user) {
        throw new Error('Invalid response from server');
      }

      return data.user;
    },
    [address]
  );

  /**
   * Handle the complete SIWN authentication flow
   */
  const handleAuthenticate = useCallback(async () => {
    if (!isConnected || !address) {
      showToast('Please connect your wallet first', 'warning');
      return;
    }

    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // Step 1: Generate SIWN message
      const message = await generateSIWNMessage();

      // Step 2: Request signature from user's wallet
      let signature: string;
      try {
        signature = await signMessageAsync({ message });
      } catch (signError) {
        // User rejected signature
        if (signError instanceof Error && signError.message.includes('User rejected')) {
          throw new Error('Signature request was cancelled');
        }
        throw signError;
      }

      // Step 3: Verify signature with server
      const user = await verifySignature(message, signature);

      // Step 4: Update authentication state
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        user,
        error: null,
      });

      // Show success message
      showToast(`Successfully linked Farcaster account @${user.username}`, 'success');

      // Call success callback
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (error) {
      // Use centralized error handler
      const errorResult = handleErrorWithToast(
        error,
        handleNeynarError,
        'FarcasterAuth',
        showToast
      );

      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: errorResult.message,
      });

      // Call error callback
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [
    isConnected,
    address,
    generateSIWNMessage,
    signMessageAsync,
    verifySignature,
    showToast,
    onSuccess,
    onError,
  ]);

  // Don't render if wallet not connected
  if (!isConnected) {
    return null;
  }

  // Show authenticated state
  if (authState.isAuthenticated && authState.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-purple-600">🟣</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Connected as @{authState.user.username}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleAuthenticate}
        disabled={authState.isLoading}
        className={`
          px-4 py-2 bg-purple-600 text-white rounded-lg
          hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors flex items-center justify-center gap-2
          ${className}
        `}
      >
        {authState.isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Authenticating...</span>
          </>
        ) : (
          <>
            <span>🟣</span>
            <span>{buttonText}</span>
          </>
        )}
      </button>

      {authState.error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {authState.error}
        </p>
      )}
    </div>
  );
}
