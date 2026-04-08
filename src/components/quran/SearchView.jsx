import { motion } from 'framer-motion';
import SURAHS from '../../data/surahs.json';

export default function SearchView({ searchQuery, setSearchQuery, searchResults, searchLoading, handleSearch, loadSurah }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
        <input type="text" placeholder="ابحث في القرآن الكريم..."
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 outline-none text-sm" />
        <motion.button whileTap={{ scale: 0.9 }} onClick={handleSearch} disabled={searchLoading}
          className="px-5 py-3 rounded-xl bg-indigo-500/20 text-indigo-300 font-medium text-sm hover:bg-indigo-500/30 transition-colors disabled:opacity-50">
          {searchLoading ? '...' : '🔍 بحث'}
        </motion.button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <p className="text-slate-500 text-sm px-1">عدد النتائج: {searchResults.length}</p>
          {searchResults.map((result, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }} whileTap={{ scale: 0.98 }}
              onClick={() => { const surah = SURAHS.find(s => s.num === result.surah); if (surah) loadSurah(surah); }}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.06] transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-300 font-semibold text-sm">{result.surahName}</span>
                <span className="text-slate-500 text-xs px-2 py-0.5 rounded-md bg-white/[0.05]">الآية {result.ayah}</span>
              </div>
              <p className="text-slate-200 text-lg leading-relaxed text-right">{result.text}</p>
            </motion.div>
          ))}
        </div>
      )}

      {searchResults.length === 0 && !searchLoading && searchQuery && (
        <div className="text-center py-12 text-slate-500">لا توجد نتائج</div>
      )}
    </div>
  );
}
