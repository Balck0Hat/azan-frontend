import {
  parseLocalTimeFromString,
  getLocalTimeFromLongitude,
  hmToMinutes,
} from "./globeUtils";

/**
 * Transform API cities data into normalized city objects.
 * Uses prayerWindows to determine isNow, solar data for day/night status.
 */
export default function mapApiCities(apiCities, prayerKey, nowUtcMinutes) {
  return apiCities
    .map((c, idx) => {
      const rawLng =
        c.lng ?? c.lon ?? c.longitude ?? c.long ??
        c.coords?.[0] ?? c.location?.coordinates?.[0];
      const rawLat =
        c.lat ?? c.latitude ??
        c.coords?.[1] ?? c.location?.coordinates?.[1];

      const lng = rawLng != null ? Number(rawLng) : NaN;
      const lat = rawLat != null ? Number(rawLat) : NaN;

      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;

      const name = c.cityName || c.city || c.name || `مدينة ${idx + 1}`;
      const country = c.country || c.countryName || "";

      const parsedLocal =
        parseLocalTimeFromString(c.timeLocal) ||
        parseLocalTimeFromString(c.timeUtc) ||
        getLocalTimeFromLongitude(lng);

      // Determine if prayer is happening now from prayerWindows
      let isNow = true;
      if (prayerKey && c.prayerWindows?.[prayerKey]) {
        const w = c.prayerWindows[prayerKey];
        const start = Number(w.start);
        const end = Number(w.end);
        if (Number.isFinite(start) && Number.isFinite(end)) {
          isNow = end >= start
            ? (nowUtcMinutes >= start && nowUtcMinutes < end)
            : (nowUtcMinutes >= start || nowUtcMinutes < end);
        }
      }

      // Determine day/night from solar data
      let status;
      if (c.solar) {
        const sunriseMin = hmToMinutes(c.solar.sunrise);
        const sunsetMin = hmToMinutes(c.solar.sunset);
        if (sunriseMin != null && sunsetMin != null) {
          status = (nowUtcMinutes >= sunriseMin && nowUtcMinutes < sunsetMin) ? "day" : "night";
        }
      }
      if (!status && parsedLocal) {
        const hourFloat = parsedLocal.hours + parsedLocal.minutes / 60;
        status = (hourFloat < 6 || hourFloat >= 18) ? "night" : "day";
      }
      if (!status) status = "mixed";

      return {
        id: c._id ?? c.id ?? `${prayerKey}-${name}-${lng}-${lat}-${idx}`,
        name,
        country,
        coords: [lng, lat],
        localTime: parsedLocal,
        status,
        isNow,
        prayerKey,
        qiblaDirection: c.qiblaDirection,
        dayLengthMinutes: c.dayLengthMinutes,
        nightLengthMinutes: c.nightLengthMinutes,
        solar: c.solar,
      };
    })
    .filter(Boolean);
}
