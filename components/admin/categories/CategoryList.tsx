"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { useToast } from "@/components/ui/Toast";
import type { Category } from "@/types/category";
import styles from "./CategoryList.module.css";

// Hooks Import
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory, 
  useToggleCategory 
} from "@/hooks/categories/useCategories";

type Props = {
  initialCategories?: Category[]; // Ab ye prop zaroori nahi, par rehne dein for fallback
};

export default function CategoryList({ initialCategories = [] }: Props) {
  const { showToast } = useToast();

  // State for Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  // React Query Hooks
  const { data: categories = initialCategories, isLoading, isError } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const toggleMutation = useToggleCategory();

  /* ---------- Handlers ---------- */
  const handleCreate = (payload: Omit<Category, "id">) => {
    createMutation.mutate(payload, {
      onSuccess: (data) => {
        setCreateOpen(false);
        showToast(`Category "${data.name}" created.`, "success");
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message || "Failed to create category", "error");
      }
    });
  };

  const handleUpdate = (updated: Category) => {
    updateMutation.mutate(
      { id: updated.id, payload: updated },
      {
        onSuccess: (data) => {
          setEditing(null);
          showToast(`Category "${data.name}" updated.`, "success");
        },
        onError: (error: any) => {
          showToast(error.response?.data?.message || "Failed to update", "error");
        }
      }
    );
  };

  const handleDelete = (category: Category) => {
    deleteMutation.mutate(category.id, {
      onSuccess: () => {
        setDeleting(null);
        showToast(`Category "${category.name}" deleted.`, "success");
      },
      onError: (error: any) => {
        showToast(error.response?.data?.message || "Failed to delete", "error");
        setDeleting(null);
      }
    });
  };

    const handleToggleStatus = (category: Category) => {
    toggleMutation.mutate(category.id, {
      onSuccess: () => {
        showToast(
          `"${category.name}" status updated successfully.`,
          category.is_active ? "info" : "success" // UI ka logic
        );
      },
      onError: () => {
        showToast("Failed to update status", "error");
      }
    });
  };

  /* ---------- Loading & Error States ---------- */
  if (isLoading) {
    return (
      <div className={styles.wrap}>
        <div style={{ padding: '50px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading categories...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.wrap}>
        <div style={{ padding: '50px', textAlign: 'center', color: '#ef4444' }}>
          Error loading categories. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {/* ============ HEADER ============ */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>All Categories</h2>
          <p className={styles.subtitle}>
            {categories.length} categor{categories.length === 1 ? "y" : "ies"}{" "}
            in your store.
          </p>
        </div>

        <button
          type="button"
          className={styles.createBtn}
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={15} strokeWidth={2} />
          Create Category
        </button>
      </header>

      {/* ============ TABLE ============ */}
      {categories.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No categories found</p>
          <p className={styles.emptyText}>
            Create your first category to get started.
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th className={styles.thRight}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className={styles.name}>{c.name}</span>
                  </td>
                  <td>
                    <code className={styles.slug}>{c.slug}</code>
                  </td>
                  <td>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={c.is_active}
                      className={`${styles.toggle} ${
                        c.is_active ? styles.toggleOn : styles.toggleOff
                      }`}
                      onClick={() => handleToggleStatus(c)}
                      disabled={toggleMutation.isPending}
                      aria-label={`Toggle ${c.name} ${
                        c.is_active ? "inactive" : "active"
                      }`}
                    >
                      <span className={styles.toggleKnob} />
                      <span className={styles.toggleLabel}>
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className={styles.tdRight}>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => setEditing(c)}
                        aria-label={`Edit ${c.name}`}
                      >
                        <Pencil size={15} strokeWidth={1.7} />
                      </button>

                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        onClick={() => setDeleting(c)}
                        aria-label={`Delete ${c.name}`}
                      >
                        <Trash2 size={15} strokeWidth={1.7} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ============ MODALS ============ */}
      <CreateCategoryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      <EditCategoryModal
        category={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
      />

      <DeleteCategoryModal
        category={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
