import { useState, useEffect } from 'react';
import { calculateQibla, requestOrientationPermission } from '../utils/qiblaUtils';
import '../styles/qiblaCompass.css';

export default function QiblaCompass() {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('الموقع الجغرافي غير مدعوم');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setQiblaDirection(calculateQibla(latitude, longitude));
        setLoading(false);
      },
      () => {
        setQiblaDirection(calculateQibla(31.9454, 35.9284));
        setError('تم استخدام موقع افتراضي');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const handleOrientation = (event) => {
      if (event.alpha !== null) setDeviceHeading(event.alpha);
    };

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  if (loading) {
    return (
      <div className="qibla-card qibla-loading">
        <div className="qibla-spinner"></div>
        <span>جاري تحديد الموقع...</span>
      </div>
    );
  }

  return (
    <div className="qibla-card" onClick={() => requestOrientationPermission(setDeviceHeading)}>
      <h3 className="qibla-title">🧭 اتجاه القبلة</h3>

      <div className="qibla-compass-container">
        <div className="qibla-compass" style={{ transform: `rotate(${-deviceHeading}deg)` }}>
          <div className="compass-directions">
            <span className="direction north">ش</span>
            <span className="direction east">شر</span>
            <span className="direction south">ج</span>
            <span className="direction west">غ</span>
          </div>
          <div className="qibla-arrow" style={{ transform: `rotate(${qiblaDirection}deg)` }}>
            <div className="arrow-head">🕋</div>
          </div>
          <div className="compass-ring outer"></div>
          <div className="compass-ring inner"></div>
        </div>
      </div>

      <div className="qibla-info">
        <div className="qibla-degree">
          <span className="degree-value">{Math.round(qiblaDirection || 0)}°</span>
          <span className="degree-label">من الشمال</span>
        </div>
      </div>

      {error && <p className="qibla-note">{error}</p>}
      <p className="qibla-tip">💡 وجّه هاتفك نحو الشمال ثم اتبع السهم</p>
    </div>
  );
}
