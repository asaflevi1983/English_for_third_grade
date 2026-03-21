import { useState, useRef, useEffect } from 'react';
import './AddThreeNumbers.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';

function generateNumbers() {
  // At least one number must have 4 digits (1000-9999)
  const fourDigit = Math.floor(Math.random() * 9000) + 1000;
  const other1 = Math.floor(Math.random() * 10000) + 1;
  const other2 = Math.floor(Math.random() * 10000) + 1;

  // Shuffle positions
  const nums = [fourDigit, other1, other2];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
}

function generateRound() {
  const numbers = generateNumbers();
  const correctAnswer = numbers[0] + numbers[1] + numbers[2];
  return { numbers, correctAnswer };
}

// Pad a number's digits to a given length (right-aligned)
function getDigits(num, totalCols) {
  const digits = num.toString().split('').map(Number);
  while (digits.length < totalCols) digits.unshift(null);
  return digits;
}

const TOTAL_ROUNDS = 10;

function AddThreeNumbers({ onComplete, onBack }) {
  const [round, setRound] = useState(() => generateRound());
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answerDigits, setAnswerDigits] = useState([]);
  const inputRefs = useRef([]);

  const answerStr = round.correctAnswer.toString();
  const answerLen = answerStr.length;
  // Total columns = max digits in answer (which is always >= any operand)
  const totalCols = answerLen;

  // Reset answer digits when round changes
  useEffect(() => {
    setAnswerDigits(Array(answerLen).fill(''));
    setSubmitted(false);
    setIsCorrect(false);
    setFeedback('');
    inputRefs.current = [];
    // Focus rightmost input after render
    setTimeout(() => {
      const lastRef = inputRefs.current[answerLen - 1];
      if (lastRef) lastRef.focus();
    }, 50);
  }, [currentRound, answerLen]);

  const handleDigitChange = (index, value) => {
    if (submitted) return;
    // Only allow single digit
    const cleaned = value.replace(/[^0-9]/g, '');
    if (cleaned.length > 1) return;

    const newDigits = [...answerDigits];
    newDigits[index] = cleaned;
    setAnswerDigits(newDigits);

    // Auto-advance to the left (previous column)
    if (cleaned !== '' && index > 0) {
      const prevRef = inputRefs.current[index - 1];
      if (prevRef) prevRef.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (submitted) return;
    if (e.key === 'Backspace' && answerDigits[index] === '' && index < answerLen - 1) {
      // Move right on backspace if current is empty
      const nextRef = inputRefs.current[index + 1];
      if (nextRef) nextRef.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < answerLen - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    // Check if all digits are filled
    if (answerDigits.some(d => d === '')) return;

    setSubmitted(true);
    const userAnswer = parseInt(answerDigits.join(''), 10);

    if (userAnswer === round.correctAnswer) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      setFeedback('🎉 נכון מאוד! כל הכבוד!');
      playSuccessSound();
      // Auto-advance on correct answer
      setTimeout(() => {
        setCurrentRound(prev => prev + 1);
        setRound(generateRound());
      }, 2000);
    } else {
      setIsCorrect(false);
      setFeedback('❌ לא נכון... נסו שוב או דלגו קדימה');
      playErrorSound();
    }
  };

  const handleRetry = () => {
    setAnswerDigits(Array(answerLen).fill(''));
    setSubmitted(false);
    setIsCorrect(false);
    setFeedback('');
    setTimeout(() => {
      const lastRef = inputRefs.current[answerLen - 1];
      if (lastRef) lastRef.focus();
    }, 50);
  };

  const handleSkip = () => {
    setFeedback(`התשובה הנכונה היא ${round.correctAnswer.toLocaleString()}`);
    setTimeout(() => {
      setCurrentRound(prev => prev + 1);
      setRound(generateRound());
    }, 2000);
  };

  const num1Digits = getDigits(round.numbers[0], totalCols);
  const num2Digits = getDigits(round.numbers[1], totalCols);
  const num3Digits = getDigits(round.numbers[2], totalCols);

  const allFilled = answerDigits.every(d => d !== '');

  return (
    <div className="add-three-container">
      <button className="secondary finish-session-button" onClick={() => onComplete(score)}>
        סיום ושמירה
      </button>
      <div className="add-three-header">
        <button className="add-three-back-btn" onClick={onBack}>← חזרה</button>
        <div className="add-three-progress">
          סיבוב {currentRound + 1}
        </div>
        <div className="add-three-score-display">⭐ {score}</div>
      </div>

      <div className="add-three-progress-bar">
        <div
          className="add-three-progress-fill"
          style={{ width: `${((currentRound % TOTAL_ROUNDS) / TOTAL_ROUNDS) * 100}%` }}
        />
      </div>

      <div className="add-three-game-area">
        <h2 className="add-three-title">➕ חברו את שלושת המספרים</h2>

        <div className="add-three-notebook">
          {/* Number rows */}
          <div className="add-three-row">
            <span className="add-three-sign"></span>
            {num1Digits.map((d, i) => (
              <span key={i} className="add-three-cell">
                {d !== null ? d : ''}
              </span>
            ))}
          </div>

          <div className="add-three-row">
            <span className="add-three-sign"></span>
            {num2Digits.map((d, i) => (
              <span key={i} className="add-three-cell">
                {d !== null ? d : ''}
              </span>
            ))}
          </div>

          <div className="add-three-row">
            <span className="add-three-sign">+</span>
            {num3Digits.map((d, i) => (
              <span key={i} className="add-three-cell">
                {d !== null ? d : ''}
              </span>
            ))}
          </div>

          {/* Divider line */}
          <div className="add-three-divider"></div>

          {/* Answer row */}
          <div className="add-three-row answer-row">
            <span className="add-three-sign"></span>
            {answerDigits.map((d, i) => (
              <input
                key={`${currentRound}-${i}`}
                ref={el => inputRefs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className={`add-three-digit-input ${
                  submitted
                    ? d === answerStr[i]
                      ? 'digit-correct'
                      : 'digit-wrong'
                    : ''
                }`}
                value={d}
                onChange={e => handleDigitChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                disabled={submitted && isCorrect}
              />
            ))}
          </div>
        </div>

        {!submitted && (
          <button
            className={`add-three-submit-btn ${allFilled ? 'ready' : ''}`}
            onClick={handleSubmit}
            disabled={!allFilled}
          >
            ✔️ בדקו תשובה
          </button>
        )}

        {submitted && !isCorrect && (
          <div className="add-three-wrong-actions">
            <button className="add-three-retry-btn" onClick={handleRetry}>
              🔄 נסו שוב
            </button>
            <button className="add-three-skip-btn" onClick={handleSkip}>
              ⏭️ דלגו לשאלה הבאה
            </button>
          </div>
        )}

        {feedback && (
          <div className={`add-three-feedback ${isCorrect ? 'success' : 'error'}`}>
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddThreeNumbers;
