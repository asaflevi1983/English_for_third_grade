import { useState, useEffect } from 'react';
import './WordCatcher.css';
import { playSound } from '../../utils/soundEffects';

const WORDS_DATA = [
  { word: 'cat', emoji: '🐱', hebrew: 'חתול' },
  { word: 'dog', emoji: '🐶', hebrew: 'כלב' },
  { word: 'apple', emoji: '🍎', hebrew: 'תפוח' },
  { word: 'sun', emoji: '☀️', hebrew: 'שמש' },
  { word: 'star', emoji: '⭐', hebrew: 'כוכב' },
  { word: 'car', emoji: '🚗', hebrew: 'מכונית' },
  { word: 'book', emoji: '📚', hebrew: 'ספר' },
  { word: 'ball', emoji: '⚽', hebrew: 'כדור' },
];

function WordCatcher({ onComplete, onBack }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [shuffledWords, setShuffledWords] = useState([]);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Shuffle words for the game
    const shuffled = [...WORDS_DATA].sort(() => Math.random() - 0.5);
    setShuffledWords(shuffled);
  }, []);

  useEffect(() => {
    if (shuffledWords.length > 0) {
      const currentWord = shuffledWords[currentRound];
      const otherWords = shuffledWords.filter((_, idx) => idx !== currentRound);
      const newOptions = currentWord 
        ? [currentWord, ...otherWords.slice(0, 2)].sort(() => Math.random() - 0.5)
        : [];
      setOptions(newOptions);
    }
  }, [currentRound, shuffledWords]);

  const currentWord = shuffledWords[currentRound];

  const handleAnswer = (selectedWord) => {
    setSelectedAnswer(selectedWord);
    
    if (selectedWord.word === currentWord.word) {
      setFeedback('correct');
      setScore(score + 1);
      playSound('correct');
      
      setTimeout(() => {
        if (currentRound < 5) {
          setCurrentRound(currentRound + 1);
          setSelectedAnswer(null);
          setFeedback('');
        } else {
          setIsGameComplete(true);
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      playSound('wrong');
      
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback('');
      }, 1000);
    }
  };



  if (isGameComplete) {
    const finalScore = Math.max(1, score);
    return (
      <div className="game-container word-catcher">
        <div className="completion-screen">
          <div className="demon-defeated">
            <div className="demon-explosion">💥</div>
            <h1>🎉 ניצחתם את השד! 🎉</h1>
            <p>השד הוכה והמילים ניצלו!</p>
            <div className="final-score">
              <h2>הציון שלכם: {score} / 6</h2>
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

  if (!currentWord) return <div className="loading">טוען...</div>;

  return (
    <div className="game-container word-catcher">
      <button className="back" onClick={onBack}>← חזור</button>
      
      <div className="game-header">
        <h1>🎯 תופס המילים 🎯</h1>
        <p className="instructions">תפסו את התמונה הנכונה למילה!</p>
        <div className="score-display">
          נכון: {score} | שאלה: {currentRound + 1}/6
        </div>
      </div>

      <div className="word-display-box">
        <div className={`falling-word ${feedback}`}>
          <h2>{currentWord.word}</h2>
          <p className="hebrew-hint">({currentWord.hebrew})</p>
        </div>
      </div>

      <div className="options-grid">
        {options.map((option, idx) => (
          <button
            key={idx}
            className={`option-card ${
              selectedAnswer?.word === option.word
                ? option.word === currentWord.word
                  ? 'correct'
                  : 'wrong'
                : ''
            }`}
            onClick={() => !selectedAnswer && handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            <div className="emoji-large">{option.emoji}</div>
            <div className="option-text">{option.word}</div>
          </button>
        ))}
      </div>

      <div className="battle-scene">
        <div className="hero-attack">🎸</div>
        <div className="demon-target">
          {feedback === 'correct' ? '😱' : '👾'}
        </div>
      </div>
    </div>
  );
}

export default WordCatcher;
