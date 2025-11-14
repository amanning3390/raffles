import { NextResponse } from 'next/server';

function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => 
      Array.isArray(value) ? value.length > 0 : !!value
    )
  );
}

export async function GET() {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app';
  
  const manifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: ""
    },
    baseBuilder: {
      ownerAddress: process.env.NEXT_PUBLIC_BASE_BUILDER_ADDRESS || "0x"
    },
    miniapp: withValidProperties({
      version: "1",
      name: "Raffles",
      homeUrl: APP_URL,
      iconUrl: `${APP_URL}/icon.png`,
      splashImageUrl: `${APP_URL}/splash.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${APP_URL}/api/webhook`,
      subtitle: "Non-Custodial Raffle Platform",
      description: "Create and enter raffles for NFTs, tokens, and ETH on Base blockchain. Fully decentralized and non-custodial with zero platform custody.",
      screenshotUrls: [
        `${APP_URL}/screenshot1.png`,
        `${APP_URL}/screenshot2.png`,
        `${APP_URL}/screenshot3.png`
      ],
      primaryCategory: "utility",
      tags: ["raffle", "base", "web3", "blockchain", "non-custodial", "nft", "defi"],
      heroImageUrl: `${APP_URL}/hero.png`,
      tagline: "Raffle Anything on Base",
      ogTitle: "Raffles - Non-Custodial Raffle Platform on Base",
      ogDescription: "Create and enter raffles for NFTs, tokens, and ETH on Base blockchain. Fully decentralized and non-custodial.",
      ogImageUrl: `${APP_URL}/og-image.png`,
      noindex: false
    })
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

