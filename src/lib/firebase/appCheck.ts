/**
 * Firebase App Check with reCAPTCHA Enterprise
 *
 * App Check helps protect your backend resources from abuse by ensuring
 * requests come from your legitimate app. Uses reCAPTCHA Enterprise for
 * web attestation.
 *
 * Setup requirements:
 * 1. Enable App Check in Firebase Console
 * 2. Register your app with reCAPTCHA Enterprise
 * 3. Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to environment variables
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
 * Initialize App Check with reCAPTCHA Enterprise provider
 * Must be called on the client side before making protected API calls
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

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.warn(
      'App Check: NEXT_PUBLIC_RECAPTCHA_SITE_KEY not configured. ' +
      'API calls will not include App Check tokens.'
    );
    return null;
  }

  try {
    const app = getFirebaseApp();

    // Enable debug token in development
    if (process.env.NODE_ENV === 'development') {
      // @ts-expect-error - FIREBASE_APPCHECK_DEBUG_TOKEN is a global property
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || true;
    }

    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(siteKey),
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
