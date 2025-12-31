import { Question, QuestionOption } from '@/lib/types';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
    question: Question;
    onSelect: (value: string | number | string[]) => void;
    currentAnswer?: string | number | string[];
}

export default function QuestionCard({ question, onSelect, currentAnswer }: QuestionCardProps) {
    const handleMultiSelect = (value: string) => {
        const current = (currentAnswer as string[]) || [];
        if (current.includes(value)) {
            onSelect(current.filter(v => v !== value));
        } else {
            onSelect([...current, value]);
        }
    };

    return (
        <div className={`${styles.card} fade-in`}>
            <h2 className={styles.questionText}>{question.question}</h2>

            <div className={styles.options}>
                {question.type === 'single_choice' && Array.isArray(question.options) && (
                    question.options.map((option: QuestionOption) => (
                        <button
                            key={option.value}
                            className={`${styles.optionButton} ${currentAnswer === option.value ? styles.selected : ''}`}
                            onClick={() => onSelect(option.value)}
                        >
                            {option.label}
                        </button>
                    ))
                )}

                {question.type === 'multi_choice' && Array.isArray(question.options) && (
                    <>
                        {question.options.map((option: QuestionOption) => (
                            <button
                                key={option.value}
                                className={`${styles.optionButton} ${(currentAnswer as string[] || []).includes(option.value as string) ? styles.selected : ''}`}
                                onClick={() => handleMultiSelect(option.value as string)}
                            >
                                <div className={styles.checkbox}>
                                    {(currentAnswer as string[] || []).includes(option.value as string) && '✓'}
                                </div>
                                {option.label}
                            </button>
                        ))}
                    </>
                )}

                {question.type === 'slider_0_10' && !Array.isArray(question.options) && (
                    <div className={styles.sliderContainer}>
                        <div className={styles.sliderLabels}>
                            <span>{question.options.labels[0]}</span>
                            <span>{question.options.labels[1]}</span>
                        </div>
                        <input
                            type="range"
                            min={question.options.min}
                            max={question.options.max}
                            value={(currentAnswer as number) || 5}
                            onChange={(e) => onSelect(parseInt(e.target.value))}
                            className={styles.slider}
                        />
                        <div className={styles.sliderValue}>
                            {(currentAnswer as number) || 5}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
