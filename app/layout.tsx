import type { Metadata } from 'next';
import '@coinbase/onchainkit/styles.css';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Raffles - Non-Custodial Raffle Platform on Base',
  description: 'Create and enter raffles for NFTs, tokens, and ETH on Base blockchain. Fully decentralized and non-custodial.',
  keywords: ['raffle', 'base', 'blockchain', 'web3', 'non-custodial', 'nft'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
