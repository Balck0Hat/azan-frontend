import { useState, useEffect } from 'react';
import api from '../api';

/**
 * Fetch local prayer times for today.
 * @returns {{ times, city, loading, error }}
 */
export default function usePrayerTimes() {
  const [times, setTimes] = useState(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTimes = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/prayertimes/local/today');
        if (!cancelled) {
          setTimes(data.timings || data);
          setCity(data.cityName || data.city || '');
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTimes();
    return () => { cancelled = true; };
  }, []);

  return { times, city, loading, error };
}
