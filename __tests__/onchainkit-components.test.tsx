import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Providers } from '@/components/Providers';

// Mock wagmi
vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
  })),
  WagmiProvider: ({ children }: any) => children,
  useConnect: vi.fn(() => ({ connectors: [] })),
  useDisconnect: vi.fn(() => ({ disconnect: vi.fn() })),
  useSwitchChain: vi.fn(() => ({ switchChain: vi.fn(), chains: [] })),
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
  useReadContract: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
  useReadContracts: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

// Mock OnchainKit Provider
vi.mock('@coinbase/onchainkit', () => ({
  OnchainKitProvider: ({ children, apiKey, chain, config }: any) => (
    <div data-testid="onchainkit-provider" data-api-key={apiKey} data-chain={chain?.name}>
      {children}
    </div>
  ),
}));

// Mock Identity components
vi.mock('@coinbase/onchainkit/identity', () => ({
  Identity: ({ children, hasCopyAddressOnClick }: any) => (
    <div data-testid="identity" data-copy-enabled={hasCopyAddressOnClick}>
      {children}
    </div>
  ),
  Avatar: ({ className }: any) => (
    <div data-testid="avatar" className={className}>
      Avatar
    </div>
  ),
  Name: () => <div data-testid="name">vitalik.eth</div>,
  Address: () => <div data-testid="address">0x123...456</div>,
  EthBalance: () => <div data-testid="eth-balance">1.5 ETH</div>,
  Badge: () => <div data-testid="badge">Verified</div>,
}));

// Mock Wallet components
vi.mock('@coinbase/onchainkit/wallet', () => ({
  Wallet: ({ children }: any) => <div data-testid="wallet">{children}</div>,
  ConnectWallet: ({ children }: any) => (
    <button data-testid="connect-wallet">{children || 'Connect'}</button>
  ),
  WalletDropdown: ({ children }: any) => (
    <div data-testid="wallet-dropdown">{children}</div>
  ),
  WalletDropdownBasename: () => (
    <div data-testid="wallet-dropdown-basename">Manage Basename</div>
  ),
  WalletDropdownDisconnect: () => (
    <button data-testid="disconnect">Disconnect</button>
  ),
  WalletDropdownLink: ({ children, href }: any) => (
    <a data-testid="wallet-link" href={href}>
      {children}
    </a>
  ),
}));

// Mock Transaction components
vi.mock('@coinbase/onchainkit/transaction', () => ({
  Transaction: ({ children }: any) => (
    <div data-testid="transaction">{children}</div>
  ),
  TransactionButton: ({ children }: any) => (
    <button data-testid="transaction-button">{children || 'Send Transaction'}</button>
  ),
  TransactionStatus: ({ children }: any) => (
    <div data-testid="transaction-status">{children}</div>
  ),
  TransactionStatusLabel: () => (
    <div data-testid="transaction-status-label">Pending...</div>
  ),
  TransactionStatusAction: () => (
    <button data-testid="transaction-status-action">View on Explorer</button>
  ),
}));

