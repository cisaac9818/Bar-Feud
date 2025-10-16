// Sound effect utilities with Web Audio API fallback and custom sound support
import { soundPresets, stopThemeMusic } from './soundPresets';
import { getAudioContext, isAudioInitialized } from './audioFix';


let masterVolume = 0.7;
const audioCache: { [key: string]: HTMLAudioElement } = {};
let currentThemeAudio: HTMLAudioElement | null = null;


let customSoundsCache: { [key: string]: string } | null = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 1000; // 1 second


// Get custom sounds from localStorage with error handling and caching
const getCustomSounds = (): { [key: string]: string } => {
  const now = Date.now();
  
  // Use cache if recent
  if (customSoundsCache && (now - lastCacheUpdate) < CACHE_DURATION) {
    return customSoundsCache;
  }
  
  try {
    const saved = localStorage.getItem('customSounds');
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log('✓ Custom sounds loaded from localStorage:', Object.keys(parsed));
      customSoundsCache = parsed;
      lastCacheUpdate = now;
      return parsed;
    }
  } catch (error) {
    console.error('❌ Error loading custom sounds:', error);
  }
  
  customSoundsCache = {};
  lastCacheUpdate = now;
  return {};
};

// Force refresh of custom sounds cache
export const refreshCustomSounds = () => {
  customSoundsCache = null;
  lastCacheUpdate = 0;
  console.log('🔄 Custom sounds cache cleared, will reload on next play');
};

// Get selected preset from localStorage
const getSelectedPreset = (): string => {
  return localStorage.getItem('soundPreset') || 'classic';
};

const getAudio = (soundType: string): HTMLAudioElement | null => {
  const customSounds = getCustomSounds();
  
  // PRIORITY: Check if custom sound exists
  if (customSounds[soundType]) {
    console.log(`🎵 Using CUSTOM sound for ${soundType}`);
    console.log(`   URL length: ${customSounds[soundType].length} chars`);
    console.log(`   URL preview: ${customSounds[soundType].substring(0, 50)}...`);
    
    try {
      const audio = new Audio(customSounds[soundType]);
      audio.volume = masterVolume;
      
      // Add error handler
      audio.onerror = (e) => {
        console.error(`❌ Error loading custom audio for ${soundType}:`, e);
        console.log('   This might be due to:');
        console.log('   - Expired cloud URL (if logged in)');
        console.log('   - Corrupted data URL');
        console.log('   - Browser compatibility issue');
      };
      
      return audio;
    } catch (error) {
      console.error(`❌ Error creating Audio object for ${soundType}:`, error);
    }
  }
  
  console.log(`🔊 Using DEFAULT sound for ${soundType}`);

  // Try to load sound file (supports both .mp3 and .wav)
  if (!audioCache[soundType]) {
    try {
      const audio = new Audio();
      let loaded = false;
      
      // Try .wav first, then .mp3
      const extensions = ['wav', 'mp3'];
      for (const ext of extensions) {
        audio.src = `/sounds/${soundType}.${ext}`;
        
        // Check if file exists by attempting to load
        audio.onerror = () => {
          console.log(`⚠️ File not found: /sounds/${soundType}.${ext}`);
        };
        
        // For now, just cache it and let play() handle the error
        audioCache[soundType] = audio;
        console.log(`📁 Attempting to load /sounds/${soundType}.${ext}`);
        loaded = true;
        break;
      }
      
      if (!loaded) {
        console.log(`⚠️ No sound file found for ${soundType}, will use preset`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Could not load sound file for ${soundType}`);
      return null;
    }
  }
  return audioCache[soundType];
};


export const playSound = (soundType: string) => {
  console.log(`▶️ Playing sound: ${soundType}`);
  console.log(`   Time: ${new Date().toLocaleTimeString()}`);
  
  const audio = getAudio(soundType);
  if (audio) {
    audio.volume = masterVolume;
    audio.currentTime = 0;
    
    // Track theme audio for stopping
    if (soundType === 'theme') {
      currentThemeAudio = audio;
      audio.loop = true; // Loop theme music
    }
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log(`✓ Successfully playing ${soundType}`);
        })
        .catch((error) => {
          console.error(`❌ Error playing audio for ${soundType}:`, error);
          console.log(`🔄 Falling back to preset sound for: ${soundType}`);
          const preset = getSelectedPreset();
          soundPresets[preset]?.sounds[soundType as keyof typeof soundPresets.classic.sounds]?.();
        });
    }
  } else {
    console.log(`⚠️ No audio found, using preset for: ${soundType}`);
    const preset = getSelectedPreset();
    soundPresets[preset]?.sounds[soundType as keyof typeof soundPresets.classic.sounds]?.();
  }
};

// Stop all theme music (both audio files and preset melodies)
export const stopAllThemeMusic = () => {
  // Stop preset melody
  stopThemeMusic();
  
  // Stop audio file if playing
  if (currentThemeAudio) {
    currentThemeAudio.pause();
    currentThemeAudio.currentTime = 0;
    currentThemeAudio = null;
  }
};


export const setVolume = (volume: number) => {
  masterVolume = Math.max(0, Math.min(1, volume));
};

export const getVolume = () => masterVolume;

// Export stopThemeMusic for external control
export { stopThemeMusic };

export const sounds = {
  buzzer: () => playSound('buzzer'),
  correct: () => playSound('correct'),
  wrong: () => playSound('wrong'),
  strike: () => playSound('strike'),
  reveal: () => playSound('reveal'),
  victory: () => playSound('victory'),
  applause: () => playSound('applause'),
  theme: () => playSound('theme'),

};


export const triggerSoundEffect = (type: 'buzzer' | 'correct' | 'wrong' | 'strike' | 'reveal' | 'victory' | 'applause' | 'theme') => {
  console.log(`🎯 triggerSoundEffect called for: ${type}`);
  sounds[type]();
  
  const feedback = document.createElement('div');
  feedback.className = 'fixed top-4 right-4 bg-yellow-400 text-black font-black px-6 py-3 rounded-lg shadow-2xl z-50 animate-bounce';
  feedback.textContent = `🔊 ${type.toUpperCase()}`;
  document.body.appendChild(feedback);
  
  setTimeout(() => feedback.remove(), 1000);
};
