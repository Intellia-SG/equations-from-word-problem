// src/components/shared/EquationVisual.jsx
// Visual component rendering algebraic representations for EquationQuest
// Supported types: 'phrase-to-expression', 'balance-diagram', 'bracket-highlight', 'fraction-bar', 'word-problem-diagram'

import React from 'react';

export default function EquationVisual({ type, data, compact = false }) {
  if (!data) return null;

  // 1. Phrase-to-Expression visual
  if (type === 'phrase-to-expression') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: compact ? '6px 14px' : '10px 18px',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1.5px solid rgba(99, 102, 241, 0.35)',
          borderRadius: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '1.2rem' }}>📜</span>
          <span style={{ color: '#c7d2fe', fontWeight: 600, fontSize: compact ? '0.9rem' : '1rem' }}>
            "{data.phrase}"
          </span>
        </div>
        <span style={{ color: '#f59e0b', fontWeight: 900 }}>➔</span>
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1.5px solid #f59e0b',
            borderRadius: '8px',
            padding: '3px 10px',
            fontFamily: 'monospace',
            fontWeight: 800,
            fontSize: compact ? '1rem' : '1.15rem',
            color: '#fbbf24',
          }}
        >
          {data.expression}
        </div>
      </div>
    );
  }

  // 2. Balance Diagram visual (SVG Scale)
  if (type === 'balance-diagram') {
    const leftText = data.lhs || 'x + a';
    const rightText = data.rhs || 'b';

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: compact ? '6px 10px' : '10px 16px',
          background: 'rgba(45, 212, 191, 0.08)',
          border: '1.5px solid rgba(45, 212, 191, 0.25)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: compact ? '320px' : '400px',
          margin: '0 auto',
        }}
      >
        <svg
          viewBox="0 0 300 110"
          style={{ width: '100%', maxHeight: compact ? '75px' : '95px' }}
          role="img"
          aria-label={`Balance scale: Left side has ${leftText}, right side has ${rightText}`}
        >
          {/* Fulcrum base */}
          <polygon points="150,55 138,98 162,98" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
          <line x1="120" y1="98" x2="180" y2="98" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />

          {/* Pivot point */}
          <circle cx="150" cy="55" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />

          {/* Balance beam */}
          <line x1="45" y1="55" x2="255" y2="55" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />

          {/* Left Pan Strings & Pan */}
          <line x1="55" y1="55" x2="35" y2="82" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="55" y1="55" x2="75" y2="82" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 30,82 Q 55,95 80,82 Z" fill="#2dd4bf" fillOpacity="0.4" stroke="#2dd4bf" strokeWidth="2" />

          {/* Right Pan Strings & Pan */}
          <line x1="245" y1="55" x2="225" y2="82" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="245" y1="55" x2="265" y2="82" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M 220,82 Q 245,95 270,82 Z" fill="#2dd4bf" fillOpacity="0.4" stroke="#2dd4bf" strokeWidth="2" />

          {/* Pan text labels */}
          <text x="55" y="76" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13" fontFamily="monospace">
            {leftText}
          </text>
          <text x="245" y="76" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="13" fontFamily="monospace">
            {rightText}
          </text>

          {/* Equals status badge */}
          <rect x="138" y="24" width="24" height="20" rx="5" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="150" y="38" textAnchor="middle" fill="#f59e0b" fontWeight="bold" fontSize="14">
            =
          </text>
        </svg>
      </div>
    );
  }

  // 3. Bracket Highlight visual
  if (type === 'bracket-highlight') {
    const a = data.a || 2;
    const b = data.b || 3;
    const isMinus = data.isMinus || false;
    const sign = isMinus ? '−' : '+';
    const c = data.c || 16;

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          padding: compact ? '6px 12px' : '8px 16px',
          background: 'rgba(155, 93, 229, 0.1)',
          border: '1.5px solid rgba(155, 93, 229, 0.35)',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: compact ? '1.1rem' : '1.25rem' }}>
          <span style={{ color: '#c084fc', fontWeight: 800 }}>{a}</span>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>(</span>
          <span style={{ color: '#38bdf8', fontWeight: 800 }}>x</span>
          <span style={{ color: '#ffffff', fontWeight: 700 }}>{sign}</span>
          <span style={{ color: '#fbbf24', fontWeight: 800 }}>{b}</span>
          <span style={{ color: '#94a3b8', fontWeight: 600 }}>)</span>
          <span style={{ color: '#f59e0b', fontWeight: 900 }}>=</span>
          <span style={{ color: '#34d399', fontWeight: 800 }}>{c}</span>
        </div>
        {data.distributedForm && (
          <div
            style={{
              fontSize: '0.88rem',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Expanded:</span>
            <span style={{ fontFamily: 'monospace', color: '#e9d5ff', fontWeight: 700 }}>
              {data.distributedForm}
            </span>
          </div>
        )}
      </div>
    );
  }

  // 4. Fraction Bar visual
  if (type === 'fraction-bar') {
    const a = data.a || 3;
    const b = data.b || 2;
    const isMinus = data.isMinus || false;
    const sign = isMinus ? '−' : '+';
    const c = data.c || 7;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: compact ? '6px 14px' : '10px 18px',
          background: 'rgba(241, 91, 181, 0.1)',
          border: '1.5px solid rgba(241, 91, 181, 0.3)',
          borderRadius: '12px',
        }}
      >
        {/* Fraction block */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: compact ? '1rem' : '1.15rem' }}>x</span>
          <div style={{ width: '28px', height: '2px', background: '#f472b6', margin: '2px 0' }} />
          <span style={{ color: '#f472b6', fontWeight: 800, fontSize: compact ? '1rem' : '1.15rem' }}>{a}</span>
        </div>

        {b !== undefined && (
          <>
            <span style={{ color: '#ffffff', fontWeight: 800, fontSize: compact ? '1rem' : '1.15rem' }}>{sign}</span>
            <span style={{ color: '#fbbf24', fontWeight: 800, fontSize: compact ? '1rem' : '1.15rem' }}>{b}</span>
          </>
        )}

        <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: compact ? '1rem' : '1.15rem' }}>=</span>
        <span style={{ color: '#34d399', fontWeight: 800, fontSize: compact ? '1rem' : '1.15rem' }}>{c}</span>
      </div>
    );
  }

  // 5. Word Problem Diagram visual (Money, Age, Perimeter, Consecutive)
  if (type === 'word-problem-diagram') {
    const pType = data.type;

    if (pType === 'money') {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: compact ? '6px 12px' : '8px 16px',
            background: 'rgba(255, 197, 61, 0.12)',
            border: '1.5px solid rgba(255, 197, 61, 0.35)',
            borderRadius: '12px',
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>🪙</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fde047' }}>
            {data.count ? `${data.count} items` : 'Case Items'} {data.extraCost ? `+ $${data.extraCost} badge` : ''} {data.total ? `➔ Total: $${data.total}` : ''}
          </span>
        </div>
      );
    }

    if (pType === 'age') {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: compact ? '6px 12px' : '8px 16px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1.5px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '12px',
          }}
        >
          <span style={{ fontSize: '1.3rem' }}>🕰️</span>
          <span style={{ color: '#e0f2fe', fontWeight: 700, fontSize: compact ? '0.9rem' : '0.98rem' }}>
            {data.youngerName} (x) + {data.olderName} = {data.sum} years
          </span>
        </div>
      );
    }

    if (pType === 'perimeter') {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: compact ? '6px 10px' : '8px 14px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1.5px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
          }}
        >
          <div
            style={{
              width: '140px',
              height: '48px',
              border: '2px dashed #4ade80',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: 'rgba(34, 197, 94, 0.08)',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#86efac', fontWeight: 700 }}>
              Perimeter = {data.perimeter} cm
            </span>
            <span style={{ position: 'absolute', top: '-14px', fontSize: '0.75rem', color: '#cbd5e1' }}>
              length: x + {data.diff}
            </span>
            <span style={{ position: 'absolute', left: '-30px', fontSize: '0.75rem', color: '#cbd5e1' }}>
              x
            </span>
          </div>
        </div>
      );
    }

    if (pType === 'consecutive') {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: compact ? '6px 12px' : '8px 16px',
            background: 'rgba(251, 99, 64, 0.1)',
            border: '1.5px solid rgba(251, 99, 64, 0.3)',
            borderRadius: '12px',
          }}
        >
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>x</span>
          <span>+</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>x + 1</span>
          <span>+</span>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>x + 2</span>
          <span>=</span>
          <span style={{ color: '#f59e0b', fontWeight: 900 }}>{data.sum}</span>
        </div>
      );
    }
  }

  return null;
}
