"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AddressStep from "./steps/AddressStep/AddressStep";
import ShippingStep from "./steps/ShippingStep/ShippingStep";
import PaymentStep from "./steps/PaymentStep/PaymentStep";
import OrderSummary from "./steps/OrderSummary";
import styles from "./Checkout.module.css";

type Step = "address" | "shipping" | "payment";

export default function Checkout() {
    const [step, setStep] = useState<Step>("address");
    const [checkoutId, setCheckoutId] = useState<number | null>(null);

    return (
        <main className={styles.page}>
            <div className={styles.container}>
                <Link href="/cart" className={styles.backLink}>
                    <ArrowLeft size={14} /> Back to Cart
                </Link>
                <div className={styles.pageHeader}>
                    <h1 className={styles.pageTitle}>Checkout</h1>
                    <p className={styles.pageSubtitle}>Step {step === "address" ? "1" : step === "shipping" ? "2" : "3"} of 3</p>
                </div>
                <div className={styles.layout}>
                    <div className={styles.formSection}>
                        {step === "address" && <AddressStep onNext={(id) => { setCheckoutId(id); setStep("shipping"); }} />}
                        {step === "shipping" && checkoutId && <ShippingStep checkoutId={checkoutId} onNext={() => setStep("payment")} onBack={() => setStep("address")} />}
                        {step === "payment" && checkoutId && <PaymentStep checkoutId={checkoutId} onBack={() => setStep("shipping")} />}
                    </div>
                    <aside className={styles.summarySection}>
                        <OrderSummary checkoutId={checkoutId} />
                    </aside>
                </div>
            </div>
        </main>
    );
}
