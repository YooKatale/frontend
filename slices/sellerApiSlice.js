import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const sellerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSellerProfile: builder.query({
      query: () => ({
        url: `${DB_URL}/seller/me`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateSellerProfile: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/seller/me`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    getSellerPerformance: builder.query({
      query: () => ({
        url: `${DB_URL}/seller/me/performance`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getSellerOrders: builder.query({
      query: () => ({
        url: `${DB_URL}/seller/orders`,
        method: "GET",
        credentials: "include",
      }),
    }),
    lastSeen: builder.mutation({
      query: () => ({
        url: `${DB_URL}/seller/me/last-seen`,
        method: "PATCH",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetSellerProfileQuery,
  useUpdateSellerProfileMutation,
  useGetSellerPerformanceQuery,
  useGetSellerOrdersQuery,
  useLastSeenMutation,
} = sellerApiSlice;
