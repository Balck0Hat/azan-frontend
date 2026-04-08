import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:4000";

const ORDER = ["Fajr","Sunrise","Dhuhr","Asr","Maghrib","Isha","Imsak","Midnight","Lastthird"];
const LABELS = {
  Fajr:"الفجر", Sunrise:"الشروق", Dhuhr:"الظهر", Asr:"العصر",
  Maghrib:"المغرب", Isha:"العشاء", Imsak:"الإمساك",
  Midnight:"منتصف الليل", Lastthird:"ثلث الليل الأخير",
};
const ICONS = {
  Fajr:"🌙", Sunrise:"🌅", Dhuhr:"☀️", Asr:"🌤️",
  Maghrib:"🌇", Isha:"🌃", Imsak:"⏰", Midnight:"🕛", Lastthird:"🌌",
};

function CityPrayerTimes() {
  const [city, setCity] = useState("Amman");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await axios.get(`${API_BASE}/api/prayertimes/today`, { params: { city } });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "تعذّر جلب أوقات الصلاة لهذه المدينة. جرّب اسمًا آخر بالإنجليزي.");
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-5">أوقات الصلاة لمدينة معيّنة</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-sm text-[var(--text-secondary)] mb-1.5">اسم المدينة (بالإنجليزي حاليًا)</label>
          <input value={city} onChange={(e) => setCity(e.target.value)}
            placeholder="مثال: Amman, Istanbul, Riyadh"
            className="w-full rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 focus:border-[var(--accent-primary)]/50 transition-all" />
        </div>
        <button type="submit" disabled={loading || !city.trim()}
          className="w-full rounded-xl bg-gradient-to-l from-indigo-500 to-purple-500 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100">
          {loading ? "جارِ تحميل الأوقات..." : "عرض الأوقات"}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-4 rounded-xl bg-[var(--status-error)]/10 border border-[var(--status-error)]/20 p-3 text-[var(--status-error)] text-sm">{error}</motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-5 space-y-4">
            <div className="text-center pb-3 border-b border-[var(--border-color)]">
              <div className="text-lg font-bold text-[var(--text-primary)]">{result.cityName} – {result.country}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                المنطقة الزمنية: {result.timezone}
                {result.date && <> {" • "}تاريخ اليوم: {new Date(result.date).toISOString().slice(0, 10)}</>}
              </div>
            </div>
            <div className="space-y-1.5">
              {ORDER.map((key, i) => (
                <motion.div key={key} initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-color)] transition-all cursor-default group">
                  <div className="flex items-center gap-3">
                    <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">{ICONS[key]}</span>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">{LABELS[key]}</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--text-primary)] font-mono tracking-wider">{result.timings[key]}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default CityPrayerTimes;
