
import React, { useState, useCallback, useEffect } from 'react';
import { LevelSelector } from './components/LevelSelector';
import { Quiz } from './components/Quiz';
import { ResultScreen } from './components/ResultScreen';
import { getHighScores, saveHighScores, ScoreData } from './utils/storage';

type GameState = 'level-select' | 'quiz' | 'result';

export default function App() {
  const [level, setLevel] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>('level-select');
  const [highScores, setHighScores] = useState<Record<number, ScoreData>>({});
  const [lastScore, setLastScore] = useState<number>(0);

  useEffect(() => {
    setHighScores(getHighScores());
  }, []);

  const startQuiz = useCallback((selectedLevel: number) => {
    setLevel(selectedLevel);
    setGameState('quiz');
  }, []);

  const finishQuiz = useCallback((finalScore: number) => {
    if (!level) return;

    setLastScore(finalScore);

    const currentHighScore = highScores[level]?.score || 0;
    if (finalScore > currentHighScore) {
      const newHighScores = {
        ...highScores,
        [level]: {
          score: finalScore,
          medal: finalScore >= 900,
        },
      };
      setHighScores(newHighScores);
      saveHighScores(newHighScores);
    }
    setGameState('result');
  }, [level, highScores]);

  const backToLevelSelect = useCallback(() => {
    setGameState('level-select');
    setLevel(null);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-4xl mx-auto mb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-sky-600">
          とけいとじかんマスター
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          もんだんにこたえて、じかんのはかせになろう！
        </p>
      </header>
      
      <main className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 flex-grow">
        {gameState === 'level-select' && <LevelSelector onSelectLevel={startQuiz} highScores={highScores} />}
        {gameState === 'quiz' && level && (
          <Quiz 
            level={level} 
            onQuizComplete={finishQuiz}
            onBackToSelect={backToLevelSelect} 
          />
        )}
        {gameState === 'result' && level !== null && (
          <ResultScreen
            level={level}
            score={lastScore}
            highScoreData={highScores[level]}
            onBackToSelect={backToLevelSelect}
          />
        )}
      </main>
      
      <footer className="w-full max-w-4xl mx-auto mt-6 text-center text-slate-400 text-sm">
        <p>&copy; 2024 時間学習アプリ</p>
      </footer>
    </div>
  );
}
