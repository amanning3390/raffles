import { http, cookieStorage, createConfig, createStorage, fallback } from 'wagmi';
import type { Config, CreateConnectorFn } from '@/types/wagmi';
import type { Chain } from '@/types/wagmi';
import type { Transport } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

// Get environment variables with validation
const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const appName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Raffles';

// Validate required environment variables
if (!alchemyApiKey) {
  console.error('NEXT_PUBLIC_ALCHEMY_API_KEY is required for RPC connections');
}

if (!walletConnectProjectId) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing. WalletConnect will not work.');
}

// Configure chains based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const defaultChain = isDevelopment ? baseSepolia : base;

/**
 * Configure connectors with proper metadata and error handling
 * Following Wagmi v2 best practices for Base blockchain
 */
const connectors: CreateConnectorFn[] = [
  // Injected connector for browser wallets (MetaMask, etc.)
  injected({
    shimDisconnect: true, // Properly handle disconnect events
    target: 'metaMask', // Prioritize MetaMask if available
  }),
  
  // Coinbase Wallet with Smart Wallet preference for gasless transactions
  coinbaseWallet({
    appName,
    appLogoUrl: `${appUrl}/logo.png`,
    preference: 'smartWalletOnly', // Use Smart Wallets for gasless transactions on Base
    version: '4', // Use latest Coinbase Wallet SDK version
  }),
  
  // WalletConnect with proper metadata
  walletConnect({
    projectId: walletConnectProjectId,
    metadata: {
      name: appName,
      description: 'Non-custodial raffle platform on Base',
      url: appUrl,
      icons: [`${appUrl}/logo.png`],
    },
    showQrModal: true,
    qrModalOptions: {
      themeMode: 'light',
      themeVariables: {
        '--wcm-z-index': '9999',
      },
    },
  }),
];

/**
 * Configure RPC transports with fallback endpoints for reliability
 * Primary: Alchemy (high performance)
 * Fallback: Public RPC endpoints (reliability)
 */
const transports: Record<number, Transport> = {
  // Base Mainnet with fallback
  [base.id]: fallback([
    // Primary: Alchemy RPC
    http(`https://base-mainnet.g.alchemy.com/v2/${alchemyApiKey}`, {
      batch: true,
      retryCount: 3,
      retryDelay: 1000,
      timeout: 30_000,
    }),
    // Fallback: Public Base RPC
    http('https://mainnet.base.org', {
      batch: true,
      retryCount: 2,
      timeout: 30_000,
    }),
    // Fallback: Coinbase Cloud RPC
    http('https://base.gateway.tenderly.co', {
      batch: true,
      retryCount: 2,
      timeout: 30_000,
    }),
  ]),
  
  // Base Sepolia Testnet with fallback
  [baseSepolia.id]: fallback([
    // Primary: Alchemy RPC
    http(`https://base-sepolia.g.alchemy.com/v2/${alchemyApiKey}`, {
      batch: true,
      retryCount: 3,
      retryDelay: 1000,
      timeout: 30_000,
    }),
    // Fallback: Public Base Sepolia RPC
    http('https://sepolia.base.org', {
      batch: true,
      retryCount: 2,
      timeout: 30_000,
    }),
  ]),
};

/**
 * Wagmi configuration with OnchainKit and Base best practices
 * - SSR support with cookie storage
 * - Multiple wallet connectors
 * - Fallback RPC endpoints for reliability
 * - Proper error handling and reconnection logic
 */
/**
 * Wagmi configuration instance
 * Exported for use in WagmiProvider
 */
export const config: Config = createConfig({
  chains: [base, baseSepolia],
  connectors,
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports,
  // Enable automatic reconnection on page load
  multiInjectedProviderDiscovery: true,
  // Batch multiple calls for better performance
  batch: {
    multicall: {
      batchSize: 1024,
      wait: 16,
    },
  },
});

// Export chain info for easy access
export const supportedChains = [base, baseSepolia];
export { base, baseSepolia, defaultChain };

/**
 * Helper function to get the current chain configuration
 */
export function getCurrentChain() {
  return defaultChain;
}

/**
 * Helper function to check if a chain is supported
 * 
 * @param chainId - The chain ID to check
 * @returns true if the chain is supported, false otherwise
 */
export function isSupportedChain(chainId: number): boolean {
  return supportedChains.some(chain => chain.id === chainId);
}

/**
 * Helper function to get chain by ID
 * 
 * @param chainId - The chain ID to lookup
 * @returns Chain object or undefined if not found
 */
export function getChainById(chainId: number): Chain | undefined {
  return supportedChains.find(chain => chain.id === chainId);
}
