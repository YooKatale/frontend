import cardSecureIcon from "@public/assets/icons/card-secure.png";
import customerServiceIcon from "@public/assets/icons/customer-service.png";
import logo from "@public/assets/icons/logo.jpg";
import logo1 from "@public/assets/icons/logo1.png";
import logo2 from "@public/assets/icons/logo2.png";
import logo3 from "@public/assets/icons/logo3.jpg";
import img from "@public/assets/images/img.png";
import img1 from "@public/assets/images/img1.png";
import img2 from "@public/assets/images/img2.png";
import img3 from "@public/assets/images/img3.png";
import img4 from "@public/assets/images/img4.png";
import img5 from "@public/assets/images/img5.png";

/** Yookatale theme — green brand. Used by Chakra and shared components. */
export const ThemeColors = {
  primaryColor: "#185f2d",
  secondaryColor: "#1f793a",
  darkColor: "#185f2d",
  lightColor: "#e8f5ec",
};

/** Resolve avatar or any backend image URL: if already absolute use as-is, else prepend API origin (for /images/uploads/...). */
export function getAvatarUrl(avatar) {
  if (!avatar || typeof avatar !== "string") return undefined;
  const s = avatar.trim();
  if (!s) return undefined;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const origin = (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_ORIGIN) || "https://yookatale-server.onrender.com";
  return origin.replace(/\/$/, "") + (s.startsWith("/") ? s : "/" + s);
}

/** Get user avatar URL from user object (handles avatar, profilePic, profile_pic). */
export function getUserAvatarUrl(user) {
  if (!user || typeof user !== "object") return undefined;
  const url = user.avatar || user.profilePic || user.profile_pic || user.profileImage;
  return getAvatarUrl(url);
}

/** Alias for backend image URLs (categories, country cuisine banners, etc.). */
export function getImageUrl(url) {
  return getAvatarUrl(url);
}

/**
 * Returns a URL that serves the image as WebP via /api/image (smaller size, faster load).
 * Use for any image (backend, /assets, or external allowed origin) to save data.
 * - data: URLs are returned as-is (no proxy).
 * - /assets/... paths are passed as path for same-origin read.
 * - Other relative paths (e.g. /images/uploads/...) are resolved with getImageUrl then proxied.
 * - /_next/... (Next.js static) are not proxied (returns undefined).
 */
export function getOptimizedImageUrl(url) {
  if (!url || typeof url !== "string") return undefined;
  const s = url.trim();
  if (!s) return undefined;
  if (s.startsWith("data:")) return s;
  if (s.startsWith("/_next")) return undefined;
  const resolved =
    s.startsWith("http") ? s
    : s.startsWith("/assets") ? s
    : getAvatarUrl(s);
  if (!resolved) return undefined;
  return `/api/image?url=${encodeURIComponent(resolved)}`;
}

/** Client/vendor dashboard URL (e.g. seller app). Set NEXT_PUBLIC_CLIENT_DASHBOARD_URL in env or defaults to /sell. */
export const CLIENT_DASHBOARD_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CLIENT_DASHBOARD_URL) || "/sell";

/** MTN & Airtel payment logos — use on cashout, payment page, and all payment UIs */
export const PaymentLogos = {
  mtn: "/assets/images/payment/mtn-mobile-money.png",
  airtel: "/assets/images/payment/airtel-money.png",
};

export const Images = {
  logo,
  logo1,
  logo2,
  logo3,
  img,
  img1,
  img2,
  img3,
  img4,
  img5,
  customerServiceIcon,
  cardSecureIcon,
};

export const CategoriesJsond= [
  "Carbohydrates",
  "Protein",
  "Fats and oils",
  "Vitamins",
  "gas",
  "herbs and spices",
  "Knife Shapening",
  "breakfast",
  "Dairy",
  "vegetables",
  "juice&meals",
  "root tubers",
  "Markets & Shops Nearby",
];

export const CategoriesJson = [
  "Vitamins",
  "Protein",
  "Dairy",
  "vegetables",
  "Fats and oils",
  "root tubers",
  "Carbohydrates",
  "herbs and spices",
  "breakfast",
  "Markets & Shops Nearby",
  "juice",
  "meals",
  "Cuisines",
  "Kitchen",
  "Supplements",
];

export const DisplayImages = [img, img1, img2, img3, img4];

