"use client";

import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@slices/apiSlice";
import authReducer from "@slices/authSlice";
import wishlistReducer from "@slices/wishlistSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
