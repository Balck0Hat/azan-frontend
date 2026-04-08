import { motion } from 'framer-motion';
import { PRAYERS } from '../data/notificationData';

export default function TrackingStatsPanel({ stats }) {
  if (!stats) return null;

  const circumference = 2 * Math.PI * 15.9155;
  const offset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-5">
      <h4 className="text-sm font-semibold text-slate-300">إحصائيات الأسبوع</h4>

      <div className="flex items-center gap-5">
        {/* Streak */}
        <div className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2">
          <span className="text-lg">&#x1F525;</span>
          <span className="text-lg font-bold text-amber-400">{stats.streak}</span>
          <span className="text-xs text-amber-400/70">يوم</span>
        </div>

        {/* Overall ring */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
              <motion.circle cx="18" cy="18" r="15.9155" fill="none" stroke="url(#statGrad)"
                strokeWidth="2.5" strokeLinecap="round" strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }} transition={{ duration: 0.8 }} />
              <defs>
                <linearGradient id="statGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white">{stats.percentage}%</span>
            </div>
          </div>
          <span className="text-xs text-slate-400">نسبة الالتزام</span>
        </div>
      </div>

      {/* Per prayer bars */}
      <div className="space-y-2.5">
        {PRAYERS.map((prayer) => {
          const ps = stats.byPrayer[prayer.key];
          const pct = ps.total > 0 ? Math.round((ps.prayed / ps.total) * 100) : 0;
          return (
            <div key={prayer.key} className="flex items-center gap-3">
              <span className="text-sm w-5 text-center">{prayer.icon}</span>
              <span className="text-xs text-slate-400 w-12">{prayer.name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-purple-500" />
              </div>
              <span className="text-xs font-mono text-slate-400 w-8 text-left">{pct}%</span>
            </div>
          );
        })}
      </div>

      {/* Weekly mini chart */}
      <div className="flex items-end gap-1.5 h-16">
        {stats.dailyData.slice().reverse().map((day) => (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full h-12 rounded bg-white/[0.04] relative overflow-hidden">
              <motion.div initial={{ height: 0 }} animate={{ height: `${day.percentage}%` }}
                transition={{ duration: 0.4 }}
                className="absolute bottom-0 w-full rounded bg-gradient-to-t from-indigo-500/80 to-purple-500/50" />
            </div>
            <span className="text-[9px] text-slate-500">
              {['أح','إث','ثل','أر','خم','جم','سب'][new Date(day.date).getDay()]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
