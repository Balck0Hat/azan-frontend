import React, { useState, useEffect } from 'react';

const CATEGORY_COLORS = {
  frontend: '#3b82f6', backend: '#8b5cf6', performance: '#f59e0b',
  security: '#ef4444', ux: '#ec4899', feature: '#10b981',
  refactor: '#6366f1', testing: '#14b8a6', accessibility: '#f97316',
  seo: '#06b6d4'
};

function formatElapsed(startedAt) {
  if (!startedAt) return '0s';
  const ms = Date.now() - new Date(startedAt).getTime();
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s`;
}

export default function CurrentTask({ task }) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    if (!task?.startedAt) return;
    setElapsed(formatElapsed(task.startedAt));
    const interval = setInterval(() => {
      setElapsed(formatElapsed(task.startedAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [task?.startedAt]);

  if (!task) {
    return (
      <div className="current-task current-task--idle">
        <div className="current-task-icon">&#9679;</div>
        <div className="current-task-info">
          <div className="current-task-label">Idle</div>
          <div className="current-task-sublabel">No task running — start the worker or wait for next batch</div>
        </div>
      </div>
    );
  }

  const catColor = CATEGORY_COLORS[task.category] || '#6b7280';

  return (
    <div className="current-task current-task--active">
      <div className="current-task-spinner">
        <div className="spinner-ring" />
      </div>
      <div className="current-task-info">
        <div className="current-task-label">Currently Executing</div>
        <h3 className="current-task-title">{task.title}</h3>
        <p className="current-task-desc">{task.description}</p>
        <div className="current-task-meta">
          <span className="current-task-cat" style={{ background: catColor }}>
            {task.category}
          </span>
          <span className="current-task-batch">Batch #{task.batchNumber}</span>
          <span className="current-task-elapsed">{elapsed}</span>
        </div>
      </div>
    </div>
  );
}
