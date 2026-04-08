import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SadaqaTracker({ hijriYear }) {
  const storageKey = `ramadan-sadaqa-${hijriYear}`;
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
    catch { return []; }
  });
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const total = entries.reduce((sum, e) => sum + e.amount, 0);

  const addEntry = () => {
    if (!amount || Number(amount) <= 0) return;
    const newEntry = { id: Date.now(), amount: Number(amount), note: note || 'صدقة', date: new Date().toLocaleDateString('ar-EG') };
    const updated = [newEntry, ...entries];
    setEntries(updated); localStorage.setItem(storageKey, JSON.stringify(updated));
    setAmount(''); setNote('');
  };

  const removeEntry = (id) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated); localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
      <p className="text-white font-bold mb-3">🤲 متتبع الصدقات</p>
      <div className="text-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/15 mb-4">
        <p className="text-3xl font-bold text-emerald-300">{total.toLocaleString()}</p>
        <p className="text-slate-400 text-xs mt-1">إجمالي الصدقات</p>
      </div>
      <div className="flex gap-2 mb-3">
        <input type="number" placeholder="المبلغ" value={amount} onChange={(e) => setAmount(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addEntry()}
          className="flex-1 bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder-slate-500" />
        <input type="text" placeholder="ملاحظة" value={note} onChange={(e) => setNote(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addEntry()}
          className="flex-1 bg-slate-800/60 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none placeholder-slate-500" />
        <motion.button whileTap={{ scale: 0.9 }} onClick={addEntry}
          className="px-4 rounded-xl bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">+ إضافة</motion.button>
      </div>
      <AnimatePresence>
        {entries.slice(0, 10).map((entry) => (
          <motion.div key={entry.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-emerald-300 font-bold text-sm">{entry.amount.toLocaleString()}</span>
              <span className="text-slate-500 text-xs">{entry.note}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-600 text-xs">{entry.date}</span>
              <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeEntry(entry.id)}
                className="w-6 h-6 rounded-md bg-red-500/10 text-red-400 text-xs flex items-center justify-center hover:bg-red-500/20">✕</motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
