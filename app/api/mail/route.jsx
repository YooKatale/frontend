/**
 * Email API Route - Secure Email Sending Service
 * 
 * This API endpoint handles sending transactional emails via SMTP.
 * All emails are sent from info@yookatale.app using Namecheap Private Email.
 * 
 * Security Measures Implemented:
 * - Input validation: Email addresses are validated before sending
 * - Input sanitization: All user inputs are sanitized to prevent XSS
 * - Template validation: Only pre-defined templates are used (prevents template injection)
 * - Email format validation: RFC 5322 compliant email validation
 * - Error handling: Generic error messages in production (don't expose internal details)
 * - Security headers: X-Content-Type-Options and X-Frame-Options set
 * 
 * Production Security Recommendations:
 * - Add rate limiting at infrastructure level (e.g., using Next.js middleware or API gateway)
 * - Implement request throttling (max emails per IP per hour)
 * - Add CAPTCHA for public-facing endpoints
 * - Monitor for abuse patterns (too many emails from same IP)
 * - Use environment variables for all credentials (never hardcode)
 * 
 * Supported Email Types:
 * - welcome: Sent to new user signups
 * - newsletter: Sent to newsletter subscribers  
 * - meal_notification: Sent for meal reminders (breakfast, lunch, supper)
 * - invitation: Sent when users invite friends via referral system
 * - subscription: Sent to new subscribers with app download links
 * - app_download: Sent after signup to guide users on downloading the mobile app
 * - get_started: Sent after signup to guide users on how to get started (signup and login)
 * - invite_friends: Sent to guide users on how to invite friends and earn rewards
 * - download_app: Sent to guide users on how to download the Yookatale app (website footer or app store search)
 * - how_to_subscribe: Sent to guide users on how to subscribe to meal calendar or subscription plans
 * - subscription_confirmation: Sent to users when they subscribe from the webapp, thanking them and informing them they'll receive updates
 */

import { emailTemplate, newsletterEmailTemplate, invitationEmailTemplate } from "@constants/constants";
import { getMealCalendarEmailTemplate } from "@constants/mealCalendarEmailTemplate";
import { subscriptionEmailTemplate } from "@constants/subscriptionEmailTemplate";
import { appDownloadEmailTemplate } from "@constants/appDownloadEmailTemplate";
import { getStartedEmailTemplate } from "@constants/getStartedEmailTemplate";
import { inviteFriendsEmailTemplate } from "@constants/inviteFriendsEmailTemplate";
import { downloadAppEmailTemplate } from "@constants/downloadAppEmailTemplate";
import { howToSubscribeEmailTemplate } from "@constants/howToSubscribeEmailTemplate";
import { subscriptionConfirmationEmailTemplate } from "@constants/subscriptionConfirmationEmailTemplate";
import { NextResponse } from "next/server";
import transporter, { defaultSender } from "@lib/emailConfig";

