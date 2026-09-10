const PROD_DB_URL = "/server-api"; // proxied through Vercel → Render (no CORS)

export const DB_URL = process.env.NEXT_PUBLIC_API_URL || PROD_DB_URL;

/** Base origin of the real API server. Used for Google OAuth redirect (must be absolute). */
export const API_ORIGIN =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_ORIGIN) ||
  "https://yookatale-server.onrender.com";
