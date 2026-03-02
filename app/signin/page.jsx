"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAuth } from "@slices/authSlice";
import { setCredentials } from "@slices/authSlice";
import { SignInForm, Bg } from "@components/AuthUI";
import { DB_URL } from "@config/config";

const AUTH_PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100dvh}
body{font-family:'Nunito',sans-serif;-webkit-font-smoothing:antialiased;background:#edf5ed}
button,input,select{font-family:'Nunito',sans-serif}
.wrap-auth{min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px 16px;position:relative;z-index:1}
`;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { userInfo } = useAuth();

  useEffect(() => {
    const q = searchParams;
    const tokenFromQuery = q?.get("token") ?? q?.get("access_token") ?? q?.get("accessToken");
    const userParam = q?.get("user");
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const tokenFromHash = hash ? (hash.match(/[#&]access_token=([^&]+)/) || [])[1] : null;
    const token = tokenFromQuery || tokenFromHash;
    const googleCallback = q?.get("google_callback") === "1" || q?.get("google_callback") === "true";

    if (token || userParam) {
      (async () => {
        try {
          let data = {};
          if (userParam) {
            try {
              data = JSON.parse(decodeURIComponent(userParam));
            } catch (_) {}
          }
          if (token) data = { ...data, token };
          if (!data?.token && !data?.accessToken) data.token = token;
          if (data?.token != null || data?._id != null || data?.id != null) {
            dispatch(setCredentials(data));
            const t = data?.token ?? data?.accessToken;
            if (t) {
              try {
                const base = DB_URL.replace(/\/api\/?$/, "");
                const res = await fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${t}` }, credentials: "include" });
                const json = await res.json().catch(() => ({}));
                const fullUser = json?.data ?? json?.user ?? json;
                if (fullUser && (fullUser._id || fullUser.id)) dispatch(setCredentials({ ...data, ...fullUser }));
              } catch (_) {}
            }
            let returnUrl = q?.get("returnUrl") || q?.get("redirect") || "/";
            try { returnUrl = decodeURIComponent(returnUrl); } catch (_) {}
            if (!returnUrl.startsWith("/")) returnUrl = "/";
            window.history.replaceState({}, "", window.location.pathname);
            router.replace(returnUrl);
          }
        } catch (_) {}
      })();
      return;
    }

    if (googleCallback && !token && !userParam) {
      (async () => {
        try {
          const base = DB_URL.replace(/\/api\/?$/, "");
          const res = await fetch(`${base}/api/auth/me`, { credentials: "include" });
          const json = await res.json().catch(() => ({}));
          const user = json?.data ?? json?.user ?? json;
          const tokenFromMe = json?.token ?? json?.data?.token ?? user?.token;
          if ((user && (user._id || user.id)) || tokenFromMe) {
            dispatch(setCredentials({ ...user, token: tokenFromMe ?? user?.token }));
            let returnUrl = q?.get("redirect") || q?.get("returnUrl") || "/";
            try { returnUrl = decodeURIComponent(returnUrl); } catch (_) {}
            if (!returnUrl.startsWith("/")) returnUrl = "/";
            window.history.replaceState({}, "", window.location.pathname);
            router.replace(returnUrl);
          }
        } catch (_) {}
      })();
    }
  }, [searchParams, dispatch, router]);

  useEffect(() => {
    if (searchParams?.get("token") || searchParams?.get("user") || searchParams?.get("access_token") || searchParams?.get("accessToken")) return;
    if (userInfo && typeof userInfo === "object" && Object.keys(userInfo).length > 0) {
      let returnUrl = searchParams?.get("returnUrl") || searchParams?.get("redirect") || "/";
      try { returnUrl = decodeURIComponent(returnUrl); } catch (_) {}
      router.replace(returnUrl.startsWith("/") ? returnUrl : "/");
    }
  }, [userInfo, router, searchParams]);

  const isGoogleCallback = searchParams?.get("google_callback") === "1" || searchParams?.get("google_callback") === "true";
  const hasAuthParams = searchParams?.get("token") || searchParams?.get("user") || searchParams?.get("access_token");

  return (
    <>
      <style>{AUTH_PAGE_CSS}</style>
      <Bg />
      <div className="wrap-auth">
        {isGoogleCallback && !hasAuthParams ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#1a5c1a", marginBottom: 8 }}>Completing sign in…</p>
            <p style={{ fontSize: 14, color: "#6a8a6a" }}>If you are not redirected, try signing in below.</p>
            <SignInForm
              returnUrl={searchParams?.get("returnUrl") || searchParams?.get("redirect") || undefined}
              onSuccess={(returnUrl) => router.replace(returnUrl || "/")}
              onSwitch={() => {
                const ret = searchParams?.get("returnUrl") || searchParams?.get("redirect") || "/";
                router.push("/signup?returnUrl=" + encodeURIComponent(ret));
              }}
            />
          </div>
        ) : (
        <SignInForm
          returnUrl={searchParams?.get("returnUrl") || searchParams?.get("redirect") || undefined}
          onSuccess={(returnUrl) => router.replace(returnUrl || "/")}
          onSwitch={() => {
            const ret = searchParams?.get("returnUrl") || searchParams?.get("redirect") || "/";
            router.push("/signup?returnUrl=" + encodeURIComponent(ret));
          }}
        />
        )}
      </div>
    </>
  );
}
