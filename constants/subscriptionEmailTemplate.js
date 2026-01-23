/**
 * Professional Subscription Email Template
 *
 * Used for: (1) Website subscription signup, (2) Bulk auto-subscribed users (emailnew.csv)
 * One-row CTAs with icons, hero icons, marketplace 2x2, simple & persuasive.
 */

export const subscriptionEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Yookatale - Yoo mobile food market</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f3f4f6; line-height: 1.6; color: #1f2937;">

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="650" style="max-width: 650px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 50px rgba(0, 0, 0, 0.08); border: 1px solid rgba(0, 0, 0, 0.05);">

          <tr>
            <td style="background-color: #000000; padding: 40px 30px; text-align: center;">
              <img src="https://www.yookatale.app/assets/icons/logo2.png" alt="Yookatale Logo" style="max-width: 200px; height: auto; margin: 0 auto 15px; display: block;" />
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 800; margin: 0;">Welcome to Yookatale</h1>
              <p style="color: #e0f2fe; font-size: 17px; margin: 10px 0 0;">Yoo mobile food market</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 36px 28px; background-color: #ffffff;">
              <p style="color: #374151; font-size: 16px; line-height: 1.7; margin: 0 0 14px;">
                Switch to a new shopping style this new year. Forget about cooking or going to the market — subscribe for our <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> Plan monthly or annually. Get everything delivered at your doorstep.
              </p>
              <p style="color: #4b5563; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
                Discover and customize your meals, set when and where to eat with friends, family and loved ones. Earn loyalty points, credit points, gifts and discounts.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px;">
                <tr>
                  <td align="center" width="33%" style="padding: 0 8px;">
                    <div style="background-color: #eef2ff; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;">
                      <img src="https://img.icons8.com/ios-filled/50/1f2937/delivery.png" alt="Fast delivery" width="28" height="28" style="vertical-align: middle; border: 0;" />
                    </div>
                    <p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🚚 Fast Delivery</p>
                  </td>
                  <td align="center" width="33%" style="padding: 0 8px;">
                    <div style="background-color: #ecfdf5; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;">
                      <img src="https://img.icons8.com/ios-filled/50/1f2937/leaf.png" alt="Organic" width="28" height="28" style="vertical-align: middle; border: 0;" />
                    </div>
                    <p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🌿 100% Organic</p>
                  </td>
                  <td align="center" width="33%" style="padding: 0 8px;">
                    <div style="background-color: #fff7ed; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;">
                      <img src="https://img.icons8.com/ios-filled/50/1f2937/meal.png" alt="Custom meals" width="28" height="28" style="vertical-align: middle; border: 0;" />
                    </div>
                    <p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🍽️ Custom Meals</p>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 28px;">
                <tr>
                  <td width="50%" style="padding: 0 6px 0 0; vertical-align: top;">
                    <div style="background: linear-gradient(135deg, #0a5c36 0%, #1a7d46 100%); border-radius: 12px; padding: 18px 20px; text-align: center; border: 1px solid rgba(255,255,255,0.15);">
                      <p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">Get 10% off today</p>
                      <p style="color: rgba(255,255,255,0.95); font-size: 13px; margin: 8px 0 0; line-height: 1.5;">Test and activate Premium, Family or Business.</p>
                      <a href="https://www.yookatale.app/subscription" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #ffffff; color: #0a5c36; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Activate plan</a>
                    </div>
                  </td>
                  <td width="50%" style="padding: 0 0 0 6px; vertical-align: top;">
                    <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 18px 20px; text-align: center;">
                      <p style="color: #92400e; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">Earn up to 50,000 in rewards</p>
                      <p style="color: #b45309; font-size: 13px; margin: 8px 0 0; line-height: 1.5;">Refer a friend to Yookatale — cash &amp; prizes.</p>
                      <a href="https://www.yookatale.app/#refer" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Invite a friend</a>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="color: #111827; font-size: 15px; font-weight: 700; margin: 24px 0 12px; text-align: center; letter-spacing: 0.2px;">Your next steps — choose one</p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 28px;">
                <tr>
                  <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/signup" style="display: inline-block; padding: 8px 10px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/add-user-male.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Freely Signup</a></td>
                  <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/subscription" style="display: inline-block; padding: 8px 10px; background-color: #185f2d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Subscribe</a></td>
                  <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/partner" style="display: inline-block; padding: 8px 10px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/handshake.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Partner with us</a></td>
                  <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/#refer" style="display: inline-block; padding: 8px 10px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/gift.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Invite a friend</a></td>
                  <td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app" style="display: inline-block; padding: 8px 10px; background-color: #4b5563; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/shop.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Visit marketplace</a></td>
                </tr>
              </table>

              <div style="background-color: #f9fafb; border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid #e5e7eb;">
                <h3 style="color: #111827; font-size: 18px; font-weight: 700; margin: 0 0 10px; text-align: center;">🛒 Shop the Marketplace</h3>
                <p style="color: #4b5563; font-size: 14px; margin: 0 0 16px; text-align: center;">Browse and order in minutes.</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td width="50%" style="padding: 0 6px 12px 0; vertical-align: top;">
                      <a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;">
                        <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                          <img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&h=240&q=80" alt="Fresh vegetables" style="display: block; width: 100%; height: auto; border: 0;" />
                          <div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Fresh Vegetables</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Handpicked daily.</p></div>
                        </div>
                      </a>
                    </td>
                    <td width="50%" style="padding: 0 0 12px 6px; vertical-align: top;">
                      <a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;">
                        <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&h=240&q=80" alt="Organic fruits" style="display: block; width: 100%; height: auto; border: 0;" />
                          <div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Organic Fruits</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Always fresh.</p></div>
                        </div>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%" style="padding: 0 6px 0 0; vertical-align: top;">
                      <a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;">
                        <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=240&q=80" alt="Ready meals" style="display: block; width: 100%; height: auto; border: 0;" />
                          <div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Ready Meals</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Chef-prepared.</p></div>
                        </div>
                      </a>
                    </td>
                    <td width="50%" style="padding: 0 0 0 6px; vertical-align: top;">
                      <a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;">
                        <div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                          <img src="https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&h=240&q=80" alt="Pantry essentials" style="display: block; width: 100%; height: auto; border: 0;" />
                          <div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Pantry Essentials</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Kitchen staples.</p></div>
                        </div>
                      </a>
                    </td>
                  </tr>
                </table>
                <div style="text-align: center; margin-top: 14px;">
                  <a href="https://www.yookatale.app/marketplace" style="display: inline-block; padding: 10px 20px; background-color: #0a5c36; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Visit Marketplace</a>
                </div>
              </div>

              <div style="margin-top: 28px; padding: 24px; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom: 12px;">
                      <img src="https://img.icons8.com/ios-filled/50/0a5c36/smartphone.png" alt="App" width="40" height="40" style="display: block; margin: 0 auto; border: 0;" />
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <p style="color: #0f172a; font-size: 17px; font-weight: 700; margin: 0 0 6px; letter-spacing: 0.2px;">Yookatale in your pocket</p>
                      <p style="color: #64748b; font-size: 14px; margin: 0 0 16px; line-height: 1.5;">Download the official app. Shop, subscribe, and track orders from your phone.</p>
                      <a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" style="text-decoration: none; display: inline-block;">
                        <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" width="180" style="display: block; border: 0; height: auto;" />
                      </a>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background-color: #111827; padding: 40px 30px; border-radius: 0 0 20px 20px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <h4 style="color: #ffffff; font-size: 16px; font-weight: 700; margin: 0 0 10px;">Contact Us</h4>
                <p style="color: rgba(255, 255, 255, 0.85); font-size: 13px; margin: 0 0 6px;">
                  <img src="https://img.icons8.com/ios-filled/50/ffffff/marker.png" alt="Location" width="12" height="12" style="vertical-align: -2px; margin-right: 6px; border: 0;" />
                  Clock-Tower Plot 6, 27 Kampala, Entebbe, Uganda · P.O. Box 74940
                </p>
              </div>
              <div style="text-align: center; margin-bottom: 18px;">
                <a href="https://www.facebook.com/profile.php?id=100094194942669&mibextid=LQQJ4d" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Facebook</a>
                <span style="color: #6b7280;">|</span>
                <a href="https://twitter.com/YooKatale?t=3Q96I9JR98HgA69gisdXdA&s=09" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Twitter</a>
                <span style="color: #6b7280;">|</span>
                <a href="https://www.instagram.com/p/CuHdaksN5UW/?igshid=NTc4MTIwNjQ2YQ==" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">Instagram</a>
                <span style="color: #6b7280;">|</span>
                <a href="https://wa.me/256786118137" style="color: #ffffff; text-decoration: none; font-size: 13px; margin: 0 8px;">WhatsApp</a>
              </div>
              <div style="text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 16px;">
                <p style="color: rgba(255, 255, 255, 0.7); font-size: 12px; margin: 0 0 8px;">Copyright © ${new Date().getFullYear()} Yookatale. All rights reserved.</p>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 11px; margin: 0;">You're receiving this because you subscribed to Yookatale. <a href="https://www.yookatale.app" style="color: rgba(255, 255, 255, 0.85); text-decoration: underline;">Unsubscribe</a></p>
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
