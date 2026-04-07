// Quran API Service - يستخدم عدة APIs للحصول على البيانات

const ALQURAN_API = 'https://api.alquran.cloud/v1';

// التفاسير المتاحة
export const TAFSIRS = {
    ar_muyassar: { id: 'ar.muyassar', name: 'التفسير الميسر', lang: 'ar' },
    ar_saadi: { id: 'ar.saadi', name: 'تفسير السعدي', lang: 'ar' },
    ar_kathir: { id: 'ar.kathir', name: 'تفسير ابن كثير', lang: 'ar' },
    ar_jalalayn: { id: 'ar.jalalayn', name: 'تفسير الجلالين', lang: 'ar' },
    ar_qurtubi: { id: 'ar.qurtubi', name: 'تفسير القرطبي', lang: 'ar' },
    ar_baghawi: { id: 'ar.baghawi', name: 'تفسير البغوي', lang: 'ar' },
    ar_tabari: { id: 'ar.tabari', name: 'تفسير الطبري', lang: 'ar' },
    en_sahih: { id: 'en.sahih', name: 'Sahih International', lang: 'en' },
};

// القراء المتاحين
export const RECITERS = {
    mishary: { id: 'ar.alafasy', name: 'مشاري العفاسي', folder: 'Alafasy_128kbps' },
    sudais: { id: 'ar.abdurrahmaansudais', name: 'عبدالرحمن السديس', folder: 'Sudais_128kbps' },
    shuraim: { id: 'ar.saudshuraim', name: 'سعود الشريم', folder: 'Shuraim_128kbps' },
    husary: { id: 'ar.husary', name: 'محمود خليل الحصري', folder: 'Husary_128kbps' },
    minshawi: { id: 'ar.minshawi', name: 'محمد صديق المنشاوي', folder: 'Minshawy_Murattal_128kbps' },
    abdulbasit: { id: 'ar.abdulbasitmurattal', name: 'عبدالباسط عبدالصمد', folder: 'Abdul_Basit_Murattal_128kbps' },
    maher: { id: 'ar.mahermuaiqly', name: 'ماهر المعيقلي', folder: 'MauroMueaql_128kbps' },
};

// جلب سورة مع نص القرآن
export async function fetchSurah(surahNumber, reciter = 'mishary') {
    try {
        const reciterData = RECITERS[reciter] || RECITERS.mishary;
        const response = await fetch(`${ALQURAN_API}/surah/${surahNumber}/${reciterData.id}`);
        const data = await response.json();

        if (data.code === 200) {
            return {
                success: true,
                surah: data.data,
                ayahs: data.data.ayahs.map(ayah => ({
                    number: ayah.numberInSurah,
                    text: ayah.text,
                    audio: ayah.audio,
                    juz: ayah.juz,
                    page: ayah.page,
                    hizbQuarter: ayah.hizbQuarter,
                }))
            };
        }
        return { success: false, error: 'Failed to fetch surah' };
    } catch (error) {
        console.error('Error fetching surah:', error);
        return { success: false, error: error.message };
    }
}

// جلب تفسير آية معينة
export async function fetchTafsir(surahNumber, ayahNumber, tafsirId = 'ar_muyassar') {
    try {
        const tafsir = TAFSIRS[tafsirId] || TAFSIRS.ar_muyassar;
        const response = await fetch(
            `${ALQURAN_API}/ayah/${surahNumber}:${ayahNumber}/${tafsir.id}`
        );
        const data = await response.json();

        if (data.code === 200) {
            return {
                success: true,
                tafsir: data.data.text,
                source: tafsir.name
            };
        }
        return { success: false, error: 'Failed to fetch tafsir' };
    } catch (error) {
        console.error('Error fetching tafsir:', error);
        return { success: false, error: error.message };
    }
}

// جلب جميع التفاسير لآية واحدة
export async function fetchAllTafsirs(surahNumber, ayahNumber) {
    const tafsirKeys = ['ar_muyassar', 'ar_saadi', 'ar_jalalayn', 'en_sahih'];
    const results = {};

    await Promise.all(
        tafsirKeys.map(async (key) => {
            const result = await fetchTafsir(surahNumber, ayahNumber, key);
            if (result.success) {
                results[key] = {
                    text: result.tafsir,
                    name: TAFSIRS[key].name
                };
            }
        })
    );

    return results;
}

// البحث في القرآن
export async function searchQuran(query) {
    try {
        const response = await fetch(
            `${ALQURAN_API}/search/${encodeURIComponent(query)}/all/ar`
        );
        const data = await response.json();

        if (data.code === 200) {
            return {
                success: true,
                count: data.data.count,
                matches: data.data.matches.map(match => ({
                    surah: match.surah.number,
                    surahName: match.surah.name,
                    ayah: match.numberInSurah,
                    text: match.text,
                }))
            };
        }
        return { success: false, error: 'No results found', matches: [] };
    } catch (error) {
        console.error('Error searching Quran:', error);
        return { success: false, error: error.message, matches: [] };
    }
}

// جلب صفحة من المصحف
export async function fetchPage(pageNumber) {
    try {
        const response = await fetch(`${ALQURAN_API}/page/${pageNumber}/quran-uthmani`);
        const data = await response.json();

        if (data.code === 200) {
            return {
                success: true,
                ayahs: data.data.ayahs
            };
        }
        return { success: false, error: 'Failed to fetch page' };
    } catch (error) {
        console.error('Error fetching page:', error);
        return { success: false, error: error.message };
    }
}

// جلب جزء كامل
export async function fetchJuz(juzNumber) {
    try {
        const response = await fetch(`${ALQURAN_API}/juz/${juzNumber}/quran-uthmani`);
        const data = await response.json();

        if (data.code === 200) {
            return {
                success: true,
                ayahs: data.data.ayahs
            };
        }
        return { success: false, error: 'Failed to fetch juz' };
    } catch (error) {
        console.error('Error fetching juz:', error);
        return { success: false, error: error.message };
    }
}

// رابط الصوت للآية
export function getAudioUrl(surahNumber, ayahNumber, reciter = 'mishary') {
    const reciterData = RECITERS[reciter] || RECITERS.mishary;
    const paddedSurah = String(surahNumber).padStart(3, '0');
    const paddedAyah = String(ayahNumber).padStart(3, '0');
    return `https://everyayah.com/data/${reciterData.folder}/${paddedSurah}${paddedAyah}.mp3`;
}

// رابط صوت السورة كاملة
export function getSurahAudioUrl(surahNumber, reciter = 'mishary') {
    const reciterData = RECITERS[reciter] || RECITERS.mishary;
    const paddedSurah = String(surahNumber).padStart(3, '0');
    return `https://server8.mp3quran.net/${reciterData.folder}/${paddedSurah}.mp3`;
}
