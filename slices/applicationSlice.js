import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const applicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    jobApplication: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/careers/apply`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {useJobApplicationMutation} = applicationApiSlice;
