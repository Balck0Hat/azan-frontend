import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchTasks, fetchStats, fetchWorkerStatus, fetchCurrentTask,
  startWorker, stopWorker, subscribeSSE, clearToken
} from './adminApi';
import CurrentTask from './CurrentTask';
import StatsGrid from './StatsGrid';
import FilterBar from './FilterBar';
import TaskCard from './TaskCard';

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [workerStatus, setWorkerStatus] = useState({});
  const [currentTask, setCurrentTask] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ status: '', category: '' });
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [taskData, statsData, statusData, currentData] = await Promise.all([
        fetchTasks(page, filters), fetchStats(),
        fetchWorkerStatus(), fetchCurrentTask()
      ]);
      setTasks(taskData.tasks);
      setTotalPages(taskData.pages);
      setStats(statsData);
      setWorkerStatus(statusData);
      setCurrentTask(currentData.task);
    } catch {} finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  // SSE live updates
  useEffect(() => {
    const unsub = subscribeSSE((evt) => {
      if (evt.type === 'task:update') {
        const t = evt.data;
        if (t.status === 'running') {
          setCurrentTask(t);
        } else if (t.status === 'completed' || t.status === 'failed') {
          setCurrentTask(null);
        }
        setTasks(prev => {
          const idx = prev.findIndex(x => x._id === t._id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = t;
            return next;
          }
          return [t, ...prev];
        });
        fetchStats().then(setStats).catch(() => {});
      }
      if (evt.type === 'worker:status') setWorkerStatus(evt.data);
      if (evt.type === 'batch:generating') setCurrentTask(null);
      if (evt.type === 'batch:generated') loadData();
    });
    return unsub;
  }, [loadData]);

  const handleStart = async () => {
    try { await startWorker(); setWorkerStatus(s => ({ ...s, running: true })); } catch {}
  };
  const handleStop = async () => {
    try { await stopWorker(); setWorkerStatus(s => ({ ...s, stopping: true })); } catch {}
  };
  const handleLogout = () => { clearToken(); window.location.reload(); };
  const handleFilterChange = (f) => { setFilters(f); setPage(1); };

  if (loading) return <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Auto-Task Engine</h1>
          <span className={`worker-badge ${workerStatus.running ? 'active' : ''}`}>
            {workerStatus.running ? (workerStatus.stopping ? 'Stopping...' : 'Running') : 'Stopped'}
          </span>
        </div>
        <div className="admin-header-right">
          <button onClick={workerStatus.running ? handleStop : handleStart}
            className={`admin-btn ${workerStatus.running ? 'admin-btn-danger' : 'admin-btn-primary'}`}>
            {workerStatus.running ? 'Stop Worker' : 'Start Worker'}
          </button>
          <button onClick={handleLogout} className="admin-btn admin-btn-ghost">Logout</button>
        </div>
      </header>

      <CurrentTask task={currentTask} />
      <StatsGrid stats={stats} workerStatus={workerStatus} />
      <FilterBar filters={filters} onChange={handleFilterChange} />

      <div className="task-list">
        {tasks.map(t => <TaskCard key={t._id} task={t} />)}
        {tasks.length === 0 && (
          <div className="admin-empty">
            {filters.status || filters.category
              ? 'No tasks match the selected filters.'
              : 'No tasks yet. Start the worker to begin.'}
          </div>
        )}
      </div>

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
