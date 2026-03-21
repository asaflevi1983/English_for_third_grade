import { useState } from 'react';
import './IsraelQuiz.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';
import SuccessCartoon from '../SuccessCartoon';

const OPTION_MARKERS = ['A', 'B', 'C'];

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildQuestionSet(sourceQuestions) {
  return shuffleArray(sourceQuestions).map((question) => {
    const shuffledOptions = shuffleArray(
      question.options.map((text, index) => ({
        text,
        isCorrect: index === question.answer,
      }))
    );

    return {
      question: question.question,
      options: shuffledOptions,
    };
  });
}

function QuizGame({
  className,
  title,
  instructions,
  progressLabel,
  progressStar,
  questions,
  onComplete,
  onBack,
}) {
  const [questionSet, setQuestionSet] = useState(() => buildQuestionSet(questions));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showSuccessCartoon, setShowSuccessCartoon] = useState(false);

  const question = questionSet[currentQuestion % questionSet.length];
  const currentPackQuestion = (currentQuestion % questionSet.length) + 1;
  const progressWidth = ((currentQuestion % questionSet.length) / questionSet.length) * 100;

  const advanceQuestion = () => {
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion % questionSet.length === 0) {
      setQuestionSet(buildQuestionSet(questions));
    }

    setCurrentQuestion(nextQuestion);
    setSelectedAnswer(null);
    setFeedback('');
    setShowSuccessCartoon(false);
  };

  const handleAnswer = (option, index) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (option.isCorrect) {
      setFeedback('correct');
      setScore((prev) => prev + 1);
      playSuccessSound();
      setShowSuccessCartoon(true);

      setTimeout(() => {
        advanceQuestion();
      }, 1500);
      return;
    }

    setFeedback('wrong');
    playErrorSound();

    setTimeout(() => {
      setSelectedAnswer(null);
      setFeedback('');
    }, 1000);
  };

  return (
    <div className={`game-container quiz-game ${className}`}>
      <button className="back" onClick={onBack}>← חזרה</button>
      <button className="secondary finish-session-button" onClick={() => onComplete(score)}>
        סיום ושמירה
      </button>

      {showSuccessCartoon && <SuccessCartoon />}

      <div className="game-header">
        <h1>{title}</h1>
        <p className="instructions">{instructions}</p>
        <div className="score-display">
          נכון: {score} | סיבוב: {currentQuestion + 1}
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-label">
          {progressLabel} {currentPackQuestion}/{questionSet.length}
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressWidth}%` }}>
            <span className="progress-star">{progressStar}</span>
          </div>
        </div>
      </div>

      <div className="question-card quiz-question-card">
        <h2 className="question-text">{question.question}</h2>
      </div>

      <div className="answers-grid">
        {question.options.map((option, index) => (
          <button
            key={`${question.question}-${option.text}`}
            className={`answer-option ${
              selectedAnswer === index
                ? option.isCorrect
                  ? 'correct'
                  : 'wrong'
                : ''
            }`}
            onClick={() => handleAnswer(option, index)}
            disabled={selectedAnswer !== null}
          >
            <span className="option-emoji">{OPTION_MARKERS[index] ?? '•'}</span>
            <span className="option-label">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizGame;