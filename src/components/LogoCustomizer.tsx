import React, { useState } from 'react';

interface LogoCustomizerProps {
  currentLogo: string;
  onLogoChange: (url: string) => void;
}

export const LogoCustomizer: React.FC<LogoCustomizerProps> = ({ currentLogo, onLogoChange }) => {
  const [logoUrl, setLogoUrl] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (logoUrl.trim()) {
      onLogoChange(logoUrl);
      setLogoUrl('');
      setShowInput(false);
    }
  };

  const presetLogos = [
    'https://d64gsuwffb70l.cloudfront.net/68ef9da9b4d1a124ccc08fde_1760534449907_2f6dd7ee.png',
  ];

  return (
    <div className="bg-gray-900 p-6 rounded-xl border-4 border-yellow-600 space-y-4">
      <h3 className="text-2xl font-black text-yellow-400 uppercase text-center">Bar Logo</h3>
      
      <div className="flex justify-center">
        <img src={currentLogo} alt="Current Logo" className="w-32 h-32 object-contain rounded-full border-4 border-yellow-400" />
      </div>

      <button
        onClick={() => setShowInput(!showInput)}
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-4 rounded-lg transition"
      >
        {showInput ? 'Cancel' : 'Change Logo'}
      </button>

      {showInput && (
        <form onSubmit={handleSubmit} className="space-y-3 bg-gray-800 p-4 rounded-lg">
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="Enter logo URL..."
            className="w-full p-3 rounded bg-gray-700 text-white"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Update Logo
          </button>
          
          <div className="pt-3 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-2">Or select preset:</p>
            <div className="flex gap-2">
              {presetLogos.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onLogoChange(url)}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                >
                  <img src={url} alt={`Preset ${i + 1}`} className="w-16 h-16 object-contain" />
                </button>
              ))}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
