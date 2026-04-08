import { useState } from 'react';
import { motion } from 'framer-motion';
import { dailyPlanItems } from '../../data/ramadanData';

export default function DailyPlanner({ ramadanDay, hijriYear }) {
  const storageKey = `ramadan-planner-${hijriYear}`;
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem(storageKey)) || {};
      return data[ramadanDay] || [];
    } catch { return []; }
  });

  const toggle = (itemId) => {
    setCheckedItems((prev) => {
      const next = prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId];
      const allData = JSON.parse(localStorage.getItem(storageKey) || '{}');
      allData[ramadanDay] = next;
      localStorage.setItem(storageKey, JSON.stringify(allData));
      return next;
    });
  };

  const completedCount = checkedItems.length;
  const totalCount = dailyPlanItems.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
      <p className="text-white font-bold mb-3">📋 المخطط اليومي — يوم {ramadanDay}</p>
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">{completedCount} من {totalCount} عبادة</span>
          <span className="text-indigo-300 font-bold">{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-indigo-500" />
        </div>
      </div>
      <div className="space-y-1.5">
        {dailyPlanItems.map((item, i) => {
          const checked = checkedItems.includes(item.id);
          return (
            <motion.div key={item.id} whileTap={{ scale: 0.98 }}
              onClick={() => toggle(item.id)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                checked ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.04]'
              }`}>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 transition-all ${
                checked ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-white/[0.05] border border-white/10 text-transparent'
              }`}>{checked ? '✓' : ''}</div>
              <span className="text-lg">{item.icon}</span>
              <span className={`flex-1 text-sm ${checked ? 'text-emerald-300 line-through opacity-70' : 'text-slate-200'}`}>{item.label}</span>
              <span className="text-slate-600 text-xs">{item.category}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
