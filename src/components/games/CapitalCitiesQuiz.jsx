import QuizGame from './QuizGame';
import { CAPITAL_CITIES_QUESTIONS } from './quizData';

function CapitalCitiesQuiz({ onComplete, onBack }) {
  return (
    <QuizGame
      className="capital-cities-quiz"
      title="🏛️ חידון ערי בירה 🏛️"
      instructions="מה עיר הבירה של המדינה? בחרו את התשובה הנכונה!"
      progressLabel="התקדמות במחזור"
      progressStar="🏛️"
      questions={CAPITAL_CITIES_QUESTIONS}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}

export default CapitalCitiesQuiz;
