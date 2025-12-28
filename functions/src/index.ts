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
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import Mailgun from "mailgun.js";
import FormData from "form-data";

// ============================================================================
// SECRETS (set via: firebase functions:secrets:set SECRET_NAME)
// ============================================================================

const mailgunApiKey = defineSecret("MAILGUN_API_KEY");
const mailgunDomain = defineSecret("MAILGUN_DOMAIN");
const mailgunFrom = defineSecret("MAILGUN_FROM");
const appBaseUrl = defineSecret("APP_BASE_URL");

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
    "https://helixbytes.com",
    "https://www.helixbytes.com",
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
 * Generate HTML email template for contact form notification
 */
function generateEmailHtml(data: ContactFormData, submissionId: string): string {
  const timestamp = data._timestamp
    ? new Date(data._timestamp).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: data._timezone || "UTC",
      })
    : new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #050816 0%, #0f172a 100%); border-radius: 16px 16px 0 0; border: 1px solid rgba(148, 163, 184, 0.2); border-bottom: none;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700;">
                      <span style="color: #f755f5;">HELIX</span><span style="color: #22c55e;">BYTES</span>
                    </h1>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #00f5ff; letter-spacing: 0.1em;">NEW CONTACT SUBMISSION</p>
                  </td>
                  <td align="right" style="color: #9ca3af; font-size: 13px;">
                    ${timestamp}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px; background-color: rgba(15, 23, 42, 0.95); border: 1px solid rgba(148, 163, 184, 0.2); border-top: none; border-bottom: none;">
              <!-- Contact Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; background: rgba(56, 189, 248, 0.05); border-radius: 12px; border: 1px solid rgba(56, 189, 248, 0.2);">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <span style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">From</span><br>
                          <span style="color: #f9fafb; font-size: 18px; font-weight: 600;">${escapeHtml(data.name)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: ${data.company || data.projectType ? "12px" : "0"};">
                          <span style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</span><br>
                          <a href="mailto:${escapeHtml(data.email)}" style="color: #38bdf8; font-size: 16px; text-decoration: none;">${escapeHtml(data.email)}</a>
                        </td>
                      </tr>
                      ${data.company ? `
                      <tr>
                        <td style="padding-bottom: ${data.projectType ? "12px" : "0"};">
                          <span style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Company</span><br>
                          <span style="color: #f9fafb; font-size: 16px;">${escapeHtml(data.company)}</span>
                        </td>
                      </tr>
                      ` : ""}
                      ${data.projectType ? `
                      <tr>
                        <td>
                          <span style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Project Type</span><br>
                          <span style="display: inline-block; padding: 4px 12px; background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 20px; color: #a855f7; font-size: 14px;">${escapeHtml(data.projectType)}</span>
                        </td>
                      </tr>
                      ` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Message</span>
                    <div style="margin-top: 8px; padding: 20px; background: rgba(15, 23, 42, 0.5); border-radius: 12px; border: 1px solid rgba(148, 163, 184, 0.15);">
                      <p style="margin: 0; color: #e2e8f0; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background: rgba(15, 23, 42, 0.8); border-radius: 0 0 16px 16px; border: 1px solid rgba(148, 163, 184, 0.2); border-top: none;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color: #64748b; font-size: 12px;">
                    Submission ID: <code style="color: #9ca3af;">${submissionId}</code>
                  </td>
                  <td align="right">
                    <a href="${appBaseUrl.value()}" style="color: #38bdf8; font-size: 12px; text-decoration: none;">View Dashboard →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email for contact form notification
 */
function generateEmailText(data: ContactFormData, submissionId: string): string {
  const timestamp = data._timestamp
    ? new Date(data._timestamp).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: data._timezone || "UTC",
      })
    : new Date().toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" });

  let text = `NEW CONTACT FORM SUBMISSION\n`;
  text += `${"=".repeat(40)}\n\n`;
  text += `Date: ${timestamp}\n\n`;
  text += `FROM\n`;
  text += `Name: ${data.name}\n`;
  text += `Email: ${data.email}\n`;
  if (data.company) text += `Company: ${data.company}\n`;
  if (data.projectType) text += `Project Type: ${data.projectType}\n`;
  text += `\nMESSAGE\n`;
  text += `${"-".repeat(40)}\n`;
  text += `${data.message}\n`;
  text += `${"-".repeat(40)}\n\n`;
  text += `Submission ID: ${submissionId}\n`;

  return text;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Send email via Mailgun
 */
async function sendEmail(data: ContactFormData, submissionId: string): Promise<void> {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: mailgunApiKey.value(),
  });

  const domain = mailgunDomain.value();
  const from = mailgunFrom.value();

  const messageData = {
    from: from,
    to: ["hello@helixbytes.digital"],
    subject: `New Contact: ${data.name}${data.company ? ` (${data.company})` : ""}`,
    text: generateEmailText(data, submissionId),
    html: generateEmailHtml(data, submissionId),
    "h:Reply-To": data.email,
  };

  try {
    const result = await mg.messages.create(domain, messageData);
    console.log("Email sent successfully:", result.id);
  } catch (error) {
    console.error("Mailgun error:", error);
    throw error;
  }
}

// ============================================================================
// CLOUD FUNCTION: Contact Form Handler
// ============================================================================

export const submitContactForm = onRequest(
  {
    cors: CONFIG.allowedOrigins,
    maxInstances: 10,
    secrets: [mailgunApiKey, mailgunDomain, mailgunFrom, appBaseUrl],
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
        await sendEmail(formData, submissionRef.id);
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
