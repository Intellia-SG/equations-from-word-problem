// src/components/simulations/BalanceScaleLab.jsx
// Station A: Concept Discovery Lab — The Balance Scale
// Implements TRD §6 specifications:
// - Live SVG balance that tips dynamically if pans become unequal
// - Operation controls (+, -, *, /) on left, right, or both pans
// - Confirmation question completion gate

import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const INITIAL_PROBLEMS = [
  { id: 0, xVal: 7, leftConstant: 5, target: 12, equation: 'x + 5 = 12' },
  { id: 1, xVal: 9, leftConstant: 3, target: 12, equation: 'x + 3 = 12' },
  { id: 2, xVal: 6, leftConstant: 8, target: 14, equation: 'x + 8 = 14' },
];

export default function BalanceScaleLab({ onComplete, audioEnabled }) {
  const { narrate, stopAll, sounds } = useAudio(audioEnabled);
  const [probIdx, setProbIdx] = useState(0);

  const prob = INITIAL_PROBLEMS[probIdx];
  const [leftWeights, setLeftWeights] = useState(prob.leftConstant);
  const [rightWeights, setRightWeights] = useState(prob.target);
  const [xValue] = useState(prob.xVal);
  const [operationsUsed, setOperationsUsed] = useState(new Set());
  const [selectedOp, setSelectedOp] = useState('sub');
  const [selectedVal, setSelectedVal] = useState(prob.leftConstant);

  // Confirmation question state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [stationSuccess, setStationSuccess] = useState(false);

  // Left total & Right total
  const leftTotal = xValue + leftWeights;
  const rightTotal = rightWeights;
  const diff = rightTotal - leftTotal;
  // Tilt angle clamped between -16 and 16 degrees
  const tiltDeg = Math.max(-16, Math.min(16, diff * 2));
  const isBalanced = leftTotal === rightTotal;
  const isIsolated = leftWeights === 0 && isBalanced;

  function handleApply(targetSide) {
    if (stationSuccess) return;
    const v = Number(selectedVal);
    let nextLeft = leftWeights;
    let nextRight = rightWeights;

    if (selectedOp === 'add') {
      if (targetSide === 'left' || targetSide === 'both') nextLeft += v;
      if (targetSide === 'right' || targetSide === 'both') nextRight += v;
    } else if (selectedOp === 'sub') {
      if (targetSide === 'left' || targetSide === 'both') nextLeft = Math.max(-10, nextLeft - v);
      if (targetSide === 'right' || targetSide === 'both') nextRight = Math.max(0, nextRight - v);
    } else if (selectedOp === 'mul') {
      if (targetSide === 'left' || targetSide === 'both') nextLeft = nextLeft * v;
      if (targetSide === 'right' || targetSide === 'both') nextRight = nextRight * v;
    }

    setLeftWeights(nextLeft);
    setRightWeights(nextRight);

    const nextOps = new Set(operationsUsed);
    nextOps.add(selectedOp);
    setOperationsUsed(nextOps);

    // Audio / sound feedback
    sounds.click();
    if (targetSide === 'both') {
      sounds.streak();
    }

    // Check if student isolated x or explored enough
    if (nextLeft === 0 && xValue === nextRight) {
      sounds.correct();
      narrate([{ text: "Brilliant! You isolated x by keeping both sides balanced!", style: 'celebration' }]);
    }
  }

  function handleReset() {
    setLeftWeights(prob.leftConstant);
    setRightWeights(prob.target);
    setSelectedVal(prob.leftConstant);
    sounds.click();
  }

  function nextProblem() {
    stopAll();
    const nextIdx = (probIdx + 1) % INITIAL_PROBLEMS.length;
    setProbIdx(nextIdx);
    const p = INITIAL_PROBLEMS[nextIdx];
    setLeftWeights(p.leftConstant);
    setRightWeights(p.target);
    setSelectedVal(p.leftConstant);
    setQuizAnswer(null);
    setStationSuccess(false);
  }

  function handleQuizSelect(optionIdx) {
    setQuizAnswer(optionIdx);
    if (optionIdx === 0) {
      // Correct!
      sounds.badge();
      setStationSuccess(true);
      narrate([{ text: "Spot on! In the balance method, whatever you do to one side, you must mirror on the other!", style: 'celebration' }]);
    } else {
      sounds.wrong();
      narrate([{ text: "Remember the golden rule: whatever you do to one side, you must do to the other!", style: 'encouragement' }]);
    }
  }

  return (
    <div className="station-wrap">
      {/* Header */}
      <div className="station-header">
        <h3 className="station-title">⚖️ Station A: The Balance Scale Lab</h3>
        <div className="station-target-box">
          <span className="station-target-label">Case File:</span>
          <span className="station-target-num">{prob.equation}</span>
        </div>
      </div>

      <div className="station-grid-2col">
        {/* Left Column: Interactive Balance Scale & Operation Controls */}
        <div className="station-col-left">
          {/* Interactive SVG Scale */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: `2px solid ${isBalanced ? 'rgba(45, 212, 191, 0.5)' : 'rgba(239, 68, 68, 0.4)'}`,
              borderRadius: '16px',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              boxShadow: isBalanced ? '0 0 20px rgba(45, 212, 191, 0.15)' : 'none',
              transition: 'border-color 0.3s ease',
            }}
          >
            {/* Status indicator badge */}
            <div
              style={{
                background: isBalanced ? 'rgba(45, 212, 191, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                border: `1.5px solid ${isBalanced ? '#2dd4bf' : '#ef4444'}`,
                color: isBalanced ? '#5eead4' : '#fca5a5',
                borderRadius: '20px',
                padding: '3px 12px',
                fontSize: '0.82rem',
                fontWeight: 800,
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{isBalanced ? '⚖️ Balanced (Equal)' : diff > 0 ? '⬇️ Right Pan Heavier' : '⬇️ Left Pan Heavier'}</span>
            </div>

            {/* SVG Visual Scale */}
            <svg
              viewBox="0 0 320 130"
              style={{ width: '100%', height: '115px' }}
              aria-label={`Interactive scale tilted by ${tiltDeg} degrees`}
            >
              {/* Stand / Fulcrum */}
              <polygon points="160,65 148,115 172,115" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <line x1="125" y1="115" x2="195" y2="115" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
              <circle cx="160" cy="65" r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

              {/* Tilting Group */}
              <g style={{ transform: `rotate(${tiltDeg}deg)`, transformOrigin: '160px 65px', transition: 'transform 0.4s ease-out' }}>
                {/* Balance Beam */}
                <line x1="40" y1="65" x2="280" y2="65" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />

                {/* Left Pan Strings & Plate */}
                <line x1="50" y1="65" x2="30" y2="98" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="50" y1="65" x2="70" y2="98" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M 22,98 Q 50,112 78,98 Z" fill="#2dd4bf" fillOpacity="0.3" stroke="#2dd4bf" strokeWidth="2.5" />

                {/* Right Pan Strings & Plate */}
                <line x1="270" y1="65" x2="250" y2="98" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="270" y1="65" x2="290" y2="98" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M 242,98 Q 270,112 298,98 Z" fill="#2dd4bf" fillOpacity="0.3" stroke="#2dd4bf" strokeWidth="2.5" />

                {/* Left items label */}
                <text x="50" y="93" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="13" fontFamily="monospace">
                  x {leftWeights >= 0 ? `+ ${leftWeights}` : `- ${Math.abs(leftWeights)}`}
                </text>

                {/* Right items label */}
                <text x="270" y="93" textAnchor="middle" fill="#fde047" fontWeight="900" fontSize="13" fontFamily="monospace">
                  {rightWeights}
                </text>
              </g>
            </svg>

            {/* Readout */}
            <div style={{ display: 'flex', gap: '14px', fontSize: '0.9rem', fontWeight: 700, marginTop: '2px' }}>
              <span style={{ color: '#38bdf8' }}>Left: x + {leftWeights}</span>
              <span style={{ color: '#94a3b8' }}>vs</span>
              <span style={{ color: '#f59e0b' }}>Right: {rightWeights}</span>
              {isIsolated && <span style={{ color: '#4ade80', fontWeight: 900 }}>➔ x = {xValue}! 🎉</span>}
            </div>
          </div>

          {/* Operation Builder Controls */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.6)',
              borderRadius: '12px',
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#cbd5e1' }}>
                1. Select Operation &amp; Amount:
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`btn-sm ${selectedOp === 'sub' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '2px 10px', minHeight: '28px' }}
                  onClick={() => setSelectedOp('sub')}
                >
                  Subtract (−)
                </button>
                <button
                  type="button"
                  className={`btn-sm ${selectedOp === 'add' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '2px 10px', minHeight: '28px' }}
                  onClick={() => setSelectedOp('add')}
                >
                  Add (+)
                </button>
              </div>
            </div>

            {/* Amount Buttons */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginRight: '4px' }}>Amount:</span>
              {[1, 2, 3, 5, 8].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`btn-sm ${selectedVal === amt ? 'btn-green' : 'btn-outline'}`}
                  style={{ flex: 1, minHeight: '28px', padding: '2px 0' }}
                  onClick={() => setSelectedVal(amt)}
                >
                  {amt}
                </button>
              ))}
            </div>

            {/* 2. Choose Where to Apply */}
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#cbd5e1', marginTop: '2px' }}>
              2. Where to Apply?
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr 1fr', gap: '6px' }}>
              <button
                type="button"
                className="btn-outline btn-sm"
                style={{ fontSize: '0.82rem', padding: '6px 4px' }}
                onClick={() => handleApply('left')}
                title="Only apply to left pan"
              >
                Left Pan Only
              </button>
              <button
                type="button"
                className="btn-primary btn-sm"
                style={{ fontSize: '0.86rem', fontWeight: 800, padding: '6px 4px', borderColor: '#f59e0b' }}
                onClick={() => handleApply('both')}
                title="Balance Method: Apply to both pans!"
              >
                ⚖️ Both Pans!
              </button>
              <button
                type="button"
                className="btn-outline btn-sm"
                style={{ fontSize: '0.82rem', padding: '6px 4px' }}
                onClick={() => handleApply('right')}
                title="Only apply to right pan"
              >
                Right Pan Only
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn-outline btn-sm" onClick={handleReset}>
              🔄 Reset Scale
            </button>
            <button className="btn-outline btn-sm" onClick={nextProblem}>
              Next Equation ➔
            </button>
          </div>
        </div>

        {/* Right Column: Exploration Guide / Confirmation Challenge */}
        <div className="station-col-right">
          {!showQuiz && !stationSuccess ? (
            <div className="station-guide-card" style={{ height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>⚖️</span>
                <h4 style={{ fontFamily: 'var(--font-display)', color: '#f59e0b', fontSize: '1.1rem', margin: 0 }}>
                  The Balance Rule of Algebra
                </h4>
                <p className="station-guide-text" style={{ textAlign: 'left', lineHeight: 1.45 }}>
                  Think of the equals sign <strong style={{ color: '#f59e0b' }}>(=)</strong> as the pivot of a real scale.
                  <br /><br />
                  • If you change only <strong>one side</strong>, the scale tips over!
                  <br />
                  • To isolate <strong>x</strong> while keeping the equation true, perform the <strong>exact same inverse operation on both pans</strong>.
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
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>
                  🎯 Station Discovery Goal:
                </div>
                <div style={{ fontSize: '0.82rem', color: '#e0f2fe' }}>
                  Explore how adding or removing weights tips the scale. When you feel ready, take the quick detective confirmation check!
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', padding: '10px 0', fontWeight: 800 }}
                onClick={() => setShowQuiz(true)}
              >
                Check My Understanding 🔍
              </button>
            </div>
          ) : showQuiz && !stationSuccess ? (
            /* Confirmation Challenge Question */
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '16px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                height: '100%',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>🕵️</span>
                  <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.98rem' }}>
                    Detective Confirmation Question:
                  </span>
                </div>
                <p style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4 }}>
                  If you <strong>subtract {prob.leftConstant}</strong> from the left pan to isolate x, what <strong>must</strong> you do to the right pan to keep the scale balanced?
                </p>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  `Subtract ${prob.leftConstant} from the right pan`,
                  `Add ${prob.leftConstant} to the right pan`,
                  `Do nothing to the right pan`,
                  `Multiply the right pan by ${prob.leftConstant}`,
                ].map((optText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`btn-sm ${quizAnswer === idx ? (idx === 0 ? 'btn-green' : 'btn-outline') : 'btn-outline'}`}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      borderColor: quizAnswer === idx && idx !== 0 ? '#ef4444' : undefined,
                    }}
                    onClick={() => handleQuizSelect(idx)}
                  >
                    {String.fromCharCode(65 + idx)}) {optText}
                  </button>
                ))}
              </div>

              <button className="btn-outline btn-sm" onClick={() => setShowQuiz(false)}>
                ← Back to Exploration
              </button>
            </div>
          ) : (
            /* Station Success */
            <div className="station-success anim-bounce-in" style={{ height: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="success-icon">🏆</span>
                <p className="station-success-msg">
                  <strong>Balance Mastery Proven!</strong>
                  <br />
                  You proved that linear equations stay true only when operations are mirrored across both sides!
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
                <span style={{ color: '#86efac', fontWeight: 800, fontSize: '0.95rem' }}>
                  The Balance Method: Whatever you do to one side, you must do to the other side.
                </span>
              </div>

              <div className="station-success-actions">
                <button className="btn-primary" onClick={nextProblem}>
                  Try Another Equation
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
