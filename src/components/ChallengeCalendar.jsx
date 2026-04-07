import { CHALLENGE_PRAYERS } from '../data/challengeData';

export default function ChallengeCalendar({ challengeData, today }) {
  return (
    <div className="challenge-calendar">
      <div className="calendar-grid">
        {Array.from({ length: 40 }, (_, i) => {
          const dayNum = i + 1;
          const startDate = new Date(challengeData.startDate);
          const dayDate = new Date(startDate);
          dayDate.setDate(startDate.getDate() + i);
          const dateStr = dayDate.toISOString().split('T')[0];
          const dayData = challengeData.days[dateStr] || {};
          const isComplete = CHALLENGE_PRAYERS.every(p => dayData[p]);
          const isToday = dateStr === today;
          const isPast = dayDate < new Date() && !isToday;

          return (
            <div key={i} className={`calendar-day ${isComplete ? 'complete' : ''} ${isToday ? 'today' : ''} ${isPast && !isComplete ? 'missed' : ''}`}>
              <span className="day-num">{dayNum}</span>
              {isComplete && <span className="day-check">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
