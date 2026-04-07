import { useState, useEffect } from 'react';
import api from '../api';
import '../styles/prayerCountdown.css';

const PRAYER_NAMES = {
    Fajr: 'الفجر',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء',
    'Fajr (Tomorrow)': 'فجر الغد'
};

const PRAYER_ICONS = {
    Fajr: '🌙',
    Dhuhr: '☀️',
    Asr: '🌤️',
    Maghrib: '🌅',
    Isha: '🌃',
    'Fajr (Tomorrow)': '🌙'
};

export default function PrayerCountdown() {
    const [nextPrayer, setNextPrayer] = useState(null);
    const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // جلب الصلاة القادمة
    useEffect(() => {
        const fetchNextPrayer = async () => {
            try {
                const res = await api.get('/prayertimes/next-for-me');
                setNextPrayer(res.data);
                setError(null);
            } catch (err) {
                setError('تعذر جلب الصلاة القادمة');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNextPrayer();
        // تحديث كل 5 دقائق
        const interval = setInterval(fetchNextPrayer, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // حساب العد التنازلي
    useEffect(() => {
        if (!nextPrayer?.nextPrayer?.localTime) return;

        const calculateCountdown = () => {
            const now = new Date();
            const [hours, minutes] = nextPrayer.nextPrayer.localTime.split(':').map(Number);

            let prayerTime = new Date();
            prayerTime.setHours(hours, minutes, 0, 0);

            // إذا كانت الصلاة غداً
            if (nextPrayer.nextPrayer.prayerName.includes('Tomorrow') || prayerTime < now) {
                prayerTime.setDate(prayerTime.getDate() + 1);
            }

            const diff = prayerTime - now;

            if (diff <= 0) {
                return { hours: 0, minutes: 0, seconds: 0 };
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            return { hours: h, minutes: m, seconds: s };
        };

        setCountdown(calculateCountdown());
        const timer = setInterval(() => {
            setCountdown(calculateCountdown());
        }, 1000);

        return () => clearInterval(timer);
    }, [nextPrayer]);

    if (loading) {
        return (
            <div className="countdown-card countdown-loading">
                <div className="countdown-spinner"></div>
                <span>جاري التحميل...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="countdown-card countdown-error">
                <span>⚠️ {error}</span>
            </div>
        );
    }

    if (!nextPrayer) return null;

    const prayerName = nextPrayer.nextPrayer?.prayerName || '';
    const prayerNameAr = PRAYER_NAMES[prayerName] || prayerName;
    const prayerIcon = PRAYER_ICONS[prayerName] || '🕌';

    const pad = (n) => String(n).padStart(2, '0');

    return (
        <div className="countdown-card">
            <div className="countdown-header">
                <span className="countdown-icon">{prayerIcon}</span>
                <div className="countdown-info">
                    <span className="countdown-label">الصلاة القادمة</span>
                    <span className="countdown-prayer-name">{prayerNameAr}</span>
                </div>
                <span className="countdown-time">{nextPrayer.nextPrayer?.localTime}</span>
            </div>

            <div className="countdown-timer">
                <div className="countdown-unit">
                    <span className="countdown-value">{pad(countdown.seconds)}</span>
                    <span className="countdown-unit-label">ثانية</span>
                </div>
                <span className="countdown-separator">:</span>
                <div className="countdown-unit">
                    <span className="countdown-value">{pad(countdown.minutes)}</span>
                    <span className="countdown-unit-label">دقيقة</span>
                </div>
                <span className="countdown-separator">:</span>
                <div className="countdown-unit">
                    <span className="countdown-value">{pad(countdown.hours)}</span>
                    <span className="countdown-unit-label">ساعة</span>
                </div>
            </div>

            <div className="countdown-location">
                <span>📍 {nextPrayer.city}، {nextPrayer.country}</span>
            </div>
        </div>
    );
}
