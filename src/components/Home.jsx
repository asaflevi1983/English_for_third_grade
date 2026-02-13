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
    }
  ];

  const allGamesCompleted = progress.completedGames.length === 4;

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
