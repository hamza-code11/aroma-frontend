import ProductDetails from "@/components/website/ProductDetails/ProductDetails";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return {
    title: `Product Details — i.Shine Aroma`,
    description: `View details for ${slug}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return <ProductDetails slug={slug} />;
}