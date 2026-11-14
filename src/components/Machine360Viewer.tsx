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

const INTERCEPTOR_ANGLES: CameraAngle[] = [
  {
    id: 'front34',
    label: 'FRONT 3/4',
    deg: 0,
    image: '/images/IMG_0195.JPG',
    description: 'Three-quarter front view — Hollywood handlebar stance & classic round headlamp',
  },
  {
    id: 'front',
    label: 'FRONT',
    deg: 45,
    image: '/images/IMG_0196.JPG',
    description: 'Head-on classic chrome front end with Fancy Rides India number plate',
  },
  {
    id: 'side',
    label: 'SIDE PROFILE',
    deg: 90,
    image: '/images/IMG_0211.JPG',
    description: 'Full side profile showing the iconic Interceptor silhouette — tank, seat and chrome engine',
  },
  {
    id: 'rear',
    label: 'REAR / EXHAUST',
    deg: 315,
    image: '/images/IMG_0201.JPG',
    description: 'Rear three-quarter showing new rear tyre & Red Rooster chrome exhaust tips',
  },
];

const INTERCEPTOR_HOTSPOTS = [
  {
    id: 'exhaust',
    angleId: 'rear',
    top: '68%',
    left: '28%',
    title: 'Red Rooster Performance Exhaust',
    detail: 'Original Red Rooster Performance slip-on — chrome finish, deeper parallel twin note with zero restriction.',
  },
  {
    id: 'handlebar',
    angleId: 'front',
    top: '22%',
    left: '50%',
    title: 'Hollywood Handlebar',
    detail: 'Wide Hollywood-style handlebar fitted for a relaxed cafe racer riding posture — a head-turning classic touch.',
  },
  {
    id: 'engine',
    angleId: 'side',
    top: '58%',
    left: '52%',
    title: '648cc Parallel Twin',
    detail: '47 BHP @ 7,150 RPM and 52 Nm @ 5,150 RPM. Air-oil cooled SOHC twin with slipper & assist clutch.',
  },
  {
    id: 'rear-tyre',
    angleId: 'rear',
    top: '72%',
    left: '52%',
    title: 'Brand New Rear Tyre',
    detail: '130/70-18 rear tyre — freshly replaced, full tread depth, ready for immediate riding.',
  },
];

const HARLEY_ANGLES: CameraAngle[] = [
  {
    id: 'front34',
    label: 'FRONT 3/4',
    deg: 0,
    image: '/images/hd48/IMG_0035.jpg',
    description: 'Three-quarter front view — Vivid Yellow peanut tank & fat Shinko Forty-Eight front tyre',
  },
  {
    id: 'front',
    label: 'FRONT',
    deg: 45,
    image: '/images/hd48/IMG_0037.jpg',
    description: 'Direct bobber front end with custom headlamp grill & aftermarket indicators',
  },
  {
    id: 'side',
    label: 'SIDE PROFILE',
    deg: 90,
    image: '/images/hd48/IMG_0045.jpg',
    description: 'Full side profile showing 1202cc Evolution V-Twin, chrome engine guard & Vance & Hines exhaust',
  },
  {
    id: 'rear',
    label: 'REAR / EXHAUST',
    deg: 315,
    image: '/images/hd48/IMG_0041.jpg',
    description: 'Rear view showing pillion seat, side mount number plate & Vance & Hines dual exhaust pipes',
  },
];

const HARLEY_HOTSPOTS = [
  {
    id: 'exhaust',
    angleId: 'rear',
    top: '70%',
    left: '32%',
    title: 'Vance & Hines Exhaust',
    detail: 'Authentic Vance & Hines performance pipes delivering signature Sportster thunder and unrestrained roar.',
  },
  {
    id: 'engine-guard',
    angleId: 'side',
    top: '52%',
    left: '34%',
    title: 'Engine Guard (Chrome)',
    detail: 'Heavy-duty chrome engine guard providing vital crankcase protection with highway cruising comfort.',
  },
  {
    id: 'pillion-seat',
    angleId: 'rear',
    top: '46%',
    left: '52%',
    title: 'Pillion Seat & Pegs',
    detail: 'Fitted matching rear pillion seat and passenger footpegs for comfortable two-up riding.',
  },
  {
    id: 'side-plate',
    angleId: 'rear',
    top: '64%',
    left: '74%',
    title: 'Side Mount Number Plate',
    detail: 'Custom offset side-mount registration plate bracket keeping the chopped rear fender sleek and aggressive.',
  },
  {
    id: 'front-accessories',
    angleId: 'front',
    top: '25%',
    left: '48%',
    title: 'Hand Grips & Headlamp Grill',
    detail: 'Aftermarket knurled hand grips, custom cross-hatch headlamp grill, and sleek bullet front indicators.',
  },
];

