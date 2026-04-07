import SURAHS from '../../data/surahs.json';

export default function ReaderView({
  selectedSurah, ayahs, loading, fontSize, selectedAyah, playingAyah,
  tafsirs, tafsirLoading, selectedTafsir, setSelectedTafsir,
  loadSurah, loadTafsir, playAudio, toggleBookmark, isBookmarked, setView,
}) {
  return (
    <div className="reader-view">
      <div className="reader-header">
        <button className="back-btn" onClick={() => setView('surahs')}>→ العودة للسور</button>
        <div className="surah-title">
          <h3>سورة {selectedSurah.name}</h3>
          <span>{selectedSurah.englishName} • {selectedSurah.verses} آية</span>
        </div>
        <div className="reader-controls">
          <button className="nav-surah-btn" disabled={selectedSurah.num === 1}
            onClick={() => loadSurah(SURAHS[selectedSurah.num - 2])}>← السابقة</button>
          <button className="nav-surah-btn" disabled={selectedSurah.num === 114}
            onClick={() => loadSurah(SURAHS[selectedSurah.num])}>التالية →</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="quran-spinner"></div>
          <p>جاري تحميل السورة...</p>
        </div>
      ) : (
        <div className="ayahs-container">
          {selectedSurah.num !== 1 && selectedSurah.num !== 9 && (
            <div className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          )}

          <div className="ayahs-flow" style={{ fontSize: `${fontSize}px` }}>
            {ayahs.map((ayah) => (
              <div key={ayah.number} className="ayah-wrapper">
                <span
                  className={`ayah-text ${selectedAyah === ayah.number ? 'selected' : ''} ${playingAyah === ayah.number ? 'playing' : ''}`}
                  onClick={() => loadTafsir(ayah.number)}
                >
                  {ayah.text}
                  <span className="ayah-number">﴿{ayah.number}﴾</span>
                </span>

                <div className="ayah-actions">
                  <button
                    className={`action-btn play ${playingAyah === ayah.number ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); playAudio(ayah.number); }}
                    title="استمع"
                  >
                    {playingAyah === ayah.number ? '⏸️' : '▶️'}
                  </button>
                  <button
                    className={`action-btn bookmark ${isBookmarked(selectedSurah.num, ayah.number) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(selectedSurah.num, ayah.number); }}
                    title="حفظ"
                  >
                    {isBookmarked(selectedSurah.num, ayah.number) ? '🔖' : '📑'}
                  </button>
                  <button className="action-btn tafsir"
                    onClick={(e) => { e.stopPropagation(); loadTafsir(ayah.number); }} title="تفسير">📖</button>
                </div>

                {selectedAyah === ayah.number && (
                  <div className="tafsir-panel">
                    {tafsirLoading ? (
                      <div className="tafsir-loading"><div className="mini-spinner"></div>جاري تحميل التفسير...</div>
                    ) : (
                      <>
                        <div className="tafsir-tabs">
                          {Object.entries(tafsirs).map(([key, value]) => (
                            <button key={key} className={`tafsir-tab ${selectedTafsir === key ? 'active' : ''}`}
                              onClick={() => setSelectedTafsir(key)}>{value.name}</button>
                          ))}
                        </div>
                        <div className="tafsir-content">{tafsirs[selectedTafsir]?.text || 'اختر تفسيراً'}</div>
                      </>
                    )}
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
