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
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                    } : {
                        background: 'rgba(255,255,255,0.05)',
                    }}
                >
                    {PRAYER_NAMES_AR[p] || p}
                </button>
            ))}
        </div>
    );
}
