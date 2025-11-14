import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export async function generateMetadata(): Promise<Metadata> {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app';
  
  return {
    title: 'Raffles - Non-Custodial Raffle Platform on Base',
    description: 'Create and enter raffles for NFTs, tokens, and ETH on Base blockchain. Fully decentralized and non-custodial.',
    keywords: ['raffle', 'base', 'blockchain', 'web3', 'non-custodial', 'nft'],
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: `${APP_URL}/embed-image.png`,
        button: {
          title: 'Launch Raffles',
          action: {
            type: 'launch_miniapp',
            name: 'Raffles',
            url: APP_URL,
            splashImageUrl: `${APP_URL}/splash.png`,
            splashBackgroundColor: '#000000',
          },
        },
      }),
    },
  };
}

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
