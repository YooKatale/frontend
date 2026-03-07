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

/** Get user avatar URL from user object (handles avatar, profilePic, profile_pic, picture for Google). */
export function getUserAvatarUrl(user) {
  if (!user || typeof user !== "object") return undefined;
  const url = user.avatar || user.profilePic || user.profile_pic || user.profileImage || user.picture || user.photoURL;
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

import { getEmailLayout } from "./emailLayout";

// Welcome email template for new signups (new dark UI)
const welcomeBody = `
  <p class="intro">Switch to a new shopping style this new year. Forget about cooking or going to the market — subscribe for our <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> Plan monthly or annually. Get everything delivered at your doorstep.</p>
  <p class="intro">Discover and customize your meals, set when and where to eat with friends, family and loved ones. Earn loyalty points, credit points, gifts and discounts.</p>
  <p style="text-align:center;margin-top:24px;"><a href="https://www.yookatale.app/signup" class="body-btn">Sign up</a> <a href="https://www.yookatale.app/subscription" class="body-btn" style="background:#f59e0b;color:#1c0f00;margin-left:8px;">Subscribe</a></p>
`;
export const emailTemplate = getEmailLayout({ pageTitle: "Welcome to Yookatale", headerTitle: "Welcome to Yookatale", headerSub: "Yoo mobile food market", bodyHtml: welcomeBody });

// Newsletter email template (new dark UI)
const newsletterBody = `
  <p class="intro">Welcome to Yookatale — Yoo mobile food market. Subscribe <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> monthly or annually. Get everything delivered to your doorstep.</p>
  <p style="text-align:center;margin-top:24px;"><a href="https://www.yookatale.app/subscription" class="body-btn">View plans</a></p>
`;
export const newsletterEmailTemplate = getEmailLayout({ pageTitle: "YooKatale Newsletter", headerTitle: "YooKatale Newsletter", headerSub: "Stay updated with news & offers", bodyHtml: newsletterBody });


// Invitation / Referral email template (new dark UI)
const invitationBody = `
  <p class="intro">A friend invited you to Yookatale. Subscribe <strong>Freemium</strong>, <strong>Premium</strong>, <strong>Family</strong> or <strong>Business</strong> — monthly or annually. Get meals delivered to your doorstep.</p>
  <p style="text-align:center;margin-top:24px;"><a href="https://www.yookatale.app/signup" class="body-btn">Sign up now</a></p>
`;
export const invitationEmailTemplate = getEmailLayout({ pageTitle: "You're invited – Yookatale", headerTitle: "You're invited", headerSub: "Join Yookatale — Yoo mobile food market", bodyHtml: invitationBody });

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
