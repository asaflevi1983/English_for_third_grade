import { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import WordCatcher from './components/games/WordCatcher';
import SpellTheMagic from './components/games/SpellTheMagic';
import ChooseThePower from './components/games/ChooseThePower';
import ListenAndWrite from './components/games/ListenAndWrite';
import RhymeTime from './components/games/RhymeTime';
import MemoryMatch from './components/games/MemoryMatch';
import WeeklyDictation from './components/games/WeeklyDictation';
import AddThreeNumbers from './components/games/AddThreeNumbers';
import IsraelQuiz from './components/games/IsraelQuiz';
import WorldQuiz from './components/games/WorldQuiz';
import FlowerQuiz from './components/games/FlowerQuiz';
import ProgressTracker from './components/ProgressTracker';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [progress, setProgress] = useState(() => {
    // Load progress from localStorage on initial render
    const savedProgress = localStorage.getItem('kpop-hunter-progress');
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    return {
      stars: 0,
      badges: [],
      completedGames: [],
      scores: {}
    };
  });

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('kpop-hunter-progress', JSON.stringify(progress));
  }, [progress]);

  const addStars = (count) => {
    setProgress(prev => ({
      ...prev,
      stars: prev.stars + count
    }));
  };

  const addBadge = (badgeName) => {
    setProgress(prev => ({
      ...prev,
      badges: [...prev.badges, badgeName]
    }));
  };

  const completeGame = (gameName, score) => {
    setProgress(prev => ({
      ...prev,
      completedGames: [...new Set([...prev.completedGames, gameName])],
      scores: { ...prev.scores, [gameName]: score }
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onStartGame={setCurrentScreen} progress={progress} />;
      case 'word-catcher':
        return <WordCatcher onComplete={(score) => {
          addStars(score);
          addBadge('מלכד מילים');
          completeGame('word-catcher', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'spell-magic':
        return <SpellTheMagic onComplete={(score) => {
          addStars(score);
          addBadge('כושף האיות');
          completeGame('spell-magic', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'choose-power':
        return <ChooseThePower onComplete={(score) => {
          addStars(score);
          addBadge('בוחר הכוח');
          completeGame('choose-power', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'listen-write':
        return <ListenAndWrite onComplete={(score) => {
          addStars(score);
          addBadge('מאזין אותיות');
          completeGame('listen-write', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'rhyme-time':
        return <RhymeTime onComplete={(score) => {
          addStars(score);
          addBadge('מלך החרוזים');
          completeGame('rhyme-time', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'memory-match':
        return <MemoryMatch onComplete={(score) => {
          addStars(score);
          addBadge('אלוף הזיכרון');
          completeGame('memory-match', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'weekly-dictation':
        return <WeeklyDictation onComplete={(score) => {
          addStars(score);
          addBadge('מלך ההכתבה');
          completeGame('weekly-dictation', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'add-three-numbers':
        return <AddThreeNumbers onComplete={(score) => {
          addStars(score);
          addBadge('אלוף החיבור');
          completeGame('add-three-numbers', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'israel-quiz':
        return <IsraelQuiz onComplete={(score) => {
          addStars(score);
          addBadge('מומחה ישראל');
          completeGame('israel-quiz', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'world-quiz':
        return <WorldQuiz onComplete={(score) => {
          addStars(score);
          addBadge('אזרח העולם');
          completeGame('world-quiz', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      case 'flower-quiz':
        return <FlowerQuiz onComplete={(score) => {
          addStars(score);
          addBadge('מומחה טבע');
          completeGame('flower-quiz', score);
          setCurrentScreen('home');
        }} onBack={() => setCurrentScreen('home')} />;
      default:
        return <Home onStartGame={setCurrentScreen} progress={progress} />;
    }
  };

  return (
    <div className="app">
      <ProgressTracker stars={progress.stars} badges={progress.badges} />
      {renderScreen()}
    </div>
  );
}

export default App;
