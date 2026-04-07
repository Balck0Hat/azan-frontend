/**
 * Solar position & day/night terminator helpers.
 */

export function getSolarPosition() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  const utcH =
    now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;

  // Simplified solar declination (degrees)
  const declination =
    -23.44 * Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));

  // Sub-solar longitude
  const lng = (12 - utcH) * 15;

  return { lat: declination, lng };
}

/**
 * Convert lat/lng → THREE.js vector matching three-globe's coordinate system.
 * three-globe: Y = north pole, X/Z = equatorial plane.
 */
export function geoToVector(lat, lng) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 + lng) * Math.PI) / 180;
  return [
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  ];
}

export function getSunDirection() {
  const { lat, lng } = getSolarPosition();
  return geoToVector(lat, lng);
}
