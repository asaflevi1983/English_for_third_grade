import { useState } from 'react';
import './ChooseThePower.css';
import { playSound } from '../../utils/soundEffects';

const QUIZ_QUESTIONS = [
  {
    question: 'Which one is RED?',
    questionHebrew: 'איזה אחד אדום?',
    options: [
      { text: 'red apple', emoji: '🍎', correct: true },
      { text: 'green apple', emoji: '🍏', correct: false },
      { text: 'blue sky', emoji: '🌤️', correct: false }
    ]
  },
  {
    question: 'Which animal says "MEOW"?',
    questionHebrew: 'איזה חיה אומרת "מיאו"?',
    options: [
      { text: 'dog', emoji: '🐶', correct: false },
      { text: 'cat', emoji: '🐱', correct: true },
      { text: 'bird', emoji: '🐦', correct: false }
    ]
  },
  {
    question: 'What do you use to write?',
    questionHebrew: 'במה אתם כותבים?',
    options: [
      { text: 'book', emoji: '📚', correct: false },
      { text: 'pencil', emoji: '✏️', correct: true },
      { text: 'ball', emoji: '⚽', correct: false }
    ]
  },
  {
    question: 'Which one is YELLOW?',
    questionHebrew: 'איזה אחד צהוב?',
    options: [
      { text: 'orange', emoji: '🍊', correct: false },
      { text: 'banana', emoji: '🍌', correct: true },
      { text: 'grape', emoji: '🍇', correct: false }
    ]
  },
  {
    question: 'Which one can FLY?',
    questionHebrew: 'איזה אחד יכול לעוף?',
    options: [
      { text: 'fish', emoji: '🐠', correct: false },
      { text: 'bird', emoji: '🐦', correct: true },
      { text: 'dog', emoji: '🐕', correct: false }
    ]
  },
  {
    question: 'What gives us LIGHT?',
    questionHebrew: 'מה נותן לנו אור?',
    options: [
      { text: 'moon', emoji: '🌙', correct: false },
      { text: 'sun', emoji: '☀️', correct: true },
      { text: 'star', emoji: '⭐', correct: false }
    ]
  }
];

function ChooseThePower({ onComplete, onBack }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [powerMeter, setPowerMeter] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isGameComplete, setIsGameComplete] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];

  const handleAnswer = (option, index) => {
    setSelectedAnswer(index);

    if (option.correct) {
      setFeedback('correct');
      setScore(score + 1);
      setPowerMeter(powerMeter + 1);
      playSound('correct');

      setTimeout(() => {
        if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
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
      <div className="game-container choose-power">
        <div className="completion-screen">
          <div className="power-unleashed">
            <div className="power-blast">💥⚡💪</div>
            <h1>🎉 כוח אדיר! 🎉</h1>
            <p>השד הוכה בכוח הידע שלכם!</p>
            <div className="final-score">
              <h2>הציון שלכם: {score} / {QUIZ_QUESTIONS.length}</h2>
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
    <div className="game-container choose-power">
      <button className="back" onClick={onBack}>← חזור</button>
      
      <div className="game-header">
        <h1>💪 בחר את הכוח 💪</h1>
        <p className="instructions">בחרו את התשובה הנכונה!</p>
        <div className="score-display">
          נכון: {score} | שאלה: {currentQuestion + 1}/{QUIZ_QUESTIONS.length}
        </div>
      </div>

      <div className="power-meter-container">
        <div className="power-meter-label">מד הכוח:</div>
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
        <p className="question-hebrew">{question.questionHebrew}</p>
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
            <div className="option-label">{option.text}</div>
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
    </div>
  );
}

export default ChooseThePower;
