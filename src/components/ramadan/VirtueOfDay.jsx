// VirtueOfDay.jsx — Daily virtue/hadith display

export default function VirtueOfDay({ todayVirtue }) {
  return (
    <div className="ram-card ram-virtue">
      <div className="ram-card-title" style={{ justifyContent: "center" }}>
        ✨ فضيلة اليوم
      </div>
      <div className="ram-virtue-text">{todayVirtue.text}</div>
      <div className="ram-virtue-source">— {todayVirtue.source}</div>
    </div>
  );
}
