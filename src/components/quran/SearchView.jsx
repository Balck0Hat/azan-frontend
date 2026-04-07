import SURAHS from '../../data/surahs.json';

export default function SearchView({ searchQuery, setSearchQuery, searchResults, searchLoading, handleSearch, loadSurah }) {
  return (
    <div className="search-view">
      <div className="search-box">
        <input
          type="text"
          placeholder="ابحث في القرآن الكريم..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={searchLoading}>
          {searchLoading ? '...' : '🔍'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <p className="results-count">عدد النتائج: {searchResults.length}</p>
          {searchResults.map((result, idx) => (
            <div
              key={idx}
              className="search-result-item"
              onClick={() => {
                const surah = SURAHS.find(s => s.num === result.surah);
                if (surah) loadSurah(surah);
              }}
            >
              <div className="result-header">
                <span className="result-surah">{result.surahName}</span>
                <span className="result-ayah">الآية {result.ayah}</span>
              </div>
              <p className="result-text">{result.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
