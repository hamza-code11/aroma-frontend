"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Product } from "@/types/product";
import type { WishlistItem } from "@/types/cart";
import {
  getWishlist,
  toggleWishlist as toggleWishlistUtil,
  clearWishlist as clearWishlistUtil,
  saveWishlist,
} from "@/utils/cart";

type WishlistContextValue = {
  wishlist: WishlistItem[];
  mounted: boolean;
  isOpen: boolean;
  has: (productId: number) => boolean;
  toggle: (product: Product) => void;
  remove: (productId: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  /* ---------- Init + subscribe ---------- */
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

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  /* ---------- Toggle (auto-open on add) ---------- */
  const toggle = useCallback(
    (product: Product) => {
      const before = getWishlist().some((i) => i.product.id === product.id);
      const next = toggleWishlistUtil(product);
      setWishlist(next);

      // ✅ sirf ADD karne par sidebar open ho, remove par nahi
      if (!before) setIsOpen(true);
    },
    []
  );

  const remove = useCallback((productId: number) => {
    const next = getWishlist().filter((i) => i.product.id !== productId);
    saveWishlist(next);
    setWishlist(next);
  }, []);

  const clear = useCallback(() => {
    clearWishlistUtil();
    setWishlist([]);
  }, []);

  const has = useCallback(
    (productId: number) => wishlist.some((i) => i.product.id === productId),
    [wishlist]
  );

  /* ---------- Escape key se close ---------- */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /* ---------- Body scroll lock ---------- */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        mounted,
        isOpen,
        has,
        toggle,
        remove,
        clear,
        open,
        close,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlistContext must be used inside WishlistProvider");
  }
  return ctx;
}
