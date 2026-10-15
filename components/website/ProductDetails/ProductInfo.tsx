"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlistContext } from "@/app/providers/WishlistProvider";
import type { Product } from "@/types/product";
import styles from "./ProductInfo.module.css";

type Props = {
  product: Product;
};

export default function ProductInfo({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toggle, has, mounted } = useWishlistContext();

  const wishlisted = mounted ? has(product.id) : false;

  const hasSale =
    product.sale_price !== null && product.sale_price < product.regular_price;
  const price = hasSale ? product.sale_price! : product.regular_price;
  const savings = hasSale ? product.regular_price - price : 0;

  const outOfStock = product.stock_quantity <= 0;
  const lowStock = !outOfStock && product.stock_quantity <= 5;

  const increment = () =>
    setQuantity((q) => Math.min(q + 1, product.stock_quantity || 1));
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(product, quantity);
  };

  const handleWishlist = () => {
    toggle(product);
  };

  return (
    <div className={styles.info}>
      {/* BREADCRUMB */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/" className={styles.crumbLink}>
          Home
        </Link>
        <span className={styles.crumbSep}>/</span>
        <Link href="/shop" className={styles.crumbLink}>
          Shop
        </Link>
        <span className={styles.crumbSep}>/</span>
        <span className={styles.crumbCurrent}>{product.name}</span>
      </nav>

      <h1 className={styles.name}>{product.name}</h1>
      <p className={styles.sku}>SKU: {product.sku}</p>
      <p className={styles.shortDesc}>{product.description}</p>

      {/* Price */}
      <div className={styles.priceRow}>
        {hasSale ? (
          <>
            <span className={styles.priceSale}>${price.toFixed(2)}</span>
            <span className={styles.priceOld}>
              ${product.regular_price.toFixed(2)}
            </span>
            <span className={styles.saveBadge}>
              Save ${savings.toFixed(2)}
            </span>
          </>
        ) : (
          <span className={styles.price}>${price.toFixed(2)}</span>
        )}
      </div>

      {/* Stock */}
      <div className={styles.stockRow}>
        {outOfStock ? (
          <span className={`${styles.stock} ${styles.stockOut}`}>
            Out of Stock
          </span>
        ) : lowStock ? (
          <span className={`${styles.stock} ${styles.stockLow}`}>
            Only {product.stock_quantity} left in stock
          </span>
        ) : (
          <span className={`${styles.stock} ${styles.stockIn}`}>
            In Stock ({product.stock_quantity} available)
          </span>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actionsRow}>
        <div className={styles.qtyPicker}>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={decrement}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={14} strokeWidth={1.8} />
          </button>
          <span className={styles.qtyValue} aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={increment}
            disabled={quantity >= product.stock_quantity}
            aria-label="Increase quantity"
          >
            <Plus size={14} strokeWidth={1.8} />
          </button>
        </div>

        <button
          type="button"
          className={styles.addBtn}
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          <ShoppingBag size={16} strokeWidth={1.6} />
          {outOfStock ? "Sold Out" : "Add to Cart"}
        </button>

        <button
          type="button"
          className={`${styles.wishBtn} ${
            wishlisted ? styles.wishActive : ""
          }`}
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
        >
          <Heart
            size={16}
            strokeWidth={1.6}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </button>
      </div>

      {/* Specs */}
      <dl className={styles.specGrid}>
        <div>
          <dt>SKU</dt>
          <dd>{product.sku}</dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>
            {product.weight} {product.weight_unit}
          </dd>
        </div>
        {product.length && product.width && product.height && (
          <div>
            <dt>Dimensions</dt>
            <dd>
              {product.length} × {product.width} × {product.height}{" "}
              {product.dimension_unit}
            </dd>
          </div>
        )}
        {product.shipping_class && (
          <div>
            <dt>Shipping Class</dt>
            <dd>{product.shipping_class}</dd>
          </div>
        )}
        <div>
          <dt>Availability</dt>
          <dd>
            {outOfStock
              ? "Out of stock"
              : `${product.stock_quantity} in stock`}
          </dd>
        </div>
      </dl>
    </div>
  );
}