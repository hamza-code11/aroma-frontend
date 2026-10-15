"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import PageBanner from "@/components/website/banner/ShopBanner";
import ProductCard from "@/globalComponents/product/ProductCard";
import { products } from "@/data/product";
import { categories } from "@/data/category";
import type { Product } from "@/types/product";
import styles from "./Shop.module.css";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<number | "all">("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());

  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active),
    []
  );

  const filtered = useMemo(() => {
    let list: Product[] = products.filter((p) => p.is_active);

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category_id === activeCategory);
    }

    switch (sort) {
      case "price-asc":
        list = [...list].sort(
          (a, b) =>
            (a.sale_price ?? a.regular_price) -
            (b.sale_price ?? b.regular_price)
        );
        break;
      case "price-desc":
        list = [...list].sort(
          (a, b) =>
            (b.sale_price ?? b.regular_price) -
            (a.sale_price ?? a.regular_price)
        );
        break;
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return list;
  }, [activeCategory, sort]);

  const handleAddToCart = (product: Product) => {
    // TODO: yahan apna cart logic laga do
    console.log("Add to cart:", product);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) next.delete(product.id);
      else next.add(product.id);
      return next;
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ================= HERO BANNER ================= */}
        <PageBanner/>

        {/* ================= TOOLBAR ================= */}
        <div className={styles.toolbar}>
          <nav className={styles.tabs} aria-label="Filter by category">
            <button
              type="button"
              className={`${styles.tab} ${
                activeCategory === "all" ? styles.tabActive : ""
              }`}
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
            >
              All Products
            </button>
            {activeCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${styles.tab} ${
                  activeCategory === c.id ? styles.tabActive : ""
                }`}
                onClick={() => setActiveCategory(c.id)}
                aria-pressed={activeCategory === c.id}
              >
                {c.name}
              </button>
            ))}
          </nav>

          <div className={styles.sortWrap}>
            <SlidersHorizontal
              size={14}
              strokeWidth={1.6}
              className={styles.sortIcon}
              aria-hidden="true"
            />
            <label htmlFor="shop-sort" className={styles.srOnly}>
              Sort products
            </label>
            <select
              id="shop-sort"
              className={styles.sortSelect}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= GRID ================= */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No products found</p>
            <p className={styles.emptyText}>
              Try changing the category or come back later.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                priority={i < 4}
              />
            ))}
          </div>
        )}

        {/* ================= COUNT ================= */}
        <p className={styles.count}>
          Showing {filtered.length} of{" "}
          {products.filter((p) => p.is_active).length} products
        </p>
      </div>
    </div>
  );
}