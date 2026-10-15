"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";
import type { WishlistItem } from "@/types/cart";
import {
  getWishlist,
  toggleWishlist as toggleWishlistUtil,
  clearWishlist as clearWishlistUtil,
} from "@/utils/cart";

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWishlist(getWishlist());

    const handler = (e: Event) => {
      const detail = (e as CustomEvent<WishlistItem[]>).detail;
      setWishlist(detail);
    };
    window.addEventListener("wishlist:updated", handler);
    return () => window.removeEventListener("wishlist:updated", handler);
  }, []);

  const toggle = useCallback((product: Product) => {
    const next = toggleWishlistUtil(product);
    setWishlist(next);
  }, []);

  const clearWishlist = useCallback(() => {
    clearWishlistUtil();
    setWishlist([]);
  }, []);

  const has = useCallback(
    (productId: number) => wishlist.some((item) => item.product.id === productId),
    [wishlist]
  );

  return { wishlist, mounted, toggle, has, clearWishlist };
}
