import { motion } from 'framer-motion';
import { TAFSIRS, RECITERS } from '../../services/quranApi';

export default function SettingsPanel({
  fontSize, setFontSize, selectedReciter, setSelectedReciter,
  selectedTafsir, setSelectedTafsir, saveSetting,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-slate-300 text-sm font-medium">حجم الخط</label>
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.85 }}
            onClick={() => { setFontSize(f => Math.max(18, f - 2)); saveSetting('quranFontSize', fontSize - 2); }}
            className="w-8 h-8 rounded-lg bg-white/[0.06] text-slate-300 flex items-center justify-center hover:bg-white/10 transition-colors">−</motion.button>
          <span className="text-indigo-300 font-mono text-sm w-12 text-center">{fontSize}px</span>
          <motion.button whileTap={{ scale: 0.85 }}
            onClick={() => { setFontSize(f => Math.min(48, f + 2)); saveSetting('quranFontSize', fontSize + 2); }}
            className="w-8 h-8 rounded-lg bg-white/[0.06] text-slate-300 flex items-center justify-center hover:bg-white/10 transition-colors">+</motion.button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-slate-300 text-sm font-medium">القارئ</label>
        <select value={selectedReciter}
          onChange={(e) => { setSelectedReciter(e.target.value); saveSetting('quranReciter', e.target.value); }}
          className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 text-sm outline-none">
          {Object.entries(RECITERS).map(([key, reciter]) => (
            <option key={key} value={key}>{reciter.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-slate-300 text-sm font-medium">التفسير الافتراضي</label>
        <select value={selectedTafsir}
          onChange={(e) => { setSelectedTafsir(e.target.value); saveSetting('quranTafsir', e.target.value); }}
          className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 text-sm outline-none">
          {Object.entries(TAFSIRS).filter(([k]) => k.startsWith('ar')).map(([key, tafsir]) => (
            <option key={key} value={key}>{tafsir.name}</option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}
