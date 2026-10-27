"use client";

import { useCart } from "@/hooks/useCart";
import { useCheckout } from "@/app/providers/CheckoutProvider"; // <--- Import
import styles from "../Checkout.module.css";

export default function OrderSummary({ checkoutId }: { checkoutId: number | null }) {
    const { cart, totalPrice } = useCart();
    const { shipping } = useCheckout(); // <--- Context se shipping uthayein

    const subtotal = Number(totalPrice);
    const shippingCost = shipping ? Number(shipping.price) : 0;
    const total = subtotal + shippingCost;

    return (
        <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            
            <div className={styles.summaryItems}>
                {cart.map((item) => {
                    const price = Number(item.product.sale_price ?? item.product.regular_price);
                    return (
                        <div key={item.product.id} className={styles.summaryItemRow}>
                            <span>{item.product.name} <small>x{item.quantity}</small></span>
                            <span>${(price * item.quantity).toFixed(2)}</span>
                        </div>
                    );
                })}
            </div>

            <div className={styles.summaryFooter}>
                <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                    <span>Shipping</span>
                    <span>{shipping ? `$${shippingCost.toFixed(2)}` : "Calculated at next step"}</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            {shipping && (
                <div className={styles.secureBadge} style={{ marginTop: "16px", backgroundColor: "color-mix(in srgb, var(--accent-primary) 5%, transparent)" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{shipping.name}</span>
                </div>
            )}
        </div>
    );
}
