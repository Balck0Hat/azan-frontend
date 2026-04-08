import { useState } from 'react';
import { motion } from 'framer-motion';
import { zakatFitrRates } from '../../data/ramadanData';

export default function ZakatCalculator() {
  const [country, setCountry] = useState('الأردن');
  const [members, setMembers] = useState(1);

  const rate = zakatFitrRates.find((r) => r.country === country) || zakatFitrRates[0];
  const total = rate.amount * members;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-sm">
      <p className="text-[var(--text-primary)] font-bold mb-4">💰 حاسبة زكاة الفطر</p>
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-[var(--text-secondary)] text-xs block mb-1">البلد</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-[var(--text-primary)] text-sm outline-none">
            {zakatFitrRates.map((r) => (<option key={r.country} value={r.country}>{r.country}</option>))}
          </select>
        </div>
        <div>
          <label className="text-[var(--text-secondary)] text-xs block mb-1">عدد الأفراد</label>
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMembers((m) => Math.max(1, m - 1))}
              className="w-10 h-10 rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">−</motion.button>
            <span className="text-[var(--text-primary)] font-bold text-lg flex-1 text-center">{members}</span>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMembers((m) => m + 1)}
              className="w-10 h-10 rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] font-bold border border-[var(--border-color)]">+</motion.button>
          </div>
        </div>
      </div>
      <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border border-emerald-500/15 text-center">
        <motion.p key={total} initial={{ scale: 1.1 }} animate={{ scale: 1 }}
          className="text-3xl font-bold text-emerald-300">{total.toLocaleString()} <span className="text-lg text-emerald-400/70">{rate.currency}</span></motion.p>
        <p className="text-[var(--text-secondary)] text-xs mt-2">بمقدار صاع من {rate.unit} للفرد الواحد</p>
        <p className="text-[var(--text-muted)] text-xs mt-1">تُخرج قبل صلاة العيد — ويجوز إخراجها من أول رمضان</p>
      </div>
    </motion.div>
  );
}
