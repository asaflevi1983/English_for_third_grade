import { useState, useCallback } from 'react';
import './MatchstickPuzzle.css';

// 7-segment display: segments labeled 0-6
//   0
//  5   1
//   6
//  4   2
//   3
const DIGIT_SEGMENTS = {
  0: [1,1,1,1,1,1,0],
  1: [0,1,1,0,0,0,0],
  2: [1,1,0,1,1,0,1],
  3: [1,1,1,1,0,0,1],
  4: [0,1,1,0,0,1,1],
  5: [1,0,1,1,0,1,1],
  6: [1,0,1,1,1,1,1],
  7: [1,1,1,0,0,0,0],
  8: [1,1,1,1,1,1,1],
  9: [1,1,1,1,0,1,1],
};

// Operators as segment patterns
// + is horizontal middle + vertical middle (we'll use a custom layout)
// - is just horizontal middle
// = is two horizontal lines
const OPERATOR_PLUS = { type: 'plus', segments: [0,1] }; // h-bar, v-bar
const OPERATOR_MINUS = { type: 'minus', segments: [0] }; // h-bar only
const OPERATOR_EQUALS = { type: 'equals', segments: [0,1] }; // top-bar, bottom-bar

// Puzzles: each has initial equation chars, target equation chars, and moves needed
// Format: { display: [char, ...], answer: [char, ...], moves: N }
// Each char is a digit (0-9) or operator (+, -, =)
const PUZZLES = [
  { display: ['6','+','4','=','4'], answer: ['5','+','4','=','9'], moves: 1, hint: 'שנו ספרה אחת' },
  { display: ['8','-','6','=','1'], answer: ['8','-','7','=','1'], moves: 1, hint: 'תקנו את הספרה האמצעית' },
  { display: ['6','+','1','=','0'], answer: ['6','+','1','=','7'], moves: 1, hint: 'הפכו 0 למספר אחר' },
  { display: ['3','+','5','=','1'], answer: ['3','+','5','=','8'], moves: 1, hint: 'הוסיפו גפרור ל-1' },
  { display: ['9','-','1','=','3'], answer: ['9','-','1','=','8'], moves: 1, hint: 'שנו את התוצאה' },
  { display: ['5','+','5','=','0'], answer: ['5','+','5','=','0'], answer2: ['9','+','1','=','0'], moves: 1, hint: 'הפכו 5 ל-9' },
  { display: ['0','+','1','=','7'], answer: ['0','+','7','=','7'], moves: 1, hint: 'הפכו 1 ל-7' },
  { display: ['1','+','1','=','9'], answer: ['7','+','1','=','8'], moves: 2, hint: 'שנו שתי ספרות' },
  { display: ['3','-','3','=','3'], answer: ['9','-','3','=','6'], moves: 2, hint: 'שנו שתי ספרות' },
  { display: ['5','+','3','=','6'], answer: ['5','+','1','=','6'], moves: 1, hint: 'שנו ספרה אחת' },
  { display: ['9','+','5','=','6'], answer: ['9','-','5','=','4'], moves: 1, hint: 'שנו סימן ותוצאה' },
  { display: ['8','+','3','=','0'], answer: ['8','-','3','=','5'], moves: 2, hint: 'שנו את הפעולה והתוצאה' },
];

function segmentsToDigit(segs) {
  for (let d = 0; d <= 9; d++) {
    const ds = DIGIT_SEGMENTS[d];
    if (ds.every((v, i) => v === segs[i])) return d;
  }
  return null;
}

function charToSegments(ch) {
  if (ch >= '0' && ch <= '9') return [...DIGIT_SEGMENTS[parseInt(ch)]];
  return null;
}

function evaluateEquation(chars) {
  // chars like ['5','+','4','=','9']
  const eq = chars.join('');
  const eqMatch = eq.match(/^(\d)([+-])(\d)=(\d)$/);
  if (!eqMatch) return false;
  const [, a, op, b, c] = eqMatch;
  const left = op === '+' ? parseInt(a) + parseInt(b) : parseInt(a) - parseInt(b);
  return left === parseInt(c);
}

const TOTAL_PUZZLES = PUZZLES.length;

