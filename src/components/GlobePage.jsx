import { useEffect, useState } from "react";
import api from "../api";
import "../styles/globe.css"; // لو بدك تضيف CSS منفصل

export default function GlobePage() {
    const [waves, setWaves] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get("/prayertimes/adhan-wave");
                setWaves(res.data.waves || []);
            } catch (e) {
                console.error(e);
            }
        };

        load();
        const interval = setInterval(load, 30000); // تحديث كل 30 ثانية
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="globe-wrapper">

            <h1 className="globe-title">الموجــــة العالميــــة لـــلأذان</h1>
            <p className="globe-subtitle">تحديث مباشر — تتحرك من الشرق إلى الغرب</p>

            <div className="globe-big">
                {/* Sweep Line */}
                <div className="sweep-line" />

                {/* نقاط المدن */}
                {waves.map((w) =>
                    w.longitudes.map((lon, i) => {
                        const x = ((lon + 180) / 360) * 100;
                        return (
                            <div
                                key={w.prayer + i}
                                className="dot"
                                style={{
                                    left: `${x}%`,
                                    background: w.color
                                }}
                            />
                        );
                    })
                )}

                {/* Pulse waves */}
                {waves.map((w, i) => (
                    <div
                        key={i}
                        className="pulse"
                        style={{
                            borderColor: w.color,
                            animationDelay: `${i * 0.3}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}
