import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from './adminApi';

const FIELDS = [
  { key: 'hero_badge', label: 'Hero Badge', placeholder: 'متابعة الأذان لحظة بلحظة حول العالم' },
  { key: 'hero_title', label: 'Hero Title', placeholder: 'الأذان مباشر حول العالم' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', placeholder: 'تابع أوقات الصلاة...', multiline: true },
  { key: 'announcement_text', label: 'Announcement Text', placeholder: 'Enter announcement...' },
  { key: 'announcement_active', label: 'Announcement Active', toggle: true },
];

export default function SettingsTab() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchSettings()
      .then(data => {
        const flat = {};
        for (const [k, v] of Object.entries(data)) flat[k] = v?.value ?? v;
        setValues(flat);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, val) => setValues(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await updateSettings(values);
      setFeedback({ type: 'success', text: 'Settings saved!' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>;

  return (
    <div className="settings-tab">
      <div className="tab-section-title">Site Content</div>
      <div className="settings-form">
        {FIELDS.map(f => (
          <div key={f.key} className="settings-field">
            <label className="settings-label">{f.label}</label>
            {f.toggle ? (
              <button
                className={`admin-btn ${values[f.key] ? 'admin-btn-primary' : 'admin-btn-ghost'}`}
                onClick={() => handleChange(f.key, !values[f.key])}
                type="button"
              >
                {values[f.key] ? 'Active' : 'Inactive'}
              </button>
            ) : f.multiline ? (
              <textarea
                className="settings-input settings-textarea"
                value={values[f.key] || ''}
                onChange={e => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                rows={3}
              />
            ) : (
              <input
                className="settings-input"
                value={values[f.key] || ''}
                onChange={e => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="settings-actions">
        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {feedback && (
          <span className={`settings-feedback ${feedback.type === 'success' ? 'result-success' : 'result-error'}`}>
            {feedback.text}
          </span>
        )}
      </div>

      {(values.hero_title || values.hero_badge || values.hero_subtitle) && (
        <>
          <div className="tab-section-title">Preview</div>
          <div className="settings-preview">
            {values.hero_badge && <div className="preview-badge">{values.hero_badge}</div>}
            {values.hero_title && <div className="preview-title">{values.hero_title}</div>}
            {values.hero_subtitle && <div className="preview-subtitle">{values.hero_subtitle}</div>}
          </div>
        </>
      )}

      {values.announcement_active && values.announcement_text && (
        <div className="settings-preview announcement-preview">
          <div className="preview-badge">Announcement Preview</div>
          <div className="preview-subtitle">{values.announcement_text}</div>
        </div>
      )}
    </div>
  );
}
