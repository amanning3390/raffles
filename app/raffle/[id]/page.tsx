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
  useEnterRaffle,
  useClaimPrize
} from '@/hooks/useRaffleContract';
import { useToast } from '@/components/ui/toast';
import { useReadContract } from 'wagmi';
import { RAFFLE_CORE_ADDRESS, RAFFLE_CORE_ABI } from '@/lib/contract';

export default function RaffleDetailPage({ params }: { params: { id: string } }) {
  const { address, isConnected } = useAccount();
  const { showToast } = useToast();
  
  // Validate raffle ID
  let raffleId: bigint;
  try {
    const idNum = parseInt(params.id);
    if (isNaN(idNum) || idNum < 0) {
      throw new Error('Invalid raffle ID');
    }
    raffleId = BigInt(idNum);
  } catch {
    raffleId = BigInt(0);
  }
  
  const [entryCount, setEntryCount] = useState('1');
  
  const { raffle, isLoading: isLoadingRaffle, refetch: refetchRaffle } = useRaffleData(raffleId);
  const { entries: totalEntries, isLoading: isLoadingEntries, refetch: refetchEntries } = useRaffleEntries(raffleId);
  const { participants, isLoading: isLoadingParticipants } = useRaffleParticipants(raffleId);
  const { winners, isLoading: isLoadingWinners } = useRaffleWinners(raffleId);
  const { enterRaffle, isPending: isEntering, isSuccess: enterSuccess, error: enterError } = useEnterRaffle();
  const { claimPrize, isPending: isClaiming, isSuccess: claimSuccess } = useClaimPrize();
  
  // Check if user is a winner
  const isWinner = useMemo(() => {
    if (!winners || !address) return false;
    return winners.some(w => w.toLowerCase() === address.toLowerCase());
  }, [winners, address]);
  
  // Check if user has claimed prize
  const { data: hasClaimed } = useReadContract({
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'prizeClaimed',
    args: [raffleId, address || '0x0000000000000000000000000000000000000000'],
    query: { enabled: !!address && !!raffle && raffle.status === RaffleStatus.Ended },
  });
  
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
    const percentage = (Number(totalEntries) / Number(raffle.maxEntries)) * 100;
    return Math.min(percentage, 100); // Cap at 100%
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

    // Validate entry count
    const entryCountNum = parseInt(entryCount);
    if (!entryCount || isNaN(entryCountNum) || entryCountNum <= 0) {
      showToast('Please enter a valid number of entries', 'error');
      return;
    }

    // Check if raffle has started
    const now = BigInt(Math.floor(Date.now() / 1000));
    if (now < raffle.startTime) {
      showToast('Raffle has not started yet', 'error');
      return;
    }

    // Check if raffle has ended
    if (now >= raffle.endTime || raffle.status !== RaffleStatus.Active) {
      showToast('Raffle has ended', 'error');
      return;
    }

    // Check user's remaining entries
    const userEntriesNum = userEntries ? Number(userEntries) : 0;
    const remainingEntries = Number(raffle.maxEntriesPerWallet) - userEntriesNum;
    if (entryCountNum > remainingEntries) {
      showToast(`You can only enter ${remainingEntries} more entries (max ${raffle.maxEntriesPerWallet} per wallet)`, 'error');
      return;
    }

    // Check if total entries would exceed max
    const currentEntries = totalEntries ? Number(totalEntries) : 0;
    if (currentEntries + entryCountNum > Number(raffle.maxEntries)) {
      showToast(`Only ${Number(raffle.maxEntries) - currentEntries} entries remaining`, 'error');
      return;
    }

    try {
      await enterRaffle(raffleId, BigInt(entryCountNum), raffle.entryFee);
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

  useEffect(() => {
    if (claimSuccess) {
      showToast('Prize claimed successfully!', 'success');
      refetchRaffle();
    }
  }, [claimSuccess, refetchRaffle, showToast]);

  const handleClaimPrize = async () => {
    if (!address) {
      showToast('Please connect your wallet', 'error');
      return;
    }
    try {
      await claimPrize(raffleId);
    } catch (err: any) {
      showToast(err.message || 'Failed to claim prize', 'error');
    }
  };

  if (isLoadingRaffle) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 px-4 pb-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 ">
          <div className="max-w-7xl mx-auto">
            <Card className="text-center py-16 animate-pulse">
              <div className="text-6xl mb-4">🎟️</div>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">Loading raffle...</p>
            </Card>
          </div>
        </main>
      </>
    );
  }

  if (raffleId === BigInt(0) || (!raffle && !isLoadingRaffle)) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 px-4 pb-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 ">
          <div className="max-w-7xl mx-auto">
            <Card className="text-center py-16 animate-fade-in">
              <div className="text-6xl mb-4">❌</div>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Invalid raffle ID</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">The raffle ID you're looking for doesn't exist.</p>
              <Link href="/">
                <Button variant="default" size="lg">Back to Raffles</Button>
              </Link>
            </Card>
          </div>
        </main>
      </>
    );
  }

  if (!raffle) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-28 px-4 pb-16 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 ">
          <div className="max-w-7xl mx-auto">
            <Card className="text-center py-16 animate-fade-in">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Raffle not found</p>
              <p className="text-gray-600 dark:text-gray-400 mb-6">This raffle may have been removed or doesn't exist.</p>
              <Link href="/">
                <Button variant="default" size="lg">Back to Raffles</Button>
              </Link>
            </Card>
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
      <main className="min-h-screen pt-28 px-4 pb-16 animate-fade-in bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950 ">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800  transition-all duration-200 mb-8 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Raffles</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Prize Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Prize Card */}
              <Card className="overflow-hidden animate-slide-up">
                <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 -m-6 mb-6 p-8 md:p-10 text-white overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-10"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white opacity-20 backdrop-blur-sm flex items-center justify-center text-4xl md:text-5xl shadow-lg">
                        {raffle.assetType === AssetType.ETH && '💎'}
                        {raffle.assetType === AssetType.ERC20 && '🪙'}
                        {raffle.assetType === AssetType.ERC721 && '🖼️'}
                      </div>
                      <span className="px-4 py-2 bg-white opacity-20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white border-opacity-30">
                        #{params.id}
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 drop-shadow-lg">{prizeAmount}</h1>
                    <p className="text-base font-medium opacity-90">
                      {raffle.assetType === AssetType.ETH && 'ETH Prize'}
                      {raffle.assetType === AssetType.ERC20 && 'Token Prize'}
                      {raffle.assetType === AssetType.ERC721 && 'NFT Prize'}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">About this Raffle</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      Win {prizeAmount} by entering this raffle. The winner will be selected randomly when the raffle ends.
                      All funds are held securely in the smart contract until claimed.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Creator</div>
                      <div className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                        {raffle.creator.slice(0, 6)}...{raffle.creator.slice(-4)}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Winners</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{raffle.winnerCount.toString()}</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Entry Fee</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{entryFeeEth} ETH</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Max Per Wallet</div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">{raffle.maxEntriesPerWallet.toString()}</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Participants */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">
                  Recent Participants ({participants?.length || 0})
                  {userEntries && Number(userEntries) > 0 && (
                    <span className="ml-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-full">
                      Your entries: {userEntries.toString()}
                    </span>
                  )}
                </h3>
                {isLoadingParticipants ? (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">Loading...</div>
                ) : participants && participants.length > 0 ? (
                  <div className="space-y-2">
                    {participants.slice(-10).map((participant, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                            {index + 1}
                          </div>
                          <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                            {participant.slice(0, 6)}...{participant.slice(-4)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                    <div className="text-4xl mb-2">👥</div>
                    <p>No participants yet</p>
                  </div>
                )}
              </Card>

              {/* Winners Display */}
              {raffle.status === RaffleStatus.Ended && winners && winners.length > 0 && (
                <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950  animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <h3 className="font-bold text-xl mb-6 text-green-700 dark:text-green-400 flex items-center gap-2">
                    <span className="text-3xl">🏆</span>
                    Winners
                  </h3>
                  <div className="space-y-3">
                    {winners.map((winner, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {index + 1}
                          </div>
                          <div>
                            <span className="font-mono text-sm font-bold text-gray-900 dark:text-white block">
                              {winner.slice(0, 6)}...{winner.slice(-4)}
                            </span>
                            {address && winner.toLowerCase() === address.toLowerCase() && (
                              <span className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1 block">🎉 You won!</span>
                            )}
                          </div>
                        </div>
                        {address && winner.toLowerCase() === address.toLowerCase() && !hasClaimed && (
                          <Button
                            onClick={handleClaimPrize}
                            isLoading={isClaiming}
                            size="sm"
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
                          >
                            Claim Prize
                          </Button>
                        )}
                        {address && winner.toLowerCase() === address.toLowerCase() && hasClaimed && (
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                            <span>✓</span>
                            <span>Claimed</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Entry Form */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card className="animate-slide-up">
                <div className="text-center mb-8">
                  <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {timeRemaining}
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Time Remaining</div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Progress</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {totalEntries?.toString() || '0'}/{raffle.maxEntries.toString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {isConnected ? (
                  <div className="space-y-4">
                    {raffle.status === RaffleStatus.Active ? (
                      <>
                        <Input
                          label="Number of Entries"
                          type="number"
                          min="1"
                          max={raffle.maxEntriesPerWallet.toString()}
                          value={entryCount}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Only allow positive integers
                            if (value === '' || /^\d+$/.test(value)) {
                              setEntryCount(value);
                            }
                          }}
                          helperText={
                            userEntries && Number(userEntries) > 0
                              ? `Max ${raffle.maxEntriesPerWallet.toString()} per wallet (You have ${userEntries.toString()})`
                              : `Max ${raffle.maxEntriesPerWallet.toString()} per wallet`
                          }
                        />
                      </>
                    ) : raffle.status === RaffleStatus.Ended && isWinner && !hasClaimed ? (
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950  rounded-2xl border-2 border-green-500 shadow-lg">
                        <p className="text-base font-bold text-green-800 dark:text-green-200 mb-4 text-center">
                          🎉 Congratulations! You won!
                        </p>
                        <Button
                          onClick={handleClaimPrize}
                          isLoading={isClaiming}
                          variant="default"
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          size="lg"
                        >
                          {isClaiming ? 'Claiming...' : '✨ Claim Your Prize'}
                        </Button>
                      </div>
                    ) : raffle.status === RaffleStatus.Ended && isWinner && hasClaimed ? (
                      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-2">
                          <span>✓</span>
                          <span>Prize claimed</span>
                        </p>
                      </div>
                    ) : null}

                    {raffle.status === RaffleStatus.Active && (
                      <>
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl border-2 border-blue-200 dark:border-blue-800">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Entry Fee</span>
                            <span className="font-bold text-gray-900 dark:text-white">{entryFeeEth} ETH</span>
                          </div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quantity</span>
                            <span className="font-bold text-gray-900 dark:text-white">×{entryCount}</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t-2 border-blue-200 dark:border-blue-800">
                            <span className="font-bold text-gray-900 dark:text-white">Total Cost</span>
                            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {totalCost} ETH
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={handleEnter}
                          isLoading={isEntering}
                          variant="default"
                          className="w-full"
                          size="lg"
                          disabled={isEntering}
                        >
                          {isEntering ? 'Entering...' : '🎟️ Enter Raffle'}
                        </Button>
                      </>
                    )}

                    {raffle.status === RaffleStatus.Active && (
                      <p className="text-xs text-center text-gray-500">
                        By entering, you agree that all transactions are final and non-refundable
                      </p>
                    )}
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
              <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-2xl">ℹ️</span>
                  How it Works
                </h4>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-3 items-start">
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">1.</span>
                    <span className="pt-0.5">Enter by paying the entry fee</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">2.</span>
                    <span className="pt-0.5">Wait for the raffle to end</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="font-bold text-pink-600 dark:text-pink-400 text-lg">3.</span>
                    <span className="pt-0.5">Winner is selected randomly</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">4.</span>
                    <span className="pt-0.5">Claim your prize from the contract</span>
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
