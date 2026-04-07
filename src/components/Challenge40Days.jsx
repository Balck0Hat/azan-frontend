import { useState, useEffect } from 'react';
import { CHALLENGE_PRAYERS, PRAYER_NAMES, PRAYER_ICONS } from '../data/challengeData';
import ChallengeCalendar from './ChallengeCalendar';
import '../styles/challenge40days.css';

export default function Challenge40Days() {
  const [challengeData, setChallengeData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('challenge40');
    if (saved) setChallengeData(JSON.parse(saved));
  }, []);

  const startChallenge = () => {
    const d = { startDate: new Date().toISOString(), days: {}, currentStreak: 0, completed: false };
    localStorage.setItem('challenge40', JSON.stringify(d)); setChallengeData(d);
  };

  const markPrayer = (prayer) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = { ...challengeData };
    if (!updated.days[today]) updated.days[today] = {};
    updated.days[today][prayer] = !updated.days[today][prayer];
    const allPrayed = CHALLENGE_PRAYERS.every(p => updated.days[today][p]);
    if (allPrayed) {
      updated.currentStreak = Object.keys(updated.days).filter(date => CHALLENGE_PRAYERS.every(p => updated.days[date]?.[p])).length;
    }
    if (updated.currentStreak >= 40) updated.completed = true;
    localStorage.setItem('challenge40', JSON.stringify(updated)); setChallengeData(updated);
  };

  const resetChallenge = () => { localStorage.removeItem('challenge40'); setChallengeData(null); };
  const getCompleteDays = () => !challengeData ? 0 : Object.keys(challengeData.days).filter(d => CHALLENGE_PRAYERS.every(p => challengeData.days[d]?.[p])).length;

  const today = new Date().toISOString().split('T')[0];
  const todayPrayers = challengeData?.days[today] || {};

  if (!challengeData) return (
    <div className="challenge-40">
      <div className="challenge-intro">
        <div className="challenge-icon">🎯</div>
        <h3>تحدي الـ 40 يوم</h3>
        <p>قال النبي ﷺ: "من صلى أربعين يوماً في جماعة يدرك التكبيرة الأولى كتبت له براءتان: براءة من النار، وبراءة من النفاق"</p>
        <ul className="challenge-benefits"><li>✅ تعزيز الالتزام بالصلاة</li><li>✅ بناء عادة يومية</li><li>✅ تتبع تقدمك</li><li>✅ شارة خاصة عند الإكمال</li></ul>
        <button className="start-challenge-btn" onClick={startChallenge}>ابدأ التحدي الآن 🚀</button>
      </div>
    </div>
  );

  if (challengeData.completed) return (
    <div className="challenge-40">
      <div className="challenge-complete">
        <div className="complete-animation">🏆</div>
        <h3>مبروك! أكملت التحدي</h3><p>لقد أتممت صلاة 40 يوماً كاملاً</p>
        <div className="complete-badge"><span>👑</span><span>بطل الأربعين</span></div>
        <button className="restart-btn" onClick={resetChallenge}>ابدأ تحدي جديد</button>
      </div>
    </div>
  );

  const completeDays = getCompleteDays();

  return (
    <div className="challenge-40">
      <div className="challenge-header">
        <h3 className="challenge-title">🎯 تحدي الـ 40 يوم</h3>
        <div className="challenge-progress-badge"><span className="days-count">{completeDays}</span><span className="days-label">/ 40 يوم</span></div>
      </div>

      <div className="challenge-main-progress">
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${(completeDays / 40) * 100}%` }} /></div>
        <span className="progress-percent">{Math.round((completeDays / 40) * 100)}%</span>
      </div>

      <div className="today-challenge">
        <div className="today-header"><span>صلوات اليوم</span><span className="today-progress-text">{CHALLENGE_PRAYERS.filter(p => todayPrayers[p]).length}/5</span></div>
        <div className="challenge-prayers">
          {CHALLENGE_PRAYERS.map(prayer => (
            <button key={prayer} className={`challenge-prayer-btn ${todayPrayers[prayer] ? 'prayed' : ''}`} onClick={() => markPrayer(prayer)}>
              <span className="prayer-icon">{PRAYER_ICONS[prayer]}</span>
              <span className="prayer-name">{PRAYER_NAMES[prayer]}</span>
              {todayPrayers[prayer] && <span className="check-mark">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <button className="show-details-btn" onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'إخفاء التفاصيل ▲' : 'عرض التفاصيل ▼'}</button>
      {showDetails && <ChallengeCalendar challengeData={challengeData} today={today} />}
      <button className="reset-challenge-btn" onClick={resetChallenge}>إعادة تعيين</button>
    </div>
  );
}
