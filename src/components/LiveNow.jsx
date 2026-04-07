import {useEffect, useState} from "react";
import api from "../api";

const PRAYERS = [
    {key: "Fajr", label: "الفجر"},
    {key: "Dhuhr", label: "الظهر"},
    {key: "Asr", label: "العصر"},
    {key: "Maghrib", label: "المغرب"},
    {key: "Isha", label: "العِشاء"},
];

function LiveNow() {
    const [currentPrayer, setCurrentPrayer] = useState("Maghrib");
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchLive = async (prayerKey) => {
        try {
            setLoading(true);
            setError("");
            // خليّنا اللست زي ما هي عشان ما تختفي وقت اللودينغ
            const res = await api.get("/prayertimes/now", {
                params: {prayer: prayerKey},
            });

            setCities(res.data.cities || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "تعذّر جلب المدن التي يُؤذَّن فيها الآن."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLive(currentPrayer);
    }, [currentPrayer]);

    return (
        <div className="card live-now-card">
            <h2 className="card-title">الآن يُؤذَّن في...</h2>

            <div className="tabs">
                {PRAYERS.map((p) => (
                    <button
                        key={p.key}
                        className={
                            "tab-btn" + (currentPrayer === p.key ? " tab-btn-active" : "")
                        }
                        onClick={() => setCurrentPrayer(p.key)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="live-card-body">
                {/* ميسج في حال ما في داتا */}
                {cities.length === 0 && !loading && !error && (
                    <div className="muted-text">
                        لا توجد بيانات جاهزة بعد لهذه الصلاة، أو لم نضبط الـ API.
                    </div>
                )}

                {/* ايرور */}
                {error && <div className="alert-error">{error}</div>}

                {/* اللست مع سكرول داخلي – بتعرض الكل، بس الظاهر تقريبًا 10 عناصر */}
                {cities.length > 0 && (
                    <div className="live-list-container">
                        <ul className="live-list">
                            {cities.map((city) => (
                                <li
                                    key={city._id || `${city.cityName}-${city.country}`}
                                    className="live-list-item"
                                >
                                    <span className="live-city-name">
                                        {city.cityName} – {city.country}
                                    </span>
                                    <span className="live-city-time">
                                        {city.timeLocal || city.timeUtc || "--:--"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* لودينغ أوفرلاي فوق المحتوى */}
                {loading && (
                    <div className="live-loading-overlay">
                        <div className="spinner" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default LiveNow;
