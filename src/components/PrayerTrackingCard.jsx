import { useState, useEffect } from 'react';
import { getTrackingForDate, togglePrayer, getWeeklySummary } from '../utils/prayerTracking';
import { PRAYERS } from '../data/notificationData';
import TrackingStatsPanel from './TrackingStatsPanel';
import '../styles/prayerTrackingCard.css';

export default function PrayerTrackingCard() {
  const [todayTracking, setTodayTracking] = useState({});
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    setTodayTracking(getTrackingForDate());
    setStats(getWeeklySummary());
  };

  const handleToggle = (prayerKey) => {
    togglePrayer(prayerKey);
    loadData();
  };

  const todayCount = Object.values(todayTracking).filter(Boolean).length;
  const todayPercentage = Math.round((todayCount / 5) * 100);

  return (
    <div className="prayer-tracking-card">
      <div className="pt-header">
        <div className="pt-title">
          <span className="pt-icon">📿</span>
          <h3>متابعة الصلوات</h3>
        </div>
        <button className="pt-stats-btn" onClick={() => setShowStats(!showStats)}>
          {showStats ? '✕' : '📊'}
        </button>
      </div>

      <div className="pt-today-progress">
        <div className="pt-progress-bar">
          <div className="pt-progress-fill" style={{ width: `${todayPercentage}%` }} />
        </div>
        <span className="pt-progress-text">{todayCount}/5 صلوات اليوم</span>
      </div>

      <div className="pt-prayers-grid">
        {PRAYERS.map((prayer) => (
          <button
            key={prayer.key}
            className={`pt-prayer-btn ${todayTracking[prayer.key] ? 'prayed' : ''}`}
            onClick={() => handleToggle(prayer.key)}
          >
            <span className="pt-prayer-icon">{prayer.icon}</span>
            <span className="pt-prayer-name">{prayer.name}</span>
            <span className="pt-prayer-check">
              {todayTracking[prayer.key] ? '✓' : '○'}
            </span>
          </button>
        ))}
      </div>

      {showStats && <TrackingStatsPanel stats={stats} />}
    </div>
  );
}
