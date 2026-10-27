import { notFound } from "next/navigation";
import About from "@/components/website/about/page";

export const metadata = {
  title: "About — i.Shine Aroma",
  description:
    "The story behind i.Shine Aroma — premium fragrances and diffusers crafted from carefully selected ingredients for every room.",
};

export default function AboutPage() {
  if (!About) {
    notFound();
  }

  return <About />;
}
