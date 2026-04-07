import React, { useState, useEffect } from 'react';
import { fetchAnalyticsOverview, fetchTopPages, fetchCountries, fetchDailyViews } from './adminApi';
import MiniChart from './MiniChart';

export default function AnalyticsTab() {
  const [overview, setOverview] = useState(null);
  const [topPages, setTopPages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAnalyticsOverview(), fetchTopPages(), fetchCountries(), fetchDailyViews()
    ])
      .then(([o, p, c, d]) => { setOverview(o); setTopPages(p); setCountries(c); setDaily(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>;

  return (
    <div className="analytics-tab">
      <div className="tab-section-title">Visitor Overview</div>
      <div className="prayer-status-grid">
        <div className="stat-card">
          <div className="stat-value">{overview?.todayViews?.toLocaleString() || 0}</div>
          <div className="stat-label">Views Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overview?.weekViews?.toLocaleString() || 0}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overview?.monthViews?.toLocaleString() || 0}</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{overview?.todayUnique?.toLocaleString() || 0}</div>
          <div className="stat-label">Unique Today</div>
        </div>
      </div>

      <div className="tab-section-title">Daily Views (Last 30 Days)</div>
      <MiniChart data={daily} />

      <div className="analytics-lists">
        <div className="analytics-list-card">
          <div className="analytics-list-title">Top Pages</div>
          {topPages.length === 0 && <div className="admin-empty">No data yet</div>}
          {topPages.map((p, i) => (
            <div key={p.path} className="analytics-list-row">
              <span className="analytics-rank">{i + 1}</span>
              <span className="analytics-path">{p.path}</span>
              <span className="analytics-count">{p.count.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="analytics-list-card">
          <div className="analytics-list-title">Top Countries</div>
          {countries.length === 0 && <div className="admin-empty">No data yet</div>}
          {countries.map((c, i) => (
            <div key={c.country} className="analytics-list-row">
              <span className="analytics-rank">{i + 1}</span>
              <span className="analytics-path">{c.country}</span>
              <span className="analytics-count">{c.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
