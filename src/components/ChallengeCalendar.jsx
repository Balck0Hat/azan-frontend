import { motion } from 'framer-motion';
import { CHALLENGE_PRAYERS } from '../data/challengeData';

export default function ChallengeCalendar({ challengeData, today }) {
  return (
    <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-[var(--border-color)]">
      <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
        {Array.from({ length: 40 }, (_, i) => {
          const dayNum = i + 1;
          const startDate = new Date(challengeData.startDate);
          const dayDate = new Date(startDate);
          dayDate.setDate(startDate.getDate() + i);
          const dateStr = dayDate.toISOString().split('T')[0];
          const dayData = challengeData.days[dateStr] || {};
          const isComplete = CHALLENGE_PRAYERS.every(p => dayData[p]);
          const isToday = dateStr === today;
          const isPast = dayDate < new Date() && !isToday;

          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all ${
                isComplete ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                isToday ? 'bg-indigo-500/20 text-indigo-300 border-2 border-indigo-500/40 ring-1 ring-indigo-500/20' :
                isPast ? 'bg-red-500/10 text-red-400/60 border border-red-500/20' :
                'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)]'
              }`}>
              <span>{dayNum}</span>
              {isComplete && <span className="text-[8px]">✓</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
