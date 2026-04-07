import React from "react";
import { getProphet, getChild } from "./prophetsData";

function getModalIcon(person, type) {
  if (person.isLast) return "\uFDFD";
  if (type === "wife") return "\u2640";
  if (person.isProphet) return "\u2605";
  return "\u25C6";
}

const InfoItem = ({ label, value, highlight }) => (
  <div className="info-item">
    <span className="info-label">{label}</span>
    <span className={`info-value${highlight ? " highlight" : ""}`}>{value}</span>
  </div>
);

const Badge = ({ icon, label, className }) => (
  <div className={`info-badge ${className}`}>
    <span className="badge-icon">{icon}</span>
    {label}
  </div>
);

const DetailModal = ({ person, onClose, onSelect }) => {
  if (!person) return null;

  const type = person.type || "prophet";

  const handleParentClick = () => {
    const parent = getProphet(person.parent) || getChild(person.parent);
    if (parent) onSelect({ ...parent, type: "prophet" });
  };

  const parentRecord = person.parent
    ? getProphet(person.parent) || getChild(person.parent)
    : null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>{"\u2715"}</button>

        <div className="modal-header">
          <div className={`modal-icon ${person.isLast ? "last" : ""}`}>
            {getModalIcon(person, type)}
          </div>
          <h2 className="modal-name-ar">{person.nameAr}</h2>
          <h3 className="modal-name-en">{person.nameEn}</h3>
          {person.title && <div className="modal-title">{person.title}</div>}
        </div>

        <div className="modal-body">
          {person.fullStory && (
            <div className="modal-story">
              <h4>{"\u0627\u0644\u0642\u0635\u0629:"}</h4>
              <p>{person.fullStory}</p>
            </div>
          )}

          {person.description && !person.fullStory && (
            <p className="modal-description">{person.description}</p>
          )}

          <div className="modal-info-grid">
            {person.miracles && person.miracles.length > 0 && (
              <div className="info-section">
                <h4><span className="info-icon">{"\u2728"}</span> {"\u0627\u0644\u0645\u0639\u062C\u0632\u0627\u062A:"}</h4>
                <ul className="miracles-list">
                  {person.miracles.map((miracle, i) => (
                    <li key={i}>{miracle}</li>
                  ))}
                </ul>
              </div>
            )}
            {person.sentTo && <InfoItem label={"\u0623\u064F\u0631\u0633\u0644 \u0625\u0644\u0649:"} value={person.sentTo} />}
            {person.location && <InfoItem label={"\u0627\u0644\u0645\u0643\u0627\u0646:"} value={person.location} />}
            {person.lifespan && <InfoItem label={"\u0627\u0644\u0639\u0645\u0631:"} value={person.lifespan} />}
            {person.book && <InfoItem label={"\u0627\u0644\u0643\u062A\u0627\u0628:"} value={person.book} highlight />}
            {person.era && <InfoItem label={"\u0627\u0644\u062D\u0642\u0628\u0629:"} value={person.era} />}
            {person.spouse && <InfoItem label={"\u0627\u0644\u0632\u0648\u062C:"} value={person.spouse} />}
            {person.period && <InfoItem label={"\u0641\u062A\u0631\u0629 \u0627\u0644\u062E\u0644\u0627\u0641\u0629:"} value={person.period} />}
          </div>

          <div className="modal-badges">
            {person.isProphet && <Badge icon={"\uD83D\uDCD6"} label={"\u0646\u0628\u064A"} className="prophet-badge" />}
            {person.isUluAlAzm && <Badge icon={"\u2B50"} label={"\u0623\u0648\u0644\u0648 \u0627\u0644\u0639\u0632\u0645"} className="ulu-badge" />}
            {person.inQuran && <Badge icon={"\uD83D\uDCD7"} label={"\u0645\u0630\u0643\u0648\u0631 \u0641\u064A \u0627\u0644\u0642\u0631\u0622\u0646"} className="quran-badge" />}
            {person.inQuran === false && person.isProphet && <Badge icon={"\uD83D\uDCDA"} label={"\u0645\u0646 \u0627\u0644\u0633\u0646\u0629"} className="sunnah-badge" />}
            {person.isLast && <Badge icon={"\uD83C\uDF19"} label={"\u062E\u0627\u062A\u0645 \u0627\u0644\u0646\u0628\u064A\u064A\u0646"} className="last-badge" />}
            {person.diedYoung && <Badge icon={"\uD83D\uDD4A"} label={"\u062A\u0648\u0641\u064A \u0635\u063A\u064A\u0631\u0627\u064B"} className="died-badge" />}
          </div>

          {person.parent && (
            <div className="modal-lineage">
              <span className="lineage-label">{"\u0627\u0644\u0623\u0628/\u0627\u0644\u0623\u0645:"}</span>
              {parentRecord ? (
                <span className="lineage-link" onClick={handleParentClick}>
                  {parentRecord.nameAr}
                </span>
              ) : (
                <span>{person.parent}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
