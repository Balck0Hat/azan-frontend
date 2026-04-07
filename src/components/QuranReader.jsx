import { useState, useEffect } from 'react';
import SURAHS from '../data/readerSurahs';
import '../styles/quranReader.css';

export default function QuranReader() {
  const [progress, setProgress] = useState({});
  const [totalJuz, setTotalJuz] = useState(0);
  const [showSurahs, setShowSurahs] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('quranProgress') || '{}');
    setProgress(saved);
    const juzCompleted = new Set();
    Object.keys(saved).forEach(surahNum => {
      const surah = SURAHS.find(s => s.num === parseInt(surahNum));
      if (surah && saved[surahNum] >= surah.verses) juzCompleted.add(surah.juz);
    });
    setTotalJuz(juzCompleted.size);
  }, [progress]);

  const loadSurah = async (surah) => {
    setSelectedSurah(surah); setLoading(true);
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah.num}/ar.alafasy`);
      const data = await res.json();
      if (data.code === 200) setVerses(data.data.ayahs);
    } catch (err) { console.error('Error loading surah:', err); }
    finally { setLoading(false); }
  };

  const markVerse = (surahNum, verseNum) => {
    const updated = { ...progress }; updated[surahNum] = Math.max(updated[surahNum] || 0, verseNum);
    setProgress(updated); localStorage.setItem('quranProgress', JSON.stringify(updated));
  };

  const getSurahProgress = (surah) => ((progress[surah.num] || 0) / surah.verses) * 100;
  const getTotalProgress = () => {
    const total = SURAHS.reduce((a, s) => a + s.verses, 0);
    const read = Object.keys(progress).reduce((a, k) => a + Math.min(progress[k], SURAHS.find(s => s.num === parseInt(k))?.verses || 0), 0);
    return (read / total) * 100;
  };

  return (
    <div className="quran-reader">
      <div className="quran-header">
        <h3 className="quran-title">📖 ختمة القرآن</h3>
        <div className="quran-stats"><span className="juz-badge">{totalJuz}/30 جزء</span></div>
      </div>

      <div className="quran-main-progress">
        <div className="progress-info"><span>التقدم الكلي</span><span>{Math.round(getTotalProgress())}%</span></div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${getTotalProgress()}%` }} /></div>
      </div>

      <button className="toggle-surahs-btn" onClick={() => setShowSurahs(!showSurahs)}>{showSurahs ? 'إخفاء السور ▲' : 'عرض السور ▼'}</button>

      {showSurahs && !selectedSurah && (
        <div className="surahs-grid">
          {SURAHS.map(surah => (
            <button key={surah.num} className={`surah-item ${getSurahProgress(surah) === 100 ? 'completed' : ''}`} onClick={() => loadSurah(surah)}>
              <span className="surah-num">{surah.num}</span>
              <div className="surah-info"><span className="surah-name">{surah.name}</span><span className="surah-verses">{surah.verses} آية</span></div>
              <div className="surah-progress-bar"><div className="surah-progress-fill" style={{ width: `${getSurahProgress(surah)}%` }} /></div>
            </button>
          ))}
        </div>
      )}

      {selectedSurah && (
        <div className="surah-view">
          <div className="surah-header">
            <button className="back-btn" onClick={() => setSelectedSurah(null)}>→ العودة</button>
            <h4>{selectedSurah.name}</h4>
            <span className="verse-count">{progress[selectedSurah.num] || 0}/{selectedSurah.verses}</span>
          </div>
          {loading ? (
            <div className="surah-loading"><div className="spinner"></div><p>جاري تحميل السورة...</p></div>
          ) : (
            <div className="verses-container">
              {selectedSurah.num !== 1 && selectedSurah.num !== 9 && <div className="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>}
              <div className="verses-text">
                {verses.map((verse, idx) => (
                  <span key={idx} className={`verse ${(progress[selectedSurah.num] || 0) >= verse.numberInSurah ? 'read' : ''}`}
                    onClick={() => markVerse(selectedSurah.num, verse.numberInSurah)}>
                    {verse.text}<span className="verse-number">﴿{verse.numberInSurah}﴾</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button className="reset-quran-btn" onClick={() => { setProgress({}); localStorage.removeItem('quranProgress'); }}>إعادة تعيين التقدم</button>
    </div>
  );
}
