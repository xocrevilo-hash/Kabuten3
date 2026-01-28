import { useState, useRef, useCallback } from 'react';

/**
 * useAudioRecorder - Hook for capturing microphone audio
 *
 * Returns audio data suitable for streaming to PersonaPlex
 * Uses Web Audio API for real-time analysis and MediaRecorder for capture
 */
export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [analyserNode, setAnalyserNode] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);

  /**
   * Start recording audio from the microphone
   * @param {Function} onAudioData - Callback for each audio chunk (ArrayBuffer)
   * @returns {Promise<MediaStream>} The audio stream
   */
  const startRecording = useCallback(async (onAudioData) => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000,  // PersonaPlex expects 24kHz
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      // Set up Web Audio API for visualization
      const audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000
      });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      setAnalyserNode(analyser);

      // Set up MediaRecorder for capturing audio
      // Try to use PCM format if available, otherwise fall back to webm
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=pcm')
        ? 'audio/webm;codecs=pcm'
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && onAudioData) {
          // Convert Blob to ArrayBuffer
          const buffer = await event.data.arrayBuffer();
          onAudioData(buffer);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
      };

      // Start recording with timeslice for streaming
      // 100ms chunks for low latency
      mediaRecorder.start(100);
      setIsRecording(true);

      return stream;

    } catch (err) {
      console.error('Failed to start recording:', err);

      if (err.name === 'NotAllowedError') {
        throw new Error('Microphone access denied. Please allow microphone access and try again.');
      } else if (err.name === 'NotFoundError') {
        throw new Error('No microphone found. Please connect a microphone and try again.');
      } else {
        throw new Error('Failed to access microphone: ' + err.message);
      }
    }
  }, []);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setAnalyserNode(null);
    setIsRecording(false);
  }, []);

  /**
   * Get current audio level (0-1)
   * Useful for simple volume indicators
   */
  const getAudioLevel = useCallback(() => {
    if (!analyserNode) return 0;

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(dataArray);

    // Calculate RMS level
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i] * dataArray[i];
    }
    const rms = Math.sqrt(sum / dataArray.length);

    return rms / 255;
  }, [analyserNode]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    analyserNode,
    getAudioLevel
  };
}

export default useAudioRecorder;
