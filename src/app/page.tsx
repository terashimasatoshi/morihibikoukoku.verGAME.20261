import Link from 'next/link';
import Button from '@/components/Button';
import styles from './page.module.css';

export default function Home() {
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
          <Link href="/diagnosis" passHref legacyBehavior>
            <Button fullWidth className="fade-in">診断をはじめる</Button>
          </Link>
        </div>

        <div className={styles.footer}>
          <p>© Morinohibi</p>
        </div>
      </div>
    </main>
  );
}
