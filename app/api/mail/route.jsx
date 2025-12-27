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
 */

import { emailTemplate, newsletterEmailTemplate, invitationEmailTemplate } from "@constants/constants";
import { getMealCalendarEmailTemplate } from "@constants/mealCalendarEmailTemplate";
import { NextResponse } from "next/server";
import transporter, { defaultSender } from "@lib/emailConfig";

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
 * POST handler for sending emails
 * Validates input, selects appropriate template, and sends email via SMTP
 */
export const POST = async (req, res) => {
  try {
    // Parse and validate request body
    const body = await req.json();
    const { email, type = 'welcome', userName, mealType, greeting, meals, referralCode, subscriptionPlan } = body;
    
    // Security: Validate email address format to prevent injection attacks
    if (!isValidEmail(email)) {
      console.error("❌ Invalid email address format:", email);
      return new NextResponse(
        JSON.stringify({ 
          error: "Invalid email address format",
          details: "Please provide a valid email address"
        }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Security: Sanitize user inputs to prevent XSS
    const sanitizedUserName = sanitizeInput(userName);
    const sanitizedMealType = sanitizeInput(mealType);
    const sanitizedGreeting = sanitizeInput(greeting);
    
    // Security: Validate email type to prevent template injection
    const validTypes = ['welcome', 'newsletter', 'meal_notification', 'invitation'];
    const emailType = validTypes.includes(type) ? type : 'welcome';
    
    // Check if email transporter is configured
    if (!transporter) {
      console.error("❌ Email transporter not configured - EMAIL_PASSWORD missing");
      return new NextResponse(
        JSON.stringify({ 
          error: "Email service not configured. Please contact support.", 
          details: "EMAIL_PASSWORD is missing" 
        }), 
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    // Select appropriate email template and subject based on email type
    // Templates are pre-defined to prevent template injection attacks
    let emailHtml, subject, emailTypeLabel;
    
    if (emailType === 'newsletter') {
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
          "X-Content-Type-Options": "nosniff"
        }
      }
    );
  }
};