function MatchstickPuzzle({ onComplete, onBack }) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Current segments state for each digit position
  // We store segments arrays for digit positions (indices 0, 2, 4 in the 5-char equation)
  const puzzle = PUZZLES[puzzleIndex];
  
  const getInitialSegments = useCallback(() => {
    const segs = {};
    puzzle.display.forEach((ch, i) => {
      if (ch >= '0' && ch <= '9') {
        segs[i] = charToSegments(ch);
      }
    });
    return segs;
  }, [puzzleIndex]);

  const getInitialOperators = useCallback(() => {
    const ops = {};
    puzzle.display.forEach((ch, i) => {
      if (ch === '+' || ch === '-') ops[i] = ch;
    });
    return ops;
  }, [puzzleIndex]);

  const [segments, setSegments] = useState(() => getInitialSegments());
  const [operators, setOperators] = useState(() => getInitialOperators());
  const [pickedUp, setPickedUp] = useState(null); // { from: 'digit'|'operator', pos: index, seg: segIndex }
  const [movesLeft, setMovesLeft] = useState(puzzle.moves);
  const [movesMade, setMovesMade] = useState(0);
  const [solved, setSolved] = useState(false);
  const [celebration, setCelebration] = useState(false);

  const resetPuzzle = () => {
    setSegments(getInitialSegments());
    setOperators(getInitialOperators());
    setPickedUp(null);
    setMovesLeft(puzzle.moves);
    setMovesMade(0);
    setSolved(false);
    setShowHint(false);
  };

  // Reset when puzzle changes
  const startPuzzle = (idx) => {
    setPuzzleIndex(idx);
    const p = PUZZLES[idx];
    const segs = {};
    p.display.forEach((ch, i) => {
      if (ch >= '0' && ch <= '9') segs[i] = charToSegments(ch);
    });
    const ops = {};
    p.display.forEach((ch, i) => {
      if (ch === '+' || ch === '-') ops[i] = ch;
    });
    setSegments(segs);
    setOperators(ops);
    setPickedUp(null);
    setMovesLeft(p.moves);
    setMovesMade(0);
    setSolved(false);
    setCelebration(false);
    setShowHint(false);
  };

  const checkSolution = (segs, ops) => {
    // Reconstruct equation from current segments and operators
    const chars = puzzle.display.map((ch, i) => {
      if (ch === '=') return '=';
      if (ch === '+' || ch === '-') return ops[i] || ch;
      if (segs[i]) {
        const d = segmentsToDigit(segs[i]);
        if (d !== null) return d.toString();
      }
      return '?';
    });
    return evaluateEquation(chars);
  };

  const handleSegmentClick = (charIndex, segIndex) => {
    if (solved) return;
    const isOn = segments[charIndex]?.[segIndex] === 1;

    if (pickedUp === null) {
      // Pick up a segment that's ON
      if (!isOn) return;
      setSegments(prev => {
        const next = { ...prev, [charIndex]: [...prev[charIndex]] };
        next[charIndex][segIndex] = 0;
        return next;
      });
      setPickedUp({ type: 'digit', pos: charIndex, seg: segIndex });
    } else {
      // Place the picked up segment
      if (isOn) return; // Can't place on an already-on segment
      const newSegs = { ...segments, [charIndex]: [...segments[charIndex]] };
      newSegs[charIndex][segIndex] = 1;
      setSegments(newSegs);
      setPickedUp(null);
      const newMoves = movesMade + 1;
      setMovesMade(newMoves);
      setMovesLeft(prev => prev - 1);

      // Check if solved
      if (checkSolution(newSegs, operators)) {
        setSolved(true);
        setCelebration(true);
        setScore(prev => prev + Math.max(1, 3 - (newMoves - puzzle.moves)));
        setTimeout(() => {
          if (puzzleIndex + 1 < TOTAL_PUZZLES) {
            startPuzzle(puzzleIndex + 1);
          } else {
            setShowComplete(true);
          }
        }, 2000);
      }
    }
  };

  // Handle operator segment click (+ has a vertical bar that - doesn't)
  const handleOperatorClick = (charIndex) => {
    if (solved) return;
    const currentOp = operators[charIndex];
    
    if (pickedUp === null) {
      // Can pick up from + to make it -
      if (currentOp === '+') {
        setOperators(prev => ({ ...prev, [charIndex]: '-' }));
        setPickedUp({ type: 'operator', pos: charIndex });
      }
    } else {
      // Can place on - to make it +
      if (currentOp === '-' && pickedUp.type === 'operator') {
        const newOps = { ...operators, [charIndex]: '+' };
        setOperators(newOps);
        setPickedUp(null);
        const newMoves = movesMade + 1;
        setMovesMade(newMoves);
        setMovesLeft(prev => prev - 1);

        if (checkSolution(segments, newOps)) {
          setSolved(true);
          setCelebration(true);
          setScore(prev => prev + Math.max(1, 3 - (newMoves - puzzle.moves)));
          setTimeout(() => {
            if (puzzleIndex + 1 < TOTAL_PUZZLES) {
              startPuzzle(puzzleIndex + 1);
            } else {
              setShowComplete(true);
            }
          }, 2000);
        }
      }
    }
  };

  if (showComplete) {
    const stars = Math.min(5, Math.ceil(score / 3));
    return (
      <div className="matchstick-game">
        <div className="matchstick-complete">
          <h2>🎉 כל הכבוד! 🎉</h2>
          <p className="complete-subtitle">Matchstick Master!</p>
          <div className="stars-display">
            {'⭐'.repeat(stars)}
          </div>
          <p className="final-score">ניקוד: {score}</p>
          <button className="matchstick-btn primary" onClick={() => onComplete(score)}>
            סיום 🏠
          </button>
        </div>
      </div>
    );
  }

  const currentEquation = puzzle.display.map((ch, i) => {
    if (ch === '=') return '=';
    if (ch === '+' || ch === '-') return operators[i] || ch;
    if (segments[i]) {
      const d = segmentsToDigit(segments[i]);
      return d !== null ? d.toString() : '?';
    }
    return ch;
  }).join(' ');

  return (
    <div className="matchstick-game">
      <div className="matchstick-header">
        <button className="matchstick-back-btn" onClick={onBack}>→ חזרה</button>
        <div className="matchstick-info">
          <h2>🔥 חידון גפרורים</h2>
          <p className="matchstick-subtitle">Matchstick Puzzle</p>
        </div>
        <div className="matchstick-progress">
          {puzzleIndex + 1} / {TOTAL_PUZZLES}
        </div>
      </div>

      <div className="matchstick-score">⭐ {score}</div>

      <div className="matchstick-instruction">
        <span className="move-count">הזיזו {puzzle.moves} גפרור{puzzle.moves > 1 ? 'ים' : ''}</span>
        <span className="move-english">Move {puzzle.moves} matchstick{puzzle.moves > 1 ? 's' : ''}</span>
        {pickedUp && <span className="picked-indicator">🔥 מחזיקים גפרור! לחצו על מקום ריק</span>}
        <span className="moves-remaining">נותרו: {movesLeft}</span>
      </div>

      {celebration && (
        <div className="matchstick-celebration">
          <span>🎉 נכון! 🎉</span>
        </div>
      )}

      <div className="equation-container" dir="ltr" style={{direction: 'ltr', unicodeBidi: 'bidi-override'}}>
        {puzzle.display.map((ch, charIdx) => {
          if (ch === '=') {
            return (
              <div key={charIdx} className="equation-char equals-sign">
                <div className="equals-bar top"></div>
                <div className="equals-bar bottom"></div>
              </div>
            );
          }
          if (ch === '+' || ch === '-') {
            const currentOp = operators[charIdx] || ch;
            return (
              <div
                key={charIdx}
                className={`equation-char operator-sign ${currentOp === '-' && pickedUp ? 'can-place' : ''} ${currentOp === '+' && !pickedUp ? 'can-pick' : ''}`}
                onClick={() => handleOperatorClick(charIdx)}
              >
                <div className="op-h-bar"></div>
                {currentOp === '+' && <div className="op-v-bar"></div>}
              </div>
            );
          }
          // Digit - render 7-segment display
          const segs = segments[charIdx] || [0,0,0,0,0,0,0];
          return (
            <div key={charIdx} className="equation-char digit-display">
              {[0,1,2,3,4,5,6].map(segIdx => {
                const isOn = segs[segIdx] === 1;
                const canPick = isOn && !pickedUp && !solved;
                const canPlace = !isOn && pickedUp && !solved;
                return (
                  <div
                    key={segIdx}
                    className={`segment seg-${segIdx} ${isOn ? 'on' : 'off'} ${canPick ? 'pickable' : ''} ${canPlace ? 'placeable' : ''}`}
                    onClick={() => handleSegmentClick(charIdx, segIdx)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="matchstick-actions">
        <button className="matchstick-btn" onClick={resetPuzzle}>🔄 איפוס</button>
        <button className="matchstick-btn hint-btn" onClick={() => setShowHint(true)}>💡 רמז</button>
      </div>

      {showHint && (
        <div className="matchstick-hint">
          <p>{puzzle.hint}</p>
          <p className="hint-target">תשובה: {puzzle.answer.join(' ')}</p>
        </div>
      )}
    </div>
  );
}

export default MatchstickPuzzle;
