import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SURAHS from '../data/readerSurahs';

export default function QuranReader() {
  const [progress, setProgress] = useState({});
  const [totalJuz, setTotalJuz] = useState(0);
  const [showSurahs, setShowSurahs] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quranProgress') || '{}');
    setProgress(saved);
    const juzCompleted = new Set();
    Object.keys(saved).forEach(surahNum => {
      const surah = SURAHS.find(s => s.num === parseInt(surahNum));
      if (surah && saved[surahNum] >= surah.verses) juzCompleted.add(surah.juz);
    });
    setTotalJuz(juzCompleted.size);
  }, [progress]);

  const loadSurah = async (surah) => {
    setSelectedSurah(surah); setLoading(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.num}/ar.alafasy`);
      const data = await res.json();
      if (data.code === 200) setVerses(data.data.ayahs);
    } catch (err) { console.error('Error loading surah:', err); }
    finally { setLoading(false); }
  };

  const markVerse = (surahNum, verseNum) => {
    const updated = { ...progress }; updated[surahNum] = Math.max(updated[surahNum] || 0, verseNum);
    setProgress(updated); localStorage.setItem('quranProgress', JSON.stringify(updated));
  };

  const getSurahProgress = (surah) => ((progress[surah.num] || 0) / surah.verses) * 100;
  const getTotalProgress = () => {
    const total = SURAHS.reduce((a, s) => a + s.verses, 0);
    const read = Object.keys(progress).reduce((a, k) => a + Math.min(progress[k], SURAHS.find(s => s.num === parseInt(k))?.verses || 0), 0);
    return (read / total) * 100;
  };

  const tp = getTotalProgress();

  return (
    <div className="min-h-screen p-3 sm:p-4 space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-[var(--border-color)] backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">📖 ختمة القرآن</h3>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold border border-indigo-500/30">{totalJuz}/30 جزء</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm"><span className="text-[var(--text-secondary)]">التقدم الكلي</span><span className="text-indigo-300 font-bold">{Math.round(tp)}%</span></div>
          <div className="h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${tp}%` }} transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-purple-500" />
          </div>
        </div>
      </motion.div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowSurahs(!showSurahs)}
        className="w-full py-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-hover)] transition-colors">
        {showSurahs ? 'إخفاء السور ▲' : 'عرض السور ▼'}
      </motion.button>

      <AnimatePresence mode="wait">
        {showSurahs && !selectedSurah && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SURAHS.map((surah, i) => (
              <motion.button key={surah.num} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.01 }}
                whileTap={{ scale: 0.95 }} onClick={() => loadSurah(surah)}
                className={`p-3 rounded-xl border text-start transition-all ${getSurahProgress(surah) === 100
                  ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs flex items-center justify-center font-bold">{surah.num}</span>
                  <div className="flex-1 min-w-0"><p className="text-[var(--text-primary)] text-sm font-semibold truncate">{surah.name}</p>
                    <p className="text-[var(--text-muted)] text-xs">{surah.verses} آية</p></div>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-purple-500 transition-all" style={{ width: `${getSurahProgress(surah)}%` }} />
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {selectedSurah && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSelectedSurah(null)} className="text-indigo-400 font-medium text-sm">→ العودة</motion.button>
              <h4 className="text-[var(--text-primary)] font-bold">{selectedSurah.name}</h4>
              <span className="text-[var(--text-secondary)] text-sm">{progress[selectedSurah.num] || 0}/{selectedSurah.verses}</span>
            </div>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-[var(--text-secondary)]">جاري تحميل السورة...</p>
              </div>
            ) : (
              <div className="rounded-2xl p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-sm">
                {selectedSurah.num !== 1 && selectedSurah.num !== 9 && (
                  <p className="text-center text-2xl text-amber-200/80 font-arabic mb-6 py-3">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                )}
                <div className="leading-[2.8] text-right" dir="rtl">
                  {verses.map((verse) => (
                    <motion.span key={verse.numberInSurah} whileTap={{ scale: 0.98 }}
                      onClick={() => markVerse(selectedSurah.num, verse.numberInSurah)}
                      className={`inline cursor-pointer transition-colors text-2xl sm:text-3xl leading-[2.8] ${(progress[selectedSurah.num] || 0) >= verse.numberInSurah ? 'text-emerald-400/80' : 'text-[var(--text-primary)] hover:text-indigo-300'}`}>
                      {verse.text}<span className="text-indigo-400/60 text-lg mx-1">﴿{verse.numberInSurah}﴾</span>
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileTap={{ scale: 0.95 }}
        onClick={() => { setProgress({}); localStorage.removeItem('quranProgress'); }}
        className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors">
        إعادة تعيين التقدم
      </motion.button>
    </div>
  );
}
