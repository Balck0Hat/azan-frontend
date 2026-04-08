import { motion } from 'framer-motion';
import useRamadanState from './useRamadanState';
import RamadanHeader from './RamadanHeader';
import ImsakiaCard from './ImsakiaCard';
import FastingTracker from './FastingTracker';
import KhatmaGrid from './KhatmaGrid';
import VirtueOfDay from './VirtueOfDay';
import DuasSection from './DuasSection';
import LastTenNights from './LastTenNights';
import DailyPlanner from './DailyPlanner';
import TarawihTracker from './TarawihTracker';
import KhatmaCounter from './KhatmaCounter';
import ZakatCalculator from './ZakatCalculator';
import SadaqaTracker from './SadaqaTracker';
import FastingAdhkar from './FastingAdhkar';
import IftarReminder from './IftarReminder';
import MonthlyCalendar from './MonthlyCalendar';

export default function RamadanPage() {
  const state = useRamadanState();

  if (!state.isRamadan) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-3xl bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-[var(--border-color)] backdrop-blur-xl max-w-md w-full">
          <div className="text-6xl mb-4">🌙</div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">ليس شهر رمضان حالياً</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">ستتوفر هذه الصفحة عند دخول شهر رمضان المبارك إن شاء الله.<br/>نسأل الله أن يبلّغنا رمضان.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 space-y-4">
      <RamadanHeader ramadanDay={state.ramadanDay} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ImsakiaCard fajrTime={state.fajrTime} maghribTime={state.maghribTime} countdown={state.countdown} countdownTarget={state.countdownTarget} />
        <VirtueOfDay todayVirtue={state.todayVirtue} />
      </div>
      <FastingTracker fastingDays={state.fastingDays} toggleFasting={state.toggleFasting} ramadanDay={state.ramadanDay} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KhatmaGrid khatmaJuz={state.khatmaJuz} toggleKhatma={state.toggleKhatma} />
        <KhatmaCounter hijriYear={state.hijriYear} />
      </div>
      <LastTenNights ramadanDay={state.ramadanDay} />
      <DailyPlanner ramadanDay={state.ramadanDay} hijriYear={state.hijriYear} />
      <TarawihTracker ramadanDay={state.ramadanDay} hijriYear={state.hijriYear} />
      <DuasSection duaFilter={state.duaFilter} setDuaFilter={state.setDuaFilter} duaCategories={state.duaCategories} filteredDuas={state.filteredDuas} copiedDua={state.copiedDua} copyDua={state.copyDua} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ZakatCalculator />
        <SadaqaTracker hijriYear={state.hijriYear} />
      </div>
      <FastingAdhkar />
      <IftarReminder maghribTime={state.maghribTime} />
      <MonthlyCalendar ramadanDay={state.ramadanDay} />

      {/* Share Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-color)] text-center space-y-3">
        <p className="text-[var(--text-primary)] font-bold">📤 شارك تقدمك</p>
        <p className="text-[var(--text-secondary)] text-sm">شارك أصدقاءك تقدمك في رمضان وشجّعهم على المتابعة</p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={state.shareProgress}
          className={`px-6 py-2.5 rounded-xl font-medium text-sm transition-all ${state.shareCopied ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30'}`}>
          {state.shareCopied ? '✓ تم النسخ!' : '📋 نسخ ومشاركة'}
        </motion.button>
      </motion.div>
    </div>
  );
}
