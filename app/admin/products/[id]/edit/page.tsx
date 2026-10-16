import { notFound } from "next/navigation";
import ProductEdit from "@/components/admin/products/ProductEdit";
import { products } from "@/data/product";
import { categories } from "@/data/category";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));
  return { title: product ? `Edit ${product.name}` : "Product not found" };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === Number(id));

  if (!product) notFound();

  return <ProductEdit product={product} categories={categories} />;
}