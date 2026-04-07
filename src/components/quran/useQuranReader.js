import { useState, useEffect, useRef } from 'react';
import SURAHS from '../../data/surahs.json';
import { fetchSurah, fetchAllTafsirs, searchQuran, getAudioUrl } from '../../services/quranApi';

export default function useQuranReader() {
  const [view, setView] = useState('surahs');
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [tafsirs, setTafsirs] = useState({});
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [selectedTafsir, setSelectedTafsir] = useState('ar_muyassar');
  const [selectedReciter, setSelectedReciter] = useState('mishary');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [playingAyah, setPlayingAyah] = useState(null);
  const [fontSize, setFontSize] = useState(28);
  const [bookmarks, setBookmarks] = useState([]);
  const [lastRead, setLastRead] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [juzFilter, setJuzFilter] = useState(0);
  const audioRef = useRef(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('quranBookmarks') || '[]');
    const savedLastRead = JSON.parse(localStorage.getItem('quranLastRead') || 'null');
    const savedFontSize = localStorage.getItem('quranFontSize');
    const savedReciter = localStorage.getItem('quranReciter');
    const savedTafsir = localStorage.getItem('quranTafsir');
    setBookmarks(savedBookmarks);
    setLastRead(savedLastRead);
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
    if (savedReciter) setSelectedReciter(savedReciter);
    if (savedTafsir) setSelectedTafsir(savedTafsir);
  }, []);

  const loadSurah = async (surah) => {
    setLoading(true); setSelectedSurah(surah); setView('reader');
    setSelectedAyah(null); setTafsirs({});
    const result = await fetchSurah(surah.num, selectedReciter);
    if (result.success) setAyahs(result.ayahs);
    setLoading(false);
  };

  const loadTafsir = async (ayahNumber) => {
    if (selectedAyah === ayahNumber) { setSelectedAyah(null); return; }
    setSelectedAyah(ayahNumber); setTafsirLoading(true);
    const lastReadData = { surah: selectedSurah.num, surahName: selectedSurah.name, ayah: ayahNumber, timestamp: Date.now() };
    setLastRead(lastReadData);
    localStorage.setItem('quranLastRead', JSON.stringify(lastReadData));
    const result = await fetchAllTafsirs(selectedSurah.num, ayahNumber);
    setTafsirs(result); setTafsirLoading(false);
  };

  const playAudio = (ayahNumber) => {
    if (playingAyah === ayahNumber) { audioRef.current?.pause(); setPlayingAyah(null); return; }
    const url = getAudioUrl(selectedSurah.num, ayahNumber, selectedReciter);
    if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); setPlayingAyah(ayahNumber); }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    const result = await searchQuran(searchQuery);
    setSearchResults(result.matches || []); setSearchLoading(false);
  };

  const toggleBookmark = (surahNum, ayahNum) => {
    const key = `${surahNum}:${ayahNum}`;
    let newBookmarks;
    if (bookmarks.some(b => b.key === key)) {
      newBookmarks = bookmarks.filter(b => b.key !== key);
    } else {
      const surah = SURAHS.find(s => s.num === surahNum);
      newBookmarks = [...bookmarks, { key, surah: surahNum, surahName: surah?.name, ayah: ayahNum, timestamp: Date.now() }];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('quranBookmarks', JSON.stringify(newBookmarks));
  };

  const isBookmarked = (surahNum, ayahNum) => bookmarks.some(b => b.key === `${surahNum}:${ayahNum}`);

  const saveSetting = (key, value) => localStorage.setItem(key, value);

  const filteredSurahs = juzFilter === 0 ? SURAHS : SURAHS.filter(s => s.juz === juzFilter);

  const continueReading = () => {
    if (lastRead) {
      const surah = SURAHS.find(s => s.num === lastRead.surah);
      if (surah) loadSurah(surah);
    }
  };

  return {
    view, setView, selectedSurah, ayahs, loading, selectedAyah, tafsirs,
    tafsirLoading, selectedTafsir, setSelectedTafsir, selectedReciter, setSelectedReciter,
    searchQuery, setSearchQuery, searchResults, searchLoading, playingAyah,
    fontSize, setFontSize, bookmarks, lastRead, showSettings, setShowSettings,
    juzFilter, setJuzFilter, audioRef, setPlayingAyah,
    loadSurah, loadTafsir, playAudio, handleSearch, toggleBookmark, isBookmarked,
    saveSetting, filteredSurahs, continueReading,
  };
}
