import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api";
import "../../styles/LocalCityCard.css";
import LocalCityPrayerGrid from "./LocalCityPrayerGrid";
import LocalCityExtraPrayers from "./LocalCityExtraPrayers";

const MAIN_PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

function LocalCityCard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchLocal = async () => {
            try {
                const res = await api.get("/prayertimes/local/today");
                setData(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchLocal();
    }, []);

    const times = data?.times || {};
    const mainPrayers = MAIN_PRAYERS.filter((p) => times[p]);
    const extraPrayers = Object.entries(times).filter(
        ([name]) => !MAIN_PRAYERS.includes(name)
    );

    return (
        <motion.div
            className="card home-card city-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Header */}
            <div className="flex flex-col gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">📍</span>
                        <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>
                            مدينتك الآن
                        </span>
                    </div>
                    {data && (
                        <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
                                color: '#a5b4fc',
                                border: '1px solid rgba(99,102,241,0.2)',
                            }}
                        >
                            {data.city} – {data.country}
                        </span>
                    )}
                </div>

                {data && (
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#64748b' }}>
                        <span>🕒</span>
                        <span>المنطقة الزمنية: {data.timezone}</span>
                    </div>
                )}

                {data?.city && (
                    <h3
                        className="text-xl font-bold"
                        style={{
                            background: 'linear-gradient(135deg, #e2e8f0, #a5b4fc)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        {data.city}
                    </h3>
                )}
            </div>

            {!data ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-20 rounded-xl animate-pulse"
                            style={{ background: 'rgba(255,255,255,0.04)' }}
                        />
                    ))}
                </div>
            ) : (
                <>
                    <LocalCityPrayerGrid mainPrayers={mainPrayers} times={times} />
                    {extraPrayers.length > 0 && (
                        <LocalCityExtraPrayers extraPrayers={extraPrayers} />
                    )}
                </>
            )}
        </motion.div>
    );
}

export default LocalCityCard;
