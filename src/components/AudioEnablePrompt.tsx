import React, { useState, useEffect } from 'react';
import { isAudioInitialized } from '../utils/audioFix';

export const AudioEnablePrompt: React.FC = () => {
  const [show, setShow] = useState(true);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    const checkAudio = setInterval(() => {
      if (isAudioInitialized()) {
        setAudioReady(true);
        setTimeout(() => setShow(false), 2000);
        clearInterval(checkAudio);
      }
    }, 500);

    return () => clearInterval(checkAudio);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-gradient-to-br from-red-900 to-black border-4 border-yellow-400 rounded-2xl p-8 max-w-md text-center shadow-2xl">
        {!audioReady ? (
          <>
            <div className="text-6xl mb-4">🔊</div>
            <h2 className="text-3xl font-black text-yellow-400 mb-4">Audio Setup Required</h2>
            <p className="text-white text-lg mb-6">
              Click anywhere on the page to enable sound effects and music.
            </p>
            <div className="animate-pulse text-yellow-300 text-sm">
              👆 Click anywhere to continue
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-black text-green-400 mb-2">Audio Enabled!</h2>
            <p className="text-white">Sound effects are now active</p>
          </>
        )}
      </div>
    </div>
  );
};
