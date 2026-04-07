import { getCategoryLabel } from "../data/quranRules";

export default function QuranRuleCard({ rule, isFavorited, isCopied, isHighlighted, onToggleFavorite, onCopy }) {
  return (
    <div
      id={`qr-card-${rule.id}`}
      className={"qr-card" + (isHighlighted ? " highlighted" : "")}
    >
      <div className="qr-card-top">
        <span className="qr-card-category">{getCategoryLabel(rule.category)}</span>
        <div className="qr-card-actions">
          <button
            className={"qr-icon-btn" + (isFavorited ? " favorited" : "")}
            onClick={() => onToggleFavorite(rule.id)}
            title={isFavorited ? "إزالة من المفضلة" : "إضافة للمفضلة"}
          >
            {isFavorited ? "⭐" : "☆"}
          </button>
          <button
            className={"qr-icon-btn" + (isCopied ? " copied" : "")}
            onClick={() => onCopy(rule)}
            title="نسخ القاعدة"
          >
            {isCopied ? "✓" : "📋"}
          </button>
        </div>
      </div>

      <p className="qr-card-verse">﴿{rule.verse}﴾</p>
      <p className="qr-card-surah">سورة {rule.surah} — آية {rule.ayahNum}</p>
      <p className="qr-card-rule">{rule.rule}</p>
      <p className="qr-card-explanation">{rule.explanation}</p>
    </div>
  );
}
