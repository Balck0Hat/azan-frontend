import { useEffect, useMemo, useState } from "react";
import api from "../../../api";
import { PRAYER_KEYS, MAX_POINTS, getNowUtcMinutes, getClusterCellSize } from "./globeUtils";
import mapApiCities from "./mapApiCities";

export default function useGlobeData(currentPrayer) {
  const [utcTimeStr, setUtcTimeStr] = useState("");
  const [mapState, setMapState] = useState({ center: [15, 25], zoom: 1.3 });
  const [cities, setCities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // UTC clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getUTCHours().toString().padStart(2, "0");
      const m = now.getUTCMinutes().toString().padStart(2, "0");
      const s = now.getUTCSeconds().toString().padStart(2, "0");
      setUtcTimeStr(`${h}:${m}:${s}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch cities data
  useEffect(() => {
    const fetchNow = async () => {
      try {
        setLoading(true); setError(""); setCities([]); setSelected(null);
        const nowUtcMinutes = getNowUtcMinutes();

        let mapped;
        if (currentPrayer === "all") {
          const responses = await Promise.all(
            PRAYER_KEYS.map((key) => api.get("/prayertimes/now", { params: { prayer: key } }))
          );
          let merged = [];
          responses.forEach((res, idx) => {
            const apiCities = res.data?.cities || [];
            merged = merged.concat(mapApiCities(apiCities, PRAYER_KEYS[idx], nowUtcMinutes));
          });
          mapped = merged.slice(0, MAX_POINTS);
        } else {
          const res = await api.get("/prayertimes/now", { params: { prayer: currentPrayer } });
          mapped = mapApiCities(res.data?.cities || [], currentPrayer, nowUtcMinutes).slice(0, MAX_POINTS);
        }

        setCities(mapped);
        if (mapped.length > 0) {
          setSelected(mapped[0]);
          setMapState((prev) => ({ ...prev, center: mapped[0].coords, zoom: Math.max(prev.zoom, 2.0) }));
        }
      } catch (e) {
        console.error(e);
        setError("تعذّر جلب المدن من خادم الأذان.");
      } finally {
        setLoading(false);
      }
    };
    fetchNow();
    const interval = setInterval(fetchNow, 60_000);
    return () => clearInterval(interval);
  }, [currentPrayer]);

  // Auto-select first city
  useEffect(() => {
    if (!selected && cities.length > 0) setSelected(cities[0]);
  }, [cities, selected]);

  // Clusters
  const clusters = useMemo(() => {
    if (!cities.length) return [];
    const cellSize = getClusterCellSize(mapState.zoom);
    const buckets = new Map();

    for (const city of cities) {
      const [lng, lat] = city.coords;
      const key = `${Math.floor(lng / cellSize)}-${Math.floor(lat / cellSize)}`;
      if (!buckets.has(key)) buckets.set(key, { sumLng: 0, sumLat: 0, items: [], prayerCounts: {} });
      const bucket = buckets.get(key);
      bucket.sumLng += lng; bucket.sumLat += lat; bucket.items.push(city);
      if (city.prayerKey) bucket.prayerCounts[city.prayerKey] = (bucket.prayerCounts[city.prayerKey] || 0) + 1;
    }

    return Array.from(buckets.values()).map((bucket, idx) => {
      const count = bucket.items.length;
      const hasNow = bucket.items.some((c) => c.isNow);
      const dayCount = bucket.items.filter((c) => c.status === "day").length;
      const nightCount = bucket.items.filter((c) => c.status === "night").length;
      let status = "mixed";
      if (dayCount && !nightCount) status = "day";
      else if (nightCount && !dayCount) status = "night";

      let dominantPrayer = null, maxCount = 0;
      for (const [pk, val] of Object.entries(bucket.prayerCounts)) {
        if (val > maxCount) { maxCount = val; dominantPrayer = pk; }
      }

      return {
        id: `cluster-${idx}`,
        coords: [bucket.sumLng / count, bucket.sumLat / count],
        count, items: bucket.items, hasNow, status, dominantPrayer,
      };
    });
  }, [cities, mapState.zoom]);

  // Stats
  const stats = useMemo(() => {
    let day = 0, night = 0;
    const perPrayer = { Fajr: 0, Dhuhr: 0, Asr: 0, Maghrib: 0, Isha: 0 };
    cities.forEach((c) => {
      if (c.status === "day") day++;
      else if (c.status === "night") night++;
      if (c.prayerKey && perPrayer[c.prayerKey] != null) perPrayer[c.prayerKey]++;
    });
    return { day, night, total: cities.length, now: cities.filter((c) => c.isNow).length, perPrayer };
  }, [cities]);

  const resetView = () => setMapState({ center: [15, 25], zoom: 1.3 });
  const zoomIn = () => setMapState((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.4, 5) }));
  const zoomOut = () => setMapState((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.4, 1) }));
  const handleMoveEnd = (pos) => setMapState({ center: pos.coordinates, zoom: pos.zoom });

  const focusOnCity = (city) => {
    setSelected(city);
    setMapState((prev) => ({ center: city.coords, zoom: Math.max(prev.zoom, 2.2) }));
  };

  return {
    utcTimeStr, mapState, setMapState, cities, selected, setSelected,
    loading, error, clusters, stats,
    resetView, zoomIn, zoomOut, handleMoveEnd, focusOnCity,
  };
}
