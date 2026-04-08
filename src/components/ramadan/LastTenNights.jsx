import { motion } from 'framer-motion';

export default function LastTenNights({ ramadanDay }) {
  if (ramadanDay < 21) return null;

  const oddNights = [21, 23, 25, 27, 29];
  const isOddNight = oddNights.includes(ramadanDay);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/15 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent rounded-2xl animate-pulse" />
      <div className="relative z-10">
        <p className="text-[var(--text-primary)] font-bold text-center text-lg mb-2">🌟 العشر الأواخر من رمضان</p>
        <p className="text-center text-[var(--text-primary)] mb-2">
          {isOddNight ? 'الليلة ليلة وترية — قد تكون ليلة القدر!' : `الليلة ليلة ${ramadanDay} — اجتهد في العبادة`}
        </p>
        <p className="text-center text-amber-200/80 text-lg my-4">اللهم إنك عفو كريم تحب العفو فاعف عني</p>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-3">
          {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((night) => (
            <motion.div key={night} whileHover={{ scale: 1.1 }}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                night === ramadanDay ? 'bg-amber-500/25 text-amber-300 border-2 border-amber-400/40 ring-2 ring-amber-400/20' :
                night < ramadanDay ? 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]' :
                oddNights.includes(night) ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' :
                'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]'
              }`}>
              <span>{night}</span>
              {oddNights.includes(night) && <span className="text-amber-400 text-[10px]">✦</span>}
            </motion.div>
          ))}
        </div>
        <p className="text-center text-[var(--text-muted)] text-xs">✦ الليالي الوترية — يُرجى فيها ليلة القدر</p>
      </div>
    </motion.div>
  );
}
