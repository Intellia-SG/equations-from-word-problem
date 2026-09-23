// src/components/simulations/BuildTheCaseFile.jsx
// Station C: Multi-Step/Composite Construction — Build the Case File
// Implements TRD §6 specifications:
// - Phrase-chunks from word-problem scenario to build equation in slots
// - Live-updating "your equation so far" readout
// - Two-phase completion gate: Correct equation construction + solving for x

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const CASE_SCENARIOS = [
  {
    id: 0,
    title: 'The Spy Notebooks Clue',
    story: 'Detective Wei Jie bought 3 identical spy notebooks and a $4 magnifying glass. The total bill was $19. What was the price of one notebook?',
    letStatement: 'Let x = price of one notebook ($)',
    slots: [
      { name: 'Variable Term', target: '3x', options: ['3x', 'x + 3', 'x'] },
      { name: 'Constant Term', target: '+ 4', options: ['+ 4', '− 4', '+ 19'] },
      { name: 'Total', target: '= 19', options: ['= 19', '= 4', '= 3'] },
    ],
    expectedEq: '3x + 4 = 19',
    solveSteps: '3x + 4 = 19 ➔ 3x = 15 ➔ x = 5',
    correctX: 5,
    solveOptions: [5, 4, 6, 7],
  },
  {
    id: 1,
    title: 'The Evidence Badges Dilemma',
    story: "Priya has x clue badges. Deepa has 5 more than twice Priya's badges. Deepa has 23 badges in total. Find x.",
    letStatement: "Let x = Priya's clue badges",
    slots: [
      { name: 'Variable Term', target: '2x', options: ['2x', 'x + 2', '5x'] },
      { name: 'Constant Term', target: '+ 5', options: ['+ 5', '− 5', '+ 23'] },
      { name: 'Total', target: '= 23', options: ['= 23', '= 5', '= 2'] },
    ],
    expectedEq: '2x + 5 = 23',
    solveSteps: '2x + 5 = 23 ➔ 2x = 18 ➔ x = 9',
    correctX: 9,
    solveOptions: [9, 8, 14, 7],
  },
  {
    id: 2,
    title: 'The Police Cordon Tape',
    story: 'A cordon tape was cut into 4 equal segments of length x meters and one 8-meter piece. The total length was 40 meters. Find x.',
    letStatement: 'Let x = length of one equal segment (m)',
    slots: [
      { name: 'Variable Term', target: '4x', options: ['4x', 'x + 4', '8x'] },
      { name: 'Constant Term', target: '+ 8', options: ['+ 8', '− 8', '+ 40'] },
      { name: 'Total', target: '= 40', options: ['= 40', '= 8', '= 4'] },
    ],
    expectedEq: '4x + 8 = 40',
    solveSteps: '4x + 8 = 40 ➔ 4x = 32 ➔ x = 8',
    correctX: 8,
    solveOptions: [8, 7, 10, 6],
  },
];

