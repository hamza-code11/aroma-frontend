import { SkeletonLine, SkeletonBlock } from "@/components/ui/Skeleton";
import styles from "./AddressStep.module.css";

export default function AddressStepSkeleton() {
    return (
        <div className={styles.form}>
            <div className={styles.header}>
                <SkeletonLine width="200px" height="32px" />
                <SkeletonLine width="100px" height="16px" className="mt-2" />
            </div>
            <div className={styles.field}><SkeletonLine width="80px" height="12px" /><SkeletonBlock height="48px" /></div>
            <div className={styles.field}><SkeletonLine width="100px" height="12px" /><SkeletonBlock height="48px" /></div>
            <div className={styles.field}><SkeletonLine width="60px" height="12px" /><SkeletonBlock height="48px" /></div>
            <div className={styles.field}><SkeletonLine width="70px" height="12px" /><SkeletonBlock height="48px" /></div>
            <div className={styles.grid2}>
                <div className={styles.field}><SkeletonLine width="50px" height="12px" /><SkeletonBlock height="48px" /></div>
                <div className={styles.field}><SkeletonLine width="80px" height="12px" /><SkeletonBlock height="48px" /></div>
            </div>
            <SkeletonBlock height="52px" className="mt-4" />
        </div>
    );
}
