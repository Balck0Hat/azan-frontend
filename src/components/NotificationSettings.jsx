import { useState, useEffect } from 'react';
import {
  isNotificationSupported,
  requestNotificationPermission,
  getNotificationPermission,
  getNotificationSettings,
  saveNotificationSettings,
  registerServiceWorker
} from '../utils/notifications';
import NotifEnabledSection from './NotifEnabledSection';
import '../styles/notificationSettings.css';

export default function NotificationSettings() {
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState('default');
  const [settings, setSettings] = useState(getNotificationSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSupported(isNotificationSupported());
    setPermission(getNotificationPermission());
    registerServiceWorker();
  }, []);

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    saveNotificationSettings(newSettings);
    showSaved();
  };

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      updateSettings({ ...settings, enabled: true });
    }
  };

  const handleToggleEnabled = () => {
    if (!settings.enabled && permission !== 'granted') {
      handleEnableNotifications();
      return;
    }
    updateSettings({ ...settings, enabled: !settings.enabled });
  };

  const handleReminderChange = (e) => {
    updateSettings({ ...settings, reminderMinutes: Number(e.target.value) });
  };

  const handlePrayerToggle = (prayerKey) => {
    updateSettings({
      ...settings,
      prayers: { ...settings.prayers, [prayerKey]: !settings.prayers[prayerKey] }
    });
  };

  const handleSoundToggle = () => {
    updateSettings({ ...settings, sound: !settings.sound });
  };

  if (!supported) {
    return (
      <div className="notification-settings">
        <div className="notif-unsupported">
          <span className="notif-icon">🔕</span>
          <p>المتصفح لا يدعم الإشعارات</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <div className="notif-header">
        <h3>
          <span className="notif-icon">🔔</span>
          إشعارات الصلاة
        </h3>
        {saved && <span className="notif-saved">تم الحفظ ✓</span>}
      </div>

      {permission === 'denied' ? (
        <div className="notif-denied">
          <p>تم حظر الإشعارات. يرجى تفعيلها من إعدادات المتصفح.</p>
        </div>
      ) : (
        <>
          <div className="notif-row notif-toggle-row">
            <span>تفعيل الإشعارات</span>
            <button
              className={`notif-switch ${settings.enabled ? 'active' : ''}`}
              onClick={handleToggleEnabled}
            >
              <span className="notif-switch-knob"></span>
            </button>
          </div>

          {settings.enabled && (
            <NotifEnabledSection
              settings={settings}
              onReminderChange={handleReminderChange}
              onSoundToggle={handleSoundToggle}
              onPrayerToggle={handlePrayerToggle}
            />
          )}
        </>
      )}
    </div>
  );
}
