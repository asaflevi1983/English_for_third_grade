import { useState, useCallback } from 'react';
import './WordCatcher.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';
import SuccessCartoon from '../SuccessCartoon';

const WORDS_DATA = [
  { word: 'cat', emoji: '🐱', hebrew: 'חתול' },
  { word: 'dog', emoji: '🐶', hebrew: 'כלב' },
  { word: 'apple', emoji: '🍎', hebrew: 'תפוח' },
  { word: 'sun', emoji: '☀️', hebrew: 'שמש' },
  { word: 'star', emoji: '⭐', hebrew: 'כוכב' },
  { word: 'car', emoji: '🚗', hebrew: 'מכונית' },
  { word: 'book', emoji: '📚', hebrew: 'ספר' },
  { word: 'ball', emoji: '⚽', hebrew: 'כדור' },
  { word: 'tree', emoji: '🌳', hebrew: 'עץ' },
  { word: 'house', emoji: '🏠', hebrew: 'בית' },
  { word: 'bird', emoji: '🐦', hebrew: 'ציפור' },
  { word: 'fish', emoji: '🐟', hebrew: 'דג' },
  { word: 'flower', emoji: '🌸', hebrew: 'פרח' },
  { word: 'moon', emoji: '🌙', hebrew: 'ירח' },
  { word: 'heart', emoji: '❤️', hebrew: 'לב' },
  { word: 'plane', emoji: '✈️', hebrew: 'מטוס' },
  { word: 'bike', emoji: '🚲', hebrew: 'אופניים' },
  { word: 'train', emoji: '🚂', hebrew: 'רכבת' },
  { word: 'bus', emoji: '🚌', hebrew: 'אוטובוס' },
  { word: 'boat', emoji: '⛵', hebrew: 'סירה' },
  { word: 'pizza', emoji: '🍕', hebrew: 'פיצה' },
  { word: 'cake', emoji: '🍰', hebrew: 'עוגה' },
  { word: 'ice cream', emoji: '🍦', hebrew: 'גלידה' },
  { word: 'bread', emoji: '🍞', hebrew: 'לחם' },
  { word: 'cheese', emoji: '🧀', hebrew: 'גבינה' },
  { word: 'banana', emoji: '🍌', hebrew: 'בננה' },
  { word: 'orange', emoji: '🍊', hebrew: 'תפוז' },
  { word: 'grapes', emoji: '🍇', hebrew: 'עינבים' },
  { word: 'strawberry', emoji: '🍓', hebrew: 'תות' },
  { word: 'watermelon', emoji: '🍉', hebrew: 'אבטיח' },
  { word: 'carrot', emoji: '🥕', hebrew: 'גזר' },
  { word: 'tomato', emoji: '🍅', hebrew: 'עגבנייה' },
  { word: 'corn', emoji: '🌽', hebrew: 'תירס' },
  { word: 'egg', emoji: '🥚', hebrew: 'ביצה' },
  { word: 'milk', emoji: '🥛', hebrew: 'חלב' },
  { word: 'coffee', emoji: '☕', hebrew: 'קפה' },
  { word: 'water', emoji: '💧', hebrew: 'מים' },
  { word: 'juice', emoji: '🧃', hebrew: 'מיץ' },
  { word: 'chicken', emoji: '🍗', hebrew: 'עוף' },
  { word: 'burger', emoji: '🍔', hebrew: 'המבורגר' },
  { word: 'hotdog', emoji: '🌭', hebrew: 'נקניק' },
  { word: 'cookie', emoji: '🍪', hebrew: 'עוגייה' },
  { word: 'candy', emoji: '🍬', hebrew: 'ממתק' },
  { word: 'chocolate', emoji: '🍫', hebrew: 'שוקולד' },
  { word: 'lemon', emoji: '🍋', hebrew: 'לימון' },
  { word: 'pear', emoji: '🍐', hebrew: 'אגס' },
  { word: 'peach', emoji: '🍑', hebrew: 'אפרסק' },
  { word: 'cherry', emoji: '🍒', hebrew: 'דובדבן' },
  { word: 'pineapple', emoji: '🍍', hebrew: 'אננס' },
  { word: 'kiwi', emoji: '🥝', hebrew: 'קיווי' },
  { word: 'avocado', emoji: '🥑', hebrew: 'אבוקדו' },
  { word: 'potato', emoji: '🥔', hebrew: 'תפוח אדמה' },
  { word: 'broccoli', emoji: '🥦', hebrew: 'ברוקולי' },
  { word: 'mushroom', emoji: '🍄', hebrew: 'פטרייה' },
  { word: 'peanut', emoji: '🥜', hebrew: 'בוטן' },
  { word: 'rice', emoji: '🍚', hebrew: 'אורז' },
  { word: 'spaghetti', emoji: '🍝', hebrew: 'ספגטי' },
  { word: 'soup', emoji: '🍲', hebrew: 'מרק' },
  { word: 'salad', emoji: '🥗', hebrew: 'סלט' },
  { word: 'taco', emoji: '🌮', hebrew: 'טאקו' },
  { word: 'sandwich', emoji: '🥪', hebrew: 'כריך' },
  { word: 'popcorn', emoji: '🍿', hebrew: 'פופקורן' },
  { word: 'honey', emoji: '🍯', hebrew: 'דבש' },
  { word: 'butter', emoji: '🧈', hebrew: 'חמאה' },
  { word: 'salt', emoji: '🧂', hebrew: 'מלח' },
  { word: 'school', emoji: '🏫', hebrew: 'בית ספר' },
  { word: 'hospital', emoji: '🏥', hebrew: 'בית חולים' },
  { word: 'park', emoji: '🏞️', hebrew: 'פארק' },
  { word: 'beach', emoji: '🏖️', hebrew: 'חוף' },
  { word: 'mountain', emoji: '⛰️', hebrew: 'הר' },
  { word: 'cloud', emoji: '☁️', hebrew: 'ענן' },
  { word: 'rain', emoji: '🌧️', hebrew: 'גשם' },
  { word: 'snow', emoji: '❄️', hebrew: 'שלג' },
  { word: 'rainbow', emoji: '🌈', hebrew: 'קשת' },
  { word: 'fire', emoji: '🔥', hebrew: 'אש' },
  { word: 'wind', emoji: '💨', hebrew: 'רוח' },
  { word: 'lightning', emoji: '⚡', hebrew: 'ברק' },
  { word: 'earth', emoji: '🌍', hebrew: 'כדור הארץ' },
  { word: 'globe', emoji: '🌐', hebrew: 'גלובוס' },
  { word: 'rocket', emoji: '🚀', hebrew: 'רקטה' },
  { word: 'satellite', emoji: '🛰️', hebrew: 'לוויין' },
  { word: 'alien', emoji: '👽', hebrew: 'חייזר' },
  { word: 'robot', emoji: '🤖', hebrew: 'רובוט' },
  { word: 'camera', emoji: '📷', hebrew: 'מצלמה' },
  { word: 'phone', emoji: '📱', hebrew: 'טלפון' },
  { word: 'computer', emoji: '💻', hebrew: 'מחשב' },
  { word: 'keyboard', emoji: '⌨️', hebrew: 'מקלדת' },
  { word: 'mouse', emoji: '🖱️', hebrew: 'עכבר' },
  { word: 'printer', emoji: '🖨️', hebrew: 'מדפסת' },
  { word: 'clock', emoji: '⏰', hebrew: 'שעון' },
  { word: 'watch', emoji: '⌚', hebrew: 'שעון יד' },
  { word: 'calendar', emoji: '📅', hebrew: 'לוח שנה' },
  { word: 'pen', emoji: '🖊️', hebrew: 'עט' },
  { word: 'pencil', emoji: '✏️', hebrew: 'עיפרון' },
  { word: 'paper', emoji: '📄', hebrew: 'נייר' },
  { word: 'scissors', emoji: '✂️', hebrew: 'מספריים' },
  { word: 'ruler', emoji: '📏', hebrew: 'סרגל' },
  { word: 'backpack', emoji: '🎒', hebrew: 'תיק' },
  { word: 'glasses', emoji: '👓', hebrew: 'משקפיים' },
  { word: 'hat', emoji: '🎩', hebrew: 'כובע' },
  { word: 'shirt', emoji: '👕', hebrew: 'חולצה' },
  { word: 'pants', emoji: '👖', hebrew: 'מכנסיים' },
  { word: 'shoes', emoji: '👟', hebrew: 'נעליים' },
  { word: 'socks', emoji: '🧦', hebrew: 'גרביים' },
  { word: 'gloves', emoji: '🧤', hebrew: 'כפפות' },
  { word: 'scarf', emoji: '🧣', hebrew: 'צעיף' },
];

