// app/admin/products/page.tsx
import ProductList from "@/components/admin/products/ProductList";

export const metadata = { title: "Products" };

export default function ProductsPage() {
  return <ProductList />;
}