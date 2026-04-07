import i18n from "i18next";
import {initReactI18next} from "react-i18next";

const resources = {
    en: {
        common: {
            app_title: "Azan Live",
            app_subtitle:
                "Track prayer times for more than 200,000 cities worldwide and see where the adhan is being called right now.",
            city_card_title: "Today's prayer times for a city",
            city_label: "City name (English for now)",
            city_button: "Show times",
            live_card_title: "Adhan is being called now in...",
            error_generic: "An error occurred while fetching data.",
            no_data: "No data available yet for this prayer.",
            "now_stats_title": "Adhan statistics right now",
            "now_stats_subtitle": "Adhan is currently being called in {{total}} cities worldwide (any prayer).",
            "now_stats_footer": "Time windows are calculated within ±{{minutes}} minutes from the current time.",
            "prayer_fajr": "Fajr",
            "prayer_dhuhr": "Dhuhr",
            "prayer_asr": "Asr",
            "prayer_maghrib": "Maghrib",
            "prayer_isha": "Isha",
            "loading": "Loading...",
            "last_updated": "Last updated {{seconds}} seconds ago",

        }
    },
    ar: {
        common: {
            app_title: "الأذان مباشر",
            app_subtitle:
                "تابع أوقات الصلاة لأكثر من مئتي ألف مدينة حول العالم، واعرف أين يُؤذَّن الآن، وفي أي مدينة حان وقت الصلاة القادمة.",
            city_card_title: "أوقات الصلاة لمدينة معيّنة",
            city_label: "اسم المدينة (حالياً بالإنجليزي)",
            city_button: "عرض الأوقات",
            live_card_title: "الآن يُؤذَّن في...",
            error_generic: "صار خطأ أثناء جلب البيانات.",
            no_data: "لا توجد بيانات جاهزة بعد لهذه الصلاة.",
            "now_stats_title": "إحصائيات الأذان الآن",
            "now_stats_subtitle": "يُؤذَّن الآن في {{total}} مدينة حول العالم (أي صلاة).",
            "now_stats_footer": "النوافذ الزمنية محسوبة في حدود ±{{minutes}} دقيقة من الوقت الحالي.",
            "prayer_fajr": "الفجر",
            "prayer_dhuhr": "الظهر",
            "prayer_asr": "العصر",
            "prayer_maghrib": "المغرب",
            "prayer_isha": "العِشاء",
            "loading": "جاري التحميل...",
            "last_updated": "آخر تحديث قبل {{seconds}} ثانية",

        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "ar", // اللغة الافتراضية
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
