import { useState, useEffect, useRef } from 'react';
import './WeeklyDictation.css';
import SuccessCartoon from '../SuccessCartoon';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1W7djOpaEE1YdEBRq8ZfHbF6bPIvNDglb0JVC_UOfM2k/export?format=csv&gid=0';
// Award at least 1 star for completing the game, even if no words were correct
const MIN_REWARD_STARS = 1;

function WeeklyDictation({ onComplete, onBack }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [letterInputs, setLetterInputs] = useState([]);
  const [letterStatuses, setLetterStatuses] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showSuccessCartoon, setShowSuccessCartoon] = useState(false);
  const inputRefs = useRef([]);

  // Load CSV data on mount
  useEffect(() => {
    loadWordsFromCSV();
  }, []);

  // Initialize letter inputs when word changes
  useEffect(() => {
    if (words.length > 0 && currentWordIndex < words.length) {
      const currentWord = words[currentWordIndex].word;
      setLetterInputs(new Array(currentWord.length).fill(''));
      setLetterStatuses(new Array(currentWord.length).fill('pending'));
      // Focus first input
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [currentWordIndex, words]);

  const loadWordsFromCSV = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(CSV_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch CSV');
      }
      
      const csvText = await response.text();
      const parsedWords = parseCSV(csvText);
      
      if (parsedWords.length === 0) {
        throw new Error('No words found in the sheet');
      }
      
      setWords(parsedWords);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const parseCSV = (csvText) => {
    // Split by lines and remove empty ones
    const lines = csvText.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length === 0) return [];
    
    // Check if first line looks like a header
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('word') || firstLine.includes('confusion') || firstLine.includes('enabled');
    
    const dataLines = hasHeader ? lines.slice(1) : lines;
    const parsedWords = [];
    
    for (const line of dataLines) {
      // Simple CSV parsing - split by comma and handle quotes
      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      
      if (values.length === 0 || !values[0]) continue;
      
      const word = values[0].trim();
      if (!word) continue;
      
      if (hasHeader) {
        // With header: check if enabled
        const enabled = values[2] || '';
        const isEnabled = /^(true|1|yes|y)$/i.test(enabled);
        
        if (isEnabled) {
          parsedWords.push({
            word,
            confusion: values[1] || ''
          });
        }
      } else {
        // Without header: include all non-empty words
        parsedWords.push({
          word,
          confusion: ''
        });
      }
    }
    
    return parsedWords;
  };

  const speakWord = () => {
    if ('speechSynthesis' in window && words.length > 0) {
      const currentWord = words[currentWordIndex].word;
      const utterance = new SpeechSynthesisUtterance(currentWord);
      
      // Try to use Hebrew voice
      const voices = window.speechSynthesis.getVoices();
      const hebrewVoice = voices.find(voice => voice.lang.startsWith('he'));
      if (hebrewVoice) {
        utterance.voice = hebrewVoice;
      }
      utterance.lang = 'he-IL';
      utterance.rate = 0.8;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLetterChange = (index, value) => {
    // Only allow single character
    if (value.length > 1) return;
    
    const newInputs = [...letterInputs];
    newInputs[index] = value;
    setLetterInputs(newInputs);
    
    // Auto-focus next box if value entered and status is pending
    if (value && index < letterInputs.length - 1 && letterStatuses[index] !== 'correct') {
      setTimeout(() => {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1].focus();
        }
      }, 50);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!letterInputs[index] && index > 0) {
        // If current is empty, move back
        setTimeout(() => {
          if (inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
          }
        }, 50);
      }
    }
  };

  const checkAnswer = () => {
    const currentWord = words[currentWordIndex].word;
    const newStatuses = [...letterStatuses];
    let allCorrect = true;
    
    for (let i = 0; i < currentWord.length; i++) {
      if (letterInputs[i] === currentWord[i]) {
        newStatuses[i] = 'correct';
      } else {
        newStatuses[i] = 'wrong';
        allCorrect = false;
      }
    }
    
    setLetterStatuses(newStatuses);
    
    if (!allCorrect) {
      playErrorSound();
    }
    
    if (allCorrect) {
      playSuccessSound();
      setShowSuccessCartoon(true);
      setScore(prev => prev + 1);
      
      setTimeout(() => {
        setShowSuccessCartoon(false);
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex(prev => prev + 1);
        } else {
          setIsGameComplete(true);
        }
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="game-container weekly-dictation">
        <button className="back" onClick={onBack}>← חזור</button>
        <div className="loading-screen">
          <div className="loading-spinner">🔄</div>
          <p>טוען את ההכתבה השבועית…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-container weekly-dictation">
        <button className="back" onClick={onBack}>← חזור</button>
        <div className="error-screen">
          <div className="error-icon">⚠️</div>
          <p>לא הצלחתי לטעון מילים מהגיליון</p>
          <p className="error-detail">{error}</p>
          <button className="primary" onClick={loadWordsFromCSV}>
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="game-container weekly-dictation">
        <button className="back" onClick={onBack}>← חזור</button>
        <div className="error-screen">
          <div className="error-icon">📝</div>
          <p>אין מילים זמינות להכתבה השבועית</p>
          <p className="error-detail">המורה עוד לא הוסיף מילים לשבוע הזה</p>
          <button className="primary" onClick={onBack}>
            חזור לבית
          </button>
        </div>
      </div>
    );
  }

  if (isGameComplete) {
    const finalScore = Math.max(MIN_REWARD_STARS, score);
    
    return (
      <div className="game-container weekly-dictation">
        <div className="completion-screen">
          <div className="completion-content">
            <div className="completion-celebration">📝🗓️✨</div>
            <h1>🎉 כל הכבוד! 🎉</h1>
            <p>סיימתם את ההכתבה השבועית!</p>
            <div className="final-score">
              <h2>הציון שלכם: {score} / {words.length}</h2>
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

  const currentWord = words[currentWordIndex];
  const canCheck = letterInputs.every(input => input !== '') && 
                   letterStatuses.some(status => status !== 'correct');

  return (
    <div className="game-container weekly-dictation">
      <button className="back" onClick={onBack}>← חזור</button>

      <div className="game-header">
        <h1>🗓️ הכתבה שבועית 🗓️</h1>
        <p className="instructions">הקשיבו למילה וכתבו אותה אות אחרי אות</p>
        <div className="score-display">
          נכון: {score} | מילה: {currentWordIndex + 1}/{words.length}
        </div>
      </div>

      <div className="word-section">
        <button className="primary speak-button" onClick={speakWord}>
          🔊 השמע מילה
        </button>
        
        {currentWord.confusion && (
          <div className="confusion-hint">
            תרגול: {currentWord.confusion}
          </div>
        )}
      </div>

      <div className="letter-boxes-container">
        <div className="letter-boxes">
          {letterInputs.map((letter, index) => {
            const isLetterCorrect = letterStatuses[index] === 'correct';
            return (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                className={`letter-box ${letterStatuses[index]}`}
                value={letter}
                onChange={(e) => handleLetterChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength="1"
                disabled={isLetterCorrect}
                readOnly={isLetterCorrect}
              />
            );
          })}
        </div>
        
        <div className="word-length-hint">
          {letterInputs.length} אותיות
        </div>
      </div>

      {canCheck && (
        <button className="primary check-button" onClick={checkAnswer}>
          בדוק ✓
        </button>
      )}

      <div className="battle-scene">
        <div className="student-character">
          <div className="character-icon">✍️</div>
          <div className="character-label">התלמיד</div>
        </div>
        <div className="vs-text">VS</div>
        <div className="demon-target">
          {letterStatuses.every(s => s === 'correct') ? '😵' : '👾'}
        </div>
      </div>

      <SuccessCartoon 
        show={showSuccessCartoon} 
        onComplete={() => setShowSuccessCartoon(false)}
      />
    </div>
  );
}

export default WeeklyDictation;
