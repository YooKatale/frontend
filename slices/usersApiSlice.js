import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/auth/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/auth/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${DB_URL}/auth/logout`,
        method: "POST",
      }),
    }),
    commentsGet: builder.mutation({
      query: () => ({
        url: `${DB_URL}/users/comments`,
        method: "GET",
      }),
    }),
    subscriptionPackageGet: builder.mutation({
      query: () => ({
        url: `${DB_URL}/subscription/package/get`,
        method: "GET",
      }),
    }),
    subscriptionPost: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/subscription`,
        method: "POST",
        body: data,
      }),
    }),
    messagePost: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/message`,
        method: "POST",
        body: data,
      }),
    }),
    blogsFetch: builder.mutation({
      query: () => ({
        url: `${DB_URL}/newsblogs`,
        method: "GET",
      }),
    }),
    blogFetch: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/newsblog/${data}`,
        method: "GET",
      }),
    }),
    newsletterPost: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/newsletter`,
        method: "POST",
        body: data,
      }),
    }),
    partnerPost: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/partner/new`,
        method: "POST",
        body: data,
      }),
    }),
    newsArticlesFetch: builder.mutation({
      query: () => ({
        url: `${DB_URL}/newsarticles`,
        method: "GET",
      }),
    }),
    newsArticleFetch: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/newsarticle/${data}`,
        method: "GET",
      }),
    }),
    advertisementPackageGet: builder.mutation({
      query: () => ({
        url: `${DB_URL}/advertisement/packages`,
        method: "GET",
      }),
    }),
    advertisementPost: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/advertisement`,
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({ // Move forgotPassword mutation outside advertisementPost
      query: (data) => ({
        url: `${DB_URL}/auth/forgot-password`,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/auth/reset-password`, // Adjust the URL as per your server API
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useCommentsGetMutation,
  useSubscriptionPackageGetMutation,
  useSubscriptionPostMutation,
  useMessagePostMutation,
  useBlogFetchMutation,
  useBlogsFetchMutation,
  useNewsletterPostMutation,
  usePartnerPostMutation,
  useNewsArticlesFetchMutation,
  useNewsArticleFetchMutation,
  useAdvertisementPackageGetMutation,
  useAdvertisementPostMutation,
  useForgotPasswordMutation, 
  useResetPasswordMutation,
} = usersApiSlice;
