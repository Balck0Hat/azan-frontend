import { useState } from 'react';
import '../styles/adhkar.css';

const ADHKAR_DATA = {
    afterPrayer: [
        { text: 'أستغفر الله', repeat: 3 },
        { text: 'اللهم أنت السلام ومنك السلام، تباركت يا ذا الجلال والإكرام', repeat: 1 },
        { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير', repeat: 1 },
        { text: 'سبحان الله', repeat: 33 },
        { text: 'الحمد لله', repeat: 33 },
        { text: 'الله أكبر', repeat: 33 },
        { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير', repeat: 1 },
        { text: 'آية الكرسي', repeat: 1, special: true },
    ],
    morning: [
        { text: 'أصبحنا وأصبح الملك لله، والحمد لله', repeat: 1 },
        { text: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور', repeat: 1 },
        { text: 'سبحان الله وبحمده', repeat: 100 },
        { text: 'لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير', repeat: 10 },
    ],
    evening: [
        { text: 'أمسينا وأمسى الملك لله، والحمد لله', repeat: 1 },
        { text: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير', repeat: 1 },
        { text: 'سبحان الله وبحمده', repeat: 100 },
    ]
};

export default function Adhkar({ type = 'afterPrayer' }) {
    const [counts, setCounts] = useState({});
    const adhkar = ADHKAR_DATA[type] || ADHKAR_DATA.afterPrayer;

    const titles = {
        afterPrayer: 'أذكار بعد الصلاة',
        morning: 'أذكار الصباح',
        evening: 'أذكار المساء'
    };

    const handleCount = (index) => {
        const dhikr = adhkar[index];
        const current = counts[index] || 0;

        if (current < dhikr.repeat) {
            setCounts({ ...counts, [index]: current + 1 });
        }
    };

    const resetAll = () => {
        setCounts({});
    };

    const totalProgress = Object.values(counts).reduce((a, b) => a + b, 0);
    const totalRequired = adhkar.reduce((a, d) => a + d.repeat, 0);

    return (
        <div className="adhkar-card">
            <div className="adhkar-header">
                <h3 className="adhkar-title">📿 {titles[type]}</h3>
                <button className="adhkar-reset" onClick={resetAll}>↻ إعادة</button>
            </div>

            <div className="adhkar-progress">
                <div
                    className="adhkar-progress-bar"
                    style={{ width: `${(totalProgress / totalRequired) * 100}%` }}
                />
                <span className="adhkar-progress-text">{totalProgress} / {totalRequired}</span>
            </div>

            <div className="adhkar-list">
                {adhkar.map((dhikr, idx) => {
                    const current = counts[idx] || 0;
                    const completed = current >= dhikr.repeat;

                    return (
                        <div
                            key={idx}
                            className={`dhikr-item ${completed ? 'completed' : ''}`}
                            onClick={() => handleCount(idx)}
                        >
                            <div className="dhikr-text">{dhikr.text}</div>
                            <div className="dhikr-counter">
                                <span className="counter-current">{current}</span>
                                <span className="counter-sep">/</span>
                                <span className="counter-total">{dhikr.repeat}</span>
                            </div>
                            {completed && <span className="dhikr-check">✓</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
