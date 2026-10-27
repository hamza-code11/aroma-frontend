import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Providers from '@/src/providers/providers';
import "./globals.css";

export const metadata: Metadata = {
  title: "i.Shine Aroma | Fragrances That Stay",
  description: "Experience the luxury of premium aromas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="antialiased">
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <Providers>
          {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}