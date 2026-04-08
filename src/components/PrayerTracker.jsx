import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PRAYERS } from '../data/notificationData';
import WeekChart from './WeekChart';

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
      const date = new Date(); date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const dayPrayers = saved[dateStr] || {};
      const prayedCount = Object.values(dayPrayers).filter(v => v).length;
      weekData.push({ day: ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'][date.getDay()], date: dateStr, prayed: prayedCount, total: 5 });
      total += prayedCount;
      if (i === 0) continue;
      if (!streakBroken && prayedCount === 5) streakCount++; else if (prayedCount < 5) streakBroken = true;
    }
    const todayPrayed = Object.values(saved[today] || {}).filter(v => v).length;
    if (todayPrayed === 5) streakCount++;
    setWeekStats(weekData); setStreak(streakCount); setTotalPrayed(total);
  };

  const togglePrayer = (prayerKey) => {
    const today = new Date().toDateString();
    const saved = JSON.parse(localStorage.getItem('prayerTracker') || '{}');
    if (!saved[today]) saved[today] = {};
    saved[today][prayerKey] = !saved[today][prayerKey];
    localStorage.setItem('prayerTracker', JSON.stringify(saved));
    setTodayPrayers(saved[today]); loadData();
  };

  const todayPrayedCount = Object.values(todayPrayers).filter(v => v).length;
  const todayPercentage = (todayPrayedCount / 5) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">تتبع صلاتك</h3>
        <div className="flex items-center gap-2 rounded-xl bg-[var(--status-warning)]/10 border border-[var(--status-warning)]/20 px-3 py-1.5">
          <span className="text-[var(--status-warning)] text-lg">&#x1F525;</span>
          <span className="text-lg font-bold text-[var(--status-warning)]">{streak}</span>
          <span className="text-xs text-[var(--status-warning)]/70">يوم متتالي</span>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[var(--text-secondary)]">صلوات اليوم</span>
          <span className="text-sm font-semibold text-indigo-400">{todayPrayedCount}/5</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--border-color)] overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${todayPercentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-purple-500" />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {PRAYERS.map((prayer, i) => {
          const prayed = todayPrayers[prayer.key];
          return (
            <motion.button key={prayer.key} whileTap={{ scale: 0.92 }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} onClick={() => togglePrayer(prayer.key)}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-3 border transition-all ${
                prayed
                  ? 'bg-[var(--status-success)]/15 border-[var(--status-success)]/30 shadow-lg shadow-[var(--status-success)]/10'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
              }`}>
              <span className="text-lg">{prayer.icon}</span>
              <span className={`text-[11px] font-medium ${prayed ? 'text-[var(--status-success)]' : 'text-[var(--text-secondary)]'}`}>{prayer.name}</span>
              <motion.span animate={{ scale: prayed ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className={`text-sm font-bold ${prayed ? 'text-[var(--status-success)]' : 'text-[var(--text-muted)]'}`}>
                {prayed ? '✓' : '○'}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      <WeekChart weekStats={weekStats} totalPrayed={totalPrayed} />
    </motion.div>
  );
}
