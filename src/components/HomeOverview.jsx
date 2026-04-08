import { motion } from "framer-motion";
import NextPrayerCard from "../components/home/NextPrayerCard";
import LocalCityCard from "../components/home/LocalCityCard";
import GlobePreviewCard from "../components/home/GlobePreviewCard";
import PrayerCountdown from "./PrayerCountdown";
import HijriCalendar from "./HijriCalendar";
import DailyContent from "./DailyContent";
import QiblaCompass from "./QiblaCompass";
import FavoriteCities from "./FavoriteCities";
import Adhkar from "./Adhkar";
import PrayerTrackingCard from "./PrayerTrackingCard";
import QuranKhatma from "./QuranKhatma";
import NotificationSettings from "./NotificationSettings";

const stagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const cardVariant = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

function BentoCard({ children, className = "", span = "" }) {
    return (
        <motion.div
            variants={cardVariant}
            className={`
                relative group rounded-2xl p-1 overflow-hidden
                ${span} ${className}
            `}
        >
            {/* Gradient border on hover */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-primary) 30%, transparent), color-mix(in srgb, var(--accent-secondary) 30%, transparent))',
                }}
            />
            <div
                className="relative rounded-xl h-full transition-transform duration-300 group-hover:-translate-y-0.5"
                style={{
                    background: 'var(--bg-card)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid var(--border-color)',
                }}
            >
                {children}
            </div>
        </motion.div>
    );
}

function HomeOverview({ setActiveCard }) {
    return (
        <motion.section
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 pb-10"
            variants={stagger}
            initial="hidden"
            animate="visible"
        >
            {/* Top row: Countdown + Hijri */}
            <BentoCard span="md:col-span-1 lg:col-span-2">
                <PrayerCountdown />
            </BentoCard>
            <BentoCard>
                <HijriCalendar />
            </BentoCard>

            {/* Daily content full width */}
            <BentoCard span="md:col-span-2 lg:col-span-3">
                <DailyContent />
            </BentoCard>

            {/* Main cards */}
            <BentoCard span="md:col-span-1 lg:col-span-2">
                <LocalCityCard />
            </BentoCard>
            <BentoCard>
                <NextPrayerCard />
            </BentoCard>

            {/* Qibla + Favorites */}
            <BentoCard>
                <QiblaCompass />
            </BentoCard>
            <BentoCard span="md:col-span-1 lg:col-span-2">
                <FavoriteCities />
            </BentoCard>

            {/* Tracking */}
            <BentoCard span="md:col-span-2 lg:col-span-3">
                <PrayerTrackingCard />
            </BentoCard>

            {/* Quran Khatma */}
            <BentoCard span="md:col-span-1 lg:col-span-2">
                <QuranKhatma />
            </BentoCard>

            {/* Adhkar */}
            <BentoCard>
                <Adhkar type="afterPrayer" />
            </BentoCard>

            {/* Notifications */}
            <BentoCard>
                <NotificationSettings />
            </BentoCard>

            {/* Globe */}
            <BentoCard span="md:col-span-1 lg:col-span-2">
                <GlobePreviewCard setActiveCard={setActiveCard} />
            </BentoCard>
        </motion.section>
    );
}

export default HomeOverview;
