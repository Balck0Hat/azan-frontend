import { motion } from 'framer-motion';

export default function SurahsListView({ filteredSurahs, juzFilter, setJuzFilter, loadSurah, lastRead, continueReading }) {
  return (
    <div className="space-y-4">
      {lastRead && (
        <motion.div whileTap={{ scale: 0.98 }} onClick={continueReading}
          className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-l from-indigo-600/15 to-purple-600/15 border border-indigo-500/20 cursor-pointer hover:bg-indigo-600/20 transition-all">
          <span className="text-2xl">📍</span>
          <div className="flex-1 min-w-0">
            <p className="text-indigo-300 text-sm font-medium">متابعة القراءة</p>
            <p className="text-white font-semibold truncate">{lastRead.surahName} - الآية {lastRead.ayah}</p>
          </div>
          <span className="text-indigo-400 text-xl">←</span>
        </motion.div>
      )}

      {/* Juz Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setJuzFilter(0)}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            juzFilter === 0 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/[0.04] text-slate-500 border border-white/5'
          }`}>الكل</button>
        {[...Array(30)].map((_, i) => (
          <button key={i + 1} onClick={() => setJuzFilter(i + 1)}
            className={`shrink-0 w-8 h-8 rounded-lg text-xs font-medium transition-all ${
              juzFilter === i + 1 ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/[0.04] text-slate-500 border border-white/5'
            }`}>{i + 1}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filteredSurahs.map((surah, i) => (
          <motion.div key={surah.num} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.015, 0.5) }} whileTap={{ scale: 0.97 }}
            onClick={() => loadSurah(surah)}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] cursor-pointer transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-indigo-500/20">
              <span className="text-indigo-300 font-bold text-sm">{surah.num}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between">
                <span className="text-white font-semibold text-base group-hover:text-indigo-300 transition-colors">{surah.name}</span>
                <span className="text-slate-600 text-xs">{surah.englishName}</span>
              </div>
              <span className="text-slate-500 text-xs">{surah.verses} آية • {surah.type} • جزء {surah.juz}</span>
            </div>
            <span className="text-lg">{surah.type === 'مكية' ? '🕋' : '🕌'}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
