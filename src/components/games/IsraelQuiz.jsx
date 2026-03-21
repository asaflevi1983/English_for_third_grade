import QuizGame from './QuizGame';
import { ISRAEL_QUESTIONS } from './quizData';

function IsraelQuiz({ onComplete, onBack }) {
  return (
    <QuizGame
      className="israel-quiz"
      title="🇮🇱 חידון ישראל 🇮🇱"
      instructions="שאלות טובות יותר, בלי רמזים מיותרים מהאייקונים או מהניסוח."
      progressLabel="התקדמות במחזור"
      progressStar="⭐"
      questions={ISRAEL_QUESTIONS}
      onComplete={onComplete}
      onBack={onBack}
    />
  );
}

export default IsraelQuiz;