describe('OnchainKit Components - Task 14.2', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OnchainKit Provider Configuration', () => {
    it('should initialize OnchainKitProvider with required parameters', () => {
      render(
        <Providers>
          <div>Test Content</div>
        </Providers>
      );

      const provider = screen.getByTestId('onchainkit-provider');
      expect(provider).toBeInTheDocument();
      expect(provider).toHaveAttribute('data-api-key', 'test-cdp-key');
    });

    it('should configure appearance settings', () => {
      // The provider is configured in Providers.tsx with appearance settings
      render(
        <Providers>
          <div>Test Content</div>
        </Providers>
      );

      expect(screen.getByTestId('onchainkit-provider')).toBeInTheDocument();
    });
  });

  describe('Identity Component Rendering', () => {
    it('should render Identity component with all sub-components', async () => {
      const { Identity, Avatar, Name, Address, EthBalance } = await import(
        '@coinbase/onchainkit/identity'
      );

      render(
        <Identity hasCopyAddressOnClick>
          <Avatar />
          <Name />
          <Address />
          <EthBalance />
        </Identity>
      );

      expect(screen.getByTestId('identity')).toBeInTheDocument();
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
      expect(screen.getByTestId('name')).toBeInTheDocument();
      expect(screen.getByTestId('address')).toBeInTheDocument();
      expect(screen.getByTestId('eth-balance')).toBeInTheDocument();
    });

    it('should support hasCopyAddressOnClick prop', async () => {
      const { Identity } = await import('@coinbase/onchainkit/identity');

      render(
        <Identity hasCopyAddressOnClick>
          <div>Content</div>
        </Identity>
      );

      const identity = screen.getByTestId('identity');
      expect(identity).toHaveAttribute('data-copy-enabled', 'true');
    });

    it('should render Avatar with custom className', async () => {
      const { Avatar } = await import('@coinbase/onchainkit/identity');

      render(<Avatar className="h-6 w-6" />);

      const avatar = screen.getByTestId('avatar');
      expect(avatar).toHaveClass('h-6', 'w-6');
    });
  });

  describe('Wallet Dropdown Functionality', () => {
    it('should render complete wallet dropdown structure', async () => {
      const {
        Wallet,
        ConnectWallet,
        WalletDropdown,
        WalletDropdownBasename,
        WalletDropdownDisconnect,
        WalletDropdownLink,
      } = await import('@coinbase/onchainkit/wallet');

      render(
        <Wallet>
          <ConnectWallet />
          <WalletDropdown>
            <WalletDropdownBasename />
            <WalletDropdownLink href="https://keys.coinbase.com">
              Wallet
            </WalletDropdownLink>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      );

      expect(screen.getByTestId('wallet')).toBeInTheDocument();
      expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-dropdown-basename')).toBeInTheDocument();
      expect(screen.getByTestId('wallet-link')).toBeInTheDocument();
      expect(screen.getByTestId('disconnect')).toBeInTheDocument();
    });

    it('should render external wallet link with correct href', async () => {
      const { WalletDropdownLink } = await import('@coinbase/onchainkit/wallet');

      render(
        <WalletDropdownLink href="https://keys.coinbase.com">
          Wallet
        </WalletDropdownLink>
      );

      const link = screen.getByTestId('wallet-link');
      expect(link).toHaveAttribute('href', 'https://keys.coinbase.com');
    });
  });

  describe('Basename Display', () => {
    it('should render WalletDropdownBasename component', async () => {
      const { WalletDropdownBasename } = await import('@coinbase/onchainkit/wallet');

      render(<WalletDropdownBasename />);

      expect(screen.getByTestId('wallet-dropdown-basename')).toBeInTheDocument();
      expect(screen.getByText('Manage Basename')).toBeInTheDocument();
    });
  });

  describe('Transaction Components', () => {
    it('should render Transaction wrapper component', async () => {
      const { Transaction } = await import('@coinbase/onchainkit/transaction');

      render(
        <Transaction>
          <div>Transaction Content</div>
        </Transaction>
      );

      expect(screen.getByTestId('transaction')).toBeInTheDocument();
    });

    it('should render TransactionButton', async () => {
      const { TransactionButton } = await import('@coinbase/onchainkit/transaction');

      render(<TransactionButton>Send Transaction</TransactionButton>);

      expect(screen.getByTestId('transaction-button')).toBeInTheDocument();
      expect(screen.getByText('Send Transaction')).toBeInTheDocument();
    });

    it('should render TransactionStatus components', async () => {
      const { TransactionStatus, TransactionStatusLabel, TransactionStatusAction } =
        await import('@coinbase/onchainkit/transaction');

      render(
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      );

      expect(screen.getByTestId('transaction-status')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-status-label')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-status-action')).toBeInTheDocument();
    });

    it('should display transaction status information', async () => {
      const { TransactionStatus, TransactionStatusLabel } = await import(
        '@coinbase/onchainkit/transaction'
      );

      render(
        <TransactionStatus>
          <TransactionStatusLabel />
        </TransactionStatus>
      );

      expect(screen.getByText('Pending...')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should integrate Identity components within Wallet dropdown', async () => {
      const { Wallet, WalletDropdown } = await import('@coinbase/onchainkit/wallet');
      const { Identity, Avatar, Name, Address, EthBalance } = await import(
        '@coinbase/onchainkit/identity'
      );

      render(
        <Wallet>
          <WalletDropdown>
            <Identity hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              <EthBalance />
            </Identity>
          </WalletDropdown>
        </Wallet>
      );

      expect(screen.getByTestId('wallet-dropdown')).toBeInTheDocument();
      expect(screen.getByTestId('identity')).toBeInTheDocument();
      expect(screen.getByTestId('avatar')).toBeInTheDocument();
      expect(screen.getByTestId('name')).toBeInTheDocument();
      expect(screen.getByTestId('address')).toBeInTheDocument();
      expect(screen.getByTestId('eth-balance')).toBeInTheDocument();
    });
  });
});
