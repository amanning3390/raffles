'use client';

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetType, RaffleStatus } from '@/lib/contract';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';

// Mock raffle data - will be fetched from contract
const mockRaffle = {
  id: 1,
  creator: '0x1234567890123456789012345678901234567890',
  assetType: AssetType.ETH,
  prizeAmount: '0.5 ETH',
  entryFee: '0.01',
  maxEntries: 100,
  maxEntriesPerWallet: 10,
  entries: 45,
  endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  winnerCount: 1,
  status: RaffleStatus.Active,
  participants: [
    '0x1111111111111111111111111111111111111111',
    '0x2222222222222222222222222222222222222222',
    '0x3333333333333333333333333333333333333333',
  ],
  winners: [],
};

export default function RaffleDetailPage({ params }: { params: { id: string } }) {
  const { address, isConnected } = useAccount();
  const [entryCount, setEntryCount] = useState('1');
  const [isEntering, setIsEntering] = useState(false);

  const timeRemaining = () => {
    const now = new Date();
    const diff = mockRaffle.endsAt.getTime() - now.getTime();
    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const progressPercentage = (mockRaffle.entries / mockRaffle.maxEntries) * 100;
  const totalCost = (parseFloat(entryCount) * parseFloat(mockRaffle.entryFee)).toFixed(4);

  const handleEnter = async () => {
    setIsEntering(true);
    // TODO: Implement contract interaction
    setTimeout(() => {
      setIsEntering(false);
      alert('Entry successful! (Mock)');
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 px-4 pb-12 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Raffles
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Prize Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Prize Card */}
              <Card>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 -m-6 mb-6 p-8 rounded-t-xl text-white">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-5xl">
                      {mockRaffle.assetType === AssetType.ETH && '💎'}
                      {mockRaffle.assetType === AssetType.ERC20 && '🪙'}
                      {mockRaffle.assetType === AssetType.ERC721 && '🖼️'}
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">#{params.id}</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{mockRaffle.prizeAmount}</h1>
                  <p className="text-sm opacity-90">
                    {mockRaffle.assetType === AssetType.ETH && 'ETH Prize'}
                    {mockRaffle.assetType === AssetType.ERC20 && 'Token Prize'}
                    {mockRaffle.assetType === AssetType.ERC721 && 'NFT Prize'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About this Raffle</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Win {mockRaffle.prizeAmount} by entering this raffle. The winner will be selected randomly when the raffle ends.
                      All funds are held securely in the smart contract until claimed.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-800">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Creator</div>
                      <div className="font-mono text-sm mt-1">
                        {mockRaffle.creator.slice(0, 6)}...{mockRaffle.creator.slice(-4)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Winners</div>
                      <div className="font-semibold mt-1">{mockRaffle.winnerCount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Entry Fee</div>
                      <div className="font-semibold mt-1">{mockRaffle.entryFee} ETH</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Max Per Wallet</div>
                      <div className="font-semibold mt-1">{mockRaffle.maxEntriesPerWallet}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Participants */}
              <Card>
                <h3 className="font-semibold mb-4">Recent Participants ({mockRaffle.participants.length})</h3>
                <div className="space-y-2">
                  {mockRaffle.participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                        <span className="font-mono text-sm">
                          {participant.slice(0, 6)}...{participant.slice(-4)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">2 entries</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - Entry Form */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {timeRemaining()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-semibold">
                      {mockRaffle.entries}/{mockRaffle.maxEntries}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {isConnected ? (
                  <div className="space-y-4">
                    <Input
                      label="Number of Entries"
                      type="number"
                      min="1"
                      max={mockRaffle.maxEntriesPerWallet}
                      value={entryCount}
                      onChange={(e) => setEntryCount(e.target.value)}
                      helperText={`Max ${mockRaffle.maxEntriesPerWallet} per wallet`}
                    />

                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Entry Fee</span>
                        <span className="font-semibold">{mockRaffle.entryFee} ETH</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Quantity</span>
                        <span className="font-semibold">×{entryCount}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-blue-200 dark:border-blue-900">
                        <span className="font-semibold">Total Cost</span>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {totalCost} ETH
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleEnter}
                      isLoading={isEntering}
                      className="w-full"
                      size="lg"
                    >
                      Enter Raffle
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                      By entering, you agree that all transactions are final and non-refundable
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Connect your wallet to enter
                    </p>
                  </div>
                )}
              </Card>

              {/* Info Card */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <span>ℹ️</span>
                  How it Works
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-2">
                    <span>1.</span>
                    <span>Enter by paying the entry fee</span>
                  </li>
                  <li className="flex gap-2">
                    <span>2.</span>
                    <span>Wait for the raffle to end</span>
                  </li>
                  <li className="flex gap-2">
                    <span>3.</span>
                    <span>Winner is selected randomly</span>
                  </li>
                  <li className="flex gap-2">
                    <span>4.</span>
                    <span>Claim your prize from the contract</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
