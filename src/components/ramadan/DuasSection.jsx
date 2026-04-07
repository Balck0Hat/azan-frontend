// DuasSection.jsx — Ramadan duas with category tabs and copy button

export default function DuasSection({
  duaFilter,
  setDuaFilter,
  duaCategories,
  filteredDuas,
  copiedDua,
  copyDua,
}) {
  return (
    <div className="ram-card">
      <div className="ram-card-title">🤲 أدعية رمضان</div>
      <div className="ram-duas-tabs">
        {duaCategories.map((cat) => (
          <button
            key={cat}
            className={
              "ram-dua-tab" + (duaFilter === cat ? " active" : "")
            }
            onClick={() => setDuaFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="ram-duas-list">
        {filteredDuas.map((dua) => (
          <div key={dua.id} className="ram-dua-card">
            <div className="ram-dua-label">{dua.label}</div>
            <div className="ram-dua-text">{dua.text}</div>
            <button
              className={
                "ram-dua-copy" +
                (copiedDua === dua.id ? " ram-dua-copied" : "")
              }
              onClick={() => copyDua(dua.id, dua.text)}
            >
              {copiedDua === dua.id ? "✓ تم النسخ" : "📋 نسخ"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
