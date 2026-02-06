import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const ratingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createSellerRating: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/seller/ratings`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getSellerRatings: builder.query({
      query: ({ sellerId, page = 1, limit = 20 }) => ({
        url: `${DB_URL}/seller/ratings/${sellerId}?page=${page}&limit=${limit}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getSellerRatingStats: builder.query({
      query: (sellerId) => ({
        url: `${DB_URL}/seller/ratings/${sellerId}?page=1&limit=1`,
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response) => {
        if (response?.status === "Success") {
          return {
            averageRating: response.data?.averageRating || 0,
            ratingCount: response.data?.ratingCount || 0,
          };
        }
        return { averageRating: 0, ratingCount: 0 };
      },
    }),
  }),
});

export const {
  useCreateSellerRatingMutation,
  useGetSellerRatingsQuery,
  useGetSellerRatingStatsQuery,
} = ratingsApiSlice;
