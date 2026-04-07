import { useState } from "react";
import { zakatFitrRates } from "../../data/ramadanData";

export default function ZakatCalculator() {
    const [country, setCountry] = useState("الأردن");
    const [members, setMembers] = useState(1);

    const rate = zakatFitrRates.find((r) => r.country === country) || zakatFitrRates[0];
    const total = rate.amount * members;

    return (
        <div className="ram-card">
            <div className="ram-card-title">💰 حاسبة زكاة الفطر</div>
            <div className="ram-zakat-form">
                <div className="ram-zakat-field">
                    <label>البلد</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                        {zakatFitrRates.map((r) => (
                            <option key={r.country} value={r.country}>
                                {r.country}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="ram-zakat-field">
                    <label>عدد الأفراد</label>
                    <div className="ram-zakat-counter">
                        <button onClick={() => setMembers((m) => Math.max(1, m - 1))}>−</button>
                        <span>{members}</span>
                        <button onClick={() => setMembers((m) => m + 1)}>+</button>
                    </div>
                </div>
            </div>
            <div className="ram-zakat-result">
                <div className="ram-zakat-total">
                    <span className="ram-zakat-amount">{total.toLocaleString()}</span>
                    <span className="ram-zakat-currency">{rate.currency}</span>
                </div>
                <div className="ram-zakat-note">
                    بمقدار صاع من {rate.unit} للفرد الواحد
                </div>
                <div className="ram-zakat-info">
                    تُخرج قبل صلاة العيد — ويجوز إخراجها من أول رمضان
                </div>
            </div>
        </div>
    );
}