// Helper function to shuffle words and generate options
const generateGameData = () => {
  const shuffled = [...WORDS_DATA].sort(() => Math.random() - 0.5);
  // Pre-generate all options for each round
  const allOptions = shuffled.map((word, idx) => {
    const otherWords = shuffled.filter((_, i) => i !== idx);
    return [word, ...otherWords.slice(0, 2)].sort(() => Math.random() - 0.5);
  });
  return { shuffledWords: shuffled, optionsByRound: allOptions };
};

// onComplete is kept for interface consistency with other games, but not used since game is infinite
// eslint-disable-next-line no-unused-vars
function WordCatcher({ onComplete, onBack }) {
  // Pre-shuffle words and options once for consistency
  const [gameData, setGameData] = useState(() => generateGameData());
  
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showSuccessCartoon, setShowSuccessCartoon] = useState(false);

  // Handle word wrapping - when we run out, reshuffle
  const currentWordIndex = currentRound % gameData.shuffledWords.length;
  const currentWord = gameData.shuffledWords[currentWordIndex];
  const options = gameData.optionsByRound[currentWordIndex] || [];

  const speakWord = useCallback(() => {
    if (currentWord && 'speechSynthesis' in window) {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.lang = 'en-US';
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event);
        };
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Error in speech synthesis:', error);
      }
    }
  }, [currentWord]);

  const handleAnswer = (selectedWord) => {
    setSelectedAnswer(selectedWord);
    
    if (selectedWord.word === currentWord.word) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      playSuccessSound();
      setShowSuccessCartoon(true);
      
      setTimeout(() => {
        // Check if we've completed all words in current batch
        if ((currentRound + 1) % gameData.shuffledWords.length === 0) {
          // Reshuffle for next batch
          setGameData(generateGameData());
        }
        
        setCurrentRound(prev => prev + 1);
        setSelectedAnswer(null);
        setFeedback('');
        setShowSuccessCartoon(false);
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

  if (!currentWord) return <div className="loading">טוען...</div>;

  return (
    <div className="game-container word-catcher">
      <button className="back" onClick={onBack}>← חזור</button>
      
      <div className="game-header">
        <h1>🎯 תופס המילים 🎯</h1>
        <p className="instructions">תפסו את התמונה הנכונה למילה!</p>
        <div className="score-display">
          נכון: {score} | שאלה: {currentRound + 1}
        </div>
      </div>

      <div className="word-display-box">
        <div className={`falling-word ${feedback}`}>
          <h2>{currentWord.word}</h2>
          <button 
            className="speak-button"
            onClick={speakWord}
            aria-label="Speak the word"
            title="Click to hear the word"
          >
            🔊
          </button>
        </div>
      </div>

      <div className="options-grid">
        {options.map((option, idx) => (
          <button
            key={idx}
            className={`option-card ${
              selectedAnswer?.word === option.word
                ? option.word === currentWord.word
                  ? 'correct'
                  : 'wrong'
                : ''
            }`}
            onClick={() => !selectedAnswer && handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            <div className="emoji-large">{option.emoji}</div>
          </button>
        ))}
      </div>

      <div className="battle-scene">
        <div className="hero-attack">🎸</div>
        <div className="demon-target">
          {feedback === 'correct' ? '😱' : '👾'}
        </div>
      </div>

      <SuccessCartoon 
        show={showSuccessCartoon} 
        onComplete={() => setShowSuccessCartoon(false)}
      />
    </div>
  );
}

export default WordCatcher;
