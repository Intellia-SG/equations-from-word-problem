// src/components/simulations/SpotTheFakeClue.jsx
// Station D: Error-Detective — Spot the Fake Clue
// Implements TRD §6 specifications:
// - Suspect worked solutions with seeded misconceptions (sign errors, under-distributed brackets, fraction slips)
// - Hover magnifying glass cursor effect
// - Tap erroneous line, then choose the correct mathematical fix to crack the case

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const SUSPECT_CASES = [
  {
    id: 0,
    suspect: 'Suspect Dan (The Sign Swapper)',
    scenario: 'Solve: 3x + 8 = 29',
    lines: [
      { text: 'Given equation: 3x + 8 = 29', isError: false },
      {
        text: 'Step 1: 3x = 29 + 8',
        isError: true,
        reason: 'Sign Error! When moving +8 across the equals sign, you must SUBTRACT 8, not add 8!',
      },
      { text: 'Step 2: 3x = 37', isError: false },
      { text: 'Step 3: x = 37 ÷ 3', isError: false },
    ],
    fixQuestion: 'What should Step 1 be?',
    fixOptions: [
      { text: '3x = 29 − 8  ➔ 3x = 21  ➔ x = 7', isCorrect: true },
      { text: '3x = 29 + 8  ➔ 3x = 37  ➔ x = 12', isCorrect: false },
      { text: '3x + 8 − 8 = 29 + 8', isCorrect: false },
    ],
    correctExplanation: '3x + 8 = 29 ➔ 3x = 29 − 8 = 21 ➔ x = 7.',
  },
  {
    id: 1,
    suspect: 'Suspect Bandit (The Under-Distributor)',
    scenario: 'Solve: 4(x + 3) = 28',
    lines: [
      { text: 'Given equation: 4(x + 3) = 28', isError: false },
      {
        text: 'Step 1: 4x + 3 = 28',
        isError: true,
        reason: 'Incomplete Bracket Distribution! 4 must be multiplied by BOTH x and 3: 4 × 3 = 12!',
      },
      { text: 'Step 2: 4x = 28 − 3 = 25', isError: false },
      { text: 'Step 3: x = 25/4', isError: false },
    ],
    fixQuestion: 'What is the correct expanded line for Step 1?',
    fixOptions: [
      { text: '4x + 12 = 28  ➔ 4x = 16  ➔ x = 4', isCorrect: true },
      { text: '4x + 3 = 28', isCorrect: false },
      { text: '4x + 7 = 28  ➔ 4x = 21', isCorrect: false },
    ],
    correctExplanation: '4(x + 3) = 4x + 12. So 4x + 12 = 28 ➔ 4x = 16 ➔ x = 4.',
  },
  {
    id: 2,
    suspect: 'Suspect Fiona (The Fraction Glitch)',
    scenario: 'Solve: x/3 + 4 = 9',
    lines: [
      { text: 'Given equation: x/3 + 4 = 9', isError: false },
      {
        text: 'Step 1: x + 4 = 27',
        isError: true,
        reason: 'Unbalanced Fraction Operation! Multiplying by 3 must apply to the ENTIRE side (+4 becomes +12), or isolate the fraction first: x/3 = 9 − 4 = 5!',
      },
      { text: 'Step 2: x = 27 − 4 = 23', isError: false },
    ],
    fixQuestion: 'What is the proper next step?',
    fixOptions: [
      { text: 'Isolate fraction: x/3 = 9 − 4 = 5  ➔ x = 15', isCorrect: true },
      { text: 'Multiply right side only: x + 4 = 27', isCorrect: false },
      { text: 'Subtract 3: x + 4 = 6', isCorrect: false },
    ],
    correctExplanation: 'x/3 + 4 = 9 ➔ x/3 = 5 ➔ x = 15.',
  },
];

