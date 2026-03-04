import React from 'react';

function formatDuration(ms) {
  if (!ms) return '—';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}

export default function StatsGrid({ stats, workerStatus }) {
  const health = stats.successRate >= 80 ? 'good' : stats.successRate >= 50 ? 'warn' : 'bad';

  return (
    <div className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#6366f1' }}>{stats.total || 0}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>{stats.completed || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#ef4444' }}>{stats.failed || 0}</div>
          <div className="stat-label">Failed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.running || 0}</div>
          <div className="stat-label">Running</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#64748b' }}>{stats.pending || 0}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#8b5cf6' }}>#{stats.currentBatch || 0}</div>
          <div className="stat-label">Current Batch</div>
        </div>
        <div className="stat-card">
          <div className={`stat-value health-${health}`}>{stats.successRate || 0}%</div>
          <div className="stat-label">Success Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#06b6d4' }}>
            {formatDuration(stats.avgDuration)}
          </div>
          <div className="stat-label">Avg Duration</div>
        </div>
      </div>
    </div>
  );
}
