import { getPrayerLabel } from "./globeUtils";

export default function GlobeHeader({
  resetView, zoomIn, zoomOut, utcTimeStr, isAllMode, currentPrayer,
}) {
  return (
    <div className="globe-header-row">
      <div className="globe-toolbar">
        <button type="button" className="globe-icon-btn" onClick={resetView} title="إعادة الضبط">↻</button>
        <button type="button" className="globe-icon-btn" onClick={zoomIn} title="تكبير">＋</button>
        <button type="button" className="globe-icon-btn" onClick={zoomOut} title="تصغير">－</button>
      </div>

      <div className="globe-utc-pill">
        <span className="globe-utc-label">UTC</span>
        <span className="globe-utc-time">{utcTimeStr}</span>
        <span className="globe-utc-icon">🕒</span>
      </div>

      <div className="globe-title-pill">
        <div className="globe-title-main">الأذان مباشر حول العالم</div>
        <div className="globe-title-sub">
          {isAllMode
            ? "عرض حيّ لكل الصلوات الخمس"
            : `المدن التي يُؤذَّن فيها الآن – ${getPrayerLabel(currentPrayer)}`}
        </div>
        <button className="globe-sound-btn" type="button">🔊</button>
      </div>
    </div>
  );
}
