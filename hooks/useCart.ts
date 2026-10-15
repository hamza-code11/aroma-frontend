"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";
import {
  addToCart as addToCartUtil,
  getCart,
  removeFromCart as removeFromCartUtil,
  updateCartQuantity,
  clearCart as clearCartUtil,
} from "@/utils/cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCart(getCart());

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<CartItem[]>).detail;
      setCart(detail);
    };
    window.addEventListener("cart:updated", handler);
    return () => window.removeEventListener("cart:updated", handler);
  }, []);

  const addItem = useCallback((product: Product, quantity: number = 1) => {
    const next = addToCartUtil(product, quantity);
    setCart(next);
  }, []);

  const removeItem = useCallback((productId: number) => {
    const next = removeFromCartUtil(productId);
    setCart(next);
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    const next = updateCartQuantity(productId, quantity);
    setCart(next);
  }, []);

  const clear = useCallback(() => {
    clearCartUtil();
    setCart([]);
  }, []);

  const has = useCallback(
    (productId: number) => cart.some((item) => item.product.id === productId),
    [cart]
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.product.sale_price ?? item.product.regular_price;
    return sum + price * item.quantity;
  }, 0);

  return {
    cart,
    mounted,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    has,
    totalItems,
    totalPrice,
  };
}
