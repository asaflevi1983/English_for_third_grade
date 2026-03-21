import { useState, useEffect, useCallback } from 'react';
import './ChooseThePower.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';
import SuccessCartoon from '../SuccessCartoon';

const QUIZ_QUESTIONS = [
  {
    question: 'Which one is RED?',
    options: [
      { text: 'red apple', emoji: '🍎', correct: true },
      { text: 'green apple', emoji: '🍏', correct: false },
      { text: 'blue sky', emoji: '🌤️', correct: false }
    ]
  },
  {
    question: 'Which animal says "MEOW"?',
    options: [
      { text: 'dog', emoji: '🐶', correct: false },
      { text: 'cat', emoji: '🐱', correct: true },
      { text: 'bird', emoji: '🐦', correct: false }
    ]
  },
  {
    question: 'What do you use to write?',
    options: [
      { text: 'book', emoji: '📚', correct: false },
      { text: 'pencil', emoji: '✏️', correct: true },
      { text: 'ball', emoji: '⚽', correct: false }
    ]
  },
  {
    question: 'Which one is YELLOW?',
    options: [
      { text: 'orange', emoji: '🍊', correct: false },
      { text: 'banana', emoji: '🍌', correct: true },
      { text: 'grape', emoji: '🍇', correct: false }
    ]
  },
  {
    question: 'Which one can FLY?',
    options: [
      { text: 'fish', emoji: '🐠', correct: false },
      { text: 'bird', emoji: '🐦', correct: true },
      { text: 'dog', emoji: '🐕', correct: false }
    ]
  },
  {
    question: 'What gives us LIGHT?',
    options: [
      { text: 'moon', emoji: '🌙', correct: false },
      { text: 'sun', emoji: '☀️', correct: true },
      { text: 'star', emoji: '⭐', correct: false }
    ]
  }
];

// Delay before auto-speaking to prevent conflicts during UI rendering
const SPEECH_DELAY_MS = 300;

function ChooseThePower({ onComplete, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [powerMeter, setPowerMeter] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showSuccessCartoon, setShowSuccessCartoon] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const speakWord = useCallback(() => {
    if ('speechSynthesis' in window) {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(question.question);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
        };
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error in speech synthesis:', error);
      }
    }
  }, [question.question]);

  // Auto-speak the question when it changes
  useEffect(() => {
    if (!isGameComplete) {
      const timer = setTimeout(() => speakWord(), SPEECH_DELAY_MS);
      return () => {
        clearTimeout(timer);
        // Cancel any ongoing speech when question changes
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [currentQuestion, isGameComplete, speakWord]);

  const handleAnswer = (option, index) => {
    setSelectedAnswer(index);

    if (option.correct) {
      setFeedback('correct');
      setScore(score + 1);
      setPowerMeter(powerMeter + 1);
      playSuccessSound();
      setShowSuccessCartoon(true);

      setTimeout(() => {
        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
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
        setSelectedAnswer(null);
        setFeedback('');
      }, 1000);
    }
  };

  if (isGameComplete) {
    const finalScore = Math.max(1, score);
    return (
      <div className="game-container choose-power">
        <div className="completion-screen">
          <div className="power-unleashed">
            <div className="power-blast">💥⚡💪</div>
            <h1>🎉 Amazing Power! 🎉</h1>
            <p>The demon was defeated by your knowledge!</p>
            <div className="final-score">
              <h2>Your Score: {score} / {QUIZ_QUESTIONS.length}</h2>
              <div className="stars-earned">
                ⭐ You earned {finalScore} stars!
              </div>
            </div>
            <button className="success" onClick={() => onComplete(finalScore)}>
              Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container choose-power">
      <button className="back" onClick={onBack}>← Back</button>
      
      <div className="game-header">
        <h1>💪 Choose the Power 💪</h1>
        <p className="instructions">Choose the correct answer!</p>
        <div className="score-display">
          Correct: {score} | Question: {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
        </div>
      </div>

      <div className="power-meter-container">
        <div className="power-meter-label">Power Meter:</div>
        <div className="power-meter">
          <div 
            className="power-meter-fill"
            style={{ width: `${(powerMeter / QUIZ_QUESTIONS.length) * 100}%` }}
          >
            <span className="power-bolt">⚡</span>
          </div>
        </div>
      </div>

      <div className="question-card">
        <h2 className="question-english">{question.question}</h2>
        {'speechSynthesis' in window ? (
          <button 
            className="speak-button" 
            onClick={speakWord} 
            type="button"
            aria-label="Listen to the question"
            title="Listen to the question"
          >
            🔊 Speak Word
          </button>
        ) : (
          <p className="speech-unavailable" style={{ color: '#666', fontSize: '0.9rem', marginTop: '10px' }}>
            (Audio not available in this browser)
          </p>
        )}
      </div>

      <div className="answers-grid">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`answer-option ${
              selectedAnswer === index
                ? option.correct
                  ? 'correct'
                  : 'wrong'
                : ''
            }`}
            onClick={() => !selectedAnswer && handleAnswer(option, index)}
            disabled={selectedAnswer !== null}
          >
            <div className="option-emoji">{option.emoji}</div>
          </button>
        ))}
      </div>

      <div className="power-battle">
        <div className="hero-powered">
          <div className="hero-icon">🎸</div>
          <div className="power-level">
            {powerMeter > 0 && '⚡'.repeat(powerMeter)}
          </div>
        </div>
        <div className="vs-text">VS</div>
        <div className="demon-weakening">
          {feedback === 'correct' ? '😵' : '👾'}
        </div>
      </div>

      <SuccessCartoon 
        show={showSuccessCartoon} 
        onComplete={() => setShowSuccessCartoon(false)}
      />
    </div>
  );
}

export default ChooseThePower;
