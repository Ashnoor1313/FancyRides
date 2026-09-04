import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCw, RotateCcw, Compass, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface Machine360ViewerProps {
  modelName: string;
  brand: string;
}

interface CameraAngle {
  id: string;
  label: string;
  deg: number;
  image: string;
  description: string;
}

const CAMERA_ANGLES: CameraAngle[] = [
  {
    id: 'side',
    label: 'SIDE PROFILE',
    deg: 0,
    image: '/images/bmw-360-side.jpg',
    description: 'Direct side profile showcasing M chassis geometry & wheel wheelbase',
  },
  {
    id: 'front34',
    label: 'DYNAMIC 3/4',
    deg: 45,
    image: '/images/bmw-360-front34.jpg',
    description: 'Three-quarter dynamic perspective emphasizing carbon winglets',
  },
  {
    id: 'front',
    label: 'FRONT AERO',
    deg: 90,
    image: '/images/bmw-360-front.jpg',
    description: 'Aggressive head-on aerodynamic intake and LED twin headlights',
  },
  {
    id: 'rear34',
    label: 'REAR EXHAUST',
    deg: 315,
    image: '/images/bmw-360-rear34.jpg',
    description: 'Titanium Akrapovič exhaust line and aerodynamically vented tail cowl',
  },
];

const HOTSPOTS = [
  {
    id: 'winglets',
    angleId: 'front',
    top: '48%',
    left: '38%',
    title: 'M Carbon Winglets',
    detail: 'Generates 17.1 KG aerodynamic downforce @ 300 km/h, preventing front wheel lift.',
  },
  {
    id: 'exhaust',
    angleId: 'rear34',
    top: '52%',
    left: '46%',
    title: 'Akrapovič Factory Titanium',
    detail: 'Full titanium header and canister with dry carbon heat shield, saving 4.8 KG.',
  },
  {
    id: 'engine',
    angleId: 'side',
    top: '56%',
    left: '52%',
    title: 'BMW ShiftCam 999cc',
    detail: 'Variable valve timing delivering 207 HP @ 13,750 RPM and broad low-end torque.',
  },
  {
    id: 'brakes',
    angleId: 'front34',
    top: '68%',
    left: '60%',
    title: 'M Radial 4-Piston Calipers',
    detail: 'Forged blue anodized monoblock calipers clamping dual 320mm floating discs.',
  },
];

