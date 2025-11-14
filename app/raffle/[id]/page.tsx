'use client';

import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetType, RaffleStatus } from '@/lib/contract';
import { useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import Link from 'next/link';
import { 
  useRaffleData, 
  useRaffleEntries, 
  useRaffleParticipants,
  useRaffleWinners,
  useEnterRaffle
} from '@/hooks/useRaffleContract';
import { useToast } from '@/components/ui/toast';
import { useReadContract } from 'wagmi';
import { RAFFLE_CORE_ADDRESS, RAFFLE_CORE_ABI } from '@/lib/contract';

export default function RaffleDetailPage({ params }: { params: { id: string } }) {
  const { address, isConnected } = useAccount();
  const { showToast } = useToast();
  const raffleId = BigInt(params.id);
  const [entryCount, setEntryCount] = useState('1');
  
  const { raffle, isLoading: isLoadingRaffle, refetch: refetchRaffle } = useRaffleData(raffleId);
  const { entries: totalEntries, isLoading: isLoadingEntries, refetch: refetchEntries } = useRaffleEntries(raffleId);
  const { participants, isLoading: isLoadingParticipants } = useRaffleParticipants(raffleId);
  const { winners, isLoading: isLoadingWinners } = useRaffleWinners(raffleId);
  const { enterRaffle, isPending: isEntering, isSuccess: enterSuccess, error: enterError } = useEnterRaffle();
  
  // Get user's entries for this raffle
  const { data: userEntries } = useReadContract({
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'entriesPerWallet',
    args: [raffleId, address || '0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address },
  });

  const timeRemaining = useMemo(() => {
    if (!raffle) return 'Loading...';
    const now = BigInt(Math.floor(Date.now() / 1000));
    const endTime = raffle.endTime;
    if (now >= endTime) return 'Ended';
    
    const diff = Number(endTime - now);
    const days = Math.floor(diff / (60 * 60 * 24));
    const hours = Math.floor((diff % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((diff % (60 * 60)) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }, [raffle]);

  const progressPercentage = useMemo(() => {
    if (!raffle || !totalEntries) return 0;
    return (Number(totalEntries) / Number(raffle.maxEntries)) * 100;
  }, [raffle, totalEntries]);

  const totalCost = useMemo(() => {
    if (!raffle || !entryCount) return '0';
    try {
      const cost = parseEther(entryCount) * raffle.entryFee;
      return formatEther(cost);
    } catch {
      return '0';
    }
  }, [raffle, entryCount]);

  const handleEnter = async () => {
    if (!raffle || !address) {
      showToast('Please connect your wallet', 'error');
      return;
    }

    if (!entryCount || parseInt(entryCount) <= 0) {
      showToast('Please enter a valid number of entries', 'error');
      return;
    }

    try {
      await enterRaffle(raffleId, BigInt(entryCount), raffle.entryFee);
    } catch (err: any) {
      showToast(err.message || 'Failed to enter raffle', 'error');
    }
  };

  useEffect(() => {
    if (enterSuccess) {
      showToast('Successfully entered raffle!', 'success');
      refetchRaffle();
      refetchEntries();
    }
  }, [enterSuccess, refetchRaffle, refetchEntries, showToast]);

  useEffect(() => {
    if (enterError) {
      showToast(enterError.message || 'Transaction failed', 'error');
    }
  }, [enterError, showToast]);

  if (isLoadingRaffle) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading raffle...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!raffle) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-24 px-4 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Raffle not found</p>
              <Link href="/">
                <Button className="mt-4">Back to Raffles</Button>
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const prizeAmount = raffle.assetType === AssetType.ETH 
    ? `${formatEther(raffle.assetAmount)} ETH`
    : raffle.assetType === AssetType.ERC20
    ? `${formatEther(raffle.assetAmount)} tokens`
    : `Token #${raffle.assetTokenId.toString()}`;
  
  const entryFeeEth = formatEther(raffle.entryFee);

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
                      {raffle.assetType === AssetType.ETH && '💎'}
                      {raffle.assetType === AssetType.ERC20 && '🪙'}
                      {raffle.assetType === AssetType.ERC721 && '🖼️'}
                    </span>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">#{params.id}</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{prizeAmount}</h1>
                  <p className="text-sm opacity-90">
                    {raffle.assetType === AssetType.ETH && 'ETH Prize'}
                    {raffle.assetType === AssetType.ERC20 && 'Token Prize'}
                    {raffle.assetType === AssetType.ERC721 && 'NFT Prize'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">About this Raffle</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Win {prizeAmount} by entering this raffle. The winner will be selected randomly when the raffle ends.
                      All funds are held securely in the smart contract until claimed.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-800">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Creator</div>
                      <div className="font-mono text-sm mt-1">
                        {raffle.creator.slice(0, 6)}...{raffle.creator.slice(-4)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Winners</div>
                      <div className="font-semibold mt-1">{raffle.winnerCount.toString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Entry Fee</div>
                      <div className="font-semibold mt-1">{entryFeeEth} ETH</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Max Per Wallet</div>
                      <div className="font-semibold mt-1">{raffle.maxEntriesPerWallet.toString()}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Participants */}
              <Card>
                <h3 className="font-semibold mb-4">
                  Recent Participants ({participants?.length || 0})
                  {userEntries && Number(userEntries) > 0 && (
                    <span className="ml-2 text-sm text-blue-600 dark:text-blue-400">
                      (Your entries: {userEntries.toString()})
                    </span>
                  )}
                </h3>
                {isLoadingParticipants ? (
                  <div className="text-center py-4 text-gray-600 dark:text-gray-400">Loading...</div>
                ) : participants && participants.length > 0 ? (
                  <div className="space-y-2">
                    {participants.slice(-10).map((participant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                          <span className="font-mono text-sm">
                            {participant.slice(0, 6)}...{participant.slice(-4)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-600 dark:text-gray-400">No participants yet</div>
                )}
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
                      {totalEntries?.toString() || '0'}/{raffle.maxEntries.toString()}
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
                      max={raffle.maxEntriesPerWallet.toString()}
                      value={entryCount}
                      onChange={(e) => setEntryCount(e.target.value)}
                      helperText={`Max ${raffle.maxEntriesPerWallet.toString()} per wallet`}
                    />

                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Entry Fee</span>
                        <span className="font-semibold">{entryFeeEth} ETH</span>
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
                      disabled={raffle.status !== RaffleStatus.Active || isEntering}
                    >
                      {raffle.status !== RaffleStatus.Active ? 'Raffle Ended' : isEntering ? 'Entering...' : 'Enter Raffle'}
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
