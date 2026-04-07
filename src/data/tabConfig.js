import { lazy } from "react";

// Lazy-loaded tab components
const HomeOverview = lazy(() => import("../components/HomeOverview"));
const CityPrayerTimes = lazy(() => import("../components/CityPrayerTimes"));
const LiveNow = lazy(() => import("../components/LiveNow"));
const GlobalNowStats = lazy(() => import("../components/GlobalNowStats"));
const CountriesNow = lazy(() => import("../components/CountriesNow"));
const ProphetsTree = lazy(() => import("../components/ProphetsTree"));
const AdhanPlayer = lazy(() => import("../components/AdhanPlayer"));
const PrayerTracker = lazy(() => import("../components/PrayerTracker"));
const Achievements = lazy(() => import("../components/Achievements"));
const Tasbeeh = lazy(() => import("../components/Tasbeeh"));
const Challenge40Days = lazy(() => import("../components/Challenge40Days"));
const NearbyMosques = lazy(() => import("../components/NearbyMosques"));
const LiveStream = lazy(() => import("../components/LiveStream"));
const QuranTafsir = lazy(() => import("../components/quran/QuranTafsir"));
const QuranRules = lazy(() => import("../components/QuranRules"));
const RamadanPage = lazy(() => import("../components/RamadanPage"));
const GlobeFullPage = lazy(() => import("../components/globe-page/GlobeFullPage"));

export const tabConfig = [
  { key: "home", name: "الرئيسية", icon: "🏠" },
  { key: "globe", name: "خريطة العالم", icon: "🗺️" },
  { key: "ramadan", name: "رمضان", icon: "🌙" },
  { key: "live", name: "الآن يُؤذَّن", icon: "📡" },
  { key: "today", name: "أوقات اليوم", icon: "🕐" },
  { key: "tools", name: "الأدوات", icon: "🛠️" },
  { key: "quran", name: "القرآن والتفسير", icon: "📖" },
  { key: "stream", name: "البث المباشر", icon: "📺" },
  { key: "countries", name: "حسب الدولة", icon: "🌍" },
  { key: "prophets", name: "شجرة الأنبياء", icon: "🌳" },
  { key: "rules", name: "قواعد قرآنية", icon: "📜" },
];

export {
  HomeOverview, CityPrayerTimes, LiveNow, GlobalNowStats,
  CountriesNow, ProphetsTree, AdhanPlayer, PrayerTracker,
  Achievements, Tasbeeh, Challenge40Days, NearbyMosques,
  LiveStream, QuranTafsir, QuranRules, RamadanPage, GlobeFullPage,
};
