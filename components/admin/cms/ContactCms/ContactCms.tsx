"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  Upload,
  X,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import { contactContent } from "@/data/contact";
import { useToast } from "@/components/ui/Toast";
import type {
  ContactContent,
  ContactInfoItem,
  ContactFaqItem,
} from "@/types/contact";
import styles from "./ContactCms.module.css";

/* ================= IMAGE UPLOADER (full-width) ================= */
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
export default function ContactCms() {
  const { showToast } = useToast();

  const [content, setContent] = useState<ContactContent>(() =>
    JSON.parse(JSON.stringify(contactContent))
  );
  const [saving, setSaving] = useState(false);

  /* ---------- Hero ---------- */
  const updateHero = <K extends keyof ContactContent["hero"]>(
    key: K,
    value: ContactContent["hero"][K]
  ) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }));
  };

  /* ---------- Banner ---------- */
  const updateBannerImage = (url: string) => {
    setContent((prev) => ({
      ...prev,
      banner: { ...prev.banner, image: url },
    }));
  };

  /* ---------- Info cards ---------- */
  const updateInfo = (
    index: number,
    key: "label" | "value",
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      info: prev.info.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addInfo = () => {
    const newItem: ContactInfoItem = {
      id: `info-${Date.now()}`,
      label: "",
      value: "",
      icon: "mail",
    };
    setContent((prev) => ({ ...prev, info: [...prev.info, newItem] }));
  };

  const removeInfo = (index: number) => {
    setContent((prev) => ({
      ...prev,
      info: prev.info.filter((_, i) => i !== index),
    }));
  };

  /* ---------- FAQ ---------- */
  const updateFaq = <K extends keyof ContactContent["faq"]>(
    key: K,
    value: ContactContent["faq"][K]
  ) => {
    setContent((prev) => ({
      ...prev,
      faq: { ...prev.faq, [key]: value },
    }));
  };

  const updateFaqItem = <K extends keyof ContactFaqItem>(
    index: number,
    key: K,
    value: ContactFaqItem[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: prev.faq.items.map((f, i) =>
          i === index ? { ...f, [key]: value } : f
        ),
      },
    }));
  };

  const addFaq = () => {
    const newItem: ContactFaqItem = {
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
    };
    setContent((prev) => ({
      ...prev,
      faq: { ...prev.faq, items: [...prev.faq.items, newItem] },
    }));
  };

  const removeFaq = (index: number) => {
    setContent((prev) => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: prev.faq.items.filter((_, i) => i !== index),
      },
    }));
  };

  /* ---------- Save / Reset ---------- */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.log("Save contact content:", content);
    showToast("Contact page updated.");
    setTimeout(() => setSaving(false), 600);
  };

  const handleReset = () => {
    setContent(JSON.parse(JSON.stringify(contactContent)));
    showToast("Reset to original.", "info");
  };

  return (
    <form className={styles.wrap} onSubmit={handleSave}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>Contact Page</h3>
          <p className={styles.headerSubtitle}>
            Edit hero, banner, info cards, and FAQ.
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

      {/* ============ HERO ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Hero</h4>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Eyebrow</label>
            <input
              className={styles.input}
              value={content.hero.eyebrow}
              onChange={(e) => updateHero("eyebrow", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title Highlight</label>
            <input
              className={styles.input}
              value={content.hero.titleHighlight}
              onChange={(e) => updateHero("titleHighlight", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            value={content.hero.title}
            onChange={(e) => updateHero("title", e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Lead</label>
          <textarea
            className={styles.textarea}
            rows={3}
            value={content.hero.lead}
            onChange={(e) => updateHero("lead", e.target.value)}
          />
        </div>
      </section>

      {/* ============ BANNER ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Banner</h4>
        <ImageUploader
          label="Banner Image"
          value={content.banner.image}
          onChange={updateBannerImage}
        />
      </section>

      {/* ============ INFO CARDS ============ */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h4 className={styles.sectionTitle}>Info Cards</h4>
          <button type="button" className={styles.addBtn} onClick={addInfo}>
            <Plus size={14} strokeWidth={1.8} />
            Add Card
          </button>
        </div>

        <div className={styles.list}>
          {content.info.map((item, i) => (
            <div key={item.id} className={styles.cardRow}>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>Label</label>
                  <input
                    className={styles.input}
                    value={item.label}
                    onChange={(e) => updateInfo(i, "label", e.target.value)}
                    placeholder="e.g. Email"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Value</label>
                  <input
                    className={styles.input}
                    value={item.value}
                    onChange={(e) => updateInfo(i, "value", e.target.value)}
                    placeholder="e.g. hello@ishinearoma.com"
                  />
                </div>
              </div>
              <div className={styles.cardRowActions}>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeInfo(i)}
                  aria-label="Remove info card"
                >
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
          <button type="button" className={styles.addBtn} onClick={addFaq}>
            <Plus size={14} strokeWidth={1.8} />
            Add FAQ
          </button>
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Eyebrow</label>
            <input
              className={styles.input}
              value={content.faq.eyebrow}
              onChange={(e) => updateFaq("eyebrow", e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              value={content.faq.title}
              onChange={(e) => updateFaq("title", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.list}>
          {content.faq.items.map((item, i) => (
            <div key={item.id} className={styles.faqCard}>
              <div className={styles.field}>
                <label className={styles.label}>Question</label>
                <input
                  className={styles.input}
                  value={item.question}
                  onChange={(e) =>
                    updateFaqItem(i, "question", e.target.value)
                  }
                  placeholder="e.g. Do you ship across Pakistan?"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Answer</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={item.answer}
                  onChange={(e) =>
                    updateFaqItem(i, "answer", e.target.value)
                  }
                  placeholder="Write the answer…"
                />
              </div>

              <div className={styles.faqFooter}>
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeFaq(i)}
                  aria-label="Remove FAQ"
                >
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
