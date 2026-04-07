import { useState, useEffect } from 'react';
import '../styles/hijriCalendar.css';

// أسماء الأشهر الهجرية
const HIJRI_MONTHS = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

// أسماء أيام الأسبوع
const WEEKDAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

// المناسبات الإسلامية (شهر-يوم)
const ISLAMIC_EVENTS = {
    '1-1': { name: 'رأس السنة الهجرية', icon: '🌙' },
    '1-10': { name: 'يوم عاشوراء', icon: '📿' },
    '3-12': { name: 'المولد النبوي', icon: '🌟' },
    '7-27': { name: 'ليلة الإسراء والمعراج', icon: '✨' },
    '8-15': { name: 'ليلة النصف من شعبان', icon: '🌕' },
    '9-1': { name: 'بداية رمضان', icon: '🌙' },
    '9-27': { name: 'ليلة القدر (تُحرّى)', icon: '⭐' },
    '10-1': { name: 'عيد الفطر', icon: '🎉' },
    '12-9': { name: 'يوم عرفة', icon: '🕋' },
    '12-10': { name: 'عيد الأضحى', icon: '🐑' },
};

// تحويل التاريخ الميلادي إلى هجري (تقريبي)
function toHijri(date) {
    const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
              Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
               Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const month = Math.floor((24 * l3) / 709);
    const day = l3 - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;

    return { year, month, day };
}

export default function HijriCalendar() {
    const [hijriDate, setHijriDate] = useState(null);
    const [todayEvent, setTodayEvent] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    useEffect(() => {
        const now = new Date();
        const hijri = toHijri(now);
        setHijriDate(hijri);

        // فحص مناسبة اليوم
        const todayKey = `${hijri.month}-${hijri.day}`;
        if (ISLAMIC_EVENTS[todayKey]) {
            setTodayEvent(ISLAMIC_EVENTS[todayKey]);
        }

        // المناسبات القادمة
        const upcoming = [];
        for (let i = 1; i <= 30; i++) {
            const futureDate = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
            const futureHijri = toHijri(futureDate);
            const key = `${futureHijri.month}-${futureHijri.day}`;
            if (ISLAMIC_EVENTS[key]) {
                upcoming.push({
                    ...ISLAMIC_EVENTS[key],
                    daysLeft: i,
                    date: futureHijri
                });
                if (upcoming.length >= 3) break;
            }
        }
        setUpcomingEvents(upcoming);
    }, []);

    if (!hijriDate) return null;

    const weekday = WEEKDAYS[new Date().getDay()];

    return (
        <div className="hijri-card">
            <div className="hijri-main">
                <div className="hijri-day">{hijriDate.day}</div>
                <div className="hijri-details">
                    <span className="hijri-month">{HIJRI_MONTHS[hijriDate.month - 1]}</span>
                    <span className="hijri-year">{hijriDate.year} هـ</span>
                </div>
                <div className="hijri-weekday">{weekday}</div>
            </div>

            {todayEvent && (
                <div className="hijri-event today-event">
                    <span className="event-icon">{todayEvent.icon}</span>
                    <span className="event-name">{todayEvent.name}</span>
                    <span className="event-badge">اليوم</span>
                </div>
            )}

            {upcomingEvents.length > 0 && (
                <div className="hijri-upcoming">
                    <h4 className="upcoming-title">📅 مناسبات قادمة</h4>
                    {upcomingEvents.map((event, idx) => (
                        <div key={idx} className="upcoming-event">
                            <span className="event-icon">{event.icon}</span>
                            <span className="event-name">{event.name}</span>
                            <span className="event-days">بعد {event.daysLeft} يوم</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
