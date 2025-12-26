/**
 * Email Configuration for SendGrid
 * Centralized email transporter configuration
 * 
 * Emails are sent from yookatale256@gmail.com via sendgrid.net
 * 
 * To set up SendGrid:
 * 1. Get your SendGrid API key from https://app.sendgrid.com/settings/api_keys
 * 2. Add it to your .env.local file as: SENDGRID_API_KEY=SG.your-api-key-here
 * 3. Make sure yookatale256@gmail.com is verified in SendGrid
 */
import nodemailer from "nodemailer";

// Get SendGrid API key from environment variables
// Priority: SENDGRID_API_KEY > NEXT_PUBLIC_SENDGRID_API_KEY
const sendGridApiKey = process.env.SENDGRID_API_KEY || process.env.NEXT_PUBLIC_SENDGRID_API_KEY;

if (!sendGridApiKey) {
  console.warn(
    "⚠️ SENDGRID_API_KEY not found in environment variables. " +
    "Please add SENDGRID_API_KEY to your .env.local file. " +
    "Emails may not send until this is configured."
  );
}

// SendGrid SMTP Configuration
// Emails will be sent from yookatale256@gmail.com via sendgrid.net
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "apikey", // SendGrid requires 'apikey' as username
    pass: sendGridApiKey || "", // SendGrid API Key from environment variable
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Default sender information
export const defaultSender = {
  name: "YooKatale",
  email: "yookatale256@gmail.com", // Verified sender email in SendGrid
};

export default transporter;

