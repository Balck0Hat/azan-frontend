import {
  getAllTrackingData,
  getTrackingForDate,
  markPrayer,
  togglePrayer,
  getStatistics,
  getWeeklySummary,
  getMonthlySummary,
  cleanOldData,
  exportData,
  importData,
} from "./prayerTracking";

const STORAGE_KEY = "prayerTracking";

beforeEach(() => {
  localStorage.clear();
});

describe("getAllTrackingData", () => {
  test("returns empty object when no data", () => {
    expect(getAllTrackingData()).toEqual({});
  });

  test("returns parsed data from localStorage", () => {
    const data = { "2025-06-15": { Fajr: true } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    expect(getAllTrackingData()).toEqual(data);
  });

  test("returns empty object on corrupt data", () => {
    localStorage.setItem(STORAGE_KEY, "not-json{{{");
    expect(getAllTrackingData()).toEqual({});
  });
});

describe("getTrackingForDate", () => {
  test("returns all-false defaults for unknown date", () => {
    const result = getTrackingForDate(new Date("2025-06-15"));
    expect(result).toEqual({
      Fajr: false, Dhuhr: false, Asr: false, Maghrib: false, Isha: false,
    });
  });

  test("returns saved data for a tracked date", () => {
    const saved = { Fajr: true, Dhuhr: false, Asr: true, Maghrib: false, Isha: false };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ "2025-06-15": saved }));
    expect(getTrackingForDate(new Date("2025-06-15"))).toEqual(saved);
  });
});

describe("markPrayer", () => {
  test("marks a prayer as prayed", () => {
    markPrayer("Fajr", true, new Date("2025-06-15"));
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(data["2025-06-15"].Fajr).toBe(true);
  });

  test("marks a prayer as not prayed", () => {
    markPrayer("Fajr", true, new Date("2025-06-15"));
    markPrayer("Fajr", false, new Date("2025-06-15"));
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(data["2025-06-15"].Fajr).toBe(false);
  });

  test("rejects invalid prayer name", () => {
    expect(markPrayer("InvalidPrayer", true)).toBe(false);
  });

  test("initializes day data if not present", () => {
    markPrayer("Asr", true, new Date("2025-06-15"));
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(data["2025-06-15"].Dhuhr).toBe(false);
    expect(data["2025-06-15"].Asr).toBe(true);
  });
});

describe("togglePrayer", () => {
  test("toggles false to true", () => {
    togglePrayer("Fajr", new Date("2025-06-15"));
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(data["2025-06-15"].Fajr).toBe(true);
  });

  test("toggles true to false", () => {
    markPrayer("Fajr", true, new Date("2025-06-15"));
    togglePrayer("Fajr", new Date("2025-06-15"));
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(data["2025-06-15"].Fajr).toBe(false);
  });
});

describe("getStatistics", () => {
  test("returns zero stats when no data", () => {
    const stats = getStatistics(7);
    expect(stats.totalPrayers).toBe(35); // 7 days * 5 prayers
    expect(stats.prayedCount).toBe(0);
    expect(stats.streak).toBe(0);
    expect(stats.percentage).toBe(0);
  });

  test("calculates correct counts with data", () => {
    const today = new Date().toISOString().split("T")[0];
    const data = {
      [today]: { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const stats = getStatistics(1);
    expect(stats.prayedCount).toBe(5);
    expect(stats.totalPrayers).toBe(5);
    expect(stats.percentage).toBe(100);
  });

  test("calculates streak of consecutive full days", () => {
    const data = {};
    const fullDay = { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true };
    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      data[d.toISOString().split("T")[0]] = { ...fullDay };
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const stats = getStatistics(7);
    expect(stats.streak).toBe(3);
  });

  test("streak breaks on incomplete day", () => {
    const data = {};
    const fullDay = { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true };
    const today = new Date();

    // Today: full
    data[today.toISOString().split("T")[0]] = { ...fullDay };
    // Yesterday: missing one prayer
    const y = new Date(today);
    y.setDate(y.getDate() - 1);
    data[y.toISOString().split("T")[0]] = { ...fullDay, Fajr: false };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const stats = getStatistics(7);
    expect(stats.streak).toBe(1);
  });

  test("per-prayer breakdown is correct", () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      [today]: { Fajr: true, Dhuhr: false, Asr: true, Maghrib: false, Isha: true },
    }));

    const stats = getStatistics(1);
    expect(stats.byPrayer.Fajr.prayed).toBe(1);
    expect(stats.byPrayer.Dhuhr.prayed).toBe(0);
    expect(stats.byPrayer.Asr.prayed).toBe(1);
    expect(stats.prayedCount).toBe(3);
  });

  test("dailyData has correct structure", () => {
    const stats = getStatistics(3);
    expect(stats.dailyData).toHaveLength(3);
    stats.dailyData.forEach((day) => {
      expect(day).toHaveProperty("date");
      expect(day).toHaveProperty("prayed");
      expect(day).toHaveProperty("total", 5);
      expect(day).toHaveProperty("percentage");
    });
  });
});

describe("getWeeklySummary / getMonthlySummary", () => {
  test("weekly returns 7 days of data", () => {
    expect(getWeeklySummary().dailyData).toHaveLength(7);
  });

  test("monthly returns 30 days of data", () => {
    expect(getMonthlySummary().dailyData).toHaveLength(30);
  });
});

describe("cleanOldData", () => {
  test("removes data older than 90 days", () => {
    const old = new Date();
    old.setDate(old.getDate() - 100);
    const recent = new Date();
    const data = {
      [old.toISOString().split("T")[0]]: { Fajr: true },
      [recent.toISOString().split("T")[0]]: { Fajr: true },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    const cleaned = cleanOldData();
    expect(Object.keys(cleaned)).toHaveLength(1);
    expect(cleaned[recent.toISOString().split("T")[0]]).toBeDefined();
  });
});

describe("exportData / importData", () => {
  test("export returns JSON string", () => {
    markPrayer("Fajr", true, new Date("2025-06-15"));
    const exported = exportData();
    const parsed = JSON.parse(exported);
    expect(parsed["2025-06-15"].Fajr).toBe(true);
  });

  test("import restores data", () => {
    const data = { "2025-06-15": { Fajr: true, Dhuhr: false, Asr: false, Maghrib: false, Isha: false } };
    importData(JSON.stringify(data));
    expect(getTrackingForDate(new Date("2025-06-15")).Fajr).toBe(true);
  });

  test("import rejects invalid JSON", () => {
    expect(importData("not-valid-json{{{")).toBe(false);
  });
});
