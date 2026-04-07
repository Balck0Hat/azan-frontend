import { useState, useEffect, useCallback } from 'react';

function formatCountdown(diffMs) {
  if (diffMs <= 0) return "00:00:00";
  const totalSec = Math.floor(diffMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Countdown hook that ticks every second.
 * @param {Date|null} targetDate - the target to count down to
 * @returns {{ display: string, isFinished: boolean, remaining: number }}
 */
export default function useCountdown(targetDate) {
  const [remaining, setRemaining] = useState(0);

  const update = useCallback(() => {
    if (!targetDate) { setRemaining(0); return; }
    const diff = targetDate.getTime() - Date.now();
    setRemaining(diff > 0 ? diff : 0);
  }, [targetDate]);

  useEffect(() => {
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [update]);

  return {
    display: formatCountdown(remaining),
    isFinished: remaining <= 0,
    remaining,
  };
}
