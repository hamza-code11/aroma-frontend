import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";
import AdminShell from "@/components/admin/layout/AdminShell/AdminShell";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const metadata: Metadata = {
  title: {
    default: "Admin — i.Shine Aroma",
    template: "%s | Admin — i.Shine Aroma",
  },
  description: "Admin dashboard for i.Shine Aroma",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRole="admin">
      <ToastProvider>
        <AdminShell>{children}</AdminShell>
      </ToastProvider>
    </ProtectedRoute>

  );
}
