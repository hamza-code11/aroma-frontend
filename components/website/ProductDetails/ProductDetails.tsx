"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import type { Product } from "@/types/product";
import styles from "./ProductDetails.module.css";

type Props = {
  product: Product;
  related: Product[];
};

type TabKey = "description" | "details" | "shipping";

export default function ProductDetails({ product, related }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const hasSale =
    product.sale_price !== null && product.sale_price < product.regular_price;
  const discountPercent = hasSale
    ? Math.round(
        ((product.regular_price - product.sale_price!) /
          product.regular_price) *
          100
      )
    : 0;

  const outOfStock = product.stock_quantity <= 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ================= BREADCRUMB ================= */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/shop" className={styles.crumbLink}>
            <ArrowLeft size={14} strokeWidth={1.5} />
            Shop
          </Link>
          <span className={styles.crumbSep}>/</span>
          <span className={styles.crumbCurrent}>{product.name}</span>
        </nav>

        {/* ================= MAIN — 2 columns ================= */}
        <div className={styles.main}>
          {/* LEFT */}
          <ImageGallery
            mainImage={product.main_image}
            images={product.images}
            name={product.name}
            saleBadge={product.sale_price ? "Sale" : null}
            outOfStock={product.stock_quantity === 0}
          />

          {/* RIGHT — ab koi prop nahi, ProductInfo khud hooks use karta hai */}
          <ProductInfo product={product} />
        </div>

        {/* ================= RELATED ================= */}
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}
