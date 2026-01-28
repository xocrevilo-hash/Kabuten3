import { useState, useRef, useCallback } from 'react';

/**
 * useAudioPlayer - Hook for playing streamed audio responses
 *
 * Handles audio chunks from PersonaPlex and plays them seamlessly
 * Uses Web Audio API for low-latency playback
 */
export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isProcessingRef = useRef(false);
  const currentSourceRef = useRef(null);

  /**
   * Initialize audio context (must be called after user interaction)
   */
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000  // Match PersonaPlex output
      });
    }

    // Resume if suspended (browser autoplay policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    return audioContextRef.current;
  }, []);

  /**
   * Process and play queued audio chunks
   */
  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || audioQueueRef.current.length === 0) {
      return;
    }

    isProcessingRef.current = true;
    const audioContext = initAudioContext();

    while (audioQueueRef.current.length > 0) {
      const audioData = audioQueueRef.current.shift();

      try {
        // Decode audio data
        const audioBuffer = await audioContext.decodeAudioData(audioData.slice(0));

        // Create source and play
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);

        currentSourceRef.current = source;

        // Play and wait for completion
        await new Promise((resolve) => {
          source.onended = resolve;
          source.start(0);
        });

      } catch (err) {
        console.error('Failed to play audio chunk:', err);
        // Continue with next chunk
      }
    }

    isProcessingRef.current = false;
    setIsPlaying(false);
  }, [initAudioContext]);

  /**
   * Add audio data to playback queue
   * @param {ArrayBuffer} audioData - Audio data to play
   */
  const playAudio = useCallback(async (audioData) => {
    setIsPlaying(true);
    audioQueueRef.current.push(audioData);
    processQueue();
  }, [processQueue]);

  /**
   * Stop all audio playback
   */
  const stopAudio = useCallback(() => {
    // Clear queue
    audioQueueRef.current = [];

    // Stop current source
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // May already be stopped
      }
      currentSourceRef.current = null;
    }

    isProcessingRef.current = false;
    setIsPlaying(false);
  }, []);

  /**
   * Play audio from a URL (for testing or fallback)
   * @param {string} url - URL of audio file
   */
  const playFromUrl = useCallback(async (url) => {
    const audioContext = initAudioContext();

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      await playAudio(arrayBuffer);
    } catch (err) {
      console.error('Failed to play audio from URL:', err);
    }
  }, [initAudioContext, playAudio]);

  /**
   * Cleanup audio context
   */
  const cleanup = useCallback(() => {
    stopAudio();

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [stopAudio]);

  return {
    isPlaying,
    playAudio,
    stopAudio,
    playFromUrl,
    cleanup,
    initAudioContext
  };
}

export default useAudioPlayer;
