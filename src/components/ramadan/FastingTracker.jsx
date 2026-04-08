import { motion } from 'framer-motion';

const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

export default function FastingTracker({ fastingDays, toggleFasting, ramadanDay }) {
  const fastedCount = fastingDays.length;
  const remaining = 30 - fastedCount;
  const pct = Math.round((fastedCount / 30) * 100);

  const stats = [
    { value: fastedCount, label: 'يوم صيام', color: 'text-emerald-400' },
    { value: remaining, label: 'متبقي', color: 'text-amber-400' },
    { value: `${pct}%`, label: 'إنجاز', color: 'text-indigo-400' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-sm">
      <p className="text-[var(--text-primary)] font-bold mb-4">📊 متتبع الصيام</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {stats.map((s, i) => (
          <div key={i} className="text-center p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[var(--text-muted)] text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
        {DAYS.map((dayNum) => {
          const isFasted = fastingDays.includes(dayNum);
          const isToday = dayNum === ramadanDay;
          return (
            <motion.button key={dayNum} whileTap={{ scale: 0.85 }}
              onClick={() => toggleFasting(dayNum)} title={`يوم ${dayNum}`}
              className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                isFasted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                isToday ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 ring-1 ring-indigo-500/30' :
                'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
              }`}>
              {isFasted ? '✓' : dayNum}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
