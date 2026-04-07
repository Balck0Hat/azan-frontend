import { useState, useEffect } from 'react';
import { PRAYERS } from '../data/notificationData';
import WeekChart from './WeekChart';
import '../styles/prayerTracker.css';

export default function PrayerTracker() {
  const [todayPrayers, setTodayPrayers] = useState({});
  const [weekStats, setWeekStats] = useState([]);
  const [streak, setStreak] = useState(0);
  const [totalPrayed, setTotalPrayed] = useState(0);

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('prayerTracker') || '{}');
    setTodayPrayers(saved[today] || {});

    const weekData = [];
    let streakCount = 0, total = 0, streakBroken = false;

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayPrayers = saved[dateStr] || {};
      const prayedCount = Object.values(dayPrayers).filter(v => v).length;

      weekData.push({
        day: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'][date.getDay()],
        date: dateStr, prayed: prayedCount, total: 5
      });
      total += prayedCount;

      if (i === 0) continue;
      if (!streakBroken && prayedCount === 5) streakCount++;
      else if (prayedCount < 5) streakBroken = true;
    }

    const todayPrayed = Object.values(saved[today] || {}).filter(v => v).length;
    if (todayPrayed === 5) streakCount++;

    setWeekStats(weekData);
    setStreak(streakCount);
    setTotalPrayed(total);
  };

  const togglePrayer = (prayerKey) => {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('prayerTracker') || '{}');
    if (!saved[today]) saved[today] = {};
    saved[today][prayerKey] = !saved[today][prayerKey];
    localStorage.setItem('prayerTracker', JSON.stringify(saved));
    setTodayPrayers(saved[today]);
    loadData();
  };

  const todayPrayedCount = Object.values(todayPrayers).filter(v => v).length;
  const todayPercentage = (todayPrayedCount / 5) * 100;

  return (
    <div className="prayer-tracker">
      <div className="tracker-header">
        <h3 className="tracker-title">📊 تتبع صلاتك</h3>
        <div className="tracker-streak">
          <span className="streak-fire">🔥</span>
          <span className="streak-count">{streak}</span>
          <span className="streak-label">يوم متتالي</span>
        </div>
      </div>

      <div className="today-prayers">
        <div className="today-header">
          <span>صلوات اليوم</span>
          <span className="today-count">{todayPrayedCount}/5</span>
        </div>
        <div className="today-progress">
          <div className="today-progress-fill" style={{ width: `${todayPercentage}%` }} />
        </div>
        <div className="prayers-grid">
          {PRAYERS.map(prayer => (
            <button
              key={prayer.key}
              className={`prayer-btn ${todayPrayers[prayer.key] ? 'prayed' : ''}`}
              onClick={() => togglePrayer(prayer.key)}
            >
              <span className="prayer-icon">{prayer.icon}</span>
              <span className="prayer-name">{prayer.name}</span>
              {todayPrayers[prayer.key] && <span className="prayer-check">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <WeekChart weekStats={weekStats} totalPrayed={totalPrayed} />
    </div>
  );
}
