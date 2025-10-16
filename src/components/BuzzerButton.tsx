import React, { useState } from 'react';
import { sounds } from '../utils/sounds';

interface BuzzerButtonProps {
  teamName: string;
  color: string;
  onBuzz: () => void;
  disabled?: boolean;
}

export const BuzzerButton: React.FC<BuzzerButtonProps> = ({ teamName, color, onBuzz, disabled }) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    if (disabled) return;
    setPressed(true);
    
    // Check for custom buzzer sound
    const customSounds = localStorage.getItem('customSounds');
    if (customSounds) {
      try {
        const sounds = JSON.parse(customSounds);
        if (sounds.buzzer) {
          const audio = new Audio(sounds.buzzer);
          audio.play();
        } else {
          sounds.buzzer();
        }
      } catch (error) {
        sounds.buzzer();
      }
    } else {
      sounds.buzzer();
    }
    
    onBuzz();
    setTimeout(() => setPressed(false), 300);
  };


  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      className={`relative w-full py-8 rounded-2xl font-black text-3xl uppercase tracking-wider transition-all duration-150 ${
        pressed ? 'scale-95 shadow-inner' : 'scale-100 shadow-2xl'
      } ${
        disabled
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
          : `bg-gradient-to-br ${color} text-white hover:scale-105 active:scale-95 cursor-pointer`
      }`}
    >
      {pressed && !disabled && (
        <div className="absolute inset-0 bg-white/30 rounded-2xl animate-ping" />
      )}
      <span className="relative z-10">🔔 {teamName} BUZZ!</span>
    </button>
  );
};

