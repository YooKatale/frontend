/**
 * Cart update events - dispatch when cart changes so Header, MobileBottomNav, sidebar
 * can refresh cart count immediately without visiting cart page.
 */
export const CART_UPDATED_EVENT = "yookatale-cart-updated";

export function dispatchCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
  }
}
