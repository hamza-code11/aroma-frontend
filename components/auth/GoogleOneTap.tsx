"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Script from "next/script";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export default function GoogleOneTap() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [scriptReady, setScriptReady] = useState(false);
  const initialized = useRef(false);

  const handleCredentialResponse = useCallback(
    async (response: any) => {
      try {
        const res = await axiosInstance.post("/auth/google/onetap", {
          credential: response.credential,
        });

        const { token, user } = res.data;

        localStorage.setItem("auth_token", token);
        queryClient.setQueryData(["user"], { user });

        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("One Tap Login failed", error);
      }
    },
    [queryClient, router]
  );

  // Agar script pehle se loaded hai (navigation ke baad)
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).google?.accounts?.id) {
      setScriptReady(true);
    }
  }, []);

  useEffect(() => {
    if (!scriptReady || initialized.current) return;

    // Already logged in ho to One Tap na dikhao
    if (localStorage.getItem("auth_token")) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID missing hai");
      return;
    }

    initialized.current = true;
    const google = (window as any).google;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: false,
      use_fedcm_for_prompt: true,
    });

    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        console.log("One Tap not displayed:", notification.getNotDisplayedReason());
      } else if (notification.isSkippedMoment()) {
        console.log("One Tap skipped:", notification.getSkippedReason());
      } else if (notification.isDismissedMoment()) {
        console.log("One Tap dismissed:", notification.getDismissedReason());
      }
    });

    return () => {
      google.accounts.id.cancel();
      initialized.current = false;
    };
  }, [scriptReady, handleCredentialResponse]);

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
      onLoad={() => setScriptReady(true)}
    />
  );
}