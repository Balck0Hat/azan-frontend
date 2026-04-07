// RamadanHeader.jsx — Greeting, day counter, and progress bar

export default function RamadanHeader({ ramadanDay }) {
  const pct = Math.round((ramadanDay / 30) * 100);

  return (
    <div className="ram-card ram-header">
      <div className="ram-greeting">🌙 رمضان كريم</div>
      <div className="ram-day-info">
        اليوم <span className="ram-day-number">{ramadanDay}</span> من 30
      </div>
      <div className="ram-progress-wrap">
        <div className="ram-progress-label">
          <span>اليوم {ramadanDay}</span>
          <span>{pct}%</span>
        </div>
        <div className="ram-progress-bar">
          <div
            className="ram-progress-fill"
            style={{ width: `${(ramadanDay / 30) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
