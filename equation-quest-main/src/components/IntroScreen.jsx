// src/components/IntroScreen.jsx
import React from 'react';
import './IntroScreen.css';
import { generateSessionQuestions } from '../utils/shuffle.js';
import questionBank from '../data/questionBank.js';

import { useAudio } from '../hooks/useAudio.js';
import { homeIntroNarration } from '../utils/narration.js';

const JOURNEY = [
  { num: '01', icon: '🔍', label: 'Wonder',   desc: 'The Missing Number' },
  { num: '02', icon: '📖', label: 'Story',    desc: 'Wei Jie & Deepa\'s Case' },
  { num: '03', icon: '🧪', label: 'Simulate', desc: '4 Forensics Labs' },
  { num: '04', icon: '🎮', label: 'Practice', desc: '10 Worlds & Bosses' },
  { num: '05', icon: '📓', label: 'Reflect',  desc: 'Review & Scorecard' },
];

export default function IntroScreen({ state, dispatch }) {
  const { narrate, stopAll } = useAudio(state?.audioEnabled ?? true);
  const hasSaved = state?.phaseComplete && Object.values(state.phaseComplete).some(Boolean);

  function startFresh() {
    stopAll();
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'wonder' });
  }

  function resumeSession() {
    stopAll();
    dispatch({ type: 'SET_PHASE', payload: state.savedPhase || 'wonder' });
  }

  function speakMilo() {
    stopAll();
    narrate(homeIntroNarration());
  }

  return (
    <div className="intro-wrap">
      {/* Top Badge */}
      <div className="intro-top-badge">
        ✨ Curriculum · Singapore MOE Sec 1 · Equations from Word Problems
      </div>

      {/* Main Title */}
      <h1 className="intro-title">
        <span className="text-orange">Equation</span> <span className="text-white">Quest</span>
      </h1>
      <h2 className="intro-subtitle">EquationQuest · Master Linear Equations, Balancing &amp; Word Problems</h2>

      {/* Mascot Row */}
      <div
        className="intro-mascot-row"
        onClick={speakMilo}
        style={{ cursor: 'pointer' }}
        title="Click to hear Milo speak! 🎙️"
        role="button"
        tabIndex={0}
      >
        <div className="intro-mascot-circle">🦊</div>
        <div className="intro-speech-bubble">
          Hi! I'm Milo the Fox. Ready to investigate cases,<br />name the unknown, and master the balance method? 🔍⚖️
          <span style={{ marginLeft: '8px', fontSize: '0.9rem', opacity: 0.8 }}>🔊</span>
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn how to translate word problems into linear equations, balance both sides to isolate the unknown, and solve cases like a chief detective!
      </p>

      {/* Journey Card */}
      <div className="journey-card">
        <div className="journey-card-title">YOUR LEARNING JOURNEY · CLICK ANY PHASE TO START</div>

        <div className="journey-steps-container">
          <div className="journey-row top-row">
            {JOURNEY.slice(0, 3).map((j, i) => (
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
                <span className={`journey-arrow ${i === 2 ? 'fade-arrow' : ''}`}>→</span>
              </React.Fragment>
            ))}
          </div>

          <div className="journey-row bottom-row">
            {JOURNEY.slice(3, 5).map((j, i) => (
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
                {i === 0 && <span className="journey-arrow">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="intro-ctas">
        <button className="btn btn-primary btn-lg intro-cta-main" onClick={startFresh}>
          🚀 Begin Your Journey!
        </button>
        {hasSaved && (
          <button className="btn btn-outline" onClick={resumeSession} style={{ marginTop: '6px' }}>
            ↩ Resume Session
          </button>
        )}
      </div>

      {/* Bottom Cards */}
      <div className="intro-bottom-cards">
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#ff6b6b' }}>🎯</div>
          <div>100 Questions</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#feca57' }}>⚖️</div>
          <div>Balance Method</div>
        </div>
        <div className="bottom-card">
          <div className="bottom-card-icon" style={{ color: '#66bb6a' }}>✨</div>
          <div>Badges &amp; XP</div>
        </div>
      </div>
    </div>
  );
}
