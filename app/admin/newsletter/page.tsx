import NewsletterList from "@/components/admin/newsletter/page";
import { subscribers } from "@/data/newsletter";

export const metadata = { title: "Newsletter" };

export default function NewsletterPage() {
  return <NewsletterList subscribers={subscribers} />;
}
