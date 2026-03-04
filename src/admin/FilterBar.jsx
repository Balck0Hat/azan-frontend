import React from 'react';

const STATUSES = ['all', 'pending', 'running', 'completed', 'failed'];
const CATEGORIES = [
  'all', 'frontend', 'backend', 'performance', 'security', 'ux',
  'feature', 'refactor', 'testing', 'accessibility', 'seo'
];

const CATEGORY_COLORS = {
  frontend: '#3b82f6', backend: '#8b5cf6', performance: '#f59e0b',
  security: '#ef4444', ux: '#ec4899', feature: '#10b981',
  refactor: '#6366f1', testing: '#14b8a6', accessibility: '#f97316',
  seo: '#06b6d4', all: '#64748b'
};

const STATUS_ICONS = {
  all: '●', pending: '○', running: '◉', completed: '✓', failed: '✗'
};

export default function FilterBar({ filters, onChange }) {
  const setFilter = (key, value) => {
    onChange({ ...filters, [key]: value === 'all' ? '' : value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label className="filter-label">Status</label>
        <div className="filter-chips">
          {STATUSES.map(s => (
            <button
              key={s}
              className={`filter-chip filter-chip--status ${
                (filters.status || '') === (s === 'all' ? '' : s) ? 'active' : ''
              }`}
              onClick={() => setFilter('status', s)}
              data-status={s}
            >
              <span className="chip-icon">{STATUS_ICONS[s]}</span>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Category</label>
        <div className="filter-chips">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`filter-chip filter-chip--cat ${
                (filters.category || '') === (c === 'all' ? '' : c) ? 'active' : ''
              }`}
              onClick={() => setFilter('category', c)}
              style={
                (filters.category || '') === (c === 'all' ? '' : c)
                  ? { background: CATEGORY_COLORS[c], color: '#fff', borderColor: CATEGORY_COLORS[c] }
                  : {}
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
