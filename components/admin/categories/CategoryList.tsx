"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import CreateCategoryModal from "./CreateCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { useToast } from "@/components/ui/Toast";
import type { Category } from "@/types/category";
import styles from "./CategoryList.module.css";

type Props = {
  initialCategories: Category[];
};

const nextId = (list: Category[]) => Math.max(0, ...list.map((c) => c.id)) + 1;

export default function CategoryList({ initialCategories }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const { showToast } = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categories, query]);

  /* ---------- Handlers ---------- */
  const handleCreate = (payload: Omit<Category, "id">) => {
    const created: Category = { id: nextId(categories), ...payload };
    setCategories((prev) => [...prev, created]);
    setCreateOpen(false);
    showToast(`Category "${created.name}" created.`);
  };

  const handleUpdate = (updated: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setEditing(null);
    showToast(`Category "${updated.name}" updated.`);
  };

  const handleDelete = (category: Category) => {
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
    setDeleting(null);
    showToast(`Category "${category.name}" deleted.`);
  };

  const handleToggleStatus = (category: Category) => {
    const next = !category.is_active;
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, is_active: next } : c))
    );
    showToast(
      `"${category.name}" is now ${next ? "active" : "inactive"}.`,
      next ? "success" : "info"
    );
  };

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

      {/* ============ TOOLBAR ============ */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} strokeWidth={1.7} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name or slug…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search categories"
          />
        </div>

        <span className={styles.count}>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* ============ TABLE ============ */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>No categories found</p>
          <p className={styles.emptyText}>
            {query
              ? "Try a different search term."
              : "Create your first category to get started."}
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
              {filtered.map((c) => (
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
      />

      <EditCategoryModal
        category={editing}
        onClose={() => setEditing(null)}
        onSubmit={handleUpdate}
      />

      <DeleteCategoryModal
        category={deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