export const Lorem = {
  short:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi eum, voluptatem, corporis qui quo aperiam id mollitia itaque harum quos debitis cupiditate veniam quas incidunt. Harum beatae voluptates hic expedita.",
  long: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, aliquid aut eveniet cumque inventore accusantium ducimus! Laudantium quam reiciendis velit obcaecati maiores cum necessitatibus error, deleniti eveniet officiis rerum eligendi temporibus. Veniam eaque sunt porro non velit possimus enim numquam, et omnis deleniti beatae adipisci quas dolores officia pariatur magni eius, eum ea soluta perferendis distinctio quasi? Libero mollitia distinctio iste ipsum natus explicabo, illum inventore dolores non perspiciatis error asperiores nulla doloribus repellat est? Illo repudiandae tempore dolore blanditiis optio quo pariatur mollitia libero, dolor dolorem harum quisquam voluptatem? Tenetur, voluptates inventore consequuntur natus eius repudiandae! Debitis ut pariatur ipsam, nemo distinctio dolorem consequuntur mollitia quaerat sunt? Eligendi ea eius dolorem magni iure impedit quam libero voluptatibus praesentium vero accusantium nam, ipsam recusandae cum minus quod cumque aut fugit officia deserunt explicabo quisquam at. Nisi odit a minima molestias ad! Officiis eum nam, ducimus natus voluptatem esse odit cum! Saepe laboriosam aliquid facilis laudantium nihil ipsum similique incidunt quas necessitatibus error asperiores nam atque architecto, numquam quidem, corrupti omnis provident. Cupiditate dolorum ab at eos, dolorem modi labore fugit fugiat. Molestias ratione reprehenderit aliquid maxime ab corrupti obcaecati pariatur, deserunt asperiores quasi et eligendi officiis repudiandae nemo molestiae dolore, voluptatem consequuntur perspiciatis natus. Ex molestiae tempore hic nisi provident, iste quis dolore. Odit voluptatum quod officiis id illo ut suscipit magni delectus, necessitatibus obcaecati expedita, odio tempore dolorum eligendi corporis nemo officia nam nesciunt repudiandae eaque vero tempora quidem! Consectetur, ex. Debitis autem corporis facilis laboriosam porro, totam quod neque libero commodi temporibus nam qui obcaecati animi reiciendis voluptates eveniet quam. Dolore corrupti vero voluptatem neque ipsam reiciendis dolores delectus! Deleniti asperiores excepturi perspiciatis quidem aperiam, vitae autem? Tempore delectus officiis ad blanditiis qui voluptatem consequatur nam exercitationem necessitatibus eos enim, non ducimus molestiae atque, dignissimos totam quas. Inventore quae consequatur facere. Ab aspernatur quae sint, mollitia distinctio quasi consequatur vel qui placeat. Distinctio molestiae cumque eos, libero ipsa unde. A voluptates reiciendis sit voluptatibus dolor necessitatibus quae minima iste distinctio eveniet quia ea commodi officia possimus, consectetur perspiciatis quam error accusamus laboriosam consequuntur at alias mollitia voluptatum! Blanditiis est alias corrupti aut possimus error quia expedita! Dolorum quo rem eum dolor saepe nihil adipisci aspernatur nemo debitis exercitationem ratione corporis dicta a reprehenderit fugit provident delectus laboriosam ad quasi, quis nesciunt doloribus? Pariatur, culpa et quasi minima unde aut ut? Corrupti aperiam atque veniam. Modi, ipsam ut. Corporis.",
};

export const TestBlog = `
<div><p>"Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, aliquid aut eveniet cumque inventore accusantium ducimus! Laudantium quam reiciendis velit obcaecati maiores cum necessitatibus error, deleniti eveniet officiis rerum eligendi temporibus. Veniam eaque sunt porro non velit possimus enim numquam, et omnis deleniti beatae adipisci quas dolores officia pariatur magni eius, eum ea soluta perferendis distinctio quasi? </p></div>
<div><p>
<div>
<p>Libero mollitia distinctio iste ipsum natus explicabo, illum inventore dolores non perspiciatis error asperiores nulla doloribus repellat est? Illo repudiandae tempore dolore blanditiis optio quo pariatur mollitia libero, dolor dolorem harum quisquam voluptatem? Tenetur, voluptates inventore consequuntur natus eius repudiandae! Debitis ut pariatur ipsam, nemo distinctio dolorem consequuntur mollitia quaerat sunt? Eligendi ea eius dolorem magni iure impedit quam libero voluptatibus praesentium vero accusantium nam, ipsam recusandae cum minus quod cumque aut fugit officia deserunt explicabo quisquam at. Nisi odit a minima molestias ad! Officiis eum nam, ducimus natus voluptatem esse odit cum! Saepe laboriosam aliquid facilis laudantium nihil ipsum similique incidunt quas necessitatibus error asperiores nam atque architecto, numquam quidem, corrupti omnis provident. Cupiditate dolorum ab at eos, dolorem modi labore fugit fugiat. Molestias ratione reprehenderit aliquid maxime ab corrupti obcaecati pariatur, deserunt asperiores quasi et eligendi officiis repudiandae nemo molestiae dolore, voluptatem consequuntur perspiciatis natus. </p></div>
<div><ul><li>qui voluptatem consequatur nam exercitationem necessitatibus eos enim</li><li> Deleniti asperiores excepturi perspiciatis quidem</li><li>Odit voluptatum quod officiis id illo ut</li><li>Inventore quae consequatur facere. Ab aspernatur quae sint</li>quae minima iste distinctio eveniet quia ea</li></ul></div>
<div>
<div><p>Debitis autem corporis facilis laboriosam porro, totam quod neque libero commodi temporibus nam qui obcaecati animi reiciendis voluptates eveniet quam. Dolore corrupti vero voluptatem neque ipsam reiciendis dolores delectus! Deleniti asperiores excepturi perspiciatis quidem aperiam, vitae autem? Tempore delectus officiis ad blanditiis qui voluptatem consequatur nam exercitationem necessitatibus eos enim, non ducimus molestiae atque, dignissimos totam quas. Inventore quae consequatur facere. Ab aspernatur quae sint, mollitia distinctio quasi consequatur vel qui placeat. Distinctio molestiae cumque eos, libero ipsa unde. A voluptates reiciendis sit voluptatibus dolor necessitatibus quae minima iste distinctio eveniet quia ea commodi officia possimus, consectetur perspiciatis quam error accusamus laboriosam consequuntur at alias mollitia voluptatum! Blanditiis est alias corrupti aut possimus error quia expedita! Dolorum quo rem eum dolor saepe nihil adipisci aspernatur nemo debitis exercitationem ratione corporis dicta a reprehenderit fugit provident delectus laboriosam ad quasi, quis nesciunt doloribus? Pariatur, culpa et quasi minima unde aut ut? Corrupti aperiam atque veniam. Modi, ipsam ut. Corporis.</p></div>
`;

