import { useState, useCallback } from 'react';
import './RhymeTime.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';

const RHYME_PAIRS = [
  {
    word: 'cat',
    rhymes: ['hat', 'bat', 'mat'],
    correctRhyme: 'hat',
    emoji: '🐱',
    hebrew: 'חתול'
  },
  {
    word: 'bee',
    rhymes: ['tree', 'car', 'dog'],
    correctRhyme: 'tree',
    emoji: '🐝',
    hebrew: 'דבורה'
  },
  {
    word: 'sun',
    rhymes: ['run', 'sit', 'fly'],
    correctRhyme: 'run',
    emoji: '☀️',
    hebrew: 'שמש'
  },
  {
    word: 'cake',
    rhymes: ['lake', 'book', 'hand'],
    correctRhyme: 'lake',
    emoji: '🍰',
    hebrew: 'עוגה'
  },
  {
    word: 'king',
    rhymes: ['ring', 'moon', 'fish'],
    correctRhyme: 'ring',
    emoji: '👑',
    hebrew: 'מלך'
  },
  {
    word: 'moon',
    rhymes: ['spoon', 'bird', 'star'],
    correctRhyme: 'spoon',
    emoji: '🌙',
    hebrew: 'ירח'
  },
  {
    word: 'bear',
    rhymes: ['chair', 'book', 'jump'],
    correctRhyme: 'chair',
    emoji: '🐻',
    hebrew: 'דוב'
  },
  {
    word: 'car',
    rhymes: ['star', 'home', 'blue'],
    correctRhyme: 'star',
    emoji: '🚗',
    hebrew: 'מכונית'
  }
];

function RhymeTime({ onComplete, onBack }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);

  const currentPair = RHYME_PAIRS[currentRound];

  const speakWord = useCallback((word) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Speech error:', error);
      }
    }
  }, []);

  const handleRhymeSelect = (rhyme) => {
    setSelectedAnswer(rhyme);
    
    if (rhyme === currentPair.correctRhyme) {
      setFeedback('correct');
      setScore(score + 1);
      playSuccessSound();
      
      setTimeout(() => {
        if (currentRound < RHYME_PAIRS.length - 1) {
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
      <div className="rhyme-time-container">
        <div className="game-complete">
          <div className="complete-icon">🎉</div>
          <h2>כל הכבוד!</h2>
          <h3>Amazing!</h3>
          <p className="final-score">ניקוד: {score}/{RHYME_PAIRS.length}</p>
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
    <div className="rhyme-time-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← חזרה
        </button>
        <div className="game-title">
          <h2>🎵 זמן חרוזים 🎵</h2>
          <h3>Rhyme Time</h3>
        </div>
        <div className="score-display">
          ניקוד: {score}/{RHYME_PAIRS.length}
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentRound + 1) / RHYME_PAIRS.length) * 100}%` }}
        />
      </div>

      <div className="game-content">
        <div className="instruction">
          בחרו מילה שמתחרזת עם:
          <br />
          <span className="instruction-english">Choose a word that rhymes with:</span>
        </div>

        <div className="current-word">
          <div className="word-emoji">{currentPair.emoji}</div>
          <div className="word-text">{currentPair.word}</div>
          <div className="word-hebrew">{currentPair.hebrew}</div>
          <button 
            className="speaker-button"
            onClick={() => speakWord(currentPair.word)}
            aria-label="Speak word"
          >
            🔊
          </button>
        </div>

        <div className="rhyme-options">
          {currentPair.rhymes.map((rhyme, index) => (
            <button
              key={index}
              className={`rhyme-option ${
                selectedAnswer === rhyme
                  ? feedback === 'correct'
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              onClick={() => handleRhymeSelect(rhyme)}
              disabled={selectedAnswer !== null}
            >
              <span className="rhyme-text">{rhyme}</span>
              <button 
                className="mini-speaker"
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(rhyme);
                }}
                aria-label={`Speak ${rhyme}`}
              >
                🔊
              </button>
            </button>
          ))}
        </div>

        {feedback === 'correct' && (
          <div className="feedback-message success">
            ✓ מצוין! Perfect!
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

export default RhymeTime;
