import { useState, useEffect } from 'react';
import '../styles/dynamicBackground.css';

// خلفيات حسب وقت الصلاة
const BACKGROUNDS = {
    fajr: {
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 100%)',
        particles: ['✨', '🌙', '⭐'],
        ambiance: 'dawn'
    },
    sunrise: {
        gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7c59f 30%, #efa00b 60%, #d68438 100%)',
        particles: ['☀️', '🌤️', '✨'],
        ambiance: 'sunrise'
    },
    dhuhr: {
        gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 30%, #6c5ce7 60%, #a29bfe 100%)',
        particles: ['☀️', '🌤️', '⛅'],
        ambiance: 'day'
    },
    asr: {
        gradient: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 30%, #e17055 60%, #d63031 100%)',
        particles: ['🌅', '☀️', '🌤️'],
        ambiance: 'afternoon'
    },
    maghrib: {
        gradient: 'linear-gradient(135deg, #e17055 0%, #d63031 20%, #6c5ce7 50%, #2d3436 100%)',
        particles: ['🌅', '🌙', '⭐'],
        ambiance: 'sunset'
    },
    isha: {
        gradient: 'linear-gradient(135deg, #0c0c1e 0%, #1a1a3e 30%, #2d2d5a 60%, #0d0d2b 100%)',
        particles: ['🌙', '⭐', '✨', '💫'],
        ambiance: 'night'
    }
};

function getCurrentPrayerPeriod() {
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 4 && hour < 6) return 'fajr';
    if (hour >= 6 && hour < 7) return 'sunrise';
    if (hour >= 7 && hour < 15) return 'dhuhr';
    if (hour >= 15 && hour < 17) return 'asr';
    if (hour >= 17 && hour < 19) return 'maghrib';
    return 'isha';
}

export default function DynamicBackground({ children }) {
    const [period, setPeriod] = useState(getCurrentPrayerPeriod());
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // تحديث الفترة كل دقيقة
        const interval = setInterval(() => {
            setPeriod(getCurrentPrayerPeriod());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // إنشاء الجسيمات
        const bg = BACKGROUNDS[period];
        const newParticles = [];

        for (let i = 0; i < 15; i++) {
            newParticles.push({
                id: i,
                emoji: bg.particles[Math.floor(Math.random() * bg.particles.length)],
                left: Math.random() * 100,
                delay: Math.random() * 5,
                duration: 10 + Math.random() * 10,
                size: 0.8 + Math.random() * 0.8
            });
        }

        setParticles(newParticles);
    }, [period]);

    const bg = BACKGROUNDS[period];

    return (
        <div
            className={`dynamic-background ${bg.ambiance}`}
            style={{ background: bg.gradient }}
        >
            <div className="bg-particles" aria-hidden="true">
                {particles.map(p => (
                    <span
                        key={p.id}
                        className="bg-particle"
                        style={{
                            left: `${p.left}%`,
                            animationDelay: `${p.delay}s`,
                            animationDuration: `${p.duration}s`,
                            fontSize: `${p.size}rem`
                        }}
                    >
                        {p.emoji}
                    </span>
                ))}
            </div>
            <div className="bg-overlay" aria-hidden="true" />
            {children}
        </div>
    );
}
