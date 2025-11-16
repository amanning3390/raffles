'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { FarcasterAuth } from './FarcasterAuth';
import type { NeynarUser } from '@/lib/neynar-client';
import { logError, handleNeynarError } from '@/lib/error-handlers';

/**
 * Optional Farcaster linking component
 * Users can skip this and use the app wallet-only
 * 
 * This component shows a prompt to link Farcaster after wallet connection.
 * It uses the FarcasterAuth component for the actual authentication flow.
 * 
 * Requirements: 3.4
 */
export function FarcasterLink() {
  const { address, isConnected } = useAccount();
  const [showPrompt, setShowPrompt] = useState(false);
  const [farcasterLinked, setFarcasterLinked] = useState(false);
  const [linkedUser, setLinkedUser] = useState<NeynarUser | null>(null);

  // Check if Neynar is configured
  const isNeynarConfigured = 
    typeof process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID === 'string' && 
    process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID.length > 0;

  // Show prompt after wallet connection (with a small delay)
  useEffect(() => {
    if (isConnected && !farcasterLinked && isNeynarConfigured) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 2000); // Show prompt 2 seconds after wallet connection

      return () => clearTimeout(timer);
    }
  }, [isConnected, farcasterLinked, isNeynarConfigured]);

  // Handle successful Farcaster authentication
  const handleAuthSuccess = (user: NeynarUser) => {
    setFarcasterLinked(true);
    setLinkedUser(user);
    setShowPrompt(false);
  };

  // Handle authentication error
  const handleAuthError = (error: Error) => {
    // Use centralized error handler for logging
    const errorResult = handleNeynarError(error);
    logError('FarcasterLink', errorResult);
    // Keep the prompt open so user can retry
  };

  // Don't show if:
  // - Wallet not connected
  // - Neynar not configured (graceful degradation)
  // - User already linked
  // - User dismissed the prompt
  if (!isConnected || !isNeynarConfigured || farcasterLinked || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-4 animate-slide-up z-50">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🟣</div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Link Farcaster (Optional)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Connect your Farcaster profile for social features like sharing raffles and activity feeds.
            <strong className="block mt-1">You can skip this and use the app wallet-only.</strong>
          </p>
          <div className="flex gap-2">
            <FarcasterAuth
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
              buttonText="Link Farcaster"
              className="text-sm px-3 py-1.5"
            />
            <button
              onClick={() => setShowPrompt(false)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-700 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Skip
            </button>
          </div>
        </div>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
