export default function SurahsListView({ filteredSurahs, juzFilter, setJuzFilter, loadSurah, lastRead, continueReading }) {
  return (
    <div className="surahs-view">
      {/* Last Read Banner */}
      {lastRead && (
        <div className="last-read-banner" onClick={continueReading}>
          <span className="last-read-icon">📍</span>
          <div className="last-read-info">
            <span className="last-read-label">متابعة القراءة</span>
            <span className="last-read-position">{lastRead.surahName} - الآية {lastRead.ayah}</span>
          </div>
          <span className="continue-arrow">←</span>
        </div>
      )}

      {/* Juz Filter */}
      <div className="juz-filter">
        <button className={juzFilter === 0 ? 'active' : ''} onClick={() => setJuzFilter(0)}>الكل</button>
        {[...Array(30)].map((_, i) => (
          <button
            key={i + 1}
            className={juzFilter === i + 1 ? 'active' : ''}
            onClick={() => setJuzFilter(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="surahs-grid">
        {filteredSurahs.map(surah => (
          <div key={surah.num} className="surah-card" onClick={() => loadSurah(surah)}>
            <div className="surah-number">{surah.num}</div>
            <div className="surah-details">
              <span className="surah-name-ar">{surah.name}</span>
              <span className="surah-name-en">{surah.englishName}</span>
              <span className="surah-meta">{surah.verses} آية • {surah.type} • جزء {surah.juz}</span>
            </div>
            <div className={`surah-type-badge ${surah.type === 'مكية' ? 'makki' : 'madani'}`}>
              {surah.type === 'مكية' ? '🕋' : '🕌'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
