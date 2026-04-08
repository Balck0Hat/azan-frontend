import { motion } from 'framer-motion';

export default function RamadanHeader({ ramadanDay }) {
  const pct = Math.round((ramadanDay / 30) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-amber-600/10 border border-[var(--border-color)] backdrop-blur-xl">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">🌙 رمضان كريم</h2>
        <p className="text-[var(--text-primary)]">
          اليوم <span className="text-2xl font-bold text-amber-300 mx-1">{ramadanDay}</span> من 30
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--text-secondary)]">اليوم {ramadanDay}</span>
          <span className="text-indigo-300 font-bold">{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-[var(--bg-card)] overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-l from-amber-400 to-indigo-500" />
        </div>
      </div>
    </motion.div>
  );
}
