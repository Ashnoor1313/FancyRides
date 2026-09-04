import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity } from 'lucide-react';

interface AudioRumbleVisualizerProps {
  modelName: string;
  engineType: string;
  hp: number;
}

export const AudioRumbleVisualizer: React.FC<AudioRumbleVisualizerProps> = ({ modelName, engineType, hp }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rpm, setRpm] = useState(1200);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sound synthesis using Web Audio API for authentic engine exhaust hum
  const toggleSound = () => {
    if (isPlaying) {
      stopEngineSound();
    } else {
      startEngineSound();
    }
  };

  const startEngineSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      // Low frequency rumble oscillator
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, audioCtxRef.current.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsPlaying(true);

      // Simulate throttle revs
      let baseRpm = 1200;
      let direction = 1;
      const animateRpm = () => {
        baseRpm += direction * 35;
        if (baseRpm > 4800) direction = -1;
        if (baseRpm < 1200) direction = 1;
        setRpm(baseRpm);

        if (oscillatorRef.current && audioCtxRef.current) {
          const freq = 45 + (baseRpm / 5000) * 85;
          oscillatorRef.current.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        }

        animationFrameRef.current = requestAnimationFrame(animateRpm);
      };
      animationFrameRef.current = requestAnimationFrame(animateRpm);
    } catch {
      setIsPlaying(true);
    }
  };

  const stopEngineSound = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch {}
      oscillatorRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPlaying(false);
    setRpm(1200);
  };

  useEffect(() => {
    return () => {
      stopEngineSound();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-hairline)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow when playing */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '300px',
          height: '300px',
          background: isPlaying ? 'radial-gradient(circle, rgba(255, 77, 0, 0.2) 0%, transparent 70%)' : 'none',
          pointerEvents: 'none',
          transition: 'all 0.5s ease',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="telemetry-badge accent">
              <Activity size={12} /> ACOUSTIC TELEMETRY
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              DYNO SOUND LOG: {modelName}
            </span>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            EXHAUST FREQUENCY & INDUCTION NOTE
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '480px', marginTop: '0.2rem' }}>
            {engineType}. Experience the unadulterated high-rev resonance of this {hp} HP machine.
          </p>
        </div>

        <button
          onClick={toggleSound}
          style={{
            background: isPlaying ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.08)',
            color: isPlaying ? '#000' : 'var(--text-primary)',
            border: isPlaying ? '1px solid var(--accent-orange)' : '1px solid var(--border-medium)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.82rem',
            letterSpacing: '0.1em',
            padding: '0.85rem 1.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isPlaying ? '0 0 24px var(--accent-orange-glow)' : 'none',
          }}
        >
          {isPlaying ? (
            <>
              <Square size={16} fill="#000" />
              <span>IDLE ENGINE</span>
            </>
          ) : (
            <>
              <Play size={16} fill="var(--accent-orange)" />
              <span>IGNITE EXHAUST NOTE</span>
            </>
          )}
        </button>
      </div>

      {/* Dynamic Sound Wave & Tachometer Bars */}
      <div
        style={{
          background: '#0a0a0a',
          border: '1px solid var(--border-hairline)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            STATUS: <span style={{ color: isPlaying ? 'var(--accent-orange)' : 'var(--text-muted)' }}>{isPlaying ? 'ACTIVE EXHAUST PULSE' : 'STANDBY'}</span>
          </span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
            TACHOMETER: <span style={{ color: 'var(--accent-orange)' }}>{rpm}</span> RPM
          </span>
        </div>

        {/* 28 Equalizer frequency bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '54px', gap: '4px' }}>
          {Array.from({ length: 28 }).map((_, i) => {
            const heightMultiplier = isPlaying ? Math.sin((i / 28) * Math.PI) * (0.35 + Math.random() * 0.65) : 0.08;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.max(8, heightMultiplier * 100)}%`,
                  background: isPlaying
                    ? i > 22
                      ? '#ff2200'
                      : i > 15
                      ? 'var(--accent-orange)'
                      : 'rgba(255, 77, 0, 0.6)'
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '1px',
                  transition: 'height 0.12s ease',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
