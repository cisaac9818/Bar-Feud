import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { soundPresets } from '@/utils/soundPresets';
import { Volume2, Upload, RotateCcw, Cloud, User, Bug } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadSoundToCloud, getUserSounds, deleteSoundFromCloud } from '@/utils/cloudSounds';
import { useToast } from '@/hooks/use-toast';
import { WaveformEditor } from './WaveformEditor';
import { triggerSoundEffect, refreshCustomSounds } from '@/utils/sounds';



type SoundType = 'buzzer' | 'correct' | 'wrong' | 'strike' | 'reveal' | 'victory' | 'applause' | 'theme';


const soundLabels: Record<SoundType, string> = {
  buzzer: 'Buzzer',
  correct: 'Correct Answer',
  wrong: 'Wrong Answer',
  strike: 'Strike',
  reveal: 'Reveal Answer',
  victory: 'Victory',
  applause: 'Applause',
  theme: 'Theme Music'
};


export function SoundCustomizer() {
  const [customSounds, setCustomSounds] = useState<{ [key: string]: string }>({});
  const [selectedPreset, setSelectedPreset] = useState('classic');
  const [uploading, setUploading] = useState(false);
  const [editingSound, setEditingSound] = useState<{ type: SoundType; file: File } | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();


  useEffect(() => {
    loadSounds();
    const preset = localStorage.getItem('soundPreset');
    if (preset) setSelectedPreset(preset);
  }, [user]);

  const loadSounds = async () => {
    if (user) {
      try {
        console.log('🔄 Loading sounds from cloud for user:', user.id);
        const cloudSounds = await getUserSounds(user.id);
        console.log('✓ Cloud sounds loaded:', Object.keys(cloudSounds));
        
        // Store with timestamp for expiration tracking
        const soundsWithTimestamp = {
          sounds: cloudSounds,
          timestamp: Date.now()
        };
        
        setCustomSounds(cloudSounds);
        localStorage.setItem('customSounds', JSON.stringify(cloudSounds));
        localStorage.setItem('customSoundsTimestamp', Date.now().toString());
        
        console.log('✓ Saved to localStorage');
      } catch (error) {
        console.error('❌ Error loading cloud sounds:', error);
        toast({ 
          title: 'Error Loading Sounds', 
          description: 'Could not load your custom sounds from cloud', 
          variant: 'destructive' 
        });
      }
    } else {
      const saved = localStorage.getItem('customSounds');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('✓ Loaded sounds from localStorage:', Object.keys(parsed));
        setCustomSounds(parsed);
      }
    }
  };


  const handleFileSelect = (soundType: SoundType, file: File, skipEditor: boolean = false) => {
    if (!file.type.includes('audio')) {
      toast({ title: 'Error', description: 'Please upload an audio file', variant: 'destructive' });
      return;
    }
    
    if (skipEditor) {
      // Quick upload - skip waveform editor
      console.log(`⚡ Quick upload for ${soundType}`);
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        console.log(`✓ File read, length: ${dataUrl.length}`);
        handleSaveEditedSound(soundType, dataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      // Show waveform editor for trimming
      console.log(`✂️ Opening editor for ${soundType}`);
      setEditingSound({ type: soundType, file });
    }
  };


  const handleSaveEditedSound = async (soundType: SoundType, trimmedAudio: string) => {
    console.log(`💾 Saving ${soundType} sound...`);
    
    if (user) {
      setUploading(true);
      try {
        // Convert data URL back to file for cloud upload
        const response = await fetch(trimmedAudio);
        const blob = await response.blob();
        const file = new File([blob], `${soundType}.mp3`, { type: 'audio/mpeg' });
        await uploadSoundToCloud(file, soundType, user.id);
        await loadSounds();
        
        // Force refresh the sound cache
        refreshCustomSounds();
        
        // Verify it was saved
        const verifyCheck = localStorage.getItem('customSounds');
        console.log('✓ Saved to localStorage:', verifyCheck ? 'YES' : 'NO');
        
        toast({ title: 'Success!', description: `${soundLabels[soundType]} uploaded and saved!` });
        
        // Auto-test the sound after upload
        setTimeout(() => {
          console.log('🧪 Testing uploaded sound...');
          triggerSoundEffect(soundType);
        }, 500);
      } catch (error: any) {
        console.error('❌ Upload error:', error);
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } finally {
        setUploading(false);
        setEditingSound(null);
      }
    } else {
      // Local storage for non-authenticated users
      const updated = { ...customSounds, [soundType]: trimmedAudio };
      setCustomSounds(updated);
      try {
        localStorage.setItem('customSounds', JSON.stringify(updated));
        console.log(`✓ ${soundType} saved to localStorage`);
        
        // Force refresh the sound cache
        refreshCustomSounds();
        
        // Verify save
        const verify = localStorage.getItem('customSounds');
        const parsed = verify ? JSON.parse(verify) : {};
        console.log('Saved sounds:', Object.keys(parsed));
        
        toast({ title: 'Success!', description: `${soundLabels[soundType]} saved successfully!` });
        
        // Auto-test the sound after upload
        setTimeout(() => {
          console.log(`🧪 Testing ${soundType}...`);
          triggerSoundEffect(soundType);
        }, 100);
      } catch (error) {
        console.error('❌ LocalStorage error:', error);
        toast({ title: 'Error', description: 'File too large for local storage', variant: 'destructive' });
      }
      setEditingSound(null);
    }
  };






  const testSound = (soundType: SoundType) => {
    console.log('Testing sound:', soundType);
    console.log('Custom sounds available:', Object.keys(customSounds));
    console.log('Sound URL:', customSounds[soundType]);
    
    if (customSounds[soundType]) {
      const audio = new Audio(customSounds[soundType]);
      audio.play().catch(err => {
        console.error('Error playing custom sound:', err);
        toast({ title: 'Error', description: 'Could not play sound. It may have expired.', variant: 'destructive' });
      });
    } else {
      soundPresets[selectedPreset].sounds[soundType]();
    }
  };


  const applyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    localStorage.setItem('soundPreset', presetKey);
  };

  const resetSound = async (soundType: SoundType) => {
    if (user) {
      try {
        await deleteSoundFromCloud(soundType, user.id);
        await loadSounds();
        toast({ title: 'Success!', description: 'Sound reset to default.' });
      } catch (error: any) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
    } else {
      const updated = { ...customSounds };
      delete updated[soundType];
      setCustomSounds(updated);
      localStorage.setItem('customSounds', JSON.stringify(updated));
    }
  };




  return (
    <div className="space-y-6">
      {/* Important Notice */}
      <Card className="p-4 bg-green-50 border-green-300">
        <div className="flex items-start gap-2">
          <div className="text-green-700 font-bold text-2xl">✓</div>
          <div className="flex-1">
            <p className="font-bold text-green-900 mb-1">Sound Customizer Fixed!</p>
            <p className="text-sm text-green-800 mb-2">
              If your custom sounds were playing as tones, the issue was expired URLs. This has been fixed!
            </p>
            <ul className="text-xs text-green-700 space-y-1 list-disc list-inside">
              <li>Sound URLs now last 7 days (was 1 hour)</li>
              <li>Click "Refresh URLs" button below to get fresh URLs for existing sounds</li>
              <li>Use "Game Test" button to verify sounds work in-game</li>
            </ul>
          </div>
        </div>
      </Card>

      {user && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">Cloud Sync Enabled</p>
                <p className="text-sm text-blue-700">Your sounds are synced across devices</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                loadSounds();
                toast({ title: 'Refreshing...', description: 'Getting fresh URLs for your sounds' });
              }}
              disabled={uploading}
              className="bg-white"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Refresh URLs
            </Button>
          </div>
        </Card>
      )}

      {!user && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-900">Local Storage Only</p>
              <p className="text-sm text-yellow-700">Sign in to sync sounds across devices</p>
            </div>
          </div>
        </Card>
      )}
      <div>
        <h3 className="text-lg font-bold mb-3">Sound Presets</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(soundPresets).map(([key, preset]) => (
            <Card
              key={key}
              className={`p-4 cursor-pointer transition-all ${
                selectedPreset === key ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => applyPreset(key)}
            >
              <h4 className="font-bold">{preset.name}</h4>
              <p className="text-sm text-gray-600">{preset.description}</p>
            </Card>
          ))}
        </div>
      </div>


      {editingSound && (
        <div className="mb-6">
          <WaveformEditor
            audioFile={editingSound.file}
            soundLabel={soundLabels[editingSound.type]}
            onSave={(trimmedAudio) => handleSaveEditedSound(editingSound.type, trimmedAudio)}
            onCancel={() => setEditingSound(null)}
          />
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold mb-3">Custom Sounds</h3>
        <div className="space-y-3">
          {(Object.keys(soundLabels) as SoundType[]).map((soundType) => (
            <Card key={soundType} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="font-semibold">{soundLabels[soundType]}</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => testSound(soundType)}
                    title="Test with direct Audio"
                  >
                    <Volume2 className="w-4 h-4 mr-1" />
                    Test
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => triggerSoundEffect(soundType as any)}
                    title="Test with Game Sound System"
                  >
                    <Bug className="w-4 h-4 mr-1" />
                    Game Test
                  </Button>
                  {customSounds[soundType] && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resetSound(soundType)}
                      title="Reset to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => document.getElementById(`upload-${soundType}`)?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Upload & Edit
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => document.getElementById(`quick-upload-${soundType}`)?.click()}
                  className="flex-1"
                  title="Upload without editing (faster)"
                >
                  ⚡ Quick Upload
                </Button>
              </div>
              
              <input
                id={`upload-${soundType}`}
                type="file"
                accept="audio/mp3,audio/mpeg,audio/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(soundType, e.target.files[0], false)}
              />
              <input
                id={`quick-upload-${soundType}`}
                type="file"
                accept="audio/mp3,audio/mpeg,audio/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(soundType, e.target.files[0], true)}
              />
              
              {customSounds[soundType] && (
                <p className="text-xs text-white bg-green-600 px-2 py-1 rounded mt-2 inline-block">✓ Custom sound uploaded</p>
              )}
            </Card>
          ))}
        </div>
      </div>




      {/* Debug Panel */}
      <Card className="p-4 bg-gray-50 border-gray-300">
        <div className="flex items-center gap-2 mb-3">
          <Bug className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-bold">Debug Info</h3>
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Custom Sounds in State:</strong> {Object.keys(customSounds).join(', ') || 'None'}
          </div>
          <div>
            <strong>Custom Sounds in localStorage:</strong>{' '}
            {(() => {
              const saved = localStorage.getItem('customSounds');
              if (saved) {
                try {
                  const parsed = JSON.parse(saved);
                  return Object.keys(parsed).join(', ') || 'None';
                } catch {
                  return 'Error parsing';
                }
              }
              return 'None';
            })()}
          </div>
          <div>
            <strong>Selected Preset:</strong> {selectedPreset}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              console.log('=== SOUND DEBUG INFO ===');
              console.log('customSounds state:', customSounds);
              console.log('localStorage customSounds:', localStorage.getItem('customSounds'));
              console.log('soundPreset:', localStorage.getItem('soundPreset'));
              toast({ title: 'Debug info logged to console' });
            }}
          >
            Log Full Debug Info
          </Button>
        </div>
      </Card>
    </div>
  );
}
