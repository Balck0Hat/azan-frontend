import { useEffect, useState } from "react";

export default function FlipNumber({ value, label }) {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== prevValue) {
      setIsFlipping(true);
      const t = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 150);
      return () => clearTimeout(t);
    }
  }, [value, prevValue]);

  return (
    <div className="flip-number">
      <div className={`flip-box ${isFlipping ? "flip-box--anim" : ""}`}>
        {isFlipping ? prevValue : value}
        <div className="flip-box-divider" />
      </div>
      <span className="flip-label">{label}</span>
    </div>
  );
}
