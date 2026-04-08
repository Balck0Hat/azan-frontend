import { motion, AnimatePresence } from 'framer-motion';
import { BADGES } from '../data/achievementsData';
import useAchievements from '../hooks/useAchievements';

export default function Achievements() {
  const { points, unlockedBadges, showNewBadge, currentLevel, nextLevel, progressToNext } = useAchievements();

  return (
    <div className="min-h-screen p-3 sm:p-4 space-y-4">
      {/* New Badge Popup */}
      <AnimatePresence>
        {showNewBadge && (
          <motion.div initial={{ opacity: 0, y: -50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }} transition={{ type: 'spring', damping: 15 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-l from-amber-500/20 to-indigo-500/20 border border-amber-500/30 backdrop-blur-xl shadow-2xl shadow-amber-500/10">
            <span className="text-3xl">{showNewBadge.icon}</span>
            <div>
              <p className="text-amber-300 text-xs font-medium">شارة جديدة!</p>
              <p className="text-white font-bold">{showNewBadge.name}</p>
            </div>
            <span className="text-emerald-300 font-bold text-sm mr-2">+{showNewBadge.points}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Card */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currentLevel.icon}</span>
            <div>
              <p className="text-white font-bold text-lg">{currentLevel.name}</p>
              <p className="text-slate-400 text-sm">المستوى {currentLevel.level}</p>
            </div>
          </div>
          <div className="text-left">
            <motion.p key={points} initial={{ scale: 1.2 }} animate={{ scale: 1 }}
              className="text-3xl font-bold text-indigo-300">{points}</motion.p>
            <p className="text-slate-500 text-xs">نقطة</p>
          </div>
        </div>
        {nextLevel && (
          <div className="space-y-2">
            <div className="h-3 rounded-full bg-slate-800/60 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-l from-indigo-400 to-purple-500" />
            </div>
            <p className="text-slate-500 text-xs text-center">{nextLevel.minPoints - points} نقطة للمستوى التالي</p>
          </div>
        )}
      </motion.div>

      {/* Badges Grid */}
      <div>
        <h4 className="text-white font-bold text-lg mb-3 px-1">🏆 الشارات</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {BADGES.map((badge, i) => {
            const unlocked = unlockedBadges.includes(badge.id);
            return (
              <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                whileHover={{ scale: unlocked ? 1.05 : 1 }} title={badge.desc}
                className={`relative flex flex-col items-center p-4 rounded-2xl border transition-all ${
                  unlocked
                    ? 'bg-gradient-to-br from-amber-500/10 to-indigo-500/10 border-amber-500/20 shadow-lg shadow-amber-500/5'
                    : 'bg-white/[0.02] border-white/5 opacity-40 grayscale'
                }`}>
                <span className={`text-3xl mb-2 ${unlocked ? '' : 'blur-[1px]'}`}>{badge.icon}</span>
                <span className={`text-xs font-medium text-center ${unlocked ? 'text-white' : 'text-slate-600'}`}>{badge.name}</span>
                {!unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl opacity-60">🔒</span>
                  </div>
                )}
                {unlocked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-emerald-300 text-[10px]">✓</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
