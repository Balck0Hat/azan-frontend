import { motion, AnimatePresence } from 'framer-motion';
import useQuranReader from './useQuranReader';
import SurahsListView from './SurahsListView';
import ReaderView from './ReaderView';
import SearchView from './SearchView';
import BookmarksView from './BookmarksView';
import SettingsPanel from './SettingsPanel';

const navItems = [
  { key: 'surahs', label: '📚 السور' },
  { key: 'search', label: '🔍 بحث' },
  { key: 'bookmarks', label: '🔖 المحفوظات' },
];

export default function QuranTafsir() {
  const reader = useQuranReader();

  return (
    <div className="min-h-screen p-3 sm:p-4 space-y-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600/15 to-purple-600/15 border border-white/5 backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-1">📖 القرآن الكريم والتفسير</h2>
        <p className="text-slate-400 text-sm">اقرأ، استمع، وتدبر</p>
        <div className="flex gap-2 mt-4 flex-wrap">
          {navItems.map(item => (
            <motion.button key={item.key} whileTap={{ scale: 0.95 }}
              onClick={() => reader.setView(item.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                reader.view === item.key
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-white/[0.04] text-slate-400 border border-white/5 hover:bg-white/[0.07]'
              }`}>
              {item.key === 'bookmarks' ? `${item.label} (${reader.bookmarks.length})` : item.label}
            </motion.button>
          ))}
          <motion.button whileTap={{ scale: 0.95 }}
            onClick={() => reader.setShowSettings(!reader.showSettings)}
            className={`px-3 py-2 rounded-xl text-sm transition-all ${
              reader.showSettings ? 'bg-white/10 text-white border border-white/20' : 'bg-white/[0.04] text-slate-400 border border-white/5'
            }`}>⚙️</motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {reader.showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <SettingsPanel fontSize={reader.fontSize} setFontSize={reader.setFontSize}
              selectedReciter={reader.selectedReciter} setSelectedReciter={reader.setSelectedReciter}
              selectedTafsir={reader.selectedTafsir} setSelectedTafsir={reader.setSelectedTafsir}
              saveSetting={reader.saveSetting} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {reader.view === 'surahs' && (
          <motion.div key="surahs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SurahsListView filteredSurahs={reader.filteredSurahs} juzFilter={reader.juzFilter}
              setJuzFilter={reader.setJuzFilter} loadSurah={reader.loadSurah}
              lastRead={reader.lastRead} continueReading={reader.continueReading} />
          </motion.div>
        )}
        {reader.view === 'reader' && reader.selectedSurah && (
          <motion.div key="reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ReaderView selectedSurah={reader.selectedSurah} ayahs={reader.ayahs} loading={reader.loading}
              fontSize={reader.fontSize} selectedAyah={reader.selectedAyah}
              playingAyah={reader.playingAyah} tafsirs={reader.tafsirs}
              tafsirLoading={reader.tafsirLoading} selectedTafsir={reader.selectedTafsir}
              setSelectedTafsir={reader.setSelectedTafsir} loadSurah={reader.loadSurah}
              loadTafsir={reader.loadTafsir} playAudio={reader.playAudio}
              toggleBookmark={reader.toggleBookmark} isBookmarked={reader.isBookmarked}
              setView={reader.setView} />
          </motion.div>
        )}
        {reader.view === 'search' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SearchView searchQuery={reader.searchQuery} setSearchQuery={reader.setSearchQuery}
              searchResults={reader.searchResults} searchLoading={reader.searchLoading}
              handleSearch={reader.handleSearch} loadSurah={reader.loadSurah} />
          </motion.div>
        )}
        {reader.view === 'bookmarks' && (
          <motion.div key="bookmarks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BookmarksView bookmarks={reader.bookmarks} toggleBookmark={reader.toggleBookmark}
              loadSurah={reader.loadSurah} />
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={reader.audioRef} onEnded={() => reader.setPlayingAyah(null)} onError={() => reader.setPlayingAyah(null)} />
    </div>
  );
}
