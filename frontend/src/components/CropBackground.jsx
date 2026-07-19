import { useEffect, useState, useRef } from 'react';

// Crop themes - each has a gradient palette + emoji particles
const CROP_THEMES = [
  {
    name: 'Wheat Fields',
    emoji: '🌾',
    particles: ['🌾', '🌾', '🌾', '🌾', '☀️', '🌿'],
    gradient: 'linear-gradient(135deg, #f5e642 0%, #e8c547 25%, #c8961e 50%, #a17a14 75%, #7a5c10 100%)',
    overlay: 'rgba(245, 220, 80, 0.12)',
    accent: '#e8c547',
  },
  {
    name: 'Rice Paddies',
    emoji: '🍚',
    particles: ['🍚', '🌿', '💧', '🌾', '🐸', '🌱'],
    gradient: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 30%, #40916c 60%, #74c69d 100%)',
    overlay: 'rgba(64, 145, 108, 0.15)',
    accent: '#74c69d',
  },
  {
    name: 'Cotton Blossoms',
    emoji: '🎀',
    particles: ['🎀', '☁️', '🤍', '🌸', '🌬️', '🌿'],
    gradient: 'linear-gradient(135deg, #e8f4f8 0%, #c8e6f0 30%, #a0d0e8 60%, #6baed6 100%)',
    overlay: 'rgba(107, 174, 214, 0.1)',
    accent: '#a0d0e8',
  },
  {
    name: 'Maize Harvest',
    emoji: '🌽',
    particles: ['🌽', '🌻', '🍂', '🌾', '🌝', '🌿'],
    gradient: 'linear-gradient(135deg, #ff8c00 0%, #ffa500 25%, #ffcc02 50%, #ffe066 75%, #fff5b1 100%)',
    overlay: 'rgba(255, 160, 0, 0.12)',
    accent: '#ffcc02',
  },
  {
    name: 'Soybean Fields',
    emoji: '🌱',
    particles: ['🌱', '🌿', '🍃', '🌾', '🦋', '🌻'],
    gradient: 'linear-gradient(135deg, #2d4a1e 0%, #3d6b2b 30%, #5a9e42 60%, #8bc34a 100%)',
    overlay: 'rgba(90, 158, 66, 0.15)',
    accent: '#8bc34a',
  },
  {
    name: 'Sugarcane Dusk',
    emoji: '🍬',
    particles: ['🍬', '🌅', '🌾', '🎋', '🌸', '✨'],
    gradient: 'linear-gradient(135deg, #6a0572 0%, #ab0096 25%, #e91e8c 50%, #ff6b6b 75%, #ffa07a 100%)',
    overlay: 'rgba(233, 30, 140, 0.08)',
    accent: '#e91e8c',
  },
  {
    name: 'Tomato Season',
    emoji: '🍅',
    particles: ['🍅', '🌿', '🍃', '☀️', '🌻', '🔴'],
    gradient: 'linear-gradient(135deg, #8b0000 0%, #c0392b 30%, #e74c3c 60%, #ff7675 100%)',
    overlay: 'rgba(231, 76, 60, 0.1)',
    accent: '#e74c3c',
  },
  {
    name: 'Groundnut Earth',
    emoji: '🥜',
    particles: ['🥜', '🌍', '🌿', '🏜️', '☀️', '🌾'],
    gradient: 'linear-gradient(135deg, #5d4037 0%, #795548 30%, #a1887f 60%, #d7ccc8 100%)',
    overlay: 'rgba(121, 85, 72, 0.12)',
    accent: '#a1887f',
  },
];

const NUM_PARTICLES = 18;

// Generate random particle positions
function generateParticles(theme) {
  return Array.from({ length: NUM_PARTICLES }, (_, i) => ({
    id: i,
    emoji: theme.particles[i % theme.particles.length],
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1.2 + Math.random() * 1.8,
    delay: Math.random() * 6,
    duration: 8 + Math.random() * 10,
    drift: (Math.random() - 0.5) * 60,
    rotate: Math.random() * 360,
  }));
}

const CropBackground = () => {
  const [themeIndex, setThemeIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [particles, setParticles] = useState(() => generateParticles(CROP_THEMES[0]));
  const timerRef = useRef(null);

  const advanceTheme = () => {
    setTransitioning(true);
    const next = (themeIndex + 1) % CROP_THEMES.length;
    setNextIndex(next);

    setTimeout(() => {
      setThemeIndex(next);
      setParticles(generateParticles(CROP_THEMES[next]));
      setTransitioning(false);
    }, 1200);
  };

  useEffect(() => {
    timerRef.current = setInterval(advanceTheme, 5000);
    return () => clearInterval(timerRef.current);
  }, [themeIndex]);

  const current = CROP_THEMES[themeIndex];
  const next = CROP_THEMES[nextIndex];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Base gradient - current theme */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: current.gradient,
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 1.2s ease-in-out',
        }}
      />

      {/* Next gradient fades in during transition */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: next.gradient,
          opacity: transitioning ? 1 : 0,
          transition: 'opacity 1.2s ease-in-out',
        }}
      />

      {/* White frosted overlay to keep UI readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(0px)',
        }}
      />

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}rem`,
            opacity: 0.35,
            animation: `floatParticle${p.id % 3} ${p.duration}s ${p.delay}s ease-in-out infinite`,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            userSelect: 'none',
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Crop theme label - bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '16px',
          background: 'rgba(0,0,0,0.12)',
          backdropFilter: 'blur(8px)',
          borderRadius: '20px',
          padding: '4px 14px',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'rgba(0,0,0,0.5)',
          letterSpacing: '0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'opacity 0.5s',
          opacity: 0.75,
        }}
      >
        <span style={{ fontSize: '1rem' }}>{current.emoji}</span>
        {current.name}
      </div>

      <style>{`
        @keyframes floatParticle0 {
          0%   { transform: translateY(0px)   rotate(0deg)  scale(1);   opacity: 0.30; }
          33%  { transform: translateY(-30px) rotate(15deg) scale(1.1); opacity: 0.45; }
          66%  { transform: translateY(-15px) rotate(-10deg) scale(0.95); opacity: 0.35; }
          100% { transform: translateY(0px)   rotate(0deg)  scale(1);   opacity: 0.30; }
        }
        @keyframes floatParticle1 {
          0%   { transform: translateY(0px)   translateX(0px)  rotate(0deg)   scale(1);    opacity: 0.30; }
          25%  { transform: translateY(-20px) translateX(20px) rotate(20deg)  scale(1.15); opacity: 0.45; }
          50%  { transform: translateY(-40px) translateX(0px)  rotate(0deg)   scale(1.05); opacity: 0.40; }
          75%  { transform: translateY(-20px) translateX(-20px) rotate(-20deg) scale(1.1); opacity: 0.35; }
          100% { transform: translateY(0px)   translateX(0px)  rotate(0deg)   scale(1);    opacity: 0.30; }
        }
        @keyframes floatParticle2 {
          0%   { transform: translateY(0px)   rotate(0deg)   scale(1);    opacity: 0.25; }
          50%  { transform: translateY(-50px) rotate(25deg)  scale(1.2);  opacity: 0.45; }
          100% { transform: translateY(0px)   rotate(0deg)   scale(1);    opacity: 0.25; }
        }
      `}</style>
    </div>
  );
};

export default CropBackground;
