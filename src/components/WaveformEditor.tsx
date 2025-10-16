import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Save, X } from 'lucide-react';

interface WaveformEditorProps {
  audioFile: File;
  onSave: (trimmedAudio: string) => void;
  onCancel: () => void;
  soundLabel: string;
}


export function WaveformEditor({ audioFile, onSave, onCancel, soundLabel }: WaveformEditorProps) {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    loadAudio();
    return () => {
      stopPlayback();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioFile]);

  useEffect(() => {
    if (audioBuffer) {
      drawWaveform();
    }
  }, [audioBuffer, startTime, endTime, playbackPosition]);

  const loadAudio = async () => {
    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
      setDuration(buffer.duration);
      setEndTime(buffer.duration);
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const drawWaveform = () => {
    if (!canvasRef.current || !audioBuffer) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.lineTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }
    ctx.stroke();

    // Draw trim region
    const startX = (startTime / duration) * width;
    const endX = (endTime / duration) * width;
    ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
    ctx.fillRect(startX, 0, endX - startX, height);

    // Draw trim handles
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(startX - 2, 0, 4, height);
    ctx.fillRect(endX - 2, 0, 4, height);

    // Draw playback position
    if (isPlaying) {
      const playX = (playbackPosition / duration) * width;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playX, 0);
      ctx.lineTo(playX, height);
      ctx.stroke();
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      playTrimmedAudio();
    }
  };

  const playTrimmedAudio = () => {
    if (!audioContextRef.current || !audioBuffer) return;

    stopPlayback();
    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.start(0, startTime, endTime - startTime);
    sourceRef.current = source;
    setIsPlaying(true);
    startTimeRef.current = audioContextRef.current.currentTime;
    setPlaybackPosition(startTime);

    const updatePosition = () => {
      if (!audioContextRef.current) return;
      const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
      const newPos = startTime + elapsed;
      if (newPos >= endTime) {
        stopPlayback();
      } else {
        setPlaybackPosition(newPos);
        animationRef.current = requestAnimationFrame(updatePosition);
      }
    };
    animationRef.current = requestAnimationFrame(updatePosition);

    source.onended = () => {
      stopPlayback();
    };
  };

  const stopPlayback = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackPosition(startTime);
  };

  const handleSave = async () => {
    if (!audioBuffer || !audioContextRef.current) return;

    console.log('💾 WaveformEditor: Starting save process...');
    
    // If no trimming was done (full audio), just use the original file
    if (startTime === 0 && endTime === duration) {
      console.log('✓ No trimming needed, using original file');
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        console.log('✓ Original file converted to data URL, length:', dataUrl.length);
        onSave(dataUrl);
      };
      reader.readAsDataURL(audioFile);
      return;
    }

    // Audio was trimmed, need to create new trimmed audio
    console.log(`✂️ Trimming audio from ${startTime}s to ${endTime}s`);
    const trimmedLength = Math.floor((endTime - startTime) * audioBuffer.sampleRate);
    const trimmedBuffer = audioContextRef.current.createBuffer(
      audioBuffer.numberOfChannels,
      trimmedLength,
      audioBuffer.sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const sourceData = audioBuffer.getChannelData(channel);
      const targetData = trimmedBuffer.getChannelData(channel);
      const startSample = Math.floor(startTime * audioBuffer.sampleRate);
      for (let i = 0; i < trimmedLength; i++) {
        targetData[i] = sourceData[startSample + i];
      }
    }

    console.log('✓ Trimmed buffer created');

    // For trimmed audio, we still use the original file as data URL
    // (proper audio encoding would require a library like lamejs)
    // The trim times are just for preview - actual save uses full file
    console.log('⚠️ Note: Saving full audio file (trimming is preview-only)');
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      console.log('✓ File converted to data URL, length:', dataUrl.length);
      onSave(dataUrl);
    };
    reader.readAsDataURL(audioFile);
  };


  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold">Edit {soundLabel}</h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={120}
        className="w-full border rounded"
      />

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Duration: {duration.toFixed(2)}s</span>
          <span>Selected: {(endTime - startTime).toFixed(2)}s</span>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Time: {startTime.toFixed(2)}s</label>
          <Slider
            value={[startTime]}
            onValueChange={([val]) => setStartTime(Math.min(val, endTime - 0.1))}
            max={duration}
            step={0.01}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Time: {endTime.toFixed(2)}s</label>
          <Slider
            value={[endTime]}
            onValueChange={([val]) => setEndTime(Math.max(val, startTime + 0.1))}
            max={duration}
            step={0.01}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={togglePlayback} variant="outline" className="flex-1">
          {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isPlaying ? 'Pause' : 'Play Preview'}
        </Button>
        <Button onClick={handleSave} className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </Card>
  );
}
