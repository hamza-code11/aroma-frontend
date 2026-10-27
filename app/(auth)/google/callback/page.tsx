"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import LoginSkeleton from "@/components/auth/skeletons/LoginSkeleton/LoginSkeleton"; // <-- Import kiya

// Loader Component
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      router.replace("/login?error=google_auth_failed");
      return;
    }

    if (token && userStr) {
  localStorage.setItem("auth_token", token);
  
  try {
    const user = JSON.parse(decodeURIComponent(userStr));
    queryClient.setQueryData(["user"], { user });

    // Role ke hisaab se redirect
    if (user.role === 'admin') {
      router.replace('/admin');
    } else {
      router.replace('/');
    }
  } catch (e) {
    router.replace("/");
  }
} else {
  router.replace("/login");
}
  }, [router, searchParams, queryClient]);

  // Yahan humne asli loader ki jagah Skeleton laga diya hai
  return <LoginSkeleton />;
}

// Main Page Export
export default function GoogleCallback() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <CallbackContent />
    </Suspense>
  );
}
