'use client';

import { useAccount, useSwitchChain } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

export function NetworkSwitcher() {
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();

  const isTestnet = chain?.id === baseSepolia.id;

  return (
    <button
      onClick={() => switchChain({ chainId: isTestnet ? base.id : baseSepolia.id })}
      className="px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition"
      title={isTestnet ? 'Switch to Mainnet' : 'Switch to Testnet'}
    >
      {isTestnet ? (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          Sepolia
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Base
        </span>
      )}
    </button>
  );
}
