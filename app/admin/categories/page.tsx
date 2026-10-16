import CategoryList from "@/components/admin/categories/CategoryList";
import { categories } from "@/data/category";

export const metadata = {
  title: "Categories — Admin",
};

export default function AdminCategoriesPage() {
  return <CategoryList initialCategories={categories} />;
}