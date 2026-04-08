import { motion, AnimatePresence } from "framer-motion";
import {
  HomeOverview, CityPrayerTimes, LiveNow, GlobalNowStats,
  CountriesNow, ProphetsTree, AdhanPlayer, PrayerTracker,
  Achievements, Tasbeeh, Challenge40Days, NearbyMosques,
  LiveStream, QuranTafsir, QuranRules, RamadanPage, GlobeFullPage,
} from "../data/tabConfig";

const MainCol = ({ children, className = "" }) => (
  <section className="main-layout">
    <section className={`col ${className}`.trim()}>{children}</section>
  </section>
);

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = { duration: 0.25, ease: "easeInOut" };

const tabRenderers = {
  home: ({ setActiveCard }) => <HomeOverview setActiveCard={setActiveCard} />,

  globe: ({ setActiveCard }) => (
    <section className="globe-page-layout">
      <GlobeFullPage setActiveCard={setActiveCard} />
    </section>
  ),

  ramadan: () => (
    <section className="tools-page"><RamadanPage /></section>
  ),

  live: () => (
    <MainCol>
      <LiveNow />
      <div style={{ height: 16 }} />
      <GlobalNowStats />
    </MainCol>
  ),

  today: () => (
    <MainCol><CityPrayerTimes /></MainCol>
  ),

  tools: () => (
    <section className="tools-page">
      <div className="tools-grid">
        <div className="tools-column">
          <AdhanPlayer />
          <PrayerTracker />
          <Challenge40Days />
        </div>
        <div className="tools-column">
          <Tasbeeh />
          <Achievements />
          <NearbyMosques />
        </div>
      </div>
    </section>
  ),

  quran: () => (
    <MainCol className="quran-section"><QuranTafsir /></MainCol>
  ),

  stream: () => <MainCol><LiveStream /></MainCol>,
  countries: () => <MainCol><CountriesNow /></MainCol>,
  prophets: () => <MainCol><ProphetsTree /></MainCol>,
  rules: () => <MainCol><QuranRules /></MainCol>,
};

function TabRouter({ activeCard, setActiveCard }) {
  const render = tabRenderers[activeCard];
  if (!render) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCard}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        {render({ setActiveCard })}
      </motion.div>
    </AnimatePresence>
  );
}

export default TabRouter;
