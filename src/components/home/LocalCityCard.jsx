import {useEffect, useState} from "react";
import api from "../../api";
import "../../styles/LocalCityCard.css";

/* 🇯🇴 كرت مدينتك الحالية – نسخة فاخرة */
const MAIN_PRAYERS = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

const PRAYER_LABELS = {
    Fajr: { ar: "الفجر", en: "Fajr", icon: "🌙" },
    Sunrise: { ar: "الشروق", en: "Sunrise", icon: "🌅" },
    Dhuhr: { ar: "الظهر", en: "Dhuhr", icon: "☀️" },
    Asr: { ar: "العصر", en: "Asr", icon: "🌤" },
    Maghrib: { ar: "المغرب", en: "Maghrib", icon: "🌇" },
    Isha: { ar: "العشاء", en: "Isha", icon: "🌙" },
    Imsak: { ar: "الإمساك", en: "Imsak", icon: "⭐" },
    Midnight: { ar: "منتصف الليل", en: "Midnight", icon: "🌙" },
    "Last third": { ar: "ثلث الليل الأخير", en: "Last third", icon: "⭐" },
    Lastthird: { ar: "ثلث الليل الأخير", en: "Last third", icon: "⭐" },
};

function LocalCityCard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchLocal = async () => {
            try {
                const res = await api.get("/prayertimes/local/today");
                setData(res.data);
            } catch (e) {
                console.error(e);
            }
        };

        fetchLocal();
    }, []);

    const times = data?.times || {};
    const mainPrayers = MAIN_PRAYERS.filter((p) => times[p]);
    const extraPrayers = Object.entries(times).filter(
        ([name]) => !MAIN_PRAYERS.includes(name)
    );

    return (
        <div className="card home-card city-card">
            {/* 🔹 الهيدر الجديد */}
            <div className="city-header-row">
                {data && (
                    <div className="city-chip">
                        {data.city} – {data.country}
                    </div>
                )}

                <div className="city-header-text">
                    <div className="city-location-line">
                        <span className="city-location-label">مدينتك الآن</span>
                        <span className="city-location-pin">📍</span>
                    </div>

                    {data && (
                        <p className="city-timezone">
                            <span className="city-timezone-label">المنطقة الزمنية</span>
                            <span className="city-timezone-sep">:</span>
                            <span className="city-timezone-value">{data.timezone}</span>
                            <span className="city-timezone-icon">🕒</span>
                        </p>
                    )}
                </div>
            </div>

            {!data ? (
                <p className="muted-text">جاري تحديد موقعك وجلب أوقات الصلاة…</p>
            ) : (
                <>
                    {/* البلاطات الرئيسية للصلوات الست */}
                    <div className="city-main-grid">
                        {mainPrayers.map((key) => {
                            const time = times[key];
                            const labels = PRAYER_LABELS[key] || { ar: key, en: key, icon: "🕰" };

                            return (
                                <div
                                    key={key}
                                    className={`city-tile city-tile-${key.toLowerCase()}`}
                                >
                                    <div className="city-tile-top">
                                        <div className="city-tile-icon">{labels.icon}</div>
                                        <div className="city-tile-time">{time}</div>
                                    </div>
                                    <div className="city-tile-bottom">
                                        <div className="city-tile-ar">{labels.ar}</div>
                                        <div className="city-tile-en">{labels.en}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* أوقات إضافية (إمساك / منتصف الليل / ثلث الليل) */}
                    {extraPrayers.length > 0 && (
                        <>
                            <div className="city-extra-title">أوقات إضافية</div>
                            <div className="city-extra-list">
                                {extraPrayers.map(([name, time]) => {
                                    const labels = PRAYER_LABELS[name] || {
                                        ar: name,
                                        en: name,
                                        icon: "⭐",
                                    };
                                    return (
                                        <div key={name} className="city-extra-item">
                                            <div className="city-extra-left">
                                                <span className="city-extra-icon">{labels.icon}</span>
                                                <div className="city-extra-text">
                                                    <div className="city-extra-ar">{labels.ar}</div>
                                                    <div className="city-extra-en">{labels.en}</div>
                                                </div>
                                            </div>
                                            <div className="city-extra-time">{time}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}


export default LocalCityCard;
