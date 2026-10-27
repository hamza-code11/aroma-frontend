import styles from "./OrderDetailsSkeleton.module.css";

export default function OrderDetailsSkeleton() {
    return (
        <div className={styles.page} aria-hidden="true">
            {/* Header Skeleton */}
            <div className={styles.header}>
                <div className={`${styles.line} ${styles.backLink}`} />
                <div className={styles.headerTitle}>
                    <div className={`${styles.line} ${styles.title}`} />
                    <div className={`${styles.line} ${styles.badge}`} />
                </div>
            </div>

            {/* Invoice Container Skeleton */}
            <div className={styles.invoiceContainer}>
                
                {/* Top Info Grid Skeleton */}
                <div className={styles.topGrid}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={styles.gridRow}>
                            <div className={`${styles.line} ${styles.label}`} />
                            <div className={`${styles.line} ${styles.value}`} />
                            <div className={`${styles.line} ${styles.label}`} />
                            <div className={`${styles.line} ${styles.value}`} />
                        </div>
                    ))}
                </div>

                {/* Customer Row Skeleton */}
                <div className={styles.customerRow}>
                    <div className={styles.customerInfo}>
                        <div className={`${styles.line} ${styles.sectionTitle}`} />
                        <div className={`${styles.line} ${styles.infoLine}`} />
                        <div className={`${styles.line} ${styles.infoLine}`} />
                        <div className={`${styles.line} ${styles.infoLine}`} />
                        <div className={`${styles.line} ${styles.infoLineLong}`} />
                    </div>
                    <div className={styles.actionButtons}>
                        <div className={`${styles.line} ${styles.btn}`} />
                        <div className={`${styles.line} ${styles.btn}`} />
                    </div>
                </div>

                {/* Table Skeleton */}
                <div className={styles.tableWrap}>
                    <div className={styles.tableHeader}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className={`${styles.line} ${styles.th}`} />
                        ))}
                    </div>
                    {Array.from({ length: 3 }).map((_, row) => (
                        <div key={row} className={styles.tableRow}>
                            <div className={`${styles.line} ${styles.tdSm}`} />
                            <div className={`${styles.line} ${styles.tdMd}`} />
                            <div className={`${styles.line} ${styles.tdMd}`} />
                            <div className={`${styles.line} ${styles.tdSm}`} />
                            <div className={`${styles.line} ${styles.tdSm}`} />
                            <div className={`${styles.line} ${styles.tdSm}`} />
                        </div>
                    ))}
                </div>

                {/* Totals Skeleton */}
                <div className={styles.totalsWrap}>
                    <div className={styles.totalsBox}>
                        <div className={styles.totalRow}>
                            <div className={`${styles.line} ${styles.totalLabel}`} />
                            <div className={`${styles.line} ${styles.totalValue}`} />
                        </div>
                        <div className={styles.totalRow}>
                            <div className={`${styles.line} ${styles.totalLabel}`} />
                            <div className={`${styles.line} ${styles.totalValue}`} />
                        </div>
                        <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                            <div className={`${styles.line} ${styles.totalLabel}`} />
                            <div className={`${styles.line} ${styles.totalValue}`} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
