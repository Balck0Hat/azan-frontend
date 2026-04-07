import { useState } from "react";

const SEV_CONFIG = {
  red:    { label: "Critical", color: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.3)" },
  yellow: { label: "Moderate", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
  green:  { label: "Minor",    color: "#22c55e", bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.3)" },
};

function IssueCard({ issue, onApplyFix, onDismiss }) {
  const [fixing, setFixing] = useState(false);
  const sev = SEV_CONFIG[issue.severity] || SEV_CONFIG.green;

  const handleFix = async () => {
    setFixing(true);
    await onApplyFix(issue);
    setFixing(false);
  };

  return (
    <div className="uxa-issue" style={{ borderColor: sev.border, background: sev.bg }}>
      <div className="uxa-issue-header">
        <span className="uxa-sev-badge" style={{ background: sev.color }}>{sev.label}</span>
        <strong className="uxa-issue-title">{issue.title}</strong>
      </div>
      <p className="uxa-issue-desc">{issue.description}</p>
      {issue.file_hint && <code className="uxa-file-hint">{issue.file_hint}</code>}
      {issue.suggestion && (
        <div className="uxa-suggestion">
          <span className="uxa-suggestion-label">Fix:</span> {issue.suggestion}
        </div>
      )}
      <div className="uxa-issue-actions">
        <button className="uxa-btn uxa-btn-fix" onClick={handleFix} disabled={fixing}>
          {fixing ? "Applying..." : "Apply Fix"}
        </button>
        <button className="uxa-btn uxa-btn-dismiss" onClick={() => onDismiss(issue)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function UXAuditPanel({ issues, onApplyFix, onDismiss, onRescan, onIgnore, onClose }) {
  const counts = { red: 0, yellow: 0, green: 0 };
  issues.forEach((i) => { if (counts[i.severity] != null) counts[i.severity]++; });

  return (
    <div className="uxa-panel">
      <div className="uxa-panel-header">
        <span className="uxa-panel-title">UX Audit Report</span>
        <div className="uxa-panel-counts">
          {counts.red > 0 && <span className="uxa-count" style={{ color: "#ef4444" }}>{counts.red} critical</span>}
          {counts.yellow > 0 && <span className="uxa-count" style={{ color: "#f59e0b" }}>{counts.yellow} moderate</span>}
          {counts.green > 0 && <span className="uxa-count" style={{ color: "#22c55e" }}>{counts.green} minor</span>}
        </div>
        <button className="uxa-btn uxa-btn-sm" onClick={onClose}>✕</button>
      </div>

      <div className="uxa-panel-toolbar">
        <button className="uxa-btn uxa-btn-rescan" onClick={onRescan}>Re-scan</button>
        <button className="uxa-btn uxa-btn-ignore" onClick={onIgnore}>Ignore Page</button>
      </div>

      <div className="uxa-issues-list">
        {issues.length === 0 && (
          <div className="uxa-empty">No issues found. Page looks great!</div>
        )}
        {issues.map((issue, idx) => (
          <IssueCard
            key={`${issue.title}-${idx}`}
            issue={issue}
            onApplyFix={onApplyFix}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
}
