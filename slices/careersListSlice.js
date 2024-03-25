import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const CareersApliSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCareers: builder.mutation({
      query: () => ({
        url: `${DB_URL}/careers`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCareersMutation } = CareersApliSlice;
