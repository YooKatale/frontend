"use client";

/**
 * Location Gate Component
 * Pass-through: no longer shows location modal on app load.
 * Location selection is only required at checkout.
 */
export default function LocationGate({ children }) {
  return <>{children}</>;
}
