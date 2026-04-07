// KhatmaGrid.jsx — Quran khatma progress bar and juz grid

import { khatmaPlan } from "../../data/ramadanData";

export default function KhatmaGrid({ khatmaJuz, toggleKhatma }) {
  const completedCount = khatmaJuz.length;
  const pct = Math.round((completedCount / 30) * 100);

  return (
    <div className="ram-card">
      <div className="ram-card-title">📖 ختمة رمضان</div>
      <div className="ram-khatma-progress">
        <div className="ram-progress-label">
          <span>{completedCount} من 30 جزء</span>
          <span>{pct}%</span>
        </div>
        <div className="ram-progress-bar">
          <div
            className="ram-progress-fill"
            style={{ width: `${(completedCount / 30) * 100}%` }}
          />
        </div>
      </div>
      <div className="ram-khatma-grid">
        {khatmaPlan.map((item) => {
          const isCompleted = khatmaJuz.includes(item.juz);
          return (
            <button
              key={item.juz}
              className={
                "ram-khatma-juz" + (isCompleted ? " completed" : "")
              }
              onClick={() => toggleKhatma(item.juz)}
              title={`${item.name}: ${item.from} — ${item.to}`}
            >
              <span className="ram-khatma-juz-num">
                {isCompleted ? "✓" : item.juz}
              </span>
              <span className="ram-khatma-juz-range">{item.from}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
