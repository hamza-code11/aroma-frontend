import ProductCreate from "@/components/admin/products/ProductCreate";
import { categories } from "@/data/category";

export const metadata = { title: "Create Product" };

export default function CreateProductPage() {
  return <ProductCreate categories={categories} />;
}