export default function BuildTheCaseFile({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [caseIdx, setCaseIdx] = useState(0);

  const scenario = CASE_SCENARIOS[caseIdx];
  const [placedSlots, setPlacedSlots] = useState([null, null, null]);
  const [isAssembled, setIsAssembled] = useState(false);
  const [solvedX, setSolvedX] = useState(null);
  const [stationSuccess, setStationSuccess] = useState(false);

  function handleSlotSelect(slotIdx, option) {
    if (isAssembled) return;
    const next = [...placedSlots];
    next[slotIdx] = option;
    setPlacedSlots(next);
    sounds.click();

    // Check if all 3 slots filled
    if (next.every(Boolean)) {
      const isCorrectEquation =
        next[0] === scenario.slots[0].target &&
        next[1] === scenario.slots[1].target &&
        next[2] === scenario.slots[2].target;

      if (isCorrectEquation) {
        setIsAssembled(true);
        sounds.streak();
        narrate([{ text: "Case equation assembled perfectly! Now solve for x to crack the case!", style: 'celebration' }]);
      } else {
        sounds.wrong();
        narrate([{ text: "Check your phrase chunks carefully! Re-read the scenario clues.", style: 'encouragement' }]);
      }
    }
  }

  function handleSolveSelect(val) {
    setSolvedX(val);
    if (val === scenario.correctX) {
      setStationSuccess(true);
      sounds.badge();
      narrate([{ text: "Case cracked! You built the equation and solved for x accurately!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "Not quite — use the balance method to isolate x step by step!", style: 'encouragement' }]);
    }
  }

  function handleResetSlots() {
    setPlacedSlots([null, null, null]);
    setIsAssembled(false);
    setSolvedX(null);
    setStationSuccess(false);
    sounds.click();
  }

  function nextCase() {
    stopAll();
    const next = (caseIdx + 1) % CASE_SCENARIOS.length;
    setCaseIdx(next);
    setPlacedSlots([null, null, null]);
    setIsAssembled(false);
    setSolvedX(null);
    setStationSuccess(false);
  }

  const currentEquationPreview = `${placedSlots[0] || '___'} ${placedSlots[1] || '___'} ${placedSlots[2] || '___'}`;

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">📁 Station C: Build the Case File</h3>
        <div className="station-target-box">
          <span className="station-target-label">Case:</span>
          <span className="station-target-num">{scenario.title.split(' ')[1]}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Word Problem Clue Dossier & Slot Builder */}
        <div className="station-col-left">
          {/* Dossier Card */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>📜</span>
              <span style={{ color: '#f59e0b', fontWeight: 800, fontSize: '0.92rem' }}>
                {scenario.title}
              </span>
            </div>
            <p style={{ color: '#ffffff', fontSize: '0.92rem', lineHeight: 1.4, margin: '2px 0' }}>
              {scenario.story}
            </p>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.1)',
                padding: '4px 10px',
                borderRadius: '6px',
                width: 'fit-content',
              }}
            >
              {scenario.letStatement}
            </div>
          </div>

          {/* Running Equation Readout */}
          <div
            style={{
              background: '#020617',
              border: `2px solid ${isAssembled ? '#22c55e' : '#3b82f6'}`,
              borderRadius: '12px',
              padding: '10px 14px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '0.76rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '2px' }}>
              Your Assembled Equation So Far:
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.35rem', color: isAssembled ? '#4ade80' : '#fbbf24' }}>
              {currentEquationPreview}
            </div>
          </div>

          {/* Slot Placement Tiles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scenario.slots.map((slot, sIdx) => (
              <div
                key={sIdx}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', minWidth: '95px' }}>
                  Slot {sIdx + 1}: {slot.name}
                </span>

                <div style={{ display: 'flex', gap: '6px', flex: 1, justifyContent: 'flex-end' }}>
                  {slot.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`btn btn-sm ${placedSlots[sIdx] === opt ? (isAssembled ? 'btn-green' : 'btn-primary') : 'btn-outline'}`}
                      style={{ padding: '3px 12px', minHeight: '30px', fontFamily: 'monospace', fontWeight: 800 }}
                      onClick={() => handleSlotSelect(sIdx, opt)}
                      disabled={isAssembled}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-outline btn-sm" onClick={handleResetSlots} disabled={!placedSlots.some(Boolean)}>
              🔄 Reset Slots
            </button>
            <button className="btn btn-outline btn-sm" onClick={nextCase}>
              Next Scenario ➔
            </button>
          </div>
        </div>

        {/* Right Column: Step 2 Solving & Completion Gate */}
        <div className="station-col-right">
          {!isAssembled ? (
            <div className="station-guide-card" style={{ height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '2.2rem' }}>🧩</span>
                <h4 style={{ fontFamily: 'var(--font-display)', color: '#f59e0b', fontSize: '1.1rem', margin: 0 }}>
                  Composite Equation Builder
                </h4>
                <p className="station-guide-text" style={{ textAlign: 'left', lineHeight: 1.45 }}>
                  Every word problem is cracked in two steps:
                  <br /><br />
                  <strong>1. Build the Equation:</strong> Tap the correct clue chunks into the 3 slots to translate the word problem into symbols.
                  <br /><br />
                  <strong>2. Solve for x:</strong> Once assembled, balance both sides to calculate the unknown!
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1.5px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '10px',
                  padding: '10px',
                  width: '100%',
                }}
              >
                <span style={{ fontSize: '0.84rem', color: '#e0f2fe', fontWeight: 600 }}>
                  Select one token for each of the 3 slots to construct the equation!
                </span>
              </div>
            </div>
          ) : !stationSuccess ? (
            /* Phase 2: Solve the assembled equation */
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(34, 197, 94, 0.4)',
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
                  <span style={{ fontSize: '1.4rem' }}>⚡</span>
                  <span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.98rem' }}>
                    Step 2: Solve the Assembled Equation!
                  </span>
                </div>

                <div
                  style={{
                    background: '#020617',
                    border: '1.5px solid #22c55e',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    color: '#86efac',
                    textAlign: 'center',
                    marginBottom: '12px',
                  }}
                >
                  {scenario.expectedEq}
                </div>

                <p style={{ color: '#ffffff', fontSize: '0.92rem', fontWeight: 600, margin: '6px 0 12px' }}>
                  Using the balance method, what is the value of <strong>x</strong>?
                </p>

                {/* Solve options */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {scenario.solveOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      className={`btn btn-sm ${solvedX === opt ? (opt === scenario.correctX ? 'btn-green' : 'btn-outline') : 'btn-outline'}`}
                      style={{
                        padding: '10px 0',
                        fontSize: '1.05rem',
                        fontWeight: 900,
                        fontFamily: 'monospace',
                        borderColor: solvedX === opt && opt !== scenario.correctX ? '#ef4444' : undefined,
                      }}
                      onClick={() => handleSolveSelect(opt)}
                    >
                      x = {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
                Hint: Subtract the constant, then divide by the coefficient!
              </div>
            </div>
          ) : (
            /* Station Success */
            <div className="station-success anim-bounce-in" style={{ height: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="success-icon">🎖️</span>
                <p className="station-success-msg">
                  <strong>Case File Successfully Built &amp; Solved!</strong>
                  <br />
                  You mastered translating scenarios into equations and finding the exact solution!
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
                  Worked Steps:
                </div>
                <div style={{ fontFamily: 'monospace', color: '#ffffff', fontSize: '0.92rem' }}>
                  {scenario.solveSteps} ✓
                </div>
              </div>

              <div className="station-success-actions">
                <button className="btn btn-primary" onClick={nextCase}>
                  Try Another Case
                </button>
                <button className="btn btn-green" onClick={onComplete}>
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
