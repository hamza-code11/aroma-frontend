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
import type { AboutStat } from "@/types/about";
import styles from "./AboutCms.module.css";

// Hooks Import
import { useAboutCms, useUpdateAboutCms } from "@/hooks/useAboutCms";

// ✅ EMPTY_ABOUT object yahan define kiya hai (imports ke baad, functions se pehle)
const EMPTY_ABOUT = {
  hero: { 
    eyebrow: "", 
    title: "", 
    titleHighlight: "", 
    lead: "", 
    primaryCta: { label: "", href: "" }, 
    secondaryCta: { label: "", href: "" } 
  },
  stats: [],
  banner: { image: "", imageAlt: "" },
  story: { heading: "", body: [""], image: "", imageAlt: "" },
  missionVision: { 
    mission: { title: "", text: "" }, 
    vision: { title: "", text: "" } 
  },
  cta: { title: "", text: "", cta: { label: "", href: "" } },
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
            <Image src={value} alt="Preview" fill sizes="140px" className={styles.previewImg} unoptimized />
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
export default function AboutCms() {
  const { showToast } = useToast();

  const { data: cmsData, isLoading: isLoadingCms } = useAboutCms();
  const updateMutation = useUpdateAboutCms();

  // State - Ab EMPTY_ABOUT use ho raha hai
  const [content, setContent] = useState(() => JSON.parse(JSON.stringify(EMPTY_ABOUT)));

  // File States for Upload
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [storyFile, setStoryFile] = useState<File | null>(null);

  // Populate state when data loads
  useEffect(() => {
    if (cmsData) {
      setContent({
        hero: cmsData.hero,
        stats: cmsData.stats,
        banner: {
          image: cmsData.banner_image 
            ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.banner_image}` 
            : "", // Purana static image hata diya
          imageAlt: "Banner Image", 
        },
        story: {
          heading: cmsData.story.heading,
          body: cmsData.story.body,
          image: cmsData.story.image 
            ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.story.image}` 
            : "", // Purana static image hata diya
          imageAlt: "Story Image",
        },
        missionVision: cmsData.mission_vision,
        cta: cmsData.cta,
      });
    }
  }, [cmsData]);

  /* ---------- Helpers ---------- */
  const updateHero = <K extends keyof typeof content.hero>(key: K, value: (typeof content.hero)[K]) => {
    setContent((prev: any) => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
  };

  const updateBanner = (url: string) => {
    setContent((prev: any) => ({ ...prev, banner: { ...prev.banner, image: url } }));
  };

  const updateStory = <K extends keyof typeof content.story>(key: K, value: (typeof content.story)[K]) => {
    setContent((prev: any) => ({ ...prev, story: { ...prev.story, [key]: value } }));
  };

  const updateMV = (which: "mission" | "vision", key: "title" | "text", value: string) => {
    setContent((prev: any) => ({
      ...prev,
      missionVision: {
        ...prev.missionVision,
        [which]: { ...prev.missionVision[which], [key]: value },
      },
    }));
  };

  const updateCta = <K extends keyof typeof content.cta>(key: K, value: (typeof content.cta)[K]) => {
    setContent((prev: any) => ({ ...prev, cta: { ...prev.cta, [key]: value } }));
  };

  const updateStat = <K extends keyof AboutStat>(index: number, key: K, value: AboutStat[K]) => {
    setContent((prev: any) => ({
      ...prev,
      stats: prev.stats.map((s: any, i: number) => (i === index ? { ...s, [key]: value } : s)),
    }));
  };

  const addStat = () => {
    setContent((prev: any) => ({ ...prev, stats: [...prev.stats, { value: "", label: "" }] }));
  };

  const removeStat = (index: number) => {
    setContent((prev: any) => ({ ...prev, stats: prev.stats.filter((_: any, i: number) => i !== index) }));
  };

  const updateStoryPara = (index: number, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      story: {
        ...prev.story,
        body: prev.story.body.map((p: string, i: number) => (i === index ? value : p)),
      },
    }));
  };

  const addStoryPara = () => {
    setContent((prev: any) => ({ ...prev, story: { ...prev.story, body: [...prev.story.body, ""] } }));
  };

  const removeStoryPara = (index: number) => {
    setContent((prev: any) => ({
      ...prev,
      story: {
        ...prev.story,
        body: prev.story.body.filter((_: string, i: number) => i !== index),
      },
    }));
  };

  /* ---------- Save ---------- */
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    
    // Append JSON parts
    formData.append("hero", JSON.stringify(content.hero));
    formData.append("stats", JSON.stringify(content.stats));
    formData.append("story", JSON.stringify(content.story));
    formData.append("mission_vision", JSON.stringify(content.missionVision));
    formData.append("cta", JSON.stringify(content.cta));

    // Append Files
    if (bannerFile) formData.append("banner_image", bannerFile);
    if (storyFile) formData.append("story_image", storyFile);

    updateMutation.mutate(formData, {
      onSuccess: () => {
        showToast("About page updated successfully.", "success");
        setBannerFile(null);
        setStoryFile(null);
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
        stats: cmsData.stats,
        banner: {
          image: cmsData.banner_image ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.banner_image}` : "",
          imageAlt: "Banner Image",
        },
        story: {
          heading: cmsData.story.heading,
          body: cmsData.story.body,
          image: cmsData.story.image ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${cmsData.story.image}` : "",
          imageAlt: "Story Image",
        },
        missionVision: cmsData.mission_vision,
        cta: cmsData.cta,
      });
    } else {
      setContent(JSON.parse(JSON.stringify(EMPTY_ABOUT)));
    }
    setBannerFile(null);
    setStoryFile(null);
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
          <h3 className={styles.headerTitle}>About Page</h3>
          <p className={styles.headerSubtitle}>Edit hero, banner, stats, story, mission/vision, and CTA.</p>
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

        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Primary CTA Label</label>
            <input className={styles.input} value={content.hero.primaryCta.label} onChange={(e) => updateHero("primaryCta", { ...content.hero.primaryCta, label: e.target.value })} disabled={updateMutation.isPending} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Primary CTA Link</label>
            <input className={styles.input} value={content.hero.primaryCta.href} onChange={(e) => updateHero("primaryCta", { ...content.hero.primaryCta, href: e.target.value })} disabled={updateMutation.isPending} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Secondary CTA Label</label>
            <input className={styles.input} value={content.hero.secondaryCta.label} onChange={(e) => updateHero("secondaryCta", { ...content.hero.secondaryCta, label: e.target.value })} disabled={updateMutation.isPending} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Secondary CTA Link</label>
            <input className={styles.input} value={content.hero.secondaryCta.href} onChange={(e) => updateHero("secondaryCta", { ...content.hero.secondaryCta, href: e.target.value })} disabled={updateMutation.isPending} />
          </div>
        </div>
      </section>

      {/* ============ BANNER ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Banner</h4>
        <ImageUploader label="Banner Image" value={content.banner.image} onChange={updateBanner} onFileChange={setBannerFile} />
      </section>

      {/* ============ STATS ============ */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h4 className={styles.sectionTitle}>Stats</h4>
          <button type="button" className={styles.addBtn} onClick={addStat} disabled={updateMutation.isPending}>
            <Plus size={14} strokeWidth={1.8} /> Add Stat
          </button>
        </div>
        <div className={styles.list}>
          {content.stats.map((stat: AboutStat, i: number) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.field}>
                <label className={styles.label}>Value</label>
                <input className={styles.input} value={stat.value} onChange={(e) => updateStat(i, "value", e.target.value)} disabled={updateMutation.isPending} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Label</label>
                <input className={styles.input} value={stat.label} onChange={(e) => updateStat(i, "label", e.target.value)} disabled={updateMutation.isPending} />
              </div>
              <button type="button" className={styles.removeBtn} onClick={() => removeStat(i)} aria-label="Remove stat" disabled={updateMutation.isPending}>
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
          <input className={styles.input} value={content.story.heading} onChange={(e) => updateStory("heading", e.target.value)} disabled={updateMutation.isPending} />
        </div>

        <div className={styles.subHead}>
          <label className={styles.label}>Body Paragraphs</label>
          <button type="button" className={styles.addBtnSmall} onClick={addStoryPara} disabled={updateMutation.isPending}>
            <Plus size={13} strokeWidth={2} /> Add Paragraph
          </button>
        </div>

        <div className={styles.list}>
          {content.story.body.map((para: string, i: number) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.field} style={{ flex: 1 }}>
                <textarea className={styles.textarea} rows={2} value={para} onChange={(e) => updateStoryPara(i, e.target.value)} disabled={updateMutation.isPending} />
              </div>
              <button type="button" className={styles.removeBtn} onClick={() => removeStoryPara(i)} aria-label="Remove paragraph" disabled={updateMutation.isPending}>
                <Trash2 size={15} strokeWidth={1.7} />
              </button>
            </div>
          ))}
        </div>

        <ImageUploader label="Story Image" value={content.story.image} onChange={(url) => updateStory("image", url)} onFileChange={setStoryFile} />
      </section>

      {/* ============ MISSION / VISION ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>Mission & Vision</h4>
        <div className={styles.grid2}>
          <div className={styles.subPanel}>
            <p className={styles.subPanelTitle}>Mission</p>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input className={styles.input} value={content.missionVision.mission.title} onChange={(e) => updateMV("mission", "title", e.target.value)} disabled={updateMutation.isPending} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Text</label>
              <textarea className={styles.textarea} rows={3} value={content.missionVision.mission.text} onChange={(e) => updateMV("mission", "text", e.target.value)} disabled={updateMutation.isPending} />
            </div>
          </div>
          <div className={styles.subPanel}>
            <p className={styles.subPanelTitle}>Vision</p>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input className={styles.input} value={content.missionVision.vision.title} onChange={(e) => updateMV("vision", "title", e.target.value)} disabled={updateMutation.isPending} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Text</label>
              <textarea className={styles.textarea} rows={3} value={content.missionVision.vision.text} onChange={(e) => updateMV("vision", "text", e.target.value)} disabled={updateMutation.isPending} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>CTA Section</h4>
        <div className={styles.field}>
          <label className={styles.label}>Title</label>
          <input className={styles.input} value={content.cta.title} onChange={(e) => updateCta("title", e.target.value)} disabled={updateMutation.isPending} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Text</label>
          <textarea className={styles.textarea} rows={2} value={content.cta.text} onChange={(e) => updateCta("text", e.target.value)} disabled={updateMutation.isPending} />
        </div>
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Button Label</label>
            <input className={styles.input} value={content.cta.cta.label} onChange={(e) => updateCta("cta", { ...content.cta.cta, label: e.target.value })} disabled={updateMutation.isPending} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Button Link</label>
            <input className={styles.input} value={content.cta.cta.href} onChange={(e) => updateCta("cta", { ...content.cta.cta, href: e.target.value })} disabled={updateMutation.isPending} />
          </div>
        </div>
      </section>
    </form>
  );
}
