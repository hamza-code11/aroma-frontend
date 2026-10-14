import Navbar from "@/components/website/layout/Navbar/Navbar";
import Footer from "@/components/website/layout/Footer/Footer";
// import WhatsAppButton from "@/components/website/layout/WhatsAppButton/WhatsAppButton";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      {/* <WhatsAppButton /> */}
    </div>
  );
}