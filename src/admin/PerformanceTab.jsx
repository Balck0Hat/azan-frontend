import React, { useState, useEffect } from 'react';
import { fetchPerfOverview, fetchSlowestEndpoints, fetchErrorRates, fetchHourlyStats } from './adminApi';
import MiniChart from './MiniChart';

export default function PerformanceTab() {
  const [overview, setOverview] = useState(null);
  const [slowest, setSlowest] = useState([]);
  const [errors, setErrors] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPerfOverview(), fetchSlowestEndpoints(), fetchErrorRates(), fetchHourlyStats()])
      .then(([o, s, e, h]) => { setOverview(o); setSlowest(s); setErrors(e); setHourly(h); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>;

  const hourlyChart = hourly.map(h => ({ date: `${h.hour}:00`, count: h.count }));

  return (
    <div className="performance-tab">
      <div className="tab-section-title">API Overview (Today)</div>
      <div className="prayer-status-grid">
        <div className="stat-card">
          <div className="stat-value">{overview?.totalToday?.toLocaleString() || 0}</div>
          <div className="stat-label">Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overview?.avgResponseTime || 0}ms</div>
          <div className="stat-label">Avg Response</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overview?.errorCount || 0}</div>
          <div className="stat-label">Errors</div>
        </div>
        <div className="stat-card">
          <div className={`stat-value ${Number(overview?.errorRate) > 5 ? 'health-bad' : 'health-good'}`}>
            {overview?.errorRate || 0}%
          </div>
          <div className="stat-label">Error Rate</div>
        </div>
      </div>

      <div className="tab-section-title">Hourly Requests (24h)</div>
      <MiniChart data={hourlyChart} />

      <div className="analytics-lists">
        <div className="analytics-list-card">
          <div className="analytics-list-title">Slowest Endpoints (7d avg)</div>
          {slowest.length === 0 && <div className="admin-empty">No data yet</div>}
          {slowest.map((s, i) => (
            <div key={i} className="analytics-list-row">
              <span className="analytics-rank">{i + 1}</span>
              <span className="analytics-path">{s.method} {s.path}</span>
              <span className="analytics-count">{s.avgDuration}ms</span>
            </div>
          ))}
        </div>

        <div className="analytics-list-card">
          <div className="analytics-list-title">Top Errors (7d)</div>
          {errors.length === 0 && <div className="admin-empty">No errors</div>}
          {errors.map((e, i) => (
            <div key={i} className="analytics-list-row">
              <span className="analytics-rank" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>{e.statusCode}</span>
              <span className="analytics-path">{e.path}</span>
              <span className="analytics-count">{e.count}x</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
