import React, { useState, useEffect, useRef } from 'react';
import { fetchPrayerStatus, forceRecompute, fetchPrayerStats } from './adminApi';

export default function PrayerTab() {
  const [status, setStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [recomputeResult, setRecomputeResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recomputing, setRecomputing] = useState(false);
  const [confirmMode, setConfirmMode] = useState(false);
  const confirmTimer = useRef(null);

  useEffect(() => {
    Promise.all([fetchPrayerStatus(), fetchPrayerStats()])
      .then(([s, st]) => { setStatus(s); setStats(st); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleRecompute = async () => {
    if (!confirmMode) {
      setConfirmMode(true);
      confirmTimer.current = setTimeout(() => setConfirmMode(false), 5000);
      return;
    }
    clearTimeout(confirmTimer.current);
    setConfirmMode(false);
    setRecomputing(true);
    setRecomputeResult(null);
    try {
      const result = await forceRecompute();
      setRecomputeResult(result);
      if (result.success) {
        setStatus(s => ({ ...s, todayCount: result.todayCount, tomorrowCount: result.tomorrowCount }));
      }
    } catch (err) {
      setRecomputeResult({ success: false, error: err.message });
    } finally {
      setRecomputing(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>;

  const isHealthy = status && status.todayCount > 0 && status.tomorrowCount > 0;

  return (
    <div className="prayer-tab">
      <div className="tab-section-title">Prayer Times Status</div>
      <div className="prayer-status-grid">
        <div className={`stat-card ${isHealthy ? '' : 'stat-card--warn'}`}>
          <div className={`stat-value ${isHealthy ? 'health-good' : 'health-bad'}`}>{isHealthy ? '●' : '○'}</div>
          <div className="stat-label">Health</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{status?.todayCount?.toLocaleString() || 0}</div>
          <div className="stat-label">Today ({status?.todayDate})</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{status?.tomorrowCount?.toLocaleString() || 0}</div>
          <div className="stat-label">Tomorrow ({status?.tomorrowDate})</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{status?.totalCities?.toLocaleString() || 0}</div>
          <div className="stat-label">Total Cities</div>
        </div>
      </div>

      <div className="prayer-recompute-section">
        <button onClick={handleRecompute} disabled={recomputing}
          className={`admin-btn ${confirmMode ? 'admin-btn-danger' : recomputing ? 'admin-btn-ghost' : 'admin-btn-primary'}`}>
          {recomputing ? 'Recomputing...' : confirmMode ? 'Click again to confirm' : 'Force Recompute'}
        </button>
        {recomputeResult && (
          <div className={`recompute-result ${recomputeResult.success ? 'result-success' : 'result-error'}`}>
            {recomputeResult.success
              ? `Completed${recomputeResult.duration ? ' in ' + recomputeResult.duration : ''} — Today: ${recomputeResult.todayCount}, Tomorrow: ${recomputeResult.tomorrowCount}`
              : `Failed: ${recomputeResult.error}${recomputeResult.duration ? ' (' + recomputeResult.duration + ')' : ''}`}
          </div>
        )}
      </div>

      {stats && (
        <>
          <div className="tab-section-title">Data Statistics</div>
          <div className="prayer-stats-info">
            <div className="stat-row"><span>Total Documents</span><strong>{stats.totalDocs?.toLocaleString()}</strong></div>
            <div className="stat-row"><span>Oldest Data</span><strong>{stats.oldestDate?.slice(0, 10) || 'N/A'}</strong></div>
            <div className="stat-row"><span>Newest Data</span><strong>{stats.newestDate?.slice(0, 10) || 'N/A'}</strong></div>
            {stats.dateBreakdown?.map(d => (
              <div key={d.date} className="stat-row">
                <span>{d.date}</span><strong>{d.count?.toLocaleString()} docs</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
