'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import designData from '@/lib/design.json';
import { diagnoseUserAction } from '@/app/actions';
import QuestionCard from '@/components/QuestionCard';
import ProgressBar from '@/components/ProgressBar';
import GachaAnimation from '@/components/GachaAnimation';
import styles from './page.module.css';

const questions = designData.question_bank;

export default function DiagnosisPage() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState<any>(undefined);
    const [isReady, setIsReady] = useState(false);

    const currentQuestion = questions[currentIndex];

    const handleSelect = (value: any) => {
        // For single choice, auto-advance. For others, update state and wait for confirm.
        if (currentQuestion.type === 'single_choice') {
            const newAnswers = { ...answers, [currentQuestion.id]: value };
            setAnswers(newAnswers);
            setCurrentAnswer(undefined);
            advance(newAnswers);
        } else {
            // Multi-choice or slider updates local state first
            setCurrentAnswer(value);
        }
    };

    // Called by confirm button for multi/slider
    const handleConfirm = () => {
        const newAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
        setAnswers(newAnswers);
        setCurrentAnswer(undefined);
        advance(newAnswers);
    };

    const advance = async (currentAnswers: Record<string, any>) => {
        if (currentIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
            }, 300);
        } else {
            setIsAnalyzing(true);
            try {
                // Start API call immediately
                const resultPromise = diagnoseUserAction(currentAnswers);

                // Wait for at least 2 seconds for the "shaking" phase
                const [result] = await Promise.all([
                    resultPromise,
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]);

                localStorage.setItem('diagnosisResult', JSON.stringify(result));

                // Trigger the opening animation
                setIsReady(true);

            } catch (error) {
                console.error('Diagnosis failed', error);
                setIsAnalyzing(false);
            }
        }
    };

    const handleAnimationComplete = () => {
        router.push('/result');
    };

    if (isAnalyzing) {
        return (
            <main className={styles.main}>
                <GachaAnimation isReady={isReady} onComplete={handleAnimationComplete} />
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <div className={`container ${styles.container}`}>
                <ProgressBar current={currentIndex + 1} total={questions.length} />

                <div className={styles.cardWrapper}>
                    <QuestionCard
                        key={currentQuestion.id}
                        question={currentQuestion as any}
                        onSelect={(val) => {
                            if (currentQuestion.type === 'single_choice') {
                                handleSelect(val);
                            } else {
                                // For multi/slider, this is just state update
                                setCurrentAnswer(val);
                            }
                        }}
                        currentAnswer={currentAnswer}
                    />
                </div>

                {(currentQuestion.type !== 'single_choice') && (
                    <button
                        className={styles.nextButton}
                        onClick={handleConfirm}
                        disabled={!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)}
                    >
                        次へ進む
                    </button>
                )}
            </div>
        </main>
    );
}
