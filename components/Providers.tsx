'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { config } from '@/lib/wagmi';
import { ReactNode } from 'react';
import { ToastProvider } from './ui/toast';

// Create a client
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY}
          chain={base}
          config={{
            appearance: {
              name: 'Raffles',
              logo: 'https://avatars.githubusercontent.com/u/37784886',
              mode: 'auto',
              theme: 'default',
            },
          }}
        >
          <ToastProvider>{children}</ToastProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
