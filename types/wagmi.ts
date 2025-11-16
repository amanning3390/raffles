/**
 * Wagmi and Viem Type Definitions
 * Centralized type exports for blockchain interactions
 */

import type {
  Address as ViemAddress,
  Hash as ViemHash,
  Hex as ViemHex,
  TransactionReceipt as ViemTransactionReceipt,
  Abi as ViemAbi,
  ContractFunctionArgs as ViemContractFunctionArgs,
} from 'viem';

// Re-export commonly used Viem types
export type {
  Address,
  Hash,
  Hex,
  TransactionReceipt,
  Log,
  Block,
  Transaction,
  ContractFunctionParameters,
  ContractFunctionArgs,
  Abi,
  AbiFunction,
  AbiEvent,
} from 'viem';

// Re-export Wagmi hook return types
export type {
  UseAccountReturnType,
  UseBalanceReturnType,
  UseBlockNumberReturnType,
  UseReadContractReturnType,
  UseReadContractsReturnType,
  UseWriteContractReturnType,
  UseWaitForTransactionReceiptReturnType,
  UseSignMessageReturnType,
  UseConnectReturnType,
  UseDisconnectReturnType,
  UseSwitchChainReturnType,
} from 'wagmi';

// Re-export Wagmi config types
export type {
  Config,
  Connector,
  CreateConnectorFn,
} from 'wagmi';

// Re-export chain types
export type {
  Chain,
} from 'wagmi/chains';

/**
 * Contract interaction result type
 * Generic type for contract read/write operations
 */
export interface ContractResult<T = unknown> {
  data: T | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  refetch?: () => void;
}

/**
 * Transaction state type
 * Tracks the lifecycle of a blockchain transaction
 */
export interface TransactionState {
  hash: ViemHash | undefined;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  receipt: ViemTransactionReceipt | undefined;
}

/**
 * Contract write parameters
 * Generic type for contract write operations
 */
export interface ContractWriteParams {
  address: ViemAddress;
  abi: ViemAbi;
  functionName: string;
  args?: readonly unknown[];
  value?: bigint;
  gas?: bigint;
  gasPrice?: bigint;
}

/**
 * Contract read parameters
 * Generic type for contract read operations
 */
export interface ContractReadParams {
  address: ViemAddress;
  abi: ViemAbi;
  functionName: string;
  args?: readonly unknown[];
  blockNumber?: bigint;
}

/**
 * Batch contract read parameters
 * For reading multiple contract values in a single call
 */
export interface BatchContractReadParams {
  contracts: readonly ContractReadParams[];
  allowFailure?: boolean;
}

/**
 * Wallet connection state
 * Tracks wallet connection status and details
 */
export interface WalletConnectionState {
  address: ViemAddress | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  isReconnecting: boolean;
  connector: any; // Connector type from wagmi
  chain: any; // Chain type from wagmi/chains
}

/**
 * Network switching parameters
 */
export interface SwitchNetworkParams {
  chainId: number;
}

/**
 * Sign message parameters
 */
export interface SignMessageParams {
  message: string | ViemHex;
}

/**
 * Type guard to check if value is a valid Address
 */
export function isAddress(value: unknown): value is ViemAddress {
  return (
    typeof value === 'string' &&
    /^0x[a-fA-F0-9]{40}$/.test(value)
  );
}

/**
 * Type guard to check if value is a valid Hash
 */
export function isHash(value: unknown): value is ViemHash {
  return (
    typeof value === 'string' &&
    /^0x[a-fA-F0-9]{64}$/.test(value)
  );
}
