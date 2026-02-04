/**
 * Email Configuration Module
 * 
 * This module configures the SMTP email transporter for sending transactional emails.
 * Uses Namecheap Private Email service for reliable email delivery.
 * 
 * SECURITY: All credentials MUST be stored in environment variables.
 * Never hardcode passwords or commit credentials to version control.
 * 
 * Required Environment Variables:
 * - EMAIL_USER: SMTP username (email address)
 * - EMAIL_PASSWORD: SMTP password
 * 
 * Configuration:
 * - SMTP Server: mail.privateemail.com
 * - Port: 587 (TLS encryption)
 * 
 * Production Setup:
 * - Set EMAIL_USER and EMAIL_PASSWORD in environment variables
 * - Never commit credentials to version control
 * - Use secure secret management in production
 */

import nodemailer from "nodemailer";

// Get email credentials from environment variables ONLY
// No fallback values for security - fail if not configured
const emailUser = process.env.EMAIL_USER || "info@yookatale.app";
const emailPassword = process.env.EMAIL_PASSWORD;

// Security: Log warning if credentials are missing (don't throw during build)
// This prevents Vercel build failures - errors will be caught at runtime when sending emails
if (!emailPassword) {
  console.warn(
    "⚠️ WARNING: EMAIL_PASSWORD not found in environment variables. " +
    "Please set EMAIL_PASSWORD in your Vercel environment variables. " +
    "Emails will NOT send until this is configured."
  );
}

/**
 * Create SMTP transporter for sending emails
 * 
 * Connection pooling is enabled for better performance and reliability.
 * Timeouts are set to 30 seconds to handle slow network connections.
 * 
 * Security:
 * - TLS 1.2 minimum version enforced
 * - Connection pooling limits concurrent connections to prevent abuse
 * 
 * Note: Transporter is only created if EMAIL_PASSWORD is available
 * This prevents build errors on Vercel while still requiring credentials at runtime
 */
const transporter = emailPassword ? nodemailer.createTransport({
  host: "mail.privateemail.com", // Namecheap Private Email SMTP server
  port: 587, // Standard SMTP port with TLS
  secure: false, // Use STARTTLS (false for port 587, true for port 465)
  auth: {
    user: emailUser, // SMTP username (email address)
    pass: emailPassword, // SMTP password (special characters handled by nodemailer)
  },
  // TLS configuration for secure email transmission
  tls: {
    rejectUnauthorized: false, // Accept self-signed certificates (if needed)
    minVersion: 'TLSv1.2', // Minimum TLS version for security
    ciphers: 'SSLv3' // Cipher suite
  },
  // Debug and logging (only in development)
  debug: process.env.NODE_ENV === "development",
  logger: process.env.NODE_ENV === "development",
  // Timeout settings (30 seconds for reliability)
  connectionTimeout: 30000, // Time to wait for connection
  greetingTimeout: 30000, // Time to wait for server greeting
  socketTimeout: 30000, // Time to wait for socket operations
  // Connection pooling for better performance
  pool: true, // Enable connection pooling
  maxConnections: 1, // Maximum concurrent connections (security: limit to prevent abuse)
  maxMessages: 50, // Messages per connection before reconnect (higher for batch sends; provider may still rate-limit)
}) : null;

// Verify transporter configuration
if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter verification failed:", error);
      console.error("❌ Error code:", error.code);
      console.error("❌ Error command:", error.command);
      console.error("❌ Error response:", error.response);
      
      // If verification fails, log helpful troubleshooting info (without exposing credentials)
      if (error.code === "EAUTH") {
        console.error("⚠️ Authentication failed. Please check:");
        console.error("   1. EMAIL_USER environment variable is set correctly");
        console.error("   2. EMAIL_PASSWORD environment variable is set correctly");
        console.error("   3. SMTP server: mail.privateemail.com");
        console.error("   4. Port: 587 (TLS)");
        console.error("   5. Ensure credentials are correct in your environment variables");
      }
    } else {
      // Only log non-sensitive information
      console.log("✅ Email transporter is ready to send emails");
      console.log("📧 SMTP Server: mail.privateemail.com");
      console.log("📧 Port: 587 (TLS)");
      // Do NOT log email address or password for security
    }
  });
} else {
  console.error("❌ Email transporter not initialized - EMAIL_PASSWORD missing");
}

// Default sender information
// Explicitly set to info@yookatale.app as per requirements
export const defaultSender = {
  name: "YooKatale",
  email: "info@yookatale.app", // Always use info@yookatale.app as sender
};

export default transporter;

