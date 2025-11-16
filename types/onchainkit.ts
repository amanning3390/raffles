/**
 * OnchainKit Type Definitions
 * Centralized type exports from @coinbase/onchainkit for type safety
 */

// Identity types
export type {
  IdentityProps,
  AvatarProps,
  NameProps,
  AddressProps,
  EthBalanceProps,
  BadgeProps,
} from '@coinbase/onchainkit/identity';

// Wallet types
export type {
  WalletProps,
  ConnectWalletProps,
  WalletDropdownProps,
  WalletDropdownDisconnectProps,
  WalletDropdownLinkProps,
} from '@coinbase/onchainkit/wallet';

// Transaction types
export type {
  TransactionProps,
  TransactionButtonProps,
  TransactionStatusProps,
  TransactionStatusLabelProps,
  TransactionStatusActionProps,
  TransactionError,
  TransactionResponseType,
  LifecycleStatus,
} from '@coinbase/onchainkit/transaction';

// Config types
export type {
  AppConfig,
  OnchainKitConfig,
} from '@coinbase/onchainkit';
