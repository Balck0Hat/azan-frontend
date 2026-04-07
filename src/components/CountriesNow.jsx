import { useEffect, useState } from "react";
import api from "../api";
import "../styles/countriesNow.css"; // لو بدك تضيف CSS منفصل

function CountriesNow() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // تجميع المدن حسب الدولة
    const groupByCountry = (cities) => {
        const map = {};

        cities.forEach((item) => {
            const country = item.country || "Unknown";
            if (!map[country]) {
                map[country] = {
                    country,
                    countryCode: item.countryCode || "",
                    countCities: 0,
                    sampleCities: [],
                };
            }
            map[country].countCities += 1;
            if (map[country].sampleCities.length < 3) {
                map[country].sampleCities.push(item.city);
            }
        });

        return Object.values(map);
    };

    const fetchCountries = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await api.get("/prayertimes/now", {
                params: { prayer: "Maghrib" }, // ممكن تتعدل حسب الكرت المختار
            });

            const rawCities = res.data.cities || [];
            const grouped = groupByCountry(rawCities);

            setCountries(grouped);
        } catch (err) {
            console.error(err);
            setError("حدث خطأ أثناء جلب بيانات الدول.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    return (
        <div className="card countries-card">

            <div className="card-header">
                <h2 className="card-title">الدول التي يُؤذَّن فيها الآن</h2>

                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-text">{error}</div>
            )}

            <div className="countries-list">
                {countries.slice(0, 10).map((item, index) => (
                    <div key={index} className="country-row">
                        <div className="country-name">
                            {item.country}
                            {item.countCities > 1 && (
                                <span className="cities-count">
                                    ({item.countCities} مدن)
                                </span>
                            )}
                        </div>

                        <div className="sample-cities">
                            {item.sampleCities.join("، ")}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default CountriesNow;
