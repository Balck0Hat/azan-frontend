import { motion, AnimatePresence } from 'framer-motion';
import SURAHS from '../../data/surahs.json';

export default function ReaderView({
  selectedSurah, ayahs, loading, fontSize, selectedAyah, playingAyah,
  tafsirs, tafsirLoading, selectedTafsir, setSelectedTafsir,
  loadSurah, loadTafsir, playAudio, toggleBookmark, isBookmarked, setView,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-sm">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setView('surahs')}
          className="text-indigo-400 text-sm font-medium">→ العودة للسور</motion.button>
        <div className="text-center">
          <h3 className="text-[var(--text-primary)] font-bold">سورة {selectedSurah.name}</h3>
          <span className="text-[var(--text-muted)] text-xs">{selectedSurah.englishName} • {selectedSurah.verses} آية</span>
        </div>
        <div className="flex gap-1">
          <button disabled={selectedSurah.num === 1}
            onClick={() => loadSurah(SURAHS[selectedSurah.num - 2])}
            className="px-2 py-1 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs disabled:opacity-30 hover:bg-[var(--bg-hover)] transition-colors">← السابقة</button>
          <button disabled={selectedSurah.num === 114}
            onClick={() => loadSurah(SURAHS[selectedSurah.num])}
            className="px-2 py-1 rounded-lg bg-[var(--bg-card)] text-[var(--text-secondary)] text-xs disabled:opacity-30 hover:bg-[var(--bg-hover)] transition-colors">التالية →</button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[var(--text-secondary)]">جاري تحميل السورة...</p>
        </div>
      ) : (
        <div className="rounded-2xl p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-color)]">
          {selectedSurah.num !== 1 && selectedSurah.num !== 9 && (
            <p className="text-center text-2xl text-amber-200/70 mb-6 py-3">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          )}
          <div className="leading-[2.8] text-right" style={{ fontSize: `${fontSize}px` }} dir="rtl">
            {ayahs.map((ayah) => (
              <div key={ayah.number} className="inline">
                <span onClick={() => loadTafsir(ayah.number)}
                  className={`inline cursor-pointer transition-all duration-200 ${
                    selectedAyah === ayah.number ? 'text-indigo-300 bg-indigo-500/10 rounded px-1' :
                    playingAyah === ayah.number ? 'text-emerald-300' : 'text-[var(--text-primary)] hover:text-indigo-300'
                  }`}>
                  {ayah.text}<span className="text-indigo-400/50 text-sm mx-1">﴿{ayah.number}﴾</span>
                </span>
                {selectedAyah === ayah.number && (
                  <div className="block my-3">
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <button onClick={(e) => { e.stopPropagation(); playAudio(ayah.number); }}
                        className={`px-3 py-1 rounded-lg text-xs ${playingAyah === ayah.number ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'}`}>
                        {playingAyah === ayah.number ? '⏸️ إيقاف' : '▶️ استمع'}</button>
                      <button onClick={(e) => { e.stopPropagation(); toggleBookmark(selectedSurah.num, ayah.number); }}
                        className={`px-3 py-1 rounded-lg text-xs ${isBookmarked(selectedSurah.num, ayah.number) ? 'bg-amber-500/20 text-amber-300' : 'bg-[var(--bg-card)] text-[var(--text-secondary)]'}`}>
                        {isBookmarked(selectedSurah.num, ayah.number) ? '🔖 محفوظة' : '📑 حفظ'}</button>
                    </div>
                    <AnimatePresence>
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-sm">
                        {tafsirLoading ? (
                          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                            <div className="w-4 h-4 border border-indigo-400 border-t-transparent rounded-full animate-spin" />جاري تحميل التفسير...</div>
                        ) : (<>
                          <div className="flex gap-1.5 mb-2 flex-wrap">
                            {Object.entries(tafsirs).map(([key, value]) => (
                              <button key={key} onClick={() => setSelectedTafsir(key)}
                                className={`px-2 py-0.5 rounded-md text-xs transition-all ${selectedTafsir === key ? 'bg-indigo-500/20 text-indigo-300' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>{value.name}</button>
                            ))}
                          </div>
                          <p className="text-[var(--text-primary)] leading-relaxed text-right" style={{ fontSize: '15px' }}>{tafsirs[selectedTafsir]?.text || 'اختر تفسيراً'}</p>
                        </>)}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
