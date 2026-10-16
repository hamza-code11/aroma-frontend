import ProductList from "@/components/admin/products/ProductList";
import { products } from "@/data/product";
import { categories } from "@/data/category";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return <ProductList products={products} categories={categories} />;
}
