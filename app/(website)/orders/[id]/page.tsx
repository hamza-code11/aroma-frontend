import UserOrderDetails from "@/components/website/orders/UserOrderDetails"; // apna sahi path dalein

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
    const resolvedParams = await params;
    return { title: `Order #${resolvedParams.id} — i.Shine Aroma` };
}

export default async function OrderDetailsPage({ params }: Props) {
    const resolvedParams = await params;
    
    // Client component ko params pass karein
    return <UserOrderDetails params={Promise.resolve(resolvedParams)} />;
}