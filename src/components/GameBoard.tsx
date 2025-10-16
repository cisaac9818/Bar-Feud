import React from 'react';
import { AnswerCard } from './AnswerCard';
import { Question } from '../types/game';

interface GameBoardProps {
  question: Question | null;
  onRevealAnswer: (id: number) => void;
  logo: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({ question, onRevealAnswer, logo }) => {
  if (!question) {
    return (
      <div className="text-center py-20">
        <h2 className="text-5xl font-black text-yellow-400">Select a Question to Start!</h2>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Logo and Question */}
      <div className="text-center space-y-3">
        <img src={logo} alt="Bar Logo" className="w-20 h-20 mx-auto drop-shadow-2xl" />
        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide px-6 py-4 bg-black/70 rounded-xl border-4 border-yellow-400 shadow-2xl">
          {question.question}
        </h1>
      </div>

      {/* Answer Board */}
      <div className="grid grid-cols-1 gap-3 max-w-3xl mx-auto">
        {question.answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            onReveal={() => onRevealAnswer(answer.id)}
          />
        ))}
      </div>
    </div>
  );
};

