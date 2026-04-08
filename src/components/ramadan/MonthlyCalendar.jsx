import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RAMADAN_START = new Date(2026, 1, 19);

export default function MonthlyCalendar({ ramadanDay }) {
  const [times, setTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await fetch('/api/prayertimes/local/today');
        const data = await res.json();
        if (data && data.city) {
          const calendar = [];
          for (let i = 0; i < 30; i++) {
            const date = new Date(RAMADAN_START);
            date.setDate(date.getDate() + i);
            calendar.push({
              day: i + 1, date: date.toISOString().split('T')[0],
              dateAr: date.toLocaleDateString('ar-EG', { weekday: 'short', day: 'numeric', month: 'short' }),
              fajr: data.times?.Fajr || '--:--', maghrib: data.times?.Maghrib || '--:--',
            });
          }
          setTimes(calendar);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchTimes();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl p-5 bg-white/[0.04] border border-white/10">
        <p className="text-white font-bold mb-3">📅 إمساكية الشهر</p>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-white/[0.04] border border-white/10 backdrop-blur-sm">
      <p className="text-white font-bold mb-4">📅 إمساكية رمضان كاملة</p>
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-2 px-3 text-slate-400 font-medium text-right">اليوم</th>
              <th className="py-2 px-3 text-slate-400 font-medium text-right">التاريخ</th>
              <th className="py-2 px-3 text-slate-400 font-medium text-right">الإمساك</th>
              <th className="py-2 px-3 text-slate-400 font-medium text-right">الإفطار</th>
            </tr>
          </thead>
          <tbody>
            {times.map((row) => (
              <tr key={row.day} className={`border-b border-white/5 transition-colors ${
                row.day === ramadanDay ? 'bg-indigo-500/10' : 'hover:bg-white/[0.02]'}`}>
                <td className={`py-2.5 px-3 font-bold ${row.day === ramadanDay ? 'text-indigo-300' : 'text-slate-300'}`}>{row.day}</td>
                <td className="py-2.5 px-3 text-slate-400">{row.dateAr}</td>
                <td className="py-2.5 px-3 text-amber-300/80 font-mono">{row.fajr}</td>
                <td className="py-2.5 px-3 text-emerald-300/80 font-mono">{row.maghrib}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-slate-600 text-xs mt-3 text-center">* الأوقات تقريبية حسب موقعك — قد تختلف بدقائق</p>
    </motion.div>
  );
}
