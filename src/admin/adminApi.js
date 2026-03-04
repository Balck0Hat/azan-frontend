const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://azanlive.com/api/admin'
  : 'http://localhost:4000/api/admin';

function getToken() {
  return localStorage.getItem('admin_token');
}

function setToken(token) {
  localStorage.setItem('admin_token', token);
}

function clearToken() {
  localStorage.removeItem('admin_token');
}

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

  if (res.status === 401) {
    clearToken();
    window.location.reload();
    throw new Error('Unauthorized');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const login = (username, password) =>
  request('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

export const fetchTasks = (page = 1, filters = {}) => {
  const params = new URLSearchParams({ page, limit: 20 });
  if (filters.status) params.set('status', filters.status);
  if (filters.category) params.set('category', filters.category);
  if (filters.batch) params.set('batch', filters.batch);
  return request(`/tasks?${params.toString()}`);
};

export const fetchStats = () => request('/stats');
export const fetchCurrentTask = () => request('/current');
export const startWorker = () => request('/worker/start', { method: 'POST' });
export const stopWorker = () => request('/worker/stop', { method: 'POST' });
export const fetchWorkerStatus = () => request('/worker/status');

export function subscribeSSE(onEvent) {
  const token = getToken();
  const url = `${API_BASE}/events?token=${encodeURIComponent(token)}`;
  const es = new EventSource(url);

  es.onmessage = (e) => {
    try {
      onEvent(JSON.parse(e.data));
    } catch {}
  };

  es.onerror = () => {
    es.close();
    setTimeout(() => subscribeSSE(onEvent), 3000);
  };

  return () => es.close();
}

export { getToken, setToken, clearToken };
