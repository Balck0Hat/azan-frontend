import { motion } from 'framer-motion';
import { formatTime12 } from './ramadanUtils';

export default function ImsakiaCard({ fajrTime, maghribTime, countdown, countdownTarget }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-sm">
      <p className="text-[var(--text-primary)] font-bold mb-4">🕌 إمساكية اليوم</p>
      <div className="flex items-center justify-between gap-3">
        <div className="text-center flex-1">
          <p className="text-[var(--text-muted)] text-xs mb-1">الإمساك (الفجر)</p>
          <p className="text-[var(--text-primary)] font-bold text-lg">{formatTime12(fajrTime)}</p>
        </div>
        <div className="text-center flex-1 py-3 px-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
          <p className="text-[var(--text-secondary)] text-xs mb-1">{countdownTarget || 'العد التنازلي'}</p>
          <p className="text-indigo-300 font-bold text-xl font-mono tracking-wider">{countdown}</p>
        </div>
        <div className="text-center flex-1">
          <p className="text-[var(--text-muted)] text-xs mb-1">الإفطار (المغرب)</p>
          <p className="text-[var(--text-primary)] font-bold text-lg">{formatTime12(maghribTime)}</p>
        </div>
      </div>
    </motion.div>
  );
}
