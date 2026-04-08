import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function IftarReminder({ maghribTime }) {
  const [permission, setPermission] = useState('default');
  const [reminderSet, setReminderSet] = useState(false);
  const [minutesBefore, setMinutesBefore] = useState(15);

  useEffect(() => { if ('Notification' in window) setPermission(Notification.permission); }, []);

  const requestPermission = async () => {
    if ('Notification' in window) { const result = await Notification.requestPermission(); setPermission(result); }
  };

  useEffect(() => {
    if (!maghribTime || permission !== 'granted' || !reminderSet) return;
    const [h, m] = maghribTime.split(':').map(Number);
    const now = new Date(); const maghrib = new Date(); maghrib.setHours(h, m, 0, 0);
    const reminderTime = new Date(maghrib.getTime() - minutesBefore * 60 * 1000);
    const diff = reminderTime - now;
    if (diff <= 0) return;
    const timer = setTimeout(() => {
      new Notification('وقت الدعاء قبل الإفطار 🤲', {
        body: `باقي ${minutesBefore} دقيقة على الإفطار — ادعُ الله فإن للصائم دعوة لا تُرد`,
        icon: '/favicon.ico',
      });
    }, diff);
    return () => clearTimeout(timer);
  }, [maghribTime, permission, reminderSet, minutesBefore]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-sm">
      <p className="text-[var(--text-primary)] font-bold mb-4">🔔 تذكير الدعاء قبل الإفطار</p>
      {permission !== 'granted' ? (
        <div className="text-center space-y-3">
          <p className="text-[var(--text-secondary)] text-sm">فعّل الإشعارات لتلقي تذكير قبل الإفطار</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={requestPermission}
            className="px-5 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 font-medium text-sm border border-indigo-500/30 hover:bg-indigo-500/30 transition-colors">
            🔔 تفعيل الإشعارات</motion.button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[var(--text-primary)] text-sm">ذكّرني قبل الإفطار بـ</label>
            <div className="flex items-center gap-2">
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMinutesBefore((m) => Math.max(5, m - 5))}
                className="w-8 h-8 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm border border-[var(--border-color)]">−</motion.button>
              <span className="text-indigo-300 font-bold text-sm w-20 text-center">{minutesBefore} دقيقة</span>
              <motion.button whileTap={{ scale: 0.85 }} onClick={() => setMinutesBefore((m) => Math.min(60, m + 5))}
                className="w-8 h-8 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] text-sm border border-[var(--border-color)]">+</motion.button>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setReminderSet(!reminderSet)}
            className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all ${
              reminderSet ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'}`}>
            {reminderSet ? '✓ التذكير مفعّل' : 'تفعيل التذكير'}</motion.button>
          {reminderSet && maghribTime && (
            <p className="text-[var(--text-muted)] text-xs text-center">سيصلك تذكير قبل أذان المغرب ({maghribTime}) بـ {minutesBefore} دقيقة</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
