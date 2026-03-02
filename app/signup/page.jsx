"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useAuth } from "@slices/authSlice";
import { setCredentials } from "@slices/authSlice";
import { SignUpForm, Bg } from "@components/AuthUI";
import { DB_URL } from "@config/config";

const AUTH_PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{min-height:100dvh;overflow-x:hidden}
body{font-family:'Nunito',sans-serif;-webkit-font-smoothing:antialiased;background:#edf5ed}
button,input,select{font-family:'Nunito',sans-serif}
.wrap-auth{min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px 16px;position:relative;z-index:1;overflow-x:hidden;width:100%}
`;

export default function SignUpPage() {
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
    }
  }, [searchParams, dispatch, router]);

  useEffect(() => {
    if (searchParams?.get("token") || searchParams?.get("user") || searchParams?.get("access_token") || searchParams?.get("accessToken")) return;
    if (userInfo && typeof userInfo === "object" && Object.keys(userInfo).length > 0) {
      router.replace(searchParams?.get("returnUrl") || "/");
    }
  }, [userInfo, router, searchParams]);

  return (
    <>
      <style>{AUTH_PAGE_CSS}</style>
      <Bg stable />
      <div className="wrap-auth">
        <SignUpForm
          stable
          returnUrl={searchParams?.get("returnUrl") || searchParams?.get("redirect") || undefined}
          onSuccess={(returnUrl) => router.replace(returnUrl || "/")}
          onSwitch={() => {
            const ret = searchParams?.get("returnUrl") || searchParams?.get("redirect") || "/";
            router.push("/signin?returnUrl=" + encodeURIComponent(ret));
          }}
        />
      </div>
    </>
  );
}
