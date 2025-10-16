// Audio initialization fix for production deployment
let audioInitialized = false;
let audioContext: AudioContext | null = null;

export const initializeAudioContext = () => {
  if (audioInitialized) {
    console.log('✓ Audio already initialized');
    return true;
  }
  
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) {
      console.warn('❌ Web Audio API not supported');
      return false;
    }
    
    audioContext = new AudioContextClass();
    
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log('✓ Audio context resumed');
      });
    }
    
    audioInitialized = true;
    console.log('✓ Audio context initialized successfully');
    console.log('  State:', audioContext.state);
    console.log('  Sample rate:', audioContext.sampleRate);
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize audio context:', error);
    return false;
  }
};

export const getAudioContext = () => {
  if (!audioContext) {
    initializeAudioContext();
  }
  return audioContext;
};

export const isAudioInitialized = () => audioInitialized;

export const setupAudioInitializer = () => {
  const initOnInteraction = () => {
    console.log('🎯 User interaction detected, initializing audio...');
    const success = initializeAudioContext();
    if (success) {
      console.log('🔊 Audio enabled after user interaction');
      document.removeEventListener('click', initOnInteraction);
      document.removeEventListener('touchstart', initOnInteraction);
      document.removeEventListener('keydown', initOnInteraction);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white font-bold px-6 py-3 rounded-lg shadow-2xl z-[9999] animate-bounce';
      notification.textContent = '🔊 Audio Enabled!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    }
  };
  
  document.addEventListener('click', initOnInteraction);
  document.addEventListener('touchstart', initOnInteraction);
  document.addEventListener('keydown', initOnInteraction);
  
  console.log('🎵 Audio initializer setup - click anywhere to enable audio');
};
