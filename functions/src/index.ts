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
import { onSchedule } from "firebase-functions/scheduler";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import * as crypto from "crypto";
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
  // Allowed origins for CORS
  // In production, localhost origins are ignored by Firebase Hosting rewrites
  // but we filter them out explicitly for direct function invocation
  allowedOrigins: process.env.NODE_ENV === "production"
    ? [
        "https://helixbytes.com",
        "https://www.helixbytes.com",
      ]
    : [
        "http://localhost:3000",
        "http://localhost:5000",
        "https://helixbytes.com",
        "https://www.helixbytes.com",
      ],
};

// ============================================================================// SECURITY HEADERS
// ============================================================================

/**
 * Set security headers on HTTP responses
 */
function setSecurityHeaders(res: { set: (headers: Record<string, string>) => void }): void {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
}

// ============================================================================// UTILITY FUNCTIONS
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
 * Generate a cryptographically secure verification token
 */
function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex"); // 64 character hex string
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
): { valid: true; data: ContactFormData } | { valid: false; error: string; isBot?: boolean } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Invalid request body" };
  }

  const formData = data as Record<string, unknown>;

  // HONEYPOT CHECK: Reject if 'website' field is filled (bot detection)
  // This field is hidden from real users but visible to bots
  if (formData.website !== undefined && formData.website !== "") {
    console.log("Honeypot triggered - rejecting bot submission");
    return { valid: false, error: "Invalid submission", isBot: true };
  }

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
 * Generate HTML email template for email verification
 */
