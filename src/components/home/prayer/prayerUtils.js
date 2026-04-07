// Prayer constants and helper functions

export const PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const PRAYER_NAMES_AR = {
  Fajr: "\u0627\u0644\u0641\u062C\u0631",
  Sunrise: "\u0627\u0644\u0634\u0631\u0648\u0642",
  Dhuhr: "\u0627\u0644\u0638\u0647\u0631",
  Asr: "\u0627\u0644\u0639\u0635\u0631",
  Maghrib: "\u0627\u0644\u0645\u063A\u0631\u0628",
  Isha: "\u0627\u0644\u0639\u0650\u0634\u0627\u0621",
};

export const PRAYER_ICONS = {
  Fajr: "\uD83C\uDF19",
  Sunrise: "\uD83C\uDF05",
  Dhuhr: "\u2600\uFE0F",
  Asr: "\uD83C\uDF24",
  Maghrib: "\uD83C\uDF07",
  Isha: "\uD83C\uDF19",
};

export const PRAYER_THEME_KEY = {
  Fajr: "fajr",
  Sunrise: "sunrise",
  Dhuhr: "dhuhr",
  Asr: "asr",
  Maghrib: "maghrib",
  Isha: "isha",
};

export const NIGHT_PRAYERS = ["Fajr", "Isha", "Maghrib"];

export function parseTimeString(raw) {
  if (!raw) return null;
  const t = raw.toString().trim().toLowerCase();

  // Format: "am 05:49" or "pm 7:10"
  let m = t.match(/^(am|pm)\s*(\d{1,2}):(\d{2})$/);
  if (m) {
    let [, suffix, hStr, minStr] = m;
    let h = Number(hStr);
    const minutes = Number(minStr);
    if (Number.isNaN(h) || Number.isNaN(minutes)) return null;

    if (suffix === "pm" && h < 12) h += 12;
    if (suffix === "am" && h === 12) h = 0;

    return { hours: h, minutes };
  }

  // Format: "05:49 am"
  m = t.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/);
  if (m) {
    let [, hStr, minStr, suffix] = m;
    let h = Number(hStr);
    const minutes = Number(minStr);
    if (Number.isNaN(h) || Number.isNaN(minutes)) return null;

    if (suffix === "pm" && h < 12) h += 12;
    if (suffix === "am" && h === 12) h = 0;

    return { hours: h, minutes };
  }

  // 24-hour format: "05:49" or "17:30"
  m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (m) {
    const h = Number(m[1]);
    const minutes = Number(m[2]);
    if (Number.isNaN(h) || Number.isNaN(minutes)) return null;
    return { hours: h, minutes };
  }

  return null;
}

export function formatWithAmPm(time) {
  if (!time) return "";
  const parsed = parseTimeString(time);
  if (!parsed) return time;

  const { hours, minutes } = parsed;
  const suffix = hours >= 12 ? "pm" : "am";
  const hour12 = ((hours + 11) % 12) + 1;

  return `${suffix} ${hour12}:${minutes.toString().padStart(2, "0")}`;
}
