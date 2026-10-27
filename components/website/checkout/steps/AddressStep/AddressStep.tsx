"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/components/ui/Toast";
import AddressStepSkeleton from "./AddressStepSkeleton";
import styles from "./AddressStep.module.css";

export default function AddressStep({ onNext }: { onNext: (id: number) => void }) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        country: "",
        address: "",
        city: "",
        postal_code: "",
    });

    // Simulating initial load (agar future me fetch karna ho)
    const [isReady, setIsReady] = useState(false);
    useEffect(() => { setIsReady(true); }, []);

    if (!isReady) return <AddressStepSkeleton />;

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post("/checkout/address", form);
            sessionStorage.setItem("checkout_address", JSON.stringify(form));
            showToast("Address saved!", "success");
            onNext(res.data.checkout_id);
        } catch (err: any) {
            showToast(err.response?.data?.message || "Failed to save address", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <header className={styles.header}>
                <h1 className={styles.title}>Shipping Details</h1>
                <p className={styles.subtitle}>Step 1 of 3</p>
            </header>

            <div className={styles.field}>
                <label className={styles.label}>Full Name</label>
                <input className={styles.input} value={form.full_name} onChange={(e) => handleChange("full_name", e.target.value)} required />
            </div>
            {/* ... baqi fields same rahenge (phone, country, address, grid2 for city/postal) ... */}
            <div className={styles.field}>
                <label className={styles.label}>Phone Number</label>
                <input className={styles.input} value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Country</label>
                <input className={styles.input} value={form.country} onChange={(e) => handleChange("country", e.target.value)} required />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Address</label>
                <input className={styles.input} value={form.address} onChange={(e) => handleChange("address", e.target.value)} required />
            </div>
            <div className={styles.grid2}>
                <div className={styles.field}>
                    <label className={styles.label}>City</label>
                    <input className={styles.input} value={form.city} onChange={(e) => handleChange("city", e.target.value)} required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Postal Code</label>
                    <input className={styles.input} value={form.postal_code} onChange={(e) => handleChange("postal_code", e.target.value)} required />
                </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Saving..." : "Continue to Shipping"}
            </button>
        </form>
    );
}
