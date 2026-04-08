import { useState } from 'react';
import { motion } from 'framer-motion';

export default function KhatmaCounter({ hijriYear }) {
  const storageKey = `ramadan-khatma-count-${hijriYear}`;
  const [count, setCount] = useState(() => {
    try { return parseInt(localStorage.getItem(storageKey)) || 0; }
    catch { return 0; }
  });

  const update = (val) => { setCount(val); localStorage.setItem(storageKey, val); };
  const increment = () => update(count + 1);
  const decrement = () => update(Math.max(0, count - 1));

  const msg = count === 0 ? 'ابدأ ختمتك الأولى!' :
    count === 1 ? 'ما شاء الله! ختمة واحدة — واصل' :
    count < 5 ? `بارك الله فيك — ${count} ختمات` :
    `ما شاء الله تبارك الله — ${count} ختمات!`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-sm flex flex-col items-center justify-center">
      <p className="text-[var(--text-primary)] font-bold mb-4">📖 عداد الختمات</p>
      <div className="flex items-center gap-6 mb-4">
        <motion.button whileTap={{ scale: 0.85 }} onClick={decrement}
          className="w-12 h-12 rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] text-xl font-bold hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-color)]">−</motion.button>
        <div className="text-center">
          <motion.p key={count} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold text-indigo-300">{count}</motion.p>
          <p className="text-[var(--text-muted)] text-sm mt-1">ختمة</p>
        </div>
        <motion.button whileTap={{ scale: 0.85 }} onClick={increment}
          className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-300 text-xl font-bold hover:bg-indigo-500/30 transition-colors border border-indigo-500/30">+</motion.button>
      </div>
      <p className="text-[var(--text-secondary)] text-sm text-center">{msg}</p>
    </motion.div>
  );
}
