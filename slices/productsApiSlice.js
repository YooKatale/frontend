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
    ordersMe: builder.query({
      query: () => ({
        url: `${DB_URL}/orders/me`,
        method: "GET",
      }),
      transformResponse: (res) => (res?.status === "Success" ? res.data : []),
    }),
    cancelOrder: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: `${DB_URL}/orders/${orderId}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
    }),
    deleteOrderFromHistory: builder.mutation({
      query: ({ orderId }) => ({
        url: `${DB_URL}/orders/${orderId}/me-delete`,
        method: "DELETE",
      }),
    }),
    orderTracking: builder.query({
      query: ({ orderId }) => ({
        url: `${DB_URL}/delivery/order/${orderId}`,
        method: "GET",
      }),
      transformResponse: (res) => (res?.status === "Success" ? res.data : {}),
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
    getCountryCuisines: builder.query({
      query: () => ({ url: `${DB_URL.replace(/\/api\/?$/, "")}/api/country-cuisines`, method: "GET" }),
    }),
    getCountryCuisineByCode: builder.query({
      query: (code) => ({ url: `${DB_URL.replace(/\/api\/?$/, "")}/api/country-cuisines/${encodeURIComponent(code)}`, method: "GET" }),
    }),
    getHomepageConfig: builder.query({
      query: () => ({ url: `${DB_URL.replace(/\/api\/?$/, "")}/api/homepage-config`, method: "GET" }),
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
  useOrdersMeQuery,
  useProductsCategoriesGetMutation,
  useOrderMutation,
  useOrderUpdateMutation,
  useCancelOrderMutation,
  useDeleteOrderFromHistoryMutation,
  useOrderTrackingQuery,
  useCartCheckoutMutation,
  useValidateCouponMutation,
  useGetCountryCuisinesQuery,
  useGetCountryCuisineByCodeQuery,
  useGetHomepageConfigQuery,
} = productsApiSlice;
