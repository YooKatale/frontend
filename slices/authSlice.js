"use client";

import { createSlice, createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  userInfo:
    typeof window !== "undefined"
      ? localStorage?.getItem("yookatale-app")
        ? JSON.parse(localStorage?.getItem("yookatale-app"))
        : null
      : {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const payload = action.payload;
      const next =
        payload && typeof payload === "object"
          ? { ...(state.userInfo && typeof state.userInfo === "object" ? state.userInfo : {}), ...payload }
          : payload;
      state.userInfo = next;
      if (typeof window !== "undefined") {
        if (next == null) localStorage?.removeItem("yookatale-app");
        else localStorage?.setItem("yookatale-app", JSON.stringify(next));
      }
    },
    logout: (state, action) => {
      state.userInfo = null;
      typeof window !== "undefined"
        ? localStorage?.removeItem("yookatale-app")
        : (localStorage = null);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

/** Safe selector: always returns { userInfo }. Memoized to avoid unnecessary rerenders. */
const DEFAULT_AUTH = { userInfo: null };
const selectAuthState = (state) => (state != null && typeof state === "object" ? state.auth : undefined);
export const selectAuth = createSelector(
  [selectAuthState],
  (auth) => {
    if (auth == null || typeof auth !== "object") return DEFAULT_AUTH;
    const userInfo = auth.userInfo ?? null;
    return userInfo === null ? DEFAULT_AUTH : { userInfo };
  }
);

/** Safe hook: returns { userInfo } and never throws (e.g. when store is not in context yet). Use in layout/header to avoid hydration crashes. */
export function useAuth() {
  try {
    return useSelector(selectAuth);
  } catch (_e) {
    return DEFAULT_AUTH;
  }
}

export default authSlice.reducer;
