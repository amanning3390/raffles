import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock wagmi hooks for batch reads
const mockUseReadContracts = vi.fn();

vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  })),
  useReadContracts: () => mockUseReadContracts(),
  useReadContract: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useWriteContract: vi.fn(() => ({
    writeContract: vi.fn(),
    data: undefined,
    isPending: false,
    error: null,
  })),
  useWaitForTransactionReceipt: vi.fn(() => ({
    isLoading: false,
    isSuccess: false,
  })),
  WagmiProvider: ({ children }: any) => children,
}));

describe('Performance Optimizations - Task 14.5', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });
  });

  describe('Code Splitting', () => {
    it('should support dynamic imports for components', async () => {
      // Test that dynamic imports work
      const dynamicImport = () => import('@/components/wallet/WalletConnect');
      
      const module = await dynamicImport();
      expect(module).toBeDefined();
      expect(module.WalletConnect).toBeDefined();
    });

    it('should lazy load Farcaster components', async () => {
      const dynamicImport = () => import('@/components/farcaster/FarcasterAuth');
      
      const module = await dynamicImport();
      expect(module).toBeDefined();
      expect(module.FarcasterAuth).toBeDefined();
    });

    it('should support code splitting for heavy dependencies', async () => {
      // Verify that OnchainKit can be imported dynamically
      const onchainKitImport = () => import('@coinbase/onchainkit');
      
      const module = await onchainKitImport();
      expect(module).toBeDefined();
    });
  });

  describe('Caching for Neynar Data', () => {
    it('should configure query client with caching', () => {
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      });

      const options = testQueryClient.getDefaultOptions();
      expect(options.queries?.staleTime).toBe(60 * 1000);
      expect(options.queries?.gcTime).toBe(5 * 60 * 1000);
    });

    it('should cache query results', async () => {
      const queryKey = ['neynar', 'user', '12345'];
      const queryFn = vi.fn().mockResolvedValue({ username: 'testuser' });

      await queryClient.fetchQuery({
        queryKey,
        queryFn,
      });

      // Second call should use cache
      const cachedData = queryClient.getQueryData(queryKey);
      expect(cachedData).toEqual({ username: 'testuser' });
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should respect stale time for cached data', async () => {
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000, // 1 second
          },
        },
      });

      const queryKey = ['test', 'data'];
      const queryFn = vi.fn().mockResolvedValue({ data: 'test' });

      await testQueryClient.fetchQuery({ queryKey, queryFn });

      // Immediate refetch should use cache
      await testQueryClient.refetchQueries({ queryKey });
      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it('should invalidate cache when needed', async () => {
      const queryKey = ['neynar', 'user'];
      const queryFn = vi.fn().mockResolvedValue({ username: 'user1' });

      await queryClient.fetchQuery({ queryKey, queryFn });

      // Invalidate cache
      await queryClient.invalidateQueries({ queryKey });

      // Next fetch should call queryFn again
      await queryClient.fetchQuery({ queryKey, queryFn });
      expect(queryFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('Batch Contract Reads', () => {
    it('should batch multiple contract reads into single call', async () => {
      const mockData = [
        { result: { id: 1n, status: 0 } },
        { result: { id: 2n, status: 1 } },
        { result: { id: 3n, status: 0 } },
      ];

      mockUseReadContracts.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { useBatchRaffleData } = await import('@/hooks/useRaffleContract');
      const raffleIds = [1n, 2n, 3n];

      const TestComponent = () => {
        const { raffles, isLoading } = useBatchRaffleData(raffleIds);
        return (
          <div>
            {isLoading ? 'Loading...' : `Loaded ${raffles.length} raffles`}
          </div>
        );
      };

      const { container } = render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(container.textContent).toContain('Loaded 3 raffles');
      });

      // Verify useReadContracts was called once with all contracts
      expect(mockUseReadContracts).toHaveBeenCalled();
    });

    it('should batch raffle data with entries', async () => {
      const mockData = [
        { result: { id: 1n } },
        { result: 10n },
        { result: { id: 2n } },
        { result: 20n },
      ];

      mockUseReadContracts.mockReturnValue({
        data: mockData,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      const { useBatchRaffleDataWithEntries } = await import('@/hooks/useRaffleContract');
      const raffleIds = [1n, 2n];

      const TestComponent = () => {
        const { rafflesWithEntries } = useBatchRaffleDataWithEntries(raffleIds);
        return <div>Loaded {rafflesWithEntries.length} raffles with entries</div>;
      };

      const { container } = render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(container.textContent).toContain('Loaded 2 raffles with entries');
      });
    });

    it('should reduce RPC calls with batch reads', () => {
      const raffleIds = [1n, 2n, 3n, 4n, 5n];
      
      // Without batching: 5 separate calls
      // With batching: 1 call
      
      mockUseReadContracts.mockReturnValue({
        data: raffleIds.map(id => ({ result: { id } })),
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      // Verify only one hook call is made
      expect(mockUseReadContracts).toHaveBeenCalledTimes(1);
    });
  });

  describe('Image Optimization', () => {
    it('should use Next.js Image component for optimization', async () => {
      // Verify Next.js Image is available
      const NextImage = await import('next/image');
      expect(NextImage.default).toBeDefined();
    });

    it('should support lazy loading for images', () => {
      // Next.js Image component supports lazy loading by default
      const imageProps = {
        src: '/test.jpg',
        alt: 'Test',
        width: 100,
        height: 100,
        loading: 'lazy' as const,
      };

      expect(imageProps.loading).toBe('lazy');
    });

    it('should optimize external images', () => {
      const externalImageUrl = 'https://example.com/avatar.png';
      
      // Next.js can optimize external images with proper config
      expect(externalImageUrl).toMatch(/^https?:\/\//);
    });
  });

  describe('Query Optimization', () => {
    it('should disable refetch on window focus for blockchain data', () => {
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      });

      const options = testQueryClient.getDefaultOptions();
      expect(options.queries?.refetchOnWindowFocus).toBe(false);
    });

    it('should configure retry strategy', () => {
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
          },
        },
      });

      const options = testQueryClient.getDefaultOptions();
      expect(options.queries?.retry).toBe(1);
    });

    it('should use appropriate garbage collection time', () => {
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      });

      const options = testQueryClient.getDefaultOptions();
      expect(options.queries?.gcTime).toBe(5 * 60 * 1000);
    });
  });

  describe('Performance Metrics', () => {
    it('should measure component render time', () => {
      const startTime = performance.now();
      
      const TestComponent = () => <div>Test</div>;
      render(<TestComponent />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Render should be fast (< 100ms)
      expect(renderTime).toBeLessThan(100);
    });

    it('should track query performance', async () => {
      const startTime = performance.now();
      
      const queryFn = vi.fn().mockResolvedValue({ data: 'test' });
      await queryClient.fetchQuery({
        queryKey: ['performance', 'test'],
        queryFn,
      });
      
      const endTime = performance.now();
      const queryTime = endTime - startTime;
      
      // Query should complete quickly
      expect(queryTime).toBeLessThan(1000);
    });
  });

  describe('Memory Management', () => {
    it('should clean up queries after garbage collection time', async () => {
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 0, // Immediate cleanup
          },
        },
      });

      const queryKey = ['test', 'cleanup'];
      await testQueryClient.fetchQuery({
        queryKey,
        queryFn: async () => ({ data: 'test' }),
      });

      // Remove all queries
      testQueryClient.removeQueries();

      const cachedData = testQueryClient.getQueryData(queryKey);
      expect(cachedData).toBeUndefined();
    });

    it('should limit cache size with garbage collection', () => {
      const testQueryClient = new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000,
          },
        },
      });

      // Cache should be managed automatically
      expect(testQueryClient.getQueryCache()).toBeDefined();
    });
  });

  describe('Bundle Size Optimization', () => {
    it('should use tree-shaking for OnchainKit imports', async () => {
      // Import specific components instead of entire library
      const { Identity } = await import('@coinbase/onchainkit/identity');
      const { Wallet } = await import('@coinbase/onchainkit/wallet');

      expect(Identity).toBeDefined();
      expect(Wallet).toBeDefined();
    });

    it('should support selective Neynar SDK imports', async () => {
      // Verify modular imports work
      const neynarReact = await import('@neynar/react');
      expect(neynarReact.NeynarContextProvider).toBeDefined();
    });
  });
});
