import styles from "./OrdersListSkeleton.module.css";

export default function OrdersListSkeleton() {
    return (
        <div className={styles.page} aria-hidden="true">
            {/* Header Skeleton */}
            <header className={styles.header}>
                <div>
                    <div className={`${styles.line} ${styles.title}`} />
                    <div className={`${styles.line} ${styles.subtitle}`} />
                </div>
            </header>

            {/* Tabs Skeleton */}
            <div className={styles.tabs}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`${styles.line} ${styles.tab}`} />
                ))}
            </div>

            {/* Toolbar Skeleton */}
            <div className={styles.toolbar}>
                <div className={`${styles.line} ${styles.search}`} />
                <div className={`${styles.line} ${styles.count}`} />
            </div>

            {/* Table Skeleton */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <th key={i}><div className={`${styles.line} ${styles.th}`} /></th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 6 }).map((_, row) => (
                            <tr key={row}>
                                <td><div className={`${styles.line} ${styles.cellSm}`} /></td>
                                <td>
                                    <div className={styles.cellStack}>
                                        <div className={`${styles.line} ${styles.cellMd}`} />
                                        <div className={`${styles.line} ${styles.cellSm}`} />
                                    </div>
                                </td>
                                <td><div className={`${styles.line} ${styles.cellSm}`} /></td>
                                <td><div className={`${styles.line} ${styles.badge}`} /></td>
                                <td><div className={`${styles.line} ${styles.cellMd}`} /></td>
                                <td className={styles.tdRight}><div className={`${styles.line} ${styles.icon}`} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
