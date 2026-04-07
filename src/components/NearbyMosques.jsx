import { useState } from 'react';
import { getUserLocation, searchMosquesAPI } from '../utils/mosqueUtils';
import MosqueItem from './MosqueItem';
import '../styles/nearbyMosques.css';

export default function NearbyMosques() {
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const searchMosques = async () => {
    setLoading(true);
    setError(null);
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      const results = await searchMosquesAPI(location);
      setMosques(results);
    } catch (err) {
      setError(err.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nearby-mosques">
      <div className="mosques-header">
        <h3 className="mosques-title">🕌 أقرب المساجد</h3>
        <button className="search-mosques-btn" onClick={searchMosques} disabled={loading}>
          {loading ? '🔄 جاري البحث...' : '📍 ابحث الآن'}
        </button>
      </div>

      {error && (
        <div className="mosques-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {!loading && mosques.length === 0 && !error && (
        <div className="mosques-empty">
          <span className="empty-icon">🗺️</span>
          <p>اضغط على "ابحث الآن" للعثور على المساجد القريبة منك</p>
          <small>يتطلب السماح بالوصول للموقع</small>
        </div>
      )}

      {loading && (
        <div className="mosques-loading">
          <div className="loading-spinner"></div>
          <p>جاري البحث عن المساجد...</p>
        </div>
      )}

      {mosques.length > 0 && (
        <div className="mosques-list">
          {mosques.map((mosque, idx) => (
            <MosqueItem key={mosque.id} mosque={mosque} rank={idx + 1} />
          ))}
        </div>
      )}

      {userLocation && mosques.length > 0 && (
        <div className="mosques-map-link">
          <a
            href={`https://www.google.com/maps/search/mosque/@${userLocation.lat},${userLocation.lng},14z`}
            target="_blank"
            rel="noopener noreferrer"
          >
            🗺️ عرض الكل على الخريطة
          </a>
        </div>
      )}
    </div>
  );
}
