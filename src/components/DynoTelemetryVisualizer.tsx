import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Zap } from 'lucide-react';

interface DynoTelemetryVisualizerProps {
  hp: number;
  torque: number;
  engineCC: number;
  modelName: string;
}

export const DynoTelemetryVisualizer: React.FC<DynoTelemetryVisualizerProps> = ({
  hp,
  torque,
  engineCC,
  modelName,
}) => {
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [currentRpm, setCurrentRpm] = useState<number>(3500);
  const [hoverRpm, setHoverRpm] = useState<number | null>(null);
  const [activeCurveTab, setActiveCurveTab] = useState<'both' | 'hp' | 'torque'>('both');
  const animationRef = useRef<number | null>(null);

  const MAX_RPM = 14500;
  const MIN_RPM = 1500;
  const PEAK_HP_RPM = 13750;
  const PEAK_TORQUE_RPM = 11000;

  // Calculate live HP and Torque based on realistic dyno curves
  const calculateOutput = (rpm: number) => {
    const norm = (rpm - MIN_RPM) / (MAX_RPM - MIN_RPM);
    
    // Torque curve: rises early, peaks around 11,000 RPM, then tapers slightly
    const tqFactor = Math.sin(norm * Math.PI * 0.85 + 0.15);
    const liveTorque = Math.round(torque * Math.max(0.4, Math.min(1.0, tqFactor * 1.04)));

    // HP = (Torque * RPM) / 5252 normalized to peak HP at 13,750
    const hpFactor = Math.pow(norm, 1.4) * (1.2 - norm * 0.25);
    const liveHp = Math.round(hp * Math.max(0.15, Math.min(1.0, hpFactor * 1.35)));

    return { liveHp, liveTorque };
  };

  // Continuous smooth dyno rev sweep loop
  useEffect(() => {
    if (!isSimulating) return;

    let rpm = currentRpm;
    let speed = 65;
    let direction = 1;

    const tick = () => {
      // Dynamic acceleration simulation
      if (direction === 1) {
        speed = 50 + Math.sin((rpm / MAX_RPM) * Math.PI) * 55;
        rpm += speed;
        if (rpm >= 14200) {
          direction = -1;
        }
      } else {
        rpm -= 180;
        if (rpm <= 3200) {
          direction = 1;
        }
      }

      setCurrentRpm(Math.round(rpm));
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSimulating]);

  const activeRpm = hoverRpm !== null ? hoverRpm : currentRpm;
  const { liveHp, liveTorque } = calculateOutput(activeRpm);

  // Generate SVG curve path points
  const width = 800;
  const height = 240;
  const paddingX = 40;
  const paddingY = 24;

  const points = 16;
  const hpPathPoints: [number, number][] = [];
  const torquePathPoints: [number, number][] = [];

  for (let i = 0; i < points; i++) {
    const rpmVal = MIN_RPM + (i / (points - 1)) * (MAX_RPM - MIN_RPM);
    const { liveHp: ptHp, liveTorque: ptTq } = calculateOutput(rpmVal);

    const x = paddingX + (i / (points - 1)) * (width - 2 * paddingX);
    const yHp = height - paddingY - (ptHp / hp) * (height - 2 * paddingY);
    const yTq = height - paddingY - (ptTq / torque) * (height - 2 * paddingY);

    hpPathPoints.push([x, yHp]);
    torquePathPoints.push([x, yTq]);
  }

  const makeSvgPath = (pts: [number, number][]) => {
    return pts.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt[0]} ${pt[1]}`;
      const prev = pts[idx - 1];
      const cpX1 = prev[0] + (pt[0] - prev[0]) * 0.45;
      const cpX2 = pt[0] - (pt[0] - prev[0]) * 0.45;
      return `${acc} C ${cpX1} ${prev[1]}, ${cpX2} ${pt[1]}, ${pt[0]} ${pt[1]}`;
    }, '');
  };

  const hpPathD = makeSvgPath(hpPathPoints);
  const torquePathD = makeSvgPath(torquePathPoints);
  const hpAreaD = `${hpPathD} L ${width - paddingX} ${height - paddingY} L ${paddingX} ${height - paddingY} Z`;

  // Active cursor X coordinate
  const currentX =
    paddingX + ((activeRpm - MIN_RPM) / (MAX_RPM - MIN_RPM)) * (width - 2 * paddingX);

  // Shift light LED states (16 LEDs)
  const totalLeds = 16;
  const ledPercent = Math.min(1, Math.max(0, (activeRpm - MIN_RPM) / (MAX_RPM - MIN_RPM)));
  const litLeds = Math.round(ledPercent * totalLeds);

  return (
    <div
      style={{
        marginTop: '3.5rem',
        background: '#090909',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-card)',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
      }}
    >
      {/* Background Ambient Grid Lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Top Header Row: Model Telemetry, Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '1.75rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isSimulating ? 'var(--accent-orange)' : '#666666',
                boxShadow: isSimulating ? '0 0 10px var(--accent-orange)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: 'var(--accent-orange)',
              }}
            >
              LIVE DYNO TELEMETRY SWEEP
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
              }}
            >
              MUSTANG CHASSIS DYNAMOMETER
            </span>
          </div>

          <h4
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#F5F5F2',
              letterSpacing: '-0.02em',
            }}
          >
            {modelName} — Power & Torque Profile
          </h4>
        </div>

        {/* Action Controls & Curve Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Curve Toggles */}
          <div style={{ display: 'flex', gap: '0.35rem', background: '#121212', padding: '0.25rem', borderRadius: '999px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            {(['both', 'hp', 'torque'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCurveTab(tab)}
                style={{
                  background: activeCurveTab === tab ? '#1A1A1A' : 'transparent',
                  border: activeCurveTab === tab ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid transparent',
                  borderRadius: '999px',
                  color: activeCurveTab === tab ? '#F5F5F2' : '#8E8E8E',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.75rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
              >
                {tab === 'both' ? 'HP & TORQUE' : tab === 'hp' ? 'POWER (HP)' : 'TORQUE (NM)'}
              </button>
            ))}
          </div>

          {/* Simulate Revs Play/Pause Button */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className="filter-pill-btn"
            style={{
              padding: '0.45rem 0.95rem',
              borderColor: isSimulating ? 'var(--accent-orange)' : undefined,
              color: isSimulating ? '#F5F5F2' : undefined,
            }}
            title={isSimulating ? 'Pause dyno animation' : 'Start live dyno rev simulation'}
          >
            {isSimulating ? <Pause size={12} color="var(--accent-orange)" /> : <Play size={12} />}
            <span style={{ fontSize: '0.68rem' }}>{isSimulating ? 'SWEEPING' : 'SWEEP DYNO'}</span>
          </button>
        </div>
      </div>

      {/* Formula 1 / MotoGP Style Shift-Light LED Ribbon */}
      <div
        style={{
          background: '#0D0D0D',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#8E8E8E', letterSpacing: '0.1em' }}>
          SHIFT LIGHTS
        </span>

        {/* 16 LED Indicator Array */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'center' }}>
          {Array.from({ length: totalLeds }).map((_, i) => {
            const isLit = i < litLeds;
            let activeColor = '#00FF66';
            if (i >= 6 && i < 11) activeColor = '#FFB703';
            if (i >= 11 && i < 14) activeColor = '#FF3B30';
            if (i >= 14) activeColor = '#00E5FF';

            const isRedlineFlashing = i >= 14 && isLit;

            return (
              <div
                key={i}
                style={{
                  width: '14px',
                  height: '8px',
                  borderRadius: '2px',
                  background: isLit ? activeColor : '#1E1E1E',
                  boxShadow: isLit ? `0 0 10px ${activeColor}` : 'none',
                  opacity: isLit ? 1 : 0.4,
                  transition: 'all 0.08s ease',
                  animation: isRedlineFlashing ? 'pulse 0.15s infinite alternate' : 'none',
                }}
              />
            );
          })}
        </div>

        {/* Live Readout Values */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)' }}>
          <span style={{ fontSize: '0.78rem', color: '#F5F5F2' }}>
            <span style={{ color: 'var(--text-muted)' }}>RPM </span>
            <strong style={{ color: activeRpm > 13000 ? 'var(--accent-orange)' : '#FFFFFF' }}>
              {activeRpm.toLocaleString()}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Interactive Dyno Curve Canvas */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '240px',
          cursor: 'crosshair',
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mouseX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
          const pct = mouseX / rect.width;
          const targetRpm = Math.round(MIN_RPM + pct * (MAX_RPM - MIN_RPM));
          setHoverRpm(targetRpm);
        }}
        onMouseLeave={() => setHoverRpm(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* HP Gradient Fill */}
            <linearGradient id="hpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.28" />
              <stop offset="70%" stopColor="#FF5A1F" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0" />
            </linearGradient>

            {/* Torque Gradient Fill */}
            <linearGradient id="tqGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid Horizontal Guide Lines */}
          {[0.25, 0.5, 0.75].map((pct, i) => (
            <line
              key={i}
              x1={paddingX}
              y1={paddingY + pct * (height - 2 * paddingY)}
              x2={width - paddingX}
              y2={paddingY + pct * (height - 2 * paddingY)}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Horsepower Area & Stroke */}
          {(activeCurveTab === 'both' || activeCurveTab === 'hp') && (
            <>
              <path d={hpAreaD} fill="url(#hpGradient)" />
              <path
                d={hpPathD}
                fill="none"
                stroke="var(--accent-orange)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Torque Stroke */}
          {(activeCurveTab === 'both' || activeCurveTab === 'torque') && (
            <path
              d={torquePathD}
              fill="none"
              stroke="#D4D4D4"
              strokeWidth="2.2"
              strokeDasharray="none"
              strokeLinecap="round"
              style={{ opacity: 0.9 }}
            />
          )}

          {/* Vertical Laser Telemetry Scanner Cursor Line */}
          <line
            x1={currentX}
            y1={paddingY}
            x2={currentX}
            y2={height - paddingY}
            stroke="rgba(255, 90, 31, 0.85)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Cursor Peak Tracer Dot */}
          <circle
            cx={currentX}
            cy={height - paddingY - (liveHp / hp) * (height - 2 * paddingY)}
            r="5"
            fill="#FFFFFF"
            stroke="var(--accent-orange)"
            strokeWidth="2.5"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255, 90, 31, 0.9))',
            }}
          />
        </svg>

        {/* Floating Live Telemetry HUD Tag directly pinned to scanner */}
        <div
          style={{
            position: 'absolute',
            left: `${((activeRpm - MIN_RPM) / (MAX_RPM - MIN_RPM)) * 100}%`,
            top: '8px',
            transform: 'translateX(-50%)',
            background: 'rgba(14, 14, 14, 0.94)',
            border: '1px solid rgba(255, 90, 31, 0.5)',
            borderRadius: '8px',
            padding: '0.35rem 0.75rem',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            boxShadow: '0 8px 24px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-orange)' }} />
            <strong style={{ color: 'var(--accent-orange)' }}>{liveHp} HP</strong>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ color: '#E0E0E0' }}>{liveTorque} NM</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <span style={{ color: '#8E8E8E' }}>{activeRpm.toLocaleString()} RPM</span>
        </div>
      </div>

      {/* Bottom Telemetry Legend & Dyno Specs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          marginTop: '1.25rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: '12px', height: '3px', background: 'var(--accent-orange)', borderRadius: '2px' }} />
            <span style={{ color: '#F5F5F2' }}>HORSEPOWER: {hp} HP @ {PEAK_HP_RPM.toLocaleString()} RPM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: '12px', height: '3px', background: '#D4D4D4', borderRadius: '2px' }} />
            <span style={{ color: '#A0A0A0' }}>TORQUE: {torque} NM @ {PEAK_TORQUE_RPM.toLocaleString()} RPM</span>
          </div>
        </div>

        {/* Engine Tech Tag */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Zap size={11} color="var(--accent-orange)" />
          <span>{engineCC}CC POWERTRAIN · BMW SHIFTCAM VARIABLE VALVE TIMING</span>
        </span>
      </div>
    </div>
  );
};
