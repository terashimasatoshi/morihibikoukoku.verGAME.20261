'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DiagnosisResult } from '@/app/actions';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function ResultPage() {
    const [result, setResult] = useState<DiagnosisResult | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('diagnosisResult');
        if (stored) {
            setResult(JSON.parse(stored));
        }
    }, []);

    if (!result) {
        return (
            <main className={styles.main}>
                <div className={`container ${styles.container}`}>
                    <p>読み込み中...</p>
                </div>
            </main>
        );
    }

    const { animal, primaryMenu, secondaryMenu, addOns, advice } = result;

    return (
        <main className={styles.main}>
            <div className={`container ${styles.container}`}>
                <div className={`${styles.card} fade-in`}>
                    <div className={styles.animalIcon}>
                        <div className={`${styles.iconCircle} ${styles[animal.id]}`}>
                            {animal.emoji}
                        </div>
                    </div>

                    <p className={styles.catchphrase}>{animal.catchphrase}</p>
                    <h1 className={styles.title}>あなたは<br />{animal.name}</h1>

                    {result.personalityDescription && (
                        <div className={styles.personalitySection}>
                            <p className={styles.personalityText}>{result.personalityDescription}</p>
                        </div>
                    )}

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>森の賢者からのアドバイス</h2>
                        <p className={styles.text}>{advice}</p>
                    </div>

                    <div className={styles.menuCard}>
                        <div className={styles.recommendLabel}>あなたへのイチオシ</div>
                        <h2 className={styles.menuName}>{primaryMenu.menu_name}</h2>
                        <div className={styles.tags}>
                            {primaryMenu.key_reasons.map((reason, i) => (
                                <span key={i} className={styles.tag}>{reason}</span>
                            ))}
                        </div>
                        <div className={styles.promoText}>
                            \ このページからの予約がお得！ /
                        </div>
                    </div>

                    {secondaryMenu && (
                        <div className={`${styles.menuCard} ${styles.secondary}`}>
                            <div className={styles.recommendLabel}>こちらもおすすめ</div>
                            <h3 className={styles.menuNameSmall}>{secondaryMenu.menu_name}</h3>
                            <p className={styles.reasonSmall}>{secondaryMenu.key_reasons[0]}</p>
                        </div>
                    )}

                    {addOns.length > 0 && (
                        <div className={styles.addOnSection}>
                            <h3 className={styles.addOnTitle}>＋プラスでさらに癒やしを</h3>
                            <ul className={styles.addOnList}>
                                {addOns.map(addon => (
                                    <li key={addon.menu_id} className={styles.addOnItem}>
                                        <span className={styles.addOnName}>{addon.menu_name}</span>
                                        <span className={styles.addOnReason}>{addon.key_reasons[0]}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Button fullWidth onClick={() => window.open('https://beauty.hotpepper.jp/', '_blank')}>
                            このメニューを予約する
                        </Button>
                        <Link href="/diagnosis" passHref legacyBehavior>
                            <Button variant="outline" fullWidth className={styles.retryBtn}>
                                もう一度診断する
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
