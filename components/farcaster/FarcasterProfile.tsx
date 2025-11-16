'use client';

import Image from 'next/image';
import type { Address } from 'viem';
import type { FarcasterProfileProps } from '@/types/neynar';
import { useFarcasterUser, usePrefetchFarcasterUser } from '@/hooks/useFarcasterUser';
import { logError, handleNeynarError } from '@/lib/error-handlers';

/**
 * Optional Farcaster profile display
 * Fetches and displays real user data from Neynar SDK
 * Shows avatar, username, display name, and FID with link to Warpcast
 * 
 * Requirements: 3.3, 3.5, 7.5
 */

export function FarcasterProfile({ 
  fid, 
  address, 
  showAvatar = true,
  showBio = false,
  className = ''
}: FarcasterProfileProps) {
  const { data: user, isLoading, error } = useFarcasterUser(address, fid);
  const prefetchUser = usePrefetchFarcasterUser();

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Error state - gracefully degrade
  if (error) {
    // Use centralized error handler for logging
    const errorResult = handleNeynarError(error);
    logError('FarcasterProfile', errorResult);
    return null;
  }

  // No user found - wallet-only user (totally fine!)
  if (!user) {
    return null;
  }

  return (
    <a
      href={`https://warpcast.com/${user.username}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}
      onMouseEnter={() => prefetchUser(address, fid)}
    >
      {showAvatar && user.pfpUrl && (
        <Image
          src={user.pfpUrl}
          alt={`${user.displayName}'s avatar`}
          width={40}
          height={40}
          className="rounded-full"
          loading="lazy"
          unoptimized // Farcaster avatars are already optimized
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+"
        />
      )}
      
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {user.displayName}
          </span>
          <span className="text-purple-600">🟣</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>@{user.username}</span>
          <span>·</span>
          <span>FID: {user.fid}</span>
        </div>
        
        {showBio && user.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {user.bio}
          </p>
        )}
      </div>
    </a>
  );
}
