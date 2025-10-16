import React, { useState, useEffect, useRef } from 'react';
import { getVolume, setVolume, sounds, stopAllThemeMusic } from '../utils/sounds';



interface HostControlsProps {
  onAddStrike: () => void;
  onResetStrikes: () => void;
  onAwardPoints: (team: 1 | 2) => void;
  onResetGame: () => void;
  onNextRound: () => void;
  currentRound: string;
}

export const HostControls: React.FC<HostControlsProps> = ({
  onAddStrike,
  onResetStrikes,
  onAwardPoints,
  onResetGame,
  onNextRound,
  currentRound,
}) => {
  const [volume, setVolumeState] = useState(getVolume() * 100);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      // Clean up theme music on unmount
      stopAllThemeMusic();
    };
  }, []);



  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolumeState(newVolume);
    setVolume(newVolume / 100);
  };

  const testSound = () => {
    sounds.buzzer();
  };

  const playTheme = () => {
    sounds.theme();
    setIsPlaying(true);
  };

  const pauseTheme = () => {
    stopAllThemeMusic();
    setIsPlaying(false);
  };

  const stopTheme = () => {
    stopAllThemeMusic();
    setIsPlaying(false);
  };




  return (
    <div className="bg-gray-900 p-6 rounded-xl border-4 border-purple-600 space-y-4">
      <h3 className="text-2xl font-black text-purple-400 uppercase text-center">Host Controls</h3>
      
      {/* Theme Music Controls */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <label className="text-yellow-400 font-bold text-sm block mb-2">
          🎵 Theme Music
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={playTheme}
            disabled={isPlaying}
            className={`${isPlaying ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2 px-3 rounded-lg transition text-sm`}
          >
            ▶️ Play
          </button>
          <button 
            onClick={pauseTheme}
            disabled={!isPlaying}
            className={`${!isPlaying ? 'bg-gray-600' : 'bg-yellow-600 hover:bg-yellow-700'} text-white font-bold py-2 px-3 rounded-lg transition text-sm`}
          >
            ⏸️ Pause
          </button>
          <button 
            onClick={stopTheme}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition text-sm"
          >
            ⏹️ Stop
          </button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="bg-gray-800 p-4 rounded-lg space-y-2">
        <label className="text-yellow-400 font-bold text-sm block mb-2">
          🔊 Volume: {volume}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
        <button 
          onClick={testSound}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
        >
          🔊 Test Sound
        </button>
      </div>

      
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onAddStrike} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition">
          Add Strike ✕
        </button>
        <button onClick={onResetStrikes} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition">
          Reset Strikes
        </button>
        <button onClick={() => onAwardPoints(1)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition">
          Award Team 1
        </button>
        <button onClick={() => onAwardPoints(2)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition">
          Award Team 2
        </button>
      </div>
      
      <div className="pt-4 border-t border-purple-600 space-y-3">
        <div className="text-center text-yellow-400 font-bold">Round: {currentRound}</div>
        <button onClick={onNextRound} className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-4 rounded-lg transition">
          Next Round
        </button>
        <button onClick={onResetGame} className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition">
          Reset Game
        </button>
      </div>
    </div>
  );
};

