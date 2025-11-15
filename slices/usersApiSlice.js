// "use client";

import { apiSlice } from "./apiSlice";
import { DB_URL } from "@config/config";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/users/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        // url: `${DB_URL}/users/register`, // no /users/register route in backend
        url: `${DB_URL}/register`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${DB_URL}/users/logout`,
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
        url: `${DB_URL}/subscription/package`,
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
} = usersApiSlice;
