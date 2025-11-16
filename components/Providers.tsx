'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import type { AppConfig } from '@/types/onchainkit';
import { NeynarContextProvider, Theme } from '@neynar/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base, baseSepolia } from 'wagmi/chains';
import type { Chain } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi';
import { ReactNode } from 'react';
import { ToastProvider } from './ui/toast';
import { ErrorBoundary } from './ui/error-boundary';

/**
 * Create a TanStack Query client with optimized defaults
 * Configured for blockchain data caching patterns
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Determine the chain based on environment
 * Defaults to Base mainnet if not specified
 */
const chainId = process.env.NEXT_PUBLIC_CHAIN_ID 
  ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) 
  : base.id;
const chain: Chain = chainId === baseSepolia.id ? baseSepolia : base;

/**
 * OnchainKit configuration with all required parameters
 * Follows OnchainKit best practices for appearance and branding
 */
const appConfig: AppConfig = {
  appearance: {
    name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Raffles',
    logo: 'https://avatars.githubusercontent.com/u/37784886',
    mode: 'auto',
    theme: 'default',
  },
};

// Check if Neynar is configured
const isNeynarConfigured = 
  typeof process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID === 'string' && 
  process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID.length > 0;

// Log Neynar configuration status in development
if (process.env.NODE_ENV === 'development') {
  if (!isNeynarConfigured) {
    console.warn(
      'Neynar is not configured. Farcaster features will be disabled. ' +
      'Set NEXT_PUBLIC_NEYNAR_CLIENT_ID to enable Farcaster integration.'
    );
  }
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-2">Provider Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Failed to initialize application providers. Please check your configuration and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      }
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <OnchainKitProvider
            apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
            chain={chain}
            config={appConfig}
          >
            {isNeynarConfigured ? (
              <NeynarContextProvider
                settings={{
                  clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || '',
                  defaultTheme: Theme.Dark,
                  eventsCallbacks: {
                    onAuthSuccess: () => {
                      console.log('Farcaster authentication successful');
                    },
                    onSignout: () => {
                      console.log('Farcaster signed out');
                    },
                  },
                }}
              >
                <ToastProvider>{children}</ToastProvider>
              </NeynarContextProvider>
            ) : (
              <ToastProvider>{children}</ToastProvider>
            )}
          </OnchainKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}
