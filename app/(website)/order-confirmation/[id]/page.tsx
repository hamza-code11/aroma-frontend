import OrderConfirmation from "@/components/website/orders/OrderConfirmation"; 

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    return {
        title: `Order Confirmed #${resolvedParams.id} — i.Shine Aroma`,
        description: "Thank you for your order. Your payment was successful.",
    };
}

export default async function OrderConfirmationPage({ params }: Props) {
    // Next.js 15+ mein params promise hai, isliye client component ko promise pass karte hain
    return <OrderConfirmation params={params} />;
}
