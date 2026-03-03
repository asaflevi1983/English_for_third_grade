import './Home.css';

function Home({ onStartGame, progress }) {
  const games = [
    {
      id: 'word-catcher',
      title: 'תופס המילים',
      subtitle: 'Word Catcher',
      emoji: '🎯',
      description: 'תפסו מילים והתאימו לתמונות!',
      color: '#f093fb'
    },
    {
      id: 'spell-magic',
      title: 'איות הקסם',
      subtitle: 'Spell the Magic',
      emoji: '✨',
      description: 'סדרו את האותיות נכון!',
      color: '#4facfe'
    },
    {
      id: 'speak-defeat',
      title: 'מדברים כדי לנצח',
      subtitle: 'Speak to Defeat',
      emoji: '🎤',
      description: 'תגידו את המילה בקול!',
      color: '#43e97b'
    },
    {
      id: 'choose-power',
      title: 'בחר את הכוח',
      subtitle: 'Choose the Power',
      emoji: '💪',
      description: 'בחרו את התשובה הנכונה!',
      color: '#fa709a'
    },
    {
      id: 'listen-write',
      title: 'הקשיבו וכתבו',
      subtitle: 'Listen and Write',
      emoji: '🎧',
      description: 'הקשיבו לאות וכתבו אותה!',
      color: '#667eea'
    },
    {
      id: 'rhyme-time',
      title: 'זמן חרוזים',
      subtitle: 'Rhyme Time',
      emoji: '🎵',
      description: 'מצאו מילים שמתחרזות!',
      color: '#764ba2'
    },
    {
      id: 'memory-match',
      title: 'משחק הזיכרון',
      subtitle: 'Memory Match',
      emoji: '🧠',
      description: 'מצאו את הזוגות התואמים!',
      color: '#f5576c'
    },
    {
      id: 'count-stars',
      title: 'ספרו את הכוכבים',
      subtitle: 'Count the Stars',
      emoji: '🔢',
      description: 'ספרו כמה פריטים יש!',
      color: '#00f2fe'
    },
    {
      id: 'weekly-dictation',
      title: 'הכתבה שבועית',
      subtitle: 'Weekly Dictation',
      emoji: '🗓️',
      description: 'המורה בחר מילים לשבוע הזה',
      color: '#667eea'
    }
  ];

  const communityCard = {
    id: 'community-board',
    title: 'לוח המסרים',
    subtitle: 'Community Board',
    emoji: '💬',
    description: 'שתפו הישגים ומסרים לחברי הכיתה!',
    color: '#f093fb'
  };

  const allGamesCompleted = progress.completedGames.length === games.length;

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">🎵 ציידות השדים של ה-KPOP 🎵</h1>
        <h2 className="subtitle">KPOP Demon Hunters</h2>
        <p className="story-text">
          הצטרפו לגיבורי ה-K-Pop ועזרו להם להילחם בשדים שגונבים מילים באנגלית! 
          <br />
          כל משחק מביס שד אחד ומקנה לכם כוכבים ותגים! ⭐
        </p>
      </div>

      <div className="games-grid">
        {games.map((game) => {
          const isCompleted = progress.completedGames.includes(game.id);
          const score = progress.scores[game.id] || 0;
          
          return (
            <div 
              key={game.id} 
              className={`game-card ${isCompleted ? 'completed' : ''}`}
              style={{ borderColor: game.color }}
            >
              <div className="game-emoji">{game.emoji}</div>
              <h3 className="game-title">{game.title}</h3>
              <p className="game-subtitle">{game.subtitle}</p>
              <p className="game-description">{game.description}</p>
              {isCompleted && (
                <div className="completion-badge">
                  ✓ הושלם! ⭐ {score}
                </div>
              )}
              <button 
                className="primary play-button"
                onClick={() => onStartGame(game.id)}
                style={{ background: `linear-gradient(135deg, ${game.color}, ${game.color}dd)` }}
              >
                {isCompleted ? 'שחק שוב' : 'התחל משחק'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="community-section">
        <div
          className="game-card community-card"
          style={{ borderColor: communityCard.color }}
        >
          <div className="game-emoji">{communityCard.emoji}</div>
          <h3 className="game-title">{communityCard.title}</h3>
          <p className="game-subtitle">{communityCard.subtitle}</p>
          <p className="game-description">{communityCard.description}</p>
          <button
            className="primary play-button"
            onClick={() => onStartGame(communityCard.id)}
            style={{ background: `linear-gradient(135deg, ${communityCard.color}, ${communityCard.color}dd)` }}
          >
            כנסו ללוח
          </button>
        </div>
      </div>

      {allGamesCompleted && (
        <div className="victory-banner">
          <h2>🎉 כל הכבוד! 🎉</h2>
          <p>ניצחתם את כל השדים! אתם אלופים!</p>
          <div className="final-stars">
            סה"כ כוכבים: ⭐ {progress.stars}
          </div>
        </div>
      )}

      <div className="demon-character">
        <div className="demon">👾</div>
        <div className="demon-text">תבסו אותי!</div>
      </div>

      <div className="hero-character">
        <div className="hero">🎸</div>
        <div className="hero-text">בואו נציל את המילים!</div>
      </div>
    </div>
  );
}

export default Home;
