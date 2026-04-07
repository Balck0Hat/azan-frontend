import { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:4000";

function CityPrayerTimes() {
    const [city, setCity] = useState("Amman");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!city.trim()) return;

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const res = await axios.get(`${API_BASE}/api/prayertimes/today`, {
                params: { city },
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "تعذّر جلب أوقات الصلاة لهذه المدينة. جرّب اسمًا آخر بالإنجليزي."
            );
        } finally {
            setLoading(false);
        }
    };

    const renderTable = () => {
        if (!result?.timings) return null;

        const order = [
            "Fajr",
            "Sunrise",
            "Dhuhr",
            "Asr",
            "Maghrib",
            "Isha",
            "Imsak",
            "Midnight",
            "Lastthird",
        ];

        const labels = {
            Fajr: "الفجر",
            Sunrise: "الشروق",
            Dhuhr: "الظهر",
            Asr: "العصر",
            Maghrib: "المغرب",
            Isha: "العشاء",
            Imsak: "الإمساك",
            Midnight: "منتصف الليل",
            Lastthird: "ثلث الليل الأخير",
        };

        return (
            <table className="prayer-table">
                <tbody>
                {order.map((key) => (
                    <tr key={key}>
                        <td className="prayer-name">{labels[key]}</td>
                        <td className="prayer-time">{result.timings[key]}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="card">
            <h2 className="card-title">أوقات الصلاة لمدينة معيّنة</h2>

            <form onSubmit={handleSubmit}>
                <label className="field-label">
                    اسم المدينة (بالإنجليزي حاليًا)
                </label>
                <input
                    className="input-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="مثال: Amman, Istanbul, Riyadh"
                />

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={loading || !city.trim()}
                >
                    {loading ? "جارِ تحميل الأوقات..." : "عرض الأوقات"}
                </button>
            </form>

            {error && <div className="alert-error">{error}</div>}

            {result && (
                <div className="result-block">
                    <div className="city-header">
                        <div className="city-name">
                            {result.cityName} – {result.country}
                        </div>
                        <div className="city-meta">
                            المنطقة الزمنية: {result.timezone}
                            {result.date && (
                                <>
                                    {" • "}تاريخ اليوم:{" "}
                                    {new Date(result.date).toISOString().slice(0, 10)}
                                </>
                            )}
                        </div>
                    </div>

                    {renderTable()}
                </div>
            )}
        </div>
    );
}

export default CityPrayerTimes;
