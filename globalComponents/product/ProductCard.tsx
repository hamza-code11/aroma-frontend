"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlistContext } from "@/app/providers/WishlistProvider";
import type { Product } from "@/types/product";
import styles from "./ProductCard.module.css";

type Props = {
  product: Product;
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: Props) {
  const { addItem } = useCart();
  const { toggle, has, mounted } = useWishlistContext();

  const wishlisted = mounted ? has(product.id) : false;

  // Prices Number mein convert karein (backend se string aa sakti hai)
  const regularPrice = Number(product.regular_price);
  const salePrice = product.sale_price !== null ? Number(product.sale_price) : null;
  
  const hasSale = salePrice !== null && salePrice < regularPrice;
  const price = hasSale ? salePrice! : regularPrice;
  
  const discountPercent = hasSale
    ? Math.round(((regularPrice - salePrice!) / regularPrice) * 100)
    : 0;

  const outOfStock = product.stock_quantity <= 0;
  const lowStock = !outOfStock && product.stock_quantity <= 5;

  // Image URL Fix Helper
  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.jpg";
    return path.startsWith("http") ? path : `${process.env.NEXT_PUBLIC_STORAGE_URL}/${path}`;
  };

  const imageUrl = getImageUrl(product.main_image);
  const href = `/shop/${product.slug}`;

  // PRODUCT OBJECT TAYAR KAREIN (Cart/Wishlist ke liye)
  // Isme full URL images aur number prices hain
  const productForStorage: Product = {
    ...product,
    regular_price: regularPrice,
    sale_price: salePrice,
    main_image: imageUrl,
    images: (product.images || []).map(getImageUrl),
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(productForStorage, 1); // <--- Sahi object bheja
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(productForStorage); // <--- Sahi object bheja
  };

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.imageLink} aria-label={product.name}>
        <div className={styles.imageWrap}>
          <Image
            src={imageUrl || "/placeholder.jpg"} // Fallback
            alt={product.name}
            fill
            sizes="(max-width: 600px) 85vw, (max-width: 900px) 45vw, 25vw"
            priority={priority}
            unoptimized   
            className={styles.image}
          />

          <div className={styles.badges}>
            {hasSale && (
              <span className={`${styles.badge} ${styles.badgeSale}`}>
                -{discountPercent}%
              </span>
            )}
            {outOfStock && (
              <span className={`${styles.badge} ${styles.badgeOut}`}>
                Out of Stock
              </span>
            )}
            {lowStock && (
              <span className={`${styles.badge} ${styles.badgeLow}`}>
                Only {product.stock_quantity} left
              </span>
            )}
          </div>

          <button
            type="button"
            className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlistActive : ""}`}
            onClick={handleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} strokeWidth={1.6} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      </Link>

      <div className={styles.info}>
        <Link href={href} className={styles.nameLink}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <div className={styles.priceWrap}>
            {hasSale ? (
              <>
                <span className={styles.priceSale}>${price.toFixed(2)}</span>
                <span className={styles.priceOld}>${regularPrice.toFixed(2)}</span>
              </>
            ) : (
              <span className={styles.price}>${price.toFixed(2)}</span>
            )}
          </div>

          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={14} strokeWidth={1.6} />
            <span className={styles.addLabel}>{outOfStock ? "Sold Out" : "Add"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}