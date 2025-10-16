import React from 'react';
import { Question } from '../types/game';
import { sounds } from '../utils/sounds';

interface HostAnswerSheetProps {
  question: Question | null;
  onRevealAnswer: (id: number) => void;
}

export const HostAnswerSheet: React.FC<HostAnswerSheetProps> = ({ question, onRevealAnswer }) => {
  const handleReveal = (id: number) => {
    // Check for custom correct answer sound
    const customSounds = localStorage.getItem('customSounds');
    if (customSounds) {
      try {
        const soundsData = JSON.parse(customSounds);
        if (soundsData.correct) {
          const audio = new Audio(soundsData.correct);
          audio.play();
        } else {
          sounds.correct();
        }
      } catch (error) {
        sounds.correct();
      }
    } else {
      sounds.correct();
    }
    
    onRevealAnswer(id);
  };


  if (!question) {
    return (
      <div className="bg-gray-900 p-6 rounded-xl border-4 border-yellow-600">
        <h3 className="text-xl font-black text-yellow-400 uppercase text-center">
          Host Answer Sheet
        </h3>
        <p className="text-gray-400 text-center mt-4">No question selected</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl border-4 border-yellow-600 space-y-4">
      <h3 className="text-xl font-black text-yellow-400 uppercase text-center mb-4">
        📋 Host Answer Sheet
      </h3>
      
      <div className="space-y-2">
        {question.answers.map((answer) => (
          <button
            key={answer.id}
            onClick={() => handleReveal(answer.id)}
            disabled={answer.revealed}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              answer.revealed
                ? 'bg-green-900 border-green-600 cursor-not-allowed opacity-60'
                : 'bg-blue-900 border-blue-600 hover:bg-blue-800 hover:border-yellow-400 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-bold text-lg">#{answer.id}</span>
                <span className={`font-bold ${answer.revealed ? 'text-green-400' : 'text-white'}`}>
                  {answer.text}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-400 font-black text-xl">{answer.points}</span>
                {answer.revealed && <span className="text-green-400">✓</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="pt-4 border-t border-yellow-600 text-center text-sm text-gray-400">
        Click an answer to reveal it on the main board
      </div>
    </div>
  );
};

