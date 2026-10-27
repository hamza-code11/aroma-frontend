import ProductEdit from "@/components/admin/products/ProductEdit";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Edit Product #${id}` };
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  // Client component ko ID pass kar rahe hain
  return <ProductEdit productId={Number(id)} />;
}