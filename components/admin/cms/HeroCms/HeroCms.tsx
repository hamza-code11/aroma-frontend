"use client";

import { useState, useEffect } from "react";
import { Save, RotateCcw, Loader2, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useHeroCms, useUpdateHeroCms } from "@/hooks/useHeroCms";
import type { HeroCms as HeroCmsType } from "@/types/hero-cms";
import styles from "./HeroCms.module.css";

const INITIAL: Partial<HeroCmsType> = {
  label: "",
  title: "",
  description: "",
  primary_btn_label: "",
  primary_btn_link: "",
  secondary_btn_label: "",
  secondary_btn_link: "",
};

export default function HeroCms() {
  const { showToast } = useToast();
  const { data: cmsData, isLoading } = useHeroCms();
  const updateMutation = useUpdateHeroCms();

  const [form, setForm] = useState<Partial<HeroCmsType>>(INITIAL);

  // Populate form when data loads
  useEffect(() => {
    if (cmsData) {
      setForm(cmsData);
    }
  }, [cmsData]);

  const updateField = (key: keyof HeroCmsType, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form, {
      onSuccess: () => {
        showToast("Hero section updated successfully!", "success");
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || "Failed to update.", "error");
      },
    });
  };

  const handleReset = () => {
    if (cmsData) {
      setForm(cmsData);
      showToast("Reset to saved data.", "info");
    } else {
      setForm(INITIAL);
      showToast("Reset to default.", "info");
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "50px", textAlign: "center", color: "var(--text-secondary)" }}>
        <Loader2 className="animate-spin mx-auto mb-4" size={28} />
        Loading Hero content...
      </div>
    );
  }

  const isLoadingMut = updateMutation.isPending;

  return (
    <form className={styles.wrap} onSubmit={handleSave}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>Hero Section</h3>
          <p className={styles.headerSubtitle}>
            Edit the main headline, description and buttons of your homepage.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.resetBtn} onClick={handleReset} disabled={isLoadingMut}>
            <RotateCcw size={14} strokeWidth={1.7} />
            Reset
          </button>
          <button type="submit" className={styles.saveBtn} disabled={isLoadingMut}>
            {isLoadingMut ? (
              <><Loader2 size={14} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={14} strokeWidth={1.8} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Text Content</h4>

        <div className={styles.field}>
          <label className={styles.label}>Label (Eyebrow)</label>
          <input
            className={styles.input}
            value={form.label || ""}
            onChange={(e) => updateField("label", e.target.value)}
            placeholder="e.g. Luxury Aroma Collection"
            disabled={isLoadingMut}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            value={form.title || ""}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g. Fragrances That Stay"
            disabled={isLoadingMut}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            rows={4}
            value={form.description || ""}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Experience the pure essence of nature..."
            disabled={isLoadingMut}
          />
        </div>
      </section>

      {/* BUTTONS SECTION */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Call to Action Buttons</h4>

        <div className={styles.buttonGrid}>
          {/* Primary Button */}
          <div className={styles.buttonGroup}>
            <p className={styles.groupTitle}>Primary Button</p>
            <div className={styles.field}>
              <label className={styles.label}>Label</label>
              <input
                className={styles.input}
                value={form.primary_btn_label || ""}
                onChange={(e) => updateField("primary_btn_label", e.target.value)}
                placeholder="e.g. Explore Collection"
                disabled={isLoadingMut}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Link <LinkIcon size={12} style={{ display: "inline", marginLeft: "4px" }} />
              </label>
              <input
                className={styles.input}
                value={form.primary_btn_link || ""}
                onChange={(e) => updateField("primary_btn_link", e.target.value)}
                placeholder="e.g. /shop or #collection"
                disabled={isLoadingMut}
              />
            </div>
          </div>

          {/* Secondary Button */}
          <div className={styles.buttonGroup}>
            <p className={styles.groupTitle}>Secondary Button</p>
            <div className={styles.field}>
              <label className={styles.label}>Label</label>
              <input
                className={styles.input}
                value={form.secondary_btn_label || ""}
                onChange={(e) => updateField("secondary_btn_label", e.target.value)}
                placeholder="e.g. How It Works"
                disabled={isLoadingMut}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>
                Link <LinkIcon size={12} style={{ display: "inline", marginLeft: "4px" }} />
              </label>
              <input
                className={styles.input}
                value={form.secondary_btn_link || ""}
                onChange={(e) => updateField("secondary_btn_link", e.target.value)}
                placeholder="e.g. /about or #how-it-works"
                disabled={isLoadingMut}
              />
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}