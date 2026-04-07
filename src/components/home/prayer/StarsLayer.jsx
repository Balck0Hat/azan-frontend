import { useState } from "react";

export default function StarsLayer({ isHovered, isNight }) {
  const STAR_COUNT = isNight ? 40 : 22;

  const [stars] = useState(() =>
    Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1.2,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 65}%`,
      duration: `${Math.random() * 2 + 1.5}s`,
      delay: `${Math.random() * 2}s`,
    })),
  );

  return (
    <div className="np-stars-layer">
      {stars.map((star) => (
        <div
          key={star.id}
          className="np-star"
          style={{
            width: star.size,
            height: star.size,
            left: star.left,
            top: star.top,
            animationDuration: star.duration,
            animationDelay: star.delay,
            opacity: isHovered ? 1 : 0.7,
          }}
        />
      ))}

      {isNight && (
        <div
          className="np-moon"
          style={{
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
        >
          <div className="np-moon-spot np-moon-spot-1" />
          <div className="np-moon-spot np-moon-spot-2" />
          <div className="np-moon-spot np-moon-spot-3" />
        </div>
      )}
    </div>
  );
}
