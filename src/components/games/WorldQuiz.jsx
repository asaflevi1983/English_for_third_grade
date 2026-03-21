import QuizGame from './QuizGame';
import { WORLD_QUESTIONS } from './quizData';

function WorldQuiz({ onComplete, onBack }) {
  return (
    <QuizGame
      className="world-quiz"
      title="🌍 חידון עולמי 🌍"
      instructions="בחרו את התשובה הנכונה והמשיכו בלי סוף סיבובים!"
      progressLabel="התקדמות במחזור"
      progressStar="🌎"
      questions={WORLD_QUESTIONS}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}

export default WorldQuiz;