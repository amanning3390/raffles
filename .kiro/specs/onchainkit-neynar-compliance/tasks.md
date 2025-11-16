# Implementation Plan

- [x] 1. Environment validation and configuration
  - Create `lib/env.ts` with environment variable validation
  - Add validation call in root layout or app initialization
  - Update `.env.example` with all required OnchainKit and Neynar variables
  - Add helpful error messages for missing configuration
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 2. Enhance Wagmi configuration
  - [x] 2.1 Update `lib/wagmi.ts` with latest Wagmi v2 patterns
    - Add proper connector metadata for all wallet types
    - Configure Coinbase Wallet with `smartWalletOnly` preference
    - Add proper error handling and reconnection logic
    - Ensure proper TypeScript types for all configurations
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 2.2 Add proper RPC transport configuration
    - Configure Alchemy RPC endpoints for Base and Base Sepolia
    - Add fallback RPC endpoints for reliability
    - Implement proper error handling for RPC failures
    - _Requirements: 2.3_

- [x] 3. Enhance OnchainKit provider configuration
  - [x] 3.1 Update `components/Providers.tsx` with full OnchainKit config
    - Add all required OnchainKit configuration parameters
    - Configure appearance settings (name, logo, mode, theme)
    - Add error boundary for OnchainKit failures
    - Ensure proper TypeScript types
    - _Requirements: 1.1, 6.1_
  
  - [x] 3.2 Add Neynar provider configuration
    - Wrap app with NeynarContextProvider if Neynar is configured
    - Pass client ID and configuration
    - Handle missing Neynar configuration gracefully
    - _Requirements: 3.4_

- [x] 4. Enhance wallet connection components
  - [x] 4.1 Update `components/wallet/WalletConnect.tsx`
    - Use all OnchainKit Wallet components (Wallet, ConnectWallet, WalletDropdown)
    - Add WalletDropdownBasename for Basename management
    - Add WalletDropdownLink for external wallet links
    - Implement proper error handling with toast notifications
    - Add proper TypeScript types for all props
    - _Requirements: 1.2, 1.5, 4.4, 6.1_
  
  - [x] 4.2 Update identity display throughout app
    - Replace custom address formatting with OnchainKit Address component
    - Use Avatar component for user avatars
    - Use Name component for ENS/Basename resolution
    - Use EthBalance component for balance display
    - Add hasCopyAddressOnClick where appropriate
    - _Requirements: 1.3, 1.4, 1.5_

- [x] 5. Create identity components
  - [x] 5.1 Create `components/identity/UserIdentity.tsx`
    - Import and use OnchainKit Identity components
    - Create reusable component for user identity display
    - Add props for customization (showBalance, showBadge, etc.)
    - Implement proper TypeScript interface
    - _Requirements: 1.3, 6.1_
  
  - [x] 5.2 Update raffle pages to use UserIdentity component
    - Replace custom creator display in RaffleCard
    - Update raffle detail page participant list
    - Update profile page identity display
    - _Requirements: 1.3, 1.4_

- [x] 6. Implement Neynar SDK integration
  - [x] 6.1 Create `lib/neynar-client.ts`
    - Initialize NeynarAPIClient with API key
    - Create helper functions for common operations (getUserByFid, getUserByAddress)
    - Implement SIWN message generation and verification
    - Add proper error handling for all Neynar operations
    - Add proper TypeScript types for all functions
    - _Requirements: 3.1, 3.2, 4.3, 6.2_
  
  - [x] 6.2 Create API route for SIWN verification
    - Create `app/api/auth/farcaster/route.ts`
    - Implement server-side signature verification
    - Store authentication state in secure session
    - Return user data on successful authentication
    - _Requirements: 3.2_

- [x] 7. Implement Farcaster authentication
  - [x] 7.1 Create `components/farcaster/FarcasterAuth.tsx`
    - Implement SIWN authentication flow
    - Generate SIWN message using Neynar SDK
    - Request signature from user's wallet
    - Verify signature with server-side API
    - Store authentication state
    - Add proper loading and error states
    - _Requirements: 3.1, 3.2, 4.3, 6.2_
  
  - [x] 7.2 Update `components/farcaster/FarcasterLink.tsx`
    - Replace placeholder with real FarcasterAuth component
    - Implement proper authentication flow
    - Add error handling and user feedback
    - Ensure optional nature of Farcaster features
    - _Requirements: 3.4_

- [x] 8. Enhance Farcaster profile display
  - [x] 8.1 Update `components/farcaster/FarcasterProfile.tsx`
    - Fetch real user data from Neynar SDK
    - Display avatar using Next.js Image component
    - Show username, display name, and FID
    - Add link to Warpcast profile
    - Implement proper loading and error states
    - _Requirements: 3.3, 3.5, 7.5_
  
  - [x] 8.2 Create custom hook for Farcaster user data
    - Create `hooks/useFarcasterUser.ts`
    - Implement TanStack Query for caching
    - Add proper stale time and cache time
    - Handle errors gracefully
    - Add proper TypeScript types
    - _Requirements: 3.3, 7.2, 6.2_

