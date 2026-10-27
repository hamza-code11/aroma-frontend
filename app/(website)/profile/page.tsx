import { notFound } from "next/navigation";
import Profile from "@/components/website/profile/Profile";

export const metadata = {
  title: "My Profile — i.Shine Aroma",
  description: "Manage your account details, view your order history, and securely reset your password.",
};

export default function ProfilePage() {
  // Optional safeguard jaise aapke example mein tha
  if (typeof Profile !== "function") {
    notFound();
  }

  return <Profile />;
}
