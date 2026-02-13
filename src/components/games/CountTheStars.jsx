import { useState, useCallback } from 'react';
import './CountTheStars.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';

const COUNTING_CHALLENGES = [
  {
    emoji: '⭐',
    count: 3,
    options: [2, 3, 4],
    word: 'stars',
    hebrew: 'כוכבים'
  },
  {
    emoji: '🍎',
    count: 5,
    options: [4, 5, 6],
    word: 'apples',
    hebrew: 'תפוחים'
  },
  {
    emoji: '🐱',
    count: 4,
    options: [3, 4, 5],
    word: 'cats',
    hebrew: 'חתולים'
  },
  {
    emoji: '🌸',
    count: 6,
    options: [5, 6, 7],
    word: 'flowers',
    hebrew: 'פרחים'
  },
  {
    emoji: '🎈',
    count: 7,
    options: [6, 7, 8],
    word: 'balloons',
    hebrew: 'בלונים'
  },
  {
    emoji: '🍬',
    count: 2,
    options: [1, 2, 3],
    word: 'candies',
    hebrew: 'ממתקים'
  },
  {
    emoji: '🚗',
    count: 8,
    options: [7, 8, 9],
    word: 'cars',
    hebrew: 'מכוניות'
  },
  {
    emoji: '🦋',
    count: 5,
    options: [4, 5, 6],
    word: 'butterflies',
    hebrew: 'פרפרים'
  },
  {
    emoji: '🍕',
    count: 3,
    options: [2, 3, 4],
    word: 'pizzas',
    hebrew: 'פיצות'
  },
  {
    emoji: '🌈',
    count: 4,
    options: [3, 4, 5],
    word: 'rainbows',
    hebrew: 'קשתות'
  }
];

function CountTheStars({ onComplete, onBack }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const currentChallenge = COUNTING_CHALLENGES[currentRound];

  const speakNumber = useCallback((number) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(number.toString());
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Speech error:', error);
      }
    }
  }, []);

  const handleNumberSelect = (number) => {
    setSelectedAnswer(number);
    
    if (number === currentChallenge.count) {
      setFeedback('correct');
      setScore(score + 1);
      playSuccessSound();
      
      setTimeout(() => {
        if (currentRound < COUNTING_CHALLENGES.length - 1) {
          setCurrentRound(currentRound + 1);
          setSelectedAnswer(null);
          setFeedback('');
        } else {
          setIsGameComplete(true);
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
      playErrorSound();
      
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback('');
      }, 1500);
    }
  };

  const handleComplete = () => {
    onComplete(score);
  };

  if (isGameComplete) {
    return (
      <div className="count-stars-container">
        <div className="game-complete">
          <div className="complete-icon">🎉</div>
          <h2>כל הכבוד!</h2>
          <h3>Amazing!</h3>
          <p className="final-score">ניקוד: {score}/{COUNTING_CHALLENGES.length}</p>
          <div className="star-display">
            {'⭐'.repeat(Math.min(score, 5))}
          </div>
          <button className="primary" onClick={handleComplete}>
            סיום
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="count-stars-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← חזרה
        </button>
        <div className="game-title">
          <h2>🔢 ספרו את הכוכבים 🔢</h2>
          <h3>Count the Stars</h3>
        </div>
        <div className="score-display">
          ניקוד: {score}/{COUNTING_CHALLENGES.length}
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentRound + 1) / COUNTING_CHALLENGES.length) * 100}%` }}
        />
      </div>

      <div className="game-content">
        <div className="instruction">
          כמה {currentChallenge.hebrew} יש?
          <br />
          <span className="instruction-english">How many {currentChallenge.word}?</span>
        </div>

        <div className="items-display">
          {Array.from({ length: currentChallenge.count }).map((_, index) => (
            <div 
              key={index} 
              className="item-emoji"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {currentChallenge.emoji}
            </div>
          ))}
        </div>

        <div className="number-options">
          {currentChallenge.options.map((option, index) => (
            <button
              key={index}
              className={`number-option ${
                selectedAnswer === option
                  ? feedback === 'correct'
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              onClick={() => handleNumberSelect(option)}
              disabled={selectedAnswer !== null}
            >
              <span className="number-value">{option}</span>
              <button 
                className="mini-speaker"
                onClick={(e) => {
                  e.stopPropagation();
                  speakNumber(option);
                }}
                aria-label={`Speak ${option}`}
              >
                🔊
              </button>
            </button>
          ))}
        </div>

        {feedback === 'correct' && (
          <div className="feedback-message success">
            ✓ נכון מאוד! Correct!
          </div>
        )}
        
        {feedback === 'incorrect' && (
          <div className="feedback-message error">
            ✗ נסו שוב! Try again!
          </div>
        )}
      </div>
    </div>
  );
}

export default CountTheStars;
