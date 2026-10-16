"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { bannerContent } from "@/data/banner";
import { useToast } from "@/components/ui/Toast";
import type { BannerContent, BannerCard } from "@/types/banner";
import styles from "./BannerCms.module.css";

const newCard = (): BannerCard => ({
  id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label: "",
  title: "",
  description: "",
});

/* ================= IMAGE UPLOADER (single, full-width) ================= */
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

  const openPicker = () => inputRef.current?.click();

  return (
    <div className={styles.uploader}>
      <span className={styles.label}>{label}</span>

      <div
        className={`${styles.dropZone} ${
          dragOver ? styles.dropZoneActive : ""
        } ${value ? styles.dropZoneFilled : ""}`}
        onClick={openPicker}
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPicker();
        }}
        aria-label={label}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt="Banner preview"
              fill
              sizes="100vw"
              className={styles.previewImg}
              unoptimized
            />
            <div className={styles.overlay}>
              <button
                type="button"
                className={styles.replaceBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  openPicker();
                }}
                aria-label="Replace image"
              >
                <RefreshCw size={14} strokeWidth={1.8} />
                Replace Image
              </button>
            </div>
          </>
        ) : (
          <>
            <span className={styles.dropIcon} aria-hidden="true">
              {busy ? (
                <Upload size={20} strokeWidth={1.7} className={styles.spin} />
              ) : (
                <ImageIcon size={20} strokeWidth={1.7} />
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
export default function BannerCms() {
  const { showToast } = useToast();

  const [content, setContent] = useState<BannerContent>(() =>
    JSON.parse(JSON.stringify(bannerContent))
  );
  const [saving, setSaving] = useState(false);

  /* ---------- Image ---------- */
  const updateImage = (url: string) => {
    setContent((prev) => ({ ...prev, image: url }));
  };

  /* ---------- Cards ---------- */
  const updateCard = <K extends keyof BannerCard>(
    index: number,
    key: K,
    value: BannerCard[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.map((c, i) =>
        i === index ? { ...c, [key]: value } : c
      ),
    }));
  };

  const addCard = () => {
    setContent((prev) => ({ ...prev, cards: [...prev.cards, newCard()] }));
    showToast("Card added.", "info");
  };

  const removeCard = (index: number) => {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, i) => i !== index),
    }));
    showToast("Card removed.", "info");
  };

  /* ---------- Save / Reset ---------- */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.log("Save banner content:", content);
    showToast("Banner updated.");
    setTimeout(() => setSaving(false), 600);
  };

  const handleReset = () => {
    setContent(JSON.parse(JSON.stringify(bannerContent)));
    showToast("Reset to original.", "info");
  };

  return (
    <form className={styles.wrap} onSubmit={handleSave}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>Banner</h3>
          <p className={styles.headerSubtitle}>
            Banner image + content cards. Add or remove cards as needed.
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

      {/* ============ IMAGE ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Banner Image</h4>
        <ImageUploader
          label="Upload Banner Image"
          value={content.image}
          onChange={updateImage}
        />
      </section>

      {/* ============ CONTENT CARDS ============ */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h4 className={styles.sectionTitle}>Content Cards</h4>
          <button type="button" className={styles.addBtn} onClick={addCard}>
            <Plus size={14} strokeWidth={1.8} />
            Add Card
          </button>
        </div>

        {content.cards.length === 0 ? (
          <div className={styles.emptyCards}>
            <p className={styles.emptyCardsTitle}>No cards yet</p>
            <p className={styles.emptyCardsText}>
              Click &quot;Add Card&quot; to create your first banner card.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {content.cards.map((card, i) => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIndex}>Card {i + 1}</span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeCard(i)}
                    aria-label={`Delete card ${i + 1}`}
                  >
                    <Trash2 size={15} strokeWidth={1.7} />
                  </button>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Label</label>
                  <input
                    className={styles.input}
                    value={card.label}
                    onChange={(e) => updateCard(i, "label", e.target.value)}
                    placeholder="e.g. Signature Collection"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Title</label>
                  <input
                    className={styles.input}
                    value={card.title}
                    onChange={(e) => updateCard(i, "title", e.target.value)}
                    placeholder="e.g. Pure Essence Crafted To Linger"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea
                    className={styles.textarea}
                    rows={3}
                    value={card.description}
                    onChange={(e) =>
                      updateCard(i, "description", e.target.value)
                    }
                    placeholder="Write a short description…"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </form>
  );
}
