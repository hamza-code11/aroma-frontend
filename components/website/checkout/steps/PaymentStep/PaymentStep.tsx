"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/Toast";
import { useCheckout } from "@/app/providers/CheckoutProvider"; // <--- Import
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";
import PaymentStepSkeleton from "./PaymentStepSkeleton";
import styles from "./PaymentStep.module.css";

export default function PaymentStep({ checkoutId, onBack }: any) {
    const router = useRouter();
    const { cart, clear, totalPrice } = useCart();
    const { showToast } = useToast();
    const { shipping, resetCheckout } = useCheckout(); // <--- Context
    
    const [loading, setLoading] = useState(true);
    const [isPaying, setIsPaying] = useState(false);
    const [form, setForm] = useState({ card_number: "", expiry_month: "", expiry_year: "", cvv: "" });

    useEffect(() => {
        setLoading(false);
    }, []);

    const subtotal = Number(totalPrice);
    const shippingPrice = shipping ? Number(shipping.price) : 0;
    const totalAmount = subtotal + shippingPrice;

    // Formatters (same as before)
    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.replace(/(.{4})/g, "$1 ").trim();
        if (value.length <= 19) setForm({ ...form, card_number: value });
    };
    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length <= 2) setForm({ ...form, expiry_month: value });
    };
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length <= 4) setForm({ ...form, expiry_year: value });
    };
    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length <= 4) setForm({ ...form, cvv: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!shipping) return showToast("Shipping method not selected.", "error");
        if (isPaying) return;

        setIsPaying(true);
        try {
            const items = cart.map((c) => ({
                product_id: c.product.id,
                name: c.product.name,
                price: Number(c.product.sale_price ?? c.product.regular_price),
                quantity: c.quantity,
            }));

            const res = await axiosInstance.post("/checkout/payment", {
                checkout_id: checkoutId,
                card_number: form.card_number.replace(/\s/g, ""),
                expiry_month: form.expiry_month,
                expiry_year: form.expiry_year,
                cvv: form.cvv,
                amount: totalAmount,
                shipping_method: shipping.name,
                shipping_price: shippingPrice,
                items,
            });

            if (res.data.success) {
                clear(); // Cart clear karein
                resetCheckout(); // Context reset karein (shipping aur address)
                
                showToast("Order placed successfully!", "success");
                router.push(`/order-confirmation/${res.data.order_id}`);
            }
        } catch (err: any) {
            showToast(err.response?.data?.message || "Payment failed. Please try again.", "error");
        } finally {
            setIsPaying(false);
        }
    };

    if (loading) return <PaymentStepSkeleton />;
    if (!shipping) return <div className={styles.form}>Loading shipping...</div>;

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <header className={styles.header}>
                <h1 className={styles.title}>Payment</h1>
                <p className={styles.subtitle}>Step 3 of 3</p>
            </header>

            <div className={styles.secureBadge}>
                <ShieldCheck size={18} />
                <span>Tax ID Verified</span>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Card Number</label>
                <div className={styles.inputWithIcon}>
                    <input className={styles.input} placeholder="1234 5678 9012 3456" value={form.card_number} onChange={handleCardNumberChange} disabled={isPaying} required />
                    <CreditCard size={18} className={styles.inputIcon} />
                </div>
            </div>

            <div className={styles.grid3}>
                <div className={styles.field}><label className={styles.label}>Month</label><input className={styles.input} placeholder="MM" maxLength={2} value={form.expiry_month} onChange={handleMonthChange} disabled={isPaying} required /></div>
                <div className={styles.field}><label className={styles.label}>Year</label><input className={styles.input} placeholder="YYYY" maxLength={4} value={form.expiry_year} onChange={handleYearChange} disabled={isPaying} required /></div>
                <div className={styles.field}><label className={styles.label}>CVV</label><input className={styles.input} placeholder="123" maxLength={4} type="password" value={form.cvv} onChange={handleCvvChange} disabled={isPaying} required /></div>
            </div>

            <div className={styles.buttonsRow}>
                <button type="button" onClick={onBack} className={styles.backBtn} disabled={isPaying}>Back</button>
                <button type="submit" className={styles.submitBtn} disabled={isPaying}>
                    {isPaying ? <Loader2 className="animate-spin" size={16} /> : `Pay $${totalAmount.toFixed(2)}`}
                </button>
            </div>
        </form>
    );
}
