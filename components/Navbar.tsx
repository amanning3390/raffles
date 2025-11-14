'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletConnect } from './wallet/WalletConnect';
import { NetworkSwitcher } from './wallet/NetworkSwitcher';
import { useAccount } from 'wagmi';

export function Navbar() {
  const { isConnected, address } = useAccount();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300">
              <span className="text-xl">🎟️</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Raffles
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              Browse
            </Link>
            <Link
              href="/create"
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isActive('/create')
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              Create
            </Link>
            {isConnected && address && (
              <Link
                href={`/profile/${address}`}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  pathname?.startsWith('/profile')
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                }`}
              >
                Profile
              </Link>
            )}
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
