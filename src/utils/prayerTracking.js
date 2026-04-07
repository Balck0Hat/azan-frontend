// Prayer Tracking Utility - Store and retrieve prayer tracking data

const STORAGE_KEY = 'prayerTracking';
const PRAYERS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// Get today's date string (YYYY-MM-DD)
function getDateString(date = new Date()) {
    return date.toISOString().split('T')[0];
}

// Get all tracking data
export function getAllTrackingData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

// Save all tracking data
function saveAllTrackingData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch {
        return false;
    }
}

// Get tracking data for a specific date
export function getTrackingForDate(date = new Date()) {
    const dateStr = getDateString(date);
    const allData = getAllTrackingData();

    return allData[dateStr] || {
        Fajr: false,
        Dhuhr: false,
        Asr: false,
        Maghrib: false,
        Isha: false
    };
}

// Mark a prayer as prayed or not
export function markPrayer(prayer, prayed = true, date = new Date()) {
    if (!PRAYERS.includes(prayer)) {
        return false;
    }

    const dateStr = getDateString(date);
    const allData = getAllTrackingData();

    if (!allData[dateStr]) {
        allData[dateStr] = {
            Fajr: false,
            Dhuhr: false,
            Asr: false,
            Maghrib: false,
            Isha: false
        };
    }

    allData[dateStr][prayer] = prayed;
    return saveAllTrackingData(allData);
}

// Toggle prayer status
export function togglePrayer(prayer, date = new Date()) {
    const current = getTrackingForDate(date);
    return markPrayer(prayer, !current[prayer], date);
}

// Get statistics for a date range
export function getStatistics(days = 7) {
    const allData = getAllTrackingData();
    const stats = {
        totalPrayers: 0,
        prayedCount: 0,
        byPrayer: {
            Fajr: { total: 0, prayed: 0 },
            Dhuhr: { total: 0, prayed: 0 },
            Asr: { total: 0, prayed: 0 },
            Maghrib: { total: 0, prayed: 0 },
            Isha: { total: 0, prayed: 0 }
        },
        dailyData: [],
        streak: 0
    };

    const today = new Date();
    let currentStreak = 0;
    let streakBroken = false;

    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = getDateString(date);
        const dayData = allData[dateStr] || {};

        let dayPrayed = 0;
        let dayTotal = 0;

        PRAYERS.forEach((prayer) => {
            stats.totalPrayers++;
            stats.byPrayer[prayer].total++;
            dayTotal++;

            if (dayData[prayer]) {
                stats.prayedCount++;
                stats.byPrayer[prayer].prayed++;
                dayPrayed++;
            }
        });

        // Calculate streak (all 5 prayers per day)
        if (!streakBroken && dayPrayed === 5) {
            currentStreak++;
        } else if (i > 0) { // Don't break streak on first day if incomplete
            streakBroken = true;
        }

        stats.dailyData.push({
            date: dateStr,
            prayed: dayPrayed,
            total: dayTotal,
            percentage: Math.round((dayPrayed / dayTotal) * 100)
        });
    }

    stats.streak = currentStreak;
    stats.percentage = stats.totalPrayers > 0
        ? Math.round((stats.prayedCount / stats.totalPrayers) * 100)
        : 0;

    return stats;
}

// Get weekly summary
export function getWeeklySummary() {
    return getStatistics(7);
}

// Get monthly summary
export function getMonthlySummary() {
    return getStatistics(30);
}

// Clean old data (keep only last 90 days)
export function cleanOldData() {
    const allData = getAllTrackingData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    const cutoffStr = getDateString(cutoffDate);

    const cleanedData = {};
    Object.keys(allData).forEach((dateStr) => {
        if (dateStr >= cutoffStr) {
            cleanedData[dateStr] = allData[dateStr];
        }
    });

    saveAllTrackingData(cleanedData);
    return cleanedData;
}

// Export data (for backup)
export function exportData() {
    return JSON.stringify(getAllTrackingData(), null, 2);
}

// Import data (for restore)
export function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        saveAllTrackingData(data);
        return true;
    } catch {
        return false;
    }
}
