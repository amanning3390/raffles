/**
 * Environment Variable Validation
 * 
 * This module validates all required environment variables at build time
 * and provides helpful error messages for missing configuration.
 */

// Required environment variables for core functionality
const requiredEnvVars = {
  NEXT_PUBLIC_ALCHEMY_API_KEY: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  NEXT_PUBLIC_CDP_API_KEY: process.env.NEXT_PUBLIC_CDP_API_KEY,
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_RAFFLE_CORE_ADDRESS: process.env.NEXT_PUBLIC_RAFFLE_CORE_ADDRESS,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
} as const;

// Optional environment variables for enhanced features
const optionalEnvVars = {
  NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
  NEXT_PUBLIC_NEYNAR_CLIENT_ID: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID,
  BASESCAN_API_KEY: process.env.BASESCAN_API_KEY,
  NEXT_PUBLIC_RAFFLE_FACTORY_ADDRESS: process.env.NEXT_PUBLIC_RAFFLE_FACTORY_ADDRESS,
} as const;

interface ValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Validates all environment variables
 * @throws Error if required environment variables are missing
 */
export function validateEnv(): ValidationResult {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required environment variables
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.trim() === '') {
      missing.push(key);
    }
  }

  // Check optional environment variables and warn if missing
  for (const [key, value] of Object.entries(optionalEnvVars)) {
    if (!value || value.trim() === '') {
      warnings.push(key);
    }
  }

  // If any required variables are missing, throw an error
  if (missing.length > 0) {
    const errorMessage = `
╔════════════════════════════════════════════════════════════════╗
║  MISSING REQUIRED ENVIRONMENT VARIABLES                        ║
╚════════════════════════════════════════════════════════════════╝

The following required environment variables are not set:

${missing.map(key => `  ❌ ${key}`).join('\n')}

Please follow these steps to fix this issue:

1. Copy .env.example to .env.local:
   cp .env.example .env.local

2. Fill in the required values in .env.local:

   ${missing.map(key => {
     switch (key) {
       case 'NEXT_PUBLIC_ALCHEMY_API_KEY':
         return `${key}=<your-key>\n      Get it from: https://www.alchemy.com/`;
       case 'NEXT_PUBLIC_CDP_API_KEY':
         return `${key}=<your-key>\n      Get it from: https://portal.cdp.coinbase.com/`;
       case 'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID':
         return `${key}=<your-id>\n      Get it from: https://cloud.walletconnect.com/`;
       case 'NEXT_PUBLIC_RAFFLE_CORE_ADDRESS':
         return `${key}=<contract-address>\n      Deploy the contract first using: cd contracts && ./deploy.sh`;
       case 'NEXT_PUBLIC_APP_URL':
         return `${key}=http://localhost:3000\n      Use your production URL in production`;
       case 'NEXT_PUBLIC_CHAIN_ID':
         return `${key}=8453\n      Use 8453 for Base mainnet or 84532 for Base Sepolia testnet`;
       default:
         return `${key}=<your-value>`;
     }
   }).join('\n\n   ')}

3. Restart your development server

For more information, see the README.md file.
`;

    throw new Error(errorMessage);
  }

  // Log warnings for optional variables
  if (warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(`
╔════════════════════════════════════════════════════════════════╗
║  OPTIONAL ENVIRONMENT VARIABLES NOT SET                        ║
╚════════════════════════════════════════════════════════════════╝

The following optional environment variables are not set:

${warnings.map(key => `  ⚠️  ${key}`).join('\n')}

These variables enable additional features:

${warnings.map(key => {
  switch (key) {
    case 'NEYNAR_API_KEY':
    case 'NEXT_PUBLIC_NEYNAR_CLIENT_ID':
      return `  • ${key}: Enables Farcaster integration (SIWN, user profiles)
    Get it from: https://neynar.com/`;
    case 'BASESCAN_API_KEY':
      return `  • ${key}: Enables contract verification on Basescan
    Get it from: https://basescan.org/myapikey`;
    case 'NEXT_PUBLIC_RAFFLE_FACTORY_ADDRESS':
      return `  • ${key}: Enables raffle factory features (if implemented)`;
    default:
      return `  • ${key}: Optional feature`;
  }
}).join('\n\n')}

The application will work without these, but some features may be disabled.
`);
  }

  return {
    isValid: true,
    missing: [],
    warnings,
  };
}

/**
 * Gets a validated environment variable
 * @param key - The environment variable key
 * @returns The environment variable value
 * @throws Error if the variable is not set
 */
export function getEnvVar(key: keyof typeof requiredEnvVars): string {
  const value = requiredEnvVars[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set. Run validateEnv() first.`);
  }
  return value;
}

/**
 * Gets an optional environment variable
 * @param key - The environment variable key
 * @returns The environment variable value or undefined
 */
export function getOptionalEnvVar(key: keyof typeof optionalEnvVars): string | undefined {
  return optionalEnvVars[key] || undefined;
}

/**
 * Checks if Farcaster features are enabled
 */
export function isFarcasterEnabled(): boolean {
  return !!(
    process.env.NEYNAR_API_KEY &&
    process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID
  );
}

/**
 * Checks if we're in production environment
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Checks if we're in development environment
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Gets the chain ID as a number
 */
export function getChainId(): number {
  const chainId = getEnvVar('NEXT_PUBLIC_CHAIN_ID');
  const parsed = parseInt(chainId, 10);
  
  if (isNaN(parsed)) {
    throw new Error(`Invalid NEXT_PUBLIC_CHAIN_ID: ${chainId}. Must be a number.`);
  }
  
  // Validate it's a supported chain
  if (parsed !== 8453 && parsed !== 84532) {
    console.warn(`Warning: Chain ID ${parsed} is not Base mainnet (8453) or Base Sepolia (84532)`);
  }
  
  return parsed;
}
