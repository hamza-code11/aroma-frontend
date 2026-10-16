"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import styles from "./Cart.module.css";

export default function Cart() {
  const {
    cart,
    mounted,
    removeItem,
    updateQuantity,
    clear,
    totalItems,
    totalPrice,
  } = useCart();

  /* ---------- Loading state ---------- */
  if (!mounted) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.loading}>Loading cart…</div>
        </div>
      </div>
    );
  }

  /* ---------- Empty state ---------- */
  if (cart.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <span className={styles.emptyIcon} aria-hidden="true">
              <ShoppingBag size={32} strokeWidth={1.4} />
            </span>
            <h1 className={styles.emptyTitle}>Your cart is empty</h1>
            <p className={styles.emptyText}>
              Looks like you haven&apos;t added anything yet. Explore our
              collection and find the scent that belongs in your space.
            </p>
            <Link href="/shop" className={styles.emptyBtn}>
              Browse products
              <ArrowRight size={14} strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ================= HEADER ================= */}
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Your bag</p>
            <h1 className={styles.title}>Shopping Cart</h1>
            <p className={styles.subtitle}>
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <button
            type="button"
            className={styles.clearBtn}
            onClick={clear}
            aria-label="Clear cart"
          >
            <Trash2 size={14} strokeWidth={1.6} />
            Clear cart
          </button>
        </header>

        {/* ================= MAIN ================= */}
        <div className={styles.main}>
          {/* ---------- LEFT: Items ---------- */}
          <div className={styles.itemsCol}>
            <ul className={styles.items}>
              {cart.map((item) => {
                const p = item.product;
                const hasSale =
                  p.sale_price !== null && p.sale_price < p.regular_price;
                const price = hasSale ? p.sale_price! : p.regular_price;
                const lineTotal = price * item.quantity;

                return (
                  <li key={p.id} className={styles.item}>
                    <Link
                      href={`/shop/${p.slug}`}
                      className={styles.itemImageLink}
                    >
                      <Image
                        src={p.main_image}
                        alt={p.name}
                        fill
                        sizes="120px"
                        unoptimized
                        className={styles.itemImage}
                      />
                    </Link>

                    <div className={styles.itemInfo}>
                      {/* TOP: name + specs + remove */}
                      <div className={styles.itemTop}>
                        <Link
                          href={`/shop/${p.slug}`}
                          className={styles.itemName}
                        >
                          {p.name}
                        </Link>

                        {/* Specs inline — full row */}
                        <p className={styles.itemSpecs}>
                          <span>SKU: {p.sku}</span>
                          <span className={styles.specSep}>·</span>
                          <span>
                            {p.weight} {p.weight_unit}
                          </span>
                          {p.length && p.width && p.height && (
                            <>
                              <span className={styles.specSep}>·</span>
                              <span>
                                {p.length} × {p.width} × {p.height}{" "}
                                {p.dimension_unit}
                              </span>
                            </>
                          )}
                        </p>

                        <button
                          type="button"
                          className={styles.removeBtn}
                          onClick={() => removeItem(p.id)}
                          aria-label={`Remove ${p.name} from cart`}
                        >
                          <Trash2 size={15} strokeWidth={1.6} />
                        </button>
                      </div>

                      {/* BOTTOM: price + qty (left) · line total (right) */}
                      <div className={styles.itemBottom}>
                        <div className={styles.itemBottomLeft}>
                          {/* Price */}
                          <div className={styles.itemPriceRow}>
                            {hasSale ? (
                              <>
                                <span className={styles.itemPriceSale}>
                                  ${price.toFixed(2)}
                                </span>
                                <span className={styles.itemPriceOld}>
                                  ${p.regular_price.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className={styles.itemPrice}>
                                ${price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Qty */}
                          <div className={styles.qtyPicker}>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() =>
                                updateQuantity(p.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} strokeWidth={1.8} />
                            </button>
                            <span className={styles.qtyValue}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className={styles.qtyBtn}
                              onClick={() =>
                                updateQuantity(p.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= p.stock_quantity}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} strokeWidth={1.8} />
                            </button>
                          </div>
                        </div>

                        {/* Line total */}
                        <div className={styles.lineTotal}>
                          <span className={styles.lineTotalLabel}>Total</span>
                          <span className={styles.lineTotalValue}>
                            ${lineTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link href="/shop" className={styles.continueLink}>
              <ArrowLeft size={14} strokeWidth={1.6} />
              Continue shopping
            </Link>
          </div>

          {/* ---------- RIGHT: Summary ---------- */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <dl className={styles.summaryList}>
              <div>
                <dt>Total items</dt>
                <dd>{totalItems}</dd>
              </div>
              <div className={styles.summaryTotalRow}>
                <dt>Total</dt>
                <dd className={styles.grandTotalValue}>
                  ${totalPrice.toFixed(2)}
                </dd>
              </div>
            </dl>

            <button type="button" className={styles.checkoutBtn}>
              Proceed to Checkout
              <ArrowRight size={15} strokeWidth={1.6} />
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}