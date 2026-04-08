import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrackingForDate, togglePrayer, getWeeklySummary } from '../utils/prayerTracking';
import { PRAYERS } from '../data/notificationData';
import TrackingStatsPanel from './TrackingStatsPanel';

export default function PrayerTrackingCard() {
  const [todayTracking, setTodayTracking] = useState({});
  const [stats, setStats] = useState(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = () => { setTodayTracking(getTrackingForDate()); setStats(getWeeklySummary()); };
  const handleToggle = (prayerKey) => { togglePrayer(prayerKey); loadData(); };

  const todayCount = Object.values(todayTracking).filter(Boolean).length;
  const todayPercentage = Math.round((todayCount / 5) * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (todayPercentage / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-white">متابعة الصلوات</h3>
        </div>
        <button onClick={() => setShowStats(!showStats)}
          className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
          {showStats ? '✕' : '📊'}
        </button>
      </div>

      {/* Progress ring + bar */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <motion.circle cx="50" cy="50" r="40" fill="none" stroke="url(#progressGrad)"
              strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }} transition={{ duration: 0.8, ease: "easeOut" }} />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{todayCount}/5</span>
          </div>
        </div>
        <div className="flex-1">
          <span className="text-sm text-slate-400 block mb-2">صلوات اليوم</span>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${todayPercentage}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {PRAYERS.map((prayer, i) => {
          const prayed = todayTracking[prayer.key];
          return (
            <motion.button key={prayer.key} whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }} onClick={() => handleToggle(prayer.key)}
              className={`flex flex-col items-center gap-1.5 rounded-xl p-3 border transition-all ${
                prayed
                  ? 'bg-emerald-500/15 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08]'
              }`}>
              <span className="text-lg">{prayer.icon}</span>
              <span className={`text-[11px] font-medium ${prayed ? 'text-emerald-400' : 'text-slate-400'}`}>{prayer.name}</span>
              <motion.span animate={{ scale: prayed ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}
                className={`text-sm font-bold ${prayed ? 'text-emerald-400' : 'text-slate-600'}`}>
                {prayed ? '✓' : '○'}
              </motion.span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>{showStats && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
          <TrackingStatsPanel stats={stats} />
        </motion.div>
      )}</AnimatePresence>
    </motion.div>
  );
}
