import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import TASBEEH_PRESETS from '../data/tasbeehPresets';
import TasbeehTapArea from './TasbeehTapArea';

export default function Tasbeeh() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [selectedPreset, setSelectedPreset] = useState(TASBEEH_PRESETS[0]);
  const [totalCount, setTotalCount] = useState(0);
  const [vibrate, setVibrate] = useState(true);
  const [sound, setSound] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    setTotalCount(parseInt(localStorage.getItem('tasbeehCount') || '0'));
    setVibrate(localStorage.getItem('tasbeehVibrate') !== 'false');
    setSound(localStorage.getItem('tasbeehSound') !== 'false');
  }, []);

  const playClickSound = useCallback(() => {
    if (sound) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQstY6Hb4bNfDQU4nN/dpmgSDkWY3tizZhMOOpTa17ZsGA4yl9jWuHEbDiuT1dW7dhwMJZDT1L6AIgkeitHSwoYkBxuFz9DFjCkFE4HNz8qRLQQNfc3OzpYxAgl4zM3SmjYBBXTLzNafOwABcMrL2qNAAG3Jy96nRABpyMviqEgAZsfL5qpMAGPGy+msUABgxsvtrlQAXcXL8bBXAFrFy/SyWgBXxMr4tF0AVMTK+7ZfAFHDyv+4YgBOwcr/umQAS8HK/7xmAEjAyf++aQBFv8n/wGsAQr7J/8JtAD+9yP/EcAA8vMj/xnIAObrH/8h0ADa5x//KdgAzuMf/zHgAMLfG/855AC61xv/QewAstMb/0n0AKbPG/9R/ACaxxf/WgQAjsMX/2IMAIa7F/9qFAB6txP/chgAcq8T/3ogAGarE/+CKABeoxP/ijAAVp8P/5I4AEqXD/+aQABCkw//okQANosL/6pMAC6DC/+yVAAmdwf/ulwAHm8H/8JkABJrB//KbAAKYwP/0nQAAlsD/9p8AAJa///ihAACT////pAAAAAAAAAAAAA==');
      audio.volume = 0.3; audio.play().catch(() => {});
    }
  }, [sound]);

  const triggerVibrate = useCallback(() => {
    if (vibrate && navigator.vibrate) navigator.vibrate(50);
  }, [vibrate]);

  const handleTap = () => {
    const newCount = count + 1; setCount(newCount); playClickSound(); triggerVibrate();
    const newTotal = totalCount + 1; setTotalCount(newTotal);
    localStorage.setItem('tasbeehCount', newTotal.toString());
    if (newCount >= target) {
      setShowCompleted(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
      setTimeout(() => setShowCompleted(false), 2000);
    }
  };

  const handlePresetChange = (preset) => { setSelectedPreset(preset); setTarget(preset.target); setCount(0); };

  return (
    <div className="min-h-screen p-3 sm:p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600/15 to-purple-600/15 border border-[var(--border-color)] backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">📿 المسبحة الإلكترونية</h3>
          <p className="text-[var(--text-secondary)] text-sm">المجموع الكلي: <span className="text-indigo-300 font-bold">{totalCount.toLocaleString()}</span></p>
        </div>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TASBEEH_PRESETS.map(preset => (
          <motion.button key={preset.id} whileTap={{ scale: 0.95 }}
            onClick={() => handlePresetChange(preset)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedPreset.id === preset.id
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
            }`}>{preset.text}</motion.button>
        ))}
      </div>

      <TasbeehTapArea selectedPreset={selectedPreset} count={count} target={target}
        showCompleted={showCompleted} onTap={handleTap} />

      <div className="flex gap-2">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCount(0)}
          className="flex-1 py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium text-sm hover:bg-[var(--bg-hover)] transition-colors">↻ إعادة</motion.button>
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { setVibrate(!vibrate); localStorage.setItem('tasbeehVibrate', (!vibrate).toString()); }}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            vibrate ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]'
          }`}>📳 اهتزاز</motion.button>
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => { setSound(!sound); localStorage.setItem('tasbeehSound', (!sound).toString()); }}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            sound ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]'
          }`}>🔊 صوت</motion.button>
      </div>
    </div>
  );
}
