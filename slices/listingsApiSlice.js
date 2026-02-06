import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const listingsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyListings: builder.query({
      query: () => ({
        url: `${DB_URL}/listings`,
        method: "GET",
        credentials: "include",
      }),
    }),
    createListing: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/listings`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getListing: builder.query({
      query: (id) => ({
        url: `${DB_URL}/listings/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateListing: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${DB_URL}/listings/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteListing: builder.mutation({
      query: (id) => ({
        url: `${DB_URL}/listings/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetMyListingsQuery,
  useCreateListingMutation,
  useGetListingQuery,
  useUpdateListingMutation,
  useDeleteListingMutation,
} = listingsApiSlice;
