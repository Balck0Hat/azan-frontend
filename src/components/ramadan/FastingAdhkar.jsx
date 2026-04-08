import { useState } from 'react';
import { motion } from 'framer-motion';
import { fastingAdhkar } from '../../data/ramadanData';

export default function FastingAdhkar() {
  const [filter, setFilter] = useState('الكل');
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['الكل', 'سحور', 'إفطار', 'ليلة القدر', 'قيام'];
  const filtered = filter === 'الكل' ? fastingAdhkar : fastingAdhkar.filter((a) => a.category === filter);

  const copy = (id, text) => {
    navigator.clipboard.writeText(text).then(() => { setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
      <p className="text-white font-bold mb-4">📿 أذكار الصائم</p>
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {categories.map((cat) => (
          <motion.button key={cat} whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
              filter === cat ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
              'bg-white/[0.04] text-slate-500 border border-white/5'
            }`}>{cat}</motion.button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((dhikr, i) => (
          <motion.div key={dhikr.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <p className="text-indigo-300 text-xs font-medium mb-2">{dhikr.label}</p>
            <p className="text-slate-200 leading-relaxed text-lg mb-3">{dhikr.text}</p>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => copy(dhikr.id, dhikr.text)}
              className={`text-xs px-3 py-1 rounded-lg transition-all ${
                copiedId === dhikr.id ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.05] text-slate-400 hover:bg-white/10'
              }`}>{copiedId === dhikr.id ? '✓ تم النسخ' : '📋 نسخ'}</motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
