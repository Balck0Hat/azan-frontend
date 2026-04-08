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
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold text-white">تتبع صلاتك</h3>
        <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5">
          <span className="text-amber-400 text-lg">&#x1F525;</span>
          <span className="text-lg font-bold text-amber-400">{streak}</span>
          <span className="text-xs text-amber-400/70">يوم متتالي</span>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">صلوات اليوم</span>
          <span className="text-sm font-semibold text-indigo-400">{todayPrayedCount}/5</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
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
                  ? 'bg-emerald-500/15 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08]'
              }`}>
              <span className="text-lg">{prayer.icon}</span>
              <span className={`text-[11px] font-medium ${prayed ? 'text-emerald-400' : 'text-slate-400'}`}>{prayer.name}</span>
              <motion.span animate={{ scale: prayed ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className={`text-sm font-bold ${prayed ? 'text-emerald-400' : 'text-slate-600'}`}>
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
