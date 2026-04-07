import NextPrayerCard from "../components/home/NextPrayerCard";
import LocalCityCard from "../components/home/LocalCityCard";
import GlobePreviewCard from "../components/home/GlobePreviewCard";
import PrayerCountdown from "./PrayerCountdown";
import HijriCalendar from "./HijriCalendar";
import DailyContent from "./DailyContent";
import QiblaCompass from "./QiblaCompass";
import FavoriteCities from "./FavoriteCities";
import Adhkar from "./Adhkar";
import PrayerTrackingCard from "./PrayerTrackingCard";
import QuranKhatma from "./QuranKhatma";
import NotificationSettings from "./NotificationSettings";

/**
 * الصفحة الرئيسية - فيها كروت:
 * - العد التنازلي للصلاة القادمة
 * - التقويم الهجري
 * - محتوى يومي (آية وحديث)
 * - مدينتك الحالية
 * - الصلاة القادمة
 * - بوصلة القبلة
 * - المدن المفضلة
 * - الأذكار
 * - خريطة العالم
 */

function HomeOverview({ setActiveCard }) {
    return (
        <section className="home-grid">
            {/* القسم العلوي */}
            <div className="home-top-section">
                <PrayerCountdown />
                <HijriCalendar />
            </div>

            {/* المحتوى اليومي */}
            <DailyContent />

            {/* الكروت الأساسية */}
            <div className="home-main-section">
                <LocalCityCard />
                <NextPrayerCard />
            </div>

            {/* بوصلة القبلة والمفضلة */}
            <div className="home-side-section">
                <QiblaCompass />
                <FavoriteCities />
            </div>

            {/* متابعة الصلوات */}
            <PrayerTrackingCard />

            {/* ختمة القرآن */}
            <QuranKhatma />

            {/* الأذكار */}
            <Adhkar type="afterPrayer" />

            {/* إعدادات الإشعارات */}
            <NotificationSettings />

            {/* خريطة العالم */}
            <GlobePreviewCard setActiveCard={setActiveCard} />
        </section>
    );
}

export default HomeOverview;
