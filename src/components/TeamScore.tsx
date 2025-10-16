import React from 'react';
import { Team } from '../types/game';

interface TeamScoreProps {
  team: Team;
  isActive: boolean;
  side: 'left' | 'right';
}

export const TeamScore: React.FC<TeamScoreProps> = ({ team, isActive, side }) => {
  return (
    <div
      className={`relative p-4 rounded-xl border-4 transition-all duration-300 ${
        isActive
          ? `border-yellow-400 bg-gradient-to-br ${team.color} shadow-2xl shadow-yellow-400/50 scale-105`
          : 'border-gray-600 bg-gradient-to-br from-gray-800 to-gray-900'
      }`}
    >
      <div className="text-center">
        <h2 className="text-xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-lg">
          {team.name}
        </h2>
        <div className="bg-black/80 rounded-lg p-3 border-3 border-yellow-500">
          <div className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]">
            {team.score}
          </div>
        </div>
      </div>
      {isActive && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping" />
      )}
    </div>
  );
};

