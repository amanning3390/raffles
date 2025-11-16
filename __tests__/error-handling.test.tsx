import { describe, it, expect, vi } from 'vitest';
import {
  handleOnchainKitError,
  handleNeynarError,
  handleErrorWithToast,
  isNetworkError,
} from '@/lib/error-handlers';

// Mock toast
const mockShowToast = vi.fn();

describe('Error Handling - Task 14.4', () => {
  describe('OnchainKit Error Scenarios', () => {
    it('should handle wallet connection errors', () => {
      const error = new Error('User rejected the request');
      const result = handleOnchainKitError(error, 'WalletConnect');

      expect(result.handled).toBe(true);
      expect(result.message).toContain('rejected');
      expect(result.severity).toBe('warning');
    });

    it('should handle transaction errors', () => {
      const error = new Error('Transaction failed');
      const result = handleOnchainKitError(error, 'Transaction');

      expect(result.handled).toBe(true);
      expect(result.message).toBeTruthy();
    });

    it('should handle insufficient funds error', () => {
      const error = new Error('insufficient funds for gas');
      const result = handleOnchainKitError(error, 'Transaction');

      expect(result.handled).toBe(true);
      expect(result.message).toContain('insufficient funds');
      expect(result.severity).toBe('error');
    });

    it('should handle network switching errors', () => {
      const error = new Error('Chain not configured');
      const result = handleOnchainKitError(error, 'NetworkSwitch');

      expect(result.handled).toBe(true);
      expect(result.message).toBeTruthy();
    });

    it('should handle unknown OnchainKit errors', () => {
      const error = new Error('Unknown error');
      const result = handleOnchainKitError(error, 'Unknown');

      expect(result.handled).toBe(false);
      expect(result.message).toBe('Unknown error');
    });
  });

  describe('Neynar Error Scenarios', () => {
    it('should handle authentication errors', () => {
      const error = new Error('Invalid signature');
      const result = handleNeynarError(error, 'FarcasterAuth');

      expect(result.handled).toBe(true);
      expect(result.message).toContain('signature');
    });

    it('should handle API key errors', () => {
      const error = new Error('Invalid API key');
      const result = handleNeynarError(error, 'NeynarClient');

      expect(result.handled).toBe(true);
      expect(result.message).toContain('API key');
      expect(result.severity).toBe('error');
    });

    it('should handle rate limit errors', () => {
      const error = new Error('Rate limit exceeded');
      const result = handleNeynarError(error, 'NeynarClient');

      expect(result.handled).toBe(true);
      expect(result.message).toContain('rate limit');
      expect(result.severity).toBe('warning');
    });

    it('should handle user not found errors', () => {
      const error = new Error('User not found');
      const result = handleNeynarError(error, 'NeynarClient');

      expect(result.handled).toBe(true);
      expect(result.message).toContain('not found');
    });

    it('should handle network timeout errors', () => {
      const error = new Error('Request timeout');
      const result = handleNeynarError(error, 'NeynarClient');

      expect(result.handled).toBe(true);
      expect(result.message).toContain('timeout');
    });
  });

  describe('Network Error Handling', () => {
    it('should identify network errors', () => {
      const networkError = new Error('Network request failed');
      expect(isNetworkError(networkError)).toBe(true);
    });

    it('should identify fetch errors', () => {
      const fetchError = new Error('Failed to fetch');
      expect(isNetworkError(fetchError)).toBe(true);
    });

    it('should identify timeout errors', () => {
      const timeoutError = new Error('Request timeout');
      expect(isNetworkError(timeoutError)).toBe(true);
    });

    it('should not identify non-network errors', () => {
      const regularError = new Error('Something went wrong');
      expect(isNetworkError(regularError)).toBe(false);
    });

    it('should handle network errors with user-friendly messages', () => {
      const error = new Error('Network request failed');
      const result = handleErrorWithToast(
        error,
        handleOnchainKitError,
        'Test',
        mockShowToast
      );

      expect(result.message).toBeTruthy();
      expect(mockShowToast).toHaveBeenCalled();
    });
  });

  describe('Missing API Key Handling', () => {
    it('should handle missing CDP API key', () => {
      const error = new Error('CDP API key is required');
      const result = handleOnchainKitError(error, 'OnchainKitProvider');

      expect(result.handled).toBe(true);
      expect(result.message).toContain('API key');
      expect(result.severity).toBe('error');
    });

    it('should handle missing Neynar API key', () => {
      const error = new Error('Neynar client ID is required');
      const result = handleNeynarError(error, 'NeynarProvider');

      expect(result.handled).toBe(true);
      expect(result.message).toContain('client ID');
      expect(result.severity).toBe('error');
    });

    it('should provide helpful message for missing configuration', () => {
      const error = new Error('Missing required configuration');
      const result = handleErrorWithToast(
        error,
        handleOnchainKitError,
        'Config',
        mockShowToast
      );

      expect(result.message).toBeTruthy();
      expect(mockShowToast).toHaveBeenCalled();
    });
  });

  describe('User-Friendly Error Messages', () => {
    it('should convert technical errors to user-friendly messages', () => {
      const technicalError = new Error('RPC call failed: execution reverted');
      const result = handleOnchainKitError(technicalError, 'Transaction');

      expect(result.message).not.toContain('RPC');
      expect(result.message).toBeTruthy();
    });

    it('should provide actionable error messages', () => {
      const error = new Error('User rejected the request');
      const result = handleOnchainKitError(error, 'WalletConnect');

      expect(result.message).toContain('rejected');
      expect(result.severity).toBe('warning');
    });

    it('should handle errors with toast notifications', () => {
      const error = new Error('Test error');
      handleErrorWithToast(error, handleOnchainKitError, 'Test', mockShowToast);

      expect(mockShowToast).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringMatching(/error|warning/)
      );
    });

    it('should preserve error context in messages', () => {
      const error = new Error('Transaction failed: insufficient funds');
      const result = handleOnchainKitError(error, 'Transaction');

      expect(result.message).toContain('insufficient funds');
    });
  });

  describe('Error Severity Levels', () => {
    it('should classify user rejections as warnings', () => {
      const error = new Error('User rejected');
      const result = handleOnchainKitError(error, 'WalletConnect');

      expect(result.severity).toBe('warning');
    });

    it('should classify system errors as errors', () => {
      const error = new Error('System failure');
      const result = handleOnchainKitError(error, 'System');

      expect(result.severity).toBe('error');
    });

    it('should classify network errors appropriately', () => {
      const error = new Error('Network request failed');
      const result = handleErrorWithToast(
        error,
        handleOnchainKitError,
        'Network',
        mockShowToast
      );

      expect(result.severity).toMatch(/error|warning/);
    });
  });

  describe('Error Recovery', () => {
    it('should provide recovery suggestions for common errors', () => {
      const error = new Error('insufficient funds');
      const result = handleOnchainKitError(error, 'Transaction');

      expect(result.message).toBeTruthy();
      expect(result.handled).toBe(true);
    });

    it('should handle multiple error handlers in sequence', () => {
      const error = new Error('Test error');
      
      // Try OnchainKit handler first
      let result = handleOnchainKitError(error, 'Test');
      
      // If not handled, try Neynar handler
      if (!result.handled) {
        result = handleNeynarError(error, 'Test');
      }

      expect(result).toBeDefined();
      expect(result.message).toBeTruthy();
    });
  });

  describe('Error Logging', () => {
    it('should log errors with context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const error = new Error('Test error');
      handleErrorWithToast(error, handleOnchainKitError, 'TestContext', mockShowToast);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null errors', () => {
      const result = handleErrorWithToast(
        null as any,
        handleOnchainKitError,
        'Test',
        mockShowToast
      );

      expect(result.message).toBeTruthy();
    });

    it('should handle undefined errors', () => {
      const result = handleErrorWithToast(
        undefined as any,
        handleOnchainKitError,
        'Test',
        mockShowToast
      );

      expect(result.message).toBeTruthy();
    });

    it('should handle errors without messages', () => {
      const error = new Error();
      const result = handleOnchainKitError(error, 'Test');

      expect(result.message).toBeTruthy();
    });

    it('should handle non-Error objects', () => {
      const error = { message: 'String error' };
      const result = handleErrorWithToast(
        error as any,
        handleOnchainKitError,
        'Test',
        mockShowToast
      );

      expect(result.message).toBeTruthy();
    });
  });
});
