import { formatHM, getPrayerLabel } from "./globeUtils";

export default function GlobeSidebar({ selected }) {
  if (!selected) {
    return (
      <aside className="globe-side-card">
        <p className="globe-side-note">
          اختر نقطة من الخريطة أو من قائمة المدن لعرض تفاصيلها.
        </p>
      </aside>
    );
  }

  return (
    <aside className="globe-side-card">
      <div className="globe-side-header">
        <div>
          <div className="globe-side-city">{selected.name}</div>
          <div className="globe-side-country">{selected.country}</div>
        </div>
        {selected.prayerKey && (
          <div className="globe-side-prayer-pill">
            🔊 {getPrayerLabel(selected.prayerKey)}
          </div>
        )}
      </div>

      <div className="globe-side-info-grid">
        <div className="globe-side-info-item">
          <span className="globe-side-info-icon">🕐</span>
          <span className="globe-side-info-val">{formatHM(selected.localTime)}</span>
          <span className="globe-side-info-lbl">الوقت المحلي</span>
        </div>

        {typeof selected.qiblaDirection === "number" && (
          <div className="globe-side-info-item">
            <span className="globe-side-info-icon">🧭</span>
            <span className="globe-side-info-val">{selected.qiblaDirection.toFixed(1)}°</span>
            <span className="globe-side-info-lbl">القبلة</span>
          </div>
        )}

        {(selected.dayLengthMinutes || selected.dayLengthMinutes === 0) && (
          <div className="globe-side-info-item">
            <span className="globe-side-info-icon">☀️</span>
            <span className="globe-side-info-val">
              {Math.floor(selected.dayLengthMinutes / 60)}س {selected.dayLengthMinutes % 60}د
            </span>
            <span className="globe-side-info-lbl">النهار</span>
          </div>
        )}

        {(selected.nightLengthMinutes || selected.nightLengthMinutes === 0) && (
          <div className="globe-side-info-item">
            <span className="globe-side-info-icon">🌙</span>
            <span className="globe-side-info-val">
              {Math.floor(selected.nightLengthMinutes / 60)}س {selected.nightLengthMinutes % 60}د
            </span>
            <span className="globe-side-info-lbl">الليل</span>
          </div>
        )}
      </div>
    </aside>
  );
}
