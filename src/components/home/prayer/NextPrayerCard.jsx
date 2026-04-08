import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import "../../../styles/NextPrayerCard.css";
import FlipNumber from "./FlipNumber";
import NextPrayerSkeleton from "./NextPrayerSkeleton";
import StarsLayer from "./StarsLayer";
import PrayerTabs from "./PrayerTabs";
import usePrayerData from "./usePrayerData";
import {
  PRAYER_NAMES_AR,
  PRAYER_ICONS,
  PRAYER_THEME_KEY,
  NIGHT_PRAYERS,
  formatWithAmPm,
} from "./prayerUtils";

export default function NextPrayerProCard() {
  const {
    times, selectedPrayer, setSelectedPrayer,
    countdown, isUrgent, prayerTime,
  } = usePrayerData();

  const [isHovered, setIsHovered] = useState(false);

  if (!times || !selectedPrayer) return <NextPrayerSkeleton />;

  const themeKey = PRAYER_THEME_KEY[selectedPrayer] || "maghrib";
  const isSunrise = selectedPrayer === "Sunrise";
  const isNight = NIGHT_PRAYERS.includes(selectedPrayer);

  const footerText = prayerTime
    ? `${isSunrise ? "وقت الشروق القادم" : "وقت الأذان القادم"}: ${formatWithAmPm(prayerTime)}`
    : isSunrise ? "جاري حساب وقت الشروق القادم…" : "جاري حساب وقت الأذان القادم…";

  return (
    <motion.div
      className="np-wrapper" dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <PrayerTabs selectedPrayer={selectedPrayer} setSelectedPrayer={setSelectedPrayer} />

      <motion.div
        className={clsx("np-pro-card", `np-theme-${themeKey}`, isHovered && "np-is-hovered", isUrgent && "np-is-urgent")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ borderRadius: '1rem', overflow: 'hidden', position: 'relative' }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <div className="np-bg-layer" />
        <div className="np-glow-layer" />
        <div className="np-pattern-layer" />
        <StarsLayer isHovered={isHovered} isNight={isNight} />
        <div className="np-mosque-layer" />

        <div className="np-inner">
          <div className="np-icon-wrap">
            <motion.div
              className="np-icon-circle"
              animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="np-icon">{PRAYER_ICONS[selectedPrayer] || "🕰"}</span>
            </motion.div>
          </div>

          <div className="np-main-text">
            <p className="np-label" style={{ color: 'var(--text-secondary)' }}>
              {isSunrise ? "الوقت القادم" : "الصلاة القادمة"}
            </p>
            <AnimatePresence mode="wait">
              <motion.h2
                key={selectedPrayer}
                className="np-prayer-name"
                style={{
                  background: 'linear-gradient(135deg, var(--text-primary), var(--accent-primary))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {PRAYER_NAMES_AR[selectedPrayer] || "—"}
              </motion.h2>
            </AnimatePresence>
            <p className="np-prayer-time">{prayerTime ? formatWithAmPm(prayerTime) : "— : —"}</p>
          </div>

          <div className="np-countdown">
            <p className="np-countdown-title flex items-center justify-center gap-2">
              {isUrgent && (
                <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--status-warning)', boxShadow: '0 0 8px var(--status-warning)' }} />
              )}
              الوقت المتبقي
            </p>
            <div className="np-countdown-row">
              <FlipNumber value={countdown.seconds} label="ثانية" />
              <span className="np-colon">:</span>
              <FlipNumber value={countdown.minutes} label="دقيقة" />
              <span className="np-colon">:</span>
              <FlipNumber value={countdown.hours} label="ساعة" />
            </div>
          </div>

          <p className="np-footer-text" style={{ color: 'var(--text-muted)' }}>{footerText}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
