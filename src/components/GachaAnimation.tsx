import { useEffect, useState } from 'react';
import styles from './GachaAnimation.module.css';

interface GachaAnimationProps {
    isReady: boolean;
    onComplete: () => void;
}

export default function GachaAnimation({ isReady, onComplete }: GachaAnimationProps) {
    const [stage, setStage] = useState<'shaking' | 'opening' | 'finished'>('shaking');

    useEffect(() => {
        if (isReady && stage === 'shaking') {
            // Wait a tiny bit to ensure user sees shaking if it was too fast, 
            // but usually the parent handles the minimum wait.
            setStage('opening');
        }
    }, [isReady, stage]);

    useEffect(() => {
        if (stage === 'opening') {
            // Wait for animation to finish (e.g. 1.5s) then call onComplete
            const timer = setTimeout(() => {
                setStage('finished');
                onComplete();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [stage, onComplete]);

    return (
        <div className={`${styles.container} ${stage === 'opening' ? styles.flashContainer : ''}`}>
            <div className={`${styles.rays} ${stage === 'opening' ? styles.raysActive : ''}`}></div>

            <div className={`${styles.capsuleContainer} ${stage === 'opening' ? styles.containerOpening : ''}`}>
                <div className={`${styles.capsule} ${stage === 'opening' ? styles.capsuleOpening : ''}`}>
                    <div className={`${styles.capTop} ${stage === 'opening' ? styles.capTopOpen : ''}`}></div>
                    <div className={`${styles.capBottom} ${stage === 'opening' ? styles.capBottomOpen : ''}`}></div>
                    <div className={styles.shine}></div>

                    {/* Light burst from inside */}
                    <div className={`${styles.innerLight} ${stage === 'opening' ? styles.innerLightActive : ''}`}></div>
                </div>

                <div className={styles.shadow}></div>

                {/* Particles */}
                <div className={styles.sparkles}>
                    <span>✨</span>
                    <span>✨</span>
                    <span>✨</span>
                    {stage === 'opening' && (
                        <>
                            <span className={styles.burstParticle}>⭐</span>
                            <span className={styles.burstParticle}>🌟</span>
                            <span className={styles.burstParticle}>✨</span>
                            <span className={styles.burstParticle}>💫</span>
                        </>
                    )}
                </div>
            </div>

            <p className={`${styles.text} ${stage === 'opening' ? styles.textFadeOut : ''}`}>
                {stage === 'shaking' ? '森の賢者を呼んでいます...' : ' '}
            </p>

            {/* Whiteout overlay */}
            <div className={`${styles.whiteout} ${stage === 'opening' ? styles.whiteoutActive : ''}`}></div>
        </div>
    );
}
