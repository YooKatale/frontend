import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const locationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLocations: builder.query({
      query: ({ region, district, q } = {}) => {
        const params = new URLSearchParams();
        if (region) params.set("region", region);
        if (district) params.set("district", district);
        if (q) params.set("q", q);
        const queryString = params.toString();
        return {
          url: `${DB_URL}/locations${queryString ? `?${queryString}` : ""}`,
          method: "GET",
          credentials: "include",
        };
      },
    }),
  }),
});

export const { useGetLocationsQuery } = locationsApiSlice;
