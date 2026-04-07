import React, { useState, useEffect, useRef } from 'react';
import { fetchCronStatus, fetchCronHistory, triggerCron } from './adminApi';

export default function CronTab() {
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);
  const confirmTimer = useRef(null);

  const loadData = () => {
    Promise.all([fetchCronStatus(), fetchCronHistory()])
      .then(([s, h]) => { setStatus(s); setHistory(h); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const handleTrigger = async () => {
    if (!confirmMode) {
      setConfirmMode(true);
      confirmTimer.current = setTimeout(() => setConfirmMode(false), 5000);
      return;
    }
    clearTimeout(confirmTimer.current);
    setConfirmMode(false);
    setTriggering(true);
    try {
      await triggerCron();
      loadData();
    } catch {} finally {
      setTriggering(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>;

  const fmtDate = (d) => d ? new Date(d).toLocaleString() : 'N/A';
  const fmtDuration = (ms) => ms ? `${(ms / 1000).toFixed(1)}s` : '-';

  return (
    <div className="cron-tab">
      <div className="tab-section-title">Cron Status</div>
      <div className="prayer-status-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '14px' }}>{fmtDate(status?.nextRun)}</div>
          <div className="stat-label">Next Run</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ fontSize: '14px' }}>{fmtDate(status?.lastRunTime)}</div>
          <div className="stat-label">Last Run</div>
        </div>
        <div className="stat-card">
          <div className={`stat-value ${status?.lastRunResult === 'success' ? 'health-good' : status?.lastRunResult === 'failed' ? 'health-bad' : ''}`}>
            {status?.lastRunResult || 'N/A'}
          </div>
          <div className="stat-label">Last Result</div>
        </div>
        <div className="stat-card">
          <div className={`stat-value ${status?.isRunning ? 'health-warn' : 'health-good'}`}>
            {status?.isRunning ? 'Running' : 'Idle'}
          </div>
          <div className="stat-label">Status</div>
        </div>
      </div>

      <div className="prayer-recompute-section">
        <button onClick={handleTrigger} disabled={triggering}
          className={`admin-btn ${confirmMode ? 'admin-btn-danger' : 'admin-btn-primary'}`}>
          {triggering ? 'Running...' : confirmMode ? 'Click again to confirm' : 'Trigger Now'}
        </button>
      </div>

      <div className="tab-section-title">Run History</div>
      <div className="prayer-stats-info">
        <div className="stat-row" style={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}>
          <span style={{ flex: 2 }}>Time</span>
          <span style={{ flex: 1 }}>Status</span>
          <span style={{ flex: 1 }}>Duration</span>
        </div>
        {history.length === 0 && <div className="admin-empty">No runs recorded yet</div>}
        {history.map(run => (
          <div key={run._id} className="stat-row">
            <span style={{ flex: 2 }}>{fmtDate(run.startedAt)}</span>
            <span style={{ flex: 1 }} className={run.status === 'success' ? 'health-good' : run.status === 'failed' ? 'health-bad' : 'health-warn'}>
              {run.status}
            </span>
            <span style={{ flex: 1 }}>{fmtDuration(run.duration)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
