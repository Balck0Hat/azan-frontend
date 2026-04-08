import { motion, AnimatePresence } from 'framer-motion';

export default function TasbeehTapArea({ selectedPreset, count, target, showCompleted, onTap }) {
  const progress = (count / target) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div whileTap={{ scale: 0.96 }} onClick={onTap}
      className="relative flex items-center justify-center cursor-pointer select-none mx-auto"
      style={{ width: 260, height: 260 }}>
      {/* Progress Ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
        <motion.circle cx="50" cy="50" r="45" fill="none"
          stroke="url(#grad)" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circumference} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.3 }} />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glass Circle */}
      <div className="absolute w-[200px] h-[200px] rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className="text-slate-300 text-sm">{selectedPreset.text}</span>
        <motion.span key={count} initial={{ scale: 1.3, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold text-white">{count}</motion.span>
        <span className="text-slate-500 text-sm">/ {target}</span>
      </div>

      {/* Completed overlay */}
      <AnimatePresence>
        {showCompleted && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-emerald-500/10 backdrop-blur-sm border-2 border-emerald-500/30">
            <span className="text-4xl">🎉</span>
            <span className="text-emerald-300 font-bold text-lg mt-1">أحسنت!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
