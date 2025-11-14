'use client';

import { Navbar } from '@/components/Navbar';
import { RaffleCard } from '@/components/raffle/RaffleCard';
import { Button } from '@/components/ui/button';
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
      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-4 overflow-hidden">
          {/* Subtle background accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/10 pointer-events-none" />

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center max-w-4xl mx-auto mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 shadow-lg shadow-blue-500/10 dark:shadow-blue-500/5 border border-blue-100 dark:border-blue-900 rounded-full mb-8 text-sm font-semibold text-blue-700 dark:text-blue-300 backdrop-blur-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                Non-Custodial · No KYC
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 text-gray-900 dark:text-white tracking-tight">
                Raffle Anything
                <span className="block mt-2 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                  on Base
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
                Create and enter raffles for ETH, tokens, and NFTs. 100% decentralized with zero platform custody.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg font-semibold shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300">
                    Create Raffle
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border-2"
                  onClick={() => {
                    document.getElementById('raffles-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Browse Raffles
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="group bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {mockRaffles.length}
                </div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Active Raffles</div>
              </div>
              <div className="group bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {mockRaffles.reduce((acc, r) => acc + r.entries, 0)}
                </div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Entries</div>
              </div>
              <div className="group bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  2.1 ETH
                </div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prize Volume</div>
              </div>
              <div className="group bg-white dark:bg-gray-900 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1">
                <div className="text-4xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  24h
                </div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg Duration</div>
              </div>
            </div>
          </div>
        </section>

        {/* Raffles Section */}
        <section id="raffles-section" className="py-24 px-4 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">Active Raffles</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                Browse and enter live raffles on Base
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-105'
                }`}
                onClick={() => setFilter('all')}
              >
                All Raffles
              </button>
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                  filter === AssetType.ETH
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-105'
                }`}
                onClick={() => setFilter(AssetType.ETH)}
              >
                ETH
              </button>
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                  filter === AssetType.ERC20
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-105'
                }`}
                onClick={() => setFilter(AssetType.ERC20)}
              >
                Tokens
              </button>
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                  filter === AssetType.ERC721
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-800 hover:scale-105'
                }`}
                onClick={() => setFilter(AssetType.ERC721)}
              >
                NFTs
              </button>
            </div>

            {/* Raffles Grid */}
            {filteredRaffles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRaffles.map((raffle) => (
                  <RaffleCard key={raffle.id} {...raffle} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                <div className="text-6xl mb-6">🎟️</div>
                <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-8">No raffles found</p>
                <Link href="/create">
                  <Button className="shadow-xl shadow-blue-500/20">Create Raffle</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">Why Choose Raffles</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                Built on Base for speed, security, and true decentralization
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white dark:bg-gray-900 rounded-2xl p-10 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                  🔒
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">Non-Custodial</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  All funds secured in smart contracts with zero platform custody. You control your assets.
                </p>
              </div>

              <div className="group bg-white dark:bg-gray-900 rounded-2xl p-10 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  🎲
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">Provably Fair</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Transparent winner selection verifiable on-chain. No manipulation, guaranteed fairness.
                </p>
              </div>

              <div className="group bg-white dark:bg-gray-900 rounded-2xl p-10 shadow-xl shadow-gray-200/50 dark:shadow-gray-950/50 hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-gray-900/50 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">Low Fees</h3>
                <p className="text-base text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                  Only 0.5% platform fee on Base network. Fast transactions, minimal costs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
