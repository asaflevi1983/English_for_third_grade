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

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function ChooseThePower({ onComplete, onBack }) {
  const [questionDeck, setQuestionDeck] = useState(() => shuffleArray(QUIZ_QUESTIONS));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [powerMeter, setPowerMeter] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showSuccessCartoon, setShowSuccessCartoon] = useState(false);

  const question = questionDeck[currentQuestion % questionDeck.length];

  const advanceQuestion = () => {
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion % questionDeck.length === 0) {
      setQuestionDeck(shuffleArray(QUIZ_QUESTIONS));
    }

    setCurrentQuestion(nextQuestion);
    setSelectedAnswer(null);
    setFeedback('');
    setShowSuccessCartoon(false);
  };

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
    const timer = setTimeout(() => speakWord(), SPEECH_DELAY_MS);
    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestion, speakWord]);

  const handleAnswer = (option, index) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (option.correct) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      setPowerMeter((prev) => (prev + 1) % questionDeck.length);
      playSuccessSound();
      setShowSuccessCartoon(true);

      setTimeout(() => {
        advanceQuestion();
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

  return (
    <div className="game-container choose-power">
      <button className="back" onClick={onBack}>← Back</button>
      <button className="secondary finish-session-button" onClick={() => onComplete(score)}>
        Finish & Save
      </button>
      
      <div className="game-header">
        <h1>💪 Choose the Power 💪</h1>
        <p className="instructions">Choose the correct answer!</p>
        <div className="score-display">
          Correct: {score} | Round: {currentQuestion + 1}
        </div>
      </div>

      <div className="power-meter-container">
        <div className="power-meter-label">Power Meter:</div>
        <div className="power-meter">
          <div 
            className="power-meter-fill"
            style={{ width: `${((currentQuestion % questionDeck.length) / questionDeck.length) * 100}%` }}
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
