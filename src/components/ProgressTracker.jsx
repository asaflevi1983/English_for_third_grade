import './ProgressTracker.css';

function ProgressTracker({ stars, badges }) {
  return (
    <div className="progress-tracker">
      <div className="stars-container">
        <span className="star-icon">⭐</span>
        <span className="star-count">{stars}</span>
      </div>
      <div className="badges-container">
        {badges.length > 0 && (
          <div className="badges-list">
            {badges.map((badge, index) => (
              <span key={index} className="badge" title={badge}>
                🏆
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;
