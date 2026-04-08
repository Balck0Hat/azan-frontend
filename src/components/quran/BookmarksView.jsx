import { motion } from 'framer-motion';
import SURAHS from '../../data/surahs.json';

export default function BookmarksView({ bookmarks, toggleBookmark, loadSurah }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[var(--text-primary)] px-1">🔖 الآيات المحفوظة</h3>
      {bookmarks.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-muted)]">
          <p className="text-4xl mb-3">📑</p>
          <p>لا توجد آيات محفوظة</p>
        </div>
      ) : (
        <div className="space-y-2">
          {bookmarks.map((bookmark, i) => (
            <motion.div key={bookmark.key} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-all group">
              <div className="flex-1 cursor-pointer" onClick={() => {
                const surah = SURAHS.find(s => s.num === bookmark.surah);
                if (surah) loadSurah(surah);
              }}>
                <span className="text-[var(--text-primary)] font-medium">{bookmark.surahName}</span>
                <span className="text-[var(--text-muted)] text-sm mr-2">الآية {bookmark.ayah}</span>
              </div>
              <motion.button whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); toggleBookmark(bookmark.surah, bookmark.ayah); }}
                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center text-sm hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100">
                ✕
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
