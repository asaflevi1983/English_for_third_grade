import { useState, useEffect } from 'react';
import './SpellTheMagic.css';

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
  const [shuffledLetters, setShuffledLetters] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [isGameComplete, setIsGameComplete] = useState(false);

  const currentWordData = SPELLING_WORDS[currentRound];

  useEffect(() => {
    if (currentWordData) {
      const letters = currentWordData.word.split('');
      const shuffled = [...letters].sort(() => Math.random() - 0.5);
      setShuffledLetters(shuffled);
    }
  }, [currentRound]);

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
      playSound('correct');

      setTimeout(() => {
        if (currentRound < SPELLING_WORDS.length - 1) {
          setCurrentRound(currentRound + 1);
          setUserAnswer([]);
          setFeedback('');
        } else {
          setIsGameComplete(true);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      playSound('wrong');
      
      setTimeout(() => {
        setFeedback('');
      }, 1000);
    }
  };

  const playSound = (type) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
      oscillator.frequency.value = 659.25; // E5
      gainNode.gain.value = 0.3;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } else {
      oscillator.frequency.value = 180;
      oscillator.type = 'sawtooth';
      gainNode.gain.value = 0.2;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
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
    </div>
  );
}

export default SpellTheMagic;
