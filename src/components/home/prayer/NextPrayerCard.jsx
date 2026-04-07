import { useState } from "react";
import "../../../styles/NextPrayerCard.css";
import FlipNumber from "./FlipNumber";
import NextPrayerSkeleton from "./NextPrayerSkeleton";
import StarsLayer from "./StarsLayer";
import usePrayerData from "./usePrayerData";
import {
  PRAYERS,
  PRAYER_NAMES_AR,
  PRAYER_ICONS,
  PRAYER_THEME_KEY,
  NIGHT_PRAYERS,
  formatWithAmPm,
} from "./prayerUtils";

export default function NextPrayerProCard() {
  const {
    times,
    selectedPrayer,
    setSelectedPrayer,
    countdown,
    isUrgent,
    prayerTime,
  } = usePrayerData();

  const [isHovered, setIsHovered] = useState(false);

  if (!times || !selectedPrayer) {
    return <NextPrayerSkeleton />;
  }

  const themeKey = selectedPrayer
    ? PRAYER_THEME_KEY[selectedPrayer] || "maghrib"
    : "maghrib";

  const rootClasses = [
    "np-pro-card",
    `np-theme-${themeKey}`,
    isHovered ? "np-is-hovered" : "",
    isUrgent ? "np-is-urgent" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isSunrise = selectedPrayer === "Sunrise";
  const isNight = NIGHT_PRAYERS.includes(selectedPrayer);

  const footerText = prayerTime
    ? `${isSunrise ? "\u0648\u0642\u062A \u0627\u0644\u0634\u0631\u0648\u0642 \u0627\u0644\u0642\u0627\u062F\u0645" : "\u0648\u0642\u062A \u0627\u0644\u0623\u0630\u0627\u0646 \u0627\u0644\u0642\u0627\u062F\u0645"}: ${formatWithAmPm(prayerTime)}`
    : isSunrise
      ? "\u062C\u0627\u0631\u064A \u062D\u0633\u0627\u0628 \u0648\u0642\u062A \u0627\u0644\u0634\u0631\u0648\u0642 \u0627\u0644\u0642\u0627\u062F\u0645\u2026"
      : "\u062C\u0627\u0631\u064A \u062D\u0633\u0627\u0628 \u0648\u0642\u062A \u0627\u0644\u0623\u0630\u0627\u0646 \u0627\u0644\u0642\u0627\u062F\u0645\u2026";

  return (
    <div className="np-wrapper" dir="rtl">
      <div className="np-tabs">
        {PRAYERS.map((p) => (
          <button
            key={p}
            type="button"
            className={
              "np-tab" +
              (selectedPrayer === p ? " np-tab--active" : "")
            }
            onClick={() => setSelectedPrayer(p)}
          >
            {PRAYER_NAMES_AR[p] || p}
          </button>
        ))}
      </div>

      <div
        className={rootClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="np-bg-layer" />
        <div className="np-glow-layer" />
        <div className="np-pattern-layer" />

        <StarsLayer isHovered={isHovered} isNight={isNight} />

        <div className="np-mosque-layer" />

        <div className="np-inner">
          <div className="np-icon-wrap">
            <div className="np-icon-circle">
              <span className="np-icon">
                {selectedPrayer ? PRAYER_ICONS[selectedPrayer] : "\uD83D\uDD70"}
              </span>
            </div>
          </div>

          <div className="np-main-text">
            <p className="np-label">
              {isSunrise ? "\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0642\u0627\u062F\u0645" : "\u0627\u0644\u0635\u0644\u0627\u0629 \u0627\u0644\u0642\u0627\u062F\u0645\u0629"}
            </p>
            <h2 className="np-prayer-name">
              {selectedPrayer ? PRAYER_NAMES_AR[selectedPrayer] : "\u2014"}
            </h2>
            <p className="np-prayer-time">
              {prayerTime ? formatWithAmPm(prayerTime) : "\u2014 : \u2014"}
            </p>
          </div>

          <div className="np-countdown">
            <p className="np-countdown-title">{"\u0627\u0644\u0648\u0642\u062A \u0627\u0644\u0645\u062A\u0628\u0642\u064A"}</p>
            <div className="np-countdown-row">
              <FlipNumber value={countdown.seconds} label={"\u062B\u0627\u0646\u064A\u0629"} />
              <span className="np-colon">:</span>
              <FlipNumber value={countdown.minutes} label={"\u062F\u0642\u064A\u0642\u0629"} />
              <span className="np-colon">:</span>
              <FlipNumber value={countdown.hours} label={"\u0633\u0627\u0639\u0629"} />
            </div>
          </div>

          <p className="np-footer-text">{footerText}</p>
        </div>
      </div>
    </div>
  );
}
