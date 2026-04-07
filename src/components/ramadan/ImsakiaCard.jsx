// ImsakiaCard.jsx — Today's imsakia with fajr/maghrib times and countdown

import { formatTime12 } from "./ramadanUtils";

export default function ImsakiaCard({
  fajrTime,
  maghribTime,
  countdown,
  countdownTarget,
}) {
  return (
    <div className="ram-card">
      <div className="ram-card-title">🕌 إمساكية اليوم</div>
      <div className="ram-imsakia">
        <div className="ram-time-box">
          <div className="ram-time-label">الإمساك (الفجر)</div>
          <div className="ram-time-value">{formatTime12(fajrTime)}</div>
        </div>
        <div className="ram-countdown-box">
          <div className="ram-countdown-label">
            {countdownTarget || "العد التنازلي"}
          </div>
          <div className="ram-countdown-timer">{countdown}</div>
          <div className="ram-countdown-target">{countdownTarget}</div>
        </div>
        <div className="ram-time-box">
          <div className="ram-time-label">الإفطار (المغرب)</div>
          <div className="ram-time-value">{formatTime12(maghribTime)}</div>
        </div>
      </div>
    </div>
  );
}
