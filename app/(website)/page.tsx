import Hero from '@/components/website/home/Hero/Hero';
import ProductShowcase from "@/components/website/home/ProductShowcase/ProductShowcase";
import VideoBanner from '@/components/website/home/VideoBanner/VideoBanner';
import NewArrivals from '@/components/website/home/NewArrivals/NewArrivals';
import ProductViewer3D from '@/components/website/home/ProductScene3D/ProductViewer3D';
import Testimonials from '@/components/website/home/Testimonials/Testimonials';

export default function Home() {
  return (
    <>
      <Hero />
      <ProductShowcase />
      <VideoBanner />
      <NewArrivals />
      <ProductViewer3D />
      <Testimonials />
    </>
  );
}