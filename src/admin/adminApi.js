const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://azanlive.com/api/admin'
  : 'http://localhost:4000/api/admin';

const API_ROOT = process.env.NODE_ENV === 'production'
  ? 'https://azanlive.com/api'
  : 'http://localhost:4000/api';

function getToken() { return localStorage.getItem('admin_token'); }
function setToken(token) { localStorage.setItem('admin_token', token); }
function clearToken() { localStorage.removeItem('admin_token'); }

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  });
  if (res.status === 401) { clearToken(); window.location.reload(); throw new Error('Unauthorized'); }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// Auth
export const login = (u, p) => request('/login', { method: 'POST', body: JSON.stringify({ username: u, password: p }) });

// Tasks
export const fetchTasks = (page = 1, filters = {}) => {
  const p = new URLSearchParams({ page, limit: 20 });
  if (filters.status) p.set('status', filters.status);
  if (filters.category) p.set('category', filters.category);
  if (filters.batch) p.set('batch', filters.batch);
  return request(`/tasks?${p}`);
};
export const fetchStats = () => request('/stats');
export const fetchCurrentTask = () => request('/current');
export const startWorker = () => request('/worker/start', { method: 'POST' });
export const stopWorker = () => request('/worker/stop', { method: 'POST' });
export const fetchWorkerStatus = () => request('/worker/status');

// Prayer Times
export const fetchPrayerStatus = () => request('/prayer/status');
export const forceRecompute = () => request('/prayer/recompute', { method: 'POST' });
export const fetchPrayerStats = () => request('/prayer/stats');

// Cron
export const fetchCronStatus = () => request('/cron/status');
export const fetchCronHistory = (limit = 20) => request('/cron/history?limit=' + limit);
export const triggerCron = () => request('/cron/trigger', { method: 'POST' });

// Analytics
export const fetchAnalyticsOverview = () => request('/analytics/overview');
export const fetchTopPages = () => request('/analytics/top-pages');
export const fetchCountries = () => request('/analytics/countries');
export const fetchDailyViews = () => request('/analytics/daily');

// Performance
export const fetchPerfOverview = () => request('/performance/overview');
export const fetchSlowestEndpoints = () => request('/performance/slowest');
export const fetchErrorRates = () => request('/performance/errors');
export const fetchHourlyStats = () => request('/performance/hourly');

// Logs
export const fetchLogs = (file = 'combined', params = {}) => {
  const qs = new URLSearchParams(params);
  return request(`/logs/${file}?${qs}`);
};

// Feedback
export const fetchFeedback = (page = 1, filters = {}) => {
  const p = new URLSearchParams({ page, limit: 20 });
  if (filters.status) p.set('status', filters.status);
  if (filters.type) p.set('type', filters.type);
  return request(`/feedback?${p}`);
};
export const updateFeedbackStatus = (id, status) =>
  request(`/feedback/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
export const deleteFeedback = (id) => request(`/feedback/${id}`, { method: 'DELETE' });

// Settings
export const fetchSettings = () => request('/settings');
export const updateSettings = (data) => request('/settings', { method: 'PUT', body: JSON.stringify(data) });

// Public settings (no auth)
export async function fetchPublicSettings() {
  const res = await fetch(`${API_ROOT}/settings/public`);
  if (!res.ok) return {};
  return res.json();
}

// SSE
export function subscribeSSE(onEvent) {
  const token = getToken();
  const es = new EventSource(`${API_BASE}/events?token=${encodeURIComponent(token)}`);
  es.onmessage = (e) => { try { onEvent(JSON.parse(e.data)); } catch {} };
  es.onerror = () => { es.close(); setTimeout(() => subscribeSSE(onEvent), 3000); };
  return () => es.close();
}

export { getToken, setToken, clearToken };