export default function SpotTheFakeClue({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [caseIdx, setCaseIdx] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedFix, setSelectedFix] = useState(null);
  const [lineFound, setLineFound] = useState(false);
  const [stationSuccess, setStationSuccess] = useState(false);

  const scenario = SUSPECT_CASES[caseIdx];

  function handleLineClick(lineIndex) {
    if (lineFound) return;
    const line = scenario.lines[lineIndex];
    setSelectedLine(lineIndex);

    if (line.isError) {
      setLineFound(true);
      sounds.correct();
      narrate([{ text: "Clue spotted! That step contains an algebraic mistake. Now select the correct fix!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "That line is mathematically sound! Inspect the other steps for the slip.", style: 'encouragement' }]);
    }
  }

  function handleFixSelect(fixIndex) {
    const fix = scenario.fixOptions[fixIndex];
    setSelectedFix(fixIndex);

    if (fix.isCorrect) {
      setStationSuccess(true);
      sounds.badge();
      narrate([{ text: "Excellent detective work! Case proven and mathematical truth restored!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "Not quite — verify the inverse operations and distribution carefully!", style: 'encouragement' }]);
    }
  }

  function nextCase() {
    stopAll();
    const next = (caseIdx + 1) % SUSPECT_CASES.length;
    setCaseIdx(next);
    setSelectedLine(null);
    setSelectedFix(null);
    setLineFound(false);
    setStationSuccess(false);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔍 Station D: Spot the Fake Clue &amp; Mistake Hunter</h3>
        <div className="station-target-box">
          <span className="station-target-label">Suspect:</span>
          <span className="station-target-num">{scenario.suspect.split(' ')[1]}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Suspect Dossier & Multi-Line Solution */}
        <div className="station-col-left">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#f59e0b' }}>
                📁 {scenario.suspect}
              </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8', fontSize: '0.9rem' }}>
                {scenario.scenario}
              </span>
            </div>

            <p className="station-guide-text" style={{ textAlign: 'left', fontWeight: 700, margin: '2px 0 6px' }}>
              Inspect the suspect's worked lines. Tap the <strong>line with the mathematical slip</strong>:
            </p>

            {/* Clickable Lines */}
            <div className="spot-steps-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {scenario.lines.map((line, idx) => {
                const isSelected = selectedLine === idx;
                return (
                  <div
                    key={idx}
                    className={`spot-step-card ${isSelected && line.isError ? 'selected-error' : ''} ${isSelected && !line.isError ? 'selected-correct-step' : ''}`}
                    onClick={() => handleLineClick(idx)}
                    role="button"
                    tabIndex={0}
                    style={{
                      cursor: lineFound ? 'default' : 'pointer',
                      padding: '8px 12px',
                      borderRadius: '10px',
                    }}
                    aria-label={`Step ${idx}: ${line.text}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 900,
                          color: isSelected && line.isError ? '#f87171' : '#f59e0b',
                          fontSize: '0.9rem',
                        }}
                      >
                        Line {idx + 1}:
                      </span>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '0.98rem',
                          color: '#ffffff',
                        }}
                      >
                        {line.text}
                      </span>
                    </div>

                    {isSelected && line.isError && <span style={{ fontSize: '1.2rem' }}>🎯</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {lineFound ? '✅ Mistake line identified!' : 'Hover lines with magnifying glass to inspect'}
            </span>
            <button className="btn-outline btn-sm" onClick={nextCase}>
              Next Suspect Case ➔
            </button>
          </div>
        </div>

        {/* Right Column: Error Diagnosis, Solution Fix & Completion Gate */}
        <div className="station-col-right">
          {!lineFound ? (
            <div className="station-guide-card" style={{ height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '2.4rem' }}>🧐</span>
                <h4 style={{ fontFamily: 'var(--font-display)', color: '#f59e0b', fontSize: '1.1rem', margin: 0 }}>
                  Detective Evidence Inspection
                </h4>
                <p className="station-guide-text" style={{ textAlign: 'left', lineHeight: 1.45 }}>
                  The most common algebraic slips in Grade 7 are:
                  <br /><br />
                  • <strong>Sign Errors:</strong> Forgetting that moving a term across <strong style={{ color: '#f59e0b' }}>=</strong> flips its sign.
                  <br />
                  • <strong>Under-Distribution:</strong> Forgetting to multiply <i>both</i> terms inside a bracket.
                  <br />
                  • <strong>Partial Clearing:</strong> Multiplying only part of a side instead of the whole expression.
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1.5px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '10px',
                  width: '100%',
                }}
              >
                <span style={{ fontSize: '0.84rem', color: '#fca5a5', fontWeight: 600 }}>
                  🔍 Find the incorrect line on the left and tap it to reveal the diagnosis!
                </span>
              </div>
            </div>
          ) : !stationSuccess ? (
            /* Step 2: Supply the fix */
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>💡</span>
                  <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.98rem' }}>
                    Mistake Diagnosed!
                  </span>
                </div>

                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1.5px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '0.88rem',
                    color: '#fca5a5',
                    marginBottom: '12px',
                    lineHeight: 1.35,
                  }}
                >
                  {scenario.lines[selectedLine]?.reason}
                </div>

                <p style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: 700, margin: '4px 0 10px' }}>
                  {scenario.fixQuestion}
                </p>

                {/* Fix choices */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {scenario.fixOptions.map((opt, fIdx) => (
                    <button
                      key={fIdx}
                      type="button"
                      className={`btn-sm ${selectedFix === fIdx ? (opt.isCorrect ? 'btn-green' : 'btn-outline') : 'btn-outline'}`}
                      style={{
                        padding: '10px 12px',
                        textAlign: 'left',
                        fontFamily: 'monospace',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        borderColor: selectedFix === fIdx && !opt.isCorrect ? '#ef4444' : undefined,
                      }}
                      onClick={() => handleFixSelect(fIdx)}
                    >
                      {String.fromCharCode(65 + fIdx)}) {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                Select the mathematically correct line to close this case file!
              </div>
            </div>
          ) : (
            /* Station Success */
            <div className="station-success anim-bounce-in" style={{ height: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="success-icon">🎖️</span>
                <p className="station-success-msg">
                  <strong>Fake Clue Spotted &amp; Corrected!</strong>
                  <br />
                  You exposed the suspect's slip and provided the mathematically sound solution!
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.18)',
                  border: '1.5px solid rgba(34, 197, 94, 0.4)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  width: '100%',
                }}
              >
                <div style={{ color: '#86efac', fontWeight: 800, fontSize: '0.92rem', marginBottom: '2px' }}>
                  Corrected Derivation:
                </div>
                <div style={{ fontFamily: 'monospace', color: '#ffffff', fontSize: '0.92rem' }}>
                  {scenario.correctExplanation} ✓
                </div>
              </div>

              <div className="station-success-actions">
                <button className="btn-primary" onClick={nextCase}>
                  Try Another Suspect
                </button>
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
