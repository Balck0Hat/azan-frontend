import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import "../styles/App.css"; // عشان الألوان العامة
import "../styles/countriesNow.css"; // لو فيها كروت عامة

// ملف جغرافي جاهز (CDN بسيط وخفيف)
const GEO_URL =
    "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// مؤقتًا: مدن عشوائية كـ "أمثلة" على أماكن الأذان الآن
// لاحقًا بنربطها مع API حقيقي
const MOCK_CITIES = [
    { name: "عمّان",        coords: [35.9306, 31.9632], prayer: "المغرب" },
    { name: "الرياض",       coords: [46.7219, 24.6877], prayer: "العِشاء" },
    { name: "القاهرة",      coords: [31.2357, 30.0444], prayer: "المغرب" },
    { name: "إسطنبول",     coords: [28.9784, 41.0082], prayer: "العصر" },
    { name: "جاكرتا",      coords: [106.8456, -6.2088], prayer: "العِشاء" },
    { name: "الدار البيضاء", coords: [-7.5898, 33.5731], prayer: "المغرب" },
    { name: "لندن",        coords: [-0.1276, 51.5074], prayer: "الظهر" },
    { name: "نيويورك",      coords: [-74.006, 40.7128], prayer: "الفجر" },
];

function WorldGlobeCard() {
    const cities = useMemo(() => MOCK_CITIES, []);

    return (
        <section className="card home-card">
            <h2 className="card-title">موجة الأذان على خريطة العالم</h2>
            <p className="muted-text">
                عرض تقريبي لمواقع بعض المدن حول العالم حيث يُؤذَّن في أوقات مختلفة.
                لاحقًا سنربطها ببيانات حقيقية من الـ API.
            </p>

            <div className="globe-map-wrapper">
                <ComposableMap
                    projection="geoEqualEarth"
                    projectionConfig={{
                        scale: 150,
                    }}
                    style={{ width: "100%", height: "280px" }}
                >
                    {/* طبقة الدول */}
                    <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    style={{
                                        default: {
                                            fill: "#020617",
                                            stroke: "#1f2937",
                                            strokeWidth: 0.5,
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: "#111827",
                                            stroke: "#334155",
                                            strokeWidth: 0.6,
                                            outline: "none",
                                        },
                                        pressed: {
                                            fill: "#111827",
                                            outline: "none",
                                        },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {/* نقاط المدن */}
                    {cities.map((city) => (
                        <Marker key={city.name} coordinates={city.coords}>
                            {/* الدائرة */}
                            <circle
                                r={4}
                                fill="#22c55e"
                                stroke="#facc15"
                                strokeWidth={1.2}
                            />
                            {/* النص */}
                            <text
                                textAnchor="middle"
                                y={-10}
                                style={{
                                    fontFamily: "system-ui",
                                    fontSize: "0.45rem",
                                    fill: "#e5e7eb",
                                }}
                            >
                                {city.name}
                            </text>
                        </Marker>
                    ))}
                </ComposableMap>
            </div>
        </section>
    );
}

export default WorldGlobeCard;
