import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const followApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    followSeller: builder.mutation({
      query: (sellerId) => ({
        url: `${DB_URL}/seller/follow`,
        method: "POST",
        body: { sellerId },
        credentials: "include",
      }),
    }),
    unfollowSeller: builder.mutation({
      query: (sellerId) => ({
        url: `${DB_URL}/seller/follow/${sellerId}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    getFollowersCount: builder.query({
      query: (sellerId) => ({
        url: `${DB_URL}/seller/followers/${sellerId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    isFollowing: builder.query({
      query: (sellerId) => ({
        url: `${DB_URL}/seller/follow/check/${sellerId}`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => {
        if (response?.status === "Success") {
          return { data: response.data || false };
        }
        return { data: false };
      },
    }),
  }),
});

export const {
  useFollowSellerMutation,
  useUnfollowSellerMutation,
  useGetFollowersCountQuery,
  useIsFollowingQuery,
} = followApiSlice;
