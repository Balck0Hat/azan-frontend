import { motion } from 'framer-motion';
import { khatmaPlan } from '../../data/ramadanData';

export default function KhatmaGrid({ khatmaJuz, toggleKhatma }) {
  const completedCount = khatmaJuz.length;
  const pct = Math.round((completedCount / 30) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-sm">
      <p className="text-[var(--text-primary)] font-bold mb-3">📖 ختمة رمضان</p>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">{completedCount} من 30 جزء</span>
          <span className="text-indigo-300 font-bold">{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-[var(--bg-card)] overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-indigo-500" />
        </div>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5">
        {khatmaPlan.map((item) => {
          const isCompleted = khatmaJuz.includes(item.juz);
          return (
            <motion.button key={item.juz} whileTap={{ scale: 0.85 }}
              onClick={() => toggleKhatma(item.juz)} title={`${item.name}: ${item.from} — ${item.to}`}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all ${
                isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)]'
              }`}>
              <span className="font-bold text-sm">{isCompleted ? '✓' : item.juz}</span>
              <span className="text-[10px] opacity-60 truncate max-w-full px-0.5">{item.from}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
