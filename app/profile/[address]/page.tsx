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
      <main className="min-h-screen pt-28 px-4 pb-16 animate-fade-in bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8 animate-slide-up">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-lg shadow-blue-500/30">
                  👤
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {isOwnProfile ? 'Your Profile' : 'User Profile'}
                  </h1>
                  <p className="font-mono text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg inline-block">
                    {params.address.slice(0, 6)}...{params.address.slice(-4)}
                  </p>
                </div>
              </div>
              {isOwnProfile && (
                <Link href="/create">
                  <Button variant="gradient" size="lg">Create Raffle</Button>
                </Link>
              )}
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <Card className="text-center p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-br from-blue-600 to-blue-700 bg-clip-text text-transparent">
                {mockStats.rafflesCreated}
              </div>
              <div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Created</div>
            </Card>
            <Card className="text-center p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-br from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {mockStats.rafflesEntered}
              </div>
              <div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Entered</div>
            </Card>
            <Card className="text-center p-6 border-2 border-green-200 dark:border-green-800">
              <div className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-br from-green-600 to-green-700 bg-clip-text text-transparent">
                {mockStats.totalWon}
              </div>
              <div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Won</div>
            </Card>
            <Card className="text-center p-6 border-2 border-orange-200 dark:border-orange-800">
              <div className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-br from-orange-600 to-orange-700 bg-clip-text text-transparent">
                {mockStats.totalSpent}
              </div>
              <div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Spent</div>
            </Card>
            <Card className="text-center p-6 border-2 border-pink-200 dark:border-pink-800">
              <div className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-br from-pink-600 to-pink-700 bg-clip-text text-transparent">
                {mockStats.winRate}
              </div>
              <div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Win Rate</div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-3 scrollbar-hide">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'created'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'glass-effect text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-105'
              }`}
            >
              Created ({mockUserRaffles.created.length})
            </button>
            <button
              onClick={() => setActiveTab('entered')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'entered'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'glass-effect text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-105'
              }`}
            >
              Entered ({mockUserRaffles.entered.length})
            </button>
            <button
              onClick={() => setActiveTab('won')}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === 'won'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'glass-effect text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-105'
              }`}
            >
              Won ({mockUserRaffles.won.length})
            </button>
          </div>

          {/* Created Raffles Tab */}
          {activeTab === 'created' && (
            <div className="space-y-4 animate-fade-in">
              {mockUserRaffles.created.map((raffle, index) => (
                <Card key={raffle.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg">
                        {raffle.assetType === AssetType.ETH && '💎'}
                        {raffle.assetType === AssetType.ERC20 && '🪙'}
                        {raffle.assetType === AssetType.ERC721 && '🖼️'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">{raffle.prizeAmount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {raffle.entries}/{raffle.maxEntries} entries •{' '}
                          <span className={`font-semibold ${raffle.status === RaffleStatus.Active ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            {raffle.status === RaffleStatus.Active ? 'Active' : 'Ended'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/raffle/${raffle.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      {raffle.status === RaffleStatus.Active && (
                        <Button size="sm" variant="gradient">End Raffle</Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {mockUserRaffles.created.length === 0 && (
                <Card className="text-center py-16 animate-fade-in">
                  <div className="text-6xl mb-4">🎟️</div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No raffles created yet</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Start creating raffles to get started!</p>
                  <Link href="/create">
                    <Button variant="gradient" size="lg">Create Your First Raffle</Button>
                  </Link>
                </Card>
              )}
            </div>
          )}

          {/* Entered Raffles Tab */}
          {activeTab === 'entered' && (
            <div className="space-y-4 animate-fade-in">
              {mockUserRaffles.entered.map((raffle, index) => (
                <Card key={raffle.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg">
                        {raffle.assetType === AssetType.ETH && '💎'}
                        {raffle.assetType === AssetType.ERC20 && '🪙'}
                        {raffle.assetType === AssetType.ERC721 && '🖼️'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">{raffle.prizeAmount}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Your entries: <span className="font-semibold text-blue-600 dark:text-blue-400">{raffle.myEntries}</span> • Total: {raffle.totalEntries}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {((raffle.myEntries / raffle.totalEntries) * 100).toFixed(1)}% chance
                      </span>
                      <Link href={`/raffle/${raffle.id}`}>
                        <Button variant="outline" size="sm">View Raffle</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
              {mockUserRaffles.entered.length === 0 && (
                <Card className="text-center py-16 animate-fade-in">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">You haven't entered any raffles yet</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Start entering raffles for a chance to win!</p>
                  <Link href="/">
                    <Button variant="gradient" size="lg">Browse Raffles</Button>
                  </Link>
                </Card>
              )}
            </div>
          )}

          {/* Won Raffles Tab */}
          {activeTab === 'won' && (
            <div className="space-y-4 animate-fade-in">
              {mockUserRaffles.won.map((raffle, index) => (
                <Card key={raffle.id} className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-3xl shadow-lg">
                        🏆
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="font-bold text-lg text-gray-900 dark:text-white">{raffle.prizeAmount}</div>
                          {!raffle.claimed && (
                            <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full shadow-md">
                              UNCLAIMED
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Won {raffle.wonAt.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {!raffle.claimed ? (
                      <Button size="lg" variant="gradient" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                        Claim Prize
                      </Button>
                    ) : (
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                        <span>✓</span>
                        <span>Claimed</span>
                      </span>
                    )}
                  </div>
                </Card>
              ))}
              {mockUserRaffles.won.length === 0 && (
                <Card className="text-center py-16 animate-fade-in">
                  <div className="text-6xl mb-4">🎲</div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">No wins yet - keep trying!</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Enter more raffles to increase your chances!</p>
                  <Link href="/">
                    <Button variant="gradient" size="lg">Enter Raffles</Button>
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
