import { PRAYERS, REMINDER_OPTIONS } from '../data/notificationData';

export default function NotifEnabledSection({ settings, onReminderChange, onSoundToggle, onPrayerToggle }) {
  return (
    <>
      <div className="notif-row">
        <span>التذكير</span>
        <select value={settings.reminderMinutes} onChange={onReminderChange} className="notif-select">
          {REMINDER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="notif-row notif-toggle-row">
        <span>صوت الإشعار</span>
        <button className={`notif-switch ${settings.sound ? 'active' : ''}`} onClick={onSoundToggle}>
          <span className="notif-switch-knob"></span>
        </button>
      </div>

      <div className="notif-prayers">
        <p className="notif-prayers-title">الصلوات</p>
        <div className="notif-prayers-grid">
          {PRAYERS.map((prayer) => (
            <button
              key={prayer.key}
              className={`notif-prayer-btn ${settings.prayers[prayer.key] ? 'active' : ''}`}
              onClick={() => onPrayerToggle(prayer.key)}
            >
              <span className="notif-prayer-icon">{prayer.icon}</span>
              <span className="notif-prayer-name">{prayer.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="notif-test-btn"
        onClick={() => {
          if (Notification.permission === 'granted') {
            new Notification('اختبار الإشعارات', {
              body: 'الإشعارات تعمل بشكل صحيح!',
              icon: '/logo192.png',
              dir: 'rtl'
            });
          }
        }}
      >
        🔔 اختبار الإشعارات
      </button>
    </>
  );
}
