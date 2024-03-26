import { apiSlice } from "./apiSlice"; 
import { DB_URL } from "@config/config"; 

export const vendorSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerVendor: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/vendor/new`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useRegisterVendorMutation } = vendorSlice;
