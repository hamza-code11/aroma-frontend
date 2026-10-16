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
import { galleryContent } from "@/data/gallery";
import { useToast } from "@/components/ui/Toast";
import type { GalleryContent, GalleryImage } from "@/types/gallery";
import styles from "./GalleryCms.module.css";

const newImage = (): GalleryImage => ({
  id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  image: "",
  imageAlt: "",
});

/* ================= SINGLE IMAGE CARD ================= */
function GalleryCard({
  index,
  item,
  onChange,
  onRemove,
}: {
  index: number;
  item: GalleryImage;
  onChange: (url: string) => void;
  onRemove: () => void;
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
    <div
      className={`${styles.card} ${dragOver ? styles.cardActive : ""} ${
        item.image ? styles.cardFilled : ""
      }`}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
    >
      {item.image ? (
        <>
          <Image
            src={item.image}
            alt={item.imageAlt || `Gallery ${index + 1}`}
            fill
            sizes="(max-width: 900px) 50vw, 25vw"
            className={styles.previewImg}
            unoptimized
          />

          {/* Hover overlay with Replace */}
          <div className={styles.overlay}>
            <button
              type="button"
              className={styles.replaceBtn}
              onClick={openPicker}
              aria-label="Replace image"
            >
              <RefreshCw size={14} strokeWidth={1.8} />
              Replace
            </button>
          </div>

          {/* Delete — top right */}
          <button
            type="button"
            className={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label="Delete image"
          >
            <Trash2 size={13} strokeWidth={2} />
          </button>
        </>
      ) : (
        <button
          type="button"
          className={styles.emptyBtn}
          onClick={openPicker}
          aria-label={`Upload gallery image ${index + 1}`}
        >
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
        </button>
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
  );
}

/* ================= MAIN ================= */
export default function GalleryCms() {
  const { showToast } = useToast();

  const [content, setContent] = useState<GalleryContent>(() =>
    JSON.parse(JSON.stringify(galleryContent))
  );
  const [saving, setSaving] = useState(false);

  const updateImage = (index: number, url: string) => {
    setContent((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, image: url } : img
      ),
    }));
  };

  const removeImage = (index: number) => {
    setContent((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    showToast("Image removed.", "info");
  };

  const addImage = () => {
    setContent((prev) => ({ ...prev, images: [...prev.images, newImage()] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.log("Save gallery content:", content);
    showToast("Gallery updated.");
    setTimeout(() => setSaving(false), 600);
  };

  const handleReset = () => {
    setContent(JSON.parse(JSON.stringify(galleryContent)));
    showToast("Reset to original.", "info");
  };

  return (
    <form className={styles.wrap} onSubmit={handleSave}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>Gallery</h3>
          <p className={styles.headerSubtitle}>
            {content.images.length} image{content.images.length === 1 ? "" : "s"} ·
            upload, replace, or delete.
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

      {/* ============ IMAGES GRID ============ */}
      <section className={styles.section}>
        <div className={styles.grid}>
          {content.images.map((item, i) => (
            <GalleryCard
              key={item.id}
              index={i}
              item={item}
              onChange={(url) => updateImage(i, url)}
              onRemove={() => removeImage(i)}
            />
          ))}

          {/* Add card */}
          <button
            type="button"
            className={styles.addCard}
            onClick={addImage}
            aria-label="Add image"
          >
            <span className={styles.addIcon} aria-hidden="true">
              <Plus size={22} strokeWidth={1.7} />
            </span>
            <span className={styles.addText}>Add Image</span>
          </button>
        </div>
      </section>
    </form>
  );
}
