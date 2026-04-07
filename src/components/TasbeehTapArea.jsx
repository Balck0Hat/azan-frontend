export default function TasbeehTapArea({ selectedPreset, count, target, showCompleted, onTap }) {
  const progress = (count / target) * 100;

  return (
    <div
      className={`tasbeeh-tap-area ${showCompleted ? 'completed' : ''}`}
      onClick={onTap}
    >
      <div className="tasbeeh-progress-ring">
        <svg viewBox="0 0 100 100">
          <circle className="progress-bg" cx="50" cy="50" r="45" />
          <circle
            className="progress-fill"
            cx="50" cy="50" r="45"
            style={{ strokeDasharray: `${progress * 2.83} 283` }}
          />
        </svg>
      </div>

      <div className="tasbeeh-content">
        <span className="tasbeeh-text">{selectedPreset.text}</span>
        <span className="tasbeeh-count">{count}</span>
        <span className="tasbeeh-target">/ {target}</span>
      </div>

      {showCompleted && (
        <div className="completed-overlay">
          <span>🎉</span>
          <span>أحسنت!</span>
        </div>
      )}
    </div>
  );
}
