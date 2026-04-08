import { useState } from 'react';
import { motion } from 'framer-motion';

const ADHKAR_DATA = {
  afterPrayer: [
    { text: 'أستغفر الله', repeat: 3 },
    { text: 'اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام', repeat: 1 },
    { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير', repeat: 1 },
    { text: 'سبحان الله', repeat: 33 },
    { text: 'الحمد لله', repeat: 33 },
    { text: 'الله أكبر', repeat: 33 },
    { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير', repeat: 1 },
    { text: 'آية الكرسي', repeat: 1, special: true },
  ],
  morning: [
    { text: 'أصبحنا وأصبح الملك لله، والحمد لله', repeat: 1 },
    { text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور', repeat: 1 },
    { text: 'سبحان الله وبحمده', repeat: 100 },
    { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير', repeat: 10 },
  ],
  evening: [
    { text: 'أمسينا وأمسى الملك لله، والحمد لله', repeat: 1 },
    { text: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير', repeat: 1 },
    { text: 'سبحان الله وبحمده', repeat: 100 },
  ]
};

export default function Adhkar({ type = 'afterPrayer' }) {
  const [counts, setCounts] = useState({});
  const adhkar = ADHKAR_DATA[type] || ADHKAR_DATA.afterPrayer;
  const titles = { afterPrayer: 'أذكار بعد الصلاة', morning: 'أذكار الصباح', evening: 'أذكار المساء' };

  const handleCount = (index) => {
    const dhikr = adhkar[index];
    const current = counts[index] || 0;
    if (current < dhikr.repeat) setCounts({ ...counts, [index]: current + 1 });
  };

  const resetAll = () => setCounts({});
  const totalProgress = Object.values(counts).reduce((a, b) => a + b, 0);
  const totalRequired = adhkar.reduce((a, d) => a + d.repeat, 0);
  const pct = Math.round((totalProgress / totalRequired) * 100);

  return (
    <div className="min-h-screen p-3 sm:p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600/15 to-emerald-600/10 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">📿 {titles[type]}</h3>
          <motion.button whileTap={{ scale: 0.9 }} onClick={resetAll}
            className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-slate-400 text-xs font-medium border border-white/10 hover:bg-white/10 transition-colors">
            ↻ إعادة</motion.button>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">{totalProgress} / {totalRequired}</span>
            <span className="text-indigo-300 font-bold">{pct}%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-800/60 overflow-hidden">
            <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.3 }}
              className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-indigo-500" />
          </div>
        </div>
      </motion.div>

      <div className="space-y-2">
        {adhkar.map((dhikr, idx) => {
          const current = counts[idx] || 0;
          const completed = current >= dhikr.repeat;
          const dhikrPct = Math.round((current / dhikr.repeat) * 100);
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }} whileTap={{ scale: 0.98 }}
              onClick={() => handleCount(idx)}
              className={`relative p-4 rounded-xl border cursor-pointer transition-all overflow-hidden ${
                completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05]'
              }`}>
              <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-l from-indigo-500 to-emerald-500 transition-all"
                style={{ width: `${dhikrPct}%` }} />
              <div className="flex items-center justify-between gap-3">
                <p className={`flex-1 text-lg leading-relaxed ${completed ? 'text-emerald-300/80' : 'text-slate-200'}`}>{dhikr.text}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-center min-w-[50px]">
                    <motion.span key={current} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                      className={`text-xl font-bold block ${completed ? 'text-emerald-400' : 'text-indigo-300'}`}>{current}</motion.span>
                    <span className="text-slate-600 text-xs">/ {dhikr.repeat}</span>
                  </div>
                  {completed && <span className="text-emerald-400 text-lg">✓</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
