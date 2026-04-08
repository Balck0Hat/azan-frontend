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
      className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">متابعة الصلوات</h3>
        </div>
        <button onClick={() => setShowStats(!showStats)}
          className="w-9 h-9 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all">
          {showStats ? '✕' : '📊'}
        </button>
      </div>

      {/* Progress ring + bar */}
      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" style={{ stroke: 'var(--border-color)' }} strokeWidth="6" />
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
            <span className="text-lg font-bold text-[var(--text-primary)]">{todayCount}/5</span>
          </div>
        </div>
        <div className="flex-1">
          <span className="text-sm text-[var(--text-secondary)] block mb-2">صلوات اليوم</span>
          <div className="h-2 rounded-full bg-[var(--border-color)] overflow-hidden">
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
                  ? 'bg-[var(--status-success)]/15 border-[var(--status-success)]/30 shadow-lg shadow-[var(--status-success)]/10'
                  : 'bg-[var(--bg-card)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
              }`}>
              <span className="text-lg">{prayer.icon}</span>
              <span className={`text-[11px] font-medium ${prayed ? 'text-[var(--status-success)]' : 'text-[var(--text-secondary)]'}`}>{prayer.name}</span>
              <motion.span animate={{ scale: prayed ? [1, 1.4, 1] : 1 }} transition={{ duration: 0.3 }}
                className={`text-sm font-bold ${prayed ? 'text-[var(--status-success)]' : 'text-[var(--text-muted)]'}`}>
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
