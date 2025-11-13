'use client';

import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther, Address } from 'viem';
import { RAFFLE_CORE_ADDRESS, RAFFLE_CORE_ABI, AssetType } from '@/lib/contract';
import { useState } from 'react';

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

export function useCreateRaffle() {
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

export function useEnterRaffle() {
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

export function useRaffleData(raffleId: bigint) {
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

export function useRaffleEntries(raffleId: bigint) {
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

export function useRaffleParticipants(raffleId: bigint) {
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

export function useRaffleWinners(raffleId: bigint) {
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

export function useClaimPrize() {
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

export function useEndRaffle() {
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

export function useTotalRaffles() {
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
