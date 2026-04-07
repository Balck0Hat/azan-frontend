import { PRAYER_KEYS, getPrayerLabel } from "./globeUtils";

function StatCard({ icon, label, value, accent }) {
  return (
    <div className={`globe-stat-card${accent ? ` globe-stat-card--${accent}` : ""}`}>
      <span className="globe-stat-icon">{icon}</span>
      <strong className="globe-stat-value">{value}</strong>
      <span className="globe-stat-label">{label}</span>
    </div>
  );
}

export default function GlobeFooterStats({ isAllMode, stats }) {
  if (isAllMode) {
    return (
      <div className="globe-stats-grid">
        {PRAYER_KEYS.map((key) => (
          <StatCard
            key={key}
            icon={<span className={`globe-legend-dot globe-legend-dot-${key.toLowerCase()}`} />}
            label={getPrayerLabel(key)}
            value={stats.perPrayer[key] || 0}
          />
        ))}
        <StatCard icon="📍" label="مدن" value={stats.total} />
      </div>
    );
  }

  return (
    <div className="globe-stats-grid">
      <StatCard icon="🌙" label="ليل" value={stats.night} accent="night" />
      <StatCard icon="☀️" label="نهار" value={stats.day} accent="day" />
      <StatCard icon="🔊" label="يُؤذَّن" value={stats.now} accent="now" />
      <StatCard icon="📍" label="مدن" value={stats.total} />
    </div>
  );
}
