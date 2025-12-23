
import React from 'react';
import { useState, useEffect } from 'react';
import type { Question, Time } from '../types';
import { AnalogClock } from './AnalogClock';
import { VirtualKeyboard } from './VirtualKeyboard';
// FIX: Import formatTime to resolve the "Cannot find name 'formatTime'" error.
import { generateQuestion, formatTime } from '../utils/questionGenerator';

interface QuizProps {
  level: number;
  onQuizComplete: (score: number) => void;
  onBackToSelect: () => void;
}

const timeTo12HourText = (time: Time): string => {
    const period = time.hour < 12 ? 'ごぜん' : 'ごご';
    let hour12 = time.hour % 12;
    if (hour12 === 0) {
        hour12 = 12;
    }
    const minuteText = time.minute.toString().padStart(2, '0');
    return `${period} ${hour12}時 ${minuteText}分`;
};

export const Quiz: React.FC<QuizProps> = ({ level, onQuizComplete, onBackToSelect }) => {
    const [question, setQuestion] = useState<Question>(generateQuestion(level));
    const [questionNumber, setQuestionNumber] = useState(1);
    const [totalScore, setTotalScore] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    
    const [userAnswerMinutes, setUserAnswerMinutes] = useState('');
    const [userAnswerHours, setUserAnswerHours] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [activeInput, setActiveInput] = useState<'hours' | 'minutes'>('minutes');

    // biome-ignore lint/correctness/useExhaustiveDependencies: Resetting on question change
    useEffect(() => {
        const hasHours = ('answer' in question && typeof question.answer === 'object' && ('hours' in question.answer || 'hour' in question.answer));
        if (hasHours) {
            setActiveInput('hours');
        } else {
            setActiveInput('minutes');
        }
    }, [question]);

    const handleKeyPress = (key: string) => {
        const targetStateSetter = activeInput === 'hours' ? setUserAnswerHours : setUserAnswerMinutes;
        
        targetStateSetter(prev => {
            if (key === 'Backspace') {
                return prev.slice(0, -1);
            }
            if (key === 'Clear') {
                return '';
            }
            if (prev.length >= 3) return prev;
            return prev + key;
        });
    };

    const checkAnswer = () => {
        const hours = parseInt(userAnswerHours, 10) || 0;
        const minutes = parseInt(userAnswerMinutes, 10) || 0;
        let correct = false;

        if ('startTime' in question && 'answer' in question && typeof question.answer === 'object' && 'hours' in question.answer) { // Level 4 or 7-4
            correct = hours === question.answer.hours && minutes === question.answer.minutes;
        } else if ('time' in question && 'durationBefore' in question) { // Level 6 or 7-6
            correct = hours === question.answer.hour && minutes === question.answer.minute;
        } else if ('time' in question && 'minutesBefore' in question) { // Level 5 or 7-5
            correct = hours === question.answer.hour && minutes === question.answer.minute;
        } else if (typeof question.answer === 'number') { // Level 1, 2, 3 or 7-3
            correct = minutes === question.answer;
        }
        
        if (correct) {
            const timeTaken = (Date.now() - startTime) / 1000;
            const questionScore = Math.max(0, 100 - Math.floor(timeTaken));
            setTotalScore(prev => prev + questionScore);
        }

        setIsCorrect(correct);
    };

    const handleNext = () => {
        const nextQuestionNumber = questionNumber + 1;
        if (nextQuestionNumber <= 10) {
            setQuestionNumber(nextQuestionNumber);
            setQuestion(generateQuestion(level));
            setUserAnswerHours('');
            setUserAnswerMinutes('');
            setIsCorrect(null);
            setStartTime(Date.now());
        } else {
            onQuizComplete(totalScore);
        }
    };
    
    const renderQuestion = () => {
        if ('time' in question && 'answer' in question && typeof question.answer === 'number' && !('minutesBefore' in question)) { // Level 1 or 2
            const nextHour = formatTime({ hour: question.time.hour + 1, minute: 0 });
            const nextHourText = `ごぜん ${nextHour.hour % 12 === 0 ? 12 : nextHour.hour % 12}時`;
            const baseHourText = `ごぜん ${question.time.hour % 12 === 0 ? 12 : question.time.hour % 12}時`;

            return (
                <>
                    <AnalogClock hour={question.time.hour} minute={question.time.minute} />
                    <p className="text-2xl md:text-3xl text-center mt-4">
                        {question.level === 1 ?
                            `このとけいは、 <strong>${baseHourText}</strong> から なんぷん すすんでいますか？` :
                            `あと なんぷん で <strong>${nextHourText}</strong> ですか？`
                        }
                    </p>
                </>
            );
        }
        if ('startTime' in question) { // Level 3, 4, 7-3, 7-4
            return <p className="text-2xl md:text-3xl text-center"><strong>{timeTo12HourText(question.startTime)}</strong> から <strong>{timeTo12HourText(question.endTime)}</strong> までは{typeof question.answer === 'number' ? 'なんぷんかん' : 'なんじかん なんぷん'} ですか？</p>;
        }
        if ('minutesBefore' in question) { // Level 5, 7-5
            return <p className="text-2xl md:text-3xl text-center"><strong>{timeTo12HourText(question.time)}</strong> の <strong>{question.minutesBefore}分まえ</strong> は、なんじ なんぷん ですか？</p>;
        }
        if ('durationBefore' in question) { // Level 6, 7-6
            return <p className="text-2xl md:text-3xl text-center"><strong>{timeTo12HourText(question.time)}</strong> の <strong>{question.durationBefore.hours}時間 {question.durationBefore.minutes}分まえ</strong> は、なんじ なんぷん ですか？</p>;
        }
        return null;
    }

    const renderAnswerFields = () => {
        const inputBaseClasses = "w-24 text-center text-4xl font-bold border-4 rounded-lg focus:outline-none transition-all duration-200";
        const activeClasses = "border-sky-500 ring-4 ring-sky-200";
        const inactiveClasses = "border-sky-300 bg-white";

        const renderInput = (type: 'hours' | 'minutes') => (
            <input
                readOnly
                type="text"
                inputMode="none"
                value={type === 'hours' ? userAnswerHours : userAnswerMinutes}
                onClick={() => setActiveInput(type)}
                className={`${inputBaseClasses} ${activeInput === type ? activeClasses : inactiveClasses}`}
                aria-label={type === 'hours' ? '時間入力欄' : '分入力欄'}
            />
        );
        
        const hasHours = ('answer' in question && typeof question.answer === 'object' && ('hours' in question.answer || 'hour' in question.answer));

        if (hasHours) {
            const hourUnit = ('durationBefore' in question || ('startTime' in question && typeof question.answer === 'object')) ? '時間' : '時';
            return (
                <div className="flex items-center gap-2 sm:gap-4">
                    {renderInput('hours')}
                    <span className="text-3xl font-bold">{hourUnit}</span>
                    {renderInput('minutes')}
                    <span className="text-3xl font-bold">分</span>
                </div>
            );
        }
        
        return (
            <div className="flex items-center gap-4">
                {renderInput('minutes')}
                <span className="text-3xl font-bold">分</span>
            </div>
        );
    };

    const renderCorrectAnswer = () => {
        if ('answer' in question) {
            if (typeof question.answer === 'object') {
                if ('hours' in question.answer) { // Level 4 or 7-4
                    return <p className="text-2xl font-bold text-slate-600">こたえ： {question.answer.hours} 時間 {question.answer.minutes} 分</p>
                }
                if ('hour' in question.answer) { // Level 5, 6 or 7-5, 7-6
                    return <p className="text-2xl font-bold text-slate-600">こたえ： {timeTo12HourText(question.answer)}</p>
                }
            } else { // Level 1, 2, 3 or 7-3
                return <p className="text-2xl font-bold text-slate-600">こたえ： {question.answer} 分</p>
            }
        }
        return null;
    }
    
    return (
        <div className="flex flex-col items-center justify-between h-full relative">
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onBackToSelect} className="text-sky-600 hover:text-sky-800 font-bold transition">
                        ← レベルをえらぶ
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-slate-600">もんだい {questionNumber}/10</span>
                        <span className="text-3xl font-extrabold text-white bg-sky-500 px-4 py-2 rounded-lg shadow-md">
                            レベル {level}
                        </span>
                    </div>
                </div>
                <div className="min-h-[200px] sm:min-h-[250px] flex flex-col items-center justify-center p-4">
                    {renderQuestion()}
                </div>
            </div>

            {isCorrect === null && (
                <div className="flex flex-col items-center gap-4 mt-4 w-full">
                    {renderAnswerFields()}
                    <div className="w-full max-w-xs mt-2">
                        <VirtualKeyboard onKeyPress={handleKeyPress} />
                    </div>
                    <button onClick={checkAnswer} className="bg-green-500 hover:bg-green-600 text-white font-bold text-3xl px-12 py-4 rounded-full shadow-lg transform transition hover:scale-105 mt-2">
                        こたえあわせ
                    </button>
                </div>
            )}
            
            {isCorrect !== null && (
                <div className={`absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-8 z-10`}>
                   {isCorrect ? (
                       <div className="text-center">
                           <div className="text-9xl text-red-500 font-black">○</div>
                           <p className="text-5xl font-bold text-red-500 mt-4">せいかい！</p>
                       </div>
                   ) : (
                       <div className="text-center">
                           <div className="text-9xl text-blue-500 font-black">×</div>
                           <p className="text-5xl font-bold text-blue-500 mt-4">おしい！</p>
                           {renderCorrectAnswer()}
                       </div>
                   )}
                   <button onClick={handleNext} className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-3xl px-12 py-4 rounded-full shadow-lg transform transition hover:scale-105">
                        {questionNumber < 10 ? 'つぎのもんだい' : 'けっかをみる'}
                    </button>
                </div>
            )}
        </div>
    );
};
