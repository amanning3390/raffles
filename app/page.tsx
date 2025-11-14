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
      <main className="min-h-screen bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full mb-6 text-sm font-medium text-blue-700 dark:text-blue-300">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                Non-Custodial · No KYC
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white">
                Raffle Anything
                <span className="block text-blue-600 dark:text-blue-400">on Base</span>
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                Create and enter raffles for ETH, tokens, and NFTs. 100% decentralized with zero platform custody.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/create">
                  <Button size="lg" className="w-full sm:w-auto">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {mockRaffles.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {mockRaffles.reduce((acc, r) => acc + r.entries, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Entries</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  2.1 ETH
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Volume</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  24h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Raffles Section */}
        <section id="raffles-section" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-10">
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Active Raffles</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Browse and enter live raffles on Base
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setFilter('all')}
              >
                All Raffles
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  filter === AssetType.ETH
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setFilter(AssetType.ETH)}
              >
                ETH
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  filter === AssetType.ERC20
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setFilter(AssetType.ERC20)}
              >
                Tokens
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap ${
                  filter === AssetType.ERC721
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
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
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🎟️</div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">No raffles found</p>
                <Link href="/create">
                  <Button>Create Raffle</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-white dark:bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4">
                  🔒
                </div>
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Non-Custodial</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All funds secured in smart contracts with zero platform custody
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4">
                  🎲
                </div>
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Provably Fair</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Transparent winner selection verifiable on-chain
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center text-2xl mx-auto mb-4">
                  ⚡
                </div>
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Low Fees</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Only 0.5% platform fee on Base network
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
