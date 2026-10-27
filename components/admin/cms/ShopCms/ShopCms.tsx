"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  Upload,
  X,
  Image as ImageIcon,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import styles from "./ShopCms.module.css";

// Hooks Import
import { useShopCms, useUpdateShopCms } from "@/hooks/useShopCms";

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
  onFileChange,
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
    onChange(URL.createObjectURL(file)); // Instant preview
    onFileChange(file); // Save file for backend
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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    onFileChange(null);
  };

  return (
    <div className={styles.uploader}>
      <span className={styles.label}>{label}</span>

      <div
        className={`${styles.dropZone} ${dragOver ? styles.dropZoneActive : ""}`}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        aria-label={label}
      >
        {value ? (
          <>
            <Image src={value} alt="Preview" fill sizes="100vw" className={styles.previewImg} unoptimized />
            <button type="button" className={styles.removeImg} onClick={handleRemove} aria-label="Remove image">
              <X size={13} strokeWidth={2} />
            </button>
          </>
        ) : (
          <>
            <span className={styles.dropIcon} aria-hidden="true">
              {busy ? <Upload size={18} strokeWidth={1.7} className={styles.spin} /> : <ImageIcon size={18} strokeWidth={1.7} />}
            </span>
            <span className={styles.dropText}>{busy ? "Uploading…" : "Click or drop image"}</span>
          </>
        )}
        <input ref={inputRef} type="file" accept="image/*" className={styles.fileInput} onChange={onInputChange} tabIndex={-1} />
      </div>
    </div>
  );
}

/* ================= MAIN ================= */
export default function ShopCms() {
  const { showToast } = useToast();

  const { data: cmsData, isLoading } = useShopCms();
  const updateMutation = useUpdateShopCms();

  const [content, setContent] = useState<ShopContent>(INITIAL);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Populate state when data loads
  useEffect(() => {
    if (cmsData) {
      setContent({
        bannerImage: cmsData.banner_image
          ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.banner_image}`
          : INITIAL.bannerImage,
        label: cmsData.eyebrow || INITIAL.label,
        title: cmsData.title || INITIAL.title,
        description: cmsData.description || INITIAL.description,
      });
    }
  }, [cmsData]);

  const update = <K extends keyof ShopContent>(key: K, value: ShopContent[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("eyebrow", content.label);
    formData.append("title", content.title);
    formData.append("description", content.description);

    if (bannerFile) {
      formData.append("banner_image", bannerFile);
    }

    updateMutation.mutate(formData, {
      onSuccess: () => {
        showToast("Shop page updated successfully.", "success");
        setBannerFile(null);
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || "Failed to update content.", "error");
      }
    });
  };

  const handleReset = () => {
    if (cmsData) {
      setContent({
        bannerImage: cmsData.banner_image
          ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.banner_image}`
          : INITIAL.bannerImage,
        label: cmsData.eyebrow || INITIAL.label,
        title: cmsData.title || INITIAL.title,
        description: cmsData.description || INITIAL.description,
      });
    } else {
      setContent(INITIAL);
    }
    setBannerFile(null);
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
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>Shop Page</h3>
          <p className={styles.headerSubtitle}>Edit banner image and heading text for the shop page.</p>
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

      {/* BANNER */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Banner</h4>
        <ImageUploader
          label="Banner Image"
          value={content.bannerImage}
          onChange={(url) => update("bannerImage", url)}
          onFileChange={setBannerFile}
        />
      </section>

      {/* HEADING */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Heading</h4>
        <div className={styles.field}>
          <label className={styles.label}>Label</label>
          <input className={styles.input} value={content.label} onChange={(e) => update("label", e.target.value)} placeholder="e.g. Shop" disabled={updateMutation.isPending} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={content.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Fragrances for every room" disabled={updateMutation.isPending} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} rows={3} value={content.description} onChange={(e) => update("description", e.target.value)} placeholder="Write a short description…" disabled={updateMutation.isPending} />
        </div>
      </section>
    </form>
  );
}
