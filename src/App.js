import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import "./styles/navbar.css";
import "./styles/countriesNow.css";

import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import ThemeToggle from "./components/ThemeToggle";
import NotificationToggle from "./components/NotificationToggle";
import ErrorBoundary from "./components/ErrorBoundary";
import LazyFallback from "./components/ui/LazyFallback";
import TabRouter from "./components/TabRouter";
import { fetchPublicSettings } from "./admin/adminApi";

const DEFAULTS = {
    hero_badge: 'متابعة الأذان لحظة بلحظة حول العالم',
    hero_title: 'الأذان مباشر حول العالم',
    hero_subtitle: 'تابع أوقات الصلاة لأكثر من مئتي ألف مدينة حول العالم، واعرف أين يُؤذَّن الآن، وفي أي مدينة حان وقت الصلاة القادمة.',
};

function App() {
    const [activeCard, setActiveCard] = useState("home");
    const [siteSettings, setSiteSettings] = useState(DEFAULTS);

    useEffect(() => {
        fetchPublicSettings()
            .then(data => setSiteSettings(prev => ({ ...prev, ...data })))
            .catch(() => {});
    }, []);

    return (
        <div className="app-shell">
            {siteSettings.announcement_active && siteSettings.announcement_text && (
                <div className="announcement-bar">
                    <span>{siteSettings.announcement_text}</span>
                </div>
            )}

            <header className="site-header">
                <div className="app-container header-inner">
                    <div className="brand">
                        <div className="brand-logo">🕌</div>
                        <div className="brand-text-block">
                            <div className="brand-name">الأذان مباشر</div>
                            <div className="brand-sub">Azan Live</div>
                        </div>
                    </div>

                    <Navbar activeCard={activeCard} setActiveCard={setActiveCard} />
                    <div className="header-actions">
                        <NotificationToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="app-main" id="main-content">
                <div className="app-container">
                <ErrorBoundary>
                  <Suspense fallback={<LazyFallback />}>
                    {activeCard !== "globe" && (
                        <section className="hero" id="top">
                            <div className="hero-badge">
                                {siteSettings.hero_badge}
                            </div>
                            <h1 className="hero-title">{siteSettings.hero_title}</h1>
                            <p className="hero-subtitle">
                                {siteSettings.hero_subtitle}
                            </p>
                        </section>
                    )}

                    <TabRouter activeCard={activeCard} setActiveCard={setActiveCard} />
                  </Suspense>
                </ErrorBoundary>
                </div>
            </main>

            <Footer />

            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: {
                        background: 'var(--bg-card-solid)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        fontSize: '14px',
                        direction: 'rtl',
                    },
                    success: {
                        iconTheme: { primary: 'var(--status-success)', secondary: 'var(--bg-card-solid)' },
                    },
                    error: {
                        iconTheme: { primary: 'var(--status-error)', secondary: 'var(--bg-card-solid)' },
                    },
                    duration: 3000,
                }}
            />

        </div>
    );
}

export default App;
