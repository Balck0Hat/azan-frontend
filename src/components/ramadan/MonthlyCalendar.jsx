import { useState, useEffect } from "react";

const RAMADAN_START = new Date(2026, 1, 19);

export default function MonthlyCalendar({ ramadanDay }) {
    const [times, setTimes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // نجلب أوقات الفجر والمغرب لكل يوم
        const fetchTimes = async () => {
            try {
                const res = await fetch("/api/prayertimes/local/today");
                const data = await res.json();
                if (data && data.city) {
                    // نبني الجدول من اليوم 1 لليوم 30
                    const calendar = [];
                    for (let i = 0; i < 30; i++) {
                        const date = new Date(RAMADAN_START);
                        date.setDate(date.getDate() + i);
                        const dateStr = date.toISOString().split("T")[0];

                        calendar.push({
                            day: i + 1,
                            date: dateStr,
                            dateAr: date.toLocaleDateString("ar-EG", {
                                weekday: "short", day: "numeric", month: "short"
                            }),
                            fajr: data.times?.Fajr || "--:--",
                            maghrib: data.times?.Maghrib || "--:--",
                        });
                    }
                    setTimes(calendar);
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        fetchTimes();
    }, []);

    if (loading) {
        return (
            <div className="ram-card">
                <div className="ram-card-title">📅 إمساكية الشهر</div>
                <div style={{ textAlign: "center", padding: 20 }}>جاري التحميل...</div>
            </div>
        );
    }

    return (
        <div className="ram-card">
            <div className="ram-card-title">📅 إمساكية رمضان كاملة</div>
            <div className="ram-calendar-table-wrap">
                <table className="ram-calendar-table">
                    <thead>
                        <tr>
                            <th>اليوم</th>
                            <th>التاريخ</th>
                            <th>الإمساك</th>
                            <th>الإفطار</th>
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((row) => (
                            <tr
                                key={row.day}
                                className={row.day === ramadanDay ? "ram-cal-today" : ""}
                            >
                                <td className="ram-cal-day">{row.day}</td>
                                <td className="ram-cal-date">{row.dateAr}</td>
                                <td className="ram-cal-fajr">{row.fajr}</td>
                                <td className="ram-cal-maghrib">{row.maghrib}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="ram-calendar-note">
                * الأوقات تقريبية حسب موقعك — قد تختلف بدقائق
            </div>
        </div>
    );
}