export const Machine360Viewer: React.FC<Machine360ViewerProps> = ({ modelName, brand }) => {
  const [currentDeg, setCurrentDeg] = useState<number>(45);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartDeg, setDragStartDeg] = useState<number>(45);
  const [dragVelocity, setDragVelocity] = useState<number>(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [studioLight, setStudioLight] = useState<'neutral' | 'focused'>('neutral');

  const containerRef = useRef<HTMLDivElement>(null);
  const autoRotateRef = useRef<number | null>(null);

  // Map 0-360 continuous degree to closest discrete camera angle
  const getClosestAngle = useCallback((deg: number): CameraAngle => {
    const normalized = ((deg % 360) + 360) % 360;
    
    let closest = CAMERA_ANGLES[0];
    let minDiff = 360;

    CAMERA_ANGLES.forEach((angle) => {
      let diff = Math.abs(normalized - angle.deg);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closest = angle;
      }
    });

    return closest;
  }, []);

  const activeAngle = getClosestAngle(currentDeg);

  // Auto-rotation engine
  useEffect(() => {
    if (!isAutoRotating) {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
      return;
    }

    const step = () => {
      setCurrentDeg((prev) => (prev + 0.4) % 360);
      autoRotateRef.current = requestAnimationFrame(step);
    };

    autoRotateRef.current = requestAnimationFrame(step);
    return () => {
      if (autoRotateRef.current) cancelAnimationFrame(autoRotateRef.current);
    };
  }, [isAutoRotating]);

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsAutoRotating(false);
    setDragStartX(e.clientX);
    setDragStartDeg(currentDeg);
    setDragVelocity(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartX;
    const newDeg = dragStartDeg - deltaX * 0.45;
    setCurrentDeg(((newDeg % 360) + 360) % 360);
    setDragVelocity(-deltaX * 0.05);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragVelocity(0);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setIsAutoRotating(false);
      setDragStartX(e.touches[0].clientX);
      setDragStartDeg(currentDeg);
      setDragVelocity(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStartX;
    const newDeg = dragStartDeg - deltaX * 0.45;
    setCurrentDeg(((newDeg % 360) + 360) % 360);
    setDragVelocity(-deltaX * 0.05);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDragVelocity(0);
  };

  // Step rotation controls
  const handleRotateStep = (direction: 'left' | 'right') => {
    setIsAutoRotating(false);
    // Find current index and cycle
    const currentIndex = CAMERA_ANGLES.findIndex((a) => a.id === activeAngle.id);
    let nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= CAMERA_ANGLES.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = CAMERA_ANGLES.length - 1;
    setCurrentDeg(CAMERA_ANGLES[nextIndex].deg);
  };

  // Subtle interactive 3D perspective tilt during drag
  const tiltY = isDragging ? Math.max(-8, Math.min(8, dragVelocity * 2)) : 0;

  return (
    <div
      style={{
        background: '#090909',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-card)',
        padding: 'clamp(1.25rem, 2.5vw, 2rem)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      {/* Background Studio Lighting Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75%',
          height: '65%',
          background:
            studioLight === 'focused'
              ? 'radial-gradient(ellipse at center, rgba(255, 90, 31, 0.14) 0%, rgba(0,0,0,0) 70%)'
              : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.06) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none',
          transition: 'all 0.5s ease',
        }}
      />

      {/* Header Row: Title & Studio Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isAutoRotating ? 'var(--accent-orange)' : '#8E8E8E',
                boxShadow: isAutoRotating ? '0 0 10px var(--accent-orange)' : 'none',
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
              360° INTERACTIVE TURNTABLE
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#F5F5F2',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            {brand} {modelName}
          </h3>
        </div>

        {/* Studio Lighting & Auto-Rotate Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Auto-Rotate Turntable Toggle */}
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="filter-pill-btn"
            style={{
              borderColor: isAutoRotating ? 'var(--accent-orange)' : undefined,
              color: isAutoRotating ? '#F5F5F2' : undefined,
              background: isAutoRotating ? '#181818' : undefined,
            }}
            title={isAutoRotating ? 'Pause turntable' : 'Start 360° auto rotation'}
          >
            <RotateCw
              size={12}
              color={isAutoRotating ? 'var(--accent-orange)' : 'currentColor'}
              style={{ animation: isAutoRotating ? 'spin 5s linear infinite' : 'none' }}
            />
            <span>{isAutoRotating ? 'ROTATING 360°' : 'AUTO-ROTATE'}</span>
          </button>

          {/* Lighting Mode Toggle */}
          <button
            onClick={() => setStudioLight(studioLight === 'neutral' ? 'focused' : 'neutral')}
            className="filter-pill-btn"
            title="Toggle Studio Keylight"
          >
            <Sparkles size={12} color={studioLight === 'focused' ? 'var(--accent-orange)' : '#888'} />
            <span>{studioLight === 'focused' ? 'KEYLIGHT ON' : 'AMBIENT'}</span>
          </button>
        </div>
      </div>

      {/* Main 360° Visual Canvas with Drag / Orbit Interaction */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: '14px',
          overflow: 'hidden',
          background: '#040404',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          perspective: '1200px',
        }}
      >
        {/* Render Active Camera Angle Image with dynamic 3D response */}
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `rotateY(${tiltY}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.25s ease',
            position: 'relative',
          }}
        >
          <img
            src={activeAngle.image}
            alt={`${modelName} - ${activeAngle.label}`}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* 3D Showroom Rotating Turntable Floor Platform */}
        <div
          style={{
            position: 'absolute',
            bottom: '-12%',
            left: '50%',
            transform: `translateX(-50%) rotateX(74deg) rotateZ(${currentDeg}deg)`,
            width: '88%',
            aspectRatio: '1 / 1',
            borderRadius: '50%',
            border: '2px dashed rgba(255, 90, 31, 0.35)',
            boxShadow: '0 0 45px rgba(255, 90, 31, 0.2), inset 0 0 35px rgba(0,0,0,0.9)',
            pointerEvents: 'none',
            transition: isDragging ? 'none' : 'transform 0.25s ease',
          }}
        >
          {/* Inner metallic turntable ring */}
          <div
            style={{
              position: 'absolute',
              inset: '12%',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          />
          {/* Center alignment notch */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-orange)',
              boxShadow: '0 0 10px var(--accent-orange)',
            }}
          />
        </div>

        {/* Floor shadow and radial reflection overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '35%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Drag Hint on Idle */}
        {!isDragging && !isAutoRotating && (
          <div
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'rgba(10, 10, 10, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.75rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: '#B0B0B0',
              pointerEvents: 'none',
            }}
          >
            <Compass size={11} color="var(--accent-orange)" />
            <span>DRAG TO ROTATE 360°</span>
          </div>
        )}

        {/* Clean 360° Perspective Indicator (No degree numbers) */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '14px',
            background: 'rgba(10, 10, 10, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            padding: '0.4rem 0.85rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
            pointerEvents: 'none',
          }}
        >
          <RotateCw
            size={12}
            color="var(--accent-orange)"
            style={{ animation: isAutoRotating ? 'spin 4s linear infinite' : 'none' }}
          />
          <span style={{ color: '#F5F5F2', fontWeight: 700, letterSpacing: '0.06em' }}>
            360° VIEW
          </span>
          <span style={{ color: '#555' }}>|</span>
          <span style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>
            {activeAngle.label}
          </span>
        </div>

        {/* Interactive Feature Hotspot Dots */}
        {HOTSPOTS.filter((h) => h.angleId === activeAngle.id).map((hotspot) => {
          const isSelected = activeHotspot === hotspot.id;
          return (
            <div
              key={hotspot.id}
              style={{
                position: 'absolute',
                top: hotspot.top,
                left: hotspot.left,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(isSelected ? null : hotspot.id);
              }}
            >
              {/* Radar Pulse Dot */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 90, 31, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid var(--accent-orange)',
                  animation: 'pulseGlow 2s infinite',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
              </div>

              {/* Hotspot Floating Detail Callout */}
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '240px',
                    background: '#121212',
                    border: '1px solid var(--accent-orange)',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.95)',
                    zIndex: 20,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: '#F5F5F2' }}>
                      {hotspot.title}
                    </strong>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#B0B0B0', lineHeight: 1.45, margin: 0 }}>
                    {hotspot.detail}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 360° Turntable Interactive Controls (No Degree Meter / Numbers) */}
      <div style={{ marginTop: '1.25rem', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Rotate Left Button */}
          <button
            onClick={() => handleRotateStep('left')}
            className="filter-pill-btn"
            style={{
              padding: '0.65rem 0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#121212',
            }}
            title="Rotate Left"
          >
            <ChevronLeft size={14} />
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>ROTATE</span>
          </button>

          {/* Perspective View Selectors without degree numbers */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              flex: 1,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {CAMERA_ANGLES.map((angle) => {
              const isActive = activeAngle.id === angle.id;
              return (
                <button
                  key={angle.id}
                  onClick={() => {
                    setCurrentDeg(angle.deg);
                    setIsAutoRotating(false);
                  }}
                  style={{
                    background: isActive ? '#1C1C1C' : '#0D0D0D',
                    border: isActive ? '1px solid var(--accent-orange)' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    color: isActive ? '#F5F5F2' : '#888888',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? '0 0 15px rgba(255, 90, 31, 0.15)' : 'none',
                  }}
                >
                  <span style={{ color: isActive ? 'var(--accent-orange)' : '#888' }}>
                    {angle.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Rotate Right Button */}
          <button
            onClick={() => handleRotateStep('right')}
            className="filter-pill-btn"
            style={{
              padding: '0.65rem 0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#121212',
            }}
            title="Rotate Right"
          >
            <span style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>ROTATE</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* 360 Rotation Guidance Strip */}
        <div
          style={{
            marginTop: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            padding: '0.45rem 1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '999px',
          }}
        >
          <RotateCcw size={11} color="var(--accent-orange)" />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            Drag anywhere horizontally on machine to rotate 360°
          </span>
          <RotateCw size={11} color="var(--accent-orange)" />
        </div>
      </div>
    </div>
  );
};

