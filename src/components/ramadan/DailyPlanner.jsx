import { useState } from "react";
import { dailyPlanItems } from "../../data/ramadanData";

export default function DailyPlanner({ ramadanDay, hijriYear }) {
    const storageKey = `ramadan-planner-${hijriYear}`;
    const [checkedItems, setCheckedItems] = useState(() => {
        try {
            const data = JSON.parse(localStorage.getItem(storageKey)) || {};
            return data[ramadanDay] || [];
        } catch { return []; }
    });

    const toggle = (itemId) => {
        setCheckedItems((prev) => {
            const next = prev.includes(itemId)
                ? prev.filter((id) => id !== itemId)
                : [...prev, itemId];
            // حفظ لكل يوم
            const allData = JSON.parse(localStorage.getItem(storageKey) || "{}");
            allData[ramadanDay] = next;
            localStorage.setItem(storageKey, JSON.stringify(allData));
            return next;
        });
    };

    const completedCount = checkedItems.length;
    const totalCount = dailyPlanItems.length;
    const progress = Math.round((completedCount / totalCount) * 100);

    return (
        <div className="ram-card">
            <div className="ram-card-title">📋 المخطط اليومي — يوم {ramadanDay}</div>
            <div className="ram-planner-progress">
                <div className="ram-progress-label">
                    <span>{completedCount} من {totalCount} عبادة</span>
                    <span>{progress}%</span>
                </div>
                <div className="ram-progress-bar">
                    <div className="ram-progress-fill" style={{ width: `${progress}%` }} />
                </div>
            </div>
            <div className="ram-planner-list">
                {dailyPlanItems.map((item) => (
                    <div
                        key={item.id}
                        className={
                            "ram-planner-item" +
                            (checkedItems.includes(item.id) ? " checked" : "")
                        }
                        onClick={() => toggle(item.id)}
                    >
                        <div className="ram-planner-check">
                            {checkedItems.includes(item.id) ? "✓" : ""}
                        </div>
                        <span className="ram-planner-icon">{item.icon}</span>
                        <span className="ram-planner-label">{item.label}</span>
                        <span className="ram-planner-cat">{item.category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
