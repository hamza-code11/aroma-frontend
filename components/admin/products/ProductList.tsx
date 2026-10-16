"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import styles from "./ProductList.module.css";

type Props = {
  products: Product[];
  categories: Category[];
};

export default function ProductList({ products: initialProducts, categories }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<Product | null>(null);
  const { showToast } = useToast();

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [products, query]);

  const handleDelete = () => {
    if (!deleting) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleting.id));
    showToast(`Product "${deleting.name}" deleted.`);
    setDeleting(null);
  };

  const toggleStatus = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p))
    );
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>All Products</h2>
          <p className={styles.subtitle}>
            {products.length} product{products.length === 1 ? "" : "s"} in your store.
          </p>
        </div>
        <Link href="/admin/products/create" className={styles.primaryBtn}>
          <Plus size={15} strokeWidth={2} />
          Create Product
        </Link>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} strokeWidth={1.7} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, SKU or slug…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className={styles.count}>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No products found</p>
          <p className={styles.emptyText}>
            {query ? "Try a different search term." : "Create your first product."}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const hasSale =
                  p.sale_price !== null && p.sale_price < p.regular_price;
                const price = hasSale ? p.sale_price! : p.regular_price;
                const outOfStock = p.stock_quantity <= 0;
                const lowStock = !outOfStock && p.stock_quantity <= 5;

                return (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <span className={styles.thumb}>
                          <Image
                            src={p.main_image}
                            alt={p.name}
                            fill
                            sizes="44px"
                            className={styles.thumbImg}
                          />
                        </span>
                        <span className={styles.productName}>{p.name}</span>
                      </div>
                    </td>
                    <td><code className={styles.sku}>{p.sku}</code></td>
                    <td className={styles.category}>
                      {categoryMap.get(p.category_id) ?? "—"}
                    </td>
                    <td>
                      <span className={hasSale ? styles.priceSale : styles.price}>
                        ${price.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      {outOfStock ? (
                        <span className={`${styles.stock} ${styles.stockOut}`}>Out</span>
                      ) : lowStock ? (
                        <span className={`${styles.stock} ${styles.stockLow}`}>
                          {p.stock_quantity} left
                        </span>
                      ) : (
                        <span className={`${styles.stock} ${styles.stockIn}`}>
                          {p.stock_quantity}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={p.is_active}
                        className={`${styles.toggle} ${
                          p.is_active ? styles.toggleOn : styles.toggleOff
                        }`}
                        onClick={() => toggleStatus(p.id)}
                      >
                        <span className={styles.toggleKnob} />
                        <span className={styles.toggleLabel}>
                          {p.is_active ? "Active" : "Inactive"}
                        </span>
                      </button>
                    </td>
                    <td className={styles.tdRight}>
                      <div className={styles.actions}>
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className={styles.iconBtn}
                          aria-label={`Edit ${p.name}`}
                        >
                          <Pencil size={15} strokeWidth={1.7} />
                        </Link>
                        <button
                          type="button"
                          className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                          onClick={() => setDeleting(p)}
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 size={15} strokeWidth={1.7} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {deleting && (
        <div
          className={styles.backdrop}
          onMouseDown={(e) => e.target === e.currentTarget && setDeleting(null)}
          role="presentation"
        >
          <div className={styles.dialog} role="alertdialog" aria-modal="true">
            <h3 className={styles.dialogTitle}>Delete product?</h3>
            <p className={styles.dialogText}>
              Are you sure you want to delete <strong>{deleting.name}</strong>?
              This cannot be undone.
            </p>
            <div className={styles.dialogActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setDeleting(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={handleDelete}
                autoFocus
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
