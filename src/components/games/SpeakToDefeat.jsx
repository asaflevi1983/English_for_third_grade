import { useState } from 'react';
import './SpeakToDefeat.css';
import { playSuccessSound, playErrorSound } from '../../utils/audioUtils';

const PRONUNCIATION_WORDS = [
  { word: 'hello', hebrew: 'שלום', phonetic: 'he-lo' },
  { word: 'thank you', hebrew: 'תודה', phonetic: 'thank yu' },
  { word: 'school', hebrew: 'בית ספר', phonetic: 'skool' },
  { word: 'friend', hebrew: 'חבר', phonetic: 'frend' },
  { word: 'happy', hebrew: 'שמח', phonetic: 'ha-pi' },
  { word: 'water', hebrew: 'מים', phonetic: 'wo-ter' },
];

function SpeakToDefeat({ onComplete, onBack }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isGameComplete, setIsGameComplete] = useState(false);

  const currentWord = PRONUNCIATION_WORDS[currentRound];

  const playWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Fallback for browsers without speech recognition
      simulateSpeech();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      checkPronunciation(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      // On error, still allow progression with a neutral result
      simulateSpeech();
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const simulateSpeech = () => {
    // Fallback for when speech recognition isn't available
    setIsListening(true);
    
    setTimeout(() => {
      setIsListening(false);
      setFeedback('correct');
      setScore(score + 1);
      playSuccessSound();
      
      setTimeout(() => {
        if (currentRound < PRONUNCIATION_WORDS.length - 1) {
          setCurrentRound(currentRound + 1);
          setFeedback('');
        } else {
          setIsGameComplete(true);
        }
      }, 1500);
    }, 2000);
  };

  const checkPronunciation = (transcript) => {
    const targetWords = currentWord.word.toLowerCase().split(' ');
    const spokenWords = transcript.split(' ');
    
    // Check if any of the target words are in the spoken words
    const isCorrect = targetWords.some(word => 
      spokenWords.some(spoken => 
        spoken.includes(word) || word.includes(spoken)
      )
    );

    if (isCorrect) {
      setFeedback('correct');
      setScore(score + 1);
      playSuccessSound();
      
      setTimeout(() => {
        if (currentRound < PRONUNCIATION_WORDS.length - 1) {
          setCurrentRound(currentRound + 1);
          setFeedback('');
        } else {
          setIsGameComplete(true);
        }
      }, 1500);
    } else {
      setFeedback('tryagain');
      playErrorSound();
      
      setTimeout(() => {
        setFeedback('');
      }, 1500);
    }
  };

  const skipWord = () => {
    if (currentRound < PRONUNCIATION_WORDS.length - 1) {
      setCurrentRound(currentRound + 1);
      setFeedback('');
    } else {
      setIsGameComplete(true);
    }
  };

  if (isGameComplete) {
    const finalScore = Math.max(1, score);
    return (
      <div className="game-container speak-defeat">
        <div className="completion-screen">
          <div className="voice-victory">
            <div className="sound-waves">🎤🎵🎶</div>
            <h1>🎉 קול מנצח! 🎉</h1>
            <p>השד הוכה בכוח הדיבור שלכם!</p>
            <div className="final-score">
              <h2>הציון שלכם: {score} / {PRONUNCIATION_WORDS.length}</h2>
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
    <div className="game-container speak-defeat">
      <button className="back" onClick={onBack}>← חזור</button>
      
      <div className="game-header">
        <h1>🎤 מדברים כדי לנצח 🎤</h1>
        <p className="instructions">תקשיבו למילה ותגידו אותה בקול!</p>
        <div className="score-display">
          נכון: {score} | שאלה: {currentRound + 1}/{PRONUNCIATION_WORDS.length}
        </div>
      </div>

      <div className="word-card">
        <div className={`word-display ${feedback}`}>
          <h2>{currentWord.word}</h2>
          <p className="phonetic">{currentWord.phonetic}</p>
          <p className="hebrew-hint">{currentWord.hebrew}</p>
        </div>

        <button className="secondary speaker-button" onClick={playWord}>
          🔊 תשמעו את המילה
        </button>
      </div>

      <div className="microphone-section">
        <button 
          className={`microphone-button ${isListening ? 'listening' : ''}`}
          onClick={startListening}
          disabled={isListening}
        >
          {isListening ? (
            <>
              <div className="mic-pulse">🎤</div>
              <span>מקשיב...</span>
            </>
          ) : (
            <>
              <span className="mic-icon">🎤</span>
              <span>לחצו ותגידו את המילה</span>
            </>
          )}
        </button>

        {feedback === 'correct' && (
          <div className="feedback-message success-message">
            ✓ מעולה! המשיכו כך!
          </div>
        )}

        {feedback === 'tryagain' && (
          <div className="feedback-message tryagain-message">
            נסו שוב! תקשיבו למילה שוב
          </div>
        )}

        <button className="skip-button" onClick={skipWord}>
          דלג על המילה →
        </button>
      </div>

      <div className="battle-stage">
        <div className="speaker-hero">🎸🎤</div>
        <div className="sound-waves-battle">
          {isListening && '〰️〰️〰️'}
        </div>
        <div className="demon-listener">
          {feedback === 'correct' ? '😱' : '👾'}
        </div>
      </div>
    </div>
  );
}

export default SpeakToDefeat;