// Welcome email template for new signups
export const emailTemplate = `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #000000;">
    <tr>
      <td style="padding: 36px 20px; text-align: center;">
        <img src="https://www.yookatale.app/assets/icons/logo2.png" alt="YooKatale Logo" style="max-width: 160px; height: auto; margin-bottom: 16px;" />
        <h1 style="font-size: 32px; color: #ffffff; margin: 0; font-weight: bold;">Welcome to Yookatale</h1>
        <p style="font-size: 17px; color: #e0f2fe; margin: 10px 0 0 0;">Yoo mobile food market</p>
      </td>
    </tr>
  </table>

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 36px 28px;">
        <p style="font-size: 16px; color: #374151; line-height: 1.7; margin: 0 0 16px 0;">
          Switch to a new shopping style this new year. Forget about cooking or going to the market — subscribe for our <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> Plan monthly or annually. Get everything delivered at your doorstep.
        </p>
        <p style="font-size: 15px; color: #4b5563; line-height: 1.7; margin: 0 0 24px 0;">
          Discover and customize your meals, set when and where to eat with friends, family and loved ones. Earn loyalty points, credit points, gifts and discounts.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;">
          <tr>
            <td align="center" width="33%" style="padding: 0 8px;"><div style="background-color: #eef2ff; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;"><img src="https://img.icons8.com/ios-filled/50/1f2937/delivery.png" alt="Fast delivery" width="28" height="28" style="vertical-align: middle; border: 0;" /></div><p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🚚 Fast Delivery</p></td>
            <td align="center" width="33%" style="padding: 0 8px;"><div style="background-color: #ecfdf5; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;"><img src="https://img.icons8.com/ios-filled/50/1f2937/leaf.png" alt="Organic" width="28" height="28" style="vertical-align: middle; border: 0;" /></div><p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🌿 100% Organic</p></td>
            <td align="center" width="33%" style="padding: 0 8px;"><div style="background-color: #fff7ed; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;"><img src="https://img.icons8.com/ios-filled/50/1f2937/meal.png" alt="Custom meals" width="28" height="28" style="vertical-align: middle; border: 0;" /></div><p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🍽️ Custom Meals</p></td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px;"><tr><td width="50%" style="padding: 0 6px 0 0; vertical-align: top;"><div style="background: linear-gradient(135deg, #0a5c36 0%, #1a7d46 100%); border-radius: 12px; padding: 18px 20px; text-align: center; border: 1px solid rgba(255,255,255,0.15);"><p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">Get 10% off today</p><p style="color: rgba(255,255,255,0.95); font-size: 13px; margin: 8px 0 0; line-height: 1.5;">Test and activate Premium, Family or Business.</p><a href="https://www.yookatale.app/subscription" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #ffffff; color: #0a5c36; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Activate plan</a></div></td><td width="50%" style="padding: 0 0 0 6px; vertical-align: top;"><div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 18px 20px; text-align: center;"><p style="color: #92400e; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">Earn up to 50,000 in rewards</p><p style="color: #b45309; font-size: 13px; margin: 8px 0 0; line-height: 1.5;">Refer a friend to Yookatale — cash &amp; prizes.</p><a href="https://www.yookatale.app/#refer" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Invite a friend</a></div></td></tr></table>
        <p style="color: #111827; font-size: 15px; font-weight: 700; margin: 24px 0 12px; text-align: center; letter-spacing: 0.2px;">Your next steps — choose one</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px;">
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
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td width="50%" style="padding: 0 6px 12px 0; vertical-align: top;"><a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;"><div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&h=240&q=80" alt="Fresh vegetables" style="display: block; width: 100%; height: auto; border: 0;" /><div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Fresh Vegetables</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Handpicked daily.</p></div></div></a></td><td width="50%" style="padding: 0 0 12px 6px; vertical-align: top;"><a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;"><div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&h=240&q=80" alt="Organic fruits" style="display: block; width: 100%; height: auto; border: 0;" /><div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Organic Fruits</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Always fresh.</p></div></div></a></td></tr><tr><td width="50%" style="padding: 0 6px 0 0; vertical-align: top;"><a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;"><div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=240&q=80" alt="Ready meals" style="display: block; width: 100%; height: auto; border: 0;" /><div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Ready Meals</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Chef-prepared.</p></div></div></a></td><td width="50%" style="padding: 0 0 0 6px; vertical-align: top;"><a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;"><div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><img src="https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&h=240&q=80" alt="Pantry essentials" style="display: block; width: 100%; height: auto; border: 0;" /><div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Pantry Essentials</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Kitchen staples.</p></div></div></a></td></tr></table>
          <div style="text-align: center; margin-top: 14px;"><a href="https://www.yookatale.app/marketplace" style="display: inline-block; padding: 10px 20px; background-color: #0a5c36; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Visit Marketplace</a></div>
        </div>
        <div style="margin-top: 28px; padding: 24px; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom: 12px;"><img src="https://img.icons8.com/ios-filled/50/0a5c36/smartphone.png" alt="App" width="40" height="40" style="display: block; margin: 0 auto; border: 0;" /></td></tr><tr><td align="center"><p style="color: #0f172a; font-size: 17px; font-weight: 700; margin: 0 0 6px; letter-spacing: 0.2px;">Yookatale in your pocket</p><p style="color: #64748b; font-size: 14px; margin: 0 0 16px; line-height: 1.5;">Download the official app. Shop, subscribe, and track orders from your phone.</p><a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" style="text-decoration: none; display: inline-block;"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" width="180" style="display: block; border: 0; height: auto;" /></a></td></tr></table></div>
      </td>
    </tr>
  </table>

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #000000;">
    <tr>
      <td style="padding: 28px 20px; text-align: center; border-top: 2px solid #333333;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0 0 12px 0;">
          <a href="https://www.facebook.com/profile.php?id=100094194942669&mibextid=LQQJ4d" style="color: #ffffff; text-decoration: none; margin: 0 6px;">Facebook</a>
          <span style="color: #6b7280;">|</span>
          <a href="https://twitter.com/YooKatale?t=3Q96I9JR98HgA69gisdXdA&s=09" style="color: #ffffff; text-decoration: none; margin: 0 6px;">Twitter</a>
          <span style="color: #6b7280;">|</span>
          <a href="https://www.instagram.com/p/CuHdaksN5UW/?igshid=NTc4MTIwNjQ2YQ==" style="color: #ffffff; text-decoration: none; margin: 0 6px;">Instagram</a>
          <span style="color: #6b7280;">|</span>
          <a href="https://www.linkedin.com/company/96071915/admin/feed/posts/" style="color: #ffffff; text-decoration: none; margin: 0 6px;">LinkedIn</a>
          <span style="color: #6b7280;">|</span>
          <a href="https://wa.me/256786118137" style="color: #ffffff; text-decoration: none; margin: 0 6px;">WhatsApp</a>
        </p>
        <p style="font-size: 13px; color: #9ca3af; margin: 0 0 8px 0; line-height: 1.6;">
          P.O. Box 74940 · Clock-Tower Plot 6, 27 Kampala · Entebbe, Uganda
        </p>
        <p style="font-size: 12px; color: #6b7280; margin: 12px 0 0 0;">© ${new Date().getFullYear()} YooKatale. All rights reserved.</p>
        <p style="font-size: 11px; color: #6b7280; margin: 14px 0 0 0;">You're receiving this because you signed up for Yookatale.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// Newsletter email template - subscription and news based (website newsletter signup)
export const newsletterEmailTemplate = `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #000000;">
    <tr>
      <td style="padding: 36px 20px; text-align: center;">
        <img src="https://www.yookatale.app/assets/icons/logo2.png" alt="YooKatale Logo" style="max-width: 160px; height: auto; margin-bottom: 16px;" />
        <h1 style="font-size: 32px; color: #ffffff; margin: 0; font-weight: bold;">YooKatale Newsletter 📬</h1>
        <p style="font-size: 17px; color: #e0f2fe; margin: 10px 0 0 0;">Stay updated with news & offers</p>
      </td>
    </tr>
  </table>

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 36px 28px;">
        <p style="font-size: 16px; color: #374151; line-height: 1.7; margin: 0 0 24px 0;">
          Welcome to Yookatale — Yoo mobile food market. Subscribe <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> monthly or annually. Get everything delivered to your doorstep.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;"><tr><td align="center" width="33%" style="padding: 0 8px;"><div style="background-color: #eef2ff; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;"><img src="https://img.icons8.com/ios-filled/50/1f2937/delivery.png" alt="Fast delivery" width="28" height="28" style="vertical-align: middle; border: 0;" /></div><p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🚚 Fast Delivery</p></td><td align="center" width="33%" style="padding: 0 8px;"><div style="background-color: #ecfdf5; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;"><img src="https://img.icons8.com/ios-filled/50/1f2937/leaf.png" alt="Organic" width="28" height="28" style="vertical-align: middle; border: 0;" /></div><p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🌿 100% Organic</p></td><td align="center" width="33%" style="padding: 0 8px;"><div style="background-color: #fff7ed; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;"><img src="https://img.icons8.com/ios-filled/50/1f2937/meal.png" alt="Custom meals" width="28" height="28" style="vertical-align: middle; border: 0;" /></div><p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🍽️ Custom Meals</p></td></tr></table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px;"><tr><td width="50%" style="padding: 0 6px 0 0; vertical-align: top;"><div style="background: linear-gradient(135deg, #0a5c36 0%, #1a7d46 100%); border-radius: 12px; padding: 18px 20px; text-align: center; border: 1px solid rgba(255,255,255,0.15);"><p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">Get 10% off today</p><p style="color: rgba(255,255,255,0.95); font-size: 13px; margin: 8px 0 0; line-height: 1.5;">Test and activate Premium, Family or Business.</p><a href="https://www.yookatale.app/subscription" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #ffffff; color: #0a5c36; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Activate plan</a></div></td><td width="50%" style="padding: 0 0 0 6px; vertical-align: top;"><div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 18px 20px; text-align: center;"><p style="color: #92400e; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">Earn up to 50,000 in rewards</p><p style="color: #b45309; font-size: 13px; margin: 8px 0 0; line-height: 1.5;">Refer a friend to Yookatale — cash &amp; prizes.</p><a href="https://www.yookatale.app/#refer" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Invite a friend</a></div></td></tr></table>
        <p style="color: #111827; font-size: 15px; font-weight: 700; margin: 24px 0 12px; text-align: center; letter-spacing: 0.2px;">Your next steps — choose one</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px;"><tr><td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/signup" style="display: inline-block; padding: 8px 10px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/add-user-male.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Freely Signup</a></td><td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/subscription" style="display: inline-block; padding: 8px 10px; background-color: #185f2d; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Subscribe</a></td><td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/partner" style="display: inline-block; padding: 8px 10px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/handshake.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Partner with us</a></td><td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app/#refer" style="display: inline-block; padding: 8px 10px; background-color: #1a202c; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/gift.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Invite a friend</a></td><td align="center" width="20%" style="padding: 4px 2px; vertical-align: top;"><a href="https://www.yookatale.app" style="display: inline-block; padding: 8px 10px; background-color: #4b5563; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 12px; white-space: nowrap;"><img src="https://img.icons8.com/ios-filled/50/ffffff/shop.png" width="14" height="14" alt="" style="vertical-align: -2px; margin-right: 3px; border: 0;" />Visit marketplace</a></td></tr></table>
        <div style="background-color: #f9fafb; border-radius: 16px; padding: 24px; margin: 24px 0; border: 1px solid #e5e7eb;"><h3 style="color: #111827; font-size: 18px; font-weight: 700; margin: 0 0 10px; text-align: center;">🛒 Shop the Marketplace</h3><p style="color: #4b5563; font-size: 14px; margin: 0 0 16px; text-align: center;">Browse and order in minutes.</p><table width="100%" cellpadding="0" cellspacing="0"><tr><td width="50%" style="padding: 0 6px 12px 0; vertical-align: top;"><a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;"><div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><img src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&h=240&q=80" alt="Fresh vegetables" style="display: block; width: 100%; height: auto; border: 0;" /><div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Fresh Vegetables</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Handpicked daily.</p></div></div></a></td><td width="50%" style="padding: 0 0 12px 6px; vertical-align: top;"><a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;"><div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&h=240&q=80" alt="Organic fruits" style="display: block; width: 100%; height: auto; border: 0;" /><div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Organic Fruits</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Always fresh.</p></div></div></a></td></tr><tr><td width="50%" style="padding: 0 6px 0 0; vertical-align: top;"><a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;"><div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&h=240&q=80" alt="Ready meals" style="display: block; width: 100%; height: auto; border: 0;" /><div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Ready Meals</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Chef-prepared.</p></div></div></a></td><td width="50%" style="padding: 0 0 0 6px; vertical-align: top;"><a href="https://www.yookatale.app/marketplace" style="text-decoration: none; color: inherit;"><div style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"><img src="https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&h=240&q=80" alt="Pantry essentials" style="display: block; width: 100%; height: auto; border: 0;" /><div style="padding: 10px;"><p style="margin: 0; font-weight: 700; color: #111827; font-size: 14px;">Pantry Essentials</p><p style="margin: 4px 0 0; font-size: 12px; color: #4b5563;">Kitchen staples.</p></div></div></a></td></tr></table><div style="text-align: center; margin-top: 14px;"><a href="https://www.yookatale.app/marketplace" style="display: inline-block; padding: 10px 20px; background-color: #0a5c36; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Visit Marketplace</a></div></div>
        <div style="margin-top: 28px; padding: 24px; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding-bottom: 12px;"><img src="https://img.icons8.com/ios-filled/50/0a5c36/smartphone.png" alt="App" width="40" height="40" style="display: block; margin: 0 auto; border: 0;" /></td></tr><tr><td align="center"><p style="color: #0f172a; font-size: 17px; font-weight: 700; margin: 0 0 6px; letter-spacing: 0.2px;">Yookatale in your pocket</p><p style="color: #64748b; font-size: 14px; margin: 0 0 16px; line-height: 1.5;">Download the official app. Shop, subscribe, and track orders from your phone.</p><a href="https://play.google.com/store/apps/details?id=com.yookataleapp.app" style="text-decoration: none; display: inline-block;"><img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" width="180" style="display: block; border: 0; height: auto;" /></a></td></tr></table></div>
      </td>
    </tr>
  </table>

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #000000;">
    <tr>
      <td style="padding: 28px 20px; text-align: center; border-top: 2px solid #333333;">
        <p style="font-size: 12px; color: #9ca3af; margin: 0 0 12px 0;">
          <a href="https://www.facebook.com/profile.php?id=100094194942669&mibextid=LQQJ4d" style="color: #ffffff; text-decoration: none; margin: 0 6px;">Facebook</a>
          <span style="color: #6b7280;">|</span>
          <a href="https://twitter.com/YooKatale?t=3Q96I9JR98HgA69gisdXdA&s=09" style="color: #ffffff; text-decoration: none; margin: 0 6px;">Twitter</a>
          <span style="color: #6b7280;">|</span>
          <a href="https://www.instagram.com/p/CuHdaksN5UW/?igshid=NTc4MTIwNjQ2YQ==" style="color: #ffffff; text-decoration: none; margin: 0 6px;">Instagram</a>
          <span style="color: #6b7280;">|</span>
          <a href="https://www.linkedin.com/company/96071915/admin/feed/posts/" style="color: #ffffff; text-decoration: none; margin: 0 6px;">LinkedIn</a>
          <span style="color: #6b7280;">|</span>
          <a href="https://wa.me/256786118137" style="color: #ffffff; text-decoration: none; margin: 0 6px;">WhatsApp</a>
        </p>
        <p style="font-size: 13px; color: #9ca3af; margin: 0 0 8px 0; line-height: 1.6;">P.O. Box 74940 · Clock-Tower Plot 6, 27 Kampala · Entebbe, Uganda</p>
        <p style="font-size: 12px; color: #6b7280; margin: 12px 0 0 0;">© ${new Date().getFullYear()} YooKatale. All rights reserved.</p>
        <p style="font-size: 11px; color: #6b7280; margin: 14px 0 0 0;">You're receiving this because you subscribed to our newsletter.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;


