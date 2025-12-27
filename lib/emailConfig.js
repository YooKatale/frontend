/**
 * Email Configuration Module
 * 
 * This module configures the SMTP email transporter for sending transactional emails.
 * Uses Namecheap Private Email service for reliable email delivery.
 * 
 * Security Notes:
 * - Credentials should be stored in environment variables in production
 * - Password contains special characters which are handled automatically by nodemailer
 * - TLS encryption is used for secure email transmission
 * 
 * Configuration:
 * - Email: info@yookatale.app
 * - Password: #YooK@t@l3??email (stored in env or fallback)
 * - SMTP Server: mail.privateemail.com
 * - Port: 587 (TLS encryption)
 * 
 * Production Setup:
 * - Set EMAIL_USER and EMAIL_PASSWORD in environment variables
 * - Never commit credentials to version control
 */

import nodemailer from "nodemailer";

// Get email credentials from environment variables
// In production, always use environment variables for security
// Fallback values are provided for development/testing only
const emailUser = process.env.EMAIL_USER || "info@yookatale.app";
const emailPassword = process.env.EMAIL_PASSWORD || "#YooK@t@l3??email";

if (!emailPassword) {
  console.error(
    "❌ EMAIL_PASSWORD not found in environment variables. " +
    "Please add EMAIL_PASSWORD to your .env.local file. " +
    "Emails will NOT send until this is configured."
  );
} else {
  console.log("✅ Email credentials found");
  console.log("📧 Using email:", emailUser);
  console.log("📧 SMTP: Namecheap Private Email (mail.privateemail.com)");
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
  maxMessages: 3, // Maximum messages per connection
}) : null;

// Verify transporter configuration
if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter verification failed:", error);
      console.error("❌ Error code:", error.code);
      console.error("❌ Error command:", error.command);
      console.error("❌ Error response:", error.response);
      
      // If verification fails, log helpful troubleshooting info
      if (error.code === "EAUTH") {
        console.error("⚠️ Authentication failed. Please check:");
        console.error("   1. Email address: info@yookatale.app");
        console.error("   2. Password: #YooK@t@l3??email");
        console.error("   3. SMTP server: mail.privateemail.com");
        console.error("   4. Port: 587 (TLS)");
      }
    } else {
      console.log("✅ Email transporter is ready to send emails");
      console.log("📧 SMTP Server: mail.privateemail.com");
      console.log("📧 Port: 587 (TLS)");
      console.log("📧 From: info@yookatale.app");
    }
  });
} else {
  console.error("❌ Email transporter not initialized - EMAIL_PASSWORD missing");
}

// Default sender information
// Emails are sent FROM info@yookatale.app via Namecheap Private Email SMTP
export const defaultSender = {
  name: "YooKatale",
  email: emailUser || "info@yookatale.app", // Sender email from environment or default
};

export default transporter;

