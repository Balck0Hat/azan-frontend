import {
  ComposableMap, Geographies, Geography, Marker, ZoomableGroup,
} from "react-simple-maps";
import { GEO_URL, PRAYER_KEYS, PRAYER_COLORS, getPrayerLabel } from "./globeUtils";

export default function GlobeMap({
  mapState, handleMoveEnd, clusters, selected, setSelected, setMapState,
  isAllMode, currentPrayer, loading, error,
}) {
  return (
    <div className="globe-map-wrapper">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 260 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={mapState.zoom}
          center={mapState.center}
          minZoom={1} maxZoom={5}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#020617", stroke: "#1f2937", strokeWidth: 0.5, outline: "none" },
                    hover: { fill: "#0b1120", stroke: "#334155", strokeWidth: 0.6, outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {clusters.map((cluster) => {
            if (cluster.count === 1) {
              return (
                <SingleMarker
                  key={cluster.items[0].id}
                  city={cluster.items[0]}
                  isAllMode={isAllMode}
                  isSelected={selected && selected.id === cluster.items[0].id}
                  onClick={() => setSelected(cluster.items[0])}
                />
              );
            }
            return (
              <ClusterMarker
                key={cluster.id}
                cluster={cluster}
                isAllMode={isAllMode}
                onClick={() => {
                  setMapState((prev) => ({ center: cluster.coords, zoom: Math.min(prev.zoom + 1, 5) }));
                  setSelected(cluster.items[0]);
                }}
              />
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Map Legend */}
      <div className="globe-legend">
        <div className="globe-legend-title">دليل الخريطة</div>
        {isAllMode ? (
          PRAYER_KEYS.map((key) => (
            <div className="globe-legend-row" key={key}>
              <span className={`globe-legend-dot globe-legend-dot-${key.toLowerCase()}`} />
              <span>{getPrayerLabel(key)}</span>
            </div>
          ))
        ) : (
          <>
            <div className="globe-legend-row">
              <span className="globe-legend-dot dot-now" />
              <span>يُؤذَّن الآن – {getPrayerLabel(currentPrayer)}</span>
            </div>
            <div className="globe-legend-row">
              <span className="globe-legend-dot dot-day" />
              <span>نهار</span>
            </div>
            <div className="globe-legend-row">
              <span className="globe-legend-dot dot-night" />
              <span>ليل</span>
            </div>
          </>
        )}
      </div>

      {loading && <div className="live-loading-overlay"><div className="spinner" /></div>}
      {error && <div className="alert-error" style={{ position: "absolute", top: 12, right: 12 }}>{error}</div>}
    </div>
  );
}

function SingleMarker({ city, isAllMode, isSelected, onClick }) {
  let fill = "#60a5fa", glow = "0 0 12px rgba(96,165,250,0.9)";

  if (isAllMode) {
    const c = PRAYER_COLORS[city.prayerKey] || "#22c55e";
    fill = c; glow = `0 0 16px ${c}`;
  } else {
    if (city.status === "day") { fill = "#fbbf24"; glow = "0 0 12px rgba(251,191,36,0.9)"; }
    if (city.isNow) { fill = "#22c55e"; glow = "0 0 16px rgba(34,197,94,1)"; }
  }

  return (
    <Marker coordinates={city.coords} onClick={onClick}>
      {city.isNow && (
        <g className="globe-now-waves">
          <circle className="globe-now-wave globe-now-wave-1" r={8} />
          <circle className="globe-now-wave globe-now-wave-2" r={8} />
          <circle className="globe-now-wave globe-now-wave-3" r={8} />
        </g>
      )}
      <circle
        r={isSelected ? 7 : 5.2} fill={fill} stroke="#0b1120" strokeWidth={1.2}
        style={{ filter: `drop-shadow(${glow})`, cursor: "pointer", transition: "r 0.15s ease" }}
      />
    </Marker>
  );
}

function ClusterMarker({ cluster, isAllMode, onClick }) {
  const { coords, count, hasNow, status, dominantPrayer } = cluster;
  let fill = "rgba(96,165,250,0.85)", innerFill = "#60a5fa";

  if (isAllMode && dominantPrayer) {
    const c = PRAYER_COLORS[dominantPrayer];
    if (c) { fill = `${c}E6`; innerFill = c; }
  } else {
    if (status === "day") { fill = "rgba(251,191,36,0.85)"; innerFill = "#fbbf24"; }
    else if (status === "night") { fill = "rgba(96,165,250,0.85)"; innerFill = "#60a5fa"; }
  }
  if (hasNow && !isAllMode) { fill = "rgba(34,197,94,0.9)"; innerFill = "#22c55e"; }

  const baseR = 8 + Math.min(count, 80) / 3;

  return (
    <Marker coordinates={coords} onClick={onClick}>
      <circle r={baseR + 4} fill={fill} opacity={0.18} />
      <circle
        r={baseR} fill={innerFill} stroke="#0b1120" strokeWidth={1.6}
        style={{ filter: "drop-shadow(0 0 20px rgba(15,23,42,0.9))", cursor: "pointer", transition: "r 0.15s ease" }}
      />
      <text
        textAnchor="middle" dy="0.35em"
        style={{ fontSize: count < 10 ? 9 : count < 50 ? 10 : 11, fontWeight: 700, fill: "#0b1120" }}
      >
        {count}
      </text>
    </Marker>
  );
}
