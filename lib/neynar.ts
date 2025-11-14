/**
 * Neynar SDK Configuration
 * For optional Farcaster integration
 */

export const neynarConfig = {
  clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID || '',
  apiKey: process.env.NEYNAR_API_KEY || '',
};

// Check if Neynar is configured
export const isNeynarConfigured = () => {
  return !!(neynarConfig.clientId && neynarConfig.apiKey);
};