const FATBOB_ANGLES: CameraAngle[] = [
  {
    id: 'front34',
    label: 'FRONT 3/4 HERO',
    deg: 0,
    image: '/images/fatbob/IMG_0065.jpg',
    description: 'Imposing front 3/4 stance — signature twin headlights, fat front tyre & Vance & Hines Shortshots',
  },
  {
    id: 'front',
    label: 'TWIN HEADLIGHTS',
    deg: 45,
    image: '/images/fatbob/IMG_0055.jpg',
    description: 'Direct front view with Fancy Rides India plate, dual chrome headlights & heavy-duty HD leg guard',
  },
  {
    id: 'side',
    label: 'SIDE PROFILE',
    deg: 90,
    image: '/images/fatbob/IMG_0062.jpg',
    description: 'Full right-side profile showing slotted disc wheel, Vance & Hines exhaust & dual rear suspension',
  },
  {
    id: 'rear',
    label: 'REAR PROFILE',
    deg: 315,
    image: '/images/fatbob/IMG_0052.jpg',
    description: 'Muscular rear view showing wide rear rubber, dual short shot pipes & drag handlebars',
  },
];

const FATBOB_HOTSPOTS = [
  {
    id: 'vh-shortshots',
    angleId: 'side',
    top: '65%',
    left: '80%',
    title: 'Vance & Hines Shortshots',
    detail: 'Matte black Shortshots Staggered full exhaust system with chrome slash-cut tips for legendary American twin rumble.',
  },
  {
    id: 'hd-leg-guard',
    angleId: 'front',
    top: '56%',
    left: '28%',
    title: 'HD Engine Leg Guard',
    detail: 'Genuine Harley-Davidson heavy-duty black crash guard offering vital powertrain and leg protection.',
  },
  {
    id: 'twin-headlamps',
    angleId: 'front',
    top: '28%',
    left: '52%',
    title: 'Dual Chrome Bullet Headlights',
    detail: 'Iconic signature Fat Bob twin headlamps providing high-illumination night beam and unmistakable road stance.',
  },
  {
    id: 'aftermarket-grips',
    angleId: 'front34',
    top: '26%',
    left: '70%',
    title: 'Custom Hand Grips',
    detail: 'High-grade aftermarket diamond knurled grips delivering superior tactile ergonomics and feedback.',
  },
  {
    id: 'keyless-fob',
    angleId: 'rear',
    top: '38%',
    left: '60%',
    title: 'Smart Keyless Operating System',
    detail: 'Factory Harley-Davidson hands-free proximity keyless ignition system with auto-arming security.',
  },
];

const HAYABUSA_ANGLES: CameraAngle[] = [
  {
    id: 'front34',
    label: 'FRONT 3/4 AERO',
    deg: 0,
    image: '/images/hayabusa/IMG_0001.jpg',
    description: 'Pearl White aerodynamic stance — signature Kanji graphic, carbon hydrodipped fender & Brembo Stylema calipers',
  },
  {
    id: 'front',
    label: 'RAM-AIR FRONT',
    deg: 45,
    image: '/images/hayabusa/IMG_0010.jpg',
    description: 'Aggressive front fascia with stacked LED projector beam, integrated ram-air vents & Fancy Rides India plate',
  },
  {
    id: 'side',
    label: 'HYPERBIKE PROFILE',
    deg: 90,
    image: '/images/hayabusa/IMG_0003.jpg',
    description: 'Full landscape side profile showing M4 US-imported full exhaust, carbon frame covers & aerodynamic tail cowl',
  },
  {
    id: 'rear',
    label: 'REAR / TAIL COWL',
    deg: 315,
    image: '/images/hayabusa/IMG_0006.jpg',
    description: 'Muscular rear view showing illuminated twin LED taillights, single-seat aerodynamic hump & wide Battlax tyre',
  },
];

