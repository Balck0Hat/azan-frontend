const PRAYER_LABELS = {
    Imsak: { ar: "الإمساك", en: "Imsak", icon: "⭐" },
    Midnight: { ar: "منتصف الليل", en: "Midnight", icon: "🌙" },
    "Last third": { ar: "ثلث الليل الأخير", en: "Last third", icon: "⭐" },
    Lastthird: { ar: "ثلث الليل الأخير", en: "Last third", icon: "⭐" },
};

export default function LocalCityExtraPrayers({ extraPrayers }) {
    return (
        <div className="mt-5">
            <div
                className="text-xs font-medium mb-3 px-1"
                style={{ color: 'var(--text-muted)' }}
            >
                أوقات إضافية
            </div>
            <div className="flex flex-col gap-2">
                {extraPrayers.map(([name, time]) => {
                    const labels = PRAYER_LABELS[name] || { ar: name, en: name, icon: "⭐" };
                    return (
                        <div
                            key={name}
                            className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors duration-200"
                            style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-color)',
                            }}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-sm">{labels.icon}</span>
                                <div>
                                    <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{labels.ar}</div>
                                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{labels.en}</div>
                                </div>
                            </div>
                            <span
                                className="text-sm font-semibold tabular-nums"
                                style={{ color: 'var(--text-primary)' }}
                            >
                                {time}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
