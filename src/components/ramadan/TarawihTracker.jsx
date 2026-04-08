import { useState } from 'react';
import { motion } from 'framer-motion';

export default function TarawihTracker({ ramadanDay, hijriYear }) {
  const storageKey = `ramadan-taraweeh-${hijriYear}`;
  const [nights, setNights] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
    catch { return []; }
  });

  const toggle = (night) => {
    setNights((prev) => {
      const next = prev.includes(night) ? prev.filter((n) => n !== night) : [...prev, night];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const stats = [
    { value: nights.length, label: 'ليلة صلاة', color: 'text-purple-400' },
    { value: 30 - nights.length, label: 'متبقي', color: 'text-amber-400' },
    { value: `${Math.round((nights.length / 30) * 100)}%`, label: 'إنجاز', color: 'text-indigo-400' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
      <p className="text-white font-bold mb-4">🌙 متتبع التراويح</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {stats.map((s, i) => (
          <div key={i} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
          <motion.button key={n} whileTap={{ scale: 0.85 }} onClick={() => toggle(n)} title={`ليلة ${n}`}
            className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
              nights.includes(n) ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
              n === ramadanDay ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 ring-1 ring-indigo-500/30' :
              'bg-white/[0.03] text-slate-500 border border-white/5 hover:bg-white/[0.06]'
            }`}>
            {nights.includes(n) ? '✓' : n}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
