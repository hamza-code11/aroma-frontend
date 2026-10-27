"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import ListSkeleton from "@/components/admin/skeletons/ProductSkeleton/ListSkeleton";
import styles from "./ProductList.module.css";

// Hooks Import
import {
  useProducts,
  useDeleteProduct,
  useToggleProductStatus
} from "@/hooks/products/useProducts";
import { useCategories } from "@/hooks/categories/useCategories";

type Props = {
  initialProducts?: Product[];
  initialCategories?: Category[];
};

export default function ProductList({ initialProducts = [], initialCategories = [] }: Props) {
  const [deleting, setDeleting] = useState<Product | null>(null);
  const { showToast } = useToast();

  // Dynamic Data Fetching
  const { data: products = initialProducts, isLoading: productsLoading, isError, refetch } = useProducts();
  const { data: categories = initialCategories, isLoading: categoriesLoading } = useCategories();

  // Mutations
  const deleteMutation = useDeleteProduct();
  const toggleMutation = useToggleProductStatus();

  // Category Mapping for Table
  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  // Handle Delete
  const handleDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        showToast(`Product "${deleting.name}" deleted.`, "success");
        setDeleting(null);
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || "Failed to delete product. Please try again.";
        showToast(msg, "error");
        setDeleting(null); // Agar error aaye toh modal band kar dein
      }
    });
  };

  // Handle Toggle Status
  const toggleStatus = (product: Product) => {
    toggleMutation.mutate(product.id, {
      onSuccess: () => {
        showToast(`"${product.name}" status updated.`, "success");
      },
      onError: (error: any) => {
        const msg = error.response?.data?.message || "Failed to update status.";
        showToast(msg, "error");
      }
    });
  };

  // Loading State
  if (productsLoading || categoriesLoading) {
    return <ListSkeleton />;
  }

  // Error State
  if (isError) {
    return (
      <div className={styles.page} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>Failed to load products</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>There was a problem fetching the product list.</p>
        <button onClick={() => refetch()} className={styles.primaryBtn}>
          Try Again
        </button>
      </div>
    );
  }

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

      {/* Toolbar (Search removed) */}
      <div className={styles.toolbar}>
        <span className={styles.count}>
          Showing all {products.length} products
        </span>
      </div>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No products found</p>
          <p className={styles.emptyText}>
            Create your first product to get started.
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
              {products.map((p) => {
                const regularPrice = Number(p.regular_price);
                const salePrice = p.sale_price !== null ? Number(p.sale_price) : null;
                
                // Logic: Agar sale price mojood hai AUR regular price se kam hai
                const hasValidSale = salePrice !== null && salePrice < regularPrice;
                const displayPrice = hasValidSale ? salePrice : regularPrice;
                
                const outOfStock = p.stock_quantity <= 0;
                const lowStock = !outOfStock && p.stock_quantity <= 3;

                // Image URL fix (Agar path ke sath full URL nahi hai, toh storage URL laga dein)
                const imageUrl = p.main_image?.startsWith('http')
                  ? p.main_image
                  : `${process.env.NEXT_PUBLIC_STORAGE_URL}/${p.main_image}`;

                return (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <span className={styles.thumb}>
                          <Image
                            src={imageUrl || "/placeholder.jpg"}
                            alt={p.name}
                            fill
                            sizes="44px"
                            unoptimized
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
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {hasValidSale ? (
                          <>
                            <span className={styles.priceSale}>${displayPrice.toFixed(2)}</span>
                            <span style={{ 
                              fontSize: '12px', 
                              textDecoration: 'line-through', 
                              color: 'var(--text-secondary)' 
                            }}>
                              ${regularPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className={styles.price}>${displayPrice.toFixed(2)}</span>
                        )}
                      </div>
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
                        className={`${styles.toggle} ${p.is_active ? styles.toggleOn : styles.toggleOff}`}
                        onClick={() => toggleStatus(p)}
                        disabled={toggleMutation.isPending && toggleMutation.variables === p.id}
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

      {/* Delete Modal (Inline) */}
      {deleting && (
        <div
          className={styles.backdrop}
          onMouseDown={(e) => e.target === e.currentTarget && !deleteMutation.isPending && setDeleting(null)}
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
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                autoFocus
              >
                {deleteMutation.isPending ? (
                  <><Loader2 size={14} className="animate-spin" /> Deleting...</>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
