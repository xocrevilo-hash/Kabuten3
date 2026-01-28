'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

/**
 * VoiceAssistant - Voice interface for Ask Kabuten
 *
 * Integrates with PersonaPlex backend for natural stock Q&A conversations
 *
 * States:
 * - idle: Ready to start
 * - listening: Recording user voice
 * - processing: Sending to backend
 * - speaking: Playing AI response
 */
export function VoiceAssistant({
  onTranscript,      // Callback with user's transcribed question
  onResponse,        // Callback with AI response text
  contextData,       // Optional: Current stock/company context
  className = ''
}) {
  const [state, setState] = useState('idle'); // idle | listening | processing | speaking
  const [error, setError] = useState(null);
  const [visualizerData, setVisualizerData] = useState(new Array(12).fill(0.1));

  const wsRef = useRef(null);
  const animationRef = useRef(null);

  const { startRecording, stopRecording, analyserNode } = useAudioRecorder();
  const { playAudio, stopAudio, isPlaying } = useAudioPlayer();

  // WebSocket URL - configure for your deployment
  const WS_URL = process.env.NEXT_PUBLIC_VOICE_WS_URL || 'wss://api.kabuten.com/voice';

  // Visualizer animation
  useEffect(() => {
    if (state === 'listening' && analyserNode) {
      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

      const animate = () => {
        analyserNode.getByteFrequencyData(dataArray);

        // Sample 12 frequency bands for visualization
        const bands = [];
        const step = Math.floor(dataArray.length / 12);
        for (let i = 0; i < 12; i++) {
          const value = dataArray[i * step] / 255;
          bands.push(Math.max(0.1, value));
        }
        setVisualizerData(bands);

        animationRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else if (state === 'processing') {
      // Pulsing animation while processing
      let phase = 0;
      const animate = () => {
        phase += 0.1;
        const bands = new Array(12).fill(0).map((_, i) =>
          0.3 + 0.2 * Math.sin(phase + i * 0.5)
        );
        setVisualizerData(bands);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else if (state === 'speaking') {
      // Wave animation while speaking
      let phase = 0;
      const animate = () => {
        phase += 0.15;
        const bands = new Array(12).fill(0).map((_, i) =>
          0.4 + 0.4 * Math.sin(phase + i * 0.3)
        );
        setVisualizerData(bands);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      setVisualizerData(new Array(12).fill(0.1));
    }
  }, [state, analyserNode]);

  // Connect to PersonaPlex WebSocket
  const connectWebSocket = useCallback(() => {
    return new Promise((resolve, reject) => {
      const contextParam = contextData
        ? `?context=${encodeURIComponent(JSON.stringify(contextData))}`
        : '';

      const ws = new WebSocket(`${WS_URL}${contextParam}`);
      ws.binaryType = 'arraybuffer';

      ws.onopen = () => {
        console.log('Voice WebSocket connected');
        resolve(ws);
      };

      ws.onerror = (err) => {
        console.error('Voice WebSocket error:', err);
        reject(new Error('Failed to connect to voice service'));
      };

      ws.onmessage = async (event) => {
        if (typeof event.data === 'string') {
          // JSON message (transcript, response text, etc.)
          try {
            const msg = JSON.parse(event.data);

            if (msg.type === 'transcript' && onTranscript) {
              onTranscript(msg.text);
            }

            if (msg.type === 'response_text' && onResponse) {
              onResponse(msg.text);
            }

            if (msg.type === 'response_start') {
              setState('speaking');
            }

            if (msg.type === 'response_end') {
              setState('idle');
            }

            if (msg.type === 'error') {
              setError(msg.message);
              setState('idle');
            }
          } catch (e) {
            console.error('Failed to parse message:', e);
          }
        } else {
          // Binary audio data - play it
          await playAudio(event.data);
        }
      };

      ws.onclose = () => {
        console.log('Voice WebSocket closed');
        setState('idle');
      };

      wsRef.current = ws;
    });
  }, [WS_URL, contextData, onTranscript, onResponse, playAudio]);

  // Start voice interaction
  const handleStart = async () => {
    try {
      setError(null);

      // Connect WebSocket
      await connectWebSocket();

      // Start recording
      const audioStream = await startRecording((audioData) => {
        // Send audio chunks to server
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(audioData);
        }
      });

      setState('listening');

    } catch (err) {
      console.error('Failed to start voice:', err);
      setError(err.message || 'Failed to access microphone');
      setState('idle');
    }
  };

  // Stop recording and wait for response
  const handleStop = async () => {
    stopRecording();
    setState('processing');

    // Send end-of-speech signal
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'end_speech' }));
    }
  };

  // Cancel interaction
  const handleCancel = () => {
    stopRecording();
    stopAudio();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setState('idle');
  };

  // Click handler based on state
  const handleClick = () => {
    switch (state) {
      case 'idle':
        handleStart();
        break;
      case 'listening':
        handleStop();
        break;
      case 'processing':
      case 'speaking':
        handleCancel();
        break;
    }
  };

  // Status text
  const getStatusText = () => {
    switch (state) {
      case 'idle': return 'Tap to speak';
      case 'listening': return 'Listening... tap to send';
      case 'processing': return 'Thinking...';
      case 'speaking': return 'Speaking...';
      default: return '';
    }
  };

  // Button styles based on state
  const getButtonClasses = () => {
    const base = 'relative w-16 h-16 rounded-full border-none cursor-pointer flex items-center justify-center transition-all duration-300 overflow-hidden';

    switch (state) {
      case 'idle':
        return `${base} bg-gradient-to-br from-blue-800 to-blue-600 text-white shadow-lg hover:scale-105 hover:shadow-xl`;
      case 'listening':
        return `${base} bg-gradient-to-br from-red-600 to-red-500 text-white shadow-lg animate-pulse`;
      case 'processing':
        return `${base} bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-lg`;
      case 'speaking':
        return `${base} bg-gradient-to-br from-green-700 to-green-500 text-white shadow-lg`;
      default:
        return base;
    }
  };

  // Button icon based on state
  const getIcon = () => {
    switch (state) {
      case 'idle':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        );
      case 'listening':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="2"/>
          </svg>
        );
      case 'processing':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
          </svg>
        );
      case 'speaking':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
          </svg>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center gap-3 py-4 ${className}`}>
      {/* Audio visualizer bars */}
      <div className="flex items-end justify-center gap-1 h-10 px-4">
        {visualizerData.map((value, i) => (
          <div
            key={i}
            className="w-1 min-h-1 bg-gradient-to-t from-blue-800 to-blue-500 rounded-sm transition-all duration-50"
            style={{
              height: `${value * 100}%`,
              opacity: state === 'idle' ? 0.3 : 0.8 + value * 0.2
            }}
          />
        ))}
      </div>

      {/* Main button */}
      <button
        className={getButtonClasses()}
        onClick={handleClick}
        aria-label={getStatusText()}
      >
        <span className="relative z-10 flex items-center justify-center">
          {getIcon()}
        </span>
      </button>

      {/* Status text */}
      <p className="text-xs text-gray-500 font-medium tracking-wide min-h-5">
        {getStatusText()}
      </p>

      {/* Error display */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">
          {error}
        </p>
      )}
    </div>
  );
}

export default VoiceAssistant;
