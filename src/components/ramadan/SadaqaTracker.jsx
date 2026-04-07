import { useState } from "react";

export default function SadaqaTracker({ hijriYear }) {
    const storageKey = `ramadan-sadaqa-${hijriYear}`;
    const [entries, setEntries] = useState(() => {
        try { return JSON.parse(localStorage.getItem(storageKey)) || []; }
        catch { return []; }
    });
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    const total = entries.reduce((sum, e) => sum + e.amount, 0);

    const addEntry = () => {
        if (!amount || Number(amount) <= 0) return;
        const newEntry = {
            id: Date.now(),
            amount: Number(amount),
            note: note || "صدقة",
            date: new Date().toLocaleDateString("ar-EG"),
        };
        const updated = [newEntry, ...entries];
        setEntries(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        setAmount("");
        setNote("");
    };

    const removeEntry = (id) => {
        const updated = entries.filter((e) => e.id !== id);
        setEntries(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
    };

    return (
        <div className="ram-card">
            <div className="ram-card-title">🤲 متتبع الصدقات</div>
            <div className="ram-sadaqa-total">
                <div className="ram-stat-number">{total.toLocaleString()}</div>
                <div className="ram-stat-label">إجمالي الصدقات</div>
            </div>
            <div className="ram-sadaqa-form">
                <input
                    type="number"
                    placeholder="المبلغ"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addEntry()}
                />
                <input
                    type="text"
                    placeholder="ملاحظة (اختياري)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addEntry()}
                />
                <button onClick={addEntry}>+ إضافة</button>
            </div>
            {entries.length > 0 && (
                <div className="ram-sadaqa-list">
                    {entries.slice(0, 10).map((entry) => (
                        <div key={entry.id} className="ram-sadaqa-item">
                            <div className="ram-sadaqa-item-info">
                                <span className="ram-sadaqa-amount">{entry.amount.toLocaleString()}</span>
                                <span className="ram-sadaqa-note">{entry.note}</span>
                            </div>
                            <div className="ram-sadaqa-item-actions">
                                <span className="ram-sadaqa-date">{entry.date}</span>
                                <button
                                    className="ram-sadaqa-remove"
                                    onClick={() => removeEntry(entry.id)}
                                >✕</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
