
import React from 'react';
import type { ScoreData } from '../utils/storage';

interface ResultScreenProps {
  level: number;
  score: number;
  highScoreData?: ScoreData;
  onBackToSelect: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ level, score, highScoreData, onBackToSelect }) => {
  const isNewHighScore = !highScoreData || score > highScoreData.score;
  const earnedMedal = score >= 900;
  
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <h2 className="text-4xl font-bold mb-2 text-slate-700">レベル {level} の けっか</h2>
      
      {isNewHighScore && (
        <p className="text-2xl font-bold text-yellow-500 my-4 p-2 bg-yellow-100 rounded-lg animate-bounce">
          ハイスコア こうしん！
        </p>
      )}

      <p className="text-2xl text-slate-600 mb-4">あなたのスコア</p>
      <p className="text-8xl font-black text-sky-600 mb-8">{score}</p>

      {earnedMedal && (
        <div className="mb-8 text-center">
          <div className="text-8xl transform transition-transform duration-500 hover:scale-125">🥇</div>
          <p className="text-3xl font-bold text-yellow-600 mt-2">メダル ゲット！</p>
        </div>
      )}
      
      <button 
        onClick={onBackToSelect}
        className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-3xl px-12 py-4 rounded-full shadow-lg transform transition hover:scale-105"
      >
        レベルをえらぶ
      </button>
    </div>
  );
};
