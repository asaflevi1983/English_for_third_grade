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
  { word: 'jacket', emoji: '🧥', hebrew: 'ז\'קט' },
  { word: 'dress', emoji: '👗', hebrew: 'שמלה' },
  { word: 'ring', emoji: '💍', hebrew: 'טבעת' },
  { word: 'crown', emoji: '👑', hebrew: 'כתר' },
  { word: 'umbrella', emoji: '☂️', hebrew: 'מטריה' },
  { word: 'door', emoji: '🚪', hebrew: 'דלת' },
  { word: 'window', emoji: '🪟', hebrew: 'חלון' },
  { word: 'chair', emoji: '🪑', hebrew: 'כיסא' },
  { word: 'table', emoji: '🍽️', hebrew: 'שולחן' },
  { word: 'bed', emoji: '🛏️', hebrew: 'מיטה' },
  { word: 'lamp', emoji: '💡', hebrew: 'מנורה' },
  { word: 'mirror', emoji: '🪞', hebrew: 'מראה' },
  { word: 'bath', emoji: '🛁', hebrew: 'אמבטיה' },
  { word: 'shower', emoji: '🚿', hebrew: 'מקלחת' },
  { word: 'toilet', emoji: '🚽', hebrew: 'אסלה' },
  { word: 'brush', emoji: '🪥', hebrew: 'מברשת' },
  { word: 'soap', emoji: '🧼', hebrew: 'סבון' },
  { word: 'towel', emoji: '🛀', hebrew: 'מגבת' },
  { word: 'basket', emoji: '🧺', hebrew: 'סל' },
  { word: 'broom', emoji: '🧹', hebrew: 'מטאטא' },
  { word: 'key', emoji: '🔑', hebrew: 'מפתח' },
  { word: 'lock', emoji: '🔒', hebrew: 'מנעול' },
  { word: 'bell', emoji: '🔔', hebrew: 'פעמון' },
  { word: 'gift', emoji: '🎁', hebrew: 'מתנה' },
  { word: 'balloon', emoji: '🎈', hebrew: 'בלון' },
  { word: 'flag', emoji: '🚩', hebrew: 'דגל' },
  { word: 'trophy', emoji: '🏆', hebrew: 'גביע' },
  { word: 'medal', emoji: '🏅', hebrew: 'מדליה' },
  { word: 'drum', emoji: '🥁', hebrew: 'תוף' },
  { word: 'guitar', emoji: '🎸', hebrew: 'גיטרה' },
  { word: 'piano', emoji: '🎹', hebrew: 'פסנתר' },
  { word: 'violin', emoji: '🎻', hebrew: 'כינור' },
  { word: 'trumpet', emoji: '🎺', hebrew: 'חצוצרה' },
  { word: 'microphone', emoji: '🎤', hebrew: 'מיקרופון' },
  { word: 'movie', emoji: '🎬', hebrew: 'סרט' },
  { word: 'theater', emoji: '🎭', hebrew: 'תיאטרון' },
  { word: 'ticket', emoji: '🎟️', hebrew: 'כרטיס' },
  { word: 'map', emoji: '🗺️', hebrew: 'מפה' },
  { word: 'compass', emoji: '🧭', hebrew: 'מצפן' },
  { word: 'flashlight', emoji: '🔦', hebrew: 'פנס' },
  { word: 'candle', emoji: '🕯️', hebrew: 'נר' },
  { word: 'battery', emoji: '🔋', hebrew: 'סוללה' },
  { word: 'magnet', emoji: '🧲', hebrew: 'מגנט' },
  { word: 'hammer', emoji: '🔨', hebrew: 'פטיש' },
  { word: 'wrench', emoji: '🔧', hebrew: 'מפתח ברגים' },
  { word: 'saw', emoji: '🪚', hebrew: 'מסור' },
  { word: 'nail', emoji: '🔩', hebrew: 'מסמר' },
  { word: 'ladder', emoji: '🪜', hebrew: 'סולם' },
  { word: 'box', emoji: '📦', hebrew: 'קופסה' },
  { word: 'package', emoji: '📫', hebrew: 'חבילה' },
  { word: 'envelope', emoji: '✉️', hebrew: 'מעטפה' },
  { word: 'letter', emoji: '💌', hebrew: 'מכתב' },
  { word: 'stamp', emoji: '📮', hebrew: 'בול' },
  { word: 'mailbox', emoji: '📬', hebrew: 'תיבת דואר' },
  { word: 'trash', emoji: '🗑️', hebrew: 'פח אשפה' },
  { word: 'coin', emoji: '🪙', hebrew: 'מטבע' },
  { word: 'money', emoji: '💰', hebrew: 'כסף' },
  { word: 'wallet', emoji: '👛', hebrew: 'ארנק' },
  { word: 'credit card', emoji: '💳', hebrew: 'כרטיס אשראי' },
  { word: 'shopping cart', emoji: '🛒', hebrew: 'עגלת קניות' },
  { word: 'store', emoji: '🏪', hebrew: 'חנות' },
  { word: 'bank', emoji: '🏦', hebrew: 'בנק' },
  { word: 'factory', emoji: '🏭', hebrew: 'מפעל' },
  { word: 'office', emoji: '🏢', hebrew: 'משרד' },
  { word: 'hotel', emoji: '🏨', hebrew: 'מלון' },
  { word: 'castle', emoji: '🏰', hebrew: 'טירה' },
  { word: 'tent', emoji: '⛺', hebrew: 'אוהל' },
  { word: 'bridge', emoji: '🌉', hebrew: 'גשר' },
  { word: 'statue', emoji: '🗿', hebrew: 'פסל' },
  { word: 'fountain', emoji: '⛲', hebrew: 'מזרקה' },
  { word: 'volcano', emoji: '🌋', hebrew: 'הר געש' },
  { word: 'island', emoji: '🏝️', hebrew: 'אי' },
  { word: 'desert', emoji: '🏜️', hebrew: 'מדבר' },
  { word: 'forest', emoji: '🌲', hebrew: 'יער' },
  { word: 'river', emoji: '🏞️', hebrew: 'נהר' },
  { word: 'ocean', emoji: '🏖️', hebrew: 'אוקיינוס' },
  { word: 'wave', emoji: '🌊', hebrew: 'גל' },
  { word: 'cactus', emoji: '🌵', hebrew: 'קקטוס' },
  { word: 'palm tree', emoji: '🌴', hebrew: 'דקל' },
  { word: 'leaf', emoji: '🍃', hebrew: 'עלה' },
  { word: 'seed', emoji: '🌰', hebrew: 'זרע' },
  { word: 'nest', emoji: '🪺', hebrew: 'קן' },
  { word: 'feather', emoji: '🪶', hebrew: 'נוצה' },
  { word: 'egg', emoji: '🥚', hebrew: 'ביצה' },
  { word: 'butterfly', emoji: '🦋', hebrew: 'פרפר' },
  { word: 'bee', emoji: '🐝', hebrew: 'דבורה' },
  { word: 'ladybug', emoji: '🐞', hebrew: 'חיפושית' },
  { word: 'spider', emoji: '🕷️', hebrew: 'עכביש' },
  { word: 'ant', emoji: '🐜', hebrew: 'נמלה' },
  { word: 'snail', emoji: '🐌', hebrew: 'חילזון' },
  { word: 'turtle', emoji: '🐢', hebrew: 'צב' },
  { word: 'frog', emoji: '🐸', hebrew: 'צפרדע' },
  { word: 'snake', emoji: '🐍', hebrew: 'נחש' },
  { word: 'dragon', emoji: '🐉', hebrew: 'דרקון' },
  { word: 'dinosaur', emoji: '🦕', hebrew: 'דינוזאור' },
  { word: 'whale', emoji: '🐋', hebrew: 'לווייתן' },
  { word: 'dolphin', emoji: '🐬', hebrew: 'דולפין' },
  { word: 'shark', emoji: '🦈', hebrew: 'כריש' },
  { word: 'octopus', emoji: '🐙', hebrew: 'תמנון' },
  { word: 'crab', emoji: '🦀', hebrew: 'סרטן' },
];

