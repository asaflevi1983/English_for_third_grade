import { useState, useEffect } from 'react';
import './SpellTheMagic.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';
import SuccessCartoon from '../SuccessCartoon';

const SPELLING_WORDS = [
  { word: 'CAT', emoji: '🐱', hebrew: 'חתול' },
  { word: 'DOG', emoji: '🐶', hebrew: 'כלב' },
  { word: 'SUN', emoji: '☀️', hebrew: 'שמש' },
  { word: 'BOOK', emoji: '📚', hebrew: 'ספר' },
  { word: 'BALL', emoji: '⚽', hebrew: 'כדור' },
  { word: 'TREE', emoji: '🌳', hebrew: 'עץ' },
];

function SpellTheMagic({ onComplete, onBack }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState([]);
  const [shuffledLetters, setShuffledLetters] = useState(() => {
    // Initialize with first word's shuffled letters
    const letters = SPELLING_WORDS[0].word.split('');
    return [...letters].sort(() => Math.random() - 0.5);
  });
  const [feedback, setFeedback] = useState('');
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showSuccessCartoon, setShowSuccessCartoon] = useState(false);

  const currentWordData = SPELLING_WORDS[currentRound];

  useEffect(() => {
    if (currentRound > 0 && currentWordData) {
      const letters = currentWordData.word.split('');
      const shuffled = [...letters].sort(() => Math.random() - 0.5);
      // Use setTimeout to avoid setState in effect
      setTimeout(() => {
        setShuffledLetters(shuffled);
      }, 0);
    }
  }, [currentRound, currentWordData]);

  const handleLetterClick = (letter, index) => {
    setUserAnswer([...userAnswer, letter]);
    setShuffledLetters(shuffledLetters.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index) => {
    const letter = userAnswer[index];
    setShuffledLetters([...shuffledLetters, letter]);
    setUserAnswer(userAnswer.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const userWord = userAnswer.join('');
    const correctWord = currentWordData.word;

    if (userWord === correctWord) {
      setFeedback('correct');
      setScore(score + 1);
      playSuccessSound();
      setShowSuccessCartoon(true);

      setTimeout(() => {
        if (currentRound < SPELLING_WORDS.length - 1) {
          setCurrentRound(currentRound + 1);
          setUserAnswer([]);
          setFeedback('');
          setShowSuccessCartoon(false);
        } else {
          setIsGameComplete(true);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      playErrorSound();
      
      setTimeout(() => {
        setFeedback('');
      }, 1000);
    }
  };

  if (isGameComplete) {
    const finalScore = Math.max(1, score);
    return (
      <div className="game-container spell-magic">
        <div className="completion-screen">
          <div className="magic-blast">
            <div className="blast-animation">✨💥✨</div>
            <h1>🎉 קסם מושלם! 🎉</h1>
            <p>השד הוכה בכוח האיות שלכם!</p>
            <div className="final-score">
              <h2>הציון שלכם: {score} / {SPELLING_WORDS.length}</h2>
              <div className="stars-earned">
                ⭐ זכיתם ב-{finalScore} כוכבים!
              </div>
            </div>
            <button className="success" onClick={() => onComplete(finalScore)}>
              חזור לבית
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container spell-magic">
      <button className="back" onClick={onBack}>← חזור</button>
      
      <div className="game-header">
        <h1>✨ איות הקסם ✨</h1>
        <p className="instructions">סדרו את האותיות ליצירת המילה!</p>
        <div className="score-display">
          נכון: {score} | שאלה: {currentRound + 1}/{SPELLING_WORDS.length}
        </div>
      </div>

      <div className="picture-display">
        <div className="emoji-circle">
          {currentWordData.emoji}
        </div>
        <p className="hebrew-hint">{currentWordData.hebrew}</p>
      </div>

      <div className="answer-area">
        <div className="answer-boxes">
          {currentWordData.word.split('').map((_, index) => (
            <div
              key={index}
              className={`letter-box ${userAnswer[index] ? 'filled' : 'empty'} ${feedback}`}
              onClick={() => userAnswer[index] && handleRemoveLetter(index)}
            >
              {userAnswer[index] || '?'}
            </div>
          ))}
        </div>
      </div>

      <div className="letters-pool">
        <h3>לחצו על האותיות:</h3>
        <div className="letters-grid">
          {shuffledLetters.map((letter, index) => (
            <button
              key={index}
              className="letter-button"
              onClick={() => handleLetterClick(letter, index)}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {userAnswer.length === currentWordData.word.length && (
        <button className="primary check-button" onClick={checkAnswer}>
          בדוק תשובה ✓
        </button>
      )}

      <div className="magic-scene">
        <div className="wizard">🧙‍♂️</div>
        <div className="magic-target">
          {feedback === 'correct' ? '💫' : '👾'}
        </div>
      </div>

      <SuccessCartoon 
        show={showSuccessCartoon} 
        onComplete={() => setShowSuccessCartoon(false)}
      />
    </div>
  );
}

export default SpellTheMagic;
