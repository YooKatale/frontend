"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAuth } from "@slices/authSlice";
import { setCredentials } from "@slices/authSlice";
import { SignUpForm, Bg } from "@components/AuthUI";

const AUTH_PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100dvh}
body{font-family:'Nunito',sans-serif;-webkit-font-smoothing:antialiased;background:#edf5ed}
button,input,select{font-family:'Nunito',sans-serif}
.wrap-auth{min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px 16px;position:relative;z-index:1}
`;

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { userInfo } = useAuth();

  useEffect(() => {
    const token = searchParams?.get("token");
    const user = searchParams?.get("user");
    if (token || user) {
      try {
        const data = user ? JSON.parse(decodeURIComponent(user)) : { token };
        if (data?.token != null || data?._id != null) {
          dispatch(setCredentials(data));
          window.history.replaceState({}, "", window.location.pathname);
          router.replace("/");
        }
      } catch (_) {}
    }
  }, [searchParams, dispatch, router]);

  useEffect(() => {
    if (userInfo && typeof userInfo === "object" && Object.keys(userInfo).length > 0) {
      router.replace("/");
    }
  }, [userInfo, router]);

  return (
    <>
      <style>{AUTH_PAGE_CSS}</style>
      <Bg />
      <div className="wrap-auth">
        <SignUpForm
          onSuccess={() => router.replace("/")}
          onSwitch={() => router.push("/signin")}
        />
      </div>
    </>
  );
}
