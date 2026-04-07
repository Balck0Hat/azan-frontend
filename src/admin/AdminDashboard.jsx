import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchTasks, fetchStats, fetchWorkerStatus, fetchCurrentTask,
  startWorker, stopWorker, subscribeSSE, clearToken
} from './adminApi';
import TasksTab from './TasksTab';
import PrayerTab from './PrayerTab';
import AnalyticsTab from './AnalyticsTab';
import SettingsTab from './SettingsTab';
import CronTab from './CronTab';
import FeedbackTab from './FeedbackTab';
import PerformanceTab from './PerformanceTab';
import LogsTab from './LogsTab';
import SEOTab from './SEOTab';

const TABS = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'prayer', label: 'Prayer Times' },
  { id: 'cron', label: 'Cron' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'performance', label: 'Performance' },
  { id: 'logs', label: 'Logs' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'seo', label: 'SEO' },
  { id: 'settings', label: 'Settings' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('tasks');
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
        fetchTasks(page, filters), fetchStats(), fetchWorkerStatus(), fetchCurrentTask()
      ]);
      setTasks(taskData.tasks); setTotalPages(taskData.pages);
      setStats(statsData); setWorkerStatus(statusData); setCurrentTask(currentData.task);
    } catch {} finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    const unsub = subscribeSSE((evt) => {
      if (evt.type === 'task:update') {
        const t = evt.data;
        if (t.status === 'running') setCurrentTask(t);
        else if (t.status === 'completed' || t.status === 'failed') setCurrentTask(null);
        setTasks(prev => {
          const idx = prev.findIndex(x => x._id === t._id);
          if (idx >= 0) { const next = [...prev]; next[idx] = t; return next; }
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

  const handleStart = async () => { try { await startWorker(); setWorkerStatus(s => ({ ...s, running: true })); } catch {} };
  const handleStop = async () => { try { await stopWorker(); setWorkerStatus(s => ({ ...s, stopping: true })); } catch {} };
  const handleLogout = () => { clearToken(); window.location.reload(); };

  if (loading) return <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Panel</h1>
          <span className={`worker-badge ${workerStatus.running ? 'active' : ''}`}>
            {workerStatus.running ? (workerStatus.stopping ? 'Stopping...' : 'Worker Running') : 'Worker Stopped'}
          </span>
        </div>
        <div className="admin-header-right">
          <button onClick={workerStatus.running ? handleStop : handleStart}
            className={`admin-btn ${workerStatus.running ? 'admin-btn-danger' : 'admin-btn-primary'}`}>
            {workerStatus.running ? 'Stop' : 'Start'}
          </button>
          <button onClick={handleLogout} className="admin-btn admin-btn-ghost">Logout</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {TABS.map(tab => (
          <button key={tab.id} className={`admin-tab ${activeTab === tab.id ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
        ))}
      </nav>

      {activeTab === 'tasks' && <TasksTab tasks={tasks} stats={stats} workerStatus={workerStatus} currentTask={currentTask}
        filters={filters} onFilterChange={f => { setFilters(f); setPage(1); }} page={page} totalPages={totalPages} onPageChange={setPage} />}
      {activeTab === 'prayer' && <PrayerTab />}
      {activeTab === 'cron' && <CronTab />}
      {activeTab === 'analytics' && <AnalyticsTab />}
      {activeTab === 'performance' && <PerformanceTab />}
      {activeTab === 'logs' && <LogsTab />}
      {activeTab === 'feedback' && <FeedbackTab />}
      {activeTab === 'seo' && <SEOTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </div>
  );
}
