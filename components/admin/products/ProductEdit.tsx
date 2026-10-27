"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Star, ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { WeightUnit, DimensionUnit, ProductPayload } from "@/types/product";
import styles from "./ProductEdit.module.css";

import { useProduct, useUpdateProduct } from "@/hooks/products/useProducts";
import { useCategories } from "@/hooks/categories/useCategories";

const WEIGHT_UNITS: WeightUnit[] = ["kg", "g", "lb", "oz"];
const DIMENSION_UNITS: DimensionUnit[] = ["cm", "mm", "in"];

type Props = { productId: number };

export default function ProductEdit({ productId }: Props) {
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: product, isLoading: productLoading, isError } = useProduct(productId);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const updateMutation = useUpdateProduct();

  // Form States
  const [name, setName] = useState("");
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
  
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  // Images State
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingMainImage, setExistingMainImage] = useState("");
  
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [newMainImage, setNewMainImage] = useState<File | null>(null);
  const [newMainPreview, setNewMainPreview] = useState("");

  // Cleanup Memory
  useEffect(() => {
    return () => {
      if (newMainPreview) URL.revokeObjectURL(newMainPreview);
      newPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newMainPreview, newPreviews]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setSku(product.sku);
      setDescription(product.description);
      setCategoryId(product.category_id);
      
      setRegularPrice(String(product.regular_price));
      setSalePrice(product.sale_price !== null ? String(product.sale_price) : "");
      setStock(String(product.stock_quantity));
      
      setWeight(String(product.weight));
      setWeightUnit(product.weight_unit);
      setShippingClass(product.shipping_class ?? "standard");
      setDimensionUnit(product.dimension_unit);
      
      setLength(product.length !== null ? String(product.length) : "");
      setWidth(product.width !== null ? String(product.width) : "");
      setHeight(product.height !== null ? String(product.height) : "");
      
      setIsActive(product.is_active);
      
      setExistingMainImage(product.main_image);
      setExistingImages(product.images || []);
    }
  }, [product]);

  const fail = (msg: string | string[]) => {
    setErrors(Array.isArray(msg) ? msg : [msg]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter(f => f.type.startsWith("image/") && f.size <= 2048 * 1024);
    
    if (files.length === 0) {
      return fail("Please upload valid images (PNG, JPG, WEBP) under 2MB.");
    }

    const newPreviewsArray: string[] = [];
    files.forEach(file => newPreviewsArray.push(URL.createObjectURL(file)));

    // Agar main image kahin bhi nahi hai, toh pehli nayi image ko main banayein
    if (!existingMainImage && !newMainImage) {
      setNewMainImage(files[0]);
      setNewMainPreview(newPreviewsArray[0]);
      setNewImages([...newImages, ...files.slice(1)]);
      setNewPreviews([...newPreviews, ...newPreviewsArray.slice(1)]);
    } else {
      // Warna saari nayi images gallery mein jayengi
      setNewImages([...newImages, ...files]);
      setNewPreviews([...newPreviews, ...newPreviewsArray]);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExistingImage = (url: string) => {
    if (url === existingMainImage) setExistingMainImage("");
    setExistingImages(existingImages.filter(img => img !== url));
  };

  const removeNewImage = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewImages(newImages.filter((_, i) => i !== index));
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
  };

  const removeNewMainImage = () => {
    if (newMainPreview) URL.revokeObjectURL(newMainPreview);
    setNewMainImage(null);
    setNewMainPreview("");
  };

  // FIX: Purani Gallery Image ko Main banana
  const setExistingAsMain = (url: string) => {
    const oldMain = existingMainImage;
    
    // 1. Main image update karein
    setExistingMainImage(url);
    
    // 2. List se is image ko hata kar, purani main image ko list mein dalein
    setExistingImages(prev => {
      const filtered = prev.filter(img => img !== url);
      if (oldMain) return [...filtered, oldMain];
      return filtered;
    });
  };

  // FIX: Nayi Gallery Image ko Main banana
  const setNewAsMain = (index: number) => {
    const fileToMakeMain = newImages[index];
    const previewToMakeMain = newPreviews[index];
    
    // 1. Nayi image ko Main set karein
    setNewMainImage(fileToMakeMain);
    setNewMainPreview(previewToMakeMain);

    // 2. Baqi list se us image ko hata dein
    const remainingFiles = newImages.filter((_, i) => i !== index);
    const remainingPreviews = newPreviews.filter((_, i) => i !== index);

    // 3. Agar pehle se koi nayi main image thi, toh usko wapas gallery mein daalein
    if (newMainImage && newMainPreview) {
      setNewImages([...remainingFiles, newMainImage]);
      setNewPreviews([...remainingPreviews, newMainPreview]);
    } else {
      setNewImages(remainingFiles);
      setNewPreviews(remainingPreviews);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const valErrors: string[] = [];
    if (name.trim().length < 2) valErrors.push("Product name must be at least 2 characters.");
    if (!sku.trim()) valErrors.push("SKU is required.");
    if (!categoryId) valErrors.push("Please select a category.");
    if (!(parseFloat(regularPrice) > 0)) valErrors.push("Regular price must be greater than 0.");
    if (salePrice && parseFloat(salePrice) >= parseFloat(regularPrice)) valErrors.push("Sale price must be less than regular price.");
    if (parseInt(stock, 10) < 0 || isNaN(parseInt(stock, 10))) valErrors.push("Stock quantity cannot be negative.");
    if (!(parseFloat(weight) > 0)) valErrors.push("Weight must be greater than 0.");
    if (!existingMainImage && !newMainImage) valErrors.push("Main image is required.");

    if (valErrors.length > 0) {
      return fail(valErrors);
    }

    const payload: Partial<ProductPayload> = {
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
    };

    if (newMainImage) payload.main_image = newMainImage;
    if (newImages.length > 0) payload.images = newImages;

    updateMutation.mutate(
      { id: productId, payload },
      {
        onSuccess: () => {
          showToast(`Product "${name}" updated successfully.`, "success");
          router.push("/admin/products");
        },
        onError: (err: any) => {
          if (err.response?.status === 422 && err.response?.data?.errors) {
            const errorList = Object.values(err.response.data.errors).flat() as string[];
            fail(errorList);
          } else {
            fail(err.response?.data?.message || "Failed to update product. Please try again.");
          }
        }
      }
    );
  };

  const isLoading = productLoading || categoriesLoading || updateMutation.isPending;

  if (productLoading || categoriesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  if (isError || !product) {
    return <div className="p-10 text-center text-red-500">Product not found.</div>;
  }

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link href="/admin/products" className={styles.backLink}>
            <ArrowLeft size={14} strokeWidth={1.6} />
            Back to Products
          </Link>
          <h2 className={styles.title}>Edit Product</h2>
          <p className={styles.subtitle}>Update the details for &quot;{product.name}&quot;.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/products" className={styles.cancelBtn}>Cancel</Link>
          <button type="submit" form="edit-product-form" className={styles.primaryBtn} disabled={isLoading}>
            {updateMutation.isPending ? (
              <><Loader2 className="animate-spin" size={15} /> Saving...</>
            ) : (
              <><Save size={15} strokeWidth={1.8} /> Save Changes</>
            )}
          </button>
        </div>
      </header>

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

      <form id="edit-product-form" onSubmit={handleSubmit} noValidate>
        <div className={styles.layout}>
          <div className={styles.left}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>Name <span className={styles.req}>*</span></label>
                  <input className={styles.input} value={name}
                    onChange={(e) => setName(e.target.value)} disabled={isLoading} autoFocus />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>SKU <span className={styles.req}>*</span></label>
                  <input className={styles.input} value={sku}
                    onChange={(e) => setSku(e.target.value)} disabled={isLoading} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Category <span className={styles.req}>*</span></label>
                  <select className={styles.select} value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))} disabled={isLoading}>
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
                  onChange={(e) => setDescription(e.target.value)} maxLength={1000} disabled={isLoading} />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Images</h3>
              <p className={styles.hint}>
                Click the star on any image to set it as the main image.
              </p>

              {/* Existing Images */}
              {(existingMainImage || existingImages.length > 0) && (
                <div style={{ marginBottom: '20px' }}>
                  <label className={styles.label}>Current Images</label>
                  <div className={styles.previewGrid}>
                    {/* Main Existing Image */}
                    {existingMainImage && (
                      <div className={`${styles.previewItem} ${styles.previewItemMain}`}>
                        <Image src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${existingMainImage}`} alt="Main" fill sizes="140px" className={styles.previewImg} unoptimized />
                        <span className={styles.mainBadge}><Star size={10} /> Main</span>
                        <button type="button" className={styles.removeBtn} onClick={() => setExistingMainImage("")} disabled={isLoading}>
                          <X size={13} strokeWidth={2} />
                        </button>
                      </div>
                    )}
                    {/* Gallery Existing Images */}
                    {existingImages.map((url, i) => (
                      <div key={i} className={styles.previewItem}>
                        <Image src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${url}`} alt={`Old ${i}`} fill sizes="140px" className={styles.previewImg} unoptimized />
                        <button type="button" className={styles.starBtn} onClick={() => setExistingAsMain(url)} disabled={isLoading} title="Set as main">
                          <Star size={14} strokeWidth={1.8} fill="none" />
                        </button>
                        <button type="button" className={styles.removeBtn} onClick={() => removeExistingImage(url)} disabled={isLoading}>
                          <X size={13} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {(newMainPreview || newPreviews.length > 0) && (
                <div style={{ marginBottom: '20px' }}>
                  <label className={styles.label}>New Images</label>
                  <div className={styles.previewGrid}>
                    {/* Main New Image */}
                    {newMainPreview && (
                      <div className={`${styles.previewItem} ${styles.previewItemMain}`}>
                        <Image src={newMainPreview} alt="New Main" fill sizes="140px" className={styles.previewImg} unoptimized />
                        <span className={styles.mainBadge}><Star size={10} /> Main</span>
                        <button type="button" className={styles.removeBtn} onClick={removeNewMainImage} disabled={isLoading}>
                          <X size={13} strokeWidth={2} />
                        </button>
                      </div>
                    )}
                    {/* Gallery New Images */}
                    {newPreviews.map((url, i) => (
                      <div key={i} className={styles.previewItem}>
                        <Image src={url} alt={`New ${i}`} fill sizes="140px" className={styles.previewImg} unoptimized />
                        <button type="button" className={styles.starBtn} onClick={() => setNewAsMain(i)} disabled={isLoading} title="Set as main">
                          <Star size={14} strokeWidth={1.8} fill="none" />
                        </button>
                        <button type="button" className={styles.removeBtn} onClick={() => removeNewImage(i)} disabled={isLoading}>
                          <X size={13} strokeWidth={2} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <label className={styles.dropZone} style={{ opacity: isLoading ? 0.5 : 1 }}>
                <span className={styles.dropIcon}><ImageIcon size={22} strokeWidth={1.6} /></span>
                <span className={styles.dropText}>Click to upload new images</span>
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
                  value={regularPrice} onChange={(e) => setRegularPrice(e.target.value)} disabled={isLoading} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Sale Price</label>
                <input type="number" step="0.01" min="0" className={styles.input}
                  value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="Optional" disabled={isLoading} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Stock <span className={styles.req}>*</span></label>
                <input type="number" step="1" min="0" className={styles.input}
                  value={stock} onChange={(e) => setStock(e.target.value)} disabled={isLoading} />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Shipping</h3>
              <div className={styles.field}>
                <label className={styles.label}>Weight <span className={styles.req}>*</span></label>
                <div className={styles.unitRow}>
                  <input type="number" step="0.01" min="0" className={styles.input}
                    value={weight} onChange={(e) => setWeight(e.target.value)} disabled={isLoading} />
                  <select className={styles.unitSelect} value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as WeightUnit)} disabled={isLoading}>
                    {WEIGHT_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Shipping Class</label>
                <input type="text" className={styles.input}
                  value={shippingClass} onChange={(e) => setShippingClass(e.target.value)} disabled={isLoading} />
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
                    value={length} onChange={(e) => setLength(e.target.value)} disabled={isLoading} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Width</label>
                  <input type="number" step="0.1" min="0" className={styles.input}
                    value={width} onChange={(e) => setWidth(e.target.value)} disabled={isLoading} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Height</label>
                  <input type="number" step="0.1" min="0" className={styles.input}
                    value={height} onChange={(e) => setHeight(e.target.value)} disabled={isLoading} />
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}
