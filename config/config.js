const PROD_DB_URL = "https://yookatale-server.onrender.com/api";
const DEV_DB_URL = "http://localhost:8000/api";

export const DB_URL = PROD_DB_URL;

/** Base origin of the API (no /api). Used for Google OAuth redirect. */
export const API_ORIGIN =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_ORIGIN) ||
  (DB_URL || "").replace(/\/api\/?$/, "") ||
  "https://yookatale-server.onrender.com";