function generateVerificationEmailHtml(
  name: string,
  verificationUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - Helixbytes</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #050816 0%, #0f172a 100%); border-radius: 16px 16px 0 0; border: 1px solid rgba(148, 163, 184, 0.2); border-bottom: none; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700;">
                <span style="color: #f755f5;">HELIX</span><span style="color: #22c55e;">BYTES</span>
              </h1>
              <p style="margin: 8px 0 0; font-size: 12px; color: #00f5ff; letter-spacing: 0.15em;">EMAIL VERIFICATION</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px; background-color: rgba(15, 23, 42, 0.95); border: 1px solid rgba(148, 163, 184, 0.2); border-top: none; border-bottom: none;">
              <!-- Greeting -->
              <p style="margin: 0 0 20px; font-size: 18px; color: #f9fafb;">
                Hi ${escapeHtml(name)},
              </p>
              <p style="margin: 0 0 30px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Thank you for contacting Helixbytes. Please verify your email address to complete your submission.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #38bdf8, #22c55e); color: #0b1120; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Notice -->
              <div style="padding: 16px; background: rgba(251, 191, 36, 0.08); border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #fbbf24;">
                  <strong>This link expires in 24 hours.</strong>
                </p>
              </div>

              <!-- Plain link fallback -->
              <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0; padding: 12px; background: rgba(15, 23, 42, 0.5); border-radius: 6px; border: 1px solid rgba(148, 163, 184, 0.15); word-break: break-all;">
                <code style="font-size: 12px; color: #9ca3af;">${verificationUrl}</code>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 30px; background: rgba(15, 23, 42, 0.8); border-radius: 0 0 16px 16px; border: 1px solid rgba(148, 163, 184, 0.2); border-top: none; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #64748b;">
                If you didn't submit a contact form on our website, you can safely ignore this email.
              </p>
              <p style="margin: 0; font-size: 12px; color: #475569;">
                Questions? Contact us at <a href="mailto:hello@helixbytes.digital" style="color: #38bdf8; text-decoration: none;">hello@helixbytes.digital</a>
              </p>
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
 * Generate plain text email for email verification
 */
function generateVerificationEmailText(
  name: string,
  verificationUrl: string
): string {
  let text = `HELIXBYTES - EMAIL VERIFICATION\n`;
  text += `${"=".repeat(40)}\n\n`;
  text += `Hi ${name},\n\n`;
  text += `Thank you for contacting Helixbytes. Please verify your email address to complete your submission.\n\n`;
  text += `Click the link below to verify:\n`;
  text += `${verificationUrl}\n\n`;
  text += `This link expires in 24 hours.\n\n`;
  text += `${"-".repeat(40)}\n`;
  text += `If you didn't submit a contact form on our website, you can safely ignore this email.\n\n`;
  text += `Questions? Contact us at hello@helixbytes.digital\n`;

  return text;
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

/**
 * Send verification email to user via Mailgun
 */
async function sendVerificationEmail(
  data: ContactFormData,
  submissionId: string,
  verificationToken: string
): Promise<void> {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: mailgunApiKey.value(),
  });

  const domain = mailgunDomain.value();
  const from = mailgunFrom.value();
  const baseUrl = appBaseUrl.value();

  const verificationUrl = `${baseUrl}/api/verify-email?token=${verificationToken}`;

  const messageData = {
    from: from,
    to: [data.email],
    subject: "Verify your email - Helixbytes",
    text: generateVerificationEmailText(data.name, verificationUrl),
    html: generateVerificationEmailHtml(data.name, verificationUrl),
  };

  try {
    const result = await mg.messages.create(domain, messageData);
    console.log("Verification email sent successfully:", result.id, "to:", data.email);
  } catch (error) {
    console.error("Mailgun verification email error:", error);
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
    // Set security headers
    setSecurityHeaders(res);

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

      // Generate verification token and calculate expiry (24 hours)
      const verificationToken = generateVerificationToken();
      const now = admin.firestore.Timestamp.now();
      const expiresAt = admin.firestore.Timestamp.fromDate(
        new Date(now.toMillis() + 24 * 60 * 60 * 1000) // 24 hours
      );

      // Store submission in Firestore with verification fields
      const submissionRef = await db.collection("contactSubmissions").add({
        ...formData,
        ipHash, // Store hashed IP for abuse tracking
        createdAt: now,
        status: "pending",
        source: "website",
        emailVerified: false,
        verificationToken,
        verificationTokenExpiresAt: expiresAt,
      });

      console.log("Contact form submission stored:", submissionRef.id);

      // Send team notification email (immediately, as per requirements)
      try {
        await sendEmail(formData, submissionRef.id);
      } catch (emailError) {
        console.error("Failed to send team notification email:", emailError);
        // Don't fail the request if email fails - submission is already stored
      }

      // Send verification email to user
      try {
        await sendVerificationEmail(formData, submissionRef.id, verificationToken);
      } catch (verificationEmailError) {
        console.error("Failed to send verification email:", verificationEmailError);
        // Don't fail the request if verification email fails - submission is already stored
      }

      res.status(200).json({
        success: true,
        message: "Thank you for your message. Please check your email to verify your submission.",
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
// CLOUD FUNCTION: Email Verification Handler
// ============================================================================

export const verifyEmail = onRequest(
  {
    maxInstances: 10,
    secrets: [appBaseUrl],
  },
  async (req, res) => {
    // Set security headers
    setSecurityHeaders(res);

    try {
      // Extract token from query parameter
      const token = req.query.token as string;
      const baseUrl = appBaseUrl.value();

      // Validate token format (64 hex characters)
      if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
        console.log("Invalid token format received");
        res.redirect(`${baseUrl}/contact/verified?status=invalid`);
        return;
      }

      // Query Firestore for matching token
      const snapshot = await db
        .collection("contactSubmissions")
        .where("verificationToken", "==", token)
        .limit(1)
        .get();

      // Handle not found (same response as invalid for security)
      if (snapshot.empty) {
        console.log("Token not found in database");
        res.redirect(`${baseUrl}/contact/verified?status=invalid`);
        return;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      // Handle already verified
      if (data.emailVerified === true) {
        console.log("Submission already verified:", doc.id);
        res.redirect(`${baseUrl}/contact/verified?status=already-verified`);
        return;
      }

      // Handle expired token
      const now = admin.firestore.Timestamp.now();
      if (data.verificationTokenExpiresAt.toMillis() < now.toMillis()) {
        console.log("Token expired for submission:", doc.id);
        res.redirect(`${baseUrl}/contact/verified?status=expired`);
        return;
      }

      // Update document: mark as verified and remove token
      await doc.ref.update({
        emailVerified: true,
        status: "verified",
        verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
        verificationToken: admin.firestore.FieldValue.delete(),
        verificationTokenExpiresAt: admin.firestore.FieldValue.delete(),
      });

      console.log("Email verified successfully for submission:", doc.id);
      res.redirect(`${baseUrl}/contact/verified?status=success`);
    } catch (error) {
      console.error("Email verification error:", error);
      const baseUrl = appBaseUrl.value();
      res.redirect(`${baseUrl}/contact/verified?status=invalid`);
    }
  }
);

// ============================================================================
// SCHEDULED FUNCTION: Cleanup unverified submissions (runs daily at 3 AM UTC)
// ============================================================================

export const cleanupUnverifiedSubmissions = onSchedule(
  {
    schedule: "0 3 * * *", // Daily at 3:00 AM UTC
    timeZone: "UTC",
    maxInstances: 1,
  },
  async () => {
    try {
      // Calculate cutoff date (7 days ago)
      const cutoffDate = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );

      // Find unverified submissions older than 7 days
      const snapshot = await db
        .collection("contactSubmissions")
        .where("emailVerified", "==", false)
        .where("createdAt", "<", cutoffDate)
        .get();

      if (snapshot.empty) {
        console.log("No unverified submissions to clean up");
        return;
      }

      // Delete in batches (Firestore limit: 500 per batch)
      const batchSize = 500;
      const docs = snapshot.docs;

      for (let i = 0; i < docs.length; i += batchSize) {
        const batch = db.batch();
        const chunk = docs.slice(i, i + batchSize);
        chunk.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }

      console.log(`Cleaned up ${snapshot.size} unverified submissions older than 7 days`);
    } catch (error) {
      console.error("Cleanup error:", error);
      throw error;
    }
  }
);

// ============================================================================
// SCHEDULED FUNCTION: Cleanup old rate limit records (runs daily at 4 AM UTC)
// ============================================================================

export const cleanupRateLimits = onSchedule(
  {
    schedule: "0 4 * * *", // Daily at 4:00 AM UTC
    timeZone: "UTC",
    maxInstances: 1,
  },
  async () => {
    try {
      const cutoff = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 24 * 60 * 60 * 1000)
      );
      const snapshot = await db
        .collection("rateLimits")
        .where("windowStart", "<", cutoff)
        .get();

      if (snapshot.empty) {
        console.log("No old rate limit records to clean up");
        return;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      console.log(`Cleaned up ${snapshot.size} old rate limit records`);
    } catch (error) {
      console.error("Rate limit cleanup error:", error);
      throw error;
    }
  }
);
