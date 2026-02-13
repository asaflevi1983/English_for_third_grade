/**
 * Audio utility for playing pleasant game sound effects
 * Uses Web Audio API to generate musical tones
 */

/**
 * Plays a pleasant success sound - ascending musical notes
 */
export function playSuccessSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Play a pleasant ascending arpeggio: C5 -> E5 -> G5
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const startTime = audioContext.currentTime;
  
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Use sine wave for pleasant, smooth tone
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Envelope: quick attack, sustain, gentle release
    const noteStart = startTime + (index * 0.15);
    const noteEnd = noteStart + 0.2;
    
    gainNode.gain.setValueAtTime(0, noteStart);
    gainNode.gain.linearRampToValueAtTime(0.25, noteStart + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.15, noteEnd - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, noteEnd);
    
    oscillator.start(noteStart);
    oscillator.stop(noteEnd);
  });
}

/**
 * Plays a gentle error sound - descending tones
 */
export function playErrorSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Play two descending notes: D4 -> A3 (gentle, not harsh)
  const notes = [293.66, 220.00]; // D4, A3
  const startTime = audioContext.currentTime;
  
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Use sine wave for smooth, non-jarring sound
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Gentle envelope
    const noteStart = startTime + (index * 0.12);
    const noteEnd = noteStart + 0.2;
    
    gainNode.gain.setValueAtTime(0, noteStart);
    gainNode.gain.linearRampToValueAtTime(0.15, noteStart + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.1, noteEnd - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, noteEnd);
    
    oscillator.start(noteStart);
    oscillator.stop(noteEnd);
  });
}

/**
 * Plays a celebration sound - happy musical flourish
 */
export function playCelebrationSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  // Play an uplifting melody: C5 -> E5 -> G5 -> C6
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  const startTime = audioContext.currentTime;
  
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    const noteStart = startTime + (index * 0.12);
    const noteEnd = noteStart + 0.25;
    
    gainNode.gain.setValueAtTime(0, noteStart);
    gainNode.gain.linearRampToValueAtTime(0.3, noteStart + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.2, noteEnd - 0.05);
    gainNode.gain.linearRampToValueAtTime(0, noteEnd);
    
    oscillator.start(noteStart);
    oscillator.stop(noteEnd);
  });
}
