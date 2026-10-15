"use client";

import type { Product } from "@/types/product";
import type { CartItem, WishlistItem } from "@/types/cart";

const CART_KEY = "ishine_cart";
const WISHLIST_KEY = "ishine_wishlist";

/* ================= CART ================= */

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: cart }));
}

export function addToCart(product: Product, quantity: number = 1): CartItem[] {
  const cart = getCart();

  const existingIndex = cart.findIndex((item) => item.product.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ product, quantity });
  }

  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: number): CartItem[] {
  const cart = getCart().filter((item) => item.product.id !== productId);
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(
  productId: number,
  quantity: number
): CartItem[] {
  if (quantity < 1) return getCart();

  const cart = getCart().map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

/* ================= WISHLIST ================= */

export function getWishlist(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveWishlist(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("wishlist:updated", { detail: items }));
}

export function toggleWishlist(product: Product): WishlistItem[] {
  const current = getWishlist();
  const exists = current.some((item) => item.product.id === product.id);

  let next: WishlistItem[];

  if (exists) {
    next = current.filter((item) => item.product.id !== product.id);
  } else {
    next = [...current, { product, added_at: new Date().toISOString() }];
  }

  saveWishlist(next);
  return next;
}

export function isInWishlist(productId: number): boolean {
  return getWishlist().some((item) => item.product.id === productId);
}

export function clearWishlist() {
  saveWishlist([]);
}
