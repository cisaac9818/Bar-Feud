// Sound preset packs with different tone characteristics
import { initializeAudioContext } from './audioFix';

export type SoundPreset = {
  name: string;
  description: string;
  sounds: {
    buzzer: () => void;
    correct: () => void;
    wrong: () => void;
    strike: () => void;
    reveal: () => void;
    victory: () => void;
    applause: () => void;
    theme: () => void;
  };
};

let audioContext: AudioContext | null = null;
let themeInterval: any = null;

// Initialize audio context lazily
const getAudioContext = () => {
  if (!audioContext) {
    initializeAudioContext();
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

const generateTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};


const playThemeMusic = (melody: number[], tempo: number = 200) => {
  if (themeInterval) clearInterval(themeInterval);
  let index = 0;
  const playNote = () => {
    generateTone(melody[index], 0.25, 'sine', 0.15);
    index = (index + 1) % melody.length;
  };
  playNote();
  themeInterval = setInterval(playNote, tempo);
};

export const stopThemeMusic = () => {
  if (themeInterval) {
    clearInterval(themeInterval);
    themeInterval = null;
  }
};


export const soundPresets: { [key: string]: SoundPreset } = {
  classic: {
    name: 'Classic Game Show',
    description: 'Traditional game show sounds',
    sounds: {
      buzzer: () => generateTone(200, 0.5, 'sawtooth'),
      correct: () => { generateTone(523, 0.1); setTimeout(() => generateTone(659, 0.2), 100); },
      wrong: () => generateTone(150, 0.3, 'sawtooth'),
      strike: () => { generateTone(300, 0.1); setTimeout(() => generateTone(200, 0.2), 100); },
      reveal: () => generateTone(800, 0.15),
      victory: () => { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => generateTone(f, 0.2), i * 150)); },
      applause: () => { for(let i = 0; i < 10; i++) setTimeout(() => generateTone(Math.random() * 500 + 500, 0.05, 'square'), i * 50); },
      theme: () => playThemeMusic([392, 440, 494, 523, 587, 659, 698, 784, 659, 587, 523, 494], 250)
    }


  },
  modern: {
    name: 'Modern',
    description: 'Sleek digital sounds',
    sounds: {
      buzzer: () => generateTone(440, 0.3, 'square', 0.2),
      correct: () => { generateTone(880, 0.1, 'sine', 0.25); setTimeout(() => generateTone(1320, 0.15, 'sine', 0.25), 80); },
      wrong: () => { generateTone(220, 0.15, 'triangle'); setTimeout(() => generateTone(110, 0.2, 'triangle'), 100); },
      strike: () => generateTone(330, 0.2, 'square', 0.2),
      reveal: () => { generateTone(1047, 0.08); setTimeout(() => generateTone(1319, 0.12), 60); },
      victory: () => { [1047, 1175, 1319, 1568, 2093].forEach((f, i) => setTimeout(() => generateTone(f, 0.15, 'sine', 0.2), i * 100)); },
      applause: () => { for(let i = 0; i < 15; i++) setTimeout(() => generateTone(Math.random() * 800 + 800, 0.04, 'sine', 0.15), i * 40); },
      theme: () => playThemeMusic([880, 988, 1047, 1175, 1319, 1175, 1047, 988], 180)
    }


  },
  retro: {
    name: 'Retro Arcade',
    description: '8-bit style sounds',
    sounds: {
      buzzer: () => { generateTone(200, 0.1, 'square'); setTimeout(() => generateTone(150, 0.2, 'square'), 100); },
      correct: () => { [262, 330, 392, 523].forEach((f, i) => setTimeout(() => generateTone(f, 0.1, 'square'), i * 80)); },
      wrong: () => { [400, 350, 300, 250, 200].forEach((f, i) => setTimeout(() => generateTone(f, 0.08, 'square'), i * 60)); },
      strike: () => { for(let i = 0; i < 3; i++) setTimeout(() => generateTone(300 - i * 50, 0.1, 'square'), i * 100); },
      reveal: () => { [523, 659, 784].forEach((f, i) => setTimeout(() => generateTone(f, 0.08, 'square'), i * 50)); },
      victory: () => { [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => setTimeout(() => generateTone(f, 0.12, 'square'), i * 100)); },
      applause: () => { for(let i = 0; i < 20; i++) setTimeout(() => generateTone(Math.random() * 300 + 400, 0.03, 'square'), i * 30); },
      theme: () => playThemeMusic([262, 330, 392, 523, 659, 784, 1047, 1319, 1047, 784, 659, 523, 392, 330], 200)
    }


  },
  comedy: {
    name: 'Comedy',
    description: 'Fun and silly sounds',
    sounds: {
      buzzer: () => { [300, 250, 200, 150, 100].forEach((f, i) => setTimeout(() => generateTone(f, 0.1, 'sawtooth'), i * 80)); },
      correct: () => { [523, 698, 880].forEach((f, i) => setTimeout(() => generateTone(f, 0.15, 'sine', 0.3), i * 100)); },
      wrong: () => { generateTone(100, 0.5, 'sawtooth', 0.3); },
      strike: () => { generateTone(200, 0.05); setTimeout(() => generateTone(180, 0.05), 50); setTimeout(() => generateTone(160, 0.2), 100); },
      reveal: () => { [400, 500, 600, 700, 800].forEach((f, i) => setTimeout(() => generateTone(f, 0.06, 'sine'), i * 40)); },
      victory: () => { [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => setTimeout(() => generateTone(f, 0.15, 'sine', 0.25), i * 120)); },
      applause: () => { for(let i = 0; i < 25; i++) setTimeout(() => generateTone(Math.random() * 600 + 300, 0.04, 'sawtooth', 0.15), i * 35); },
      theme: () => playThemeMusic([349, 392, 440, 494, 523, 587, 659, 698, 659, 587, 523, 494, 440, 392], 220)
    }
  }
};
