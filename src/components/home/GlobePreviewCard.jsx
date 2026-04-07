import { useState, useEffect } from "react";
import api from "../../api";
import { PRAYER_COLORS, getPrayerLabel, PRAYER_KEYS } from "./globe/globeUtils";
import "../../styles/globePreviewCard.css";

export default function GlobePreviewCard({ setActiveCard }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/prayertimes/now/summary");
        setStats(res.data);
      } catch {
        /* silent – card still renders without stats */
      }
    };
    fetchSummary();
    const id = setInterval(fetchSummary, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="globe-preview">
      <div className="globe-preview-header">
        <span className="globe-preview-icon">🌍</span>
        <span className="globe-preview-title">الأذان مباشر حول العالم</span>
      </div>

      {stats && (
        <div className="globe-preview-stats">
          {PRAYER_KEYS.map((key) => {
            const count = stats[key] ?? stats[key.toLowerCase()] ?? 0;
            return (
              <div key={key} className="globe-preview-stat">
                <span
                  className="globe-preview-stat-dot"
                  style={{ background: PRAYER_COLORS[key] }}
                />
                <span>{getPrayerLabel(key)}</span>
                <strong>{count}</strong>
              </div>
            );
          })}
        </div>
      )}

      <button
        type="button"
        className="globe-preview-btn"
        onClick={() => setActiveCard("globe")}
      >
        عرض الخريطة الكاملة
        <span style={{ fontSize: "1.1rem" }}>→</span>
      </button>
    </div>
  );
}
