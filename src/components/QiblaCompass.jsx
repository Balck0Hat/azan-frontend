import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { calculateQibla, requestOrientationPermission } from '../utils/qiblaUtils';

export default function QiblaCompass() {
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) { setError('الموقع الجغرافي غير مدعوم'); setLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => { const { latitude, longitude } = position.coords; setQiblaDirection(calculateQibla(latitude, longitude)); setLoading(false); },
      () => { setQiblaDirection(calculateQibla(31.9454, 35.9284)); setError('تم استخدام موقع افتراضي'); setLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  useEffect(() => {
    const handleOrientation = (event) => { if (event.alpha !== null) setDeviceHeading(event.alpha); };
    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl p-6 shadow-lg flex flex-col items-center justify-center min-h-[280px]">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin mb-3" />
        <span className="text-sm text-[var(--text-secondary)]">جاري تحديد الموقع...</span>
      </div>
    );
  }

  const rotation = qiblaDirection - deviceHeading;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      onClick={() => requestOrientationPermission(setDeviceHeading)}
      className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-5 text-center">اتجاه القبلة</h3>

      <div className="flex justify-center mb-5">
        <div className="relative w-52 h-52">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-[var(--border-color)]" />
          <div className="absolute inset-2 rounded-full border border-[var(--border-color)]" />
          {/* Gradient glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />

          {/* Compass rotating */}
          <motion.div animate={{ rotate: -deviceHeading }} transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute inset-0 flex items-center justify-center">
            {/* Direction labels */}
            <span className="absolute top-3 text-xs font-bold text-indigo-400">ش</span>
            <span className="absolute bottom-3 text-xs font-bold text-[var(--text-muted)]">ج</span>
            <span className="absolute right-3 text-xs font-bold text-[var(--text-muted)]">شر</span>
            <span className="absolute left-3 text-xs font-bold text-[var(--text-muted)]">غ</span>

            {/* Qibla arrow */}
            <motion.div animate={{ rotate: qiblaDirection }} transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="absolute inset-0 flex flex-col items-center">
              <div className="mt-5 flex flex-col items-center">
                <div className="w-0.5 h-12 bg-gradient-to-b from-indigo-500 to-transparent rounded-full" />
              </div>
            </motion.div>
          </motion.div>

          {/* Center kaaba icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 50, damping: 20 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
              &#x1f54b;
            </motion.div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] px-4 py-2">
          <span className="text-2xl font-bold bg-gradient-to-l from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {Math.round(qiblaDirection || 0)}°
          </span>
          <span className="text-xs text-[var(--text-secondary)]">من الشمال</span>
        </div>
      </div>

      {error && <p className="text-xs text-[var(--status-warning)]/70 text-center mt-3">{error}</p>}
      <p className="text-xs text-[var(--text-muted)] text-center mt-2">وجّه هاتفك نحو الشمال ثم اتبع السهم</p>
    </motion.div>
  );
}
