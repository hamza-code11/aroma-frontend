"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag, Heart } from "lucide-react";
import { useWishlistContext } from "@/app/providers/WishlistProvider";
import { useCart } from "@/hooks/useCart";
import styles from "./WishlistSidebar.module.css";

export default function WishlistSidebar() {
  const { wishlist, isOpen, close, remove, clear } = useWishlistContext();
  const { addItem } = useCart();

  const handleMoveToCart = (product: (typeof wishlist)[number]["product"]) => {
    addItem(product, 1);
    remove(product.id);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => addItem(item.product, 1));
    clear();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}
        aria-hidden={!isOpen}
        aria-label="Wishlist"
      >
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Heart size={18} strokeWidth={1.6} className={styles.headerIcon} />
            <h2 className={styles.title}>
              Wishlist
              {wishlist.length > 0 && (
                <span className={styles.count}>({wishlist.length})</span>
              )}
            </h2>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={close}
            aria-label="Close wishlist"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </header>

        {/* Body */}
        <div className={styles.body}>
          {wishlist.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">
                <Heart size={28} strokeWidth={1.4} />
              </span>
              <p className={styles.emptyTitle}>Your wishlist is empty</p>
              <p className={styles.emptyText}>
                Tap the heart on any product to save it here.
              </p>
              <Link href="/shop" className={styles.emptyBtn} onClick={close}>
                Browse products
              </Link>
            </div>
          ) : (
            <ul className={styles.list}>
              {wishlist.map((item) => {
                const p = item.product;
                
                // Safe price conversions
                const regularPrice = Number(p.regular_price);
                const salePrice = p.sale_price !== null ? Number(p.sale_price) : null;
                const hasSale = salePrice !== null && salePrice < regularPrice;
                const price = hasSale ? salePrice! : regularPrice;

                return (
                  <li key={p.id} className={styles.item}>
                    <Link
                      href={`/shop/${p.slug}`}
                      className={styles.itemImageLink}
                      onClick={close}
                    >
                      <Image
                        src={p.main_image || "/placeholder.jpg"} // Fallback
                        alt={p.name}
                        fill
                        sizes="80px"
                        unoptimized // Full URL ya local, dono ke liye
                        className={styles.itemImage}
                      />
                    </Link>

                    <div className={styles.itemInfo}>
                      <Link
                        href={`/shop/${p.slug}`}
                        className={styles.itemName}
                        onClick={close}
                      >
                        {p.name}
                      </Link>

                      <div className={styles.itemPriceRow}>
                        {hasSale ? (
                          <>
                            <span className={styles.itemPriceSale}>
                              ${price.toFixed(2)}
                            </span>
                            <span className={styles.itemPriceOld}>
                              ${regularPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className={styles.itemPrice}>
                            ${price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className={styles.itemActions}>
                        <button
                          type="button"
                          className={styles.moveBtn}
                          onClick={() => handleMoveToCart(p)}
                        >
                          <ShoppingBag size={13} strokeWidth={1.6} />
                          Move to Cart
                        </button>

                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => remove(p.id)}
                          aria-label={`Remove ${p.name} from wishlist`}
                        >
                          <Trash2 size={14} strokeWidth={1.6} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {wishlist.length > 0 && (
          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clear}
            >
              <Trash2 size={14} strokeWidth={1.6} />
              Clear all
            </button>

            <button
              type="button"
              className={styles.moveAllBtn}
              onClick={handleMoveAllToCart}
            >
              <ShoppingBag size={14} strokeWidth={1.6} />
              Move all to Cart
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
