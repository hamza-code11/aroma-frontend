import { SkeletonLine, SkeletonBlock } from "@/components/ui/Skeleton";
import styles from "./PaymentStep.module.css";

export default function PaymentStepSkeleton() {
    return (
        <div className={styles.form}>
            <div className={styles.header}>
                <SkeletonLine width="120px" height="32px" />
                <SkeletonLine width="180px" height="16px" className="mt-2" />
            </div>
            <SkeletonBlock height="48px" />
            <div className={styles.field}><SkeletonLine width="100px" height="12px" /><SkeletonBlock height="48px" /></div>
            <div className={styles.grid3}>
                <div className={styles.field}><SkeletonLine width="50px" height="12px" /><SkeletonBlock height="48px" /></div>
                <div className={styles.field}><SkeletonLine width="50px" height="12px" /><SkeletonBlock height="48px" /></div>
                <div className={styles.field}><SkeletonLine width="50px" height="12px" /><SkeletonBlock height="48px" /></div>
            </div>
            <div className={styles.buttonsRow}>
                <SkeletonBlock height="52px" />
                <SkeletonBlock height="52px" />
            </div>
        </div>
    );
}
