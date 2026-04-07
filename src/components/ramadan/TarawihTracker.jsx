import { useState } from "react";

export default function TarawihTracker({ ramadanDay, hijriYear }) {
    const storageKey = `ramadan-taraweeh-${hijriYear}`;
    const [nights, setNights] = useState(() => {
        try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
        catch { return []; }
    });

    const toggle = (night) => {
        setNights((prev) => {
            const next = prev.includes(night)
                ? prev.filter((n) => n !== night)
                : [...prev, night];
            localStorage.setItem(storageKey, JSON.stringify(next));
            return next;
        });
    };

    return (
        <div className="ram-card">
            <div className="ram-card-title">🌙 متتبع التراويح</div>
            <div className="ram-fasting-stats">
                <div className="ram-stat">
                    <div className="ram-stat-number">{nights.length}</div>
                    <div className="ram-stat-label">ليلة صلاة</div>
                </div>
                <div className="ram-stat">
                    <div className="ram-stat-number">{30 - nights.length}</div>
                    <div className="ram-stat-label">متبقي</div>
                </div>
                <div className="ram-stat">
                    <div className="ram-stat-number">
                        {Math.round((nights.length / 30) * 100)}%
                    </div>
                    <div className="ram-stat-label">إنجاز</div>
                </div>
            </div>
            <div className="ram-fasting-grid">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
                    <button
                        key={n}
                        className={
                            "ram-fasting-day taraweeh" +
                            (nights.includes(n) ? " fasted" : "") +
                            (n === ramadanDay ? " today" : "")
                        }
                        onClick={() => toggle(n)}
                        title={`ليلة ${n}`}
                    >
                        {nights.includes(n) ? "✓" : n}
                    </button>
                ))}
            </div>
        </div>
    );
}
