import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api';

const PRAYER_ICONS = { Fajr: "🌙", Dhuhr: "☀️", Asr: "🌤️", Maghrib: "🌅", Isha: "🌃" };
const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export default function FavoriteCities() {
  const [favorites, setFavorites] = useState([]);
  const [prayerData, setPrayerData] = useState({});
  const [newCity, setNewCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('favoriteCities');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      const data = {};
      for (const city of favorites) {
        try { const res = await api.get(`/prayertimes/today?city=${city}`); data[city] = res.data; }
        catch (err) { console.error(`فشل جلب أوقات ${city}:`, err); }
      }
      setPrayerData(data);
    };
    if (favorites.length > 0) fetchPrayerTimes();
  }, [favorites]);

  const saveFavorites = (newFavs) => { setFavorites(newFavs); localStorage.setItem('favoriteCities', JSON.stringify(newFavs)); };

  const addCity = async () => {
    if (!newCity.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/prayertimes/today?city=${newCity}`);
      if (res.data) {
        const cityName = res.data.cityName;
        if (!favorites.includes(cityName)) { saveFavorites([...favorites, cityName]); setPrayerData({ ...prayerData, [cityName]: res.data }); }
        setNewCity('');
      }
    } catch { toast.error('لم نجد هذه المدينة'); }
    finally { setLoading(false); }
  };

  const removeCity = (city) => {
    saveFavorites(favorites.filter(c => c !== city));
    const nd = { ...prayerData }; delete nd[city]; setPrayerData(nd);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-5">المدن المفضلة</h3>

      <div className="flex gap-2 mb-5">
        <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)}
          placeholder="اسم المدينة (بالإنجليزية)..." onKeyDown={(e) => e.key === 'Enter' && addCity()}
          className="flex-1 rounded-xl bg-[var(--bg-input)] border border-[var(--border-color)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all" />
        <button onClick={addCity} disabled={loading}
          className="shrink-0 rounded-xl bg-gradient-to-l from-indigo-500 to-purple-500 w-10 h-10 flex items-center justify-center text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
          {loading ? '...' : '+'}
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-8 text-sm text-[var(--text-muted)]">لم تضف أي مدن بعد</div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {favorites.map((city) => {
              const data = prayerData[city];
              return (
                <motion.div key={city} layout initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, x: 50 }}
                  className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4 hover:bg-[var(--bg-hover)] transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <motion.span whileTap={{ scale: 1.3, rotate: 72 }}
                        className="text-[var(--status-warning)] cursor-pointer">&#x2B50;</motion.span>
                      <span className="font-semibold text-[var(--text-primary)]">{city}</span>
                      {data && <span className="text-xs text-[var(--text-muted)]">{data.country}</span>}
                    </div>
                    <button onClick={() => removeCity(city)}
                      className="w-7 h-7 rounded-lg bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--status-error)]/20 hover:text-[var(--status-error)] transition-all flex items-center justify-center text-xs">
                      &#x2715;
                    </button>
                  </div>
                  {data && (
                    <div className="flex flex-wrap gap-2">
                      {PRAYER_KEYS.map((k) => (
                        <div key={k} className="flex items-center gap-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] px-2.5 py-1 text-xs">
                          <span>{PRAYER_ICONS[k]}</span>
                          <span className="text-[var(--text-secondary)] font-mono">{data.timings?.[k] || '--'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
