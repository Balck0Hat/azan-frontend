export const BADGES = [
  { id: 'first_prayer', name: 'البداية', desc: 'سجّل أول صلاة', icon: '🌟', points: 10, condition: (s) => s.totalPrayers >= 1 },
  { id: 'day_complete', name: 'يوم كامل', desc: 'صلّ 5 صلوات في يوم', icon: '✨', points: 50, condition: (s) => s.completeDays >= 1 },
  { id: 'week_warrior', name: 'محارب الأسبوع', desc: 'أكمل أسبوعاً كاملاً', icon: '🏆', points: 200, condition: (s) => s.streak >= 7 },
  { id: 'fajr_hero', name: 'بطل الفجر', desc: 'صلّ الفجر 10 مرات', icon: '🌙', points: 100, condition: (s) => s.fajrCount >= 10 },
  { id: 'consistent', name: 'المداوم', desc: 'صلّ 100 صلاة', icon: '💪', points: 300, condition: (s) => s.totalPrayers >= 100 },
  { id: 'month_master', name: 'سيد الشهر', desc: 'أكمل 30 يوم متتالي', icon: '👑', points: 500, condition: (s) => s.streak >= 30 },
  { id: 'tasbeeh_starter', name: 'المسبّح', desc: 'أكمل 1000 تسبيحة', icon: '📿', points: 150, condition: (s) => s.totalTasbeeh >= 1000 },
  { id: 'quran_reader', name: 'قارئ القرآن', desc: 'اقرأ 10 أجزاء', icon: '📖', points: 250, condition: (s) => s.quranParts >= 10 },
];

export const LEVELS = [
  { level: 1, name: 'مبتدئ', minPoints: 0, icon: '🌱' },
  { level: 2, name: 'متعلم', minPoints: 100, icon: '🌿' },
  { level: 3, name: 'ملتزم', minPoints: 300, icon: '🌳' },
  { level: 4, name: 'مجتهد', minPoints: 600, icon: '⭐' },
  { level: 5, name: 'متميز', minPoints: 1000, icon: '🌟' },
  { level: 6, name: 'بطل', minPoints: 1500, icon: '🏅' },
  { level: 7, name: 'أسطورة', minPoints: 2500, icon: '👑' },
];
