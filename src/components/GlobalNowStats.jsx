import {useEffect, useState} from "react";
import api from "../api";
import {useTranslation} from "react-i18next";

const PRAYERS = [
    {key: "Fajr", labelKey: "prayer_fajr"},
    {key: "Dhuhr", labelKey: "prayer_dhuhr"},
    {key: "Asr", labelKey: "prayer_asr"},
    {key: "Maghrib", labelKey: "prayer_maghrib"},
    {key: "Isha", labelKey: "prayer_isha"},
];

function GlobalNowStats() {
    const {t} = useTranslation("common");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);
    const [nowTs, setNowTs] = useState(Date.now());

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get("/prayertimes/now/summary");
            setData(res.data);
            setLastUpdated(Date.now());
        } catch (err) {
            setError(
                err.response?.data?.message || t("error_generic")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        const intervalStats = setInterval(fetchStats, 60_000);
        const intervalTick = setInterval(() => {
            setNowTs(Date.now());
        }, 1000);
        return () => {
            clearInterval(intervalStats);
            clearInterval(intervalTick);
        };

        // نحدّث الأرقام كل 60 ثانية
        // const id = setInterval(fetchStats, 60_000);
        // return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let lastUpdatedText = "";
    if (lastUpdated) {
        const seconds = Math.max(
            0,
            Math.floor((nowTs - lastUpdated) / 1000)
        );
        lastUpdatedText = t("last_updated", {seconds});
    }


    return (

        <div className="card">
            <h2 className="card-title">{t("now_stats_title")}</h2>

            {loading && <div className="muted-text">{t("loading")}</div>}
            {error && <div className="alert-error">{error}</div>}

            {!loading && data && (
                <>
                    <p className="muted-text" style={{marginBottom: "8px"}}>
                        {t("now_stats_subtitle", {
                            total: data.totalAny ?? 0,
                        })}
                    </p>

                    <div className="stats-grid">
                        {PRAYERS.map((p) => (
                            <div key={p.key} className="stats-row">
                <span className="stats-prayer-name">
                  {t(p.labelKey)}
                </span>
                                <span className="stats-prayer-count">
                  {data.perPrayer?.[p.key] ?? 0}
                </span>
                            </div>
                        ))}
                    </div>

                    <p className="muted-text" style={{marginTop: "8px", fontSize: "0.8rem"}}>
                        {t("now_stats_footer", {
                            minutes: data.windowMinutes ?? 10,
                        })}
                    </p>
                    {lastUpdated && (
                        <p
                            className="muted-text"
                            style={{marginTop: "4px", fontSize: "0.8rem"}}
                        >
                            {lastUpdatedText}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}

export default GlobalNowStats;
