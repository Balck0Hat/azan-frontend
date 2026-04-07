import { TAFSIRS, RECITERS } from '../../services/quranApi';

export default function SettingsPanel({
  fontSize, setFontSize, selectedReciter, setSelectedReciter,
  selectedTafsir, setSelectedTafsir, saveSetting,
}) {
  return (
    <div className="settings-panel">
      <div className="setting-group">
        <label>حجم الخط</label>
        <div className="font-size-controls">
          <button onClick={() => { setFontSize(f => Math.max(18, f - 2)); saveSetting('quranFontSize', fontSize - 2); }}>−</button>
          <span>{fontSize}px</span>
          <button onClick={() => { setFontSize(f => Math.min(48, f + 2)); saveSetting('quranFontSize', fontSize + 2); }}>+</button>
        </div>
      </div>

      <div className="setting-group">
        <label>القارئ</label>
        <select
          value={selectedReciter}
          onChange={(e) => { setSelectedReciter(e.target.value); saveSetting('quranReciter', e.target.value); }}
        >
          {Object.entries(RECITERS).map(([key, reciter]) => (
            <option key={key} value={key}>{reciter.name}</option>
          ))}
        </select>
      </div>

      <div className="setting-group">
        <label>التفسير الافتراضي</label>
        <select
          value={selectedTafsir}
          onChange={(e) => { setSelectedTafsir(e.target.value); saveSetting('quranTafsir', e.target.value); }}
        >
          {Object.entries(TAFSIRS).filter(([k]) => k.startsWith('ar')).map(([key, tafsir]) => (
            <option key={key} value={key}>{tafsir.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
