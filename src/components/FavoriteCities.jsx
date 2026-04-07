import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import '../styles/favoriteCities.css';

export default function FavoriteCities() {
    const [favorites, setFavorites] = useState([]);
    const [prayerData, setPrayerData] = useState({});
    const [newCity, setNewCity] = useState('');
    const [loading, setLoading] = useState(false);

    // تحميل المفضلة من localStorage
    useEffect(() => {
        const saved = localStorage.getItem('favoriteCities');
        if (saved) {
            setFavorites(JSON.parse(saved));
        }
    }, []);

    // جلب أوقات الصلاة للمدن المفضلة
    useEffect(() => {
        const fetchPrayerTimes = async () => {
            const data = {};
            for (const city of favorites) {
                try {
                    const res = await api.get(`/prayertimes/today?city=${city}`);
                    data[city] = res.data;
                } catch (err) {
                    console.error(`فشل جلب أوقات ${city}:`, err);
                }
            }
            setPrayerData(data);
        };

        if (favorites.length > 0) {
            fetchPrayerTimes();
        }
    }, [favorites]);

    // حفظ في localStorage
    const saveFavorites = (newFavs) => {
        setFavorites(newFavs);
        localStorage.setItem('favoriteCities', JSON.stringify(newFavs));
    };

    // إضافة مدينة
    const addCity = async () => {
        if (!newCity.trim()) return;

        setLoading(true);
        try {
            // تحقق من وجود المدينة
            const res = await api.get(`/prayertimes/today?city=${newCity}`);
            if (res.data) {
                const cityName = res.data.cityName;
                if (!favorites.includes(cityName)) {
                    saveFavorites([...favorites, cityName]);
                    setPrayerData({ ...prayerData, [cityName]: res.data });
                }
                setNewCity('');
            }
        } catch (err) {
            toast.error('لم نجد هذه المدينة');
        } finally {
            setLoading(false);
        }
    };

    // حذف مدينة
    const removeCity = (city) => {
        const newFavs = favorites.filter(c => c !== city);
        saveFavorites(newFavs);
        const newData = { ...prayerData };
        delete newData[city];
        setPrayerData(newData);
    };

    return (
        <div className="favorites-card">
            <h3 className="favorites-title">⭐ المدن المفضلة</h3>

            {/* إضافة مدينة جديدة */}
            <div className="favorites-add">
                <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="اسم المدينة (بالإنجليزية)..."
                    onKeyDown={(e) => e.key === 'Enter' && addCity()}
                />
                <button onClick={addCity} disabled={loading}>
                    {loading ? '...' : '+'}
                </button>
            </div>

            {/* قائمة المفضلة */}
            {favorites.length === 0 ? (
                <p className="favorites-empty">لم تضف أي مدن بعد</p>
            ) : (
                <div className="favorites-list">
                    {favorites.map(city => {
                        const data = prayerData[city];
                        return (
                            <div key={city} className="favorite-item">
                                <div className="favorite-header">
                                    <span className="favorite-city">{city}</span>
                                    {data && <span className="favorite-country">{data.country}</span>}
                                    <button
                                        className="favorite-remove"
                                        onClick={() => removeCity(city)}
                                    >
                                        ✕
                                    </button>
                                </div>
                                {data && (
                                    <div className="favorite-times">
                                        <span>🌙 {data.timings?.Fajr || '--'}</span>
                                        <span>☀️ {data.timings?.Dhuhr || '--'}</span>
                                        <span>🌤️ {data.timings?.Asr || '--'}</span>
                                        <span>🌅 {data.timings?.Maghrib || '--'}</span>
                                        <span>🌃 {data.timings?.Isha || '--'}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
