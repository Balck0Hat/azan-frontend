import { useState } from "react";

export default function KhatmaCounter({ hijriYear }) {
    const storageKey = `ramadan-khatma-count-${hijriYear}`;
    const [count, setCount] = useState(() => {
        try { return parseInt(localStorage.getItem(storageKey)) || 0; }
        catch { return 0; }
    });

    const increment = () => {
        const next = count + 1;
        setCount(next);
        localStorage.setItem(storageKey, next);
    };

    const decrement = () => {
        const next = Math.max(0, count - 1);
        setCount(next);
        localStorage.setItem(storageKey, next);
    };

    return (
        <div className="ram-card ram-khatma-counter">
            <div className="ram-card-title">📖 عداد الختمات</div>
            <div className="ram-khatma-count-display">
                <button className="ram-khatma-btn" onClick={decrement}>−</button>
                <div className="ram-khatma-count-num">
                    <span className="ram-khatma-big-num">{count}</span>
                    <span className="ram-khatma-count-label">ختمة</span>
                </div>
                <button className="ram-khatma-btn" onClick={increment}>+</button>
            </div>
            <div className="ram-khatma-count-msg">
                {count === 0 && "ابدأ ختمتك الأولى!"}
                {count === 1 && "ما شاء الله! ختمة واحدة — واصل"}
                {count >= 2 && count < 5 && `بارك الله فيك — ${count} ختمات`}
                {count >= 5 && `ما شاء الله تبارك الله — ${count} ختمات!`}
            </div>
        </div>
    );
}
