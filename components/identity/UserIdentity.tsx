'use client';

import {
  Identity,
  Avatar,
  Name,
  Address,
  EthBalance,
  Badge,
} from '@coinbase/onchainkit/identity';
import type {
  IdentityProps,
  AvatarProps,
  NameProps,
  AddressProps,
  EthBalanceProps,
  BadgeProps,
} from '@/types/onchainkit';
import type { Address as AddressType } from 'viem';
import { usePrefetchFarcasterUser } from '@/hooks/useFarcasterUser';

/**
 * Props for UserIdentity component
 * Extends OnchainKit Identity component with custom options
 */
interface UserIdentityProps {
  address: AddressType;
  showBalance?: boolean;
  showBadge?: boolean;
  hasCopyAddressOnClick?: boolean;
  className?: string;
}

/**
 * UserIdentity component displays user identity information using OnchainKit components.
 * Includes prefetching for Farcaster data on hover for improved performance.
 * 
 * @param address - The Ethereum address to display
 * @param showBalance - Whether to show the ETH balance (default: false)
 * @param showBadge - Whether to show verification badge (default: false)
 * @param hasCopyAddressOnClick - Whether to enable copy address on click (default: false)
 * @param className - Additional CSS classes for the Identity wrapper
 */
export function UserIdentity({
  address,
  showBalance = false,
  showBadge = false,
  hasCopyAddressOnClick = false,
  className = '',
}: UserIdentityProps) {
  const prefetchUser = usePrefetchFarcasterUser();

  return (
    <div onMouseEnter={() => prefetchUser(address)}>
      <Identity
        address={address}
        className={className}
        hasCopyAddressOnClick={hasCopyAddressOnClick}
      >
        <Avatar className="w-10 h-10" />
        <Name className="font-semibold" />
        <Address className="text-sm" />
        {showBalance && <EthBalance className="text-sm" />}
        {showBadge && <Badge />}
      </Identity>
    </div>
  );
}
