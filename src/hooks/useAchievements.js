import { useState, useEffect } from 'react';
import { BADGES, LEVELS } from '../data/achievementsData';

export default function useAchievements() {
  const [stats, setStats] = useState({
    totalPrayers: 0, completeDays: 0, streak: 0,
    fajrCount: 0, totalTasbeeh: 0, quranParts: 0
  });
  const [points, setPoints] = useState(0);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [showNewBadge, setShowNewBadge] = useState(null);

  useEffect(() => { loadStats(); }, []);

  const loadStats = () => {
    const prayerData = JSON.parse(localStorage.getItem('prayerTracker') || '{}');
    const tasbeehData = JSON.parse(localStorage.getItem('tasbeehCount') || '0');
    const quranData = JSON.parse(localStorage.getItem('quranProgress') || '0');
    const savedBadges = JSON.parse(localStorage.getItem('unlockedBadges') || '[]');
    const savedPoints = parseInt(localStorage.getItem('userPoints') || '0');

    let totalPrayers = 0, completeDays = 0, fajrCount = 0, currentStreak = 0;
    const dates = Object.keys(prayerData).sort().reverse();

    dates.forEach((date, idx) => {
      const dayPrayers = prayerData[date];
      const prayedCount = Object.values(dayPrayers).filter(v => v).length;
      totalPrayers += prayedCount;
      if (prayedCount === 5) completeDays++;
      if (dayPrayers.Fajr) fajrCount++;
      if (idx === 0 || prayedCount === 5) {
        if (prayedCount === 5) currentStreak++;
      }
    });

    const newStats = {
      totalPrayers, completeDays, streak: currentStreak,
      fajrCount, totalTasbeeh: tasbeehData, quranParts: quranData
    };

    setStats(newStats);
    setUnlockedBadges(savedBadges);
    setPoints(savedPoints);
    checkNewBadges(newStats, savedBadges, savedPoints);
  };

  const checkNewBadges = (currentStats, currentBadges, currentPoints) => {
    let newPoints = currentPoints;
    let newBadges = [...currentBadges];

    BADGES.forEach(badge => {
      if (!currentBadges.includes(badge.id) && badge.condition(currentStats)) {
        newBadges.push(badge.id);
        newPoints += badge.points;
        setShowNewBadge(badge);
        setTimeout(() => setShowNewBadge(null), 3000);
      }
    });

    if (newBadges.length !== currentBadges.length) {
      localStorage.setItem('unlockedBadges', JSON.stringify(newBadges));
      localStorage.setItem('userPoints', newPoints.toString());
      setUnlockedBadges(newBadges);
      setPoints(newPoints);
    }
  };

  const getCurrentLevel = () => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (points >= LEVELS[i].minPoints) return LEVELS[i];
    }
    return LEVELS[0];
  };

  const getNextLevel = () => {
    const current = getCurrentLevel();
    const idx = LEVELS.findIndex(l => l.level === current.level);
    return LEVELS[idx + 1] || null;
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  return { points, unlockedBadges, showNewBadge, currentLevel, nextLevel, progressToNext };
}
