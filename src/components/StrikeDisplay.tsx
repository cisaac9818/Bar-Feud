import React from 'react';

interface StrikeDisplayProps {
  strikes: number;
}

export const StrikeDisplay: React.FC<StrikeDisplayProps> = ({ strikes }) => {
  return (
    <div className="flex gap-3 justify-center items-center p-3 bg-black/60 rounded-lg border-3 border-red-600">
      {[1, 2, 3].map((num) => (
        <div
          key={num}
          className={`relative w-14 h-14 rounded-full border-3 transition-all duration-500 ${
            num <= strikes
              ? 'border-red-600 bg-red-500 animate-pulse'
              : 'border-gray-600 bg-gray-800'
          }`}
        >
          {num <= strikes && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-black text-white animate-bounce">✕</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

