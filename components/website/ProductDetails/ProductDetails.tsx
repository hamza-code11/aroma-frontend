"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import styles from "./ProductDetails.module.css";

import { useProducts } from "@/hooks/products/useProducts";
import ProductDetailsSkeleton from "@/components/website/skeletons/ProductDetailsSkeleton/ProductDetailsSkeleton";

type TabKey = "description" | "details" | "shipping";

type Props = {
  slug: string;
};

export default function ProductDetails({ slug }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  // Fetch all products and find the one with the matching slug
  const { data: products = [], isLoading, isError } = useProducts();

  const product = useMemo(() => {
    return products.find((p) => p.slug === slug && p.is_active);
  }, [products, slug]);

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter(
      (p) =>
        p.is_active &&
        p.category_id === product.category_id &&
        p.id !== product.id
    ).slice(0, 8); // Max 8 related products
  }, [products, product]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: "center", padding: "100px 0" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "16px" }}>Product not found</h1>
          <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/shop" className={styles.crumbLink} style={{ display: "inline-flex", background: "var(--accent-primary)", color: "var(--on-accent)", padding: "12px 24px", borderRadius: "100px" }}>
            <ArrowLeft size={16} style={{ marginRight: "8px" }} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* BREADCRUMB */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/shop" className={styles.crumbLink}>
            <ArrowLeft size={14} strokeWidth={1.5} />
            Shop
          </Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbCurrent}>{product.name}</span>
        </nav>

        {/* MAIN */}
        <div className={styles.main}>
          <ImageGallery
            mainImage={product.main_image}
            images={product.images}
            name={product.name}
            saleBadge={product.sale_price ? "Sale" : null}
            outOfStock={product.stock_quantity === 0}
          />
          <ProductInfo product={product} />
        </div>

        {/* RELATED */}
        {related.length > 0 && <RelatedProducts products={related} />}
      </div>
    </div>
  );
}
