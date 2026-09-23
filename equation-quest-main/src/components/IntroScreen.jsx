// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'The Missing Number' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Wei Jie & Deepa\'s Case' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 Forensics Labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 Worlds & Bosses' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Review & Scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Singapore MOE Secondary 1 Mathematics · Equations from Word Problems
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Equation</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">EquationQuest · Translate Clues, Form Linear Equations &amp; Balance to Find x</h2>

      {/* Mascot Row */}
      <div className="intro-mascot-row">
        <div className="intro-mascot-circle">🦊</div>
        <div className="intro-speech-bubble">
          Hi! I'm Milo the Fox. Ready to investigate cases,<br />name the unknown, and master the balance method? 🔍⚖️
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to translate real-world mystery scenarios into linear equations in one variable, balance both sides to isolate the unknown, and verify solutions like a chief detective!
      </p>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START</div>

        <div className="journey-steps-container">
          {JOURNEY.map((j, i) => (
            <React.Fragment key={j.num}>
              <div
                className="journey-step-item clickable-step"
                onClick={() => dispatch({ type: 'SET_PHASE', payload: j.label.toLowerCase() === 'practice' ? 'play' : j.label.toLowerCase() })}
                role="button"
                tabIndex={0}
                title={`Click to open ${j.label} phase`}
              >
                <span className="journey-icon-circle">{j.icon}</span>
                <div className="journey-text-col">
                  <span className="journey-item-title">{j.label}</span>
                  <span className="journey-item-desc">{j.desc}</span>
                </div>
              </div>
              {i < JOURNEY.length - 1 && <span className="journey-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="intro-ctas">
        <button className="btn btn-primary intro-cta-main" onClick={startFresh}>
          🚀 Begin Investigation!
        </button>
        {hasSaved && (
          <button className="btn btn-outline" onClick={resumeSession}>
            ↩ Resume Session
          </button>
        )}
      </div>

      {/* Bottom Cards */}
      <div className="intro-bottom-cards">
        <div className="bottom-card">
          <span className="bottom-card-icon" style={{ color: '#ff6b6b' }}>🎯</span>
          <span className="bottom-card-text">100 Questions</span>
        </div>
        <div className="bottom-card">
          <span className="bottom-card-icon" style={{ color: '#feca57' }}>⚖️</span>
          <span className="bottom-card-text">Balance Method</span>
        </div>
        <div className="bottom-card">
          <span className="bottom-card-icon" style={{ color: '#66bb6a' }}>✨</span>
          <span className="bottom-card-text">Badges &amp; XP</span>
        </div>
      </div>
    </div>
  );
}
