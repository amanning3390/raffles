'use client';

import { Navbar } from '@/components/Navbar';
import { RaffleCard } from '@/components/raffle/RaffleCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AssetType } from '@/lib/contract';
import { useState } from 'react';
import Link from 'next/link';

// Mock data - will be replaced with real data from contract
const mockRaffles = [
  {
    id: 1,
    assetType: AssetType.ETH,
    prizeAmount: '0.5 ETH',
    entryFee: '0.01',
    entries: 45,
    maxEntries: 100,
    endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    creator: '0x1234567890123456789012345678901234567890',
  },
  {
    id: 2,
    assetType: AssetType.ERC721,
    prizeAmount: 'Bored Ape #1234',
    entryFee: '0.05',
    entries: 78,
    maxEntries: 200,
    endsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    creator: '0x2345678901234567890123456789012345678901',
  },
  {
    id: 3,
    assetType: AssetType.ERC20,
    prizeAmount: '1000 USDC',
    entryFee: '0.001',
    entries: 156,
    maxEntries: 500,
    endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    creator: '0x3456789012345678901234567890123456789012',
  },
  {
    id: 4,
    assetType: AssetType.ETH,
    prizeAmount: '0.1 ETH',
    entryFee: '0.005',
    entries: 23,
    maxEntries: 50,
    endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    creator: '0x4567890123456789012345678901234567890123',
  },
  {
    id: 5,
    assetType: AssetType.ERC20,
    prizeAmount: '500 DAI',
    entryFee: '0.002',
    entries: 89,
    maxEntries: 250,
    endsAt: new Date(Date.now() + 36 * 60 * 60 * 1000),
    creator: '0x5678901234567890123456789012345678901234',
  },
];

export default function HomePage() {
  const [filter, setFilter] = useState<'all' | AssetType>('all');

  const filteredRaffles =
    filter === 'all' ? mockRaffles : mockRaffles.filter((r) => r.assetType === filter);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
        {/* Hero Section */}
        <section className="relative pt-32 pb-28 px-4 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 dark:from-blue-500/10 dark:via-transparent dark:to-purple-500/10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-in">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 glass-effect shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5 rounded-full mb-8 text-sm font-semibold text-blue-700 dark:text-blue-300 animate-slide-up">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Non-Custodial · No KYC · 100% On-Chain
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 text-gray-900 dark:text-white tracking-tight animate-slide-up">
                Raffle Anything
                <span className="block mt-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  on Base
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium animate-slide-up">
                Create and enter raffles for ETH, tokens, and NFTs. 100% decentralized with zero platform custody.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                <Link href="/create">
                  <Button size="lg" variant="gradient" className="w-full sm:w-auto">
                    Create Raffle
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    document.getElementById('raffles-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Browse Raffles
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto animate-slide-up">
              <Card className="text-center p-6 md:p-8">
                <div className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {mockRaffles.length}
                </div>
                <div className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Raffles</div>
              </Card>
              <Card className="text-center p-6 md:p-8">
                <div className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {mockRaffles.reduce((acc, r) => acc + r.entries, 0)}
                </div>
                <div className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Entries</div>
              </Card>
              <Card className="text-center p-6 md:p-8">
                <div className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  2.1 ETH
                </div>
                <div className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prize Volume</div>
              </Card>
              <Card className="text-center p-6 md:p-8">
                <div className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-br from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  24h
                </div>
                <div className="text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Duration</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Raffles Section */}
        <section id="raffles-section" className="py-24 md:py-32 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-12 md:mb-16 text-center md:text-left animate-fade-in">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
                Active Raffles
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl">
                Browse and enter live raffles on Base
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-12 overflow-x-auto pb-3 scrollbar-hide" role="tablist" aria-label="Filter raffles by asset type">
              <button
                role="tab"
                aria-selected={filter === 'all'}
                aria-label="Show all raffles"
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'glass-effect text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-105'
                }`}
                onClick={() => setFilter('all')}
              >
                All Raffles
              </button>
              <button
                role="tab"
                aria-selected={filter === AssetType.ETH}
                aria-label="Show ETH raffles only"
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                  filter === AssetType.ETH
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'glass-effect text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-105'
                }`}
                onClick={() => setFilter(AssetType.ETH)}
              >
                ETH
              </button>
              <button
                role="tab"
                aria-selected={filter === AssetType.ERC20}
                aria-label="Show token raffles only"
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                  filter === AssetType.ERC20
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'glass-effect text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-105'
                }`}
                onClick={() => setFilter(AssetType.ERC20)}
              >
                Tokens
              </button>
              <button
                role="tab"
                aria-selected={filter === AssetType.ERC721}
                aria-label="Show NFT raffles only"
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                  filter === AssetType.ERC721
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'glass-effect text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-105'
                }`}
                onClick={() => setFilter(AssetType.ERC721)}
              >
                NFTs
              </button>
            </div>

            {/* Raffles Grid */}
            {filteredRaffles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredRaffles.map((raffle, index) => (
                  <div key={raffle.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <RaffleCard {...raffle} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-24 animate-fade-in">
                <div className="text-7xl mb-6">🎟️</div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No raffles found</p>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Be the first to create a raffle and start the fun!
                </p>
                <Link href="/create">
                  <Button variant="gradient" size="lg">Create Raffle</Button>
                </Link>
              </Card>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 md:mb-20 animate-fade-in">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
                Why Choose Raffles
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                Built on Base for speed, security, and true decentralization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="text-center p-8 md:p-10 animate-slide-up">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl md:text-4xl mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  🔒
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Non-Custodial</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  All funds secured in smart contracts with zero platform custody. You control your assets.
                </p>
              </Card>

              <Card className="text-center p-8 md:p-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl md:text-4xl mx-auto mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  🎲
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Provably Fair</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Transparent winner selection verifiable on-chain. No manipulation, guaranteed fairness.
                </p>
              </Card>

              <Card className="text-center p-8 md:p-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl md:text-4xl mx-auto mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Low Fees</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                  Only 0.5% platform fee on Base network. Fast transactions, minimal costs.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
