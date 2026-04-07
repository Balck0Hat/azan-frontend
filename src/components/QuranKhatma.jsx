import { useState } from 'react';
import toast from 'react-hot-toast';
import QURAN_JUZ from '../data/quranJuz';
import KhatmaDetails from './KhatmaDetails';
import '../styles/quranKhatma.css';

const STORAGE_KEY = 'quranKhatma';

function getKhatmaData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { completedJuz: [], currentKhatma: 1, completedKhatmas: 0, startDate: new Date().toISOString().split('T')[0], history: [] };
  } catch { return { completedJuz: [], currentKhatma: 1, completedKhatmas: 0, startDate: new Date().toISOString().split('T')[0], history: [] }; }
}

function saveKhatmaData(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

export default function QuranKhatma() {
  const [data, setData] = useState(getKhatmaData());
  const [showDetails, setShowDetails] = useState(false);

  const toggleJuz = (juzNum) => {
    const newData = { ...data };
    const idx = newData.completedJuz.indexOf(juzNum);
    if (idx === -1) newData.completedJuz.push(juzNum); else newData.completedJuz.splice(idx, 1);
    if (newData.completedJuz.length === 30) {
      newData.completedKhatmas++; newData.history.push({ khatmaNumber: newData.currentKhatma, completedDate: new Date().toISOString().split('T')[0], startDate: newData.startDate });
      newData.completedJuz = []; newData.currentKhatma++; newData.startDate = new Date().toISOString().split('T')[0];
    }
    setData(newData); saveKhatmaData(newData);
  };

  const doReset = () => {
    const newData = { ...data, completedJuz: [], startDate: new Date().toISOString().split('T')[0] };
    setData(newData); saveKhatmaData(newData);
    toast.success('تم إعادة تعيين الختمة');
  };

  const resetKhatma = () => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center' }}>
        <span>هل تريد إعادة تعيين الختمة الحالية؟</span>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={() => { toast.dismiss(t.id); doReset(); }}
            style={{ padding: '4px 16px', borderRadius: '8px', border: 'none', background: 'var(--status-error)', color: '#fff', cursor: 'pointer' }}>
            نعم
          </button>
          <button onClick={() => toast.dismiss(t.id)}
            style={{ padding: '4px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>
            لا
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const progress = Math.round((data.completedJuz.length / 30) * 100);

  return (
    <div className="quran-khatma">
      <div className="qk-header">
        <div className="qk-title"><span className="qk-icon">📖</span><h3>ختمة القرآن</h3></div>
        <div className="qk-actions"><button className="qk-btn" onClick={() => setShowDetails(!showDetails)}>{showDetails ? '✕' : '📊'}</button></div>
      </div>

      <div className="qk-progress-section">
        <div className="qk-progress-circle">
          <svg viewBox="0 0 36 36">
            <path className="qk-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="qk-circle-fill" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className="qk-progress-text"><span className="qk-progress-value">{data.completedJuz.length}</span><span className="qk-progress-label">/ 30 جزء</span></div>
        </div>
        <div className="qk-stats">
          <div className="qk-stat"><span className="qk-stat-value">{progress}%</span><span className="qk-stat-label">مكتمل</span></div>
          <div className="qk-stat"><span className="qk-stat-value">{data.completedJuz.length * 20}</span><span className="qk-stat-label">صفحة</span></div>
          <div className="qk-stat"><span className="qk-stat-value">{data.completedKhatmas}</span><span className="qk-stat-label">ختمات</span></div>
        </div>
      </div>

      <div className="qk-juz-grid">
        {QURAN_JUZ.map((juz) => (
          <button key={juz.juz} className={`qk-juz-btn ${data.completedJuz.includes(juz.juz) ? 'completed' : ''}`} onClick={() => toggleJuz(juz.juz)} title={juz.name}>
            <span className="qk-juz-num">{juz.juz}</span>
            {data.completedJuz.includes(juz.juz) && <span className="qk-juz-check">✓</span>}
          </button>
        ))}
      </div>

      {showDetails && <KhatmaDetails data={data} onReset={resetKhatma} />}

      <div className="qk-quick-actions">
        <button className="qk-quick-btn" onClick={() => {
          const next = QURAN_JUZ.find(j => !data.completedJuz.includes(j.juz));
          if (next) toast(`الجزء التالي: ${next.juz} (${next.name}) — الصفحات: ${next.pages}`, { icon: '📍' });
        }}>📍 الجزء التالي</button>
      </div>
    </div>
  );
}
