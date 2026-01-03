/**
 * Firebase App Check with reCAPTCHA Enterprise
 *
 * App Check helps protect your backend resources from abuse by ensuring
 * requests come from your legitimate app. Uses reCAPTCHA Enterprise for
 * web attestation.
 *
 * Setup requirements:
 * 1. Enable App Check in Firebase Console
 * 2. Register your app with reCAPTCHA Enterprise in Google Cloud Console
 * 3. Add the site key to NEXT_PUBLIC_FIREBASE_RECAPTCHA_ENTERPRISE_KEY_ID
 * 4. For local dev, register a debug token in Firebase Console and add to
 *    NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN
 *
 * Local Development:
 * - Debug tokens are used on localhost (reCAPTCHA Enterprise doesn't work on localhost)
 * - Set NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN with a debug token from Firebase Console
 * - The debug token must be registered in Firebase Console > App Check > Apps > Manage Debug Tokens
 */

import {
  initializeAppCheck,
  getToken,
  type AppCheck,
  type AppCheckTokenResult,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';
import { getFirebaseApp } from './config';

let appCheckInstance: AppCheck | null = null;

/**
 * Check if running on localhost
 */
function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * Initialize App Check with reCAPTCHA Enterprise provider
 * Must be called on the client side before making protected API calls
 *
 * On localhost: Uses debug tokens (reCAPTCHA Enterprise doesn't work on localhost)
 * In production: Uses reCAPTCHA Enterprise provider
 */
export function initializeAppCheckClient(): AppCheck | null {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing instance if already initialized
  if (appCheckInstance) {
    return appCheckInstance;
  }

  const siteKey = process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_ENTERPRISE_KEY_ID;
  const debugToken = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;

  // On localhost, we MUST use debug tokens (reCAPTCHA Enterprise doesn't work on localhost)
  if (isLocalhost()) {
    if (!debugToken) {
      console.warn(
        'App Check: Running on localhost without NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN.\n' +
        'To enable App Check locally:\n' +
        '1. Go to Firebase Console > App Check > Apps > Manage Debug Tokens\n' +
        '2. Create a debug token and add it to .env.local as NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN\n' +
        'API calls will not include App Check tokens until configured.'
      );
      return null;
    }

    // Set debug token BEFORE initializing App Check
    // @ts-expect-error - FIREBASE_APPCHECK_DEBUG_TOKEN is a global property used by Firebase
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
    console.log('App Check: Debug mode enabled for localhost');
  } else {
    // Production: require reCAPTCHA Enterprise site key
    if (!siteKey) {
      console.warn(
        'App Check: NEXT_PUBLIC_FIREBASE_RECAPTCHA_ENTERPRISE_KEY_ID not configured.\n' +
        'API calls will not include App Check tokens.'
      );
      return null;
    }
  }

  try {
    const app = getFirebaseApp();

    // Initialize with reCAPTCHA Enterprise provider
    // On localhost with debug token set, Firebase will automatically use debug attestation
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey || 'placeholder-for-debug-mode'),
      isTokenAutoRefreshEnabled: true,
    });

    return appCheckInstance;
  } catch (error) {
    console.error('Failed to initialize App Check:', error);
    return null;
  }
}

/**
 * Get an App Check token for API requests
 * Returns null if App Check is not initialized or token retrieval fails
 */
export async function getAppCheckToken(): Promise<string | null> {
  try {
    // Initialize if not already done
    const appCheck = initializeAppCheckClient();
    if (!appCheck) {
      return null;
    }

    const result: AppCheckTokenResult = await getToken(appCheck, false);
    return result.token;
  } catch (error) {
    console.error('Failed to get App Check token:', error);
    return null;
  }
}

/**
 * Get App Check token with forced refresh
 * Use this if you suspect the current token may be invalid
 */
export async function getAppCheckTokenForced(): Promise<string | null> {
  try {
    const appCheck = initializeAppCheckClient();
    if (!appCheck) {
      return null;
    }

    const result: AppCheckTokenResult = await getToken(appCheck, true);
    return result.token;
  } catch (error) {
    console.error('Failed to force refresh App Check token:', error);
    return null;
  }
}
