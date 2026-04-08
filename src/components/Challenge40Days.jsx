import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHALLENGE_PRAYERS, PRAYER_NAMES, PRAYER_ICONS } from '../data/challengeData';
import ChallengeCalendar from './ChallengeCalendar';

export default function Challenge40Days() {
  const [challengeData, setChallengeData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('challenge40');
    if (saved) setChallengeData(JSON.parse(saved));
  }, []);

  const startChallenge = () => {
    const d = { startDate: new Date().toISOString(), days: {}, currentStreak: 0, completed: false };
    localStorage.setItem('challenge40', JSON.stringify(d)); setChallengeData(d);
  };

  const markPrayer = (prayer) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...challengeData };
    if (!updated.days[today]) updated.days[today] = {};
    updated.days[today][prayer] = !updated.days[today][prayer];
    const allPrayed = CHALLENGE_PRAYERS.every(p => updated.days[today][p]);
    if (allPrayed) {
      updated.currentStreak = Object.keys(updated.days).filter(date => CHALLENGE_PRAYERS.every(p => updated.days[date]?.[p])).length;
    }
    if (updated.currentStreak >= 40) updated.completed = true;
    localStorage.setItem('challenge40', JSON.stringify(updated)); setChallengeData(updated);
  };

  const resetChallenge = () => { localStorage.removeItem('challenge40'); setChallengeData(null); };
  const getCompleteDays = () => !challengeData ? 0 : Object.keys(challengeData.days).filter(d => CHALLENGE_PRAYERS.every(p => challengeData.days[d]?.[p])).length;

  const today = new Date().toISOString().split('T')[0];
  const todayPrayers = challengeData?.days[today] || {};

  if (!challengeData) return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center p-8 rounded-3xl bg-gradient-to-br from-indigo-600/15 to-purple-600/15 border border-white/5 backdrop-blur-xl">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-bold text-white mb-3">تحدي الـ 40 يوم</h3>
        <p className="text-slate-300 leading-relaxed text-sm mb-4">قال النبي ﷺ: "من صلى أربعين يوماً في جماعة يدرك التكبيرة الأولى كتبت له براءتان: براءة من النار، وبراءة من النفاق"</p>
        <div className="space-y-2 mb-6 text-right">
          {['تعزيز الالتزام بالصلاة', 'بناء عادة يومية', 'تتبع تقدمك', 'شارة خاصة عند الإكمال'].map((t, i) => (
            <p key={i} className="text-emerald-400/80 text-sm">✅ {t}</p>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={startChallenge}
          className="w-full py-3 rounded-xl bg-gradient-to-l from-indigo-500 to-purple-500 text-white font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-shadow">
          ابدأ التحدي الآن 🚀</motion.button>
      </motion.div>
    </div>
  );

  if (challengeData.completed) return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center p-8 rounded-3xl bg-gradient-to-br from-amber-600/15 to-indigo-600/15 border border-amber-500/10 backdrop-blur-xl">
        <motion.div initial={{ rotate: -10, scale: 0 }} animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 10 }} className="text-7xl mb-4">🏆</motion.div>
        <h3 className="text-xl font-bold text-white mb-2">مبروك! أكملت التحدي</h3>
        <p className="text-slate-400 mb-4">لقد أتممت صلاة 40 يوماً كاملاً</p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/25 mb-6">
          <span className="text-2xl">👑</span><span className="text-amber-300 font-bold">بطل الأربعين</span>
        </div><br/>
        <motion.button whileTap={{ scale: 0.95 }} onClick={resetChallenge}
          className="px-6 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30">ابدأ تحدي جديد</motion.button>
      </motion.div>
    </div>
  );

  const completeDays = getCompleteDays();
  const pct = Math.round((completeDays / 40) * 100);

  return (
    <div className="min-h-screen p-3 sm:p-4 space-y-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">🎯 تحدي الـ 40 يوم</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-indigo-300">{completeDays}</span>
            <span className="text-slate-500 text-sm">/ 40 يوم</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 rounded-full bg-slate-800/60 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
              className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-indigo-500" />
          </div>
          <p className="text-slate-500 text-xs text-left">{pct}%</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 bg-white/[0.04] border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-bold">صلوات اليوم</span>
          <span className="text-indigo-300 font-bold text-sm">{CHALLENGE_PRAYERS.filter(p => todayPrayers[p]).length}/5</span>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {CHALLENGE_PRAYERS.map(prayer => (
            <motion.button key={prayer} whileTap={{ scale: 0.9 }} onClick={() => markPrayer(prayer)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                todayPrayers[prayer]
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  : 'bg-white/[0.03] border border-white/5 text-slate-400 hover:bg-white/[0.06]'
              }`}>
              <span className="text-xl">{PRAYER_ICONS[prayer]}</span>
              <span className="text-xs font-medium">{PRAYER_NAMES[prayer]}</span>
              {todayPrayers[prayer] && <span className="text-emerald-400 text-xs">✓</span>}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowDetails(!showDetails)}
        className="w-full py-3 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 font-medium text-sm hover:bg-white/[0.07] transition-colors">
        {showDetails ? 'إخفاء التفاصيل ▲' : 'عرض التفاصيل ▼'}</motion.button>

      <AnimatePresence>
        {showDetails && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <ChallengeCalendar challengeData={challengeData} today={today} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button whileTap={{ scale: 0.95 }} onClick={resetChallenge}
        className="w-full py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors">
        إعادة تعيين</motion.button>
    </div>
  );
}
