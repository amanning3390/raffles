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
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20 px-4">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          </div>

          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-pulse delay-700"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-3xl opacity-20 animate-pulse delay-1000"></div>

          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">100% Non-Custodial · No KYC Required</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-slide-up">
              Win Big on Base
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto animate-slide-up delay-200">
              The first truly decentralized raffle platform. Raffle ETH, tokens, and NFTs with complete transparency and zero platform custody.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-300">
              <Link href="/create">
                <Button size="lg" className="text-lg px-8 py-6 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
                  Create Raffle
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-2"
                onClick={() => {
                  document.getElementById('raffles-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse Raffles
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {mockRaffles.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Raffles</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {mockRaffles.reduce((acc, r) => acc + r.entries, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  2.1 ETH
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:scale-105 transition-transform">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                  24h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</div>
              </div>
            </div>
          </div>
        </section>

        {/* Raffles Section */}
        <section id="raffles-section" className="py-20 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Explore Raffles</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter to win amazing prizes secured on-chain
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
              <button
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter('all')}
              >
                All Raffles
              </button>
              <button
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  filter === AssetType.ETH
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter(AssetType.ETH)}
              >
                <span>💎</span> ETH
              </button>
              <button
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  filter === AssetType.ERC20
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter(AssetType.ERC20)}
              >
                <span>🪙</span> Tokens
              </button>
              <button
                className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  filter === AssetType.ERC721
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => setFilter(AssetType.ERC721)}
              >
                <span>🖼️</span> NFTs
              </button>
            </div>

            {/* Raffles Grid */}
            {filteredRaffles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRaffles.map((raffle, index) => (
                  <div
                    key={raffle.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <RaffleCard {...raffle} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎟️</div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">No raffles found for this filter</p>
                <Link href="/create">
                  <Button size="lg">Create the First Raffle</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Platform</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                Built on Base with security, transparency, and user experience as top priorities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-3xl mb-6">
                  🔒
                </div>
                <h3 className="text-xl font-bold mb-3">100% Non-Custodial</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  All funds are secured in audited smart contracts. Platform has zero custody or backdoors.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl mb-6">
                  🎭
                </div>
                <h3 className="text-xl font-bold mb-3">No KYC Required</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Connect your wallet and start immediately. Fully pseudonymous and privacy-first.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-3xl mb-6">
                  ⚡
                </div>
                <h3 className="text-xl font-bold mb-3">Base Network</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Lightning-fast transactions with minimal fees. Built on Coinbase's L2 solution.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-3xl mb-6">
                  🎲
                </div>
                <h3 className="text-xl font-bold mb-3">Provably Fair</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Winner selection is transparent and verifiable on-chain using blockhash randomness.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-3xl mb-6">
                  🌐
                </div>
                <h3 className="text-xl font-bold mb-3">Multi-Asset</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Raffle ETH, any ERC-20 token, or any ERC-721 NFT on the Base network.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-3xl mb-6">
                  💰
                </div>
                <h3 className="text-xl font-bold mb-3">Low Platform Fee</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Only 0.5% platform fee. Creators receive 99.5% of entry fees automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Create your first raffle in minutes or enter existing raffles to win amazing prizes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl text-lg px-8 py-6"
                >
                  Create Your Raffle
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                onClick={() => {
                  document.getElementById('raffles-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse Raffles
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
