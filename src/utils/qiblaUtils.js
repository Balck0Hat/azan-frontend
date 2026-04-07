export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

export const calculateQibla = (lat, lng) => {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
  const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

  const y = Math.sin(kaabaLngRad - lngRad);
  const x = Math.cos(latRad) * Math.tan(kaabaLatRad) -
            Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

  let qibla = Math.atan2(y, x) * (180 / Math.PI);
  return (qibla + 360) % 360;
};

export const requestOrientationPermission = async (onHeading) => {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', (e) => {
          if (e.alpha !== null) onHeading(e.alpha);
        });
      }
    } catch (err) {
      console.error('خطأ في طلب إذن البوصلة:', err);
    }
  }
};
