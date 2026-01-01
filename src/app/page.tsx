'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // GTM: ページビューイベント送信
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: '/',
      });
    }
  }, []);

  const handleStartDiagnosis = () => {
    // GTM: 診断開始ボタンクリックイベント送信
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'click',
        click_url: '/diagnosis',
      });
    }

    // ページ遷移
    router.push('/diagnosis');
  };

  return (
    <main className={styles.main}>
      <div className={`container ${styles.content}`}>
        <div className={styles.header}>
          <h1 className={styles.title}>森の日々<br /><span className={styles.subtitle}>お疲れ診断</span></h1>
          <p className={styles.description}>
            日々の生活習慣や体の状態から、<br />
            あなたの「お疲れタイプ」を診断します。<br />
            森の動物たちと一緒に、<br />
            癒しのメニューを見つけましょう。
          </p>
        </div>

        <div className={styles.action}>
          <Button fullWidth className="fade-in" onClick={handleStartDiagnosis}>
            診断をはじめる
          </Button>
        </div>

        <div className={styles.footer}>
          <p>© Morinohibi</p>
        </div>
      </div>
    </main>
  );
}
