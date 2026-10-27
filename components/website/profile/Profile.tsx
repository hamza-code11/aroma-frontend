"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/auth/useUser";
import { useLogout } from "@/hooks/auth/useProfile";
import { Package, Truck, Lock, LogOut, Loader2 } from "lucide-react";
import styles from "./Profile.module.css";

// Child Components
import RecentOrders from "./tabs/RecentOrders";
import TrackOrders from "./tabs/TrackOrders";
import ResetPassword from "./tabs/ResetPassword";

// Skeleton Component (jo aapne loading.tsx me banaya tha)
import ProfileLoading from "@/app/(website)/profile/loading"; // Agar path alag hai to adjust karein

export default function ProfileClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"recent" | "track" | "password">("recent");

  const { data: userData, isLoading: userLoading } = useUser();
  const logoutMutation = useLogout();
  const user = userData?.user;

  // 1. Agar user load ho chuka hai aur login nahi hai, to login par bhej do
  if (!userLoading && !user) {
    router.replace("/login");
    return null;
  }

  // 2. Jab data load ho raha ho (2 second wala wait), to Skeleton dikhao
  if (userLoading) {
    return <ProfileLoading />; 
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        <h1 className={styles.pageTitle}>My Account</h1>

        <div className={styles.dashboard}>
          
          {/* LEFT SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>
                {user?.name?.charAt(0).toUpperCase()}{user?.name?.split(" ")[1]?.charAt(0).toUpperCase() || ""}
              </div>
              <div className={styles.userInfoText}>
                <p className={styles.userName}>{user?.name}</p>
                <p className={styles.userEmail}>{user?.email}</p>
              </div>
            </div>

            <div className={styles.navLinks}>
              <button
                onClick={() => setActiveTab("recent")}
                className={`${styles.navBtn} ${activeTab === "recent" ? styles.navBtnActive : ""}`}
              >
                <Package size={18} />
                Recent Orders
              </button>

              <button
                onClick={() => setActiveTab("track")}
                className={`${styles.navBtn} ${activeTab === "track" ? styles.navBtnActive : ""}`}
              >
                <Truck size={18} />
                Track Orders
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`${styles.navBtn} ${activeTab === "password" ? styles.navBtnActive : ""}`}
              >
                <Lock size={18} />
                Reset Password
              </button>
            </div>

            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className={styles.logoutBtn}
            >
              {logoutMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={18} />}
              Logout
            </button>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <main className={styles.content}>
            {activeTab === "recent" && <RecentOrders />}
            {activeTab === "track" && <TrackOrders />}
            {activeTab === "password" && <ResetPassword />}
          </main>
        </div>
      </div>
    </div>
  );
}
