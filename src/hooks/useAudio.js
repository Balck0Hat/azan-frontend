import { useRef, useState, useCallback } from 'react';

/**
 * Manages an <audio> element for play/pause/seek.
 * @returns {{ audioRef, isPlaying, currentTime, duration, play, pause, toggle, seek, setSource }}
 */
export default function useAudio() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {});
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause(); else play();
  }, [isPlaying, play, pause]);

  const seek = useCallback((time) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);

  const setSource = useCallback((src) => {
    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.load();
    }
  }, []);

  const handlers = {
    onTimeUpdate: () => setCurrentTime(audioRef.current?.currentTime || 0),
    onLoadedMetadata: () => setDuration(audioRef.current?.duration || 0),
    onEnded: () => setIsPlaying(false),
    onError: () => setIsPlaying(false),
  };

  return { audioRef, isPlaying, currentTime, duration, play, pause, toggle, seek, setSource, handlers };
}