// Invitation / Referral email template (invite a friend)
export const invitationEmailTemplate = `
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #000000;">
    <tr>
      <td style="padding: 36px 20px; text-align: center;">
        <img src="https://www.yookatale.app/assets/icons/logo2.png" alt="YooKatale Logo" style="max-width: 160px; height: auto; margin-bottom: 16px;" />
        <h1 style="font-size: 32px; color: #ffffff; margin: 0; font-weight: bold;">You're invited 🎉</h1>
        <p style="font-size: 17px; color: #e0f2fe; margin: 10px 0 0 0;">Join Yookatale — Yoo mobile food market</p>
      </td>
    </tr>
  </table>

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 36px 28px;">
        <p style="font-size: 16px; color: #374151; line-height: 1.7; margin: 0 0 24px 0;">A friend invited you to Yookatale. Subscribe <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> — monthly or annually. Get meals delivered to your doorstep.</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 24px;"><tr><td align="center" width="33%" style="padding: 0 8px;"><div style="background-color: #eef2ff; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;"><img src="https://img.icons8.com/ios-filled/50/1f2937/delivery.png" alt="Fast delivery" width="28" height="28" style="vertical-align: middle; border: 0;" /></div><p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🚚 Fast Delivery</p></td><td align="center" width="33%" style="padding: 0 8px;"><div style="background-color: #ecfdf5; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;"><img src="https://img.icons8.com/ios-filled/50/1f2937/leaf.png" alt="Organic" width="28" height="28" style="vertical-align: middle; border: 0;" /></div><p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🌿 100% Organic</p></td><td align="center" width="33%" style="padding: 0 8px;"><div style="background-color: #fff7ed; width: 56px; height: 56px; border-radius: 50%; line-height: 56px; margin: 0 auto 10px; text-align: center;"><img src="https://img.icons8.com/ios-filled/50/1f2937/meal.png" alt="Custom meals" width="28" height="28" style="vertical-align: middle; border: 0;" /></div><p style="color: #111827; font-size: 13px; font-weight: 600; margin: 0;">🍽️ Custom Meals</p></td></tr></table>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 28px;"><tr><td width="50%" style="padding: 0 6px 0 0; vertical-align: top;"><div style="background: linear-gradient(135deg, #0a5c36 0%, #1a7d46 100%); border-radius: 12px; padding: 18px 20px; text-align: center; border: 1px solid rgba(255,255,255,0.15);"><p style="color: #ffffff; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">Get 10% off today</p><p style="color: rgba(255,255,255,0.95); font-size: 13px; margin: 8px 0 0; line-height: 1.5;">Test and activate Premium, Family or Business.</p><a href="https://www.yookatale.app/subscription" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #ffffff; color: #0a5c36; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Activate plan</a></div></td><td width="50%" style="padding: 0 0 0 6px; vertical-align: top;"><div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px; padding: 18px 20px; text-align: center;"><p style="color: #92400e; font-size: 15px; font-weight: 700; margin: 0; letter-spacing: 0.3px;">Earn up to 50,000 in rewards</p><p style="color: #b45309; font-size: 13px; margin: 8px 0 0; line-height: 1.5;">Refer a friend to Yookatale — cash &amp; prizes.</p><a href="https://www.yookatale.app/#refer" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background-color: #f59e0b; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 13px;">Invite a friend</a></div></td></tr></table>
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
          <h3 style="color: #111827; font-size: 14px; font-weight: 700; margin: 0 0 8px; text-align: center;">Explore Yookatale app — subscribe, shop, and earn</h3>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td width="50%" style="padding: 0 4px 0 0; vertical-align: top;">
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                  <img src="https://www.yookatale.app/assets/images/app-homepage-new.png" alt="Homepage" style="display: block; width: 100%; height: auto; border: 0; max-height: 300px; object-fit: contain;" />
                  <div style="padding: 8px;"><p style="margin: 0; font-weight: 600; color: #111827; font-size: 11px;">Homepage</p></div>
                </div>
              </td>
              <td width="50%" style="padding: 0 0 0 4px; vertical-align: top;">
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                  <a href="https://www.yookatale.app/#refer" style="text-decoration: none; color: inherit; display: block;">
                    <img src="https://www.yookatale.app/assets/images/app-invite-rewards.png" alt="Earn after inviting" style="display: block; width: 100%; height: auto; border: 0; max-height: 300px; object-fit: contain;" />
                    <div style="padding: 8px;"><p style="margin: 0; font-weight: 600; color: #111827; font-size: 11px;">Earn after inviting</p></div>
                  </a>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 8px 0 0 0;">
                <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
                  <img src="https://www.yookatale.app/assets/images/app-subscription-plans.png" alt="Subscription Plans" style="display: block; width: 100%; height: auto; border: 0; max-height: 400px; object-fit: contain;" />
                  <div style="padding: 8px;"><p style="margin: 0; font-weight: 600; color: #111827; font-size: 11px;">Subscription plans</p></div>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 16px; padding: 14px; background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #0f172a; font-size: 13px; font-weight: 700; margin: 0 0 4px;">Yookatale in your pocket</p>
          <p style="color: #64748b; font-size: 11px; margin: 0 0 10px; line-height: 1.4;">Download the official app. Shop, subscribe, and track orders from your phone.</p>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 auto;">
            <tr>
              <td align="center" style="padding: 0 6px;">
                <a href="https://www.yookatale.app/subscription" style="text-decoration: none; display: inline-block;">
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
        </div>
      </td>
    </tr>
  </table>

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #111827;">
    <tr>
      <td style="padding: 20px 18px; border-radius: 0 0 12px 12px;">
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
          <p style="color: rgba(255, 255, 255, 0.6); font-size: 9px; margin: 0;">You're receiving this because a friend invited you to Yookatale. <a href="https://www.yookatale.app" style="color: rgba(255, 255, 255, 0.85); text-decoration: underline;">Unsubscribe</a></p>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const partneremailNotification = `
