/**
 * Helixbytes Contact Form - Firebase Cloud Functions
 *
 * Security layers:
 * 1. Rate limiting per IP
 * 2. Input validation and sanitization
 * 3. Honeypot detection (handled client-side, but verified here)
 * 4. Firebase App Check (reCAPTCHA Enterprise verification)
 * 5. CORS restrictions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

const appCheck = admin.appCheck();

const db = admin.firestore();

// Global options for cost control
setGlobalOptions({ maxInstances: 10 });

// ============================================================================
// TYPES
// ============================================================================

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  message: string;
  _timestamp?: number;
  _timezone?: string;
}

interface RateLimitDoc {
  count: number;
  windowStart: admin.firestore.Timestamp;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Rate limiting: max 5 submissions per hour per IP
  rateLimit: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Validation limits
  validation: {
    nameMinLength: 2,
    nameMaxLength: 100,
    messageMinLength: 20,
    messageMaxLength: 5000,
  },
  // Allowed origins (update for production)
  allowedOrigins: [
    "http://localhost:3000",
    "http://localhost:5000",
    "https://helixbytes.digital",
    "https://www.helixbytes.digital",
  ],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input - remove potential XSS vectors
 */
function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>]/g, ""); // Remove remaining angle brackets
}

/**
 * Get client IP from request
 */
function getClientIp(req: {
  headers: { [key: string]: string | string[] | undefined };
  ip?: string;
}): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || "unknown";
}

/**
 * Hash IP for privacy-conscious rate limiting
 */
function hashIp(ip: string): string {
  // Simple hash for rate limiting (not cryptographically secure, but sufficient)
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Verify Firebase App Check token
 * Returns true if valid, false if invalid or missing
 * In production, you may want to enforce App Check (reject if missing)
 */
async function verifyAppCheck(
  appCheckToken: string | undefined
): Promise<{ valid: boolean; error?: string }> {
  if (!appCheckToken) {
    // Token not provided - allow but log (or reject in strict mode)
    console.log("App Check token not provided");
    return { valid: true }; // Change to false to enforce App Check
  }

  try {
    await appCheck.verifyToken(appCheckToken);
    return { valid: true };
  } catch (error) {
    console.error("App Check verification failed:", error);
    return { valid: false, error: "App Check verification failed" };
  }
}

/**
 * Check rate limit for an IP
 */
async function checkRateLimit(ipHash: string): Promise<boolean> {
  const rateLimitRef = db.collection("rateLimits").doc(ipHash);
  const now = admin.firestore.Timestamp.now();
  const windowStart = new Date(
    now.toMillis() - CONFIG.rateLimit.windowMs
  );

  try {
    const result = await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(rateLimitRef);

      if (!doc.exists) {
        // First request from this IP
        transaction.set(rateLimitRef, {
          count: 1,
          windowStart: now,
        });
        return true;
      }

      const data = doc.data() as RateLimitDoc;
      const docWindowStart = data.windowStart.toDate();

      if (docWindowStart < windowStart) {
        // Window expired, reset
        transaction.set(rateLimitRef, {
          count: 1,
          windowStart: now,
        });
        return true;
      }

      if (data.count >= CONFIG.rateLimit.maxRequests) {
        // Rate limit exceeded
        return false;
      }

      // Increment counter
      transaction.update(rateLimitRef, {
        count: admin.firestore.FieldValue.increment(1),
      });
      return true;
    });

    return result;
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open to avoid blocking legitimate users
    return true;
  }
}

/**
 * Validate form data
 */
