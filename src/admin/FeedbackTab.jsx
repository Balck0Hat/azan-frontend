import React, { useState, useEffect, useCallback } from 'react';
import { fetchFeedback, updateFeedbackStatus, deleteFeedback } from './adminApi';

const STATUSES = ['', 'new', 'read', 'resolved'];
const TYPES = ['', 'bug', 'suggestion', 'general'];
const STATUS_COLORS = { new: '#6366f1', read: '#f59e0b', resolved: '#10b981' };
const TYPE_COLORS = { bug: '#ef4444', suggestion: '#6366f1', general: '#64748b' };

export default function FeedbackTab() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', type: '' });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchFeedback(page, filters);
      setItems(data.feedback);
      setTotalPages(data.pages);
    } catch {} finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id, status) => {
    try { await updateFeedbackStatus(id, status); load(); } catch {}
  };

  const handleDelete = async (id) => {
    try { await deleteFeedback(id); load(); } catch {}
  };

  const setFilter = (key, val) => { setFilters(f => ({ ...f, [key]: f[key] === val ? '' : val })); setPage(1); };

  if (loading) return <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>;

  return (
    <div className="feedback-tab">
      <div className="tab-section-title">Feedback</div>
      <div className="filter-bar" style={{ marginBottom: 16 }}>
        <div className="filter-group">
          <span className="filter-label">Status</span>
          <div className="filter-chips">
            {STATUSES.filter(Boolean).map(s => (
              <button key={s} className={`filter-chip ${filters.status === s ? 'active' : ''}`}
                onClick={() => setFilter('status', s)}>{s}</button>
            ))}
          </div>
        </div>
        <div className="filter-group">
          <span className="filter-label">Type</span>
          <div className="filter-chips">
            {TYPES.filter(Boolean).map(t => (
              <button key={t} className={`filter-chip ${filters.type === t ? 'active' : ''}`}
                onClick={() => setFilter('type', t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {items.length === 0 && <div className="admin-empty">No feedback yet</div>}
      {items.map(item => (
        <div key={item._id} className="feedback-card">
          <div className="feedback-card-header">
            <div className="feedback-card-badges">
              <span className="task-category" style={{ background: TYPE_COLORS[item.type] || '#64748b' }}>{item.type}</span>
              <span className="task-category" style={{ background: STATUS_COLORS[item.status] || '#64748b' }}>{item.status}</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--admin-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="feedback-meta">{item.name}{item.email ? ` · ${item.email}` : ''}</div>
          <div className="feedback-message">{item.message}</div>
          <div className="feedback-actions">
            {item.status !== 'read' && <button className="admin-btn admin-btn-ghost" onClick={() => handleStatus(item._id, 'read')}>Mark Read</button>}
            {item.status !== 'resolved' && <button className="admin-btn admin-btn-ghost" onClick={() => handleStatus(item._id, 'resolved')}>Resolve</button>}
            <button className="admin-btn admin-btn-ghost" style={{ color: 'var(--admin-danger)' }} onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="admin-pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <span>Page {page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