const HAYABUSA_HOTSPOTS = [
  {
    id: 'm4-exhaust',
    angleId: 'side',
    top: '72%',
    left: '38%',
    title: 'M4 US Full System Exhaust',
    detail: 'Imported US-spec M4 full performance exhaust system worth ₹3 Lakhs, delivering weight reduction and a screaming inline-4 roar.',
  },
  {
    id: 'brembo-stylema',
    angleId: 'front34',
    top: '74%',
    left: '52%',
    title: 'Brembo Stylema Calipers',
    detail: 'Top-of-the-line Brembo Stylema 4-piston radial monobloc calipers with dual 320mm floating discs and Motion Track ABS.',
  },
  {
    id: 'hydrodipped-carbon',
    angleId: 'front34',
    top: '58%',
    left: '58%',
    title: 'Hydrodipped Carbon Aero (₹1.5L Value)',
    detail: 'Premium high-gloss carbon-weave hydrodipped fairing vents, front fender, intake ducts, and frame covers.',
  },
  {
    id: 'rg-protector',
    angleId: 'front34',
    top: '48%',
    left: '34%',
    title: 'R&G Performance Leg Guard / Sliders',
    detail: 'R&G aerodynamic frame protectors and leg guards safeguarding engine cases and immaculate fairings.',
  },
  {
    id: 'sirs-electronics',
    angleId: 'front',
    top: '25%',
    left: '49%',
    title: 'S.I.R.S. Suite & Quickshifter',
    detail: 'Suzuki Intelligent Ride System with 6-axis IMU, bi-directional quickshifter, 10-mode traction control & launch control.',
  },
];

const DUCATI_ANGLES: CameraAngle[] = [
  {
    id: 'front34',
    label: 'FRONT 3/4 STREET',
    deg: 0,
    image: '/images/ducati/IMG_0019.jpg',
    description: 'Dynamic Italian stance — signature Ducati Red sculpted tank, red trellis frame & inverted forks',
  },
  {
    id: 'front',
    label: 'NAKED FASCIA',
    deg: 45,
    image: '/images/ducati/IMG_0020.jpg',
    description: 'Aggressive roadster front — brand new front tyre, Brembo radial calipers & classic Monster round headlight',
  },
  {
    id: 'side',
    label: 'DESMO PROFILE',
    deg: 90,
    image: '/images/ducati/IMG_0027.jpg',
    description: 'Full profile showing 821cc Testastretta 11° L-Twin, exposed red trellis architecture & high-flow radiator',
  },
  {
    id: 'rear',
    label: 'SHOTGUN REAR',
    deg: 315,
    image: '/images/ducati/IMG_0023.jpg',
    description: 'Muscular rear view showing dual stacked shotgun exhaust pipes, wide Pirelli tyre & DL registered plate',
  },
];

const DUCATI_HOTSPOTS = [
  {
    id: 'testastretta-desmo',
    angleId: 'side',
    top: '60%',
    left: '52%',
    title: 'Testastretta 11° (1st Desmo Done)',
    detail: '821cc L-Twin generating 112 HP & 89 Nm torque. 1st major Desmo valve clearance service already completed with full records.',
  },
  {
    id: 'brand-new-tyre',
    angleId: 'front',
    top: '75%',
    left: '50%',
    title: 'Brand New Front Tyre & Brembos',
    detail: 'Brand new high-performance front tyre paired with dual 320mm semi-floating discs & Brembo Monobloc M4-32 radial calipers with ABS.',
  },
  {
    id: 'dual-shotgun-exhaust',
    angleId: 'rear',
    top: '64%',
    left: '38%',
    title: 'Dual Shotgun Exhaust & Swingarm',
    detail: 'Factory stacked twin-exit shotgun exhaust system delivering an unmistakable Desmo rumble and aggressive rear profile.',
  },
  {
    id: 'red-trellis-frame',
    angleId: 'front34',
    top: '44%',
    left: '54%',
    title: 'Signature Tubular Trellis Frame',
    detail: 'Iconic Ducati tubular steel trellis chassis in contrasting red, providing razor-sharp handling and immense structural rigidity.',
  },
  {
    id: 'dsp-safety-pack',
    angleId: 'front',
    top: '28%',
    left: '48%',
    title: 'Ducati Safety Pack (DSP)',
    detail: 'Includes 3-level Bosch ABS, 8-level Ducati Traction Control (DTC), and 3 selectable Riding Modes (Sport, Touring, Urban).',
  },
];

