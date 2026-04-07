import { useState, useRef, useCallback, useEffect, lazy, Suspense } from "react";
import "../../styles/globe.css";
import "../../styles/globeFullPage.css";
import { PRAYER_TABS, getPrayerLabel } from "../home/globe/globeUtils";
import useGlobeData from "../home/globe/useGlobeData";
import Globe3DMap from "../home/globe/Globe3DMap";
import GlobeHeader from "../home/globe/GlobeHeader";
import GlobeSidebar from "../home/globe/GlobeSidebar";
import GlobeFooterStats from "../home/globe/GlobeFooterStats";
import GlobeErrorBoundary from "../home/globe/GlobeErrorBoundary";
import GlobeCitiesList from "./GlobeCitiesList";

const GlobeMap = lazy(() => import("../home/globe/GlobeMap"));

export default function GlobeFullPage({ setActiveCard }) {
  const [currentPrayer, setCurrentPrayer] = useState("Maghrib");
  const [mapMode, setMapMode] = useState("3d");
  const [fading, setFading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pendingMode = useRef(null);
  const sectionRef = useRef(null);
  const isAllMode = currentPrayer === "all";

  const {
    utcTimeStr, mapState, setMapState, cities, selected, setSelected,
    loading, error, clusters, stats,
    resetView, zoomIn, zoomOut, handleMoveEnd, focusOnCity,
  } = useGlobeData(currentPrayer);

  const prayingNowList = cities.slice(0, 12);

  /* ── smooth 2D/3D switch ── */
  const switchMapMode = useCallback((mode) => {
    if (mode === mapMode || fading) return;
    pendingMode.current = mode;
    setFading(true);
    setTimeout(() => {
      setMapMode(mode);
      setFading(false);
      pendingMode.current = null;
    }, 250);
  }, [mapMode, fading]);

  /* ── error boundary → auto-switch to 2D ── */
  const handleGlobeError = useCallback(() => {
    setTimeout(() => switchMapMode("2d"), 600);
  }, [switchMapMode]);

  /* ── geolocation → find nearest city ── */
  const handleGeolocation = useCallback(() => {
    if (!navigator.geolocation || cities.length === 0) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        let nearest = null, minDist = Infinity;
        for (const city of cities) {
          const [lng, lat] = city.coords;
          const dist = (lat - latitude) ** 2 + (lng - longitude) ** 2;
          if (dist < minDist) { minDist = dist; nearest = city; }
        }
        if (nearest) focusOnCity(nearest);
        setGeoLoading(false);
      },
      () => setGeoLoading(false),
      { timeout: 8000 },
    );
  }, [cities, focusOnCity]);

  /* ── fullscreen toggle ── */
  const toggleFullscreen = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`globe-fullpage${isFullscreen ? " globe-fullpage--fs" : ""}`}
    >
      {/* Top bar */}
      <div className="globe-fullpage-top">
        <div className="globe-fullpage-title-row">
          <button
            type="button"
            className="globe-fullpage-back"
            onClick={() => setActiveCard("home")}
            title="العودة للرئيسية"
          >
            →
          </button>
          <h2 className="globe-fullpage-title">
            🌍 خريطة الأذان المباشر
          </h2>
          <div className="globe-mode-toggle">
            <button
              type="button"
              className={`globe-mode-btn${mapMode === "3d" ? " globe-mode-btn-active" : ""}`}
              onClick={() => switchMapMode("3d")}
            >
              🌐 3D
            </button>
            <button
              type="button"
              className={`globe-mode-btn${mapMode === "2d" ? " globe-mode-btn-active" : ""}`}
              onClick={() => switchMapMode("2d")}
            >
              🗺️ 2D
            </button>
          </div>

          <button
            type="button"
            className={`globe-geo-btn${geoLoading ? " globe-geo-btn-loading" : ""}`}
            onClick={handleGeolocation}
            title="موقعي"
            disabled={geoLoading}
          >
            {geoLoading ? "⏳" : "📍"}
          </button>

          <button
            type="button"
            className="globe-geo-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? "خروج من ملء الشاشة" : "ملء الشاشة"}
          >
            {isFullscreen ? "✕" : "⛶"}
          </button>

          <div className="globe-utc-pill">
            <span className="globe-utc-label">UTC</span>
            <span className="globe-utc-time">{utcTimeStr}</span>
            <span className="globe-utc-icon">🕒</span>
          </div>
        </div>

        <div className="globe-fullpage-tabs tabs">
          {PRAYER_TABS.map((p) => (
            <button
              key={p.key}
              type="button"
              className={`tab-btn${p.key === currentPrayer ? " tab-btn-active" : ""}`}
              onClick={() => setCurrentPrayer(p.key)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <p className="muted-text" style={{ margin: 0 }}>
        {isAllMode
          ? "المدن التي يُؤذَّن فيها الآن لمختلف الصلوات الخمس"
          : `المدن التي يُؤذَّن فيها الآن لصلاة ${getPrayerLabel(currentPrayer)}`}
      </p>

      {/* Body */}
      <div className="globe-fullpage-body">
        <div className="globe-fullpage-map-col">
          {/* Now strip */}
          {prayingNowList.length > 0 && (
            <div className="globe-now-strip">
              <div className="globe-now-panel-header">
                <span className="globe-now-icon">🔊</span>
                <span className="globe-now-title">
                  {isAllMode
                    ? "مدن بارزة – الكل"
                    : `يُؤذَّن الآن – ${getPrayerLabel(currentPrayer)}`}
                </span>
              </div>
              <div className="globe-now-chip-row">
                {prayingNowList.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    className="globe-now-chip"
                    onClick={() => focusOnCity(city)}
                  >
                    {city.name}
                  </button>
                ))}
                {cities.length > 12 && (
                  <span className="globe-now-more">
                    +{cities.length - 12} مدينة أخرى
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Map: 3D globe or 2D flat */}
          {mapMode === "2d" && (
            <GlobeHeader
              resetView={resetView}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              utcTimeStr={utcTimeStr}
              isAllMode={isAllMode}
              currentPrayer={currentPrayer}
            />
          )}

          <div className={`globe-map-transition${fading ? " globe-map-fading" : ""}`}>
            {mapMode === "3d" ? (
              <GlobeErrorBoundary key={mapMode} onError={handleGlobeError}>
                <Globe3DMap
                  cities={cities}
                  selected={selected}
                  setSelected={setSelected}
                  isAllMode={isAllMode}
                  loading={loading}
                  error={error}
                />
              </GlobeErrorBoundary>
            ) : (
              <Suspense fallback={<div className="globe3d-overlay"><div className="spinner" /></div>}>
                <GlobeMap
                  mapState={mapState}
                  handleMoveEnd={handleMoveEnd}
                  clusters={clusters}
                  selected={selected}
                  setSelected={setSelected}
                  setMapState={setMapState}
                  isAllMode={isAllMode}
                  currentPrayer={currentPrayer}
                  loading={loading}
                  error={error}
                />
              </Suspense>
            )}
          </div>

          <GlobeFooterStats isAllMode={isAllMode} stats={stats} />
        </div>

        {/* Right panel */}
        <div className="globe-fullpage-panel">
          <GlobeSidebar selected={selected} />
          <GlobeCitiesList
            cities={cities}
            selected={selected}
            onSelect={focusOnCity}
          />
        </div>
      </div>
    </section>
  );
}
