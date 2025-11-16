# Requirements Document

## Introduction

This specification addresses the compliance of the Raffles application with OnchainKit and Neynar SDK best practices. The application currently uses basic implementations of both SDKs but needs to be audited and updated to follow official patterns, leverage advanced features, and ensure proper integration with Base blockchain and Farcaster social features.

## Glossary

- **OnchainKit**: Coinbase's official SDK for building onchain applications on Base, providing wallet connection, identity, transactions, and UI components
- **Neynar SDK**: Official SDK for Farcaster integration, providing authentication (SIWN), user data, and social features
- **Base**: Coinbase's Layer 2 blockchain built on Ethereum
- **SIWN**: Sign In With Neynar - authentication protocol for Farcaster
- **Raffle Application**: The non-custodial raffle platform being audited
- **Smart Wallet**: Coinbase's smart contract wallet with gasless transaction support
- **Farcaster**: Decentralized social network protocol

## Requirements

### Requirement 1

**User Story:** As a developer, I want the application to use OnchainKit components correctly, so that users have a consistent and optimized Base blockchain experience

#### Acceptance Criteria

1. WHEN THE Raffle Application initializes, THE OnchainKitProvider SHALL be configured with all required parameters including apiKey, chain, and appearance settings
2. WHERE wallet connection is implemented, THE Raffle Application SHALL use OnchainKit's Wallet components (ConnectWallet, WalletDropdown, WalletDropdownDisconnect) instead of custom implementations
3. WHERE user identity is displayed, THE Raffle Application SHALL use OnchainKit's Identity components (Avatar, Name, Address, EthBalance) for consistent rendering
4. WHERE transactions are initiated, THE Raffle Application SHALL use OnchainKit's Transaction components when available for improved UX
5. WHEN displaying blockchain addresses, THE Raffle Application SHALL use OnchainKit's Address component with proper formatting and ENS resolution

### Requirement 2

**User Story:** As a developer, I want proper Wagmi v2 configuration with OnchainKit, so that wallet connections are reliable and follow best practices

#### Acceptance Criteria

1. WHEN configuring Wagmi, THE Raffle Application SHALL use the latest Wagmi v2 patterns with proper connector configuration
2. WHERE Coinbase Wallet is configured, THE Raffle Application SHALL set preference to 'smartWalletOnly' for gasless transactions
3. WHERE multiple chains are supported, THE Raffle Application SHALL configure proper RPC transports for Base and Base Sepolia
4. WHEN using SSR, THE Raffle Application SHALL configure cookieStorage for proper server-side wallet state persistence
5. WHERE WalletConnect is configured, THE Raffle Application SHALL include proper metadata (name, description, url, icons)

### Requirement 3

**User Story:** As a user, I want optional Farcaster integration using Neynar SDK, so that I can connect my social identity without being required to do so

#### Acceptance Criteria

1. WHERE Farcaster features are implemented, THE Raffle Application SHALL use Neynar SDK's official authentication methods (SIWN)
2. WHEN a user chooses to link Farcaster, THE Raffle Application SHALL implement proper SIWN flow with signature verification
3. WHERE Farcaster user data is displayed, THE Raffle Application SHALL use Neynar SDK's user data fetching methods
4. WHEN Farcaster is not configured, THE Raffle Application SHALL gracefully degrade and allow wallet-only usage
5. WHERE Farcaster profiles are shown, THE Raffle Application SHALL display user avatars, usernames, and FIDs using Neynar data

### Requirement 4

**User Story:** As a developer, I want proper error handling for OnchainKit and Neynar SDK operations, so that users receive clear feedback when issues occur

#### Acceptance Criteria

1. WHEN OnchainKit operations fail, THE Raffle Application SHALL display user-friendly error messages using the toast system
2. WHERE API keys are missing, THE Raffle Application SHALL log clear warnings and gracefully degrade functionality
3. WHEN network requests to Neynar fail, THE Raffle Application SHALL handle errors without breaking the application
4. WHERE wallet connection fails, THE Raffle Application SHALL provide actionable error messages to users
5. WHEN transaction signing is rejected, THE Raffle Application SHALL display appropriate feedback and allow retry

### Requirement 5

**User Story:** As a developer, I want to use OnchainKit's latest features for Base-specific functionality, so that the application leverages platform advantages

#### Acceptance Criteria

1. WHERE Basename (Base ENS) is available, THE Raffle Application SHALL display Basenames using OnchainKit's Name component
2. WHEN showing wallet dropdowns, THE Raffle Application SHALL include WalletDropdownBasename for Basename management
3. WHERE user balances are displayed, THE Raffle Application SHALL use OnchainKit's EthBalance component with proper formatting
4. WHEN implementing identity features, THE Raffle Application SHALL use OnchainKit's Identity component with hasCopyAddressOnClick
5. WHERE links to external Base resources are needed, THE Raffle Application SHALL use OnchainKit's WalletDropdownLink component

### Requirement 6

**User Story:** As a developer, I want proper TypeScript types from OnchainKit and Neynar SDK, so that the codebase is type-safe and maintainable

#### Acceptance Criteria

1. WHERE OnchainKit components are used, THE Raffle Application SHALL import and use proper TypeScript types
2. WHEN working with Neynar SDK, THE Raffle Application SHALL use official type definitions for API responses
3. WHERE custom hooks wrap SDK functionality, THE Raffle Application SHALL properly type all parameters and return values
4. WHEN handling wallet addresses, THE Raffle Application SHALL use proper Address types from viem
5. WHERE configuration objects are defined, THE Raffle Application SHALL use proper types from respective SDKs

### Requirement 7

**User Story:** As a user, I want optimized performance when using OnchainKit and Neynar features, so that the application loads quickly and responds smoothly

#### Acceptance Criteria

1. WHERE OnchainKit components are imported, THE Raffle Application SHALL use proper code splitting and lazy loading
2. WHEN fetching Neynar data, THE Raffle Application SHALL implement proper caching with TanStack Query
3. WHERE multiple blockchain reads occur, THE Raffle Application SHALL batch requests when possible
4. WHEN rendering lists of blockchain data, THE Raffle Application SHALL implement proper pagination and virtualization
5. WHERE images from Neynar are displayed, THE Raffle Application SHALL use Next.js Image component with proper optimization

### Requirement 8

**User Story:** As a developer, I want proper environment variable configuration for OnchainKit and Neynar, so that the application works across different environments

#### Acceptance Criteria

1. WHEN deploying the application, THE Raffle Application SHALL validate all required environment variables at build time
2. WHERE API keys are missing, THE Raffle Application SHALL provide clear error messages indicating which keys are needed
3. WHEN running in development, THE Raffle Application SHALL use appropriate testnet configurations
4. WHERE production deployment occurs, THE Raffle Application SHALL use mainnet configurations with proper validation
5. WHEN environment variables change, THE Raffle Application SHALL require rebuild to ensure consistency
