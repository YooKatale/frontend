"use client";

import { createSlice } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useCallback } from "react";

const WISHLIST_KEY = "yookatale-wishlist";

function loadFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  } catch (_) {}
}

const initialState = { items: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      saveToStorage(state.items);
    },
    addToWishlist: (state, action) => {
      const { productId, product } = action.payload || {};
      if (!productId) return;
      const exists = state.items.some((i) => i.productId === productId);
      if (exists) return;
      state.items.push({ productId, product: product || null });
      saveToStorage(state.items);
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.productId !== id);
      saveToStorage(state.items);
    },
    toggleWishlist: (state, action) => {
      const { productId, product } = action.payload || {};
      if (!productId) return;
      const idx = state.items.findIndex((i) => i.productId === productId);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push({ productId, product: product || null });
      }
      saveToStorage(state.items);
    },
    hydrateWishlist: (state) => {
      state.items = loadFromStorage();
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  hydrateWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

export function useWishlist() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.wishlist?.items ?? []);
  const ids = useMemo(() => new Set(items.map((i) => i.productId)), [items]);
  const isInWishlist = useCallback((id) => ids.has(id), [ids]);
  const add = useCallback((productId, product) => dispatch(addToWishlist({ productId, product })), [dispatch]);
  const remove = useCallback((productId) => dispatch(removeFromWishlist(productId)), [dispatch]);
  const toggle = useCallback((productId, product) => dispatch(toggleWishlist({ productId, product })), [dispatch]);
  return { items, ids, isInWishlist, add, remove, toggle };
}