- [x] 9. Implement transaction components
  - [x] 9.1 Create `components/transaction/TransactionWrapper.tsx`
    - Import OnchainKit Transaction components
    - Create wrapper for common transaction patterns
    - Add transaction status tracking
    - Implement retry logic
    - Add proper TypeScript types
    - _Requirements: 1.4, 6.1_
  
  - [x] 9.2 Update raffle creation to use Transaction component
    - Replace custom transaction handling in `app/create/page.tsx`
    - Use TransactionButton for better UX
    - Add TransactionStatus for status display
    - Implement proper error handling
    - _Requirements: 1.4, 4.1_
  
  - [x] 9.3 Update raffle entry to use Transaction component
    - Replace custom transaction handling in `app/raffle/[id]/page.tsx`
    - Use TransactionButton for entry flow
    - Add TransactionStatus for status display
    - Implement proper error handling
    - _Requirements: 1.4, 4.1_

- [x] 10. Enhance error handling
  - [x] 10.1 Create error handling utilities
    - Create `lib/error-handlers.ts`
    - Implement handleOnchainKitError function
    - Implement handleNeynarError function
    - Add error transformation logic
    - Add proper TypeScript types
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 10.2 Update components to use error handlers
    - Update all OnchainKit component error handling
    - Update all Neynar SDK error handling
    - Ensure user-friendly error messages
    - Add proper logging in development
    - _Requirements: 4.1, 4.2, 4.3_

- [x] 11. Implement performance optimizations
  - [x] 11.1 Add code splitting for OnchainKit components
    - Use dynamic imports for Transaction components
    - Lazy load heavy OnchainKit components
    - Add loading states for lazy-loaded components
    - _Requirements: 7.1_
  
  - [x] 11.2 Implement caching for Neynar data
    - Configure TanStack Query cache times
    - Add stale time for user data (5 minutes)
    - Implement prefetching on hover
    - _Requirements: 7.2_
  
  - [x] 11.3 Optimize image loading
    - Use Next.js Image for all Farcaster avatars
    - Add proper width/height attributes
    - Implement lazy loading for images
    - _Requirements: 7.5_
  
  - [x] 11.4 Implement batch contract reads
    - Update `hooks/useRaffleContract.ts` to use useReadContracts
    - Batch multiple raffle data fetches
    - Reduce number of RPC calls
    - _Requirements: 7.3_

- [x] 12. Update TypeScript types
  - [x] 12.1 Add proper types for OnchainKit
    - Import types from @coinbase/onchainkit
    - Type all component props
    - Type all hook return values
    - _Requirements: 6.1, 6.3_
  
  - [x] 12.2 Add proper types for Neynar SDK
    - Import types from @neynar/nodejs-sdk
    - Type all API responses
    - Type all hook return values
    - Create custom types for app-specific data
    - _Requirements: 6.2, 6.3_
  
  - [x] 12.3 Add proper types for Wagmi/Viem
    - Use Address type from viem for all addresses
    - Type all contract interactions
    - Type all hook parameters and returns
    - _Requirements: 6.4, 6.5_

- [x] 13. Update documentation
  - [x] 13.1 Update README.md
    - Add OnchainKit setup instructions
    - Add Neynar SDK setup instructions
    - Document required API keys
    - Add troubleshooting section
    - _Requirements: 8.2_
  
  - [x] 13.2 Update .env.example
    - Add all OnchainKit environment variables
    - Add all Neynar environment variables
    - Add helpful comments for each variable
    - Document optional vs required variables
    - _Requirements: 8.1, 8.2_
  
  - [x] 13.3 Create ONCHAINKIT_GUIDE.md
    - Document OnchainKit component usage
    - Add examples for common patterns
    - Document error handling
    - Add troubleshooting tips
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 13.4 Create NEYNAR_GUIDE.md
    - Document Neynar SDK setup
    - Document SIWN authentication flow
    - Add examples for user data fetching
    - Document optional feature degradation
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 14. Testing and validation
  - [x] 14.1 Test wallet connection flow
    - Test Coinbase Wallet connection
    - Test MetaMask connection
    - Test WalletConnect connection
    - Test network switching
    - Test disconnection and reconnection
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 14.2 Test OnchainKit components
    - Test Identity component rendering
    - Test Wallet dropdown functionality
    - Test Basename display
    - Test Transaction components
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 14.3 Test Farcaster authentication
    - Test SIWN flow with valid signature
    - Test SIWN flow with invalid signature
    - Test user data fetching
    - Test optional feature degradation
    - Test error handling
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [x] 14.4 Test error handling
    - Test OnchainKit error scenarios
    - Test Neynar error scenarios
    - Test network error handling
    - Test missing API key handling
    - Verify user-friendly error messages
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 14.5 Test performance optimizations
    - Verify code splitting works
    - Verify caching works for Neynar data
    - Verify batch contract reads work
    - Verify image optimization works
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
