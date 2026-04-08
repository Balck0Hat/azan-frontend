import clsx from "clsx";
import { PRAYERS, PRAYER_NAMES_AR } from "./prayerUtils";

export default function PrayerTabs({ selectedPrayer, setSelectedPrayer }) {
    return (
        <div className="flex gap-1.5 mb-3 flex-wrap justify-center">
            {PRAYERS.map((p) => (
                <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPrayer(p)}
                    className={clsx(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300",
                        selectedPrayer === p
                            ? "text-white shadow-lg"
                            : "text-slate-400 hover:text-slate-200"
                    )}
                    style={selectedPrayer === p ? {
                        background: 'var(--gradient-emerald)',
                        boxShadow: '0 4px 15px color-mix(in srgb, var(--accent-primary) 30%, transparent)',
                    } : {
                        background: 'var(--bg-card)',
                    }}
                >
                    {PRAYER_NAMES_AR[p] || p}
                </button>
            ))}
        </div>
    );
}
