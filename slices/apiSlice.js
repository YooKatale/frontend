import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DB_URL, API_ORIGIN } from "@config/config";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/",
  credentials: "include",
});

// Use actual API_ORIGIN for backend detection (e.g., https://yookatale-server.onrender.com)
const BACKEND_ORIGIN = API_ORIGIN || "https://yookatale-server.onrender.com";

/** Use full URL as-is when endpoint url is absolute. For backend URLs, always send Authorization Bearer token from store so auth works on all devices (not just cookie). */
function baseQueryWithAbsoluteUrl(args, api, extraOptions) {
  const url = typeof args?.url === "string" ? args.url : args?.url?.url;
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    const isBackend = url.startsWith(BACKEND_ORIGIN);
    return fetchBaseQuery({
      baseUrl: "",
      credentials: "include",
      prepareHeaders: (headers, { getState }) => {
        if (isBackend) {
          const token = getState()?.auth?.userInfo?.token ?? getState()?.auth?.userInfo?.accessToken;
          if (token) headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    })({ ...args, url }, api, extraOptions);
  }
  return rawBaseQuery(args, api, extraOptions);
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAbsoluteUrl,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
