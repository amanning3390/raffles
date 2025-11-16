'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useReadContracts } from 'wagmi';
import type {
  UseWriteContractReturnType,
  UseWaitForTransactionReceiptReturnType,
  UseReadContractReturnType,
  UseReadContractsReturnType,
} from '@/types/wagmi';
import type { Address, Hash, TransactionReceipt } from '@/types/wagmi';
import { RAFFLE_CORE_ADDRESS, RAFFLE_CORE_ABI, AssetType } from '@/lib/contract';
import type { RaffleConfig, RaffleData } from '@/lib/contract';

/**
 * Parameters for creating a new raffle
 */
export interface CreateRaffleParams {
  assetType: AssetType;
  assetContract: Address;
  assetTokenId: bigint;
  assetAmount: bigint;
  entryFee: bigint;
  maxEntries: bigint;
  maxEntriesPerWallet: bigint;
  duration: bigint;
  winnerCount: bigint;
}

/**
 * Return type for raffle creation hook
 */
export interface UseCreateRaffleReturn {
  createRaffle: (params: CreateRaffleParams) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  hash: Hash | undefined;
}

/**
 * Return type for raffle entry hook
 */
export interface UseEnterRaffleReturn {
  enterRaffle: (raffleId: bigint, entries: bigint, entryFee: bigint) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  hash: Hash | undefined;
}

/**
 * Return type for raffle data hook
 */
