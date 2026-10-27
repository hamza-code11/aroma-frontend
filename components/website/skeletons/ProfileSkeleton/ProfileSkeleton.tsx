import styles from "./ProfileSkeleton.module.css";

export default function ProfileLoading() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* Page Title Skeleton */}
        <div className={`${styles.skeleton} ${styles.title}`}></div>

        <div className={styles.dashboard}>
          
          {/* LEFT SIDEBAR SKELETON */}
          <aside className={styles.sidebar}>
            {/* User Profile Skeleton */}
            <div className={styles.userProfile}>
              <div className={`${styles.skeleton} ${styles.avatar}`}></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <div className={`${styles.skeleton} ${styles.nameLine}`}></div>
                <div className={`${styles.skeleton} ${styles.emailLine}`}></div>
              </div>
            </div>

            {/* Navigation Links Skeleton */}
            <div className={styles.navLinks}>
              <div className={`${styles.skeleton} ${styles.navItem}`}></div>
              <div className={`${styles.skeleton} ${styles.navItem}`}></div>
              <div className={`${styles.skeleton} ${styles.navItem}`}></div>
            </div>

            {/* Logout Button Skeleton */}
            <div className={`${styles.skeleton} ${styles.logout}`}></div>
          </aside>

          {/* RIGHT CONTENT SKELETON */}
          <main className={styles.content}>
            {/* Section Title */}
            <div className={`${styles.skeleton} ${styles.sectionTitle}`}></div>
            
            {/* Empty State Skeleton */}
            <div className={styles.emptyState}>
              <div className={`${styles.skeleton} ${styles.emptyIcon}`}></div>
              <div className={`${styles.skeleton} ${styles.emptyTitle}`}></div>
              <div className={`${styles.skeleton} ${styles.emptyText}`}></div>
              <div className={`${styles.skeleton} ${styles.emptyBtn}`}></div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}