// Fisher-Yates shuffle algorithm for uniform randomization
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Helper function to generate random options for a word
const generateOptionsForWord = (correctWord, allWords, recentWords = []) => {
  // Filter out the correct word and recently shown words
  const recentSet = new Set(recentWords.map(w => w.word));
  const availableWords = allWords.filter(w => 
    w.word !== correctWord.word && !recentSet.has(w.word)
  );
  
  // If we don't have enough words (shouldn't happen with 206 words), fall back to all words
  const poolToUse = availableWords.length >= 2 ? availableWords : 
    allWords.filter(w => w.word !== correctWord.word);
  
  // Randomly pick 2 words from the pool
  const shuffledPool = shuffleArray(poolToUse);
  const wrongOptions = shuffledPool.slice(0, 2);
  
  // Return shuffled options including the correct word
  return shuffleArray([correctWord, ...wrongOptions]);
};

// Helper function to pick next word that hasn't been shown recently
const pickNextWord = (allWords, recentWords) => {
  const recentSet = new Set(recentWords.map(w => w.word));
  
  // Get words that haven't been shown recently
  const availableWords = allWords.filter(w => !recentSet.has(w.word));
  
  // If we've shown almost all words, reset and start fresh with a shuffle
  if (availableWords.length < 10) {
    const freshShuffle = shuffleArray(allWords);
    return { word: freshShuffle[0], index: 0, needsReshuffle: true };
  }
  
  // Pick a random word from available words
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const selectedWord = availableWords[randomIndex];
  
  return { word: selectedWord, index: allWords.indexOf(selectedWord), needsReshuffle: false };
};

// onComplete is kept for interface consistency with other games, but not used since game is infinite
// eslint-disable-next-line no-unused-vars
function WordCatcher({ onComplete, onBack }) {
  // Initialize with shuffled words and track recently shown words
  const [allWords] = useState(() => shuffleArray(WORDS_DATA));
  const [recentWords, setRecentWords] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showSuccessCartoon, setShowSuccessCartoon] = useState(false);

  // Pick current word and generate options dynamically
  const [currentWordData, setCurrentWordData] = useState(() => {
    const firstWord = allWords[0];
    return {
      word: firstWord,
      options: generateOptionsForWord(firstWord, allWords, [])
    };
  });

  const currentWord = currentWordData.word;
  const options = currentWordData.options;

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
        setCurrentRound(prev => prev + 1);
        
        // Update recent words list (keep last 50 words)
        setRecentWords(prev => {
          const updated = [...prev, currentWord];
          return updated.length > 50 ? updated.slice(-50) : updated;
        });
        
        // Pick next word that hasn't been shown recently
        const nextWordResult = pickNextWord(allWords, [...recentWords, currentWord]);
        
        setCurrentWordData({
          word: nextWordResult.word,
          options: generateOptionsForWord(nextWordResult.word, allWords, [...recentWords, currentWord])
        });
        
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
