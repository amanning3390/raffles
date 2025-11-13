'use client';

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AssetType, RaffleStatus } from '@/lib/contract';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

// Mock user data
const mockUserRaffles = {
  created: [
    {
      id: 1,
      assetType: AssetType.ETH,
      prizeAmount: '0.5 ETH',
      entries: 45,
      maxEntries: 100,
      status: RaffleStatus.Active,
      endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  ],
  entered: [
    {
      id: 2,
      assetType: AssetType.ERC721,
      prizeAmount: 'Bored Ape #1234',
      myEntries: 3,
      totalEntries: 78,
      status: RaffleStatus.Active,
      endsAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
    },
    {
      id: 3,
      assetType: AssetType.ERC20,
      prizeAmount: '1000 USDC',
      myEntries: 5,
      totalEntries: 156,
      status: RaffleStatus.Active,
      endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
  ],
  won: [
    {
      id: 10,
      assetType: AssetType.ETH,
      prizeAmount: '0.2 ETH',
      wonAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      claimed: false,
    },
  ],
};

const mockStats = {
  rafflesCreated: 5,
  rafflesEntered: 12,
  totalSpent: '0.125 ETH',
  totalWon: '0.3 ETH',
  winRate: '16.7%',
};

export default function ProfilePage({ params }: { params: { address: string } }) {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState<'created' | 'entered' | 'won'>('created');
  const isOwnProfile = connectedAddress?.toLowerCase() === params.address.toLowerCase();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                <div>
                  <h1 className="text-4xl font-bold mb-1">
                    {isOwnProfile ? 'Your Profile' : 'User Profile'}
                  </h1>
                  <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {params.address.slice(0, 6)}...{params.address.slice(-4)}
                  </p>
                </div>
              </div>
              {isOwnProfile && (
                <Link href="/create">
                  <Button>Create Raffle</Button>
                </Link>
              )}
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {mockStats.rafflesCreated}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Created</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {mockStats.rafflesEntered}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Entered</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {mockStats.totalWon}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Won</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {mockStats.totalSpent}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Spent</div>
            </Card>
            <Card className="text-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {mockStats.winRate}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b dark:border-gray-800">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-4 py-2 font-semibold transition-all duration-200 border-b-2 ${
                activeTab === 'created'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Created ({mockUserRaffles.created.length})
            </button>
            <button
              onClick={() => setActiveTab('entered')}
              className={`px-4 py-2 font-semibold transition-all duration-200 border-b-2 ${
                activeTab === 'entered'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Entered ({mockUserRaffles.entered.length})
            </button>
            <button
              onClick={() => setActiveTab('won')}
              className={`px-4 py-2 font-semibold transition-all duration-200 border-b-2 ${
                activeTab === 'won'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              Won ({mockUserRaffles.won.length})
            </button>
          </div>

          {/* Created Raffles Tab */}
          {activeTab === 'created' && (
            <div className="space-y-4">
              {mockUserRaffles.created.map((raffle) => (
                <Card key={raffle.id} hover>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-3xl">
                        {raffle.assetType === AssetType.ETH && '💎'}
                        {raffle.assetType === AssetType.ERC20 && '🪙'}
                        {raffle.assetType === AssetType.ERC721 && '🖼️'}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{raffle.prizeAmount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {raffle.entries}/{raffle.maxEntries} entries •{' '}
                          <span className={raffle.status === RaffleStatus.Active ? 'text-green-600' : 'text-gray-600'}>
                            {raffle.status === RaffleStatus.Active ? 'Active' : 'Ended'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/raffle/${raffle.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      {raffle.status === RaffleStatus.Active && (
                        <Button size="sm">End Raffle</Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {mockUserRaffles.created.length === 0 && (
                <Card className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No raffles created yet
                  </p>
                  <Link href="/create">
                    <Button>Create Your First Raffle</Button>
                  </Link>
                </Card>
              )}
            </div>
          )}

          {/* Entered Raffles Tab */}
          {activeTab === 'entered' && (
            <div className="space-y-4">
              {mockUserRaffles.entered.map((raffle) => (
                <Card key={raffle.id} hover>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-3xl">
                        {raffle.assetType === AssetType.ETH && '💎'}
                        {raffle.assetType === AssetType.ERC20 && '🪙'}
                        {raffle.assetType === AssetType.ERC721 && '🖼️'}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-lg">{raffle.prizeAmount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Your entries: {raffle.myEntries} • Total: {raffle.totalEntries}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm font-semibold text-blue-600">
                        {((raffle.myEntries / raffle.totalEntries) * 100).toFixed(1)}% chance
                      </span>
                      <Link href={`/raffle/${raffle.id}`}>
                        <Button variant="outline" size="sm">
                          View Raffle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
              {mockUserRaffles.entered.length === 0 && (
                <Card className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You haven't entered any raffles yet
                  </p>
                  <Link href="/">
                    <Button>Browse Raffles</Button>
                  </Link>
                </Card>
              )}
            </div>
          )}

          {/* Won Raffles Tab */}
          {activeTab === 'won' && (
            <div className="space-y-4">
              {mockUserRaffles.won.map((raffle) => (
                <Card key={raffle.id} hover className="border-2 border-green-500">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-3xl">🏆</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold text-lg">{raffle.prizeAmount}</div>
                          {!raffle.claimed && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold rounded">
                              UNCLAIMED
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Won {raffle.wonAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {!raffle.claimed ? (
                      <Button size="lg" variant="secondary">
                        Claim Prize
                      </Button>
                    ) : (
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ✓ Claimed
                      </span>
                    )}
                  </div>
                </Card>
              ))}
              {mockUserRaffles.won.length === 0 && (
                <Card className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No wins yet - keep trying!
                  </p>
                  <Link href="/">
                    <Button>Enter Raffles</Button>
                  </Link>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
