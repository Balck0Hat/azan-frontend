import { BADGES } from '../data/achievementsData';
import useAchievements from '../hooks/useAchievements';
import '../styles/achievements.css';

export default function Achievements() {
  const { points, unlockedBadges, showNewBadge, currentLevel, nextLevel, progressToNext } = useAchievements();

  return (
    <div className="achievements">
      {showNewBadge && (
        <div className="new-badge-popup">
          <span className="badge-icon">{showNewBadge.icon}</span>
          <div className="badge-info">
            <span className="badge-title">شارة جديدة!</span>
            <span className="badge-name">{showNewBadge.name}</span>
          </div>
          <span className="badge-points">+{showNewBadge.points}</span>
        </div>
      )}

      <div className="level-card">
        <div className="level-header">
          <span className="level-icon">{currentLevel.icon}</span>
          <div className="level-info">
            <span className="level-name">{currentLevel.name}</span>
            <span className="level-number">المستوى {currentLevel.level}</span>
          </div>
          <div className="points-display">
            <span className="points-value">{points}</span>
            <span className="points-label">نقطة</span>
          </div>
        </div>

        {nextLevel && (
          <div className="level-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressToNext}%` }} />
            </div>
            <span className="progress-text">
              {nextLevel.minPoints - points} نقطة للمستوى التالي
            </span>
          </div>
        )}
      </div>

      <div className="badges-section">
        <h4 className="badges-title">🏆 الشارات</h4>
        <div className="badges-grid">
          {BADGES.map(badge => {
            const unlocked = unlockedBadges.includes(badge.id);
            return (
              <div key={badge.id} className={`badge-item ${unlocked ? 'unlocked' : 'locked'}`} title={badge.desc}>
                <span className="badge-icon">{badge.icon}</span>
                <span className="badge-name">{badge.name}</span>
                {!unlocked && <div className="badge-lock">🔒</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
