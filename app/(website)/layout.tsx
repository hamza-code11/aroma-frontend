import Navbar from "@/components/website/layout/Navbar/Navbar";
import Footer from "@/components/website/layout/Footer/Footer";
import { WishlistProvider } from "@/app/providers/WishlistProvider";
import WishlistSidebar from "@/globalComponents/wishlist/WishlistSidebar";
// import GoogleOneTap from "@/components/auth/GoogleOneTap"; 
import { ToastProvider } from "@/components/ui/Toast";
import { CheckoutProvider } from "@/app/providers/CheckoutProvider";
// import WhatsAppButton from "@/components/website/layout/WhatsAppButton/WhatsAppButton";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ToastProvider>
    <WishlistProvider>
      <CheckoutProvider> 
      {/* <GoogleOneTap />  */}
      <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <Navbar />

        <main className="flex-grow">{children}</main>

        <Footer />

        {/* Wishlist sidebar — provider ke andar, layout ke andar */}
        <WishlistSidebar />

        {/* <WhatsAppButton /> */}
      </div>
      </CheckoutProvider>
    </WishlistProvider>
    </ToastProvider>
  );
}