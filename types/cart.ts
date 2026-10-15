import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  added_at: string;
}
