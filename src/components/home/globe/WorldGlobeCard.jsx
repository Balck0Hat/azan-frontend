import { useState } from "react";
import "../../../styles/globe.css";
import { PRAYER_TABS, getPrayerLabel } from "./globeUtils";
import useGlobeData from "./useGlobeData";
import GlobeHeader from "./GlobeHeader";
import GlobeMap from "./GlobeMap";
import GlobeSidebar from "./GlobeSidebar";
import GlobeFooterStats from "./GlobeFooterStats";

export default function WorldGlobeCard() {
  const [currentPrayer, setCurrentPrayer] = useState("Maghrib");
  const isAllMode = currentPrayer === "all";

  const {
    utcTimeStr, mapState, setMapState, cities, selected, setSelected,
    loading, error, clusters, stats,
    resetView, zoomIn, zoomOut, handleMoveEnd, focusOnCity,
  } = useGlobeData(currentPrayer);

  const prayingNowList = cities.slice(0, 12);

  return (
    <section className="card home-card globe-wide-card">
      <h2 className="card-title">الأذان مباشر على خريطة العالم</h2>
      <p className="muted-text">
        {isAllMode ? (
          <>المدن التي يُؤذَّن فيها الآن لمختلف الصلوات الخمس، مع تمييز كل صلاة بلون خاص.</>
        ) : (
          <>المدن التي يُؤذَّن فيها الآن لصلاة <strong>{getPrayerLabel(currentPrayer)}</strong>، مع توزيع تقريبي بين الليل والنهار.</>
        )}
      </p>

      {/* Prayer Tabs */}
      <div className="tabs globe-prayers-tabs">
        {PRAYER_TABS.map((p) => (
          <button
            key={p.key} type="button"
            className={"tab-btn" + (p.key === currentPrayer ? " tab-btn-active" : "")}
            onClick={() => setCurrentPrayer(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="globe-shell">
        <GlobeHeader
          resetView={resetView} zoomIn={zoomIn} zoomOut={zoomOut}
          utcTimeStr={utcTimeStr} isAllMode={isAllMode} currentPrayer={currentPrayer}
        />

        <div className="globe-main-row">
          <div className="globe-map-column">
            {/* Cities strip above map */}
            {prayingNowList.length > 0 && (
              <div className="globe-now-strip">
                <div className="globe-now-panel-header">
                  <span className="globe-now-icon">🔊</span>
                  <span className="globe-now-title">
                    {isAllMode ? "مدن بارزة الآن – الكل" : `يُؤذَّن الآن – ${getPrayerLabel(currentPrayer)}`}
                  </span>
                </div>
                <div className="globe-now-chip-row">
                  {prayingNowList.map((city) => (
                    <button key={city.id} type="button" className="globe-now-chip" onClick={() => focusOnCity(city)}>
                      {city.name}
                    </button>
                  ))}
                  {cities.length > prayingNowList.length && (
                    <span className="globe-now-more">+{cities.length - prayingNowList.length} مدينة أخرى</span>
                  )}
                </div>
              </div>
            )}

            <GlobeMap
              mapState={mapState} handleMoveEnd={handleMoveEnd}
              clusters={clusters} selected={selected} setSelected={setSelected}
              setMapState={setMapState} isAllMode={isAllMode} currentPrayer={currentPrayer}
              loading={loading} error={error}
            />
          </div>

          <GlobeSidebar selected={selected} />
        </div>

        <GlobeFooterStats isAllMode={isAllMode} stats={stats} />
      </div>
    </section>
  );
}
