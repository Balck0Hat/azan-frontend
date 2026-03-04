import NextPrayerCard from "./NextPrayerCard";
import LocalCityCard from "./LocalCityCard";

/**
 * الصفحة الرئيسية - فيها 4 كروت:
 * - مدينتك الحالية
 * - الصلاة القادمة
 * - الدول/المدن اللي بعدها حيأذَّن (Countdown)
 * - خريطة صغيرة / غيمة الأذان
 */

function HomeOverview() {
    return (
        <section className="home-grid">
            <LocalCityCard />
            <NextPrayerCard />
        </section>
    );
}

export default HomeOverview;
