// Centralized sound effects utility using Web Audio API
// Provides better, more pleasant sound effects for the educational games

// Create a single shared AudioContext instance for efficiency
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
};

export const playSound = (type) => {
  const audioContext = getAudioContext();
  
  if (type === 'correct') {
    // Play a cheerful ascending melody (C-E-G major chord arpeggio)
    playNote(audioContext, 523.25, 0, 0.15, 0.3); // C5
    playNote(audioContext, 659.25, 0.12, 0.15, 0.3); // E5
    playNote(audioContext, 783.99, 0.24, 0.25, 0.4); // G5
  } else if (type === 'wrong') {
    // Play a gentle descending tone (not harsh)
    playNote(audioContext, 300, 0, 0.15, 0.2); // Gentle low tone
    playNote(audioContext, 250, 0.15, 0.2, 0.15); // Lower tone
  }
};

// Helper function to play a single note with smooth envelope
const playNote = (audioContext, frequency, startTime, duration, volume = 0.3) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Use sine wave for smooth, pleasant tone
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Create smooth envelope (ADSR)
  const now = audioContext.currentTime + startTime;
  const attackTime = 0.02; // Quick attack
  const decayTime = 0.05; // Short decay
  const sustainLevel = volume * 0.7;
  const releaseTime = 0.1;
  
  // Ensure minimum duration to prevent envelope overlap
  const minDuration = attackTime + decayTime + releaseTime;
  const effectiveDuration = Math.max(duration, minDuration);
  
  // Attack
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + attackTime);
  
  // Decay to sustain
  gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
  
  // Sustain (implicit - no change)
  
  // Release
  const releaseStart = now + effectiveDuration - releaseTime;
  gainNode.gain.setValueAtTime(sustainLevel, releaseStart);
  gainNode.gain.linearRampToValueAtTime(0, releaseStart + releaseTime);
  
  // Start and stop oscillator
  oscillator.start(now);
  oscillator.stop(now + effectiveDuration);
};
