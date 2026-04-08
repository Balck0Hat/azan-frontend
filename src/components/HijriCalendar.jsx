import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HIJRI_MONTHS = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
const WEEKDAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

const ISLAMIC_EVENTS = {
  '1-1': { name: 'رأس السنة الهجرية', icon: '🌙' }, '1-10': { name: 'يوم عاشوراء', icon: '📿' },
  '3-12': { name: 'المولد النبوي', icon: '🌟' }, '7-27': { name: 'ليلة الإسراء والمعراج', icon: '✨' },
  '8-15': { name: 'ليلة النصف من شعبان', icon: '🌕' }, '9-1': { name: 'بداية رمضان', icon: '🌙' },
  '9-27': { name: 'ليلة القدر (تُحرّى)', icon: '⭐' }, '10-1': { name: 'عيد الفطر', icon: '🎉' },
  '12-9': { name: 'يوم عرفة', icon: '🕋' }, '12-10': { name: 'عيد الأضحى', icon: '🐑' },
};

function toHijri(date) {
  const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

export default function HijriCalendar() {
  const [hijriDate, setHijriDate] = useState(null);
  const [todayEvent, setTodayEvent] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const now = new Date(); const hijri = toHijri(now); setHijriDate(hijri);
    const todayKey = `${hijri.month}-${hijri.day}`;
    if (ISLAMIC_EVENTS[todayKey]) setTodayEvent(ISLAMIC_EVENTS[todayKey]);
    const upcoming = [];
    for (let i = 1; i <= 30; i++) {
      const futureDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const futureHijri = toHijri(futureDate);
      const key = `${futureHijri.month}-${futureHijri.day}`;
      if (ISLAMIC_EVENTS[key]) { upcoming.push({ ...ISLAMIC_EVENTS[key], daysLeft: i, date: futureHijri }); if (upcoming.length >= 3) break; }
    }
    setUpcomingEvents(upcoming);
  }, []);

  if (!hijriDate) return null;
  const weekday = WEEKDAYS[new Date().getDay()];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 backdrop-blur-sm">
      {/* Main Date */}
      <div className="p-5 bg-gradient-to-br from-indigo-600/15 to-purple-600/10">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}
              className="text-5xl font-bold text-white">{hijriDate.day}</motion.span>
            <div>
              <p className="text-indigo-300 font-bold text-lg">{HIJRI_MONTHS[hijriDate.month - 1]}</p>
              <p className="text-slate-500 text-sm">{hijriDate.year} هـ</p>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10">
            <p className="text-slate-300 text-sm font-medium">{weekday}</p>
          </div>
        </div>
      </div>

      {/* Today Event */}
      {todayEvent && (
        <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-l from-amber-500/15 to-indigo-500/10 border border-amber-500/20 flex items-center gap-3">
          <span className="text-2xl">{todayEvent.icon}</span>
          <span className="text-white font-medium flex-1">{todayEvent.name}</span>
          <span className="text-xs text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/25">اليوم</span>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="p-4 space-y-2">
          <p className="text-slate-400 text-sm font-medium mb-2">📅 مناسبات قادمة</p>
          {upcomingEvents.map((event, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-lg">{event.icon}</span>
              <span className="text-slate-200 text-sm flex-1">{event.name}</span>
              <span className="text-indigo-300 text-xs font-medium px-2 py-0.5 rounded-md bg-indigo-500/10">بعد {event.daysLeft} يوم</span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
