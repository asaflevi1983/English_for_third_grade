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

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function RhymeTime({ onComplete, onBack }) {
  const [pairDeck, setPairDeck] = useState(() => shuffleArray(RHYME_PAIRS));
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const currentPair = pairDeck[currentRound % pairDeck.length];

  const advanceRound = () => {
    const nextRound = currentRound + 1;

    if (nextRound % pairDeck.length === 0) {
      setPairDeck(shuffleArray(RHYME_PAIRS));
    }

    setCurrentRound(nextRound);
    setSelectedAnswer(null);
    setFeedback('');
  };

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
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(rhyme);
    
    if (rhyme === currentPair.correctRhyme) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      playSuccessSound();
      
      setTimeout(() => {
        advanceRound();
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

  return (
    <div className="rhyme-time-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← חזרה
        </button>
        <button className="secondary finish-session-button" onClick={() => onComplete(score)}>
          סיום ושמירה
        </button>
        <div className="game-title">
          <h2>🎵 זמן חרוזים 🎵</h2>
          <h3>Rhyme Time</h3>
        </div>
        <div className="score-display">
          ניקוד: {score} | סיבוב: {currentRound + 1}
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${(((currentRound % pairDeck.length) + 1) / pairDeck.length) * 100}%` }}
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
