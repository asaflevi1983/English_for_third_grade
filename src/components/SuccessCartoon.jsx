import { useState, useEffect } from 'react';
import './SuccessCartoon.css';

function SuccessCartoon({ show, onComplete }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentGesture, setCurrentGesture] = useState(0);

  useEffect(() => {
    if (show) {
      // Managing animation state - triggered by external prop change
      setIsVisible(true);
      setCurrentGesture(0);

      // Cycle through gestures for animation
      const gestureInterval = setInterval(() => {
        setCurrentGesture(prev => (prev + 1) % 3);
      }, 600);

      // Hide after animation completes - cleanup external animation state
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        // onComplete is optional, only call if provided
        if (onComplete) {
          onComplete();
        }
      }, 3000);

      return () => {
        clearInterval(gestureInterval);
        clearTimeout(hideTimer);
      };
    }
    // Note: onComplete is not in dependency array to avoid re-triggering animation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!isVisible) return null;

  // Gesture variations for celebration
  const gestures = ['🎉', '⭐', '✨'];
  const cartoonFaces = ['😄', '🤩', '😃'];

  return (
    <div className="success-cartoon-overlay">
      <div className="success-cartoon">
        <div className="cartoon-character">
          <div className="cartoon-face">
            {cartoonFaces[currentGesture % cartoonFaces.length]}
          </div>
          <div className="cartoon-body">
            <div className="cartoon-arms">
              <span className="arm left">🙌</span>
              <span className="arm right">🙌</span>
            </div>
          </div>
        </div>
        <div className="celebration-particles">
          {gestures.map((gesture, idx) => (
            <span key={idx} className={`particle particle-${idx}`}>
              {gesture}
            </span>
          ))}
        </div>
        <div className="success-message">
          <span className="message-text">🌟 Great Job! 🌟</span>
        </div>
      </div>
    </div>
  );
}

export default SuccessCartoon;
