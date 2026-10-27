// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { authService } from "@/services/auth.service";

// export default function ProtectedRoute({ 
//   children, 
//   allowedRole = "user" 
// }: { 
//   children: React.ReactNode, 
//   allowedRole?: "user" | "admin" 
// }) {
//   const router = useRouter();
  
//   // User ka data fetch karein (cache se aayega, fast hoga)
//   const { data, isLoading } = useQuery({
//     queryKey: ['user'],
//     queryFn: authService.getUser,
//     retry: false,
//   });

//   useEffect(() => {
//     if (isLoading) return;

//     // Agar user login nahi hai
//     if (!data?.user) {
//       router.replace("/login");
//       return;
//     }

//     // Agar user ka role match nahi karta (e.g. normal user trying to access admin)
//     if (data.user.role !== allowedRole) {
//       router.replace(data.user.role === 'admin' ? '/admin' : '/');
//     }
//   }, [data, isLoading, router, allowedRole]);

//   if (isLoading) {
//     return <div className="flex h-screen items-center justify-center">Loading...</div>;
//   }

//   // Agar sab theek hai toh children render karein
//   if (data?.user && data.user.role === allowedRole) {
//     return <>{children}</>;
//   }

//   return null;
// }









"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import AdminShellSkeleton from "@/components/admin/skeletons/AdminSkeleton/AdminSkeleton"; 

export default function ProtectedRoute({ 
  children, 
  allowedRole = "user" 
}: { 
  children: React.ReactNode, 
  allowedRole?: "user" | "admin" 
}) {
  const router = useRouter();
  
  const { data, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getUser,
    retry: false,
  });

  useEffect(() => {
    if (isLoading) return;

    if (!data?.user) {
      router.replace("/login");
      return;
    }

    if (data.user.role !== allowedRole) {
      router.replace(data.user.role === 'admin' ? '/admin' : '/');
    }
  }, [data, isLoading, router, allowedRole]);

  // Jab data load ho raha ho, toh role ke hisaab se skeleton dikhayein
  if (isLoading) {
    if (allowedRole === "admin") {
      return <AdminShellSkeleton />; // Admin ke liye poora layout skeleton
    }
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent-primary)]"></div>
      </div>
    ); // Normal user ke liye spinner (ya user skeleton)
  }

  if (data?.user && data.user.role === allowedRole) {
    return <>{children}</>;
  }

  return null;
}
