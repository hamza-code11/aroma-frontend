"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/components/ui/Toast";
import { useCheckout } from "@/app/providers/CheckoutProvider"; // <--- Import
import { Loader2, CheckCircle2 } from "lucide-react";
import ShippingStepSkeleton from "./ShippingStepSkeleton";
import styles from "./ShippingStep.module.css";

export default function ShippingStep({ checkoutId, onNext, onBack }: any) {
    const { cart } = useCart();
    const { showToast } = useToast();
    const { setShipping } = useCheckout(); // <--- Context
    const [rates, setRates] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const storedAddress = sessionStorage.getItem("checkout_address"); // Address abhi bhi sessionStorage mein hai
                if (!storedAddress) throw new Error("Address not found.");
                const addressData = JSON.parse(storedAddress);

                const cartItems = cart.map((item) => ({
                    weight: Number(item.product.weight) || 0.5,
                    length: Number(item.product.length) || 10,
                    width: Number(item.product.width) || 10,
                    height: Number(item.product.height) || 10,
                    quantity: item.quantity,
                }));

                const res = await axiosInstance.post("/fedex/rates", {
                    addressData: { ...addressData, state: addressData.state || "CA" },
                    cartItems,
                });

                if (res.data.success && res.data.rates) setRates(res.data.rates);
                else throw new Error("Failed to fetch rates.");
            } catch (err: any) {
                setError(err.message || "Failed to load rates.");
            } finally {
                setLoading(false);
            }
        };
        if (cart.length > 0) fetchRates();
    }, [cart]);

    const handleNext = async () => {
        if (!selected) return showToast("Please select a shipping method.", "error");
        setIsSaving(true);
        try {
            await axiosInstance.post("/checkout/shipping", {
                checkout_id: checkoutId,
                shipping_method: selected.name,
                shipping_price: selected.price,
            });
            
            // ✅ Context mein save karein (taake OrderSummary foran update ho)
            setShipping(selected);
            
            onNext();
        } catch (err) {
            showToast("Failed to save shipping.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <ShippingStepSkeleton />;
    if (error) return <div className={styles.form}><p style={{color: "#ef4444"}}>{error}</p><button onClick={onBack} className={styles.backBtn}>Back</button></div>;

    return (
        <div className={styles.form}>
            <header className={styles.header}>
                <h1 className={styles.title}>Shipping Method</h1>
                <p className={styles.subtitle}>Step 2 of 3</p>
            </header>
            <div className={styles.rateList}>
                {rates.map((rate) => (
                    <label key={rate.id} className={`${styles.rateCard} ${selected?.id === rate.id ? styles.rateCardActive : ""}`}>
                        <input type="radio" name="rate" checked={selected?.id === rate.id} onChange={() => setSelected(rate)} style={{ display: 'none' }} />
                        <div className={`${styles.radioCircle} ${selected?.id === rate.id ? styles.radioCircleActive : ""}`}>{selected?.id === rate.id && <CheckCircle2 size={16} />}</div>
                        <div className={styles.rateInfo}><strong className={styles.rateName}>{rate.name}</strong><p className={styles.rateDays}>{rate.days}</p></div>
                        <span className={styles.ratePrice}>${rate.price.toFixed(2)}</span>
                    </label>
                ))}
            </div>
            <div className={styles.buttonsRow}>
                <button type="button" onClick={onBack} className={styles.backBtn} disabled={isSaving}>Back</button>
                <button type="button" onClick={handleNext} className={styles.submitBtn} disabled={isSaving || !selected}>
                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : "Continue to Payment"}
                </button>
            </div>
        </div>
    );
}
