
import React from 'react';

interface AnalogClockProps {
  hour: number;
  minute: number;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ hour, minute }) => {
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;

  return (
    <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto my-4">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Clock Face */}
        <circle cx="100" cy="100" r="95" fill="white" stroke="#38bdf8" strokeWidth="4" />
        <circle cx="100" cy="100" r="4" fill="#334155" />

        {/* Hour and Minute Markers */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={`hour-marker-${i}`}
            x1="100"
            y1="10"
            x2="100"
            y2="20"
            stroke="#334155"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${i * 30} 100 100)`}
          />
        ))}
        {Array.from({ length: 60 }).map((_, i) => {
          if (i % 5 !== 0) {
            return (
              <line
                key={`minute-marker-${i}`}
                x1="100"
                y1="10"
                x2="100"
                y2="14"
                stroke="#a1a1aa"
                strokeWidth="1"
                transform={`rotate(${i * 6} 100 100)`}
              />
            );
          }
          return null;
        })}
        
        {/* Numbers */}
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => {
            const angle = num * 30 * Math.PI / 180;
            const x = 100 + 78 * Math.sin(angle);
            const y = 100 - 78 * Math.cos(angle);
            return (
                <text key={num} x={x} y={y} textAnchor="middle" dominantBaseline="central" className="text-lg font-bold fill-slate-700">
                    {num}
                </text>
            )
        })}

        {/* Hour Hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="55"
          stroke="#334155"
          strokeWidth="6"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 100 100)`}
        />

        {/* Minute Hand */}
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="#334155"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 100 100)`}
        />
      </svg>
    </div>
  );
};
