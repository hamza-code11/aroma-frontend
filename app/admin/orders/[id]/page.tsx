import OrderDetails from "@/components/admin/orders/OrderDetails";

export const metadata = { title: "Order Details — Admin" };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15+ mein params promise hota hai, isliye await karein
    const resolvedParams = await params;
    
    return <OrderDetails params={Promise.resolve(resolvedParams)} />;
}
