// DEPRECATED: This route has been replaced with backend API calls
// Meal notification emails now use the backend API (same as invitation emails)
// See: sendMealNotificationEmail mutation in usersApiSlice
//
// The mealNotificationService now calls the backend API directly:
// ${DB_URL}/sendMealNotificationEmail

import { NextResponse } from "next/server";

export const POST = async (req) => {
  return NextResponse.json(
    { 
      error: "This endpoint is deprecated. Please use backend API endpoint instead.",
      message: "Meal notification email sending has been moved to backend API. Use sendMealNotificationEmail mutation."
    },
    { status: 410 } // Gone - resource is no longer available
  );
};
