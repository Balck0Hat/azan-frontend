import { PRAYERS } from '../data/notificationData';

export default function TrackingStatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <div className="pt-stats-panel">
      <div className="pt-stats-header">
        <h4>إحصائيات الأسبوع</h4>
      </div>

      <div className="pt-streak">
        <span className="pt-streak-icon">🔥</span>
        <span className="pt-streak-count">{stats.streak}</span>
        <span className="pt-streak-label">يوم متتالي</span>
      </div>

      <div className="pt-overall">
        <div className="pt-overall-circle">
          <svg viewBox="0 0 36 36">
            <path className="pt-circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="pt-circle-fill" strokeDasharray={`${stats.percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <span className="pt-overall-percentage">{stats.percentage}%</span>
        </div>
        <span className="pt-overall-label">نسبة الالتزام</span>
      </div>

      <div className="pt-per-prayer">
        {PRAYERS.map((prayer) => {
          const prayerStats = stats.byPrayer[prayer.key];
          const pct = prayerStats.total > 0 ? Math.round((prayerStats.prayed / prayerStats.total) * 100) : 0;
          return (
            <div key={prayer.key} className="pt-prayer-stat">
              <span className="pt-prayer-stat-icon">{prayer.icon}</span>
              <span className="pt-prayer-stat-name">{prayer.name}</span>
              <div className="pt-prayer-stat-bar">
                <div className="pt-prayer-stat-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="pt-prayer-stat-pct">{pct}%</span>
            </div>
          );
        })}
      </div>

      <div className="pt-weekly-chart">
        {stats.dailyData.slice().reverse().map((day) => (
          <div key={day.date} className="pt-day-bar">
            <div className="pt-day-fill" style={{ height: `${day.percentage}%` }} />
            <span className="pt-day-label">
              {['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'][new Date(day.date).getDay()]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
