import QuizGame from './QuizGame';
import { FLAG_QUESTIONS } from './quizData';

function FlagQuiz({ onComplete, onBack }) {
  return (
    <QuizGame
      className="flag-quiz"
      title="🏳️ חידון דגלים 🏳️"
      instructions="זהו את הדגל ובחרו את המדינה הנכונה!"
      progressLabel="התקדמות במחזור"
      progressStar="🏁"
      questions={FLAG_QUESTIONS}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}

export default FlagQuiz;
