import { motion } from "framer-motion";

const PRAYER_LABELS = {
    Fajr: { ar: "الفجر", en: "Fajr", icon: "🌙" },
    Sunrise: { ar: "الشروق", en: "Sunrise", icon: "🌅" },
    Dhuhr: { ar: "الظهر", en: "Dhuhr", icon: "☀️" },
    Asr: { ar: "العصر", en: "Asr", icon: "🌤" },
    Maghrib: { ar: "المغرب", en: "Maghrib", icon: "🌇" },
    Isha: { ar: "العشاء", en: "Isha", icon: "🌙" },
};

export default function LocalCityPrayerGrid({ mainPrayers, times }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mainPrayers.map((key, i) => {
                const time = times[key];
                const labels = PRAYER_LABELS[key] || { ar: key, en: key, icon: "🕰" };
                return (
                    <motion.div
                        key={key}
                        className="group relative rounded-xl p-3 cursor-default transition-all duration-300"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                        whileHover={{
                            y: -2,
                            boxShadow: '0 8px 25px rgba(99,102,241,0.12)',
                        }}
                    >
                        <div
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                            }}
                        />
                        <div className="relative flex items-center justify-between mb-2">
                            <span className="text-lg">{labels.icon}</span>
                            <span
                                className="text-base font-bold tabular-nums"
                                style={{ color: '#e2e8f0' }}
                            >
                                {time}
                            </span>
                        </div>
                        <div className="relative">
                            <div className="text-sm font-semibold" style={{ color: '#cbd5e1' }}>
                                {labels.ar}
                            </div>
                            <div className="text-xs" style={{ color: '#64748b' }}>
                                {labels.en}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
