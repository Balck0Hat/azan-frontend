import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import "./styles/navbar.css";
import "./styles/countriesNow.css";

import Navbar from "./components/Navbar";
import MobileNav from "./components/MobileNav";
import Footer from "./components/footer";
import ThemeToggle from "./components/ThemeToggle";
import NotificationToggle from "./components/NotificationToggle";
import ErrorBoundary from "./components/ErrorBoundary";
import LazyFallback from "./components/ui/LazyFallback";
import TabRouter from "./components/TabRouter";
import HeroSection from "./components/HeroSection";
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
            .then(data => {
                setSiteSettings(prev => ({ ...prev, ...data }));
                if (data.seo_title) document.title = data.seo_title;
            })
            .catch(() => {});
    }, []);

    return (
        <div className="app-shell">
            {siteSettings.announcement_active && siteSettings.announcement_text && (
                <div className="announcement-bar">
                    <span>{siteSettings.announcement_text}</span>
                </div>
            )}

            <header
                className="sticky top-0 z-50 border-b border-[var(--border-color)] transition-all duration-300"
                style={{
                    background: "var(--bg-secondary)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                }}
            >
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-2xl">&#128332;</span>
                        <div className="flex flex-col leading-none">
                            <span className="text-[var(--text-primary)] font-bold text-base">الأذان مباشر</span>
                            <span className="text-[var(--text-muted)] text-[11px] tracking-wide">Azan Live</span>
                        </div>
                    </div>

                    <Navbar activeCard={activeCard} setActiveCard={setActiveCard} />

                    <div className="flex items-center gap-1">
                        <NotificationToggle />
                        <ThemeToggle />
                        <MobileNav activeCard={activeCard} setActiveCard={setActiveCard} />
                    </div>
                </div>
            </header>

            <main className="app-main" id="main-content">
                <div className="app-container">
                <ErrorBoundary>
                  <Suspense fallback={<LazyFallback />}>
                    <AnimatePresence mode="wait">
                    {activeCard !== "globe" && (
                        <HeroSection settings={siteSettings} />
                    )}
                    </AnimatePresence>

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
