import "../../../styles/NextPrayerCard.css";
import "../../../styles/NextPrayerSkeleton.css";

function Bone({ className = "" }) {
  return <div className={`nps-bone ${className}`} />;
}

export default function NextPrayerSkeleton() {
  return (
    <div className="np-wrapper" dir="rtl">
      {/* Skeleton tabs */}
      <div className="np-tabs">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="nps-tab" />
        ))}
      </div>

      {/* Skeleton card */}
      <div className="np-pro-card np-theme-maghrib nps-card">
        <div className="np-bg-layer" />

        <div className="np-inner">
          {/* Icon placeholder */}
          <div className="np-icon-wrap">
            <div className="np-icon-circle">
              <Bone className="nps-icon" />
            </div>
          </div>

          {/* Prayer name & time */}
          <div className="nps-text-group">
            <Bone className="nps-label" />
            <Bone className="nps-name" />
            <Bone className="nps-time" />
          </div>

          {/* Countdown */}
          <div className="nps-countdown-group">
            <Bone className="nps-countdown-title" />
            <div className="nps-countdown-row">
              <Bone className="nps-digit-box" />
              <span className="np-colon nps-colon-dim">:</span>
              <Bone className="nps-digit-box" />
              <span className="np-colon nps-colon-dim">:</span>
              <Bone className="nps-digit-box" />
            </div>
          </div>

          {/* Footer text */}
          <Bone className="nps-footer" />
        </div>
      </div>
    </div>
  );
}
