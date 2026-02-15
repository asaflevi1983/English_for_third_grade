import { useState, useEffect, useRef } from 'react';
import './WeeklyDictation.css';
import SuccessCartoon from '../SuccessCartoon';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1W7djOpaEE1YdEBRq8ZfHbF6bPIvNDglb0JVC_UOfM2k/gviz/tq?tqx=out:csv&sheet=Sheet1';
// Award at least 1 star for completing the game, even if no words were correct
const MIN_REWARD_STARS = 1;
// Maximum length of raw data to show in error preview
const DATA_PREVIEW_LENGTH = 200;

// Fisher-Yates shuffle algorithm for randomizing array order
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

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
    // Only run on mount, loadWordsFromCSV is not a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      
      const response = await fetch(CSV_URL, { cache: 'no-store' });
      if (!response.ok) {
        // Detailed error for HTTP failures
        const error = new Error(`Failed to load Google Sheets data`);
        error.url = CSV_URL;
        error.status = response.status;
        error.statusText = response.statusText;
        error.type = 'HTTP_ERROR';
        
        // Provide specific troubleshooting for common status codes
        if (response.status === 403) {
          error.reason = 'Access Denied - The sheet may be private or permissions not set correctly';
          error.solution = 'Make sure the Google Sheet is set to "Anyone with the link can view"';
        } else if (response.status === 404) {
          error.reason = 'Sheet Not Found - The sheet ID may be incorrect or the sheet was deleted';
          error.solution = 'Verify the Google Sheets URL in the code is correct';
        } else if (response.status === 429) {
          error.reason = 'Too Many Requests - Google Sheets API rate limit exceeded';
          error.solution = 'Wait a few minutes before trying again';
        } else {
          error.reason = `Server returned ${response.status} ${response.statusText}`;
          error.solution = 'Check your internet connection and try again';
        }
        
        throw error;
      }
      
      const csvText = await response.text();
      
      // Check if response looks like CSV data
      if (!csvText || csvText.trim().length === 0) {
        const error = new Error('Empty Response');
        error.url = CSV_URL;
        error.reason = 'The Google Sheets returned empty data';
        error.solution = 'Make sure the sheet has data and the sheet name is correct';
        error.type = 'EMPTY_RESPONSE';
        throw error;
      }
      
      const parsedWords = parseCSV(csvText);
      
      if (parsedWords.length === 0) {
        const error = new Error('No Words Found');
        error.url = CSV_URL;
        error.reason = 'The sheet has data but no enabled words were found';
        error.solution = 'Make sure at least one word has "enabled" set to true in the sheet';
        error.type = 'NO_ENABLED_WORDS';
        error.rawDataPreview = csvText.substring(0, DATA_PREVIEW_LENGTH) + (csvText.length > DATA_PREVIEW_LENGTH ? '...' : '');
        throw error;
      }
      
      // Shuffle words to randomize order - never the same sequence
      const shuffledWords = shuffleArray(parsedWords);
      setWords(shuffledWords);
      setLoading(false);
    } catch (err) {
      // Handle network errors (no internet, CORS, etc.)
      if (err instanceof TypeError) {
        // TypeError typically indicates fetch/network failures
        setError({
          message: 'Network Error',
          url: CSV_URL,
          reason: 'Failed to connect to Google Sheets',
          solution: 'Check your internet connection. If the problem persists, there may be a CORS issue.',
          type: 'NETWORK_ERROR',
          originalError: err.message
        });
      } else if (err instanceof Error && err.type) {
        // Our custom Error objects with attached properties
        setError({
          message: err.message,
          url: err.url,
          status: err.status,
          statusText: err.statusText,
          reason: err.reason,
          solution: err.solution,
          type: err.type,
          rawDataPreview: err.rawDataPreview,
          originalError: err.originalError
        });
      } else {
        // Generic error
        setError({
          message: 'Unknown Error',
          url: CSV_URL,
          reason: err.message || 'An unexpected error occurred',
          solution: 'Try refreshing the page or contact support',
          type: 'UNKNOWN_ERROR',
          originalError: err.message
        });
      }
      setLoading(false);
    }
  };

  const parseCSV = (csvText) => {
    // Split by lines and remove empty ones
    const lines = csvText.split(/\r?\n/).filter(line => line.trim());
    
    if (lines.length === 0) return [];
    
    // Detect delimiter from first line (comma, semicolon, or tab)
    const firstLine = lines[0];
    let delimiter = ',';
    if (firstLine.includes('\t')) {
      delimiter = '\t';
    } else if (firstLine.includes(';') && !firstLine.includes(',')) {
      delimiter = ';';
    }
    
    // Check if first line looks like a header
    const firstLineLower = firstLine.toLowerCase();
    const hasHeader = firstLineLower.includes('word') || firstLineLower.includes('confusion') || firstLineLower.includes('enabled');
    
    // Parse header to map column names to indices
    let headerMap = {};
    if (hasHeader) {
      const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
      headers.forEach((header, index) => {
        headerMap[header] = index;
      });
    }
    
    const dataLines = hasHeader ? lines.slice(1) : lines;
    const parsedWords = [];
    
    for (const line of dataLines) {
      // Split by detected delimiter and handle quotes
      const values = line.split(delimiter).map(v => v.trim().replace(/^["']|["']$/g, ''));
      
      if (values.length === 0 || !values[0]) continue;
      
      // Get word from first column or mapped column
      const wordIndex = headerMap['word'] !== undefined ? headerMap['word'] : 0;
      const word = values[wordIndex]?.trim();
      if (!word) continue;
      
      if (hasHeader) {
        // With header: check if enabled using mapped index
        const enabledIndex = headerMap['enabled'] !== undefined ? headerMap['enabled'] : 2;
        const enabled = values[enabledIndex] || '';
        const isEnabled = /^(true|1|yes|y)$/i.test(enabled.trim());
        
        if (isEnabled) {
          const confusionIndex = headerMap['confusion'] !== undefined ? headerMap['confusion'] : 1;
          parsedWords.push({
            word,
            confusion: values[confusionIndex] || ''
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
          <h2 className="error-title">שגיאה בטעינת הגיליון</h2>
          
          {/* Main error message */}
          <div className="error-message">
            {typeof error === 'string' ? error : error.message}
          </div>
          
          {/* Detailed debugging information */}
          {typeof error === 'object' && (
            <div className="error-debug-info">
              <div className="debug-section">
                <strong>🔍 פרטי שגיאה לניפוי באגים:</strong>
                
                {error.reason && (
                  <div className="debug-item">
                    <span className="debug-label">סיבה:</span>
                    <span className="debug-value">{error.reason}</span>
                  </div>
                )}
                
                {error.solution && (
                  <div className="debug-item solution">
                    <span className="debug-label">💡 פתרון מוצע:</span>
                    <span className="debug-value">{error.solution}</span>
                  </div>
                )}
                
                {error.status && (
                  <div className="debug-item">
                    <span className="debug-label">HTTP Status:</span>
                    <span className="debug-value">{error.status} - {error.statusText}</span>
                  </div>
                )}
                
                {error.type && (
                  <div className="debug-item">
                    <span className="debug-label">Error Type:</span>
                    <span className="debug-value">{error.type}</span>
                  </div>
                )}
                
                {error.url && (
                  <div className="debug-item">
                    <span className="debug-label">URL:</span>
                    <span className="debug-value url-value">{error.url}</span>
                  </div>
                )}
                
                {error.originalError && (
                  <div className="debug-item">
                    <span className="debug-label">Original Error:</span>
                    <span className="debug-value">{error.originalError}</span>
                  </div>
                )}
                
                {error.rawDataPreview && (
                  <div className="debug-item">
                    <span className="debug-label">Data Preview:</span>
                    <pre className="debug-value preview">{error.rawDataPreview}</pre>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <button className="primary retry-button" onClick={loadWordsFromCSV}>
            🔄 נסה שוב
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
