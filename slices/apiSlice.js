"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/",
  credentials: "include",
});

/** Use full URL as-is when endpoint url is absolute (e.g. auth to external API). */
function baseQueryWithAbsoluteUrl(args, api, extraOptions) {
  const url = typeof args?.url === "string" ? args.url : args?.url?.url;
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    return fetchBaseQuery({ baseUrl: "", credentials: "include" })({ ...args, url }, api, extraOptions);
  }
  return rawBaseQuery(args, api, extraOptions);
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAbsoluteUrl,
  tagTypes: ["User"],
  endpoints: (builder) => ({}),
});
