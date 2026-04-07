import { useState, useMemo } from "react";
import { PRAYER_COLORS, getPrayerLabel } from "../home/globe/globeUtils";

export default function GlobeCitiesList({ cities, selected, onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return cities;
    const q = search.trim().toLowerCase();
    return cities.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.country?.toLowerCase().includes(q)
    );
  }, [cities, search]);

  return (
    <div className="globe-cities-list">
      <input
        type="text"
        className="globe-cities-search"
        placeholder="ابحث عن مدينة..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="globe-cities-scroll">
        {filtered.length === 0 && (
          <div className="globe-cities-empty">
            {cities.length === 0 ? "جاري التحميل..." : "لا توجد نتائج"}
          </div>
        )}

        {filtered.map((city) => {
          const isActive = selected?.id === city.id;
          return (
            <button
              key={city.id}
              type="button"
              className={`globe-city-item${isActive ? " globe-city-item-active" : ""}`}
              onClick={() => onSelect(city)}
            >
              <div>
                <div className="globe-city-name">{city.name}</div>
                <div className="globe-city-country">{city.country}</div>
              </div>
              {city.prayerKey && (
                <span
                  className="globe-city-prayer-badge"
                  style={{
                    background: `${PRAYER_COLORS[city.prayerKey]}22`,
                    color: PRAYER_COLORS[city.prayerKey],
                    border: `1px solid ${PRAYER_COLORS[city.prayerKey]}44`,
                  }}
                >
                  {getPrayerLabel(city.prayerKey)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
