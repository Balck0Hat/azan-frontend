// useRamadanState.js — Custom hook for all Ramadan page state and logic

import { useState, useEffect, useCallback } from "react";
import { ramadanDuas, dailyVirtues } from "../../data/ramadanData";
import {
  getRamadanDay,
  timeToDate,
  formatCountdown,
  STORAGE_KEY_FASTING,
  STORAGE_KEY_KHATMA,
} from "./ramadanUtils";

function loadFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

export default function useRamadanState() {
  const { day: ramadanDay, year: hijriYear, isRamadan } = getRamadanDay();

  const [fajrTime, setFajrTime] = useState(null);
  const [maghribTime, setMaghribTime] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [countdownTarget, setCountdownTarget] = useState("");
  const [fastingDays, setFastingDays] = useState(() => loadFromStorage(STORAGE_KEY_FASTING));
  const [khatmaJuz, setKhatmaJuz] = useState(() => loadFromStorage(STORAGE_KEY_KHATMA));
  const [duaFilter, setDuaFilter] = useState("الكل");
  const [copiedDua, setCopiedDua] = useState(null);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    fetch("/api/prayertimes/local/today")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.prayers) {
          setFajrTime(data.prayers.Fajr);
          setMaghribTime(data.prayers.Maghrib);
        }
      })
      .catch(() => {});
  }, []);

  const updateCountdown = useCallback(() => {
    const now = new Date();
    const fajr = timeToDate(fajrTime);
    const maghrib = timeToDate(maghribTime);

    if (!fajr || !maghrib) {
      setCountdown("--:--:--");
      setCountdownTarget("");
      return;
    }
    if (now < fajr) {
      setCountdown(formatCountdown(fajr - now));
      setCountdownTarget("حتى الإمساك");
    } else if (now < maghrib) {
      setCountdown(formatCountdown(maghrib - now));
      setCountdownTarget("حتى الإفطار");
    } else {
      setCountdown("00:00:00");
      setCountdownTarget("أفطرت، تقبّل الله");
    }
  }, [fajrTime, maghribTime]);

  useEffect(() => {
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [updateCountdown]);

  const toggleFasting = (dayNum) => {
    setFastingDays((prev) => {
      const next = prev.includes(dayNum)
        ? prev.filter((d) => d !== dayNum)
        : [...prev, dayNum];
      localStorage.setItem(STORAGE_KEY_FASTING, JSON.stringify(next));
      return next;
    });
  };

  const toggleKhatma = (juzNum) => {
    setKhatmaJuz((prev) => {
      const next = prev.includes(juzNum)
        ? prev.filter((j) => j !== juzNum)
        : [...prev, juzNum];
      localStorage.setItem(STORAGE_KEY_KHATMA, JSON.stringify(next));
      return next;
    });
  };

  const copyDua = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedDua(id);
      setTimeout(() => setCopiedDua(null), 2000);
    });
  };

  const shareProgress = () => {
    const text = `🌙 اليوم يوم ${ramadanDay} من رمضان — صمت ${fastingDays.length} يوم وختمت ${khatmaJuz.length} جزء\nتابع رمضانك على azanlive.com`;
    navigator.clipboard.writeText(text).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    });
  };

  const duaCategories = ["الكل", "سحور", "إفطار", "عام"];
  const filteredDuas =
    duaFilter === "الكل"
      ? ramadanDuas
      : ramadanDuas.filter((d) => d.category === duaFilter);

  const todayVirtue = dailyVirtues[(ramadanDay || 1) - 1] || dailyVirtues[0];

  return {
    ramadanDay, hijriYear, isRamadan,
    fajrTime, maghribTime, countdown, countdownTarget,
    fastingDays, toggleFasting,
    khatmaJuz, toggleKhatma,
    duaFilter, setDuaFilter, duaCategories, filteredDuas,
    copiedDua, copyDua,
    todayVirtue, shareCopied, shareProgress,
  };
}
