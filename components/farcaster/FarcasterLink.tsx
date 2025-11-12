'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

/**
 * Optional Farcaster linking component
 * Users can skip this and use the app wallet-only
 */
export function FarcasterLink() {
  const { address, isConnected } = useAccount();
  const [showPrompt, setShowPrompt] = useState(false);
  const [farcasterLinked, setFarcasterLinked] = useState(false);

  // Don't show if wallet not connected
  if (!isConnected) {
    return null;
  }

  // User already linked or dismissed
  if (farcasterLinked || !showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="text-2xl">🟣</div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">Link Farcaster (Optional)</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Connect your Farcaster profile for social features like sharing raffles and activity feeds.
            <strong className="block mt-1">You can skip this and use the app wallet-only.</strong>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                // TODO: Implement Neynar SIWN flow in Phase 4
                setFarcasterLinked(true);
              }}
              className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition"
            >
              Link Farcaster
            </button>
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
        >
          ✕
        </button>
      </div>
    </div>
  );
}
