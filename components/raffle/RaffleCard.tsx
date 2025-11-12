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
    <Card hover className="p-0 overflow-hidden">
      {/* Prize Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl">{getAssetIcon()}</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded">#{id}</span>
        </div>
        <div className="text-2xl font-bold">{prizeAmount}</div>
        <div className="text-sm opacity-90">{getAssetLabel()} Prize</div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Entry Stats */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Entries</span>
            <span className="font-semibold">
              {entries}/{maxEntries}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Entry Fee & Time */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-gray-600 dark:text-gray-400">Entry Fee</div>
            <div className="font-semibold">{entryFee} ETH</div>
          </div>
          <div className="text-right">
            <div className="text-gray-600 dark:text-gray-400">Ends In</div>
            <div className="font-semibold text-orange-600">{timeRemaining()}</div>
          </div>
        </div>

        {/* Creator */}
        <div className="text-xs text-gray-500 border-t dark:border-gray-800 pt-3">
          Created by {creator.slice(0, 6)}...{creator.slice(-4)}
        </div>

        {/* Action Button */}
        <Link href={`/raffle/${id}`}>
          <Button className="w-full">Enter Raffle</Button>
        </Link>
      </div>
    </Card>
  );
}
