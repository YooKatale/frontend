"use client";

import { createSlice } from "@reduxjs/toolkit";
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
      state.userInfo = action.payload;
      typeof window !== "undefined"
        ? localStorage?.setItem("yookatale-app", JSON.stringify(action.payload))
        : (localStorage = null);
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

/** Safe selector: always returns { userInfo }. Prevents "Cannot destructure property 'auth' of undefined" when state is missing (e.g. during hydration or before Provider). */
const DEFAULT_AUTH = { userInfo: null };
export const selectAuth = (state) => {
  if (state == null || typeof state !== "object") return DEFAULT_AUTH;
  const auth = state.auth;
  if (auth == null || typeof auth !== "object") return DEFAULT_AUTH;
  return { userInfo: auth.userInfo ?? null };
};

/** Safe hook: returns { userInfo } and never throws (e.g. when store is not in context yet). Use in layout/header to avoid hydration crashes. */
export function useAuth() {
  try {
    return useSelector(selectAuth);
  } catch (_e) {
    return DEFAULT_AUTH;
  }
}

export default authSlice.reducer;
