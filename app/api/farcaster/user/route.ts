import { NextRequest, NextResponse } from 'next/server';
import { getUserByFid, getUserByAddress, isNeynarAvailable } from '@/lib/neynar-client';
import { handleNeynarError, logError } from '@/lib/error-handlers';
import type { Address } from 'viem';

/**
 * API route for fetching Farcaster user data
 * Supports lookup by address or FID
 * 
 * GET /api/farcaster/user?address=0x123... or ?fid=123
 */
export async function GET(request: NextRequest) {
  try {
    // Check if Neynar is configured
    if (!isNeynarAvailable()) {
      return NextResponse.json(
        { error: 'Farcaster features are not configured' },
        { status: 503 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address') as Address | null;
    const fidParam = searchParams.get('fid');
    const fid = fidParam ? parseInt(fidParam, 10) : null;

    // Validate that at least one parameter is provided
    if (!address && !fid) {
      return NextResponse.json(
        { error: 'Either address or fid parameter is required' },
        { status: 400 }
      );
    }

    // Fetch user data
    let user = null;
    
    if (fid) {
      user = await getUserByFid(fid);
    } else if (address) {
      user = await getUserByAddress(address);
    }

    // If user not found, return 404
    if (!user) {
      return NextResponse.json(
        { error: 'Farcaster user not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    // Use centralized error handler
    const errorResult = handleNeynarError(error);
    logError('FarcasterUserAPI', errorResult);
    
    return NextResponse.json(
      { error: errorResult.message },
      { status: 500 }
    );
  }
}
