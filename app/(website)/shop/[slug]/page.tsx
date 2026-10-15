import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetails from "@/components/website/ProductDetails/ProductDetails";
import { products } from "@/data/product";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = products.find((p) => p.slug === slug);

    if (!product) {
        return { title: "Product not found — i.Shine Aroma" };
    }

    return {
        title: `${product.name} — i.Shine Aroma`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [product.main_image],
        },
    };
}

export function generateStaticParams() {
    return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = products.find((p) => p.slug === slug && p.is_active);

    if (!product) notFound();

    // Related products — same category, exclude current
    const related = products.filter(
        (p) =>
            p.is_active &&
            p.category_id === product.category_id &&
            p.id !== product.id
    );

    return <ProductDetails product={product} related={related} />;
}