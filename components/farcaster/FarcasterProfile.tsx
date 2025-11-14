'use client';

/**
 * Optional Farcaster profile display
 * Only shows if user has linked their Farcaster account
 */
export function FarcasterProfile({ fid }: { fid?: number }) {
  // No FID = wallet-only user (totally fine!)
  if (!fid) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-purple-600">🟣</span>
      <span className="text-gray-600 dark:text-gray-400">FID: {fid}</span>
    </div>
  );
}
