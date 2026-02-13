import { useState } from 'react';
import './ListenAndWrite.css';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function ListenAndWrite({ onComplete, onBack }) {
  const totalRounds = 6;
  
  // Pre-generate random letters for all rounds
  const [gameLetters] = useState(() => {
    const letters = [];
    for (let i = 0; i < totalRounds; i++) {
      letters.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
    }
    return letters;
  });
  
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const currentLetter = gameLetters[currentRound];

  const playLetter = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentLetter);
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
      setHasPlayed(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    // Only allow single letter
    if (value.length <= 1) {
      setUserInput(value);
    }
  };

  const checkAnswer = () => {
    if (!userInput) return;

    if (userInput === currentLetter) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      playSound('correct');

      setTimeout(() => {
        setUserInput('');
        setFeedback('');
        setHasPlayed(false);
        setCurrentRound(prev => {
          if (prev < totalRounds - 1) {
            return prev + 1;
          }
          setTimeout(() => setIsGameComplete(true), 0);
          return prev;
        });
      }, 1500);
    } else {
      setFeedback('wrong');
      playSound('wrong');

      setTimeout(() => {
        setFeedback('');
        setUserInput('');
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && userInput) {
      checkAnswer();
    }
  };

  const skipLetter = () => {
    setUserInput('');
    setFeedback('');
    setHasPlayed(false);
    setCurrentRound(prev => {
      if (prev < totalRounds - 1) {
        return prev + 1;
      }
      setTimeout(() => setIsGameComplete(true), 0);
      return prev;
    });
  };

  const playSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'correct') {
        oscillator.frequency.value = 880; // A5
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
      } else {
        oscillator.frequency.value = 130;
        oscillator.type = 'sawtooth';
        gainNode.gain.value = 0.2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      }
    } catch (error) {
      // Silently fail if audio is not supported
      console.error('Audio playback failed:', error);
    }
  };

  if (isGameComplete) {
    // Ensure minimum of 1 star for completing the game
    const MIN_STARS = 1;
    const finalScore = Math.max(MIN_STARS, score);
    return (
      <div className="game-container listen-write">
        <div className="completion-screen">
          <div className="letter-master">
            <div className="letter-celebration">📝🎧✨</div>
            <h1>🎉 מומחה אותיות! 🎉</h1>
            <p>השד הוכה בכוח ההקשבה שלכם!</p>
            <div className="final-score">
              <h2>הציון שלכם: {score} / {totalRounds}</h2>
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
    <div className="game-container listen-write">
      <button className="back" onClick={onBack}>← חזור</button>

      <div className="game-header">
        <h1>🎧 הקשיבו וכתבו 🎧</h1>
        <p className="instructions">הקשיבו לאות וכתבו אותה!</p>
        <div className="score-display">
          נכון: {score} | שאלה: {currentRound + 1}/{totalRounds}
        </div>
      </div>

      <div className="listen-section">
        <div className="speaker-icon-big">🔊</div>
        <button className="primary listen-button" onClick={playLetter}>
          🎧 תשמעו את האות
        </button>
        {!hasPlayed && (
          <p className="hint-text">לחצו כדי לשמוע את האות!</p>
        )}
      </div>

      <div className="input-section">
        <h3>כתבו את האות שאתם שומעים:</h3>
        <input
          type="text"
          className={`letter-input ${feedback}`}
          value={userInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="?"
          maxLength="1"
          autoFocus
          disabled={feedback !== ''}
        />

        {userInput && !feedback && (
          <button className="primary check-button" onClick={checkAnswer}>
            בדוק תשובה ✓
          </button>
        )}

        {feedback === 'correct' && (
          <div className="feedback-message success-message">
            ✓ מצוין! זו האות הנכונה!
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="feedback-message error-message">
            ✗ לא נכון. נסו שוב!
          </div>
        )}

        <button className="skip-button" onClick={skipLetter}>
          דלג על האות →
        </button>
      </div>

      <div className="battle-scene">
        <div className="listener-hero">
          <div className="hero-icon">🎸</div>
          {hasPlayed && <div className="sound-effect">🎵</div>}
        </div>
        <div className="vs-text">VS</div>
        <div className="demon-target">
          {feedback === 'correct' ? '😵' : '👾'}
        </div>
      </div>
    </div>
  );
}

export default ListenAndWrite;