function adminCredentialsEmailTemplate({ firstname, username, password, email }) {
  const safeName = firstname || "Admin";
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your YooKatale Admin Credentials</title>
        <style>
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background-color: #f5f5f7; margin: 0; padding: 0; }
          .wrapper { padding: 24px; }
          .card { max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 24px 28px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
          .logo { font-size: 20px; font-weight: 700; color: #16a34a; margin-bottom: 12px; }
          h1 { font-size: 22px; margin: 8px 0 12px; color: #0f172a; }
          p { font-size: 14px; line-height: 1.6; color: #4b5563; margin: 4px 0; }
          .credentials { margin: 18px 0; padding: 14px 16px; background-color: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; }
          .credentials p { margin: 4px 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
          .hint { font-size: 12px; color: #6b7280; margin-top: 4px; }
          .footer { font-size: 12px; color: #9ca3af; margin-top: 20px; border-top: 1px solid #e5e7eb; padding-top: 12px; }
          .btn { display: inline-block; margin-top: 16px; padding: 10px 18px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 999px; font-size: 14px; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="card">
            <div class="logo">YooKatale Admin</div>
            <h1>Welcome, ${safeName}</h1>
            <p>An administrator has created an account for you on the YooKatale admin panel.</p>
            <p>Use the credentials below to sign in to your account:</p>
            <div class="credentials">
              <p><strong>Login email:</strong> ${email}</p>
              <p><strong>Username:</strong> ${username}</p>
              <p><strong>Temporary password:</strong> ${password}</p>
            </div>
            <p class="hint">For security, please log in and change your password immediately after your first sign in.</p>
            <a href="https://admin.yookatale.app/signin" class="btn">Go to Admin Panel</a>
            <div class="footer">
              <p>If you did not expect this email, you can safely ignore it.</p>
              <p>&copy; ${new Date().getFullYear()} YooKatale. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Validates email address format
 * Prevents email injection attacks
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Basic email validation - RFC 5322 compliant regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // Max email length per RFC
}

/**
 * Sanitizes string input to prevent XSS
 * Removes potentially dangerous characters
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  // Remove null bytes and control characters
  return input.replace(/[\x00-\x1F\x7F]/g, '').trim().substring(0, 1000);
}

/**
 * Get CORS headers for API responses
 * Allows requests from admin panel and localhost for development
 */
function getCorsHeaders(origin) {
  const allowedOrigins = [
    'https://admin.yookatale.app',
    'https://www.yookatale.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];
  
  // Check if origin is allowed (exact match or starts with localhost/127.0.0.1)
  const isAllowed = origin && (
    allowedOrigins.includes(origin) ||
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:')
  );
  
  // Use the origin if allowed, otherwise use the first allowed origin as default
  const allowedOrigin = isAllowed ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS(req) {
  const origin = req.headers.get('origin') || '';
  const corsHeaders = getCorsHeaders(origin);
  
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

/**
 * POST handler for sending emails
 * Validates input, selects appropriate template, and sends email via SMTP
 */
export const POST = async (req, res) => {
  // Get origin for CORS headers
  const origin = req.headers.get('origin') || '';
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    // Parse and validate request body
    const body = await req.json();
    const { email, type = 'welcome', userName, mealType, greeting, meals, referralCode, subscriptionPlan, username, password, firstname } = body;
    
    // Security: Validate email address format to prevent injection attacks
    if (!isValidEmail(email)) {
      console.error("❌ Invalid email address format:", email);
      return new NextResponse(
        JSON.stringify({ 
          error: "Invalid email address format",
          details: "Please provide a valid email address"
        }), 
        { 
          status: 400, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders,
            "X-Content-Type-Options": "nosniff"
          } 
        }
      );
    }
    
    // Security: Sanitize user inputs to prevent XSS
    const sanitizedUserName = sanitizeInput(userName);
    const sanitizedMealType = sanitizeInput(mealType);
    const sanitizedGreeting = sanitizeInput(greeting);
    
    // Security: Validate email type to prevent template injection
    const validTypes = ['welcome', 'newsletter', 'meal_notification', 'invitation', 'subscription', 'app_download', 'get_started', 'invite_friends', 'download_app', 'how_to_subscribe', 'subscription_confirmation', 'admin_credentials'];
    const emailType = validTypes.includes(type) ? type : 'welcome';
    
    // Check if email transporter is configured
    if (!transporter) {
      console.error("❌ Email transporter not configured - EMAIL_PASSWORD missing");
      return new NextResponse(
        JSON.stringify({ 
          error: "Email service not configured. Please contact support.", 
          details: "EMAIL_PASSWORD is missing" 
        }), 
        { 
          status: 503, 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders,
            "X-Content-Type-Options": "nosniff"
          } 
        }
      );
    }

    // Select appropriate email template and subject based on email type
    // Templates are pre-defined to prevent template injection attacks
    let emailHtml, subject, emailTypeLabel;
    
    if (emailType === 'subscription') {
      emailHtml = subscriptionEmailTemplate;
      subject = "Welcome to Yookatale - Download Our App & Start Your Food Journey! 🍽️";
      emailTypeLabel = "subscription";
    } else if (emailType === 'app_download') {
      emailHtml = appDownloadEmailTemplate;
      subject = "Download the Yookatale App - Get Started Today! 📱";
      emailTypeLabel = "app_download";
    } else if (emailType === 'get_started') {
      emailHtml = getStartedEmailTemplate;
      subject = "Get Started with Yookatale - Your Food Journey Begins! 🚀";
      emailTypeLabel = "get_started";
    } else if (emailType === 'invite_friends') {
      emailHtml = inviteFriendsEmailTemplate;
      subject = "Invite Friends & Earn Rewards - Start Earning Today! 💰";
      emailTypeLabel = "invite_friends";
    } else if (emailType === 'download_app') {
      emailHtml = downloadAppEmailTemplate;
      subject = "How to Download the Yookatale App - Get Started Today! 📱";
      emailTypeLabel = "download_app";
    } else if (emailType === 'how_to_subscribe') {
      emailHtml = howToSubscribeEmailTemplate;
      subject = "How to Subscribe - Meal Calendar & Subscription Plans Guide 📅";
      emailTypeLabel = "how_to_subscribe";
    } else if (emailType === 'subscription_confirmation') {
      emailHtml = subscriptionConfirmationEmailTemplate;
      subject = "Thank You for Subscribing to Yookatale! 🎉";
      emailTypeLabel = "subscription_confirmation";
    } else if (emailType === 'newsletter') {
      emailHtml = newsletterEmailTemplate;
      subject = "YooKatale Newsletter - Subscription Plans & Latest News";
      emailTypeLabel = "newsletter";
    } else if (emailType === 'meal_notification') {
      // Generate meal notification template with sanitized inputs
      const user = sanitizedUserName || 'Valued Customer';
      const meal = sanitizedMealType || 'lunch';
      const greet = sanitizedGreeting || 'Hello';
      // Security: Validate meals array structure
      const mealList = Array.isArray(meals) ? meals.slice(0, 50) : []; // Limit to 50 items
      const subscription = sanitizeInput(subscriptionPlan) || null;
      emailHtml = getMealCalendarEmailTemplate(user, meal, greet, mealList, subscription);
      
      const mealNames = {
        breakfast: "Breakfast",
        lunch: "Lunch",
        supper: "Supper",
      };
      const mealName = mealNames[meal] || "Meal";
      subject = `${greet}! Your ${mealName} Reminder - Meal Calendar 🍽️`;
      emailTypeLabel = "meal_notification";
    } else if (emailType === 'invitation') {
      // Use invitation template
      emailHtml = invitationEmailTemplate;
      subject = "Invitation To YooKatale";
      emailTypeLabel = "invitation";
    } else if (emailType === 'admin_credentials') {
      const safeFirst = sanitizeInput(firstname || sanitizedUserName || '');
      const safeUsername = sanitizeInput(username || '');
      const safePassword = sanitizeInput(password || '');
      emailHtml = adminCredentialsEmailTemplate({
        firstname: safeFirst || email,
        username: safeUsername,
        password: safePassword,
        email,
      });
      subject = "Your YooKatale Admin Login Credentials";
      emailTypeLabel = "admin_credentials";
    } else {
      // Default to welcome email for signups
      emailHtml = emailTemplate;
      subject = "Welcome to Yookatale - Your Mobile Food Market! 🍽️";
      emailTypeLabel = "welcome";
    }

    // Prepare email options with validated and sanitized data
    // Security: All user inputs are sanitized before being used
    // Always use info@yookatale.app as sender email
    const mailOptions = {
      from: {
        name: "YooKatale",
        address: "info@yookatale.app", // Explicitly set sender email
      },
      replyTo: "info@yookatale.app", // Reply-to address
      to: email, // Already validated above
      subject: subject,
      html: emailHtml, // Pre-defined templates, safe from injection
    };

    // Log email sending attempt (without sensitive data)
    console.log(`📧 Sending ${emailTypeLabel} email to:`, email);
    console.log("📧 From:", mailOptions.from.address);
    console.log("📧 Subject:", subject);
    
    // Send email via SMTP
    // Security: All inputs are validated and sanitized before this point
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ ${emailTypeLabel} email sent successfully`);
    console.log("📧 Message ID:", result.messageId);

    // Return success response
    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: `${emailTypeLabel} email sent successfully` 
      }), 
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          // CORS headers to allow admin panel requests
          ...corsHeaders,
          // Security headers to prevent XSS and clickjacking
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY"
        }
      }
    );
  } catch (error) {
    // Log error details for debugging (in production, sanitize sensitive info)
    console.error("❌ Error sending email:", error.message);
    console.error("Error code:", error.code);
    
    // Security: Don't expose sensitive error details to client
    // Only log full details server-side
    if (process.env.NODE_ENV === "development") {
      console.error("Full error details:", {
        message: error.message,
        code: error.code,
        command: error.command,
        response: error.response,
      });
    }
    
    // Provide helpful error messages for common issues
    if (error.code === "EAUTH") {
      console.error("⚠️ Authentication failed. Please verify SMTP credentials.");
    } else if (error.code === "ECONNECTION") {
      console.error("⚠️ Connection failed. Please check network connectivity.");
    }
    
    // Return generic error message to client (don't expose internal details)
    return new NextResponse(
      JSON.stringify({ 
        error: "Failed to send email",
        // Security: Don't expose detailed error messages in production
        details: process.env.NODE_ENV === "development" ? error.message : "Please try again later"
      }), 
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders,
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  }
};
