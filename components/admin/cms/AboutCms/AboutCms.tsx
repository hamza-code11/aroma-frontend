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
import { aboutContent } from "@/data/about";
import { useToast } from "@/components/ui/Toast";
import type { AboutContent, AboutStat } from "@/types/about";
import styles from "./AboutCms.module.css";

const EMPTY_STAT: AboutStat = { value: "", label: "" };

/* ================= INLINE IMAGE UPLOADER ================= */
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
              sizes="140px"
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
export default function AboutCms() {
  const { showToast } = useToast();

  const [content, setContent] = useState<AboutContent>(() =>
    JSON.parse(JSON.stringify(aboutContent))
  );
  const [saving, setSaving] = useState(false);

  /* ---------- Helpers ---------- */
  const updateHero = <K extends keyof AboutContent["hero"]>(
    key: K,
    value: AboutContent["hero"][K]
  ) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }));
  };

  const updateBanner = <K extends keyof AboutContent["banner"]>(
    key: K,
    value: AboutContent["banner"][K]
  ) => {
    setContent((prev) => ({
      ...prev,
      banner: { ...prev.banner, [key]: value },
    }));
  };

  const updateStory = <K extends keyof AboutContent["story"]>(
    key: K,
    value: AboutContent["story"][K]
  ) => {
    setContent((prev) => ({
      ...prev,
      story: { ...prev.story, [key]: value },
    }));
  };

  const updateMV = (
    which: "mission" | "vision",
    key: "title" | "text",
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      missionVision: {
        ...prev.missionVision,
        [which]: { ...prev.missionVision[which], [key]: value },
      },
    }));
  };

  const updateCta = <K extends keyof AboutContent["cta"]>(
    key: K,
    value: AboutContent["cta"][K]
  ) => {
    setContent((prev) => ({
      ...prev,
      cta: { ...prev.cta, [key]: value },
    }));
  };

  /* ---------- Stats ---------- */
  const updateStat = <K extends keyof AboutStat>(
    index: number,
    key: K,
    value: AboutStat[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      stats: prev.stats.map((s, i) =>
        i === index ? { ...s, [key]: value } : s
      ),
    }));
  };

  const addStat = () => {
    setContent((prev) => ({
      ...prev,
      stats: [...prev.stats, { ...EMPTY_STAT }],
    }));
  };

  const removeStat = (index: number) => {
    setContent((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  /* ---------- Story paragraphs ---------- */
  const updateStoryPara = (index: number, value: string) => {
    setContent((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        body: prev.story.body.map((p, i) => (i === index ? value : p)),
      },
    }));
  };

  const addStoryPara = () => {
    setContent((prev) => ({
      ...prev,
      story: { ...prev.story, body: [...prev.story.body, ""] },
    }));
  };

  const removeStoryPara = (index: number) => {
    setContent((prev) => ({
      ...prev,
      story: {
        ...prev.story,
        body: prev.story.body.filter((_, i) => i !== index),
      },
    }));
  };

  /* ---------- Save / Reset ---------- */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.log("Save about content:", content);
    showToast("About page updated.");
    setTimeout(() => setSaving(false), 600);
  };

  const handleReset = () => {
    setContent(JSON.parse(JSON.stringify(aboutContent)));
    showToast("Reset to original.", "info");
  };

  return (
    <form className={styles.wrap} onSubmit={handleSave}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.headerTitle}>About Page</h3>
          <p className={styles.headerSubtitle}>
            Edit hero, banner, stats, story, mission/vision, and CTA.
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

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Primary CTA Label</label>
            <input
              className={styles.input}
              value={content.hero.primaryCta.label}
              onChange={(e) =>
                updateHero("primaryCta", {
                  ...content.hero.primaryCta,
                  label: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Primary CTA Link</label>
            <input
              className={styles.input}
              value={content.hero.primaryCta.href}
              onChange={(e) =>
                updateHero("primaryCta", {
                  ...content.hero.primaryCta,
                  href: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Secondary CTA Label</label>
            <input
              className={styles.input}
              value={content.hero.secondaryCta.label}
              onChange={(e) =>
                updateHero("secondaryCta", {
                  ...content.hero.secondaryCta,
                  label: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Secondary CTA Link</label>
            <input
              className={styles.input}
              value={content.hero.secondaryCta.href}
              onChange={(e) =>
                updateHero("secondaryCta", {
                  ...content.hero.secondaryCta,
                  href: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>

      {/* ============ BANNER ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Banner</h4>

        <ImageUploader
          label="Banner Image"
          value={content.banner.image}
          onChange={(url) => updateBanner("image", url)}
        />
      </section>

      {/* ============ STATS ============ */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h4 className={styles.sectionTitle}>Stats</h4>
          <button type="button" className={styles.addBtn} onClick={addStat}>
            <Plus size={14} strokeWidth={1.8} />
            Add Stat
          </button>
        </div>

        <div className={styles.list}>
          {content.stats.map((stat, i) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.field}>
                <label className={styles.label}>Value</label>
                <input
                  className={styles.input}
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Label</label>
                <input
                  className={styles.input}
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                />
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeStat(i)}
                aria-label="Remove stat"
              >
                <Trash2 size={15} strokeWidth={1.7} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Story</h4>

        <div className={styles.field}>
          <label className={styles.label}>Heading</label>
          <input
            className={styles.input}
            value={content.story.heading}
            onChange={(e) => updateStory("heading", e.target.value)}
          />
        </div>

        <div className={styles.subHead}>
          <label className={styles.label}>Body Paragraphs</label>
          <button
            type="button"
            className={styles.addBtnSmall}
            onClick={addStoryPara}
          >
            <Plus size={13} strokeWidth={2} />
            Add Paragraph
          </button>
        </div>

        <div className={styles.list}>
          {content.story.body.map((para, i) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.field} style={{ flex: 1 }}>
                <textarea
                  className={styles.textarea}
                  rows={2}
                  value={para}
                  onChange={(e) => updateStoryPara(i, e.target.value)}
                />
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeStoryPara(i)}
                aria-label="Remove paragraph"
              >
                <Trash2 size={15} strokeWidth={1.7} />
              </button>
            </div>
          ))}
        </div>

        <ImageUploader
          label="Story Image"
          value={content.story.image}
          onChange={(url) => updateStory("image", url)}
        />
      </section>

      {/* ============ MISSION / VISION ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Mission & Vision</h4>

        <div className={styles.grid2}>
          <div className={styles.subPanel}>
            <p className={styles.subPanelTitle}>Mission</p>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input
                className={styles.input}
                value={content.missionVision.mission.title}
                onChange={(e) => updateMV("mission", "title", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Text</label>
              <textarea
                className={styles.textarea}
                rows={3}
                value={content.missionVision.mission.text}
                onChange={(e) => updateMV("mission", "text", e.target.value)}
              />
            </div>
          </div>

          <div className={styles.subPanel}>
            <p className={styles.subPanelTitle}>Vision</p>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input
                className={styles.input}
                value={content.missionVision.vision.title}
                onChange={(e) => updateMV("vision", "title", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Text</label>
              <textarea
                className={styles.textarea}
                rows={3}
                value={content.missionVision.vision.text}
                onChange={(e) => updateMV("vision", "text", e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>CTA Section</h4>

        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            value={content.cta.title}
            onChange={(e) => updateCta("title", e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Text</label>
          <textarea
            className={styles.textarea}
            rows={2}
            value={content.cta.text}
            onChange={(e) => updateCta("text", e.target.value)}
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Button Label</label>
            <input
              className={styles.input}
              value={content.cta.cta.label}
              onChange={(e) =>
                updateCta("cta", {
                  ...content.cta.cta,
                  label: e.target.value,
                })
              }
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Button Link</label>
            <input
              className={styles.input}
              value={content.cta.cta.href}
              onChange={(e) =>
                updateCta("cta", {
                  ...content.cta.cta,
                  href: e.target.value,
                })
              }
            />
          </div>
        </div>
      </section>
    </form>
  );
}
