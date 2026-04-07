import { useState, useEffect } from 'react';
import notificationService from '../services/NotificationService';
import '../styles/notificationToggle.css';

export default function NotificationToggle() {
    const [enabled, setEnabled] = useState(false);
    const [permission, setPermission] = useState('default');

    useEffect(() => {
        const perm = notificationService.checkPermission();
        setPermission(perm);

        // تحقق من الإعداد المحفوظ
        const saved = localStorage.getItem('notifications');
        if (saved === 'enabled' && perm === 'granted') {
            setEnabled(true);
        }
    }, []);

    const handleToggle = async () => {
        if (!enabled) {
            // تفعيل الإشعارات
            if (permission !== 'granted') {
                const granted = await notificationService.requestPermission();
                if (granted) {
                    setPermission('granted');
                    setEnabled(true);
                    localStorage.setItem('notifications', 'enabled');

                    // إرسال إشعار تجريبي
                    notificationService.notify('تم تفعيل الإشعارات ✅', {
                        body: 'ستصلك إشعارات عند دخول وقت كل صلاة',
                        tag: 'test-notification'
                    });
                }
            } else {
                setEnabled(true);
                localStorage.setItem('notifications', 'enabled');
            }
        } else {
            // إيقاف الإشعارات
            setEnabled(false);
            localStorage.setItem('notifications', 'disabled');
        }
    };

    // لا يُعرض إذا المتصفح لا يدعم الإشعارات
    if (!('Notification' in window)) {
        return null;
    }

    return (
        <button
            className={`notification-toggle ${enabled ? 'enabled' : ''}`}
            onClick={handleToggle}
            aria-label={enabled ? 'إيقاف الإشعارات' : 'تفعيل الإشعارات'}
            title={enabled ? 'إيقاف الإشعارات' : 'تفعيل الإشعارات'}
        >
            {enabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8.7 3A6 6 0 0 1 18 8a21.3 21.3 0 0 0 .6 5"/>
                    <path d="M17 17H3s3-2 3-9a4.67 4.67 0 0 1 .3-1.7"/>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                    <path d="m2 2 20 20"/>
                </svg>
            )}
        </button>
    );
}
