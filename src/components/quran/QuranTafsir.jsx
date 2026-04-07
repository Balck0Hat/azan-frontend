import '../../styles/quranTafsir.css';
import useQuranReader from './useQuranReader';
import SurahsListView from './SurahsListView';
import ReaderView from './ReaderView';
import SearchView from './SearchView';
import BookmarksView from './BookmarksView';
import SettingsPanel from './SettingsPanel';

export default function QuranTafsir() {
  const reader = useQuranReader();

  return (
    <div className="quran-tafsir">
      {/* Header */}
      <div className="quran-header">
        <div className="quran-title-section">
          <h2 className="quran-main-title">📖 القرآن الكريم والتفسير</h2>
          <p className="quran-subtitle">اقرأ، استمع، وتدبر</p>
        </div>

        <div className="quran-nav">
          <button className={`nav-btn ${reader.view === 'surahs' ? 'active' : ''}`} onClick={() => reader.setView('surahs')}>📚 السور</button>
          <button className={`nav-btn ${reader.view === 'search' ? 'active' : ''}`} onClick={() => reader.setView('search')}>🔍 بحث</button>
          <button className={`nav-btn ${reader.view === 'bookmarks' ? 'active' : ''}`} onClick={() => reader.setView('bookmarks')}>🔖 المحفوظات ({reader.bookmarks.length})</button>
          <button className="nav-btn settings-btn" onClick={() => reader.setShowSettings(!reader.showSettings)}>⚙️</button>
        </div>
      </div>

      {/* Settings */}
      {reader.showSettings && (
        <SettingsPanel
          fontSize={reader.fontSize} setFontSize={reader.setFontSize}
          selectedReciter={reader.selectedReciter} setSelectedReciter={reader.setSelectedReciter}
          selectedTafsir={reader.selectedTafsir} setSelectedTafsir={reader.setSelectedTafsir}
          saveSetting={reader.saveSetting}
        />
      )}

      {/* Surahs List */}
      {reader.view === 'surahs' && (
        <SurahsListView
          filteredSurahs={reader.filteredSurahs} juzFilter={reader.juzFilter}
          setJuzFilter={reader.setJuzFilter} loadSurah={reader.loadSurah}
          lastRead={reader.lastRead} continueReading={reader.continueReading}
        />
      )}

      {/* Reader */}
      {reader.view === 'reader' && reader.selectedSurah && (
        <ReaderView
          selectedSurah={reader.selectedSurah} ayahs={reader.ayahs} loading={reader.loading}
          fontSize={reader.fontSize} selectedAyah={reader.selectedAyah}
          playingAyah={reader.playingAyah} tafsirs={reader.tafsirs}
          tafsirLoading={reader.tafsirLoading} selectedTafsir={reader.selectedTafsir}
          setSelectedTafsir={reader.setSelectedTafsir}
          loadSurah={reader.loadSurah} loadTafsir={reader.loadTafsir}
          playAudio={reader.playAudio} toggleBookmark={reader.toggleBookmark}
          isBookmarked={reader.isBookmarked} setView={reader.setView}
        />
      )}

      {/* Search */}
      {reader.view === 'search' && (
        <SearchView
          searchQuery={reader.searchQuery} setSearchQuery={reader.setSearchQuery}
          searchResults={reader.searchResults} searchLoading={reader.searchLoading}
          handleSearch={reader.handleSearch} loadSurah={reader.loadSurah}
        />
      )}

      {/* Bookmarks */}
      {reader.view === 'bookmarks' && (
        <BookmarksView
          bookmarks={reader.bookmarks} toggleBookmark={reader.toggleBookmark}
          loadSurah={reader.loadSurah}
        />
      )}

      <audio ref={reader.audioRef} onEnded={() => reader.setPlayingAyah(null)} onError={() => reader.setPlayingAyah(null)} />
    </div>
  );
}
