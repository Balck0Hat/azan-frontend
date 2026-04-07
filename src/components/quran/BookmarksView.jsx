import SURAHS from '../../data/surahs.json';

export default function BookmarksView({ bookmarks, toggleBookmark, loadSurah }) {
  return (
    <div className="bookmarks-view">
      <h3>🔖 الآيات المحفوظة</h3>
      {bookmarks.length === 0 ? (
        <p className="no-bookmarks">لا توجد آيات محفوظة</p>
      ) : (
        <div className="bookmarks-list">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.key}
              className="bookmark-item"
              onClick={() => {
                const surah = SURAHS.find(s => s.num === bookmark.surah);
                if (surah) loadSurah(surah);
              }}
            >
              <span className="bookmark-surah">{bookmark.surahName}</span>
              <span className="bookmark-ayah">الآية {bookmark.ayah}</span>
              <button
                className="remove-bookmark"
                onClick={(e) => { e.stopPropagation(); toggleBookmark(bookmark.surah, bookmark.ayah); }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
