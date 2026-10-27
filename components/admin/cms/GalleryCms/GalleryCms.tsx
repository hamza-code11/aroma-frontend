"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import styles from "./GalleryCms.module.css";

// Hooks Import
import { 
  useGallery, 
  useUploadGalleryImage, 
  useReplaceGalleryImage, 
  useDeleteGalleryImage 
} from "@/hooks/useGallery";

/* ================= SINGLE IMAGE CARD ================= */
function GalleryCard({
  item,
  onReplace,
  onRemove,
  isUploading,
  isReplacing,
  isDeleting,
}: {
  item: { id: number; image: string };
  onReplace: (file: File) => void;
  onRemove: () => void;
  isUploading?: boolean;
  isReplacing?: boolean;
  isDeleting?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    onReplace(file);
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
  const imageUrl = item.image.startsWith('http') 
    ? item.image 
    : `${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.image}`;

  const isBusy = isUploading || isReplacing || isDeleting;

  return (
    <div
      className={`${styles.card} ${dragOver ? styles.cardActive : ""} ${styles.cardFilled}`}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
    >
      <Image
        src={imageUrl}
        alt={`Gallery ${item.id}`}
        fill
        sizes="(max-width: 900px) 50vw, 25vw"
        className={styles.previewImg}
        unoptimized
      />

      {/* Loading Overlay */}
      {isBusy && (
        <div className={styles.overlay} style={{ opacity: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <Loader2 className="animate-spin text-white" size={24} />
        </div>
      )}

      {!isBusy && (
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
      )}

      {!isBusy && (
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
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Fetch Data
  const { data: galleryData, isLoading } = useGallery(1);
  const galleryImages = galleryData?.data || [];

  // Mutations
  const uploadMutation = useUploadGalleryImage();
  const replaceMutation = useReplaceGalleryImage();
  const deleteMutation = useDeleteGalleryImage();

  // Handlers
  const handleUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    uploadMutation.mutate(file, {
      onSuccess: () => showToast("Image uploaded successfully.", "success"),
      onError: (err: any) => showToast(err.response?.data?.message || "Upload failed", "error"),
    });
  };

  const handleReplace = (id: number, file: File) => {
    replaceMutation.mutate(
      { id, image: file },
      {
        onSuccess: () => showToast("Image replaced successfully.", "success"),
        onError: (err: any) => showToast(err.response?.data?.message || "Replace failed", "error"),
      }
    );
  };

  const handleRemove = (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => showToast("Image deleted.", "success"),
      onError: (err: any) => showToast(err.response?.data?.message || "Delete failed", "error"),
    });
  };

  const onUploadInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  return (
    <div className={styles.wrap}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>Gallery</h3>
          <p className={styles.headerSubtitle}>
            {galleryImages.length} image{galleryImages.length === 1 ? "" : "s"} ·
            upload, replace, or delete.
          </p>
        </div>
      </div>

      {/* ============ IMAGES GRID ============ */}
      <section className={styles.section}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Loader2 className="animate-spin mx-auto mb-4" size={28} />
            Loading gallery...
          </div>
        ) : (
          <div className={styles.grid}>
            {galleryImages.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onReplace={(file) => handleReplace(item.id, file)}
                onRemove={() => handleRemove(item.id)}
                isReplacing={replaceMutation.isPending && replaceMutation.variables?.id === item.id}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === item.id}
              />
            ))}

            {/* Add Card (Upload New) */}
            <button
              type="button"
              className={styles.addCard}
              onClick={() => uploadInputRef.current?.click()}
              disabled={uploadMutation.isPending}
              aria-label="Add image"
            >
              <span className={styles.addIcon} aria-hidden="true">
                {uploadMutation.isPending ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  <Plus size={22} strokeWidth={1.7} />
                )}
              </span>
              <span className={styles.addText}>
                {uploadMutation.isPending ? "Uploading..." : "Add Image"}
              </span>
            </button>
            
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={onUploadInputChange}
              tabIndex={-1}
            />
          </div>
        )}
      </section>
    </div>
  );
}
