// Prayer Notifications Utility

const PRAYER_NAMES_AR = {
    Fajr: 'الفجر',
    Sunrise: 'الشروق',
    Dhuhr: 'الظهر',
    Asr: 'العصر',
    Maghrib: 'المغرب',
    Isha: 'العشاء'
};

// Check if notifications are supported
export function isNotificationSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator;
}

// Request notification permission
export async function requestNotificationPermission() {
    if (!isNotificationSupported()) {
        return 'unsupported';
    }

    const permission = await Notification.requestPermission();
    return permission;
}

// Get current permission status
export function getNotificationPermission() {
    if (!isNotificationSupported()) {
        return 'unsupported';
    }
    return Notification.permission;
}

// Register service worker
export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker not supported');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return registration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
    }
}

// Schedule a local notification
export function scheduleNotification(prayer, time, reminderMinutes = 0) {
    if (Notification.permission !== 'granted') {
        return null;
    }

    const prayerName = PRAYER_NAMES_AR[prayer] || prayer;
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);

    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes - reminderMinutes, 0, 0);

    // If time has passed, schedule for tomorrow
    if (notificationTime <= now) {
        notificationTime.setDate(notificationTime.getDate() + 1);
    }

    const delay = notificationTime.getTime() - now.getTime();

    if (delay <= 0) {
        return null;
    }

    const timeoutId = setTimeout(() => {
        showPrayerNotification(prayer, prayerName, reminderMinutes);
    }, delay);

    return {
        prayer,
        scheduledTime: notificationTime,
        timeoutId
    };
}

// Show prayer notification
export function showPrayerNotification(prayer, prayerName, reminderMinutes = 0) {
    if (Notification.permission !== 'granted') {
        return;
    }

    let title, body;

    if (reminderMinutes > 0) {
        title = `تذكير: صلاة ${prayerName}`;
        body = `باقي ${reminderMinutes} دقيقة على صلاة ${prayerName}`;
    } else {
        title = `حان وقت صلاة ${prayerName}`;
        body = `الله أكبر، حي على الصلاة`;
    }

    const notification = new Notification(title, {
        body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: `prayer-${prayer}`,
        renotify: true,
        requireInteraction: true,
        dir: 'rtl',
        lang: 'ar',
        vibrate: [200, 100, 200]
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    return notification;
}

// Get notification settings from localStorage
export function getNotificationSettings() {
    const defaultSettings = {
        enabled: false,
        reminderMinutes: 5,
        prayers: {
            Fajr: true,
            Dhuhr: true,
            Asr: true,
            Maghrib: true,
            Isha: true
        },
        sound: true
    };

    try {
        const stored = localStorage.getItem('notificationSettings');
        return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
        return defaultSettings;
    }
}

// Save notification settings to localStorage
export function saveNotificationSettings(settings) {
    try {
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
        return true;
    } catch {
        return false;
    }
}

// Schedule all prayer notifications for today
export function scheduleAllNotifications(prayerTimes, settings) {
    if (!settings.enabled || Notification.permission !== 'granted') {
        return [];
    }

    const scheduledNotifications = [];
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    prayers.forEach((prayer) => {
        if (settings.prayers[prayer] && prayerTimes[prayer]) {
            // Parse time (handle "am/pm" format)
            let time = prayerTimes[prayer];
            time = time.replace(/\s*(am|pm)/i, '');

            // Schedule reminder
            if (settings.reminderMinutes > 0) {
                const reminder = scheduleNotification(prayer, time, settings.reminderMinutes);
                if (reminder) scheduledNotifications.push(reminder);
            }

            // Schedule exact time notification
            const exact = scheduleNotification(prayer, time, 0);
            if (exact) scheduledNotifications.push(exact);
        }
    });

    return scheduledNotifications;
}

// Cancel all scheduled notifications
export function cancelAllNotifications(scheduledNotifications) {
    scheduledNotifications.forEach((notification) => {
        if (notification.timeoutId) {
            clearTimeout(notification.timeoutId);
        }
    });
}
