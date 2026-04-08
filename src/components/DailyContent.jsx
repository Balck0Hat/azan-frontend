import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    setHadith(HADITHS[dayOfYear % HADITHS.length]);
    setVerse(VERSES[dayOfYear % VERSES.length]);
  }, []);

  if (!hadith || !verse) return null;

  return (
    <div className="space-y-4">
      {/* Verse Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 bg-gradient-to-br from-indigo-600/15 to-amber-600/10 border border-indigo-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">📖</span>
          <span className="text-indigo-300 font-medium text-sm">آية اليوم</span>
        </div>
        <p className="text-2xl text-[var(--text-primary)] leading-relaxed text-center mb-3 py-2">
          ❝ {verse.text} ❞
        </p>
        <p className="text-amber-400/70 text-sm text-center">{verse.surah}</p>
      </motion.div>

      {/* Hadith Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 bg-gradient-to-br from-purple-600/10 to-emerald-600/10 border border-purple-500/10 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🌟</span>
          <span className="text-purple-300 font-medium text-sm">حديث اليوم</span>
        </div>
        <p className="text-xl text-[var(--text-primary)] leading-relaxed text-center mb-3 py-2">
          ❝ {hadith.text} ❞
        </p>
        <p className="text-emerald-400/70 text-sm text-center">{hadith.source}</p>
      </motion.div>
    </div>
  );
}
