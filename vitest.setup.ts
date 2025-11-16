import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.NEXT_PUBLIC_CDP_API_KEY = 'test-cdp-key';
process.env.NEXT_PUBLIC_ALCHEMY_API_KEY = 'test-alchemy-key';
process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = 'test-wc-id';
process.env.NEXT_PUBLIC_RAFFLE_CORE_ADDRESS = '0x1234567890123456789012345678901234567890';
process.env.NEXT_PUBLIC_CHAIN_ID = '8453';
process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME = 'Raffles Test';
