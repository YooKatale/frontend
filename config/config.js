const PROD_DB_URL = "/server-api"; // proxied through Vercel → Render (no CORS)
const DEV_DB_URL = "http://localhost:8000/api";

export const DB_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? DEV_DB_URL : PROD_DB_URL);

/** Base origin of the real API server. Used for Google OAuth redirect (must be absolute). */
export const API_ORIGIN =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_ORIGIN) ||
  "https://yookatale-server.onrender.com";
