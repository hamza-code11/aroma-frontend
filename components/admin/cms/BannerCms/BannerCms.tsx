"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Save, Plus, Trash2, Upload, Image as ImageIcon, RotateCcw, RefreshCw, Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { BannerCard, BannerContent } from "@/types/banner";
import styles from "./BannerCms.module.css";
import { useBannerCms, useUpdateBannerCms } from "@/hooks/useBannerCms";

// ✅ Fallback data (kyunki bannerContent delete ho chuka hai)
const EMPTY_BANNER: BannerContent = {
  image: "",
  imageAlt: "Banner Image",
  cards: [],
};

const newCard = (): BannerCard => ({
  id: `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label: "",
  title: "",
  description: "",
});

function ImageUploader({
  label, value, onChange, onFileChange
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onFileChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setBusy(true);
    onChange(URL.createObjectURL(file));
    onFileChange(file);
    setBusy(false);
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
        className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""} ${value ? styles.dropZoneFilled : ""}`}
        onClick={openPicker}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openPicker(); }}
        aria-label={label}
      >
        {value ? (
          <>
            <Image src={value} alt="Banner preview" fill sizes="100vw" className={styles.previewImg} unoptimized />
            <div className={styles.overlay}>
              <button type="button" className={styles.replaceBtn} onClick={(e) => { e.stopPropagation(); openPicker(); }} aria-label="Replace image">
                <RefreshCw size={14} strokeWidth={1.8} /> Replace Image
              </button>
            </div>
          </>
        ) : (
          <>
            <span className={styles.dropIcon} aria-hidden="true">
              {busy ? <Upload size={20} strokeWidth={1.7} className={styles.spin} /> : <ImageIcon size={20} strokeWidth={1.7} />}
            </span>
            <span className={styles.dropText}>{busy ? "Uploading…" : "Click or drop image"}</span>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className={styles.fileInput} onChange={onInputChange} tabIndex={-1} />
      </div>
    </div>
  );
}

export default function BannerCms() {
  const { showToast } = useToast();
  const { data: cmsData, isLoading } = useBannerCms();
  const updateMutation = useUpdateBannerCms();

  // State ab EMPTY_BANNER se initialize ho raha hai
  const [content, setContent] = useState<BannerContent>(() => JSON.parse(JSON.stringify(EMPTY_BANNER)));
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (cmsData) {
      setContent({
        image: cmsData.image ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.image}` : "",
        imageAlt: "Banner Image",
        cards: cmsData.cards || [],
      });
    }
  }, [cmsData]);

  const updateImage = (url: string) => setContent((prev) => ({ ...prev, image: url }));

  const updateCard = <K extends keyof BannerCard>(index: number, key: K, value: BannerCard[K]) => {
    setContent((prev) => ({
      ...prev,
      cards: prev.cards.map((c, i) => (i === index ? { ...c, [key]: value } : c)),
    }));
  };

  const addCard = () => {
    setContent((prev) => ({ ...prev, cards: [...prev.cards, newCard()] }));
    showToast("Card added.", "info");
  };

  const removeCard = (index: number) => {
    setContent((prev) => ({ ...prev, cards: prev.cards.filter((_, i) => i !== index) }));
    showToast("Card removed.", "info");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cards", JSON.stringify(content.cards));
    if (imageFile) formData.append("image", imageFile);

    updateMutation.mutate(formData, {
      onSuccess: () => {
        showToast("Banner updated successfully.", "success");
        setImageFile(null);
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || "Failed to update banner.", "error");
      }
    });
  };

  const handleReset = () => {
    if (cmsData) {
      setContent({
        image: cmsData.image ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.image}` : "",
        imageAlt: "Banner Image",
        cards: cmsData.cards || [],
      });
    } else {
      setContent(JSON.parse(JSON.stringify(EMPTY_BANNER)));
    }
    setImageFile(null);
    showToast("Reset to saved data.", "info");
  };

  if (isLoading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <Loader2 className="animate-spin mx-auto mb-4" size={28} />
        Loading CMS content...
      </div>
    );
  }

  return (
    <form className={styles.wrap} onSubmit={handleSave}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>Banner</h3>
          <p className={styles.headerSubtitle}>Banner image + content cards. Add or remove cards as needed.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.resetBtn} onClick={handleReset}>
            <RotateCcw size={14} strokeWidth={1.7} /> Reset
          </button>
          <button type="submit" className={styles.saveBtn} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <><Loader2 size={14} className="animate-spin" /> Saving…</>
            ) : (
              <><Save size={14} strokeWidth={1.8} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Banner Image</h4>
        <ImageUploader
          label="Upload Banner Image"
          value={content.image}
          onChange={updateImage}
          onFileChange={setImageFile}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h4 className={styles.sectionTitle}>Content Cards</h4>
          <button type="button" className={styles.addBtn} onClick={addCard} disabled={updateMutation.isPending}>
            <Plus size={14} strokeWidth={1.8} /> Add Card
          </button>
        </div>

        {content.cards.length === 0 ? (
          <div className={styles.emptyCards}>
            <p className={styles.emptyCardsTitle}>No cards yet</p>
            <p className={styles.emptyCardsText}>Click &quot;Add Card&quot; to create your first banner card.</p>
          </div>
        ) : (
          <div className={styles.list}>
            {content.cards.map((card, i) => (
              <div key={card.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIndex}>Card {i + 1}</span>
                  <button type="button" className={styles.removeBtn} onClick={() => removeCard(i)} aria-label={`Delete card ${i + 1}`} disabled={updateMutation.isPending}>
                    <Trash2 size={15} strokeWidth={1.7} />
                  </button>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Label</label>
                  <input className={styles.input} value={card.label} onChange={(e) => updateCard(i, "label", e.target.value)} placeholder="e.g. Signature Collection" disabled={updateMutation.isPending} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Title</label>
                  <input className={styles.input} value={card.title} onChange={(e) => updateCard(i, "title", e.target.value)} placeholder="e.g. Pure Essence Crafted To Linger" disabled={updateMutation.isPending} />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <textarea className={styles.textarea} rows={3} value={card.description} onChange={(e) => updateCard(i, "description", e.target.value)} placeholder="Write a short description…" disabled={updateMutation.isPending} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </form>
  );
}
