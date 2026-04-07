import { useState, useEffect, useCallback } from 'react';
import TASBEEH_PRESETS from '../data/tasbeehPresets';
import TasbeehTapArea from './TasbeehTapArea';
import '../styles/tasbeeh.css';

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
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [sound]);

  const triggerVibrate = useCallback(() => {
    if (vibrate && navigator.vibrate) navigator.vibrate(50);
  }, [vibrate]);

  const handleTap = () => {
    const newCount = count + 1;
    setCount(newCount);
    playClickSound();
    triggerVibrate();

    const newTotal = totalCount + 1;
    setTotalCount(newTotal);
    localStorage.setItem('tasbeehCount', newTotal.toString());

    if (newCount >= target) {
      setShowCompleted(true);
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
      setTimeout(() => setShowCompleted(false), 2000);
    }
  };

  const handlePresetChange = (preset) => {
    setSelectedPreset(preset);
    setTarget(preset.target);
    setCount(0);
  };

  return (
    <div className="tasbeeh">
      <div className="tasbeeh-header">
        <h3 className="tasbeeh-title">📿 المسبحة الإلكترونية</h3>
        <div className="tasbeeh-total">
          المجموع الكلي: <strong>{totalCount.toLocaleString()}</strong>
        </div>
      </div>

      <div className="tasbeeh-presets">
        {TASBEEH_PRESETS.map(preset => (
          <button
            key={preset.id}
            className={`preset-btn ${selectedPreset.id === preset.id ? 'active' : ''}`}
            onClick={() => handlePresetChange(preset)}
          >
            {preset.text}
          </button>
        ))}
      </div>

      <TasbeehTapArea
        selectedPreset={selectedPreset}
        count={count}
        target={target}
        showCompleted={showCompleted}
        onTap={handleTap}
      />

      <div className="tasbeeh-controls">
        <button className="control-btn reset" onClick={() => setCount(0)}>↻ إعادة</button>
        <button
          className={`control-btn ${vibrate ? 'active' : ''}`}
          onClick={() => { setVibrate(!vibrate); localStorage.setItem('tasbeehVibrate', (!vibrate).toString()); }}
        >
          📳 اهتزاز
        </button>
        <button
          className={`control-btn ${sound ? 'active' : ''}`}
          onClick={() => { setSound(!sound); localStorage.setItem('tasbeehSound', (!sound).toString()); }}
        >
          🔊 صوت
        </button>
      </div>
    </div>
  );
}
