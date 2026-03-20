import { useState, useEffect, useRef, useCallback } from 'react';
import './AddingNumbers.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';

const TOTAL_ROUNDS = 10;

function generateRound() {
  return [
    Math.floor(Math.random() * 10000) + 1,
    Math.floor(Math.random() * 10000) + 1,
    Math.floor(Math.random() * 10000) + 1,
  ];
}

function formatNumber(n) {
  return n.toLocaleString('en-US');
}

function AddingNumbers({ onComplete, onBack }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [numbers, setNumbers] = useState(() => generateRound());
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const inputRef = useRef(null);

  const correctAnswer = numbers.reduce((a, b) => a + b, 0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentRound]);

  const advanceRound = useCallback(() => {
    if (currentRound < TOTAL_ROUNDS - 1) {
      setCurrentRound((r) => r + 1);
      setNumbers(generateRound());
      setUserAnswer('');
      setFeedback('');
    } else {
      setIsGameComplete(true);
    }
  }, [currentRound]);

  const handleSubmit = useCallback(() => {
    if (feedback || userAnswer.trim() === '') return;

    const parsed = parseInt(userAnswer.replace(/,/g, ''), 10);

    if (parsed === correctAnswer) {
      const newScore = score + 1;
      setScore(newScore);
      setFeedback('correct');
      playSuccessSound();
      setTimeout(() => advanceRound(), 1500);
    } else {
      setFeedback('incorrect');
      playErrorSound();
      setTimeout(() => {
        setFeedback('');
        setUserAnswer('');
        if (inputRef.current) inputRef.current.focus();
      }, 1500);
    }
  }, [feedback, userAnswer, correctAnswer, score, advanceRound]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleComplete = () => {
    onComplete(score);
  };

  if (isGameComplete) {
    return (
      <div className="adding-numbers-container">
        <div className="game-complete">
          <div className="complete-icon">🏅</div>
          <h2>כל הכבוד!</h2>
          <h3>Well Done!</h3>
          <p className="final-score">ניקוד: {score}/{TOTAL_ROUNDS}</p>
          <div className="star-display">
            {'⭐'.repeat(Math.min(score, 5))}
          </div>
          <button className="an-primary" onClick={handleComplete}>
            סיום
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="adding-numbers-container">
      <div className="game-header">
        <button className="back-button" onClick={onBack}>
          ← חזרה
        </button>
        <div className="game-title">
          <h2>➕ חיבור מספרים ➕</h2>
          <h3>Adding Numbers</h3>
        </div>
        <div className="score-display">
          ניקוד: {score}/{TOTAL_ROUNDS}
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentRound + 1) / TOTAL_ROUNDS) * 100}%` }}
        />
      </div>

      <div className="game-content">
        <div className="instruction">
          כמה זה ביחד?
          <br />
          <span className="instruction-english">What is the sum?</span>
        </div>

        <div className="equation-display">
          {numbers.map((n, i) => (
            <span key={i}>
              <span className="addend">{formatNumber(n)}</span>
              {i < numbers.length - 1 && <span className="operator">+</span>}
            </span>
          ))}
          <span className="operator">=</span>
          <span className="question-mark">?</span>
        </div>

        <div className="answer-area">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            className={`answer-input ${feedback}`}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="הקלד את התשובה..."
            disabled={!!feedback}
            min="0"
          />
          <button
            className="an-primary submit-button"
            onClick={handleSubmit}
            disabled={!!feedback || userAnswer.trim() === ''}
          >
            בדוק ✓
          </button>
        </div>

        {feedback === 'correct' && (
          <div className="feedback-message success">
            ✅ כל הכבוד! נכון מאוד!
          </div>
        )}

        {feedback === 'incorrect' && (
          <div className="feedback-message error">
            ❌ נסה שוב! Try again!
          </div>
        )}

        <div className="round-indicator">
          סיבוב {currentRound + 1} מתוך {TOTAL_ROUNDS}
        </div>
      </div>
    </div>
  );
}

export default AddingNumbers;
