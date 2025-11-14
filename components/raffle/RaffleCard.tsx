'use client';

import { Card } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { AssetType } from '@/lib/contract';

interface RaffleCardProps {
  id: number;
  assetType: AssetType;
  prizeAmount: string;
  entryFee: string;
  entries: number;
  maxEntries: number;
  endsAt: Date;
  creator: string;
}

export function RaffleCard({
  id,
  assetType,
  prizeAmount,
  entryFee,
  entries,
  maxEntries,
  endsAt,
  creator,
}: RaffleCardProps) {
  const getAssetIcon = () => {
    switch (assetType) {
      case AssetType.ETH:
        return '💎';
      case AssetType.ERC20:
        return '🪙';
      case AssetType.ERC721:
        return '🖼️';
      default:
        return '🎁';
    }
  };

  const getAssetLabel = () => {
    switch (assetType) {
      case AssetType.ETH:
        return 'ETH';
      case AssetType.ERC20:
        return 'Token';
      case AssetType.ERC721:
        return 'NFT';
      default:
        return 'Prize';
    }
  };

  const timeRemaining = () => {
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();
    if (diff <= 0) return 'Ended';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const progressPercentage = (entries / maxEntries) * 100;

  return (
    <Card hover className="p-0 overflow-hidden group">
      {/* Prize Banner */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
              {getAssetIcon()}
            </div>
            <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
              #{id}
            </span>
          </div>
          <div className="text-3xl font-bold mb-1 drop-shadow-lg">{prizeAmount}</div>
          <div className="text-sm font-medium opacity-90">{getAssetLabel()} Prize</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-5">
        {/* Entry Stats */}
        <div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600 dark:text-gray-400 font-medium">Entries</span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              {entries}/{maxEntries}
            </span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Entry Fee & Time */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Entry Fee</div>
            <div className="font-bold text-gray-900 dark:text-gray-100">{entryFee} ETH</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Ends In</div>
            <div className="font-bold text-orange-600 dark:text-orange-400">{timeRemaining()}</div>
          </div>
        </div>

        {/* Creator */}
        <div className="text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-4">
          <span className="font-medium">Created by</span>{' '}
          <span className="font-mono">{creator.slice(0, 6)}...{creator.slice(-4)}</span>
        </div>

        {/* Action Button */}
        <Link href={`/raffle/${id}`} className="block">
          <Button className="w-full" variant="gradient" size="lg">
            Enter Raffle
          </Button>
        </Link>
      </div>
    </Card>
  );
}
