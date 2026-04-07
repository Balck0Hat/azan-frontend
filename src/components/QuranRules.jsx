import { useState, useMemo, useCallback, useRef } from "react";
import quranRules, { categories } from "../data/quranRules";
import QuranRuleCard from "./QuranRuleCard";
import "../styles/quranRules.css";

function getDailyRule() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return quranRules[dayOfYear % quranRules.length];
}

function QuranRules() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("qr-favorites") || "[]"); } catch { return []; }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [highlightedId, setHighlightedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const gridRef = useRef(null);
  const dailyRule = useMemo(() => getDailyRule(), []);

  const filtered = useMemo(() => {
    let list = quranRules;
    if (showFavoritesOnly) list = list.filter((r) => favorites.includes(r.id));
    if (activeCategory !== "all") list = list.filter((r) => r.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((r) => r.verse.includes(q) || r.rule.includes(q) || r.explanation.includes(q) || r.surah.includes(q));
    }
    return list;
  }, [search, activeCategory, favorites, showFavoritesOnly]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("qr-favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const copyRule = useCallback((rule) => {
    const text = `${rule.verse}\n— ${rule.surah}: ${rule.ayahNum}\n\n${rule.rule}\n${rule.explanation}`;
    navigator.clipboard.writeText(text).then(() => { setCopiedId(rule.id); setTimeout(() => setCopiedId(null), 1500); });
  }, []);

  const randomRule = useCallback(() => {
    const rule = quranRules[Math.floor(Math.random() * quranRules.length)];
    setActiveCategory("all"); setSearch(""); setShowFavoritesOnly(false); setHighlightedId(rule.id);
    setTimeout(() => { document.getElementById(`qr-card-${rule.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }, 50);
    setTimeout(() => setHighlightedId(null), 2500);
  }, []);

  return (
    <div className="quran-rules-page">
      <div className="qr-header">
        <h2>قواعد الحياة من القرآن</h2>
        <p>قواعد حياتية مستخلصة من كتاب الله العزيز</p>
      </div>

      <div className="qr-daily-card">
        <div className="qr-daily-badge">قاعدة اليوم</div>
        <p className="qr-daily-verse">﴿{dailyRule.verse}﴾</p>
        <p className="qr-daily-surah">سورة {dailyRule.surah} — آية {dailyRule.ayahNum}</p>
        <p className="qr-daily-rule">{dailyRule.rule}</p>
        <p className="qr-daily-explanation">{dailyRule.explanation}</p>
      </div>

      <div className="qr-toolbar">
        <div className="qr-search-wrap">
          <input type="text" className="qr-search-input" placeholder="ابحث في الآيات والقواعد..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <span className="qr-search-icon">🔍</span>
        </div>
        <button className="qr-random-btn" onClick={randomRule}>🎲 قاعدة عشوائية</button>
      </div>

      <div className="qr-categories">
        {categories.map((cat) => (
          <button key={cat.key} className={"qr-cat-btn" + (activeCategory === cat.key ? " active" : "")} onClick={() => setActiveCategory(cat.key)}>{cat.label}</button>
        ))}
      </div>

      <div className="qr-fav-filter">
        <button className={"qr-fav-btn" + (showFavoritesOnly ? " active" : "")} onClick={() => setShowFavoritesOnly((v) => !v)}>
          {showFavoritesOnly ? "⭐" : "☆"} المفضلة{favorites.length > 0 && ` (${favorites.length})`}
        </button>
      </div>

      <div className="qr-count">{filtered.length} قاعدة{search && ` — نتائج البحث عن "${search}"`}</div>

      {filtered.length === 0 ? (
        <div className="qr-empty"><div className="qr-empty-icon">📜</div><p>{showFavoritesOnly ? "لم تضف أي قاعدة للمفضلة بعد" : "لا توجد نتائج مطابقة"}</p></div>
      ) : (
        <div className="qr-grid" ref={gridRef}>
          {filtered.map((rule) => (
            <QuranRuleCard key={rule.id} rule={rule} isFavorited={favorites.includes(rule.id)} isCopied={copiedId === rule.id}
              isHighlighted={highlightedId === rule.id} onToggleFavorite={toggleFavorite} onCopy={copyRule} />
          ))}
        </div>
      )}
    </div>
  );
}

export default QuranRules;
