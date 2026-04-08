import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import { useTranslation } from "react-i18next";

const PRAYERS = [
  { key: "Fajr", labelKey: "prayer_fajr", icon: "🌙" },
  { key: "Dhuhr", labelKey: "prayer_dhuhr", icon: "☀️" },
  { key: "Asr", labelKey: "prayer_asr", icon: "🌤️" },
  { key: "Maghrib", labelKey: "prayer_maghrib", icon: "🌇" },
  { key: "Isha", labelKey: "prayer_isha", icon: "🌃" },
];

function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 20));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display}</span>;
}

function GlobalNowStats() {
  const { t } = useTranslation("common");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nowTs, setNowTs] = useState(Date.now());

  const fetchStats = async () => {
    try {
      setLoading(true); setError("");
      const res = await api.get("/prayertimes/now/summary");
      setData(res.data); setLastUpdated(Date.now());
    } catch (err) {
      setError(err.response?.data?.message || t("error_generic"));
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStats();
    const intervalStats = setInterval(fetchStats, 60_000);
    const intervalTick = setInterval(() => setNowTs(Date.now()), 1000);
    return () => { clearInterval(intervalStats); clearInterval(intervalTick); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const seconds = lastUpdated ? Math.max(0, Math.floor((nowTs - lastUpdated) / 1000)) : 0;
  const lastUpdatedText = lastUpdated ? t("last_updated", { seconds }) : "";

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">{t("now_stats_title")}</h2>

      {loading && <div className="text-sm text-slate-500">{t("loading")}</div>}
      {error && <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-sm">{error}</div>}

      {!loading && data && (
        <>
          <p className="text-sm text-slate-400 mb-4">
            {t("now_stats_subtitle", { total: data.totalAny ?? 0 })}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {PRAYERS.map((p, i) => (
              <motion.div key={p.key} initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-4 text-center hover:bg-white/[0.07] transition-all">
                <div className="text-lg mb-1">{p.icon}</div>
                <div className="text-2xl font-bold text-indigo-400">
                  <AnimatedCounter value={data.perPrayer?.[p.key] ?? 0} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{t(p.labelKey)}</div>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{t("now_stats_footer", { minutes: data.windowMinutes ?? 10 })}</span>
            {lastUpdated && <span>{lastUpdatedText}</span>}
          </div>
        </>
      )}
    </motion.div>
  );
}

export default GlobalNowStats;
