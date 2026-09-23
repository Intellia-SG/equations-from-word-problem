// src/components/simulations/CrackTheCombination.jsx
// Station B: Build-to-Target Challenge — Crack the Combination
// Implements TRD §6 specifications:
// - A slider representing the value of x with keyboard +/- steppers
// - Live-computed readout of expression value vs target total like a combination lock
// - Unlocking the safe unlocks the completion CTA

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const COMBINATION_ROUNDS = [
  {
    id: 0,
    title: 'The Evidence Vault',
    target: 29,
    exprStr: '4x + 5',
    type: 'linear',
    evaluate: (x) => 4 * x + 5,
    explain: (x) => `4(${x}) + 5 = ${4 * x} + 5 = ${4 * x + 5}`,
    correctX: 6,
    minX: 1,
    maxX: 12,
  },
  {
    id: 1,
    title: 'The Secret Ledger',
    target: 28,
    exprStr: '2(x + 5)',
    type: 'bracket',
    evaluate: (x) => 2 * (x + 5),
    explain: (x) => `2(${x} + 5) = 2(${x + 5}) = ${2 * (x + 5)}`,
    correctX: 9,
    minX: 1,
    maxX: 14,
  },
  {
    id: 2,
    title: 'The Mastermind Safe',
    target: 38,
    exprStr: '5x − 7',
    type: 'subtract',
    evaluate: (x) => 5 * x - 7,
    explain: (x) => `5(${x}) − 7 = ${5 * x} − 7 = ${5 * x - 7}`,
    correctX: 9,
    minX: 1,
    maxX: 15,
  },
];

