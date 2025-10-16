import React from 'react';
import { Team } from '../types/game';

interface VictoryScreenProps {
  winner: Team;
  onClose: () => void;
  logo: string;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ winner, onClose, logo }) => {
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center animate-fadeIn">
      <div className="text-center space-y-8 p-12 max-w-2xl">
        <img src={logo} alt="Logo" className="w-40 h-40 mx-auto animate-bounce" />
        
        <div className="space-y-4">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 drop-shadow-[0_0_40px_rgba(250,204,21,1)] animate-pulse">
            WINNER!
          </h1>
          
          <h2 className={`text-6xl font-black text-white bg-gradient-to-r ${winner.color} px-8 py-4 rounded-2xl border-8 border-yellow-400 shadow-2xl`}>
            {winner.name}
          </h2>
          
          <div className="text-5xl font-black text-yellow-400">
            Final Score: {winner.score}
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-8">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black text-2xl py-4 px-12 rounded-xl transition transform hover:scale-105 shadow-2xl"
          >
            Play Again
          </button>
        </div>

        <div className="text-yellow-400 text-3xl font-bold animate-pulse">
          🎉 🎊 🏆 🎊 🎉
        </div>
      </div>
    </div>
  );
};
