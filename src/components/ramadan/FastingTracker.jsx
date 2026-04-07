// FastingTracker.jsx — Fasting days stats and toggle grid

const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function FastingTracker({
  fastingDays,
  toggleFasting,
  ramadanDay,
}) {
  const fastedCount = fastingDays.length;
  const remaining = 30 - fastedCount;
  const pct = Math.round((fastedCount / 30) * 100);

  return (
    <div className="ram-card">
      <div className="ram-card-title">📊 متتبع الصيام</div>
      <div className="ram-fasting-stats">
        <div className="ram-stat">
          <div className="ram-stat-number">{fastedCount}</div>
          <div className="ram-stat-label">يوم صيام</div>
        </div>
        <div className="ram-stat">
          <div className="ram-stat-number">{remaining}</div>
          <div className="ram-stat-label">متبقي</div>
        </div>
        <div className="ram-stat">
          <div className="ram-stat-number">{pct}%</div>
          <div className="ram-stat-label">إنجاز</div>
        </div>
      </div>
      <div className="ram-fasting-grid">
        {DAYS.map((dayNum) => {
          const isFasted = fastingDays.includes(dayNum);
          const isToday = dayNum === ramadanDay;
          const className =
            "ram-fasting-day" +
            (isFasted ? " fasted" : "") +
            (isToday ? " today" : "");

          return (
            <button
              key={dayNum}
              className={className}
              onClick={() => toggleFasting(dayNum)}
              title={`يوم ${dayNum}`}
            >
              {isFasted ? "✓" : dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
