/**
 * Development-only API Route Proxy
 *
 * This route proxies contact form submissions to the Firebase Cloud Function
 * during local development (npm run dev).
 *
 * In production, Firebase Hosting rewrites /api/contact directly to the
 * Cloud Function, bypassing this route entirely.
 *
 * NOTE: This file is excluded from the static export build.
 */

import { NextRequest, NextResponse } from 'next/server';

// In development, always use the local emulator
// The Cloud Function runs on port 5001 via Firebase emulators
const FUNCTION_URL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:5001/helixbyte-dev/us-central1/submitContactForm'
  : 'https://us-central1-helixbyte-dev.cloudfunctions.net/submitContactForm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward headers including App Check token
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const appCheckToken = request.headers.get('X-Firebase-AppCheck');
    if (appCheckToken) {
      headers['X-Firebase-AppCheck'] = appCheckToken;
    }

    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API proxy error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight (development only)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Firebase-AppCheck',
    },
  });
}
