import React, { useState, useEffect, useCallback, useRef } from 'react';
import { fetchLogs } from './adminApi';

const LEVELS = ['all', 'error', 'warn', 'info'];
const LEVEL_COLORS = { error: '#ef4444', warn: '#f59e0b', info: '#6366f1', unknown: '#64748b' };
const LINE_OPTIONS = [50, 100, 200, 500];

export default function LogsTab() {
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState('combined');
  const [level, setLevel] = useState('all');
  const [search, setSearch] = useState('');
  const [lines, setLines] = useState(100);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const searchDebounce = useRef(null);

  const load = useCallback(async () => {
    try {
      const params = { lines };
      if (level !== 'all') params.level = level;
      if (search) params.search = search;
      const data = await fetchLogs(file, params);
      setLogs(data);
    } catch {} finally { setLoading(false); }
  }, [file, level, search, lines]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, [autoRefresh, load]);

  const handleSearch = (val) => {
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => setSearch(val), 300);
  };

  return (
    <div className="logs-tab">
      <div className="tab-section-title">Server Logs</div>
      <div className="logs-controls">
        <div className="filter-chips">
          <button className={`filter-chip ${file === 'combined' ? 'active' : ''}`} onClick={() => setFile('combined')}>Combined</button>
          <button className={`filter-chip ${file === 'error' ? 'active' : ''}`} onClick={() => setFile('error')}>Errors Only</button>
        </div>
        <div className="filter-chips">
          {LEVELS.map(l => (
            <button key={l} className={`filter-chip ${level === l ? 'active' : ''}`} onClick={() => setLevel(l)}>{l}</button>
          ))}
        </div>
        <input className="settings-input" placeholder="Search logs..." onChange={e => handleSearch(e.target.value)} style={{ maxWidth: 200 }} />
        <select className="settings-input" value={lines} onChange={e => setLines(Number(e.target.value))} style={{ maxWidth: 80 }}>
          {LINE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button className={`admin-btn ${autoRefresh ? 'admin-btn-primary' : 'admin-btn-ghost'}`} onClick={() => setAutoRefresh(!autoRefresh)}>
          {autoRefresh ? 'Auto ON' : 'Auto OFF'}
        </button>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>
      ) : (
        <div className="logs-container">
          {logs.length === 0 && <div className="admin-empty">No log entries</div>}
          {logs.map((entry, i) => (
            <div key={i} className="log-line">
              <span className="log-level" style={{ color: LEVEL_COLORS[entry.level] || '#64748b' }}>[{entry.level}]</span>
              <span className="log-timestamp">{entry.timestamp}</span>
              <span className="log-message">{entry.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
