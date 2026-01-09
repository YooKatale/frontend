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
    productCommentsGet: builder.mutation({
      query: (productId) => ({
        url: `${DB_URL}/products/${productId}/comments`,
        method: "GET",
      }),
    }),
    commentCreate: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/comment`,
        method: "POST",
        body: data,
      }),
    }),
    ratingCreate: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/products/rating`,
        method: "POST",
        body: data,
      }),
    }),
    appRatingCreate: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/ratings/app`,
        method: "POST",
        body: data,
      }),
    }),
    platformFeedbackCreate: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/ratings/platform`,
        method: "POST",
        body: data,
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
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/auth/forgot-password/`,
        method: "PUT",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/auth/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    createReferralCode: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/referralCode`,
        method: "POST",
        body: data,
      }),
    }),
    sendReferralEmail: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/sendReferralEmail`,
        method: "POST",
        body: data,
      }),
    }),
    sendWelcomeEmail: builder.mutation({
      query: (data) => {
        // Build payload - structure must be DIFFERENT from invitation
        const emailType = data.type || 'welcome';
        const isInvitation = emailType === 'invitation' || !emailType;
        
        const payload = {
          email: data.email,
          emailType: emailType, // 'welcome', 'newsletter', or 'meal_notification'
          subject: data.subject, // REQUIRED - email subject
          html: data.html, // REQUIRED - email HTML template
          template: data.html, // ALTERNATIVE: Some backends use 'template' instead of 'html'
          emailBody: data.html, // ALTERNATIVE: Some backends use 'emailBody'
          message: data.html, // ALTERNATIVE: Some backends use 'message'
          // EXPLICIT FLAGS: Backend must check these to use custom template instead of invitation
          useCustomTemplate: !isInvitation, // true for welcome, newsletter, meal_notification
          customTemplate: !isInvitation, // Alternative flag name
          isNotification: !isInvitation, // This is NOT an invitation
          // Additional fields for meal notifications
          userName: data.userName || null,
          mealType: data.mealType || null,
          meals: data.meals || null,
        };
        
        // CRITICAL: ONLY include referralCode if it's actually an invitation
        // Backend uses invitation template if referralCode exists, so DO NOT include it for other types
        if (data.referralCode && isInvitation) {
          payload.referralCode = data.referralCode;
        }
        // DO NOT include referralCode field at all for non-invitations
        // Including it (even as null) might make backend think it's an invitation
        
        return {
          url: `${DB_URL}/sendReferralEmail`,
          method: "POST",
          body: payload,
        };
      },
    }),
    sendMealNotificationEmail: builder.mutation({
      query: (data) => ({
        url: `${DB_URL}/sendMealNotificationEmail`,
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
  useProductCommentsGetMutation,
  useCommentCreateMutation,
  useRatingCreateMutation,
  useAppRatingCreateMutation,
  usePlatformFeedbackCreateMutation,
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
  useCreateReferralCodeMutation,
  useSendReferralEmailMutation,
  useSendWelcomeEmailMutation,
  useSendMealNotificationEmailMutation
} = usersApiSlice;
