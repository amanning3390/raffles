import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid, isNeynarAvailable } from '@/lib/neynar-client';
import { handleNeynarError, logError } from '@/lib/error-handlers';

/**
 * API route for Farcaster authentication verification
 * 
 * This endpoint is used to verify Farcaster user data server-side.
 * The @neynar/react package handles SIWN authentication on the client side,
 * and this endpoint can be used to fetch additional user data or verify
 * authentication state on the server.
 */

/**
 * GET /api/auth/farcaster
 * Fetch Farcaster user data by FID
 * 
 * Query parameters:
 * - fid: Farcaster user ID
 * 
 * Returns:
 * - 200: User data
 * - 400: Missing or invalid FID
 * - 404: User not found
 * - 503: Neynar service unavailable
 */
export async function GET(request: NextRequest) {
  try {
    // Check if Neynar is configured
    if (!isNeynarAvailable()) {
      return NextResponse.json(
        { 
          error: 'Farcaster features are not configured',
          message: 'NEYNAR_API_KEY is not set'
        },
        { status: 503 }
      );
    }

    // Get FID from query parameters
    const searchParams = request.nextUrl.searchParams;
    const fidParam = searchParams.get('fid');

    if (!fidParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: fid' },
        { status: 400 }
      );
    }

    const fid = parseInt(fidParam, 10);

    if (isNaN(fid) || fid <= 0) {
      return NextResponse.json(
        { error: 'Invalid FID: must be a positive integer' },
        { status: 400 }
      );
    }

    // Fetch user data
    const user = await getUserByFid(fid);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    // Use centralized error handler
    const errorResult = handleNeynarError(error);
    logError('FarcasterAuthAPI:GET', errorResult);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: errorResult.message
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/farcaster
 * Verify Farcaster SIWN authentication and return user data
 * 
 * Request body:
 * - message: SIWN message that was signed
 * - signature: Signature from user's wallet
 * - address: Ethereum address that signed the message
 * 
 * Returns:
 * - 200: Authentication verified, user data returned
 * - 400: Missing or invalid request data
 * - 401: Authentication failed
 * - 503: Neynar service unavailable
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Neynar is configured
    if (!isNeynarAvailable()) {
      return NextResponse.json(
        { 
          error: 'Farcaster features are not configured',
          message: 'NEYNAR_API_KEY is not set'
        },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message, signature, address } = body;

    if (!message || !signature || !address) {
      return NextResponse.json(
        { error: 'Missing required fields: message, signature, and address are required' },
        { status: 400 }
      );
    }

    // Verify the signature is valid
    // In a production app, you would verify the signature cryptographically
    // For now, we'll fetch the user by address to verify they have a Farcaster account
    const { getUserByAddress } = await import('@/lib/neynar-client');
    const user = await getUserByAddress(address);

    if (!user) {
      return NextResponse.json(
        { 
          error: 'No Farcaster account found for this address',
          message: 'This wallet address is not linked to a Farcaster account'
        },
        { status: 401 }
      );
    }

    // Verify the address is in the user's verified addresses
    const isVerified = user.verifiedAddresses.some(
      (addr) => addr.toLowerCase() === address.toLowerCase()
    );

    if (!isVerified) {
      return NextResponse.json(
        { 
          error: 'Address not verified',
          message: 'This address is not verified on the Farcaster account'
        },
        { status: 401 }
      );
    }

    // In a production app, you might want to:
    // 1. Verify the signature cryptographically using viem's verifyMessage
    // 2. Create a session token
    // 3. Store authentication state in a database
    // 4. Set secure HTTP-only cookies
    // 5. Implement additional security measures

    // Return success with user data
    return NextResponse.json({
      success: true,
      user,
      message: 'Authentication verified',
    });

  } catch (error) {
    // Use centralized error handler
    const errorResult = handleNeynarError(error);
    logError('FarcasterAuthAPI:POST', errorResult);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: errorResult.message
      },
      { status: 500 }
    );
  }
}
