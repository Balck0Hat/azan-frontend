import { useState, useRef, useEffect } from 'react';
import MUEZZINS from '../data/muezzins';
import MuezzinSelector from './MuezzinSelector';
import '../styles/adhanPlayer.css';

export default function AdhanPlayer() {
  const [selectedMuezzin, setSelectedMuezzin] = useState(MUEZZINS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showSelector, setShowSelector] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('selectedMuezzin');
    if (saved) { const m = MUEZZINS.find(m => m.id === saved); if (m) setSelectedMuezzin(m); }
    const savedVol = localStorage.getItem('adhanVolume');
    if (savedVol) setVolume(parseFloat(savedVol));
  }, []);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const handlePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause(); else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleMuezzinSelect = (muezzin) => {
    setSelectedMuezzin(muezzin); localStorage.setItem('selectedMuezzin', muezzin.id);
    setShowSelector(false); setIsPlaying(false); setProgress(0);
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value); setVolume(v);
    localStorage.setItem('adhanVolume', v.toString());
    if (audioRef.current) audioRef.current.volume = v;
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="adhan-player">
      <audio ref={audioRef} src={selectedMuezzin.url}
        onTimeUpdate={() => setProgress(((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1)) * 100)}
        onLoadedMetadata={() => { setDuration(audioRef.current?.duration || 0); if (audioRef.current) audioRef.current.volume = volume; }}
        onEnded={() => { setIsPlaying(false); setProgress(0); }}
        onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} playsInline />

      <div className="adhan-header">
        <span className="adhan-icon">{selectedMuezzin.icon}</span>
        <div className="adhan-info">
          <h3 className="adhan-title">🎙️ مشغّل الأذان</h3>
          <p className="adhan-current">{selectedMuezzin.name}</p>
        </div>
      </div>

      <div className="adhan-progress-container">
        <div className="adhan-progress-bar">
          <div className="adhan-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="adhan-time">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="adhan-controls">
        <button className={`adhan-play-btn ${isPlaying ? 'playing' : ''}`} onClick={handlePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>

        <div className="adhan-volume">
          <svg viewBox="0 0 24 24" fill="currentColor" className="volume-icon">
            <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07"/>
            {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>}
          </svg>
          <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleVolumeChange} className="volume-slider" />
          {isIOS && <span className="ios-hint">📱</span>}
        </div>

        <button className="adhan-select-btn" onClick={() => setShowSelector(!showSelector)}>تغيير المؤذن ▾</button>
      </div>

      {isIOS && <p className="ios-note">على iPhone استخدم أزرار الصوت الجانبية</p>}
      {showSelector && <MuezzinSelector selectedMuezzin={selectedMuezzin} onSelect={handleMuezzinSelect} />}
    </div>
  );
}
