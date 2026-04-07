export default function KhatmaDetails({ data, onReset }) {
  return (
    <div className="qk-details">
      <div className="qk-details-header">
        <h4>تفاصيل الختمة #{data.currentKhatma}</h4>
        <button className="qk-reset-btn" onClick={onReset}>إعادة تعيين</button>
      </div>

      <div className="qk-info-row">
        <span>تاريخ البدء:</span>
        <span>{data.startDate}</span>
      </div>

      <div className="qk-info-row">
        <span>الأجزاء المتبقية:</span>
        <span>{30 - data.completedJuz.length} جزء</span>
      </div>

      {data.history.length > 0 && (
        <div className="qk-history">
          <h5>الختمات السابقة</h5>
          {data.history.slice(-5).reverse().map((h, idx) => (
            <div key={idx} className="qk-history-item">
              <span>ختمة #{h.khatmaNumber}</span>
              <span>{h.completedDate}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
