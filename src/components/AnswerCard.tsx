import React from 'react';
import { Answer } from '../types/game';

interface AnswerCardProps {
  answer: Answer;
  onReveal: () => void;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ answer, onReveal }) => {
  return (
    <div 
      onClick={onReveal}
      className={`relative h-12 cursor-pointer transition-all duration-500 transform ${
        answer.revealed ? 'scale-105' : 'hover:scale-102'
      }`}
    >
      <div className={`absolute inset-0 transition-transform duration-700 transform-style-3d ${
        answer.revealed ? 'rotate-y-180' : ''
      }`}>
        {/* Front - Hidden */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-r from-blue-900 to-blue-700 border-3 border-yellow-400 rounded-lg flex items-center justify-center shadow-2xl">
          <span className="text-3xl font-bold text-yellow-400">{answer.id}</span>
        </div>
        
        {/* Back - Revealed */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-r from-yellow-500 to-yellow-600 border-3 border-red-600 rounded-lg flex items-center justify-between px-4 shadow-2xl">
          <span className="text-xl font-black text-black uppercase tracking-wide">{answer.text}</span>
          <span className="text-3xl font-black text-red-600 bg-black px-3 py-1 rounded">{answer.points}</span>
        </div>
      </div>
    </div>
  );
};

