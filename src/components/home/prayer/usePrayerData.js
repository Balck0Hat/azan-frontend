import { useEffect, useRef, useState } from "react";
import api from "../../../api";
import { PRAYERS, parseTimeString } from "./prayerUtils";

export default function usePrayerData() {
  const [times, setTimes] = useState(null);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [countdown, setCountdown] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const [isUrgent, setIsUrgent] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [localRes, nextRes] = await Promise.all([
          api.get("/prayertimes/local/today"),
          api.get("/prayertimes/next-for-me"),
        ]);

        setTimes(localRes.data.times || null);

        const fromApi = nextRes.data?.nextPrayer?.prayerName;
        if (fromApi && PRAYERS.includes(fromApi)) {
          setSelectedPrayer(fromApi);
        } else {
          setSelectedPrayer("Fajr");
        }
      } catch (e) {
        console.error(e);
        setSelectedPrayer("Fajr");
      }
    };

    fetchData();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const prayerTime =
    selectedPrayer && times ? times[selectedPrayer] : null;

  useEffect(() => {
    if (!prayerTime) return;

    if (timerRef.current) clearInterval(timerRef.current);
    const parsed = parseTimeString(prayerTime);
    if (!parsed) {
      console.warn("Cannot parse time:", prayerTime);
      return;
    }
    const { hours: h, minutes: m } = parsed;

    const tick = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(h, m, 0, 0);
      if (target < now) target.setDate(target.getDate() + 1);

      const diff = target - now;
      if (diff <= 0) {
        setCountdown({ hours: "00", minutes: "00", seconds: "00" });
        setIsUrgent(false);
        return;
      }

      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setIsUrgent(hours === 0 && minutes < 5);

      setCountdown({
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    };

    tick();
    timerRef.current = setInterval(tick, 1000);

    return () => clearInterval(timerRef.current);
  }, [prayerTime]);

  return {
    times,
    selectedPrayer,
    setSelectedPrayer,
    countdown,
    isUrgent,
    prayerTime,
  };
}
