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

  const hasSale =
    product.sale_price !== null && product.sale_price < product.regular_price;
  const price = hasSale ? product.sale_price! : product.regular_price;
  const discountPercent = hasSale
    ? Math.round(
        ((product.regular_price - product.sale_price!) /
          product.regular_price) *
          100
      )
    : 0;

  const outOfStock = product.stock_quantity <= 0;
  const lowStock = !outOfStock && product.stock_quantity <= 5;

  const href = `/shop/${product.slug}`;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  return (
    <article className={styles.card}>
      <Link href={href} className={styles.imageLink} aria-label={product.name}>
        <div className={styles.imageWrap}>
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            sizes="(max-width: 600px) 85vw, (max-width: 900px) 45vw, 25vw"
            priority={priority}
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
            className={`${styles.wishlistBtn} ${
              wishlisted ? styles.wishlistActive : ""
            }`}
            onClick={handleWishlist}
            aria-label={
              wishlisted ? "Remove from wishlist" : "Add to wishlist"
            }
            aria-pressed={wishlisted}
          >
            <Heart
              size={16}
              strokeWidth={1.6}
              fill={wishlisted ? "currentColor" : "none"}
            />
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
                <span className={styles.priceOld}>
                  ${product.regular_price.toFixed(2)}
                </span>
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
            <span className={styles.addLabel}>
              {outOfStock ? "Sold Out" : "Add"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}