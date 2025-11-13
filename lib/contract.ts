/**
 * Contract configuration and ABIs
 */

export const RAFFLE_CORE_ADDRESS = process.env.NEXT_PUBLIC_RAFFLE_CORE_ADDRESS as `0x${string}`;

// Minimal ABI for RaffleCore contract
export const RAFFLE_CORE_ABI = [
  {
    type: 'function',
    name: 'createRaffle',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'config',
        type: 'tuple',
        components: [
          { name: 'creator', type: 'address' },
          { name: 'assetType', type: 'uint8' },
          { name: 'assetContract', type: 'address' },
          { name: 'assetTokenId', type: 'uint256' },
          { name: 'assetAmount', type: 'uint256' },
          { name: 'entryFee', type: 'uint256' },
          { name: 'maxEntries', type: 'uint256' },
          { name: 'maxEntriesPerWallet', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'winnerCount', type: 'uint256' },
          { name: 'status', type: 'uint8' },
        ],
      },
    ],
    outputs: [{ name: 'raffleId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'enterRaffle',
    stateMutability: 'payable',
    inputs: [
      { name: 'raffleId', type: 'uint256' },
      { name: 'entries', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'endRaffle',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'claimPrize',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getRaffle',
    stateMutability: 'view',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'creator', type: 'address' },
          { name: 'assetType', type: 'uint8' },
          { name: 'assetContract', type: 'address' },
          { name: 'assetTokenId', type: 'uint256' },
          { name: 'assetAmount', type: 'uint256' },
          { name: 'entryFee', type: 'uint256' },
          { name: 'maxEntries', type: 'uint256' },
          { name: 'maxEntriesPerWallet', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'endTime', type: 'uint256' },
          { name: 'winnerCount', type: 'uint256' },
          { name: 'status', type: 'uint8' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'totalRaffles',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getParticipants',
    stateMutability: 'view',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address[]' }],
  },
  {
    type: 'function',
    name: 'getWinners',
    stateMutability: 'view',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address[]' }],
  },
  {
    type: 'function',
    name: 'totalEntries',
    stateMutability: 'view',
    inputs: [{ name: 'raffleId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'RaffleCreated',
    inputs: [
      { indexed: true, name: 'raffleId', type: 'uint256' },
      { indexed: true, name: 'creator', type: 'address' },
      { indexed: false, name: 'assetType', type: 'uint8' },
      { indexed: false, name: 'entryFee', type: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'RaffleEntered',
    inputs: [
      { indexed: true, name: 'raffleId', type: 'uint256' },
      { indexed: true, name: 'participant', type: 'address' },
      { indexed: false, name: 'entries', type: 'uint256' },
    ],
  },
] as const;

export enum AssetType {
  ETH = 0,
  ERC20 = 1,
  ERC721 = 2,
}

export enum RaffleStatus {
  Active = 0,
  Ended = 1,
  Cancelled = 2,
}

export type RaffleConfig = {
  creator: `0x${string}`;
  assetType: AssetType;
  assetContract: `0x${string}`;
  assetTokenId: bigint;
  assetAmount: bigint;
  entryFee: bigint;
  maxEntries: bigint;
  maxEntriesPerWallet: bigint;
  startTime: bigint;
  endTime: bigint;
  winnerCount: bigint;
  status: RaffleStatus;
};
