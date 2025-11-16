'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { Address } from 'viem';
import type { NeynarUser } from '@/types/neynar';

/**
 * Fetch function for Farcaster user data
 * Separated for reuse in prefetching
 * 
 * @param address - Optional Ethereum address to lookup
 * @param fid - Optional Farcaster ID to lookup
 * @returns NeynarUser object or null if not found
 * @throws Error if API request fails
 */
async function fetchFarcasterUser(address?: Address, fid?: number): Promise<NeynarUser | null> {
  // If neither address nor FID provided, return null
  if (!address && !fid) {
    return null;
  }

  // Call the API route to fetch user data
  const params = new URLSearchParams();
  if (address) params.append('address', address);
  if (fid) params.append('fid', fid.toString());

  const response = await fetch(`/api/farcaster/user?${params.toString()}`);
  
  if (!response.ok) {
    // If user not found (404), return null instead of throwing
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch Farcaster user: ${response.statusText}`);
  }

  const data = await response.json();
  return data.user || null;
}

/**
 * Custom hook for fetching Farcaster user data with caching
 * Uses TanStack Query for optimal performance and caching
 * 
 * @param address - Ethereum address to lookup Farcaster profile
 * @param fid - Optional Farcaster ID to lookup directly
 * @returns Query result with user data, loading state, and error
 */
export function useFarcasterUser(
  address?: Address,
  fid?: number
): UseQueryResult<NeynarUser | null, Error> {
  return useQuery<NeynarUser | null, Error>({
    queryKey: ['farcaster-user', address, fid],
    queryFn: () => fetchFarcasterUser(address, fid),
    enabled: !!(address || fid),
    staleTime: 5 * 60 * 1000, // 5 minutes - user data doesn't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes cache time (formerly cacheTime)
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  });
}

/**
 * Hook to prefetch Farcaster user data on hover
 * Improves perceived performance by loading data before it's needed
 * 
 * @returns Prefetch function to call on hover events
 */
export function usePrefetchFarcasterUser(): (address?: Address, fid?: number) => void {
  const queryClient = useQueryClient();

  return (address?: Address, fid?: number) => {
    if (!address && !fid) return;

    queryClient.prefetchQuery({
      queryKey: ['farcaster-user', address, fid],
      queryFn: () => fetchFarcasterUser(address, fid),
      staleTime: 5 * 60 * 1000,
    });
  };
}
