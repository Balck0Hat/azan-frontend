import React from "react";

function getIcon(person, type, isLast) {
  if (isLast) return "\uFDFD";
  if (type === "wife") return "\u2640";
  if (type === "child" || type === "grandchild") return person.isFemale ? "\u2640" : "\u2642";
  if (type === "khalifa") return "\u2694";
  if (person.isProphet) return "\u2605";
  if (person.isUluAlAzm) return "\u2B50";
  return "\u25C6";
}

const PersonCard = ({ person, type = "prophet", isMain, isLast, size = "normal", onSelect }) => {
  if (!person) return null;

  const cardClass = [
    "prophet-card",
    size,
    person.isProphet ? "is-prophet" : "is-ancestor",
    isMain ? "main-line" : "",
    isLast ? "last-prophet" : "",
    type === "wife" ? "wife-card" : "",
    type === "khalifa" ? "khalifa-card" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClass} onClick={() => onSelect({ ...person, type })}>
      <div className="prophet-icon">{getIcon(person, type, isLast)}</div>
      <div className="prophet-name-ar">{person.nameAr}</div>
      <div className="prophet-name-en">{person.nameEn}</div>
      {person.title && <div className="prophet-title">{person.title}</div>}
      {person.inQuran === false && person.isProphet && (
        <div className="not-in-quran-badge">{"\u0645\u0646 \u0627\u0644\u0633\u0646\u0629"}</div>
      )}
    </div>
  );
};

export default PersonCard;
