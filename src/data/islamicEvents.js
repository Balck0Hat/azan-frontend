// Islamic Events and Holidays
// Format: { month: day: { name, type, description } }
// Types: religious, historical, special

export const ISLAMIC_EVENTS = {
    // محرم (الشهر 1)
    1: {
        1: {
            name: 'رأس السنة الهجرية',
            type: 'religious',
            description: 'بداية السنة الهجرية الجديدة'
        },
        10: {
            name: 'يوم عاشوراء',
            type: 'religious',
            description: 'يوم صيام مستحب'
        }
    },
    // صفر (الشهر 2)
    2: {},
    // ربيع الأول (الشهر 3)
    3: {
        12: {
            name: 'المولد النبوي',
            type: 'religious',
            description: 'ذكرى مولد النبي محمد ﷺ'
        }
    },
    // ربيع الثاني (الشهر 4)
    4: {},
    // جمادى الأولى (الشهر 5)
    5: {},
    // جمادى الآخرة (الشهر 6)
    6: {},
    // رجب (الشهر 7)
    7: {
        27: {
            name: 'ليلة الإسراء والمعراج',
            type: 'religious',
            description: 'ذكرى رحلة الإسراء والمعراج'
        }
    },
    // شعبان (الشهر 8)
    8: {
        15: {
            name: 'ليلة النصف من شعبان',
            type: 'religious',
            description: 'ليلة مباركة'
        }
    },
    // رمضان (الشهر 9)
    9: {
        1: {
            name: 'بداية رمضان',
            type: 'religious',
            description: 'أول أيام شهر رمضان المبارك'
        },
        27: {
            name: 'ليلة القدر (المرجحة)',
            type: 'special',
            description: 'ليلة خير من ألف شهر'
        }
    },
    // شوال (الشهر 10)
    10: {
        1: {
            name: 'عيد الفطر',
            type: 'religious',
            description: 'أول أيام عيد الفطر المبارك'
        },
        2: {
            name: 'ثاني أيام عيد الفطر',
            type: 'religious',
            description: ''
        },
        3: {
            name: 'ثالث أيام عيد الفطر',
            type: 'religious',
            description: ''
        }
    },
    // ذو القعدة (الشهر 11)
    11: {},
    // ذو الحجة (الشهر 12)
    12: {
        8: {
            name: 'يوم التروية',
            type: 'religious',
            description: 'بداية مناسك الحج'
        },
        9: {
            name: 'يوم عرفة',
            type: 'special',
            description: 'خير يوم طلعت عليه الشمس'
        },
        10: {
            name: 'عيد الأضحى',
            type: 'religious',
            description: 'أول أيام عيد الأضحى المبارك'
        },
        11: {
            name: 'ثاني أيام التشريق',
            type: 'religious',
            description: 'أيام ذكر الله'
        },
        12: {
            name: 'ثالث أيام التشريق',
            type: 'religious',
            description: 'أيام ذكر الله'
        },
        13: {
            name: 'رابع أيام التشريق',
            type: 'religious',
            description: 'آخر أيام التشريق'
        }
    }
};

// Get event for a specific hijri date
export function getEventForDate(hijriMonth, hijriDay) {
    const monthEvents = ISLAMIC_EVENTS[hijriMonth];
    if (!monthEvents) return null;
    return monthEvents[hijriDay] || null;
}

// Get all events for a month
export function getEventsForMonth(hijriMonth) {
    const monthEvents = ISLAMIC_EVENTS[hijriMonth];
    if (!monthEvents) return [];

    return Object.entries(monthEvents).map(([day, event]) => ({
        day: parseInt(day),
        ...event
    })).sort((a, b) => a.day - b.day);
}

// Get upcoming events (next 30 days)
export function getUpcomingEvents(currentHijriMonth, currentHijriDay, count = 5) {
    const events = [];

    // Check current month
    const currentMonthEvents = ISLAMIC_EVENTS[currentHijriMonth] || {};
    Object.entries(currentMonthEvents).forEach(([day, event]) => {
        if (parseInt(day) >= currentHijriDay) {
            events.push({
                month: currentHijriMonth,
                day: parseInt(day),
                daysUntil: parseInt(day) - currentHijriDay,
                ...event
            });
        }
    });

    // Check next months
    for (let i = 1; i <= 12 && events.length < count; i++) {
        const nextMonth = ((currentHijriMonth - 1 + i) % 12) + 1;
        const monthEvents = ISLAMIC_EVENTS[nextMonth] || {};

        Object.entries(monthEvents).forEach(([day, event]) => {
            if (events.length < count) {
                events.push({
                    month: nextMonth,
                    day: parseInt(day),
                    daysUntil: (i * 30) + parseInt(day) - currentHijriDay, // Approximate
                    ...event
                });
            }
        });
    }

    return events.slice(0, count);
}

// Hijri month names
export const HIJRI_MONTHS = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];

// Blessed days for fasting
export const BLESSED_FASTING_DAYS = {
    weekly: [1, 4], // Monday and Thursday (0 = Sunday)
    monthly: {
        white: [13, 14, 15], // الأيام البيض
    }
};
