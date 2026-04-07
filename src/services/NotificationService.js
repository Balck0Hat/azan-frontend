// خدمة إشعارات الصلاة

class NotificationService {
    constructor() {
        this.permission = 'default';
        this.checkPermission();
    }

    // فحص صلاحية الإشعارات
    checkPermission() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
        }
        return this.permission;
    }

    // طلب الإذن
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('المتصفح لا يدعم الإشعارات');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === 'granted';
        } catch (err) {
            console.error('خطأ في طلب إذن الإشعارات:', err);
            return false;
        }
    }

    // إرسال إشعار
    notify(title, options = {}) {
        if (this.permission !== 'granted') {
            console.warn('لم يتم منح إذن الإشعارات');
            return null;
        }

        const defaultOptions = {
            icon: '/logo192.png',
            badge: '/favicon.ico',
            dir: 'rtl',
            lang: 'ar',
            requireInteraction: true,
            silent: false,
            ...options
        };

        try {
            const notification = new Notification(title, defaultOptions);

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // إغلاق تلقائي بعد 30 ثانية
            setTimeout(() => notification.close(), 30000);

            return notification;
        } catch (err) {
            console.error('خطأ في إرسال الإشعار:', err);
            return null;
        }
    }

    // إشعار دخول وقت الصلاة
    notifyPrayerTime(prayerName, prayerNameAr) {
        const messages = {
            Fajr: 'حان وقت صلاة الفجر 🌙',
            Dhuhr: 'حان وقت صلاة الظهر ☀️',
            Asr: 'حان وقت صلاة العصر 🌤️',
            Maghrib: 'حان وقت صلاة المغرب 🌅',
            Isha: 'حان وقت صلاة العشاء 🌃'
        };

        return this.notify(messages[prayerName] || `حان وقت صلاة ${prayerNameAr}`, {
            body: 'حيّ على الصلاة، حيّ على الفلاح',
            tag: `prayer-${prayerName}`,
            vibrate: [200, 100, 200]
        });
    }

    // إشعار تذكيري قبل الصلاة
    notifyPrayerReminder(prayerName, prayerNameAr, minutesBefore) {
        return this.notify(`تذكير: صلاة ${prayerNameAr} بعد ${minutesBefore} دقائق`, {
            body: 'استعد للصلاة',
            tag: `reminder-${prayerName}`,
        });
    }
}

// Singleton instance
const notificationService = new NotificationService();
export default notificationService;
