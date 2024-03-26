import { apiSlice } from "./apiSlice"; 
import { DB_URL } from "@config/config"; 

export const deliveryFormSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    submitDeliveryForm: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/partner/new`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSubmitDeliveryFormMutation } = deliveryFormSlice;
