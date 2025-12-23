
import React from 'react';
import type { ScoreData } from '../utils/storage';

interface LevelSelectorProps {
  onSelectLevel: (level: number) => void;
  highScores: Record<number, ScoreData>;
}

const levels = [
  { level: 1, title: 'なんぷん すすんだ？', color: 'bg-green-400', hover: 'hover:bg-green-500' },
  { level: 2, title: 'あと なんぷん？', color: 'bg-blue-400', hover: 'hover:bg-blue-500' },
  { level: 3, title: 'あいだは なんぷん？', color: 'bg-yellow-400', hover: 'hover:bg-yellow-500' },
  { level: 4, title: 'なんじかん なんぷん？', color: 'bg-orange-400', hover: 'hover:bg-orange-500' },
  { level: 5, title: 'なんぷん まえは？', color: 'bg-red-400', hover: 'hover:bg-red-500' },
  { level: 6, title: 'なんじかん なんぷん まえは？', color: 'bg-purple-400', hover: 'hover:bg-purple-500' },
  { level: 7, title: 'チャレンジもんだい', color: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500', hover: 'hover:opacity-90' },
];

export const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel, highScores }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl font-bold mb-8 text-slate-700">レベルをえらぼう！</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {levels.map(({ level, title, color, hover }) => {
          const scoreData = highScores[level];
          const isChallenge = level === 7;
          return (
            <button
              key={level}
              onClick={() => onSelectLevel(level)}
              className={`p-5 rounded-xl text-white font-bold shadow-lg transform transition-transform duration-200 hover:-translate-y-2 flex flex-col justify-between min-h-[160px] ${color} ${hover} ${isChallenge ? 'col-span-1 sm:col-span-2 lg:col-span-3' : ''}`}
            >
              <div className="flex justify-between items-start w-full">
                <div className="text-lg font-semibold bg-black bg-opacity-20 px-2 py-0.5 rounded-md">
                  {isChallenge ? 'さいごの' : ''}レベル {level}
                </div>
                {scoreData?.medal && <div className="text-4xl animate-pulse">🥇</div>}
              </div>
              <div className="text-2xl text-left w-full">{title}</div>
              <div className="mt-2 text-base font-normal text-left w-full bg-black bg-opacity-20 px-2 py-0.5 rounded-md">
                ハイスコア: {scoreData?.score || 0}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
};
