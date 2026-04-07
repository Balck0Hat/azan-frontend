export const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
export const MAX_POINTS = 10000;

export const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const PRAYERS = [
  { key: "Fajr", label: "الفجر" },
  { key: "Dhuhr", label: "الظهر" },
  { key: "Asr", label: "العصر" },
  { key: "Maghrib", label: "المغرب" },
  { key: "Isha", label: "العِشاء" },
];

export const PRAYER_TABS = [{ key: "all", label: "الكل" }, ...PRAYERS];

export const PRAYER_COLORS = {
  Fajr: "#38bdf8",
  Dhuhr: "#facc15",
  Asr: "#fb923c",
  Maghrib: "#22c55e",
  Isha: "#a855f7",
};

export const getPrayerLabel = (key) =>
  PRAYERS.find((p) => p.key === key)?.label || key;

export function parseLocalTimeFromString(str) {
  if (typeof str !== "string") return null;
  const m = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const minutes = parseInt(m[2], 10);
  const ampm = m[3]?.toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return { hours: h, minutes };
}

export function getLocalTimeFromLongitude(lng) {
  const now = new Date();
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const offsetMinutes = (lng / 15) * 60;
  const total = utcMinutes + offsetMinutes;
  const normalized = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  const hours = Math.floor(normalized / 60);
  const minutes = Math.floor(normalized % 60);
  return { hours, minutes };
}

export function formatHM({ hours, minutes }) {
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
}

export function hmToMinutes(str) {
  if (!str || typeof str !== "string") return null;
  const m = str.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

export function getNowUtcMinutes() {
  const now = new Date();
  return now.getUTCHours() * 60 + now.getUTCMinutes();
}

export function getClusterCellSize(zoom) {
  if (zoom <= 1.5) return 10;
  if (zoom <= 2.5) return 6;
  if (zoom <= 3.5) return 3;
  return 1.5;
}
