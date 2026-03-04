import React, { useState, useEffect } from 'react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#6b7280', icon: '○', bg: 'rgba(107,114,128,0.1)' },
  running: { label: 'Running', color: '#f59e0b', icon: '◉', bg: 'rgba(245,158,11,0.1)' },
  completed: { label: 'Completed', color: '#10b981', icon: '✓', bg: 'rgba(16,185,129,0.1)' },
  failed: { label: 'Failed', color: '#ef4444', icon: '✗', bg: 'rgba(239,68,68,0.1)' }
};

const CATEGORY_COLORS = {
  frontend: '#3b82f6', backend: '#8b5cf6', performance: '#f59e0b',
  security: '#ef4444', ux: '#ec4899', feature: '#10b981',
  refactor: '#6366f1', testing: '#14b8a6', accessibility: '#f97316',
  seo: '#06b6d4'
};

function formatDuration(startedAt, completedAt) {
  if (!startedAt) return null;
  const end = completedAt ? new Date(completedAt) : new Date();
  const ms = end - new Date(startedAt);
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}

export default function TaskCard({ task }) {
  const [expanded, setExpanded] = useState(false);
  const [duration, setDuration] = useState(formatDuration(task.startedAt, task.completedAt));
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const catColor = CATEGORY_COLORS[task.category] || '#6b7280';

  // Live timer for running tasks
  useEffect(() => {
    if (task.status !== 'running') {
      setDuration(formatDuration(task.startedAt, task.completedAt));
      return;
    }
    const interval = setInterval(() => {
      setDuration(formatDuration(task.startedAt, null));
    }, 1000);
    return () => clearInterval(interval);
  }, [task.status, task.startedAt, task.completedAt]);

  return (
    <div
      className={`task-card task-card--${task.status}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="task-card-header">
        <div className="task-card-badges">
          <span className="task-category" style={{ background: catColor }}>
            {task.category}
          </span>
          <span className="task-batch-badge">B#{task.batchNumber}</span>
        </div>
        <div className="task-card-right">
          {duration && (
            <span className={`task-duration ${task.status === 'running' ? 'task-duration--live' : ''}`}>
              {task.status === 'running' && <span className="duration-dot" />}
              {duration}
            </span>
          )}
          <span className="task-status-badge" style={{ color: status.color, background: status.bg }}>
            {status.icon} {status.label}
          </span>
        </div>
      </div>

      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>

      <div className="task-meta">
        {task.startedAt && (
          <span>Started: {new Date(task.startedAt).toLocaleTimeString()}</span>
        )}
        {task.completedAt && (
          <span>Finished: {new Date(task.completedAt).toLocaleTimeString()}</span>
        )}
      </div>

      {expanded && (task.output || task.error) && (
        <div className={`task-output ${task.error ? 'task-output--error' : ''}`}>
          <div className="task-output-header">
            {task.error ? 'Error Output' : 'Claude Output'}
          </div>
          <pre>{task.error || task.output}</pre>
        </div>
      )}

      {!expanded && (task.output || task.error) && (
        <div className="task-expand-hint">Click to {expanded ? 'collapse' : 'expand'} output</div>
      )}
    </div>
  );
}
