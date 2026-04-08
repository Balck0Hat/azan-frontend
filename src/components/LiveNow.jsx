import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

const PRAYERS = [
  { key: "Fajr", label: "الفجر" },
  { key: "Dhuhr", label: "الظهر" },
  { key: "Asr", label: "العصر" },
  { key: "Maghrib", label: "المغرب" },
  { key: "Isha", label: "العِشاء" },
];

function LiveNow() {
  const [currentPrayer, setCurrentPrayer] = useState("Maghrib");
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchLive = async (prayerKey) => {
    try {
      setLoading(true); setError("");
      const res = await api.get("/prayertimes/now", { params: { prayer: prayerKey } });
      setCities(res.data.cities || []);
    } catch (err) {
      setError(err.response?.data?.message || "تعذّر جلب المدن التي يُؤذَّن فيها الآن.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLive(currentPrayer); }, [currentPrayer]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 shadow-lg relative overflow-hidden">
      {/* Live pulse indicator */}
      <div className="flex items-center gap-3 mb-5">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
        </span>
        <h2 className="text-xl font-bold text-white">الآن يُؤذَّن في...</h2>
      </div>

      {/* Prayer tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {PRAYERS.map((p) => (
          <button key={p.key} onClick={() => setCurrentPrayer(p.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              currentPrayer === p.key
                ? "bg-gradient-to-l from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25"
                : "bg-white/[0.05] text-slate-400 hover:bg-white/[0.1] hover:text-white border border-white/[0.06]"
            }`}>{p.label}</button>
        ))}
      </div>

      {/* Stats bar */}
      {cities.length > 0 && (
        <div className="flex gap-3 mb-4">
          <div className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-center">
            <div className="text-2xl font-bold text-indigo-400">{cities.length}</div>
            <div className="text-xs text-slate-400 mt-0.5">مدينة</div>
          </div>
        </div>
      )}

      <div className="relative min-h-[120px]">
        {cities.length === 0 && !loading && !error && (
          <div className="text-sm text-slate-500 text-center py-8">لا توجد بيانات جاهزة بعد لهذه الصلاة.</div>
        )}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-sm">{error}</div>
        )}

        {cities.length > 0 && (
          <div className="max-h-[300px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/10">
            <AnimatePresence>
              {cities.map((city, i) => (
                <motion.div key={city._id || `${city.cityName}-${city.country}`}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.07] border border-transparent hover:border-white/10 transition-all">
                  <span className="text-sm font-medium text-slate-300">{city.cityName} – {city.country}</span>
                  <span className="text-sm font-semibold text-white font-mono">{city.timeLocal || city.timeUtc || "--:--"}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm rounded-xl">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default LiveNow;
