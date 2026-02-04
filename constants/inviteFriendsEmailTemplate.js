/**
 * Invite Friends and Earn Email Template
 *
 * Sent to users to guide them on how to invite friends and earn rewards (money and points).
 * Includes instructions on sharing referral links and earning cash/points.
 */

export const inviteFriendsEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Invite Friends & Earn Rewards - Yookatale</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f3f4f6; line-height: 1.6; color: #1f2937;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f3f4f6; padding: 20px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06); border: 1px solid rgba(0, 0, 0, 0.05);">

          <tr>
            <td style="background-color: #000000; padding: 20px 20px; text-align: center;">
              <img src="https://www.yookatale.app/assets/icons/logo2.png" alt="Yookatale Logo" style="max-width: 120px; height: auto; margin: 0 auto 8px; display: block;" />
              <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0;">Welcome to Yookatale</h1>
              <p style="color: #e0f2fe; font-size: 13px; margin: 6px 0 0;">Yoo mobile food market</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 18px; background-color: #ffffff;">
              <p style="color: #374151; font-size: 13px; line-height: 1.5; margin: 0 0 10px;">
                Invite your friends, family, and associates to Yookatale and earn rewards! Share your unique referral link via email, social media, or by copying the link. When they sign up using your referral link and make their first order, you'll earn cash rewards and loyalty points that you can use for future purchases.
              </p>
              <p style="color: #4b5563; font-size: 12px; line-height: 1.5; margin: 0 0 16px;">
                The more friends you invite, the more you earn. Simply share your referral link, make sure they sign up using it, and claim your payout. Start earning today by inviting others to join Yookatale!
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 16px;">
                <tr>
                  <td align="center" width="33%" style="padding: 0 4px;">
                    <div style="background-color: #eef2ff; width: 40px; height: 40px; border-radius: 50%; line-height: 40px; margin: 0 auto 6px; text-align: center;">
                      <img src="https://img.icons8.com/ios-filled/50/1f2937/delivery.png" alt="Fast delivery" width="20" height="20" style="vertical-align: middle; border: 0;" />
                    </div>
                    <p style="color: #111827; font-size: 11px; font-weight: 600; margin: 0;">🚚 Fast Delivery</p>
                  </td>
                  <td align="center" width="33%" style="padding: 0 4px;">
                    <div style="background-color: #fef3c7; width: 40px; height: 40px; border-radius: 50%; line-height: 40px; margin: 0 auto 6px; text-align: center;">
                      <img src="https://img.icons8.com/ios-filled/50/1f2937/wallet.png" alt="Pay later" width="20" height="20" style="vertical-align: middle; border: 0;" />
                    </div>
                    <p style="color: #111827; font-size: 11px; font-weight: 600; margin: 0;">💳 Pay Later</p>
                  </td>
                  <td align="center" width="33%" style="padding: 0 4px;">
                    <div style="background-color: #fff7ed; width: 40px; height: 40px; border-radius: 50%; line-height: 40px; margin: 0 auto 6px; text-align: center;">
                      <img src="https://img.icons8.com/ios-filled/50/1f2937/meal.png" alt="Custom meals" width="20" height="20" style="vertical-align: middle; border: 0;" />
                    </div>
                    <p style="color: #111827; font-size: 11px; font-weight: 600; margin: 0;">🍽️ Custom Meals</p>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 16px;">
                <tr>
                  <td width="50%" style="padding: 0 4px 0 0; vertical-align: top;">
                    <div style="background: linear-gradient(135deg, #0a5c36 0%, #1a7d46 100%); border-radius: 12px; padding: 14px 16px; text-align: center; border: 1px solid rgba(255,255,255,0.15);">
                      <p style="color: #ffffff; font-size: 12px; font-weight: 700; margin: 0;">Get 10% off today</p>
                      <p style="color: rgba(255,255,255,0.95); font-size: 10px; margin: 4px 0 0; line-height: 1.4;">Test and activate Premium, Family or Business.</p>
                      <a href="https://www.yookatale.app/subscription" style="display: inline-block; margin-top: 10px; padding: 8px 18px; background-color: #ffffff; color: #0a5c36; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 12px;">Activate plan</a>
                    </div>
                  </td>
                  <td width="50%" style="padding: 0 0 0 4px; vertical-align: top;">
                    <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 14px 16px; text-align: center;">
                      <p style="color: #92400e; font-size: 12px; font-weight: 700; margin: 0;">Earn up to 50,000 in rewards</p>
                      <p style="color: #b45309; font-size: 10px; margin: 4px 0 0; line-height: 1.4;">Refer a friend to Yookatale — cash &amp; prizes.</p>
                      <a href="https://www.yookatale.app/#refer" style="display: inline-block; margin-top: 10px; padding: 8px 18px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 12px;">Invite a friend</a>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color: #111827; font-size: 12px; font-weight: 700; margin: 12px 0 8px; text-align: center;">Your next steps — choose one</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 16px;">
                <tr>
                  <td align="center" width="20%" style="padding: 2px 1px; vertical-align: top;"><a href="https://www.yookatale.app/signup" style="display: inline-block; padding: 8px 10px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 10px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/add-user-male.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Signup</a></td>
                  <td align="center" width="20%" style="padding: 2px 1px; vertical-align: top;"><a href="https://www.yookatale.app/subscription" style="display: inline-block; padding: 8px 10px; background-color: #185f2d; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 10px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Subscribe</a></td>
                  <td align="center" width="20%" style="padding: 2px 1px; vertical-align: top;"><a href="https://www.yookatale.app/partner" style="display: inline-block; padding: 8px 10px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 10px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/handshake.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Partner</a></td>
                  <td align="center" width="20%" style="padding: 2px 1px; vertical-align: top;"><a href="https://www.yookatale.app/#refer" style="display: inline-block; padding: 8px 10px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 10px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/gift.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Invite</a></td>
                  <td align="center" width="20%" style="padding: 2px 1px; vertical-align: top;"><a href="https://www.yookatale.app" style="display: inline-block; padding: 8px 10px; background-color: #4b5563; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 10px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/shop.png" width="10" height="10" alt="" style="vertical-align: -1px; margin-right: 2px; border: 0;" />Shop</a></td>
                </tr>
              </table>

              <div style="background-color: #f9fafb; border-radius: 12px; padding: 12px; margin: 16px 0; border: 1px solid #e5e7eb;">
                <h3 style="color: #111827; font-size: 14px; font-weight: 700; margin: 0 0 8px; text-align: center;">How to Invite Friends & Earn Rewards</h3>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td width="50%" style="padding: 0 4px 0 0; vertical-align: top;">
                      <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                        <img src="https://www.yookatale.app/assets/images/invite-menu.png" alt="Click to Invite" style="display: block; width: 100%; height: auto; border: 0; max-height: 300px; object-fit: contain;" />
                        <div style="padding: 8px;"><p style="margin: 0; font-weight: 600; color: #111827; font-size: 11px;">Click to Invite</p></div>
                      </div>
                    </td>
                    <td width="50%" style="padding: 0 0 0 4px; vertical-align: top;">
                      <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                        <img src="https://www.yookatale.app/assets/images/referral-link-modal.png" alt="Share Referral Link" style="display: block; width: 100%; height: auto; border: 0; max-height: 300px; object-fit: contain;" />
                        <div style="padding: 8px;"><p style="margin: 0; font-weight: 600; color: #111827; font-size: 11px;">Share Referral Link</p></div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 8px 0 0 0;">
                      <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                        <img src="https://www.yookatale.app/assets/images/rewards-page.png" alt="Rewards Page" style="display: block; width: 100%; height: auto; border: 0; max-height: 400px; object-fit: contain;" />
                        <div style="padding: 8px;"><p style="margin: 0; font-weight: 600; color: #111827; font-size: 11px;">Rewards Page</p></div>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="margin-top: 16px; padding: 14px; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center">
                      <p style="color: #0f172a; font-size: 13px; font-weight: 700; margin: 0 0 4px;">Yookatale in your pocket</p>
                      <p style="color: #64748b; font-size: 11px; margin: 0 0 10px; line-height: 1.4;">Download the official app. Shop, subscribe, and track orders from your phone.</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 auto;">
                        <tr>
                          <td align="center" style="padding: 0 6px;">
                            <a href="https://apps.apple.com/app/yookatale" style="text-decoration: none; display: inline-block;">
                              <img src="https://assets.stickpng.com/images/5a902db97f96951c82922874.png" alt="Download on the App Store" width="140" style="display: block; border: 0; height: auto; max-width: 140px;" />
                            </a>
                          </td>
                          <td align="center" style="padding: 0 6px;">
                            <a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" style="text-decoration: none; display: inline-block;">
                              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" width="140" style="display: block; border: 0; height: auto;" />
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #111827; padding: 20px 18px; border-radius: 0 0 12px 12px;">
              <div style="text-align: center; margin-bottom: 12px;">
                <h4 style="color: #ffffff; font-size: 12px; font-weight: 700; margin: 0 0 6px;">Contact Us</h4>
                <p style="color: rgba(255, 255, 255, 0.85); font-size: 10px; margin: 0 0 4px;">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/marker.png" alt="Location" width="10" height="10" style="vertical-align: -1px; margin-right: 4px; border: 0;" />
                  Clock-Tower Plot 6, 27 Kampala, Entebbe, Uganda · P.O. Box 74940
                </p>
              </div>
              <div style="text-align: center; margin-bottom: 10px;">
                <a href="https://www.facebook.com/profile.php?id=100094194942669&mibextid=LQQJ4d" style="color: #ffffff; text-decoration: none; font-size: 10px; margin: 0 4px;">Facebook</a>
                <span style="color: #6b7280;">|</span>
                <a href="https://twitter.com/YooKatale?t=3Q96I9JR98HgA69gisdXdA&s=09" style="color: #ffffff; text-decoration: none; font-size: 10px; margin: 0 4px;">Twitter</a>
                <span style="color: #6b7280;">|</span>
                <a href="https://www.instagram.com/p/CuHdaksN5UW/?igshid=NTc4MTIwNjQ2YQ==" style="color: #ffffff; text-decoration: none; font-size: 10px; margin: 0 4px;">Instagram</a>
                <span style="color: #6b7280;">|</span>
                <a href="https://wa.me/256786118137" style="color: #ffffff; text-decoration: none; font-size: 10px; margin: 0 4px;">WhatsApp</a>
              </div>
              <div style="text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 10px;">
                <p style="color: rgba(255, 255, 255, 0.7); font-size: 10px; margin: 0 0 4px;">Copyright © ${new Date().getFullYear()} Yookatale. All rights reserved.</p>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 9px; margin: 0;">You're receiving this because you signed up to Yookatale. <a href="https://www.yookatale.app" style="color: rgba(255, 255, 255, 0.85); text-decoration: underline;">Unsubscribe</a></p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
