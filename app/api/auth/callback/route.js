import { NextResponse } from "next/server";

/**
 * Backend can redirect here after Google OAuth with token in the URL.
 * This route redirects the browser to /signin with the same params so the
 * frontend can store the token and work on all devices (no cookie required).
 *
 * Backend redirect to: https://your-frontend.com/api/auth/callback?token=JWT&redirect=/
 * We redirect to:      https://your-frontend.com/signin?token=JWT&redirect=/
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") ?? searchParams.get("access_token") ?? searchParams.get("accessToken") ?? searchParams.get("jwt");
  const redirect = searchParams.get("redirect") ?? searchParams.get("returnUrl") ?? "/";
  const user = searchParams.get("user");

  const base = request.nextUrl.origin;
  const params = new URLSearchParams();
  if (token) params.set("token", token);
  if (user) params.set("user", user);
  params.set("redirect", redirect);

  const signinUrl = `${base}/signin?${params.toString()}`;
  return NextResponse.redirect(signinUrl);
}
