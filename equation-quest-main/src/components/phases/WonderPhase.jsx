// src/components/phases/WonderPhase.jsx
import React, { useEffect } from 'react';
import './WonderPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { useAudio } from '../../hooks/useAudio.js';
import { wonderNarration } from '../../utils/narration.js';

const PARTICLES = ['🔍', '⚖️', '🕵️', '🥭', 'x', '=', '➕', '➖', '🦊', '💡', '📜', '🎯'];

export default function WonderPhase({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);

  useEffect(() => {
    const segs = wonderNarration();
    narrate(segs);
    return () => stopAll();
  }, [narrate, stopAll]);

  function handleInvestigate() {
    stopAll();
    dispatch({ type: 'COMPLETE_PHASE', payload: 'wonder' });
    dispatch({ type: 'SET_PHASE', payload: 'story' });
  }

  return (
    <div className="wonder-wrap">
      {/* Floating particles */}
      <div className="wonder-particles" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="wonder-particle"
            style={{
              left: `${5 + (i * 8.5) % 90}%`,
              top: `${5 + (i * 7.5) % 80}%`,
              animationDelay: `${i * 0.5}s`,
              fontSize: `${1.1 + (i % 3) * 0.4}rem`,
            }}
          >
            {p}
          </span>
        ))}
      </div>

      <div className="wonder-content anim-slide-up">
        {/* Main hook card */}
        <div className="wonder-card glass-card">
          <div className="wonder-stadium-icon" aria-hidden="true">🥭</div>
          <h1 className="wonder-title headline">The Case of the Missing Mangoes!</h1>

          <div className="wonder-number-display">
            <span className="number-display wonder-num">x − 18 = 14 ➔ What was x?</span>
          </div>

          <div className="wonder-question-card">
            <p className="body-text wonder-q">
              A shopkeeper counted his mangoes this morning. Later in the day, <strong className="wonder-em">18 mangoes were sold</strong>…
            </p>
            <p className="body-text wonder-q">
              Now there are <strong className="wonder-em">14 left</strong> — but he cannot remember how many he started with. <span className="wonder-highlight">Can you help Detective HQ find the missing number?</span>
            </p>
          </div>

          {/* Mascot */}
          <div className="wonder-mascot-row">
            <Mascot mood="curious" message="Every mystery has an unknown quantity. In algebra, we call it x! Let's crack this case together!" size="sm" />
          </div>

          <button className="btn btn-primary btn-lg wonder-cta" onClick={handleInvestigate}>
            Start Investigation 🔍
          </bu