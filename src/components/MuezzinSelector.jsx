import MUEZZINS from '../data/muezzins';

export default function MuezzinSelector({ selectedMuezzin, onSelect }) {
  return (
    <div className="muezzin-selector">
      {MUEZZINS.map(muezzin => (
        <div
          key={muezzin.id}
          className={`muezzin-option ${selectedMuezzin.id === muezzin.id ? 'selected' : ''}`}
          onClick={() => onSelect(muezzin)}
        >
          <span className="muezzin-icon">{muezzin.icon}</span>
          <div className="muezzin-details">
            <span className="muezzin-name">{muezzin.name}</span>
            <span className="muezzin-desc">{muezzin.muezzin}</span>
          </div>
          {selectedMuezzin.id === muezzin.id && <span className="muezzin-check">✓</span>}
        </div>
      ))}
    </div>
  );
}
