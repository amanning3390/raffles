import { Navbar } from '@/components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center p-8 pt-24">
        <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Raffles
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create and enter non-custodial raffles on Base.
              Raffle NFTs, tokens, or ETH with complete transparency.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Raffles
            </Link>
            <Link
              href="/create"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition"
            >
              Create Raffle
            </Link>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg space-y-2">
            <div className="text-3xl">🔒</div>
            <h3 className="font-semibold text-lg">Non-Custodial</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your keys, your crypto. All funds locked in smart contracts.
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg space-y-2">
            <div className="text-3xl">🎭</div>
            <h3 className="font-semibold text-lg">No KYC</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Wallet-only authentication. Fully pseudonymous participation.
            </p>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg space-y-2">
            <div className="text-3xl">⚡</div>
            <h3 className="font-semibold text-lg">Base Network</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fast transactions under $0.08. Built on Coinbase's L2.
            </p>
          </div>
        </div>

        <div className="pt-8 text-sm text-gray-500">
          <p>🚧 Phase 1: Foundation - In Development</p>
        </div>
      </div>
    </main>
    </>
  );
}