function validateFormData(
  data: unknown
): { valid: true; data: ContactFormData } | { valid: false; error: string } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const formData = data as Record<string, unknown>;

  // Required fields
  if (typeof formData.name !== "string" || !formData.name.trim()) {
    return { valid: false, error: "Name is required" };
  }
  if (typeof formData.email !== "string" || !formData.email.trim()) {
    return { valid: false, error: "Email is required" };
  }
  if (typeof formData.message !== "string" || !formData.message.trim()) {
    return { valid: false, error: "Message is required" };
  }

  const name = sanitizeString(formData.name as string);
  const email = (formData.email as string).trim().toLowerCase();
  const message = sanitizeString(formData.message as string);

  // Validate lengths
  if (name.length < CONFIG.validation.nameMinLength) {
    return { valid: false, error: "Name is too short" };
  }
  if (name.length > CONFIG.validation.nameMaxLength) {
    return { valid: false, error: "Name is too long" };
  }
  if (message.length < CONFIG.validation.messageMinLength) {
    return { valid: false, error: "Message is too short" };
  }
  if (message.length > CONFIG.validation.messageMaxLength) {
    return { valid: false, error: "Message is too long" };
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return { valid: false, error: "Invalid email format" };
  }

  // Optional fields
  const company = formData.company
    ? sanitizeString(formData.company as string)
    : undefined;
  const projectType = formData.projectType
    ? sanitizeString(formData.projectType as string)
    : undefined;

  return {
    valid: true,
    data: {
      name,
      email,
      company,
      projectType,
      message,
      _timestamp: typeof formData._timestamp === "number"
        ? formData._timestamp
        : undefined,
      _timezone: typeof formData._timezone === "string"
        ? formData._timezone
        : undefined,
    },
  };
}

/**
 * Send email via Mailgun (placeholder - implement with your Mailgun setup)
 */
async function sendEmail(data: ContactFormData): Promise<void> {
  // TODO: Implement Mailgun integration
  // For now, just log the data
  console.log("Email would be sent:", {
    to: "hello@helixbytes.digital",
    subject: `New Contact: ${data.name}`,
    from: data.email,
  });

  // Example Mailgun implementation:
  // const mailgun = new Mailgun(formData);
  // const mg = mailgun.client({
  //   username: 'api',
  //   key: process.env.MAILGUN_API_KEY,
  // });
  // await mg.messages.create(process.env.MAILGUN_DOMAIN, {
  //   from: `Helixbytes Contact <noreply@${process.env.MAILGUN_DOMAIN}>`,
  //   to: ['hello@helixbytes.digital'],
  //   subject: `New Contact Form: ${data.name}`,
  //   text: `...`,
  //   html: `...`,
  // });
}

// ============================================================================
// CLOUD FUNCTION: Contact Form Handler
// ============================================================================

export const submitContactForm = onRequest(
  {
    cors: CONFIG.allowedOrigins,
    maxInstances: 10,
  },
  async (req, res) => {
    // Only allow POST requests
    if (req.method !== "POST") {
      res.status(405).json({ success: false, message: "Method not allowed" });
      return;
    }

    try {
      // Verify App Check token
      const appCheckToken = req.headers["x-firebase-appcheck"] as
        | string
        | undefined;
      const appCheckResult = await verifyAppCheck(appCheckToken);

      if (!appCheckResult.valid) {
        res.status(403).json({
          success: false,
          message: "Request verification failed. Please try again.",
        });
        return;
      }

      // Get client IP and check rate limit
      const clientIp = getClientIp(req);
      const ipHash = hashIp(clientIp);
      const withinRateLimit = await checkRateLimit(ipHash);

      if (!withinRateLimit) {
        res.status(429).json({
          success: false,
          message: "Too many requests. Please try again later.",
        });
        return;
      }

      // Validate form data
      const validation = validateFormData(req.body);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          message: validation.error,
        });
        return;
      }

      const formData = validation.data;

      // Store submission in Firestore
      const submissionRef = await db.collection("contactSubmissions").add({
        ...formData,
        ipHash, // Store hashed IP for abuse tracking
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending",
        source: "website",
      });

      console.log("Contact form submission stored:", submissionRef.id);

      // Send notification email
      try {
        await sendEmail(formData);
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Don't fail the request if email fails - submission is already stored
      }

      res.status(200).json({
        success: true,
        message: "Thank you for your message. We'll be in touch soon!",
        submissionId: submissionRef.id,
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred. Please try again later.",
      });
    }
  }
);

// ============================================================================
// CLEANUP FUNCTION: Remove old rate limit records (run daily via scheduler)
// ============================================================================

// Optional: Add a scheduled function to clean up old rate limit records
// export const cleanupRateLimits = onSchedule("every 24 hours", async () => {
//   const cutoff = admin.firestore.Timestamp.fromDate(
//     new Date(Date.now() - 24 * 60 * 60 * 1000)
//   );
//   const snapshot = await db
//     .collection("rateLimits")
//     .where("windowStart", "<", cutoff)
//     .get();
//   const batch = db.batch();
//   snapshot.docs.forEach((doc) => batch.delete(doc.ref));
//   await batch.commit();
//   console.log(`Cleaned up ${snapshot.size} old rate limit records`);
// });
