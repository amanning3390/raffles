'use client';

import { Navbar } from '@/components/Navbar';
import { RaffleCard } from '@/components/raffle/RaffleCard';
import { Card } from '@/components/ui/card';
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
      <main className="min-h-screen pt-24 px-4 pb-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Active Raffles</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Enter raffles and win amazing prizes on Base
              </p>
            </div>
            <Link href="/create">
              <Button size="lg">Create Raffle</Button>
            </Link>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{mockRaffles.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Raffles</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {mockRaffles.reduce((acc, r) => acc + r.entries, 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Entries</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">2.1 ETH</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Value</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">24h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Raffles
            </Button>
            <Button
              variant={filter === AssetType.ETH ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(AssetType.ETH)}
            >
              💎 ETH
            </Button>
            <Button
              variant={filter === AssetType.ERC20 ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(AssetType.ERC20)}
            >
              🪙 Tokens
            </Button>
            <Button
              variant={filter === AssetType.ERC721 ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(AssetType.ERC721)}
            >
              🖼️ NFTs
            </Button>
          </div>

          {/* Raffles Grid */}
          {filteredRaffles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRaffles.map((raffle) => (
                <RaffleCard key={raffle.id} {...raffle} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No raffles found</p>
              <Link href="/create">
                <Button>Create the First Raffle</Button>
              </Link>
            </Card>
          )}

          {/* Info Banner */}
          <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-purple-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold mb-1">Non-Custodial</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  All funds secured in smart contracts
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎭</div>
                <h3 className="font-semibold mb-1">No KYC</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wallet-only, fully pseudonymous
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">Base Network</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Fast & cheap transactions
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
