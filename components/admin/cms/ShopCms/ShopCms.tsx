"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Save,
  Upload,
  X,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import styles from "./ShopCms.module.css";

type ShopContent = {
  bannerImage: string;
  label: string;
  title: string;
  description: string;
};

const INITIAL: ShopContent = {
  bannerImage: "/banner/03.jfif",
  label: "Shop",
  title: "Fragrances for every room",
  description:
    "Explore our collection of premium aroma diffusers, crafted for bedrooms, living spaces, and quiet corners of the home.",
};

/* ================= IMAGE UPLOADER ================= */
function ImageUploader({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setBusy(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      setBusy(false);
    };
    reader.onerror = () => setBusy(false);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className={styles.uploader}>
      <span className={styles.label}>{label}</span>

      <div
        className={`${styles.dropZone} ${
          dragOver ? styles.dropZoneActive : ""
        }`}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        aria-label={label}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="100vw"
              className={styles.previewImg}
              unoptimized
            />
            <button
              type="button"
              className={styles.removeImg}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              aria-label="Remove image"
            >
              <X size={13} strokeWidth={2} />
            </button>
          </>
        ) : (
          <>
            <span className={styles.dropIcon} aria-hidden="true">
              {busy ? (
                <Upload size={18} strokeWidth={1.7} className={styles.spin} />
              ) : (
                <ImageIcon size={18} strokeWidth={1.7} />
              )}
            </span>
            <span className={styles.dropText}>
              {busy ? "Uploading…" : "Click or drop image"}
            </span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={onInputChange}
          tabIndex={-1}
        />
      </div>
    </div>
  );
}

/* ================= MAIN ================= */
export default function ShopCms() {
  const { showToast } = useToast();
  const [content, setContent] = useState<ShopContent>(INITIAL);
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof ShopContent>(
    key: K,
    value: ShopContent[K]
  ) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.log("Save shop content:", content);
    showToast("Shop page updated.");
    setTimeout(() => setSaving(false), 600);
  };

  const handleReset = () => {
    setContent(INITIAL);
    showToast("Reset to original.", "info");
  };

  return (
    <form className={styles.wrap} onSubmit={handleSave}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>Shop Page</h3>
          <p className={styles.headerSubtitle}>
            Edit banner image and heading text for the shop page.
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleReset}
          >
            <RotateCcw size={14} strokeWidth={1.7} />
            Reset
          </button>
          <button type="submit" className={styles.saveBtn} disabled={saving}>
            <Save size={14} strokeWidth={1.8} />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* ============ BANNER ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Banner</h4>
        <ImageUploader
          label="Banner Image"
          value={content.bannerImage}
          onChange={(url) => update("bannerImage", url)}
        />
      </section>

      {/* ============ HEADING ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Heading</h4>

        <div className={styles.field}>
          <label className={styles.label}>Label</label>
          <input
            className={styles.input}
            value={content.label}
            onChange={(e) => update("label", e.target.value)}
            placeholder="e.g. Shop"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            value={content.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Fragrances for every room"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            rows={3}
            value={content.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Write a short description…"
          />
        </div>
      </section>
    </form>
  );
}
