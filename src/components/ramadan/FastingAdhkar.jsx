import { useState } from "react";
import { fastingAdhkar } from "../../data/ramadanData";

export default function FastingAdhkar() {
    const [filter, setFilter] = useState("الكل");
    const [copiedId, setCopiedId] = useState(null);

    const categories = ["الكل", "سحور", "إفطار", "ليلة القدر", "قيام"];
    const filtered = filter === "الكل"
        ? fastingAdhkar
        : fastingAdhkar.filter((a) => a.category === filter);

    const copy = (id, text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    return (
        <div className="ram-card">
            <div className="ram-card-title">📿 أذكار الصائم</div>
            <div className="ram-duas-tabs">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={"ram-dua-tab" + (filter === cat ? " active" : "")}
                        onClick={() => setFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="ram-duas-list">
                {filtered.map((dhikr) => (
                    <div key={dhikr.id} className="ram-dua-card">
                        <div className="ram-dua-label">{dhikr.label}</div>
                        <div className="ram-dua-text">{dhikr.text}</div>
                        <button
                            className={"ram-dua-copy" + (copiedId === dhikr.id ? " ram-dua-copied" : "")}
                            onClick={() => copy(dhikr.id, dhikr.text)}
                        >
                            {copiedId === dhikr.id ? "✓ تم النسخ" : "📋 نسخ"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
