"use client";

import { useEffect, useRef } from "react";
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

function getTokenAndUserFromUrl() {
  if (typeof window === "undefined") return { token: null, userParam: null };
  const search = window.location.search || "";
  const hash = window.location.hash || "";
  const combined = search + (hash ? (hash.startsWith("#") ? "&" + hash.slice(1) : hash) : "");
  const params = new URLSearchParams(combined);
  const token = params.get("token") ?? params.get("access_token") ?? params.get("accessToken") ?? (hash.match(/[#&]access_token=([^&]+)/) || [])[1];
  const userParam = params.get("user");
  return { token, userParam };
}

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { userInfo } = useAuth();
  const callbackHandled = useRef(false);

  useEffect(() => {
    const q = searchParams;
    const { token: tokenFromUrl, userParam: userFromUrl } = getTokenAndUserFromUrl();
    const token = tokenFromUrl ?? q?.get("token") ?? q?.get("access_token") ?? q?.get("accessToken");
    const userParam = userFromUrl ?? q?.get("user");
    const googleCallback = q?.get("google_callback") === "1" || q?.get("google_callback") === "true";

    const applyUserAndRedirect = (data, returnUrlFallback) => {
      if (!data || (!data.token && !data.accessToken && !data._id && !data.id)) return false;
      dispatch(setCredentials(data));
      let returnUrl = q?.get("returnUrl") || q?.get("redirect") || returnUrlFallback || "/";
      try { returnUrl = decodeURIComponent(returnUrl); } catch (_) {}
      if (!returnUrl.startsWith("/")) returnUrl = "/";
      window.history.replaceState({}, "", window.location.pathname);
      router.replace(returnUrl);
      return true;
    };

    if (token || userParam) {
      if (callbackHandled.current) return;
      callbackHandled.current = true;
      (async () => {
        try {
          let data = {};
          if (userParam) {
            try { data = JSON.parse(decodeURIComponent(userParam)); } catch (_) {}
          }
          if (token) data = { ...data, token };
          if (!data?.token && !data?.accessToken) data.token = token;
          if (data?.token != null || data?._id != null || data?.id != null) {
            const t = data?.token ?? data?.accessToken;
            if (t) {
              try {
                const base = DB_URL.replace(/\/api\/?$/, "");
                const res = await fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${t}` }, credentials: "include" });
                const json = await res.json().catch(() => ({}));
                const fullUser = json?.data ?? json?.user ?? json;
                if (fullUser && (fullUser._id || fullUser.id)) data = { ...data, ...fullUser };
              } catch (_) {}
            }
            applyUserAndRedirect(data);
          }
        } catch (_) {}
      })();
      return;
    }

    if (googleCallback) {
      (async () => {
        const base = DB_URL.replace(/\/api\/?$/, "");
        const tryAuthMe = async () => {
          const res = await fetch(`${base}/api/auth/me`, { credentials: "include" });
          const json = await res.json().catch(() => ({}));
          const user = json?.data ?? json?.user ?? json;
          const tokenFromMe = json?.token ?? json?.data?.token ?? user?.token;
          return (user && (user._id || user.id)) || tokenFromMe
            ? { ...user, token: tokenFromMe ?? user?.token }
            : null;
        };
        let data = await tryAuthMe();
        if (!data) {
          await new Promise((r) => setTimeout(r, 800));
          data = await tryAuthMe();
        }
        if (data && !callbackHandled.current) {
          callbackHandled.current = true;
          applyUserAndRedirect(data);
        }
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

  return (
    <>
      <style>{AUTH_PAGE_CSS}</style>
      <Bg />
      <div className="wrap-auth">
        <SignInForm
          returnUrl={searchParams?.get("returnUrl") || searchParams?.get("redirect") || undefined}
          onSuccess={(returnUrl) => router.replace(returnUrl || "/")}
          onSwitch={() => {
            const ret = searchParams?.get("returnUrl") || searchParams?.get("redirect") || "/";
            router.push("/signup?returnUrl=" + encodeURIComponent(ret));
          }}
        />
      </div>
    </>
  );
}
