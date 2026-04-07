import { formatDistance, openInMaps } from '../utils/mosqueUtils';

export default function MosqueItem({ mosque, rank }) {
  return (
    <div className="mosque-item">
      <div className="mosque-rank">{rank}</div>
      <div className="mosque-info">
        <div className="mosque-name">{mosque.name}</div>
        {mosque.address && <div className="mosque-address">{mosque.address}</div>}
      </div>
      <div className="mosque-distance">
        <span className="distance-value">{formatDistance(mosque.distance)}</span>
        <button className="directions-btn" onClick={() => openInMaps(mosque)} title="اتجاهات">
          🧭
        </button>
      </div>
    </div>
  );
}
