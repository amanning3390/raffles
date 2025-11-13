'use client';

import Link from 'next/link';
import { WalletConnect } from './wallet/WalletConnect';
import { NetworkSwitcher } from './wallet/NetworkSwitcher';
import { useAccount } from 'wagmi';

export function Navbar() {
  const { isConnected } = useAccount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Raffles
            </span>
          </Link>

          {/* Navigation Links (Coming Soon) */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            >
              Browse
            </Link>
            <Link
              href="/create"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
            >
              Create
            </Link>
          </div>

          {/* Wallet & Network Switcher */}
          <div className="flex items-center gap-3">
            {isConnected && <NetworkSwitcher />}
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
