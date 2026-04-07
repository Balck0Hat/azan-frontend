import { useState, useEffect } from 'react';
import '../styles/dailyContent.css';

// أحاديث مختارة
const HADITHS = [
    { text: 'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى', source: 'متفق عليه' },
    { text: 'المسلم من سلم المسلمون من لسانه ويده', source: 'متفق عليه' },
    { text: 'لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه', source: 'متفق عليه' },
    { text: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت', source: 'متفق عليه' },
    { text: 'الطهور شطر الإيمان', source: 'رواه مسلم' },
    { text: 'الدين النصيحة', source: 'رواه مسلم' },
    { text: 'إن الله رفيق يحب الرفق في الأمر كله', source: 'متفق عليه' },
    { text: 'خيركم من تعلم القرآن وعلمه', source: 'رواه البخاري' },
    { text: 'الكلمة الطيبة صدقة', source: 'متفق عليه' },
    { text: 'تبسمك في وجه أخيك صدقة', source: 'رواه الترمذي' },
    { text: 'ما نقصت صدقة من مال', source: 'رواه مسلم' },
    { text: 'الصلاة نور', source: 'رواه مسلم' },
];

// آيات مختارة
const VERSES = [
    { text: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ', surah: 'البقرة: 153' },
    { text: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', surah: 'الطلاق: 3' },
    { text: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', surah: 'الشرح: 5' },
    { text: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', surah: 'طه: 114' },
    { text: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً', surah: 'البقرة: 201' },
    { text: 'وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ', surah: 'النحل: 127' },
    { text: 'إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ', surah: 'الأعراف: 56' },
    { text: 'وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ', surah: 'البقرة: 110' },
];

export default function DailyContent() {
    const [hadith, setHadith] = useState(null);
    const [verse, setVerse] = useState(null);

    useEffect(() => {
        // اختيار حديث وآية بناءً على تاريخ اليوم
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));

        setHadith(HADITHS[dayOfYear % HADITHS.length]);
        setVerse(VERSES[dayOfYear % VERSES.length]);
    }, []);

    if (!hadith || !verse) return null;

    return (
        <div className="daily-content">
            {/* آية اليوم */}
            <div className="daily-card verse-card">
                <div className="daily-header">
                    <span className="daily-icon">📖</span>
                    <span className="daily-label">آية اليوم</span>
                </div>
                <p className="daily-text verse-text">❝ {verse.text} ❞</p>
                <span className="daily-source">{verse.surah}</span>
            </div>

            {/* حديث اليوم */}
            <div className="daily-card hadith-card">
                <div className="daily-header">
                    <span className="daily-icon">🌟</span>
                    <span className="daily-label">حديث اليوم</span>
                </div>
                <p className="daily-text">❝ {hadith.text} ❞</p>
                <span className="daily-source">{hadith.source}</span>
            </div>
        </div>
    );
}
