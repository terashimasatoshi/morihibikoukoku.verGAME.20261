import styles from './ProgressBar.module.css';

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const progress = (current / total) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.label}>
                Question {current} / {total}
            </div>
            <div className={styles.track}>
                <div
                    className={styles.fill}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
