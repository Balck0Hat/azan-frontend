import { useState, useEffect } from "react";

export default function IftarReminder({ maghribTime }) {
    const [permission, setPermission] = useState("default");
    const [reminderSet, setReminderSet] = useState(false);
    const [minutesBefore, setMinutesBefore] = useState(15);

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = async () => {
        if ("Notification" in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
        }
    };

    useEffect(() => {
        if (!maghribTime || permission !== "granted" || !reminderSet) return;

        const [h, m] = maghribTime.split(":").map(Number);
        const now = new Date();
        const maghrib = new Date();
        maghrib.setHours(h, m, 0, 0);

        const reminderTime = new Date(maghrib.getTime() - minutesBefore * 60 * 1000);
        const diff = reminderTime - now;

        if (diff <= 0) return;

        const timer = setTimeout(() => {
            new Notification("وقت الدعاء قبل الإفطار 🤲", {
                body: `باقي ${minutesBefore} دقيقة على الإفطار — ادعُ الله فإن للصائم دعوة لا تُرد`,
                icon: "/favicon.ico",
            });
        }, diff);

        return () => clearTimeout(timer);
    }, [maghribTime, permission, reminderSet, minutesBefore]);

    return (
        <div className="ram-card">
            <div className="ram-card-title">🔔 تذكير الدعاء قبل الإفطار</div>
            <div className="ram-reminder-content">
                {permission !== "granted" ? (
                    <div className="ram-reminder-permission">
                        <p>فعّل الإشعارات لتلقي تذكير قبل الإفطار</p>
                        <button className="ram-reminder-btn" onClick={requestPermission}>
                            🔔 تفعيل الإشعارات
                        </button>
                    </div>
                ) : (
                    <div className="ram-reminder-settings">
                        <div className="ram-reminder-field">
                            <label>ذكّرني قبل الإفطار بـ</label>
                            <div className="ram-zakat-counter">
                                <button onClick={() => setMinutesBefore((m) => Math.max(5, m - 5))}>−</button>
                                <span>{minutesBefore} دقيقة</span>
                                <button onClick={() => setMinutesBefore((m) => Math.min(60, m + 5))}>+</button>
                            </div>
                        </div>
                        <button
                            className={"ram-reminder-btn" + (reminderSet ? " active" : "")}
                            onClick={() => setReminderSet(!reminderSet)}
                        >
                            {reminderSet ? "✓ التذكير مفعّل" : "تفعيل التذكير"}
                        </button>
                        {reminderSet && maghribTime && (
                            <div className="ram-reminder-info">
                                سيصلك تذكير قبل أذان المغرب ({maghribTime}) بـ {minutesBefore} دقيقة
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
