export default function LastTenNights({ ramadanDay }) {
    if (ramadanDay < 21) return null;

    const oddNights = [21, 23, 25, 27, 29];
    const isOddNight = oddNights.includes(ramadanDay);

    return (
        <div className="ram-card ram-last-ten">
            <div className="ram-last-ten-glow"></div>
            <div className="ram-card-title" style={{ justifyContent: "center" }}>
                🌟 العشر الأواخر من رمضان
            </div>
            <div className="ram-last-ten-text">
                {isOddNight
                    ? "الليلة ليلة وترية — قد تكون ليلة القدر!"
                    : `الليلة ليلة ${ramadanDay} — اجتهد في العبادة`
                }
            </div>
            <div className="ram-last-ten-dua">
                اللهم إنك عفو كريم تحب العفو فاعف عني
            </div>
            <div className="ram-last-ten-grid">
                {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((night) => (
                    <div
                        key={night}
                        className={
                            "ram-night-chip" +
                            (oddNights.includes(night) ? " odd" : "") +
                            (night === ramadanDay ? " current" : "") +
                            (night < ramadanDay ? " passed" : "")
                        }
                    >
                        <span className="ram-night-num">{night}</span>
                        {oddNights.includes(night) && (
                            <span className="ram-night-star">✦</span>
                        )}
                    </div>
                ))}
            </div>
            <div className="ram-last-ten-hint">
                ✦ الليالي الوترية — يُرجى فيها ليلة القدر
            </div>
        </div>
    );
}