<html lang="en">
<head>
</head>
<body style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, backgroundColor: '#f4f4f4' }}>

  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: '600px', margin: 'auto', backgroundColor: '#ffffff' }}>
    <tr>
      <td style={{ padding: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#333333', textAlign: 'center' }}>Dear Partner</h1>
        <p style={{ fontSize: '16px', color: '#777777', textAlign: 'center' }}>A new order has been created. If you're a vendor, see if your producs are selling.
        And if you're a delivery agent, login to grab some deliveries and get some more cash.</p>
      </td>
    </tr>
  </table>


  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: '600px', margin: 'auto', backgroundColor: '#ffffff' }}>
    <tr>
      <td style={{ padding: '20px' }}>
        <p style={{ fontSize: '18px', color: '#333333' }}>Thank you for subscribing to the Yookatale newsletter.</p>
        <a href="[Link to Article]" style={{ display: 'block', marginTop: '20px', textDecoration: 'none', color: '#007bff' }}>[ Decoding 4000 years of the pamagmante fruit]</a>
   
        <img src="[Image URL]" alt="Article Image" style={{ maxWidth: '100%', marginTop: '20px' }} />
        <p style={{ fontSize: '18px', color: '#333333' }}>Forget About Going to the Market</p>
        <a href="[Link to YooKatale Premium]" style={{ display: 'inline-block', padding: '10px 20px', backgroundColor: '#007bff', color: '#ffffff', textDecoration: 'none', borderRadius: '5px' }}>Get YooKatale Premium</a>
      </td>
    </tr>
  </table>


  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: '600px', margin: 'auto', backgroundColor: '#ffffff' }}>
    <tr>
      <td style={{ padding: '20px' }}>
          <img src="https://www.yookatale.com/assets/images/1.jpg" alt="Avert Poster" style={{maxWidth: '100%'}}/>
      </td>
    </tr>
  </table>


  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style={{ maxWidth: '600px', margin: 'auto', backgroundColor: '#f4f4f4' }}>
    <tr>
      <td style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', color: '#777777' }}>&copy; ${new Date().getFullYear()} Yookatale. All rights reserved.</p>
      </td>
    </tr>
  </table>

