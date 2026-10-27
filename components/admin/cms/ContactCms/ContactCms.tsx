"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type {
  ContactContent,
  ContactInfoItem,
  ContactFaqItem,
} from "@/types/contact"; 
import styles from "./ContactCms.module.css";

// Hooks Import
import { useContactCms, useUpdateContactCms } from "@/hooks/useContactCms";

// ✅ Fallback Data (Purane static data ki jagah)
const FALLBACK_CONTACT: ContactContent = {
  hero: { eyebrow: "", title: "", titleHighlight: "", lead: "" },
  banner: { image: "", imageAlt: "" },
  info: [],
  faq: { eyebrow: "", title: "", items: [] },
  form: {
    title: "",
    text: "",
    submitLabel: "",
    successMessage: "",
    errorMessage: "",
    fields: [],
  },
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
export default function ContactCms() {
  const { showToast } = useToast();

  // Fetch existing data
  const { data: cmsData, isLoading: isLoadingCms } = useContactCms();
  const updateMutation = useUpdateContactCms();

  // State ab FALLBACK_CONTACT se initialize ho raha hai
  const [content, setContent] = useState<ContactContent>(() =>
    JSON.parse(JSON.stringify(FALLBACK_CONTACT))
  );
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  // Populate state when data loads
  useEffect(() => {
    if (cmsData) {
      setContent({
        hero: cmsData.hero,
        banner: {
          image: cmsData.banner_image 
            ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.banner_image}` 
            : "",
          imageAlt: "Banner Image", 
        },
        info: cmsData.info || [],
        faq: cmsData.faq || { eyebrow: "", title: "", items: [] },
        form: FALLBACK_CONTACT.form, // Form stays static
      });
    }
  }, [cmsData]);

  /* ---------- Hero ---------- */
  const updateHero = <K extends keyof ContactContent["hero"]>(key: K, value: ContactContent["hero"][K]) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  /* ---------- Banner ---------- */
  const updateBannerImage = (url: string) => {
    setContent((prev) => ({ ...prev, banner: { ...prev.banner, image: url } }));
  };

  /* ---------- Info cards ---------- */
  const updateInfo = (index: number, key: "label" | "value", value: string) => {
    setContent((prev) => ({
      ...prev,
      info: prev.info.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    }));
  };

  const addInfo = () => {
    const newItem: ContactInfoItem = { id: `info-${Date.now()}`, label: "", value: "", icon: "mail" };
    setContent((prev) => ({ ...prev, info: [...prev.info, newItem] }));
  };

  const removeInfo = (index: number) => {
    setContent((prev) => ({ ...prev, info: prev.info.filter((_, i) => i !== index) }));
  };

  /* ---------- FAQ ---------- */
  const updateFaq = <K extends keyof ContactContent["faq"]>(key: K, value: ContactContent["faq"][K]) => {
    setContent((prev) => ({ ...prev, faq: { ...prev.faq, [key]: value } }));
  };

  const updateFaqItem = <K extends keyof ContactFaqItem>(index: number, key: K, value: ContactFaqItem[K]) => {
    setContent((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: prev.faq.items.map((f, i) => (i === index ? { ...f, [key]: value } : f)),
      },
    }));
  };

  const addFaq = () => {
    const newItem: ContactFaqItem = { id: `faq-${Date.now()}`, question: "", answer: "" };
    setContent((prev) => ({ ...prev, faq: { ...prev.faq, items: [...prev.faq.items, newItem] } }));
  };

  const removeFaq = (index: number) => {
    setContent((prev) => ({
      ...prev,
      faq: { ...prev.faq, items: prev.faq.items.filter((_, i) => i !== index) },
    }));
  };

  /* ---------- Save ---------- */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    
    // Append JSON parts
    formData.append("hero", JSON.stringify(content.hero));
    formData.append("info", JSON.stringify(content.info));
    formData.append("faq", JSON.stringify(content.faq));

    // Append Banner File if selected
    if (bannerFile) {
      formData.append("banner_image", bannerFile);
    }

    updateMutation.mutate(formData, {
      onSuccess: () => {
        showToast("Contact page updated successfully.", "success");
        setBannerFile(null); // Reset file state after save
      },
      onError: (err: any) => {
        showToast(err.response?.data?.message || "Failed to update content.", "error");
      }
    });
  };

  const handleReset = () => {
    if (cmsData) {
      setContent({
        hero: cmsData.hero,
        banner: {
          image: cmsData.banner_image ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.banner_image}` : "",
          imageAlt: "Banner Image",
        },
        info: cmsData.info || [],
        faq: cmsData.faq || { eyebrow: "", title: "", items: [] },
        form: FALLBACK_CONTACT.form,
      });
    } else {
      setContent(JSON.parse(JSON.stringify(FALLBACK_CONTACT)));
    }
    setBannerFile(null);
    showToast("Reset to saved data.", "info");
  };

  if (isLoadingCms) {
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
          <h3 className={styles.headerTitle}>Contact Page</h3>
          <p className={styles.headerSubtitle}>Edit hero, banner, info cards, and FAQ.</p>
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

      {/* ============ HERO ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Hero</h4>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Eyebrow</label>
            <input className={styles.input} value={content.hero.eyebrow} onChange={(e) => updateHero("eyebrow", e.target.value)} disabled={updateMutation.isPending} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title Highlight</label>
            <input className={styles.input} value={content.hero.titleHighlight} onChange={(e) => updateHero("titleHighlight", e.target.value)} disabled={updateMutation.isPending} />
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={content.hero.title} onChange={(e) => updateHero("title", e.target.value)} disabled={updateMutation.isPending} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Lead</label>
          <textarea className={styles.textarea} rows={3} value={content.hero.lead} onChange={(e) => updateHero("lead", e.target.value)} disabled={updateMutation.isPending} />
        </div>
      </section>

      {/* ============ BANNER ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Banner</h4>
        <ImageUploader 
          label="Banner Image" 
          value={content.banner.image} 
          onChange={updateBannerImage} 
          onFileChange={setBannerFile} 
        />
      </section>

      {/* ============ INFO CARDS ============ */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h4 className={styles.sectionTitle}>Info Cards</h4>
          <button type="button" className={styles.addBtn} onClick={addInfo} disabled={updateMutation.isPending}>
            <Plus size={14} strokeWidth={1.8} /> Add Card
          </button>
        </div>
        <div className={styles.list}>
          {content.info.map((item, i) => (
            <div key={item.id} className={styles.cardRow}>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>Label</label>
                  <input className={styles.input} value={item.label} onChange={(e) => updateInfo(i, "label", e.target.value)} placeholder="e.g. Email" disabled={updateMutation.isPending} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Value</label>
                  <input className={styles.input} value={item.value} onChange={(e) => updateInfo(i, "value", e.target.value)} placeholder="e.g. hello@ishinearoma.com" disabled={updateMutation.isPending} />
                </div>
              </div>
              <div className={styles.cardRowActions}>
                <button type="button" className={styles.removeBtn} onClick={() => removeInfo(i)} aria-label="Remove info card" disabled={updateMutation.isPending}>
                  <Trash2 size={15} strokeWidth={1.7} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h4 className={styles.sectionTitle}>FAQ</h4>
          <button type="button" className={styles.addBtn} onClick={addFaq} disabled={updateMutation.isPending}>
            <Plus size={14} strokeWidth={1.8} /> Add FAQ
          </button>
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Eyebrow</label>
            <input className={styles.input} value={content.faq.eyebrow} onChange={(e) => updateFaq("eyebrow", e.target.value)} disabled={updateMutation.isPending} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input className={styles.input} value={content.faq.title} onChange={(e) => updateFaq("title", e.target.value)} disabled={updateMutation.isPending} />
          </div>
        </div>
        <div className={styles.list}>
          {content.faq.items.map((item, i) => (
            <div key={item.id} className={styles.faqCard}>
              <div className={styles.field}>
                <label className={styles.label}>Question</label>
                <input className={styles.input} value={item.question} onChange={(e) => updateFaqItem(i, "question", e.target.value)} placeholder="e.g. Do you ship across Pakistan?" disabled={updateMutation.isPending} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Answer</label>
                <textarea className={styles.textarea} rows={3} value={item.answer} onChange={(e) => updateFaqItem(i, "answer", e.target.value)} placeholder="Write the answer…" disabled={updateMutation.isPending} />
              </div>
              <div className={styles.faqFooter}>
                <button type="button" className={styles.removeBtn} onClick={() => removeFaq(i)} aria-label="Remove FAQ" disabled={updateMutation.isPending}>
                  <Trash2 size={15} strokeWidth={1.7} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </form>
  );
}
