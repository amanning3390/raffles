/**
 * Centralized error handling utilities for OnchainKit and Neynar SDK
 * 
 * This module provides consistent error transformation and user-friendly
 * error messages across the application.
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */

import type { TransactionError } from '@coinbase/onchainkit/transaction';

/**
 * Error types for categorization
 */
export enum ErrorType {
  USER_REJECTED = 'USER_REJECTED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  WALLET_ERROR = 'WALLET_ERROR',
  API_ERROR = 'API_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  NOT_FOUND = 'NOT_FOUND',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Structured error result
 */
export interface ErrorResult {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  shouldLog: boolean;
  shouldRetry: boolean;
}

/**
 * Handle OnchainKit transaction and wallet errors
 * 
 * Transforms OnchainKit errors into user-friendly messages and
 * categorizes them for appropriate handling.
 * 
 * @param error - The error from OnchainKit
 * @returns Structured error result with user-friendly message
 */
export function handleOnchainKitError(error: unknown): ErrorResult {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Handle TransactionError from OnchainKit
  if (isTransactionError(error)) {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorCode = (error as any).code;

    // User rejected transaction
    if (
      errorMessage.includes('user rejected') ||
      errorMessage.includes('user denied') ||
      errorMessage.includes('user cancelled') ||
      errorCode === 4001 ||
      errorCode === '4001'
    ) {
      return {
        type: ErrorType.USER_REJECTED,
        message: 'Transaction was cancelled',
        originalError: error,
        shouldLog: false,
        shouldRetry: true,
      };
    }

    // Insufficient funds
    if (
      errorMessage.includes('insufficient funds') ||
      errorMessage.includes('insufficient balance') ||
      errorMessage.includes('exceeds balance')
    ) {
      return {
        type: ErrorType.INSUFFICIENT_FUNDS,
        message: 'Insufficient balance to complete transaction',
        originalError: error,
        shouldLog: isDevelopment,
        shouldRetry: false,
      };
    }

    // Network errors
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('fetch failed')
    ) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network error. Please check your connection and try again',
        originalError: error,
        shouldLog: isDevelopment,
        shouldRetry: true,
      };
    }

    // Contract execution errors
    if (
      errorMessage.includes('execution reverted') ||
      errorMessage.includes('contract') ||
      errorMessage.includes('revert')
    ) {
      return {
        type: ErrorType.CONTRACT_ERROR,
        message: 'Transaction failed. Please check the transaction details and try again',
        originalError: error,
        shouldLog: true,
        shouldRetry: false,
      };
    }

    // Wallet connection errors
    if (
      errorMessage.includes('wallet') ||
      errorMessage.includes('connector') ||
      errorMessage.includes('not connected')
    ) {
      return {
        type: ErrorType.WALLET_ERROR,
        message: 'Wallet connection error. Please reconnect your wallet',
        originalError: error,
        shouldLog: isDevelopment,
        shouldRetry: true,
      };
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
      return {
        type: ErrorType.USER_REJECTED,
        message: 'Action was cancelled',
        originalError: error,
        shouldLog: false,
        shouldRetry: true,
      };
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network error. Please try again',
        originalError: error,
        shouldLog: isDevelopment,
        shouldRetry: true,
      };
    }
  }

  // Unknown error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: 'An unexpected error occurred. Please try again',
    originalError: error,
    shouldLog: true,
    shouldRetry: true,
  };
}

/**
 * Handle Neynar SDK errors
 * 
 * Transforms Neynar API errors into user-friendly messages and
 * handles graceful degradation when Farcaster features are unavailable.
 * 
 * @param error - The error from Neynar SDK
 * @returns Structured error result with user-friendly message
 */
export function handleNeynarError(error: unknown): ErrorResult {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    // API key errors
    if (
      errorMessage.includes('api key') ||
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('authentication')
    ) {
      return {
        type: ErrorType.CONFIGURATION_ERROR,
        message: 'Farcaster features are not configured. Please contact support',
        originalError: error,
        shouldLog: true,
        shouldRetry: false,
      };
    }

    // Rate limiting
    if (
      errorMessage.includes('rate limit') ||
      errorMessage.includes('too many requests') ||
      errorMessage.includes('429')
    ) {
      return {
        type: ErrorType.RATE_LIMIT,
        message: 'Too many requests. Please try again in a few moments',
        originalError: error,
        shouldLog: isDevelopment,
        shouldRetry: true,
      };
    }

    // Not found errors (expected for users without Farcaster)
    if (
      errorMessage.includes('not found') ||
      errorMessage.includes('404') ||
      errorMessage.includes('no user')
    ) {
      return {
        type: ErrorType.NOT_FOUND,
        message: 'Farcaster profile not found for this address',
        originalError: error,
        shouldLog: false,
        shouldRetry: false,
      };
    }

    // Network errors
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('fetch failed')
    ) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network error. Please check your connection and try again',
        originalError: error,
        shouldLog: isDevelopment,
        shouldRetry: true,
      };
    }

    // Signature verification errors
    if (
      errorMessage.includes('signature') ||
      errorMessage.includes('verification') ||
      errorMessage.includes('invalid')
    ) {
      return {
        type: ErrorType.AUTHENTICATION_ERROR,
        message: 'Authentication failed. Please try signing in again',
        originalError: error,
        shouldLog: isDevelopment,
        shouldRetry: true,
      };
    }

    // User rejected signature
    if (errorMessage.includes('user rejected') || errorMessage.includes('cancelled')) {
      return {
        type: ErrorType.USER_REJECTED,
        message: 'Signature request was cancelled',
        originalError: error,
        shouldLog: false,
        shouldRetry: true,
      };
    }

    // Generic API errors
    return {
      type: ErrorType.API_ERROR,
      message: error.message || 'Failed to connect to Farcaster. Please try again',
      originalError: error,
      shouldLog: isDevelopment,
      shouldRetry: true,
    };
  }

  // Unknown error
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: 'An unexpected error occurred with Farcaster. Please try again',
    originalError: error,
    shouldLog: true,
    shouldRetry: true,
  };
}

/**
 * Log error to console in development mode
 * 
 * @param context - Context string describing where the error occurred
 * @param errorResult - The structured error result
 */
export function logError(context: string, errorResult: ErrorResult): void {
  if (errorResult.shouldLog) {
    console.error(`[${context}]`, {
      type: errorResult.type,
      message: errorResult.message,
      error: errorResult.originalError,
    });
  }
}

/**
 * Get toast type based on error type
 * 
 * @param errorType - The error type
 * @returns Toast type for display
 */
export function getToastType(errorType: ErrorType): 'error' | 'warning' | 'info' {
  switch (errorType) {
    case ErrorType.USER_REJECTED:
      return 'info';
    case ErrorType.RATE_LIMIT:
    case ErrorType.CONFIGURATION_ERROR:
      return 'warning';
    default:
      return 'error';
  }
}

/**
 * Type guard for TransactionError
 */
function isTransactionError(error: unknown): error is TransactionError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('message' in error || 'code' in error)
  );
}

/**
 * Helper function to handle errors with toast notifications
 * 
 * This is a convenience function that combines error handling,
 * logging, and toast notifications.
 * 
 * @param error - The error to handle
 * @param handler - The error handler function to use
 * @param context - Context string for logging
 * @param showToast - Toast notification function
 */
export function handleErrorWithToast(
  error: unknown,
  handler: (error: unknown) => ErrorResult,
  context: string,
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void
): ErrorResult {
  const errorResult = handler(error);
  
  logError(context, errorResult);
  
  const toastType = getToastType(errorResult.type);
  showToast(errorResult.message, toastType);
  
  return errorResult;
}
