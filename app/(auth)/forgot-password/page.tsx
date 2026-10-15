import ForgotPassword from "@/components/auth/ForgotPassword/ForgotPassword";

export const metadata = {
  title: "Forgot Password — i.Shine Aroma",
  description:
    "Reset your i.Shine Aroma account password. Enter your email and we'll send you a secure reset link.",
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
