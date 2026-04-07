export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('الموقع الجغرافي غير مدعوم'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)} م`;
  return `${km.toFixed(1)} كم`;
};

export const openInMaps = (mosque) => {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`, '_blank');
};

export const searchMosquesAPI = async (location) => {
  const radius = 5000;
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${location.lat},${location.lng});
      way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${location.lat},${location.lng});
    );
    out body center;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query
  });

  if (!response.ok) throw new Error('فشل في البحث');
  const data = await response.json();

  return data.elements
    .map((el) => {
      const lat = el.lat || el.center?.lat;
      const lng = el.lon || el.center?.lon;
      return {
        id: el.id,
        name: el.tags?.name || el.tags?.['name:ar'] || 'مسجد',
        lat, lng,
        distance: calculateDistance(location.lat, location.lng, lat, lng),
        address: el.tags?.['addr:street'] || '',
        phone: el.tags?.phone || ''
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);
};
