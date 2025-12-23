
import React from 'react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
}

const keys = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  'けす', '0', '⌫'
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress }) => {
  const handlePress = (key: string) => {
    if (key === '⌫') {
      onKeyPress('Backspace');
    } else if (key === 'けす') {
      onKeyPress('Clear');
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-2 max-w-sm mx-auto bg-slate-100 rounded-lg shadow-inner">
      {keys.map((key) => (
        <button
          key={key}
          onClick={() => handlePress(key)}
          className="h-14 sm:h-16 text-2xl sm:text-3xl font-bold text-slate-700 rounded-lg shadow-md bg-white hover:bg-slate-50 active:bg-sky-100 active:shadow-inner transform transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label={key === '⌫' ? '一文字消す' : key === 'けす' ? '全部消す' : `数字の${key}`}
        >
          {key}
        </button>
      ))}
    </div>
  );
};
