"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Star, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Product, WeightUnit, DimensionUnit } from "@/types/product";
import type { Category } from "@/types/category";
import styles from "./ProductEdit.module.css";

const WEIGHT_UNITS: WeightUnit[] = ["kg", "g", "lb", "oz"];
const DIMENSION_UNITS: DimensionUnit[] = ["cm", "mm", "in"];

type Props = { product: Product; categories: Category[] };

export default function ProductEdit({ product, categories }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [sku, setSku] = useState(product.sku);
  const [description, setDescription] = useState(product.description);
  const [categoryId, setCategoryId] = useState(product.category_id);
  const [regularPrice, setRegularPrice] = useState(String(product.regular_price));
  const [salePrice, setSalePrice] = useState(
    product.sale_price !== null ? String(product.sale_price) : ""
  );
  const [stock, setStock] = useState(String(product.stock_quantity));
  const [weight, setWeight] = useState(String(product.weight));
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(product.weight_unit);
  const [shippingClass, setShippingClass] = useState(product.shipping_class ?? "");
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>(product.dimension_unit);
  const [length, setLength] = useState(product.length !== null ? String(product.length) : "");
  const [width, setWidth] = useState(product.width !== null ? String(product.width) : "");
  const [height, setHeight] = useState(product.height !== null ? String(product.height) : "");
  const [images, setImages] = useState<string[]>(
    product.images.length > 0 ? product.images : [product.main_image]
  );
  const [mainImage, setMainImage] = useState(product.main_image);
  const [isActive, setIsActive] = useState(product.is_active);
  const [error, setError] = useState("");

  const handleImages = (urls: string[]) => {
    setImages(urls);
    if (!urls.includes(mainImage)) setMainImage(urls[0] ?? "");
  };

  const fail = (msg: string) => {
    setError(msg);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return fail("Enter a name.");
    if (!/^[a-z0-9-]+$/.test(slug)) return fail("Invalid slug.");
    if (sku.trim().length < 2) return fail("Enter a SKU.");
    if (!categoryId) return fail("Select a category.");
    if (!(parseFloat(regularPrice) > 0)) return fail("Enter regular price.");
    if (parseInt(stock, 10) < 0) return fail("Enter stock.");
    if (!(parseFloat(weight) > 0)) return fail("Enter weight.");
    if (images.length === 0) return fail("Upload at least one image.");

    const payload: Product = {
      ...product,
      category_id: categoryId,
      name: name.trim(),
      slug: slug.trim(),
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
      shipping_class: shippingClass.trim() || null,
      main_image: mainImage,
      images,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };

    console.log("Update product:", payload);
    showToast(`Product "${payload.name}" updated.`);
    setTimeout(() => router.push("/admin/product"), 700);
  };

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
          <Link href="/admin/product" className={styles.cancelBtn}>Cancel</Link>
          <button type="submit" form="edit-product-form" className={styles.primaryBtn}>
            <Save size={15} strokeWidth={1.8} />
            Save Changes
          </button>
        </div>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <form id="edit-product-form" onSubmit={handleSubmit} noValidate>
        <div className={styles.layout}>
          <div className={styles.left}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <div className={styles.grid2}>
                <div className={styles.field}>
                  <label className={styles.label}>Name <span className={styles.req}>*</span></label>
                  <input className={styles.input} value={name}
                    onChange={(e) => setName(e.target.value)} autoFocus />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Slug <span className={styles.req}>*</span></label>
                  <input className={styles.input} value={slug}
                    onChange={(e) => setSlug(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>SKU <span className={styles.req}>*</span></label>
                  <input className={styles.input} value={sku}
                    onChange={(e) => setSku(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Category <span className={styles.req}>*</span></label>
                  <select className={styles.select} value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}>
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
                  maxLength={500} />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Images</h3>
              <p className={styles.hint}>
                Click the star on any image to set it as the main image.
              </p>

              {images.length > 0 && (
                <div className={styles.previewGrid}>
                  {images.map((url, i) => {
                    const isMain = url === mainImage;
                    return (
                      <div key={`${url}-${i}`}
                        className={`${styles.previewItem} ${isMain ? styles.previewItemMain : ""}`}>
                        <Image src={url} alt={`Image ${i + 1}`} fill sizes="140px"
                          className={styles.previewImg} unoptimized />
                        {isMain && (
                          <span className={styles.mainBadge}>
                            <Star size={10} strokeWidth={2.2} fill="currentColor" />
                            Main
                          </span>
                        )}
                        <button type="button"
                          className={`${styles.starBtn} ${isMain ? styles.starBtnActive : ""}`}
                          onClick={() => setMainImage(url)}
                          disabled={isMain}
                          aria-label={isMain ? "Main image" : "Set as main"}>
                          <Star size={14} strokeWidth={1.8}
                            fill={isMain ? "currentColor" : "none"} />
                        </button>
                        <button type="button" className={styles.removeBtn}
                          onClick={() => handleImages(images.filter((_, idx) => idx !== i))}
                          aria-label="Remove">
                          <X size={13} strokeWidth={2} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <label className={styles.dropZone}>
                <span className={styles.dropIcon}>
                  <ImageIcon size={22} strokeWidth={1.6} />
                </span>
                <span className={styles.dropText}>Click to upload or drag & drop</span>
                <span className={styles.dropHint}>PNG, JPG, WEBP — unlimited images</span>
                <input type="file" accept="image/*" multiple
                  className={styles.fileInput}
                  onChange={async (e) => {
                    const files = Array.from(e.target.files ?? []).filter((f) =>
                      f.type.startsWith("image/")
                    );
                    if (!files.length) return;
                    const urls = await Promise.all(
                      files.map(
                        (file) =>
                          new Promise<string>((resolve) => {
                            const r = new FileReader();
                            r.onload = () => resolve(r.result as string);
                            r.readAsDataURL(file);
                          })
                      )
                    );
                    handleImages([...images, ...urls]);
                    e.target.value = "";
                  }} />
              </label>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Status</h3>
              <label className={styles.checkbox}>
                <input type="checkbox" checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)} />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxText}>
                  Active (visible on storefront)
                </span>
              </label>
            </section>
          </div>

          <aside className={styles.right}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Pricing</h3>
              <div className={styles.field}>
                <label className={styles.label}>Regular Price <span className={styles.req}>*</span></label>
                <input type="number" step="0.01" min="0" className={styles.input}
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Sale Price</label>
                <input type="number" step="0.01" min="0" className={styles.input}
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="Optional" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Stock <span className={styles.req}>*</span></label>
                <input type="number" step="1" min="0" className={styles.input}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)} />
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Shipping</h3>
              <div className={styles.field}>
                <label className={styles.label}>Weight <span className={styles.req}>*</span></label>
                <div className={styles.unitRow}>
                  <input type="number" step="0.01" min="0" className={styles.input}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)} />
                  <select className={styles.unitSelect} value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}>
                    {WEIGHT_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Shipping Class</label>
                <input type="text" className={styles.input}
                  value={shippingClass}
                  onChange={(e) => setShippingClass(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Dimension Unit</label>
                <select className={styles.select} value={dimensionUnit}
                  onChange={(e) => setDimensionUnit(e.target.value as DimensionUnit)}>
                  {DIMENSION_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className={styles.grid3}>
                <div className={styles.field}>
                  <label className={styles.label}>Length</label>
                  <input type="number" step="0.1" min="0" className={styles.input}
                    value={length}
                    onChange={(e) => setLength(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Width</label>
                  <input type="number" step="0.1" min="0" className={styles.input}
                    value={width}
                    onChange={(e) => setWidth(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Height</label>
                  <input type="number" step="0.1" min="0" className={styles.input}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)} />
                </div>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}
