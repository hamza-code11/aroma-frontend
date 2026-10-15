import { notFound } from "next/navigation";
import Contact from "@/components/website/contact/page";

export const metadata = {
  title: "Contact — i.Shine Aroma",
  description:
    "Get in touch with i.Shine Aroma. Questions about orders, fragrances, or custom blends — we reply within one business day.",
};

export default function ContactPage() {
  if (typeof Contact !== "function") {
    notFound();
  }

  return <Contact />;
}