export default function CrackTheCombination({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [roundIdx, setRoundIdx] = useState(0);

  const round = COMBINATION_ROUNDS[roundIdx];
  const [xVal, setXVal] = useState(round.minX);
  const [unlocked, setUnlocked] = useState(false);

  const currentValue = round.evaluate(xVal);
  const isMatch = currentValue === round.target;
  const isLow = currentValue < round.target;

  function updateX(newX) {
    const clamped = Math.max(round.minX, Math.min(round.maxX, newX));
    setXVal(clamped);
    sounds.click();

    if (round.evaluate(clamped) === round.target) {
      setUnlocked(true);
      sounds.levelUp();
      narrate([{ text: "Click! The lock tumbler aligns! Safe combination unlocked!", style: 'celebration' }]);
    } else {
      setUnlocked(false);
    }
  }

  function nextRound() {
    stopAll();
    const nextIdx = (roundIdx + 1) % COMBINATION_ROUNDS.length;
    setRoundIdx(nextIdx);
    const r = COMBINATION_ROUNDS[nextIdx];
    setXVal(r.minX);
    setUnlocked(false);
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">🔓 Station B: Crack the Combination Safe</h3>
        <div className="station-target-box">
          <span className="station-target-label">Target Code:</span>
          <span className="station-target-num">{round.target}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: The Combination Lock Safe */}
        <div className="station-col-left">
          <div
            style={{
              background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 100%)',
              border: `2.5px solid ${isMatch ? '#22c55e' : '#f59e0b'}`,
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: isMatch ? '0 0 25px rgba(34, 197, 94, 0.35)' : '0 4px 15px rgba(0, 0, 0, 0.4)',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
          >
            {/* Safe Lock Dial Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.6rem' }}>{isMatch ? '🔓' : '🔒'}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc' }}>
                {round.title}
              </span>
            </div>

            {/* Expression & Target Display */}
            <div
              style={{
                background: '#020617',
                border: '2px solid #334155',
                borderRadius: '12px',
                padding: '10px 18px',
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                margin: '6px 0 14px',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Expression</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.25rem', color: '#38bdf8' }}>
                  {round.exprStr}
                </div>
              </div>

              <span style={{ fontSize: '1.4rem', color: '#64748b' }}>➔</span>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase' }}>Target Code</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.25rem', color: '#fbbf24' }}>
                  {round.target}
                </div>
              </div>
            </div>

            {/* Live Substitution Calculation */}
            <div
              style={{
                background: isMatch ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: `1.5px solid ${isMatch ? '#22c55e' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '10px',
                padding: '8px 14px',
                width: '100%',
                textAlign: 'center',
                fontFamily: 'monospace',
                fontSize: '0.98rem',
                color: isMatch ? '#86efac' : '#e2e8f0',
                marginBottom: '14px',
              }}
            >
              {round.explain(xVal)} = <strong style={{ fontSize: '1.15rem', color: isMatch ? '#4ade80' : '#f59e0b' }}>{currentValue}</strong>
            </div>

            {/* Match Status Badge */}
            <div
              style={{
                color: isMatch ? '#4ade80' : isLow ? '#38bdf8' : '#f87171',
                fontWeight: 800,
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{isMatch ? '✨ CODE MATCH! SAFE UNLOCKED!' : isLow ? '🔼 Too Low — Increase x' : '🔽 Too High — Decrease x'}</span>
            </div>
          </div>

          {/* Slider and Stepper Controls */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#cbd5e1' }}>
                Set Unknown Variable (x):
              </span>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  color: '#fbbf24',
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '2px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #f59e0b',
                }}
              >
                x = {xVal}
              </span>
            </div>

            {/* Stepper + Slider Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-outline btn-sm"
                style={{ minWidth: '40px', minHeight: '36px', fontSize: '1.2rem', fontWeight: 900 }}
                onClick={() => updateX(xVal - 1)}
                disabled={xVal <= round.minX}
                aria-label="Decrease x"
              >
                −
              </button>

              <input
                type="range"
                min={round.minX}
                max={round.maxX}
                value={xVal}
                onChange={(e) => updateX(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#f59e0b', cursor: 'pointer', height: '8px' }}
                aria-label="Adjust x value slider"
              />

              <button
                type="button"
                className="btn-outline btn-sm"
                style={{ minWidth: '40px', minHeight: '36px', fontSize: '1.2rem', fontWeight: 900 }}
                onClick={() => updateX(xVal + 1)}
                disabled={xVal >= round.maxX}
                aria-label="Increase x"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Mathematical Verification & Station Completion */}
        <div className="station-col-right">
          {unlocked ? (
            <div className="station-success anim-bounce-in" style={{ height: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="success-icon">🔓</span>
                <p className="station-success-msg">
                  <strong>Vault Code Cracked!</strong>
                  <br />
                  Setting <strong>x = {xVal}</strong> exactly satisfies the equation <strong>{round.exprStr} = {round.target}</strong>!
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
                <div style={{ color: '#86efac', fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px' }}>
                  Substitution Check Confirmed:
                </div>
                <div style={{ fontFamily: 'monospace', color: '#ffffff', fontSize: '0.92rem' }}>
                  {round.explain(xVal)} ✓
                </div>
              </div>

              <div className="station-success-actions">
                <button className="btn-primary" onClick={nextRound}>
                  Try Next Safe
                </button>
                <button className="btn-green" onClick={onComplete}>
                  Complete Station ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="station-guide-card" style={{ height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontSize: '2.2rem' }}>🕵️</span>
                <h4 style={{ fontFamily: 'var(--font-display)', color: '#f59e0b', fontSize: '1.1rem', margin: 0 }}>
                  Build-to-Target Investigation
                </h4>
                <p className="station-guide-text" style={{ textAlign: 'left', lineHeight: 1.45 }}>
                  A linear equation is a challenge: find the single number <strong>x</strong> that makes the expression match the target value!
                  <br /><br />
                  • Slide or step <strong>x</strong> to see how the expression evaluates in real-time.
                  <br />
                  • Watch how multiplying or adding shifts the total closer to <strong>{round.target}</strong>.
                </p>
              </div>

              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1.5px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  padding: '10px',
                  width: '100%',
                }}
              >
                <span style={{ fontSize: '0.85rem', color: '#fde68a', fontWeight: 700 }}>
                  💡 Detective Tip: If {currentValue} is too {isLow ? 'low' : 'high'}, try {isLow ? 'increasing' : 'decreasing'} x!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
