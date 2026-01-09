// "use client";
import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    productsGet: builder.mutation({
      query: () => ({
        url: `${DB_URL}/products`,
        method: "GET",
      }),
    }),
    productCreate: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/product/new`,
        method: "POST",
        body: data,
      }),
    }),
    productGet: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/product/${data}`,
        method: "GET",
      }),
    }),
    productsCategoryGet: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/${data}`,
        method: "GET",
      }),
    }),
    productsCategoriesGet: builder.mutation({
      query: () => ({
        url: `${DB_URL.replace('/api', '')}/api/categories`,
        method: "GET",
      }),
    }),
    productsFilterGet: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/filter/${data}`,
        method: "GET",
      }),
    }),
    cartCreate: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/product/cart`,
        method: "POST",
        body: data,
      }),
    }),
    cart: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/product/cart/${data}`,
        method: "GET",
      }),
    }),
    cartDelete: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/product/cart/${data}`,
        method: "DELETE",
      }),
    }),
    cartUpdate: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/product/cart/${data.cartId}`,
        method: "PUT",
        body: {
          quantity: data.quantity,
          userId: data.userId,
        },
      }),
    }),
    cartCheckout: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/cart/checkout`,
        method: "POST",
        body: data,
      }),
    }),
    search: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/search/${data}`,
        method: "GET",
      }),
    }),
    newSchedule: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/schedule`,
        method: "POST",
        body: data,
      }),
    }),
    order: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/order/${data}`,
        method: "GET",
      }),
    }),
    orders: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/orders/${data}`,
        method: "GET",
      }),
    }),
    orderUpdate: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/order`,
        method: "PUT",
        body: data,
      }),
    }),
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/coupon/validate`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useProductsCategoryGetMutation,
  useProductsGetMutation,
  useProductGetMutation,
  useProductsFilterGetMutation,
  useProductCreateMutation,
  useCartCreateMutation,
  useCartMutation,
  useCartDeleteMutation,
  useCartUpdateMutation,
  useSearchMutation,
  useNewScheduleMutation,
  useOrdersMutation,
  useProductsCategoriesGetMutation,
  useOrderMutation,
  useOrderUpdateMutation,
  useCartCheckoutMutation,
  useValidateCouponMutation,
} = productsApiSlice;
