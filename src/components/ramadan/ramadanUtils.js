// ramadanUtils.js — Helper functions and constants for the Ramadan page

// 1 Ramadan 1447 = 19 February 2026
const RAMADAN_START = new Date(2026, 1, 19);
const HIJRI_YEAR = 1447;

export const STORAGE_KEY_FASTING = `ramadan-fasting-${HIJRI_YEAR}`;
export const STORAGE_KEY_KHATMA = `ramadan-khatma-${HIJRI_YEAR}`;

export function getRamadanDay() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((today - RAMADAN_START) / 86400000) + 1;

  if (diffDays >= 1 && diffDays <= 30) {
    return { day: diffDays, year: HIJRI_YEAR, isRamadan: true };
  }
  return { day: 0, year: HIJRI_YEAR, isRamadan: false };
}

export function formatTime12(timeStr) {
  if (!timeStr) return "--:--";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "\u0645" : "\u0635";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function timeToDate(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function formatCountdown(diffMs) {
  if (diffMs <= 0) return "00:00:00";
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