</body>
</html>
`;

// Recent emails list for mail functionality
export const recentEmails = [
  "abenakyonaomi@gmail.com",
  "aggy0703@yahoo.com",
  "akibric@gmail.com",
  "anywar234@gmail.com",
  "asaphnuwagaba183@gmail.com",
  "atwineflavia@outlook.com",
  "ayikorujoan1629@gmail.com",
  "batwagainenasser@gmail.com",
  "birungilisa101@gmail.com",
  "blessingkasiita256@gmail.com",
  "brian.raymond1@gmail.com",
  "bridgetangel289@gmail.com",
  "calebkamana626@gmail.com",
  "catherinenamungoma2@gmail.com",
  "ceaserssekimpi4@gmail.com",
  "chukwunenyeemmanuelokoro@gmail.com",
  "cindypirani@gmail.com",
  "derrickkirabo2333@gmail.com",
  "derricksupreme05@gmail.com",
  "dnalubaale@gmail.com",
  "edinaatuhura2@gmail.com",
  "elizabethnassolo52@gmail.com",
  "emmawebusa@gmail.com",
  "esumaisaac3@gmail.com",
  "fibiyiga@gmail.com",
  "giramiakevin08@gmail.com",
  "gloriaapio575@gmail.com",
  "hello@unitedsocialventures.org",
  "hiraxjosh016@gmail.com",
  "hunrikky@gmail.com",
  "ivanoede18@gmail.com",
  "joramwanderas@gmail.com",
  "joramyiga@gmail.com",
  "juniorbromy@gmail.com",
  "lex.alek@gmail.com",
  "lubegajoel54@gmail.com",
  "masigaemmanuel67@gmail.com",
  "maxmaya542@gmail.com",
  "morynchadhash@gmail.com",
  "muhiirwemo@gmail.com",
  "muwanguziemmanuel890@gmail.com",
  "mwakaronald5@gmail.com",
  "naluggwapauline@gmail.com",
  "namalejosephine16@gmail.com",
  "namatovugidha@gmail.com",
  "nambozosharon21@gmail.com",
  "nantegeruth@gmail.com",
  "naomeaguti3@gmail.com",
  "natashasarah720@gmail.com",
  "nenakitende@gmail.com",
  "nickrogers793@gmail.com",
  "nkinzie9000@gmail.com",
  "nmwajjuma@gmail.com",
  "nr116563@students.cavendish.ac.ug",
  "ocularonnie@gmail.com",
  "olukasamuel557@gmail.com",
  "orishabajustine58@gmail.com",
  "Packsjesse@gmail.com",
  "pamela.namara025@gmail.com",
  "peruthnamugaya@gmail.com",
  "phionanamuyaba2000@gmail.com",
  "pridelagum@gmail.com",
  "ramah.cher82@gmail.com",
  "rndagire1402@gmail.com",
  "rossettetrisa@gmail.com",
  "ruthkalembe@yahoo.com",
  "samanthabarbra6@gmail.com",
  "samuelesterban@gmail.com",
  "starkshoward00@gmail.com",
  "tashajulian803@gmail.com",
  "tracybarie@gmail.com",
  "tumusiimed319@gmail.com",
  "valentinalceaser@gmail.com",
  "winnieamanda2015@gmail.com",
];
