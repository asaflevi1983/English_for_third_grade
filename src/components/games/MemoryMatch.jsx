import { useState, useEffect } from 'react';
import './MemoryMatch.css';
import { playSuccessSound, playErrorSound, playCelebrationSound } from '../../utils/audioUtils';

const WORD_PAIRS = [
  { english: 'apple', emoji: '🍎', hebrew: 'תפוח' },
  { english: 'house', emoji: '🏠', hebrew: 'בית' },
  { english: 'heart', emoji: '❤️', hebrew: 'לב' },
  { english: 'star', emoji: '⭐', hebrew: 'כוכב' },
  { english: 'flower', emoji: '🌸', hebrew: 'פרח' },
  { english: 'book', emoji: '📚', hebrew: 'ספר' },
  { english: 'sun', emoji: '☀️', hebrew: 'שמש' },
  { english: 'moon', emoji: '🌙', hebrew: 'ירח' }
];

function MemoryMatch({ onComplete, onBack }) {
  // Initialize cards with shuffled positions using useState initializer
  const [cards] = useState(() => {
    const gameCards = [];
    WORD_PAIRS.forEach((pair, index) => {
      // English card
      gameCards.push({
        id: `en-${index}`,
        pairId: index,
        type: 'english',
        content: pair.english,
        emoji: pair.emoji
      });
      // Hebrew card
      gameCards.push({
        id: `he-${index}`,
        pairId: index,
        type: 'hebrew',
        content: pair.hebrew,
        emoji: pair.emoji
      });
    });
    
    // Shuffle cards
    return gameCards.sort(() => Math.random() - 0.5);
  });
  
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);

  // Check for completion
  useEffect(() => {
    if (matchedPairs.length === WORD_PAIRS.length && matchedPairs.length > 0) {
      playCelebrationSound();
      setTimeout(() => {
        setIsGameComplete(true);
      }, 1000);
    }
  }, [matchedPairs]);

  const handleCardClick = (card) => {
    // Ignore if game is checking, card is already flipped, or card is matched
    if (isChecking || flippedCards.includes(card.id) || matchedPairs.includes(card.pairId)) {
      return;
    }

    const newFlipped = [...flippedCards, card.id];
    setFlippedCards(newFlipped);

    // Check if two cards are flipped
    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves(moves + 1);

      const firstCard = cards.find(c => c.id === newFlipped[0]);
      const secondCard = cards.find(c => c.id === newFlipped[1]);

      // Check if cards match (same pairId, different type)
      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match found!
        playSuccessSound();
        setMatchedPairs([...matchedPairs, firstCard.pairId]);
        setFlippedCards([]);
        setIsChecking(false);
      } else {
        // No match
        playErrorSound();
        setTimeout(() => {
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const calculateScore = () => {
    // Score based on moves: fewer moves = higher score
    // Perfect game = 8 moves (one per pair) = 8 stars
    // Each 2 extra moves reduces score by 1 star
    // Minimum score is 1 star, maximum is 8 stars
    const perfectMoves = WORD_PAIRS.length;
    const maxScore = 8;
    const score = Math.max(1, Math.min(maxScore, Math.ceil(maxScore - (moves - perfectMoves) / 2)));
    return score;
  };

  const handleComplete = () => {
    onComplete(calculateScore());
  };

  if (isGameComplete) {
    return (
      <div className="memory-match-container">
        <div className="game-complete">
          <div className="complete-icon">🎉</div>
          <h2>כל הכבוד!</h2>
          <h3>Well Done!</h3>
          <p className="final-moves">מספר מהלכים: {moves}</p>
          <p className="final-score">ניקוד: {calculateScore()}/{WORD_PAIRS.length}</p>
          <div className="star-display">
            {'⭐'.repeat(Math.min(calculateScore(), 5))}
          </div>
          <button className="primary" onClick={handleComplete}>
            סיום
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-match-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← חזרה
        </button>
        <div className="game-title">
          <h2>🧠 משחק הזיכרון 🧠</h2>
          <h3>Memory Match</h3>
        </div>
        <div className="stats-display">
          <div className="stat">
            <span className="stat-label">מהלכים:</span>
            <span className="stat-value">{moves}</span>
          </div>
          <div className="stat">
            <span className="stat-label">זוגות:</span>
            <span className="stat-value">{matchedPairs.length}/{WORD_PAIRS.length}</span>
          </div>
        </div>
      </div>

      <div className="instruction">
        מצאו את הזוגות התואמים!
        <br />
        <span className="instruction-english">Find the matching pairs!</span>
      </div>

      <div className="cards-grid">
        {cards.map((card) => {
          const isFlipped = flippedCards.includes(card.id);
          const isMatched = matchedPairs.includes(card.pairId);
          
          return (
            <div
              key={card.id}
              className={`memory-card ${isFlipped || isMatched ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => handleCardClick(card)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-back-design">?</div>
                </div>
                <div className="card-back">
                  <div className="card-emoji">{card.emoji}</div>
                  <div className={`card-text ${card.type === 'english' ? 'english' : 'hebrew'}`}>
                    {card.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MemoryMatch;
