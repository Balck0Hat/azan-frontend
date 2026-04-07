import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from './adminApi';

const SEO_FIELDS = [
  { key: 'seo_title', label: 'Page Title', placeholder: 'الأذان مباشر | Azan Live', max: 60 },
  { key: 'seo_description', label: 'Meta Description', placeholder: 'مواقيت الصلاة لأكثر من 200,000 مدينة...', multiline: true, max: 160 },
  { key: 'seo_keywords', label: 'Meta Keywords', placeholder: 'prayer times, azan, مواقيت الصلاة' },
  { key: 'og_title', label: 'OG Title', placeholder: 'الأذان مباشر حول العالم' },
  { key: 'og_description', label: 'OG Description', placeholder: 'تابع أوقات الصلاة...', multiline: true },
  { key: 'og_image', label: 'OG Image URL', placeholder: 'https://azanlive.com/og-image.png' },
];

export default function SEOTab() {
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
    const seoData = {};
    SEO_FIELDS.forEach(f => { if (values[f.key] !== undefined) seoData[f.key] = values[f.key]; });
    try {
      await updateSettings(seoData);
      setFeedback({ type: 'success', text: 'SEO settings saved!' });
      // Update document title in real-time
      if (seoData.seo_title) document.title = seoData.seo_title;
    } catch (err) {
      setFeedback({ type: 'error', text: err.message });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="admin-loading"><div className="spinner-ring" /> Loading...</div>;

  return (
    <div className="seo-tab">
      <div className="tab-section-title">SEO Settings</div>
      <div className="settings-form">
        {SEO_FIELDS.map(f => (
          <div key={f.key} className="settings-field">
            <label className="settings-label">
              {f.label} {f.max && <span style={{ opacity: 0.5 }}>({(values[f.key] || '').length}/{f.max})</span>}
            </label>
            {f.multiline ? (
              <textarea className="settings-input settings-textarea" value={values[f.key] || ''}
                onChange={e => handleChange(f.key, e.target.value)} placeholder={f.placeholder} rows={3} />
            ) : (
              <input className="settings-input" value={values[f.key] || ''}
                onChange={e => handleChange(f.key, e.target.value)} placeholder={f.placeholder} />
            )}
          </div>
        ))}
      </div>

      <div className="settings-actions">
        <button onClick={handleSave} disabled={saving} className="admin-btn admin-btn-primary">
          {saving ? 'Saving...' : 'Save SEO Settings'}
        </button>
        {feedback && <span className={`settings-feedback ${feedback.type === 'success' ? 'result-success' : 'result-error'}`}>{feedback.text}</span>}
      </div>

      <div className="tab-section-title">Google Preview</div>
      <div className="seo-google-preview">
        <div className="seo-google-title">{(values.seo_title || 'الأذان مباشر | Azan Live').slice(0, 60)}</div>
        <div className="seo-google-url">azanlive.com</div>
        <div className="seo-google-desc">{(values.seo_description || 'مواقيت الصلاة لأكثر من 200,000 مدينة حول العالم').slice(0, 160)}</div>
      </div>

      <div className="tab-section-title">Social Card Preview</div>
      <div className="seo-social-preview">
        {values.og_image && <div className="seo-social-img"><img src={values.og_image} alt="OG" onError={e => e.target.style.display = 'none'} /></div>}
        <div className="seo-social-body">
          <div className="seo-social-domain">azanlive.com</div>
          <div className="seo-social-title">{values.og_title || values.seo_title || 'الأذان مباشر'}</div>
          <div className="seo-social-desc">{values.og_description || values.seo_description || ''}</div>
        </div>
      </div>
    </div>
  );
}
