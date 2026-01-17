/**
 * Professional Subscription Email Template
 * 
 * This template is used to welcome new subscribers to Yookatale
 * Includes links to website and Play Store app download
 */

export const subscriptionEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Yookatale - Your Mobile Food Market</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; line-height: 1.6;">
  
  <!-- Main Container -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #185f2d 0%, #1f793a 100%); padding: 40px 30px; text-align: center;">
              <img src="https://www.yookatale.app/assets/icons/logo2.png" alt="Yookatale Logo" style="max-width: 200px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
              <h1 style="color: #ffffff; font-size: 32px; font-weight: bold; margin: 0; text-align: center;">Welcome to Yookatale!</h1>
              <p style="color: #e0f2fe; font-size: 18px; margin: 10px 0 0 0; text-align: center;">Your Digital Mobile Food Market</p>
            </td>
          </tr>

          <!-- Hero Section -->
          <tr>
            <td style="padding: 40px 30px; text-align: center; background-color: #ffffff;">
              <h2 style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0 0 20px 0;">Experience Fresh, Organic Food Delivered to Your Doorstep</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0 0 30px 0;">
                Thank you for joining Yookatale! We're thrilled to have you as part of our community. 
                Discover a world of fresh, organic food products, customizable meals, and convenient delivery services 
                - all at your fingertips.
              </p>
            </td>
          </tr>

          <!-- Features Section -->
          <tr>
            <td style="padding: 0 30px 30px 30px; background-color: #ffffff;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; margin-bottom: 15px;">
                    <h3 style="color: #185f2d; font-size: 18px; font-weight: bold; margin: 0 0 10px 0;">🍽️ Customizable Meal Plans</h3>
                    <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.6;">
                      Choose from Premium, Family, or Business subscription plans. Set your own meal times and customize your meals to match your preferences.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="50%" style="padding-right: 10px;">
                          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; text-align: center;">
                            <p style="color: #92400e; font-size: 14px; font-weight: bold; margin: 0 0 5px 0;">🚚 Free Delivery</p>
                            <p style="color: #78350f; font-size: 12px; margin: 0;">Fast & reliable delivery service</p>
                          </div>
                        </td>
                        <td width="50%" style="padding-left: 10px;">
                          <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; text-align: center;">
                            <p style="color: #1e40af; font-size: 14px; font-weight: bold; margin: 0 0 5px 0;">💳 YooCard Access</p>
                            <p style="color: #1e3a8a; font-size: 12px; margin: 0;">Shop with or without cash</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td width="50%" style="padding-right: 10px;">
                          <div style="background-color: #f3e8ff; padding: 15px; border-radius: 8px; text-align: center;">
                            <p style="color: #6b21a8; font-size: 14px; font-weight: bold; margin: 0 0 5px 0;">🎁 Rewards Program</p>
                            <p style="color: #581c87; font-size: 12px; margin: 0;">Earn up to 50,000 UGX</p>
                          </div>
                        </td>
                        <td width="50%" style="padding-left: 10px;">
                          <div style="background-color: #fce7f3; padding: 15px; border-radius: 8px; text-align: center;">
                            <p style="color: #9f1239; font-size: 14px; font-weight: bold; margin: 0 0 5px 0;">🌱 Fresh & Organic</p>
                            <p style="color: #831843; font-size: 12px; margin: 0;">Quality food products</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Call to Action - Download App -->
          <tr>
            <td style="padding: 30px; background: linear-gradient(135deg, #185f2d 0%, #1f793a 100%); text-align: center;">
              <h3 style="color: #ffffff; font-size: 22px; font-weight: bold; margin: 0 0 15px 0;">📱 Download Our Mobile App</h3>
              <p style="color: #e0f2fe; font-size: 16px; margin: 0 0 25px 0; line-height: 1.6;">
                Get the full Yookatale experience on your mobile device. Order meals, track deliveries, 
                manage your subscription, and access exclusive features - all in one convenient app!
              </p>
              <a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" 
                 style="display: inline-block; padding: 16px 32px; background-color: #ffffff; color: #185f2d; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 10px 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);">
                📲 Download on Google Play
              </a>
            </td>
          </tr>

          <!-- Web Access Section -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff; text-align: center;">
              <h3 style="color: #1f2937; font-size: 20px; font-weight: bold; margin: 0 0 15px 0;">🌐 Or Access via Web</h3>
              <p style="color: #4b5563; font-size: 15px; margin: 0 0 20px 0;">
                Prefer using your browser? Access all Yookatale features directly from our website.
              </p>
              <a href="https://www.yookatale.app" 
                 style="display: inline-block; padding: 14px 28px; background-color: #185f2d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; margin: 5px;">
                Visit Yookatale.app
              </a>
            </td>
          </tr>

          <!-- Quick Links -->
          <tr>
            <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <h3 style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 20px 0; text-align: center;">Quick Links</h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 8px 0;">
                    <a href="https://www.yookatale.app/signup" style="color: #185f2d; text-decoration: none; font-weight: 500; font-size: 14px; margin: 0 10px;">Create Account</a>
                    <span style="color: #d1d5db; margin: 0 5px;">|</span>
                    <a href="https://www.yookatale.app/subscription" style="color: #185f2d; text-decoration: none; font-weight: 500; font-size: 14px; margin: 0 10px;">View Plans</a>
                    <span style="color: #d1d5db; margin: 0 5px;">|</span>
                    <a href="https://www.yookatale.app/partner" style="color: #185f2d; text-decoration: none; font-weight: 500; font-size: 14px; margin: 0 10px;">Partner With Us</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding: 8px 0;">
                    <a href="https://www.yookatale.app/#refer" style="color: #185f2d; text-decoration: none; font-weight: 500; font-size: 14px; margin: 0 10px;">Invite Friends</a>
                    <span style="color: #d1d5db; margin: 0 5px;">|</span>
                    <a href="https://www.yookatale.app/blog" style="color: #185f2d; text-decoration: none; font-weight: 500; font-size: 14px; margin: 0 10px;">Read Blog</a>
                    <span style="color: #d1d5db; margin: 0 5px;">|</span>
                    <a href="https://www.yookatale.app/faqs" style="color: #185f2d; text-decoration: none; font-weight: 500; font-size: 14px; margin: 0 10px;">FAQs</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Benefits Highlight -->
          <tr>
            <td style="padding: 30px; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px;">
                <h3 style="color: #92400e; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">🎉 Special Offer for New Subscribers</h3>
                <p style="color: #78350f; font-size: 15px; margin: 0 0 10px 0; line-height: 1.6;">
                  <strong>Earn up to 50,000 UGX in cash rewards and prizes</strong> when you refer a friend to Yookatale! 
                  Share the joy of fresh, organic food with your loved ones and get rewarded.
                </p>
                <a href="https://www.yookatale.app/#refer" style="display: inline-block; margin-top: 10px; color: #92400e; text-decoration: underline; font-weight: bold; font-size: 14px;">
                  Start Referring Friends →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #000000; padding: 40px 30px; text-align: center;">
              <p style="color: #9ca3af; font-size: 13px; margin: 0 0 10px 0; line-height: 1.6;">
                <strong style="color: #ffffff;">Yookatale</strong><br>
                P.O. Box 74940<br>
                Clock-Tower Plot 6, 27 Kampala<br>
                Entebbe, Uganda
              </p>
              
              <!-- Social Media Links -->
              <div style="margin: 25px 0;">
                <a href="https://www.facebook.com/profile.php?id=100094194942669&mibextid=LQQJ4d" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px; font-weight: 500;">Facebook</a>
                <span style="color: #6b7280; margin: 0 5px;">|</span>
                <a href="https://twitter.com/YooKatale?t=3Q96I9JR98HgA69gisdXdA&s=09" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px; font-weight: 500;">Twitter</a>
                <span style="color: #6b7280; margin: 0 5px;">|</span>
                <a href="https://www.instagram.com/p/CuHdaksN5UW/?igshid=NTc4MTIwNjQ2YQ==" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px; font-weight: 500;">Instagram</a>
              </div>

              <p style="color: #6b7280; font-size: 12px; margin: 20px 0 0 0;">
                Copyright © ${new Date().getFullYear()} Yookatale. All rights reserved.
              </p>
              <p style="color: #6b7280; font-size: 11px; margin: 10px 0 0 0;">
                You're receiving this email because you subscribed to Yookatale. 
                <a href="#" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;
