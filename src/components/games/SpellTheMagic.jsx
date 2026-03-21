import { useState } from 'react';
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

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function shuffleLetters(word) {
  return shuffleArray(word.split(''));
}

function SpellTheMagic({ onComplete, onBack }) {
  const [wordDeck, setWordDeck] = useState(() => shuffleArray(SPELLING_WORDS));
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState([]);
  const [shuffledLetters, setShuffledLetters] = useState(() => shuffleLetters(wordDeck[0].word));
  const [feedback, setFeedback] = useState('');
  const [showSuccessCartoon, setShowSuccessCartoon] = useState(false);

  const currentWordData = wordDeck[currentRound % wordDeck.length];

  const advanceRound = () => {
    const nextRound = currentRound + 1;
    const shouldReshuffle = nextRound % wordDeck.length === 0;
    const nextDeck = shouldReshuffle ? shuffleArray(SPELLING_WORDS) : wordDeck;
    const nextWordData = nextDeck[nextRound % nextDeck.length];

    if (shouldReshuffle) {
      setWordDeck(nextDeck);
    }

    setCurrentRound(nextRound);
    setShuffledLetters(shuffleLetters(nextWordData.word));
    setUserAnswer([]);
    setFeedback('');
    setShowSuccessCartoon(false);
  };

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
      setScore((prev) => prev + 1);
      playSuccessSound();
      setShowSuccessCartoon(true);

      setTimeout(() => {
        advanceRound();
      }, 1500);
    } else {
      setFeedback('wrong');
      playErrorSound();
      
      setTimeout(() => {
        setFeedback('');
      }, 1000);
    }
  };

  return (
    <div className="game-container spell-magic">
      <button className="back" onClick={onBack}>← חזור</button>
      <button className="secondary finish-session-button" onClick={() => onComplete(score)}>
        סיום ושמירה
      </button>
      
      <div className="game-header">
        <h1>✨ איות הקסם ✨</h1>
        <p className="instructions">סדרו את האותיות ליצירת המילה!</p>
        <div className="score-display">
          נכון: {score} | סיבוב: {currentRound + 1}
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
