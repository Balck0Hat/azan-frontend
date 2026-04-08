import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";

const FLAG_MAP = {
  Jordan: "🇯🇴", Turkey: "🇹🇷", "Saudi Arabia": "🇸🇦", Egypt: "🇪🇬",
  Iraq: "🇮🇶", Morocco: "🇲🇦", Algeria: "🇩🇿", Tunisia: "🇹🇳",
  UAE: "🇦🇪", Kuwait: "🇰🇼", Qatar: "🇶🇦", Bahrain: "🇧🇭",
  Oman: "🇴🇲", Yemen: "🇾🇪", Libya: "🇱🇾", Sudan: "🇸🇩",
  Palestine: "🇵🇸", Lebanon: "🇱🇧", Syria: "🇸🇾", Pakistan: "🇵🇰",
  Indonesia: "🇮🇩", Malaysia: "🇲🇾", Bangladesh: "🇧🇩", India: "🇮🇳",
  Iran: "🇮🇷", Afghanistan: "🇦🇫", Nigeria: "🇳🇬", Somalia: "🇸🇴",
};

function CountriesNow() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const groupByCountry = (cities) => {
    const map = {};
    cities.forEach((item) => {
      const country = item.country || "Unknown";
      if (!map[country]) map[country] = { country, countryCode: item.countryCode || "", countCities: 0, sampleCities: [] };
      map[country].countCities += 1;
      if (map[country].sampleCities.length < 3) map[country].sampleCities.push(item.city);
    });
    return Object.values(map);
  };

  const fetchCountries = async () => {
    try {
      setLoading(true); setError("");
      const res = await api.get("/prayertimes/now", { params: { prayer: "Maghrib" } });
      setCountries(groupByCountry(res.data.cities || []));
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء جلب بيانات الدول.");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchCountries(); }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">الدول التي يُؤذَّن فيها الآن</h2>
        {loading && <div className="w-5 h-5 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />}
      </div>

      {error && <div className="rounded-xl bg-[var(--status-error)]/10 border border-[var(--status-error)]/20 p-3 text-[var(--status-error)] text-sm mb-4">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {countries.slice(0, 10).map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4 hover:bg-[var(--bg-hover)] hover:border-[var(--border-color)] hover:scale-[1.02] transition-all cursor-default group">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{FLAG_MAP[item.country] || "🏳️"}</span>
              <div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">{item.country}</div>
                {item.countCities > 1 && (
                  <div className="text-xs text-indigo-400">{item.countCities} مدن</div>
                )}
              </div>
            </div>
            <div className="text-xs text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors">
              {item.sampleCities.join("، ")}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default CountriesNow;