export interface UseRaffleDataReturn {
  raffle: RaffleData | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Return type for raffle entries hook
 */
export interface UseRaffleEntriesReturn {
  entries: bigint | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Return type for raffle participants hook
 */
export interface UseRaffleParticipantsReturn {
  participants: Address[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Return type for raffle winners hook
 */
export interface UseRaffleWinnersReturn {
  winners: Address[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Return type for claim prize hook
 */
export interface UseClaimPrizeReturn {
  claimPrize: (raffleId: bigint) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  hash: Hash | undefined;
}

/**
 * Return type for end raffle hook
 */
export interface UseEndRaffleReturn {
  endRaffle: (raffleId: bigint) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  error: Error | null;
  hash: Hash | undefined;
}

/**
 * Return type for total raffles hook
 */
export interface UseTotalRafflesReturn {
  totalRaffles: bigint | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Hook for creating a new raffle
 * Handles contract interaction and transaction state
 * 
 * @returns Object with createRaffle function and transaction state
 */
export function useCreateRaffle(): UseCreateRaffleReturn {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createRaffle = async (params: CreateRaffleParams) => {
    if (!address) throw new Error('Wallet not connected');

    const config = {
      creator: address,
      assetType: params.assetType,
      assetContract: params.assetContract,
      assetTokenId: params.assetTokenId,
      assetAmount: params.assetAmount,
      entryFee: params.entryFee,
      maxEntries: params.maxEntries,
      maxEntriesPerWallet: params.maxEntriesPerWallet,
      startTime: BigInt(Math.floor(Date.now() / 1000)),
      endTime: BigInt(Math.floor(Date.now() / 1000)) + params.duration * BigInt(3600),
      winnerCount: params.winnerCount,
      status: 0, // Active
    };

    writeContract({
      address: RAFFLE_CORE_ADDRESS,
      abi: RAFFLE_CORE_ABI,
      functionName: 'createRaffle',
      args: [config],
      value: params.assetType === AssetType.ETH ? params.assetAmount : BigInt(0),
    });
  };

  return {
    createRaffle,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook for entering a raffle
 * Handles contract interaction and transaction state
 * 
 * @returns Object with enterRaffle function and transaction state
 */
export function useEnterRaffle(): UseEnterRaffleReturn {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const enterRaffle = async (raffleId: bigint, entries: bigint, entryFee: bigint) => {
    if (!address) throw new Error('Wallet not connected');

    const totalCost = entryFee * entries;

    writeContract({
      address: RAFFLE_CORE_ADDRESS,
      abi: RAFFLE_CORE_ABI,
      functionName: 'enterRaffle',
      args: [raffleId, entries],
      value: totalCost,
    });
  };

  return {
    enterRaffle,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook for fetching raffle data
 * 
 * @param raffleId - The ID of the raffle to fetch
 * @returns Object with raffle data and loading state
 */
export function useRaffleData(raffleId: bigint): UseRaffleDataReturn {
  const { data, isLoading, error, refetch } = useReadContract({
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'getRaffle',
    args: [raffleId],
  });

  return {
    raffle: data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching raffle entry count
 * 
 * @param raffleId - The ID of the raffle
 * @returns Object with entry count and loading state
 */
export function useRaffleEntries(raffleId: bigint): UseRaffleEntriesReturn {
  const { data, isLoading, error, refetch } = useReadContract({
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'totalEntries',
    args: [raffleId],
  });

  return {
    entries: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching raffle participants
 * 
 * @param raffleId - The ID of the raffle
 * @returns Object with participants array and loading state
 */
export function useRaffleParticipants(raffleId: bigint): UseRaffleParticipantsReturn {
  const { data, isLoading, error, refetch } = useReadContract({
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'getParticipants',
    args: [raffleId],
  });

  return {
    participants: data as Address[] | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching raffle winners
 * 
 * @param raffleId - The ID of the raffle
 * @returns Object with winners array and loading state
 */
export function useRaffleWinners(raffleId: bigint): UseRaffleWinnersReturn {
  const { data, isLoading, error, refetch } = useReadContract({
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'getWinners',
    args: [raffleId],
  });

  return {
    winners: data as Address[] | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for claiming a raffle prize
 * 
 * @returns Object with claimPrize function and transaction state
 */
export function useClaimPrize(): UseClaimPrizeReturn {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimPrize = async (raffleId: bigint) => {
    if (!address) throw new Error('Wallet not connected');

    writeContract({
      address: RAFFLE_CORE_ADDRESS,
      abi: RAFFLE_CORE_ABI,
      functionName: 'claimPrize',
      args: [raffleId],
    });
  };

  return {
    claimPrize,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook for ending a raffle
 * 
 * @returns Object with endRaffle function and transaction state
 */
export function useEndRaffle(): UseEndRaffleReturn {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const endRaffle = async (raffleId: bigint) => {
    if (!address) throw new Error('Wallet not connected');

    writeContract({
      address: RAFFLE_CORE_ADDRESS,
      abi: RAFFLE_CORE_ABI,
      functionName: 'endRaffle',
      args: [raffleId],
    });
  };

  return {
    endRaffle,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook for fetching total number of raffles
 * 
 * @returns Object with total raffles count and loading state
 */
export function useTotalRaffles(): UseTotalRafflesReturn {
  const { data, isLoading, error, refetch } = useReadContract({
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'totalRaffles',
  });

  return {
    totalRaffles: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Batch read multiple raffle data in a single RPC call
 * Significantly reduces network overhead when fetching multiple raffles
 * 
 * @param raffleIds - Array of raffle IDs to fetch
 * @returns Object containing raffle data array, loading state, and error
 */
export function useBatchRaffleData(raffleIds: bigint[]) {
  const contracts = raffleIds.map(id => ({
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'getRaffle' as const,
    args: [id] as const,
  }));

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts,
  });

  return {
    raffles: data?.map(result => result.result) || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Batch read multiple raffle entries in a single RPC call
 * 
 * @param raffleIds - Array of raffle IDs to fetch entries for
 * @returns Object containing entries array, loading state, and error
 */
export function useBatchRaffleEntries(raffleIds: bigint[]) {
  const contracts = raffleIds.map(id => ({
    address: RAFFLE_CORE_ADDRESS,
    abi: RAFFLE_CORE_ABI,
    functionName: 'totalEntries' as const,
    args: [id] as const,
  }));

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts,
  });

  return {
    entries: data?.map(result => result.result as bigint | undefined) || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Batch read raffle data with entries in a single optimized call
 * Combines getRaffle and totalEntries for each raffle ID
 * 
 * @param raffleIds - Array of raffle IDs to fetch
 * @returns Object containing combined raffle data with entries
 */
export function useBatchRaffleDataWithEntries(raffleIds: bigint[]) {
  const contracts = raffleIds.flatMap(id => [
    {
      address: RAFFLE_CORE_ADDRESS,
      abi: RAFFLE_CORE_ABI,
      functionName: 'getRaffle' as const,
      args: [id] as const,
    },
    {
      address: RAFFLE_CORE_ADDRESS,
      abi: RAFFLE_CORE_ABI,
      functionName: 'totalEntries' as const,
      args: [id] as const,
    },
  ]);

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts,
  });

  // Parse results into structured data
  const rafflesWithEntries = raffleIds.map((id, index) => {
    const raffleIndex = index * 2;
    const entriesIndex = index * 2 + 1;
    
    return {
      id,
      raffle: data?.[raffleIndex]?.result,
      entries: data?.[entriesIndex]?.result as bigint | undefined,
    };
  });

  return {
    rafflesWithEntries,
    isLoading,
    error,
    refetch,
  };
}
