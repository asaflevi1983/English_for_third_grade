import { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home';
import WordCatcher from './components/games/WordCatcher';
import SpellTheMagic from './components/games/SpellTheMagic';
import SpeakToDefeat from './components/games/SpeakToDefeat';
import ChooseThePower from './components/games/ChooseThePower';
import ListenAndWrite from './components/games/ListenAndWrite';
import ProgressTracker from './components/ProgressTracker';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('kpop-hunter-progress');
    return savedProgress ? JSON.parse(savedProgress) : {
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
      case 'speak-defeat':
        return <SpeakToDefeat onComplete={(score) => {
          addStars(score);
          addBadge('לוחם הדיבור');
          completeGame('speak-defeat', score);
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
