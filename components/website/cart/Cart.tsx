"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Lock, Loader2, ShieldCheck, AlertCircle, RefreshCw 
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/hooks/auth/useUser";
import { useMyTaxId, useSubmitTaxId } from "@/hooks/useTaxId";
import { useToast } from "@/components/ui/Toast";
import styles from "./Cart.module.css";

// Skeleton Import
import CartSkeleton from "@/components/website/skeletons/CartSkeleton/CartSkeleton";

export default function Cart() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const { cart, mounted, removeItem, updateQuantity, clear, totalItems, totalPrice } = useCart();
  
  // Hooks
  const { data: userData, isLoading: userLoading } = useUser(); 
  const user = userData?.user;

  const { data: taxIdData, isLoading: taxIdLoading, refetch: refetchTaxId, isRefetching } = useMyTaxId();
  const submitTaxIdMutation = useSubmitTaxId();
  const [taxIdInput, setTaxIdInput] = useState("");

  // Skeleton Loading (Sirf jab cart mount ho raha ho)
  if (!mounted) {
    return <CartSkeleton />;
  }

  // Empty Cart
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

  const taxStatus = taxIdData?.status;
  const isTaxVerified = taxStatus === "verified";

  const handleCheckout = () => {
    if (!user) {
      // Agar login nahi hai toh login par bhejein
      router.push("/login?redirect=/cart");
      return;
    }
    if (!isTaxVerified) return;
    router.push("/checkout");
  };

  const handleTaxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Please login to submit Tax ID.", "error");
      router.push("/login?redirect=/cart");
      return;
    }
    if (taxIdInput.trim().length < 5) {
      showToast("Please enter a valid Tax ID.", "error");
      return;
    }
    submitTaxIdMutation.mutate(
      { tax_id: taxIdInput.trim() },
      {
        onSuccess: () => {
          showToast("Tax ID submitted! Waiting for admin approval.", "success");
          setTaxIdInput("");
        },
        onError: (err: any) => {
          if (err.response?.status === 401) {
            showToast("Session expired. Please login again.", "error");
            router.push("/login");
          } else {
            showToast(err.response?.data?.message || "Failed to submit Tax ID.", "error");
          }
        },
      }
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Your bag</p>
            <h1 className={styles.title}>Shopping Cart</h1>
            <p className={styles.subtitle}>
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          <button type="button" className={styles.clearBtn} onClick={clear} aria-label="Clear cart">
            <Trash2 size={14} strokeWidth={1.6} />
            Clear cart
          </button>
        </header>

        {/* MAIN */}
        <div className={styles.main}>
          <div className={styles.itemsCol}>
            <ul className={styles.items}>
              {cart.map((item) => {
                const p = item.product;
                const regularPrice = Number(p.regular_price);
                const salePrice = p.sale_price !== null ? Number(p.sale_price) : null;
                const hasSale = salePrice !== null && salePrice < regularPrice;
                const price = hasSale ? salePrice! : regularPrice;
                const lineTotal = price * item.quantity;

                return (
                  <li key={p.id} className={styles.item}>
                    <Link href={`/shop/${p.slug}`} className={styles.itemImageLink}>
                      <Image src={p.main_image || "/placeholder.jpg"} alt={p.name} fill sizes="120px" unoptimized className={styles.itemImage} />
                    </Link>

                    <div className={styles.itemInfo}>
                      <div className={styles.itemTop}>
                        <Link href={`/shop/${p.slug}`} className={styles.itemName}>{p.name}</Link>
                        <p className={styles.itemSpecs}>
                          <span>SKU: {p.sku}</span>
                          <span className={styles.specSep}>·</span>
                          <span>{p.weight} {p.weight_unit}</span>
                        </p>
                        <button type="button" className={styles.removeBtn} onClick={() => removeItem(p.id)} aria-label={`Remove ${p.name}`}>
                          <Trash2 size={15} strokeWidth={1.6} />
                        </button>
                      </div>

                      <div className={styles.itemBottom}>
                        <div className={styles.itemBottomLeft}>
                          <div className={styles.itemPriceRow}>
                            {hasSale ? (
                              <>
                                <span className={styles.itemPriceSale}>${price.toFixed(2)}</span>
                                <span className={styles.itemPriceOld}>${regularPrice.toFixed(2)}</span>
                              </>
                            ) : (
                              <span className={styles.itemPrice}>${price.toFixed(2)}</span>
                            )}
                          </div>

                          <div className={styles.qtyPicker}>
                            <button type="button" className={styles.qtyBtn} onClick={() => updateQuantity(p.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                              <Minus size={13} strokeWidth={1.8} />
                            </button>
                            <span className={styles.qtyValue}>{item.quantity}</span>
                            <button type="button" className={styles.qtyBtn} onClick={() => updateQuantity(p.id, item.quantity + 1)} disabled={item.quantity >= p.stock_quantity}>
                              <Plus size={13} strokeWidth={1.8} />
                            </button>
                          </div>
                        </div>

                        <div className={styles.lineTotal}>
                          <span className={styles.lineTotalLabel}>Total</span>
                          <span className={styles.lineTotalValue}>${lineTotal.toFixed(2)}</span>
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

          {/* SUMMARY */}
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <dl className={styles.summaryList}>
              <div>
                <dt>Total items</dt>
                <dd>{totalItems}</dd>
              </div>
              <div className={styles.summaryTotalRow}>
                <dt>Total</dt>
                <dd className={styles.grandTotalValue}>${totalPrice.toFixed(2)}</dd>
              </div>
            </dl>

            {/* CONDITIONAL CHECKOUT SECTION */}
            {!user ? (
              // Case 1: User not logged in
              <button onClick={handleCheckout} className={styles.checkoutBtn}>
                <Lock size={15} strokeWidth={2} />
                Login to Checkout
              </button>
            ) : taxIdLoading ? (
              // Case 2: User logged in, tax id loading
              <div style={{ textAlign: "center", padding: "12px" }}>
                <Loader2 size={18} className="animate-spin" style={{ margin: "0 auto", color: "var(--accent-primary)" }} />
              </div>
            ) : !isTaxVerified ? (
              // Case 3: User logged in, tax id not verified
              <div className={styles.taxSection}>
                {taxStatus === "pending" && (
  <div className={styles.taxStatus}>
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Loader2 size={14} className="animate-spin" />
      <span>Tax ID is pending admin approval.</span>
    </div>
    <button
      type="button"
      onClick={() => refetchTaxId()}
      disabled={isRefetching}
      className={styles.checkStatusBtn}
    >
      <RefreshCw size={13} className={isRefetching ? "animate-spin" : ""} />
      {isRefetching ? "Checking..." : "Check Status"}
    </button>
  </div>
)}
                {taxStatus === "rejected" && (
                  <div className={styles.taxStatus} style={{ color: "#ef4444" }}>
                    <AlertCircle size={14} />
                    Your Tax ID was rejected. Please submit a valid one.
                  </div>
                )}
                
                {(!taxStatus || taxStatus === "rejected") && (
                  <form onSubmit={handleTaxSubmit} className={styles.taxForm}>
                    <input
                      type="text"
                      className={styles.taxInput}
                      placeholder="Enter Tax ID / NTN"
                      value={taxIdInput}
                      onChange={(e) => setTaxIdInput(e.target.value)}
                      disabled={submitTaxIdMutation.isPending}
                    />
                    <button type="submit" className={styles.taxSubmitBtn} disabled={submitTaxIdMutation.isPending}>
                      {submitTaxIdMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : "Submit"}
                    </button>
                  </form>
                )}
                
                <button onClick={handleCheckout} disabled className={styles.checkoutBtnLocked}>
                  <Lock size={15} strokeWidth={2} />
                  Verify Tax ID to Checkout
                </button>
              </div>
            ) : (
              // Case 4: Tax ID Verified
              <button onClick={handleCheckout} className={styles.checkoutBtn}>
                <ShieldCheck size={15} strokeWidth={2} />
                Proceed to Checkout
                <ArrowRight size={15} strokeWidth={1.6} />
              </button>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}