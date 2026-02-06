import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const storesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyStores: builder.query({
      query: () => ({
        url: `${DB_URL}/stores`,
        method: "GET",
        credentials: "include",
      }),
    }),
    createStore: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/stores`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    getStore: builder.query({
      query: (id) => ({
        url: `${DB_URL}/stores/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateStore: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${DB_URL}/stores/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `${DB_URL}/stores/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetMyStoresQuery,
  useCreateStoreMutation,
  useGetStoreQuery,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
} = storesApiSlice;
