"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Star, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { WeightUnit, DimensionUnit, ProductPayload } from "@/types/product";
import styles from "./ProductCreate.module.css";

import { useCreateProduct } from "@/hooks/products/useProducts";
import { useCategories } from "@/hooks/categories/useCategories";

const WEIGHT_UNITS: WeightUnit[] = ["kg", "g", "lb", "oz"];
const DIMENSION_UNITS: DimensionUnit[] = ["cm", "mm", "in"];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function ProductCreate() {
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const createMutation = useCreateProduct();

  // Form States
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  
  const [regularPrice, setRegularPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [stock, setStock] = useState("");
  
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [shippingClass, setShippingClass] = useState("standard");
  
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>("cm");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [isActive, setIsActive] = useState(true);
  
  // Error state ab array hai taake multiple errors ek sath show hon
  const [errors, setErrors] = useState<string[]>([]);

  // Memory Leak se bachne ke liye cleanup
  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mainImagePreview, galleryPreviews]);

  useEffect(() => {
    if (categories.length > 0 && categoryId === 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const onName = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const onSlug = (v: string) => {
    setSlugTouched(true);
    setSlug(slugify(v));
  };

  const fail = (msgs: string | string[]) => {
    if (Array.isArray(msgs)) {
      setErrors(msgs);
    } else {
      setErrors([msgs]);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter(f => f.type.startsWith("image/") && f.size <= 2048 * 1024);
    
    if (files.length === 0) {
      return fail("Please upload valid images (PNG, JPG, WEBP) under 2MB.");
    }

    const newPreviews: string[] = [];
    const newFiles: File[] = [];

    files.forEach(file => {
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (!mainImageFile && !mainImagePreview) {
      setMainImageFile(newFiles[0]);
      setMainImagePreview(newPreviews[0]);
      setGalleryFiles([...galleryFiles, ...newFiles.slice(1)]);
      setGalleryPreviews([...galleryPreviews, ...newPreviews.slice(1)]);
    } else {
      setGalleryFiles([...galleryFiles, ...newFiles]);
      setGalleryPreviews([...galleryPreviews, ...newPreviews]);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(galleryPreviews[index]);
    setGalleryFiles(galleryFiles.filter((_, i) => i !== index));
    setGalleryPreviews(galleryPreviews.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    setMainImageFile(null);
    setMainImagePreview("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Strict Frontend Validation
    const valErrors: string[] = [];
    if (name.trim().length < 2) valErrors.push("Product name must be at least 2 characters.");
    if (!sku.trim()) valErrors.push("SKU is required.");
    if (!categoryId) valErrors.push("Please select a category.");
    if (!(parseFloat(regularPrice) > 0)) valErrors.push("Regular price must be greater than 0.");
    if (salePrice && parseFloat(salePrice) >= parseFloat(regularPrice)) valErrors.push("Sale price must be less than regular price.");
    if (parseInt(stock, 10) < 0 || isNaN(parseInt(stock, 10))) valErrors.push("Stock quantity cannot be negative.");
    if (!(parseFloat(weight) > 0)) valErrors.push("Weight must be greater than 0.");
    if (!mainImageFile) valErrors.push("Main image is required.");

    if (valErrors.length > 0) {
      return fail(valErrors);
    }

    const payload: ProductPayload = {
      category_id: categoryId,
      name: name.trim(),
      sku: sku.trim(),
      description: description.trim(),
      regular_price: parseFloat(regularPrice),
      sale_price: salePrice.trim() ? parseFloat(salePrice) : null,
      stock_quantity: parseInt(stock, 10),
      weight: parseFloat(weight),
      weight_unit: weightUnit,
      length: length.trim() ? parseFloat(length) : null,
      width: width.trim() ? parseFloat(width) : null,
      height: height.trim() ? parseFloat(height) : null,
      dimension_unit: dimensionUnit,
      shipping_class: shippingClass.trim() || "standard",
      is_active: isActive,
      main_image: mainImageFile,
      images: galleryFiles,
    };

    createMutation.mutate(payload, {
      onSuccess: () => {
        showToast(`Product "${name}" created successfully.`, "success");
        router.push("/admin/products");
      },
      onError: (err: any) => {
        // Backend Errors Handle Karein (Laravel 422)
        if (err.response?.status === 422 && err.response?.data?.errors) {
          const errorList = Object.values(err.response.data.errors).flat() as string[];
          fail(errorList);
        } else {
          fail(err.response?.data?.message || "Failed to create product. Please try again.");
        }
      }
    });
  };

  const isLoading = createMutation.isPending || categoriesLoading;

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin/products" className={styles.backLink}>
            <ArrowLeft size={14} strokeWidth={1.6} />
            Back to Products
          </Link>
          <h2 className={styles.title}>Create Product</h2>
          <p className={styles.subtitle}>Fill in the details below to add a new product.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/products" className={styles.cancelBtn}>Cancel</Link>
          <button type="submit" form="create-product-form" className={styles.primaryBtn} disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="animate-spin" size={15} /> Creating...</>
            ) : (
              <><Plus size={15} strokeWidth={1.8} /> Create Product</>
            )}
          </button>
        </div>
      </header>

      {/* ERROR DISPLAY BLOCK */}
      {errors.length > 0 && (
        <div className={styles.error} role="alert" style={{ display: 'block' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
            <AlertCircle size={18} />
            Please fix the following errors:
          </div>
          <ul style={{ margin: 0, paddingLeft: '24px', listStyleType: 'disc' }}>
            {errors.map((err, i) => (
              <li key={i} style={{ marginBottom: '4px' }}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form id="create-product-form" onSubmit={handleSubmit} noValidate>
        {/* Baqi form fields same rahenge, bas dhayan dein ke jaroorat ke mutabiq disabled={isLoading} laga hua hai */}
        <div className={styles.layout}>
          <div className={styles.left}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>Name <span className={styles.req}>*</span></label>
                  <input className={styles.input} value={name}
                    onChange={(e) => onName(e.target.value)}
                    placeholder="e.g. Aura Essential Oil Diffuser" autoFocus disabled={isLoading} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Slug</label>
                  <input className={styles.input} value={slug}
                    onChange={(e) => onSlug(e.target.value)}
                    placeholder="aura-essential-oil-diffuser" disabled={isLoading} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>SKU <span className={styles.req}>*</span></label>
                  <input className={styles.input} value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="ISH-AD-001" disabled={isLoading} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Category <span className={styles.req}>*</span></label>
                  <select className={styles.select} value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    disabled={categoriesLoading || isLoading}>
                    <option value={0} disabled>Select a category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this product…" maxLength={1000} disabled={isLoading} />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Images</h3>
              <p className={styles.hint}>
                First image will be the Main Image. Other images will go to the gallery.
              </p>

              {mainImagePreview && (
                <div style={{ marginBottom: '20px' }}>
                  <label className={styles.label}>Main Image</label>
                  <div className={styles.previewGrid}>
                    <div className={`${styles.previewItem} ${styles.previewItemMain}`}>
                      <Image src={mainImagePreview} alt="Main" fill sizes="140px" className={styles.previewImg} unoptimized />
                      <span className={styles.mainBadge}>
                        <Star size={10} strokeWidth={2.2} fill="currentColor" /> Main
                      </span>
                      <button type="button" className={styles.removeBtn} onClick={removeMainImage} disabled={isLoading}>
                        <X size={13} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {galleryPreviews.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <label className={styles.label}>Gallery Images</label>
                  <div className={styles.previewGrid}>
                    {galleryPreviews.map((url, i) => (
                      <div key={i} className={styles.previewItem}>
                        <Image src={url} alt={`Gallery ${i}`} fill sizes="140px" className={styles.previewImg} unoptimized />
                        <button type="button" className={styles.removeBtn} onClick={() => removeImage(i)} disabled={isLoading}>
                          <X size={13} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className={styles.dropZone} style={{ opacity: isLoading ? 0.5 : 1 }}>
                <span className={styles.dropIcon}><ImageIcon size={22} strokeWidth={1.6} /></span>
                <span className={styles.dropText}>Click to upload or drag & drop</span>
                <span className={styles.dropHint}>PNG, JPG, WEBP — max 2MB each</span>
                <input type="file" accept="image/*" multiple ref={fileInputRef}
                  className={styles.fileInput}
                  onChange={handleFileSelect} disabled={isLoading} />
              </label>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Status</h3>
              <label className={styles.checkbox}>
                <input type="checkbox" checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)} disabled={isLoading} />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxText}>Active (visible on storefront)</span>
              </label>
            </section>
          </div>

          <aside className={styles.right}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Pricing</h3>
              <div className={styles.field}>
                <label className={styles.label}>Regular Price <span className={styles.req}>*</span></label>
                <input type="number" step="0.01" min="0" className={styles.input}
                  value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)}
                  placeholder="49.99" disabled={isLoading} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Sale Price</label>
                <input type="number" step="0.01" min="0" className={styles.input}
                  value={salePrice} onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="Optional" disabled={isLoading} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Stock <span className={styles.req}>*</span></label>
                <input type="number" step="1" min="0" className={styles.input}
                  value={stock} onChange={(e) => setStock(e.target.value)}
                  placeholder="25" disabled={isLoading} />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Shipping</h3>
              <div className={styles.field}>
                <label className={styles.label}>Weight <span className={styles.req}>*</span></label>
                <div className={styles.unitRow}>
                  <input type="number" step="0.01" min="0" className={styles.input}
                    value={weight} onChange={(e) => setWeight(e.target.value)}
                    placeholder="1.2" disabled={isLoading} />
                  <select className={styles.unitSelect} value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as WeightUnit)} disabled={isLoading}>
                    {WEIGHT_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Shipping Class</label>
                <input type="text" className={styles.input} value={shippingClass}
                  onChange={(e) => setShippingClass(e.target.value)}
                  placeholder="standard" disabled={isLoading} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Dimension Unit</label>
                <select className={styles.select} value={dimensionUnit}
                  onChange={(e) => setDimensionUnit(e.target.value as DimensionUnit)} disabled={isLoading}>
                  {DIMENSION_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                </select>
              </div>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <label className={styles.label}>Length</label>
                  <input type="number" step="0.1" min="0" className={styles.input}
                    value={length} onChange={(e) => setLength(e.target.value)} placeholder="18" disabled={isLoading} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Width</label>
                  <input type="number" step="0.1" min="0" className={styles.input}
                    value={width} onChange={(e) => setWidth(e.target.value)} placeholder="18" disabled={isLoading} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Height</label>
                  <input type="number" step="0.1" min="0" className={styles.input}
                    value={height} onChange={(e) => setHeight(e.target.value)} placeholder="25" disabled={isLoading} />
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}
