import { useRef, useEffect, useCallback, useMemo, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { PRAYER_COLORS, getPrayerLabel, formatHM } from "./globeUtils";
import { getSunDirection } from "./terminatorUtils";
import "../../../styles/globe3d.css";

const EARTH_IMG =
  "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const BUMP_IMG =
  "//unpkg.com/three-globe/example/img/earth-topology.png";
const BG_IMG =
  "//unpkg.com/three-globe/example/img/night-sky.png";
const GLOBE_R = 100;

export default function Globe3DMap({
  cities, selected, setSelected, isAllMode, loading, error,
}) {
  const globeRef = useRef();
  const containerRef = useRef();
  const [inited, setInited] = useState(false);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  /* ── measure container with ResizeObserver ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setDims({ width: Math.floor(width), height: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── check prefers-reduced-motion ── */
  const prefersReducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  /* ── initialise controls ── */
  useEffect(() => {
    const gl = globeRef.current;
    if (!gl) return;
    gl.controls().autoRotate = !prefersReducedMotion;
    gl.controls().autoRotateSpeed = 0.35;
    gl.controls().enableDamping = true;
    const isMobile = dims.width > 0 && dims.width < 500;
    gl.pointOfView({ lat: 25, lng: 45, altitude: isMobile ? 1.6 : 2.2 });
    setInited(true);
  }, [dims.width, prefersReducedMotion]);

  /* ── focus selected city ── */
  useEffect(() => {
    if (!selected || !inited) return;
    const isMobile = dims.width > 0 && dims.width < 500;
    globeRef.current?.pointOfView(
      { lat: selected.coords[1], lng: selected.coords[0], altitude: isMobile ? 1.4 : 1.8 },
      800,
    );
  }, [selected, inited, dims.width]);

  /* ── point colour ── */
  const pointColor = useCallback(
    (c) => {
      if (isAllMode) return PRAYER_COLORS[c.prayerKey] || "#22c55e";
      if (c.isNow) return "#22c55e";
      return c.status === "day" ? "#fbbf24" : "#60a5fa";
    },
    [isAllMode],
  );

  /* ── tooltip HTML ── */
  const pointLabel = useCallback((c) => {
    const prayer = c.prayerKey ? getPrayerLabel(c.prayerKey) : "";
    const time = c.localTime ? formatHM(c.localTime) : "";
    return `<div class="globe3d-tip">
      <strong>${c.name}</strong>
      <span>${c.country || ""}</span>
      ${prayer ? `<em>${prayer}</em>` : ""}
      ${time ? `<span class="globe3d-tip-time">${time}</span>` : ""}
    </div>`;
  }, []);

  /* ── night-shadow overlay (custom Three.js shader) ── */
  const nightMesh = useMemo(() => {
    const dir = getSunDirection();
    const geo = new THREE.SphereGeometry(GLOBE_R + 0.3, 64, 64);
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uSun: { value: new THREE.Vector3(...dir) } },
      vertexShader: `
        varying vec3 vPos;
        void main(){
          vPos = normalize((modelMatrix * vec4(position,1.0)).xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
      fragmentShader: `
        uniform vec3 uSun;
        varying vec3 vPos;
        void main(){
          float d = dot(vPos, normalize(uSun));
          float shadow = smoothstep(0.05, -0.18, d);
          gl_FragColor = vec4(0.0, 0.0, 0.06, shadow * 0.52);
        }`,
    });
    return new THREE.Mesh(geo, mat);
  }, []);

  /* update sun direction every minute */
  useEffect(() => {
    const id = setInterval(() => {
      const d = getSunDirection();
      nightMesh.material.uniforms.uSun.value.set(...d);
    }, 60_000);
    return () => clearInterval(id);
  }, [nightMesh]);

  return (
    <div className="globe3d-container" ref={containerRef}>
      {dims.width > 0 && dims.height > 0 && (
        <Globe
          ref={globeRef}
          width={dims.width}
          height={dims.height}
          globeImageUrl={EARTH_IMG}
          bumpImageUrl={BUMP_IMG}
          backgroundImageUrl={BG_IMG}
          atmosphereColor="#10b981"
          atmosphereAltitude={0.18}
          animateIn={!prefersReducedMotion}
          /* city points */
          pointsData={cities}
          pointLat={(d) => d.coords[1]}
          pointLng={(d) => d.coords[0]}
          pointColor={pointColor}
          pointRadius={(d) =>
            selected?.id === d.id ? 0.45 : d.isNow ? 0.28 : 0.12
          }
          pointAltitude={(d) => (d.isNow ? 0.025 : 0.004)}
          pointLabel={pointLabel}
          onPointClick={(city) => setSelected(city)}
          /* night shadow */
          customLayerData={[{}]}
          customThreeObject={() => nightMesh}
        />
      )}

      {loading && (
        <div className="globe3d-overlay"><div className="spinner" /></div>
      )}
      {error && <div className="globe3d-error">{error}</div>}
    </div>
  );
}
