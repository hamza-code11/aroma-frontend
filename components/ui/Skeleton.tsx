import styles from "./Skeleton.module.css";

export function SkeletonLine({ width = "100%", height = "16px", className = "" }: { width?: string; height?: string; className?: string }) {
  return <div className={`${styles.skeleton} ${className}`} style={{ width, height }} />;
}

export function SkeletonBlock({ width = "100%", height = "48px", className = "" }: { width?: string; height?: string; className?: string }) {
  return <div className={`${styles.skeletonBlock} ${className}`} style={{ width, height }} />;
}
