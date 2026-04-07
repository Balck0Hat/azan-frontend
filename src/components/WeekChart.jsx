export default function WeekChart({ weekStats, totalPrayed }) {
  return (
    <div className="week-stats">
      <h4 className="week-title">إحصائيات الأسبوع</h4>

      <div className="week-chart">
        {weekStats.map((day, idx) => (
          <div key={idx} className="day-bar">
            <div className="bar-container">
              <div className="bar-fill" style={{ height: `${(day.prayed / 5) * 100}%` }} />
            </div>
            <span className="day-label">{day.day}</span>
            <span className="day-count">{day.prayed}</span>
          </div>
        ))}
      </div>

      <div className="week-summary">
        <div className="summary-item">
          <span className="summary-value">{totalPrayed}</span>
          <span className="summary-label">صلاة هذا الأسبوع</span>
        </div>
        <div className="summary-item">
          <span className="summary-value">{Math.round((totalPrayed / 35) * 100)}%</span>
          <span className="summary-label">نسبة الالتزام</span>
        </div>
      </div>
    </div>
  );
}
