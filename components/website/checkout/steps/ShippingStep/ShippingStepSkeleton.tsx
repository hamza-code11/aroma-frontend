import { SkeletonLine, SkeletonBlock } from "@/components/ui/Skeleton";
import styles from "./ShippingStep.module.css";

export default function ShippingStepSkeleton() {
    return (
        <div className={styles.form}>
            <div className={styles.header}>
                <SkeletonLine width="220px" height="32px" />
                <SkeletonLine width="150px" height="16px" className="mt-2" />
            </div>
            <div className={styles.rateList}>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.rateCard}>
                        <SkeletonBlock width="20px" height="20px" className="rounded-full" />
                        <div className={styles.rateInfo}><SkeletonLine width="150px" height="16px" /><SkeletonLine width="100px" height="12px" className="mt-1" /></div>
                        <SkeletonLine width="60px" height="20px" />
                    </div>
                ))}
            </div>
            <div className={styles.buttonsRow}>
                <SkeletonBlock height="52px" />
                <SkeletonBlock height="52px" />
            </div>
        </div>
    );
}
