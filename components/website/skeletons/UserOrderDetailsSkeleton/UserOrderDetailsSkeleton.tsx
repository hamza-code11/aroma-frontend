import styles from "./UserOrderDetailsSkeleton.module.css";

export default function UserOrderDetailsSkeleton() {
    return (
        <div className={styles.page} aria-hidden="true">
            <div className={styles.container}>
                {/* Back Link Skeleton */}
                <div className={`${styles.line} ${styles.backLink}`} />

                {/* Main Card Skeleton */}
                <div className={styles.mainCard}>
                    
                    {/* Header Skeleton */}
                    <div className={styles.cardHeader}>
                        <div>
                            <div className={`${styles.line} ${styles.title}`} />
                            <div className={`${styles.line} ${styles.metaInfo}`} />
                        </div>
                        <div className={`${styles.line} ${styles.trackingBox}`} />
                    </div>

                    {/* Content Grid Skeleton */}
                    <div className={styles.contentGrid}>
                        
                        {/* Left Column Skeleton */}
                        <div className={styles.leftCol}>
                            {/* Timeline Skeleton */}
                            <div className={styles.section}>
                                <div className={`${styles.line} ${styles.sectionTitle}`} />
                                <div className={styles.timeline}>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className={styles.timelineStep}>
                                            <div className={`${styles.line} ${styles.timelineIcon}`} />
                                            <div className={styles.timelineContent}>
                                                <div className={`${styles.line} ${styles.textMd}`} />
                                                <div className={`${styles.line} ${styles.textSm}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Items Skeleton */}
                            <div className={styles.section}>
                                <div className={`${styles.line} ${styles.sectionTitle}`} />
                                <div className={styles.itemsList}>
                                    {Array.from({ length: 2 }).map((_, i) => (
                                        <div key={i} className={styles.itemRow}>
                                            <div>
                                                <div className={`${styles.line} ${styles.textMd}`} />
                                                <div className={`${styles.line} ${styles.textSm}`} />
                                            </div>
                                            <div className={`${styles.line} ${styles.price}`} />
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.totalsBox}>
                                    <div className={`${styles.line} ${styles.totalRow}`} />
                                    <div className={`${styles.line} ${styles.totalRow}`} />
                                    <div className={`${styles.line} ${styles.grandTotal}`} />
                                </div>
                            </div>
                        </div>

                        {/* Right Column Skeleton */}
                        <div className={styles.rightCol}>
                            {/* Address Skeleton */}
                            <div className={styles.section}>
                                <div className={`${styles.line} ${styles.sectionTitle}`} />
                                <div className={styles.infoBox}>
                                    <div className={`${styles.line} ${styles.textMd}`} />
                                    <div className={`${styles.line} ${styles.textSm}`} />
                                    <div className={`${styles.line} ${styles.textSm}`} />
                                    <div className={`${styles.line} ${styles.textSm}`} />
                                </div>
                            </div>

                            {/* Payment Skeleton */}
                            <div className={styles.section}>
                                <div className={`${styles.line} ${styles.sectionTitle}`} />
                                <div className={styles.infoBox}>
                                    <div className={`${styles.line} ${styles.textSm}`} />
                                    <div className={`${styles.line} ${styles.textSm}`} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
