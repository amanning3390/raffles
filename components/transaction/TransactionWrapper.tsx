'use client';

import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionProps,
  TransactionButtonProps,
  TransactionError,
  TransactionResponseType,
  LifecycleStatus,
} from '@/types/onchainkit';
import { useToast } from '@/components/ui/toast';
import { handleErrorWithToast, handleOnchainKitError } from '@/lib/error-handlers';
import type { Address, ContractFunctionParameters } from 'viem';

/**
 * Extended type to include value for payable functions
 * Combines Viem's ContractFunctionParameters with optional value field
 */
export type ContractCallWithValue = ContractFunctionParameters & {
  value?: bigint;
};

/**
 * Props for TransactionWrapper component
 * Wraps OnchainKit Transaction components with error handling and custom callbacks
 */
interface TransactionWrapperProps {
  contracts: ContractCallWithValue[];
  chainId?: number;
  onSuccess?: (response: TransactionResponseType) => void;
  onError?: (error: TransactionError) => void;
  buttonText?: string;
  buttonClassName?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function TransactionWrapper({
  contracts,
  chainId,
  onSuccess,
  onError,
  buttonText = 'Submit Transaction',
  buttonClassName = '',
  disabled = false,
  isLoading = false,
}: TransactionWrapperProps) {
  const { showToast } = useToast();

  const handleSuccess = (response: TransactionResponseType) => {
    showToast('Transaction successful!', 'success');
    onSuccess?.(response);
  };

  const handleError = (error: TransactionError) => {
    // Use centralized error handler
    handleErrorWithToast(
      error,
      handleOnchainKitError,
      'TransactionWrapper',
      showToast
    );
    
    onError?.(error);
  };

  return (
    <Transaction
      calls={contracts}
      chainId={chainId}
      onSuccess={handleSuccess}
      onError={handleError}
    >
      <TransactionButton
        className={buttonClassName}
        disabled={disabled || isLoading}
        text={isLoading ? 'Processing...' : buttonText}
      />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}