export const Machine360Viewer: React.FC<Machine360ViewerProps> = ({ modelName, brand }) => {
  const isDucati = brand.toUpperCase().includes('DUCATI') || modelName.toUpperCase().includes('MONSTER');
  const isHayabusa = modelName.toUpperCase().includes('HAYABUSA') || brand.toUpperCase().includes('SUZUKI');
  const isFatBob = modelName.toUpperCase().includes('FAT') || modelName.toUpperCase().includes('DYNA');
  const isHarley = brand.toUpperCase().includes('HARLEY') || modelName.toUpperCase().includes('FORTY');
  const cameraAngles = isDucati ? DUCATI_ANGLES : isHayabusa ? HAYABUSA_ANGLES : isFatBob ? FATBOB_ANGLES : isHarley ? HARLEY_ANGLES : INTERCEPTOR_ANGLES;
  const hotspots = isDucati ? DUCATI_HOTSPOTS : isHayabusa ? HAYABUSA_HOTSPOTS : isFatBob ? FATBOB_HOTSPOTS : isHarley ? HARLEY_HOTSPOTS : INTERCEPTOR_HOTSPOTS;

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
    
    let closest = cameraAngles[0];
    let minDiff = 360;

    cameraAngles.forEach((angle) => {
      let diff = Math.abs(normalized - angle.deg);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closest = angle;
      }
    });

    return closest;
  }, [cameraAngles]);

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
    const currentIndex = cameraAngles.findIndex((a) => a.id === activeAngle.id);
    let nextIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= cameraAngles.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = cameraAngles.length - 1;
    setCurrentDeg(cameraAngles[nextIndex].deg);
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
                fontFamily: 'var(--font-heading)',
                fontSize: '0.68rem',
                fontWeight: 500,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--accent-orange)',
              }}
            >
              360° Interactive Turntable
            </span>
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#F5F5F2',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
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
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.08em' }}>{isAutoRotating ? 'Rotating 360°' : 'Auto-rotate'}</span>
          </button>

          {/* Lighting Mode Toggle */}
          <button
            onClick={() => setStudioLight(studioLight === 'neutral' ? 'focused' : 'neutral')}
            className="filter-pill-btn"
            title="Toggle Studio Keylight"
          >
            <Sparkles size={12} color={studioLight === 'focused' ? 'var(--accent-orange)' : '#888'} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.08em' }}>{studioLight === 'focused' ? 'Keylight on' : 'Ambient'}</span>
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
          aspectRatio: '4 / 3',
          minHeight: '440px',
          borderRadius: '14px',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at center, #181818 0%, #050505 100%)',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={activeAngle.image}
            alt={`${modelName} - ${activeAngle.label}`}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              pointerEvents: 'none',
              padding: '12px',
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
              padding: '0.35rem 0.85rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.72rem',
              fontWeight: 400,
              letterSpacing: '0.08em',
              color: '#B0B0B0',
              pointerEvents: 'none',
            }}
          >
            <Compass size={11} color="var(--accent-orange)" />
            <span>Drag to rotate</span>
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
            padding: '0.4rem 0.9rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontFamily: 'var(--font-heading)',
            fontSize: '0.72rem',
            fontWeight: 400,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
            pointerEvents: 'none',
          }}
        >
          <RotateCw
            size={12}
            color="var(--accent-orange)"
            style={{ animation: isAutoRotating ? 'spin 4s linear infinite' : 'none' }}
          />
          <span style={{ color: '#F5F5F2', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.68rem' }}>
            360° View
          </span>
          <span style={{ color: '#555' }}>|</span>
          <span style={{ color: 'var(--accent-orange)', fontWeight: 500, fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {activeAngle.label}
          </span>
        </div>

        {/* Interactive Feature Hotspot Dots */}
        {hotspots.filter((h) => h.angleId === activeAngle.id).map((hotspot) => {
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
                    <strong style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontStyle: 'italic', fontSize: '1rem', color: '#F5F5F2', letterSpacing: '0em', lineHeight: 1.2 }}>
                      {hotspot.title}
                    </strong>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', fontWeight: 400, color: '#B0B0B0', lineHeight: 1.6, margin: 0, letterSpacing: '0.01em' }}>
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
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Rotate</span>
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
            {cameraAngles.map((angle) => {
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
                  <span style={{ color: isActive ? 'var(--accent-orange)' : '#888', fontFamily: 'var(--font-heading)', fontSize: '0.68rem', fontWeight: isActive ? 500 : 400, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
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
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Rotate</span>
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
              fontFamily: 'var(--font-heading)',
              fontSize: '0.65rem',
              fontWeight: 400,
              color: 'var(--text-muted)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            Drag anywhere on machine to rotate 360°
          </span>
          <RotateCw size={11} color="var(--accent-orange)" />
        </div>
      </div>
    </div>
  );
};

