// RamadanPage.jsx — Main orchestrator for the Ramadan page

import "../../styles/ramadan.css";
import useRamadanState from "./useRamadanState";

import RamadanHeader from "./RamadanHeader";
import ImsakiaCard from "./ImsakiaCard";
import FastingTracker from "./FastingTracker";
import KhatmaGrid from "./KhatmaGrid";
import VirtueOfDay from "./VirtueOfDay";
import DuasSection from "./DuasSection";

import LastTenNights from "./LastTenNights";
import DailyPlanner from "./DailyPlanner";
import TarawihTracker from "./TarawihTracker";
import KhatmaCounter from "./KhatmaCounter";
import ZakatCalculator from "./ZakatCalculator";
import SadaqaTracker from "./SadaqaTracker";
import FastingAdhkar from "./FastingAdhkar";
import IftarReminder from "./IftarReminder";
import MonthlyCalendar from "./MonthlyCalendar";

export default function RamadanPage() {
  const state = useRamadanState();

  if (!state.isRamadan) {
    return (
      <div className="ramadan-page">
        <div className="ram-card ram-not-ramadan">
          <div className="ram-not-ramadan-icon">🌙</div>
          <div className="ram-not-ramadan-title">
            ليس شهر رمضان حالياً
          </div>
          <div className="ram-not-ramadan-text">
            ستتوفر هذه الصفحة عند دخول شهر رمضان المبارك إن شاء الله.
            <br />
            نسأل الله أن يبلّغنا رمضان.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ramadan-page">
      <RamadanHeader ramadanDay={state.ramadanDay} />

      <ImsakiaCard
        fajrTime={state.fajrTime}
        maghribTime={state.maghribTime}
        countdown={state.countdown}
        countdownTarget={state.countdownTarget}
      />

      <FastingTracker
        fastingDays={state.fastingDays}
        toggleFasting={state.toggleFasting}
        ramadanDay={state.ramadanDay}
      />

      <KhatmaGrid
        khatmaJuz={state.khatmaJuz}
        toggleKhatma={state.toggleKhatma}
      />

      <VirtueOfDay todayVirtue={state.todayVirtue} />

      <DuasSection
        duaFilter={state.duaFilter}
        setDuaFilter={state.setDuaFilter}
        duaCategories={state.duaCategories}
        filteredDuas={state.filteredDuas}
        copiedDua={state.copiedDua}
        copyDua={state.copyDua}
      />

      <LastTenNights ramadanDay={state.ramadanDay} />
      <DailyPlanner
        ramadanDay={state.ramadanDay}
        hijriYear={state.hijriYear}
      />
      <TarawihTracker
        ramadanDay={state.ramadanDay}
        hijriYear={state.hijriYear}
      />
      <KhatmaCounter hijriYear={state.hijriYear} />
      <ZakatCalculator />
      <SadaqaTracker hijriYear={state.hijriYear} />
      <FastingAdhkar />
      <IftarReminder maghribTime={state.maghribTime} />
      <MonthlyCalendar ramadanDay={state.ramadanDay} />

      <div className="ram-card ram-share">
        <div
          className="ram-card-title"
          style={{ justifyContent: "center" }}
        >
          📤 شارك تقدمك
        </div>
        <div className="ram-share-text">
          شارك أصدقاءك تقدمك في رمضان وشجّعهم على المتابعة
        </div>
        <button
          className={
            "ram-share-btn" + (state.shareCopied ? " copied" : "")
          }
          onClick={state.shareProgress}
        >
          {state.shareCopied ? "✓ تم النسخ!" : "📋 نسخ ومشاركة"}
        </button>
      </div>
    </div>
  );
}
