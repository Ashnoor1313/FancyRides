import React, { useState, useEffect, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { MotorcycleCard } from '../components/MotorcycleCard';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
  ShieldCheck,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'home' | 'collection' | 'detail' | 'fancy-numbers' | 'admin', params?: { category?: string; machineId?: string }) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenSellModal: () => void;
}

// 5 Hero Slides showcasing both certified machines (Section 01)
const HERO_SLIDES = [
  {
    slideNumber: '01 / 05',
    brand: 'SUZUKI',
    model: 'HAYABUSA GEN 3',
    subtitle: 'M4 US FULL SYSTEM · 1340CC INLINE-4 · 190 HP',
    hp: 190,
    cc: 1340,
    kg: 260,
    image: '/images/hayabusa/IMG_0001.jpg',
    machineId: 'suzuki-hayabusa-gen-3-2023',
  },
  {
    slideNumber: '02 / 05',
    brand: 'HARLEY-DAVIDSON',
    model: 'FAT BOB DYNA',
    subtitle: 'VANCE & HINES SHORT SHOT · 1585CC TWIN CAM 96',
    hp: 79,
    cc: 1585,
    kg: 320,
    image: '/images/fatbob/IMG_0065.jpg',
    machineId: 'harley-davidson-fat-bob-dyna-2017',
  },
  {
    slideNumber: '03 / 05',
    brand: 'HARLEY-DAVIDSON',
    model: 'FORTY-EIGHT',
    subtitle: 'VANCE & HINES STAGE CUSTOM · 1202CC V-TWIN',
    hp: 66,
    cc: 1202,
    kg: 247,
    image: '/images/hd48/IMG_0035.jpg',
    machineId: 'harley-davidson-forty-eight-2018',
  },
  {
    slideNumber: '04 / 05',
    brand: 'ROYAL ENFIELD',
    model: 'INTERCEPTOR 650',
    subtitle: 'HOLLYWOOD & RED ROOSTER EDITION',
    hp: 47,
    cc: 648,
    kg: 202,
    image: '/images/IMG_0195.JPG',
    machineId: 're-interceptor-650-2021',
  },
  {
    slideNumber: '05 / 05',
    brand: 'DUCATI',
    model: 'MONSTER 821',
    subtitle: 'TESTASTRETTA 11° · 112 HP · 1ST DESMO DONE · DL REGD',
    hp: 112,
    cc: 821,
    kg: 205,
    image: '/images/ducati/IMG_0019.jpg',
    machineId: 'ducati-monster-821-2015',
  },
];

// 7 Categories for Section 03
const CATEGORY_ITEMS = [
  {
    number: '01',
    name: 'ADVENTURE',
    tagline: "For roads that don't exist on maps.",
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '02',
    name: 'ROADSTER',
    tagline: 'Pure. Raw. Unfiltered.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '03',
    name: 'SUPERBIKE',
    tagline: 'Built for adrenaline.',
    image: '/images/hayabusa/IMG_0001.jpg',
  },
  {
    number: '04',
    name: 'CRUISER',
    tagline: 'Make an entrance.',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '05',
    name: 'TOURING',
    tagline: 'Go further.',
    image: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '06',
    name: 'SPORT',
    tagline: 'Performance without compromise.',
    image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=1200&auto=format&fit=crop',
  },
  {
    number: '07',
    name: 'CLASSIC',
    tagline: 'Some machines never age.',
    image: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?q=80&w=1200&auto=format&fit=crop',
  },
];

// Interactive Brand Roster for Section 05
const BRAND_DATA = [
  {
    name: 'BMW',
    origin: 'MUNICH, GERMANY',
    tag: 'PRECISION / SHIFTCAM RACING',
    bg: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop',
  },
  {
    name: 'DUCATI',
    origin: 'BOLOGNA, ITALY',
    tag: 'DESMODROMIC ADRENALINE',
    bg: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?q=80&w=2000&auto=format&fit=crop',
  },
  {
    name: 'TRIUMPH',
    origin: 'HINCKLEY, UK',
    tag: 'INLINE-3 TRIPLE ROAR',
    bg: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2000&auto=format&fit=crop',
  },
  {
    name: 'KAWASAKI',
    origin: 'KOBE, JAPAN',
    tag: 'WORLDSBK DOMINANCE',
    bg: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=2000&auto=format&fit=crop',
  },
  {
    name: 'HARLEY-DAVIDSON',
    origin: 'MILWAUKEE, USA',
    tag: 'HIGH-OUTPUT V-TWIN MUSCLE',
    bg: 'https://images.unsplash.com/photo-1558981420-87aa9dad1c89?q=80&w=2000&auto=format&fit=crop',
  },
  {
    name: 'INDIAN',
    origin: 'MINNEAPOLIS, USA',
    tag: 'PIONEERING AMERICAN POWER',
    bg: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop',
  },
  {
    name: 'APRILIA',
    origin: 'NOALE, ITALY',
    tag: 'MOTOGP FACTORY AERODYNAMICS',
    bg: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?q=80&w=2000&auto=format&fit=crop',
  },
  {
    name: 'SUZUKI',
    origin: 'HAMAMATSU, JAPAN',
    tag: 'LEGENDARY GSX HERITAGE',
    bg: '/images/hayabusa/IMG_0003.jpg',
  },
  {
    name: 'HONDA',
    origin: 'TOKYO, JAPAN',
    tag: 'ENGINEERED PERFECTION',
    bg: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=2000&auto=format&fit=crop',
  },
];

// Technical Inspection Pins with Full Diagnostic Specs for Section 08
const INSPECTION_PINS = [
  {
    id: 'engine',
    label: 'ENGINE',
    sub: 'Powertrain & ShiftCam VVT',
    x: 48,
    y: 69,
    score: '98/100 · EXCELLENT',
    systemTitle: '999CC SHIFTCAM INLINE-4 POWERTRAIN',
    summary: 'Full cylinder endoscope audit completed. All 4 bores exhibit pristine factory cross-hatching with zero blow-by or oil seepage.',
    specs: [
      { label: 'Cylinder Compression', value: '13.5:1 (±0.2 bar balanced)' },
      { label: 'Valve Clearance', value: '0.22mm Intake / 0.28mm Exhaust' },
      { label: 'Spectrometric Oil Test', value: 'Clean · 0 Metal Particles' },
      { label: 'Dyno Verified Output', value: '193.4 HP @ 13,750 RPM' },
    ],
    tolerance: 'Factory OEM Spec ±0.5%',
  },
  {
    id: 'brakes',
    label: 'BRAKES',
    sub: 'Brembo Stylema Calipers',
    x: 71,
    y: 76,
    score: '92% INTEGRITY · PASS',
    systemTitle: 'BREMBO STYLEMA 320MM BRAKING ARCHITECTURE',
    summary: 'Brembo Stylema monobloc calipers with Bosch Cornering ABS Pro. Rotors laser-gauged with zero thermal runout.',
    specs: [
      { label: 'Pad Thickness', value: '4.2mm Front / 4.0mm Rear (Nominal 4.5mm)' },
      { label: 'Rotor Lateral Runout', value: '< 0.015mm (OEM Max 0.10mm)' },
      { label: 'Fluid Boiling Point', value: '268°C Dry (DOT 5.1 Synthetic)' },
      { label: 'ABS Pro Calibration', value: 'Lean-Angle Decel Validated' },
    ],
    tolerance: 'Pad life 92% · Disc Wear 0.02mm',
  },
  {
    id: 'tyres',
    label: 'TYRES',
    sub: 'Pirelli Diablo Supercorsa',
    x: 33,
    y: 72,
    score: '90% TREAD · PASS',
    systemTitle: 'PIRELLI DIABLO SUPERCORSA SP V3',
    summary: 'Dual-compound racing tyres inspected with digital durometer. Uniform shoulder-to-crown wear with zero flat-spotting.',
    specs: [
      { label: 'Front Tyre (120/70)', value: '3.8mm center / 4.1mm shoulder' },
      { label: 'Rear Tyre (200/55)', value: '4.2mm center / 4.5mm shoulder' },
      { label: 'Durometer Hardness', value: '62 Shore A (Optimal grip)' },
      { label: 'Dynamic Balance', value: '< 1.5g imbalance corrected' },
    ],
    tolerance: 'Date Code 2023 · 90% Tread Depth',
  },
  {
    id: 'body',
    label: 'CHASSIS',
    sub: 'Laser Alignment 0.1mm',
    x: 56,
    y: 39,
    score: '0.1MM TOLERANCE · PASS',
    systemTitle: 'ALUMINIUM BRIDGE FRAME & M CARBON',
    summary: 'Scheibner CMS laser chassis alignment verified. Headstock angle and swingarm pivot verified 100% factory true.',
    specs: [
      { label: 'Frame Symmetry', value: 'Deviation < 0.10mm (Max 0.50mm)' },
      { label: 'Paint Gauge (Elcometer)', value: '112μm - 118μm (100% OEM Original)' },
      { label: 'Swingarm Pivot Play', value: '0.00mm Radial / Axial' },
      { label: 'M Carbon Weaves', value: 'Autoclave Pre-preg Perfect' },
    ],
    tolerance: 'Certified Accident-Free Frame',
  },
  {
    id: 'history',
    label: 'PROVENANCE',
    sub: 'Vahan Verified Zero Hypothecation',
    x: 41,
    y: 43,
    score: '100% CLEAR TITLE',
    systemTitle: 'GOVERNMENT VAHAN & LEGAL AUDIT',
    summary: 'Direct government Vahan national registry scan completed. Single-owner private registration with verified smartcard.',
    specs: [
      { label: 'RC Ownership Status', value: '1st Individual Owner (Clear RC)' },
      { label: 'Bank Hypothecation', value: 'NIL / Form 35 NOC In Hand' },
      { label: 'Crime Bureau Check', value: '100% Clean / 0 Pending Challans' },
      { label: 'Insurance Cover', value: 'Zero Depreciation Active till Nov 2026' },
    ],
    tolerance: 'Title Guaranteed by Fancy Rides India',
  },
  {
    id: 'service',
    label: 'SERVICE',
    sub: 'Dealer Digital Log',
    x: 62,
    y: 51,
    score: 'VERIFIED DIGITAL LOG',
    systemTitle: 'OFFICIAL BMW MOTORRAD SERVICE ARCHIVE',
    summary: 'All periodic service visits completed exclusively at authorized master workshops with electronic stamping.',
    specs: [
      { label: 'Running-in Inspection', value: '1,020 KM (Dealer Stamped)' },
      { label: 'Annual Scheduled Service', value: '7,850 KM (All Fluids Fresh)' },
      { label: 'OBD / DTC Diagnostics', value: '0 Stored Trouble Codes' },
      { label: 'Firmware Version', value: 'ECU 2026.02 Flashed' },
    ],
    tolerance: 'Next Service Due in 6,200 KM',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  favorites,
  onToggleFavorite,
  onOpenSellModal,
}) => {
  // Hero Carousel state
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Just In carousel scroll & index
  const justInTrackRef = useRef<HTMLDivElement>(null);
  const [justInIndex, setJustInIndex] = useState<number>(1);

  // Category track ref
  const categoryTrackRef = useRef<HTMLDivElement>(null);

  // Brand interactive hover state
  const [activeBrandIndex, setActiveBrandIndex] = useState<number>(0);

  // Performance Stats animation trigger
  const [statsVisible, setStatsVisible] = useState<boolean>(false);
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const [animatedStats, setAnimatedStats] = useState({ machines: 0, brands: 0, styles: 0, passion: 0 });

  // Inspection section hotspot active pin (null = all closed, only radar dots shown)
  const [activeInspectionPin, setActiveInspectionPin] = useState<string | null>('engine');

  // Auto-advance Hero Carousel every 5.5s unless paused
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Observer for Section 06 Performance Stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Number counting animation
  useEffect(() => {
    if (!statsVisible) return;
    const duration = 1600;
    const startTime = performance.now();

    const updateCounts = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setAnimatedStats({
        machines: Math.floor(ease * 150),
        brands: Math.floor(ease * 25),
        styles: Math.floor(ease * 8),
        passion: Math.floor(ease * 100),
      });

      if (progress < 1) {
        requestAnimationFrame(updateCounts);
      }
    };

    requestAnimationFrame(updateCounts);
  }, [statsVisible]);

  const nextHeroSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevHeroSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Just In navigation
  const scrollJustIn = (dir: 'left' | 'right') => {
    if (justInTrackRef.current) {
      const width = 380;
      justInTrackRef.current.scrollBy({ left: dir === 'left' ? -width : width, behavior: 'smooth' });
      setJustInIndex((prev) => {
        if (dir === 'left') return Math.max(1, prev - 1);
        return Math.min(6, prev + 1);
      });
    }
  };

  // Category scroll
  const scrollCategories = (dir: 'left' | 'right') => {
    if (categoryTrackRef.current) {
      categoryTrackRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  const { motorcycles } = useInventory();
  const currentHero = HERO_SLIDES[currentSlide];

  // Live bikes for Section 04 Just In
  const justInMachines = motorcycles.slice(0, 8);

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden', background: 'var(--bg-deep)' }}>
      
      {/* ==================================================
          SECTION 01 — HERO & FUNCTIONAL HERO CAROUSEL
         ================================================== */}
      <section
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '700px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
          overflow: 'hidden',
          background: 'var(--bg-primary)',
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fullscreen Carousel Background Images */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 46%',
              filter: 'brightness(0.85) contrast(110%)',
              opacity: currentSlide === idx ? 1 : 0,
              transform: currentSlide === idx ? 'scale(1.02)' : 'scale(1.06)',
              transition: 'opacity 0.9s cubic-bezier(0.25, 1, 0.5, 1), transform 6.5s ease-out',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Multi-tier Cinematic Scrims & Vignettes */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.18) 32%, rgba(5,5,5,0.55) 75%, #050505 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Directional Vignette for Left Typography Contrast */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(5,5,5,0.85) 0%, rgba(5,5,5,0.6) 38%, rgba(5,5,5,0.15) 65%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 20% 70%, rgba(255, 90, 31, 0.05) 0%, transparent 55%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Hero Content Container */}
        <div className="container-wide" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          
          {/* Technical Label (FANCY RIDES INDIA / COLLECTION 01) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span
              className="telemetry-badge accent"
              style={{
                background: 'rgba(12, 10, 8, 0.9)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 90, 31, 0.55)',
                color: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.65), 0 0 12px rgba(255, 90, 31, 0.15)',
              }}
            >
              <span className="dot" /> FANCY RIDES INDIA / COLLECTION 01
            </span>
            <span
              className="telemetry-badge"
              style={{
                background: 'rgba(10, 10, 10, 0.88)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.22)',
                color: '#F2F2EE',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.65)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span style={{ color: 'var(--accent-orange)', fontWeight: 700, letterSpacing: '0.14em' }}>
                {currentHero.brand}
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.35)', margin: '0 0.1rem' }}>·</span>
              <span style={{ color: '#E8E8E4', fontWeight: 500 }}>
                {currentHero.subtitle}
              </span>
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '2rem',
            }}
          >
            {/* Lower-Left Area Typography & Copy */}
            <div style={{ maxWidth: '820px' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: 'clamp(3.2rem, 7.5vw, 6.8rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  marginBottom: '1.5rem',
                  color: '#F5F5F2',
                  textShadow: '0 4px 24px rgba(0, 0, 0, 0.75)',
                }}
              >
                MACHINES <br />
                THAT MOVE <br />
                <span style={{ color: '#BDBDB8', textShadow: '0 4px 24px rgba(0, 0, 0, 0.75)' }}>YOU.</span>
              </h1>

              {/* Small Supporting Copy */}
              <p
                style={{
                  color: '#D4D4CE',
                  fontSize: 'clamp(0.95rem, 1.3vw, 1.12rem)',
                  lineHeight: 1.6,
                  maxWidth: '520px',
                  marginBottom: '2rem',
                  textShadow: '0 2px 14px rgba(0, 0, 0, 0.7)',
                }}
              >
                A curated collection of exceptional pre-owned motorcycles. Sourced with surgical scrutiny, certified across 150+ forensic engineering checkpoints.
              </p>

              {/* CTAs with Pill Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => onNavigate('collection')}
                  className="btn-primary"
                  data-cursor="ENTER"
                >
                  <span>EXPLORE COLLECTION</span>
                  <span className="btn-arrow">→</span>
                </button>

                <button
                  onClick={() => {
                    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-secondary"
                >
                  DISCOVER STYLES
                </button>
              </div>
            </div>

            {/* Lower-Right Area: Live Telemetry Stats & Slide Number (01 / 05) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '1.5rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {/* Dynamic Performance Specs & Live Telemetry Equalizer Motion Graphic */}
              <div
                style={{
                  background: 'rgba(17, 17, 17, 0.85)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '18px',
                  backdropFilter: 'blur(16px)',
                  padding: '1.25rem 1.75rem',
                  display: 'flex',
                  gap: '1.75rem',
                  alignItems: 'center',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.68rem', color: '#666666', display: 'block', letterSpacing: '0.1em' }}>POWER</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5F5F2' }}>
                    {currentHero.hp}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#9B9B9B', marginLeft: '4px' }}>HP</span>
                </div>

                <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.08)' }} />

                <div>
                  <span style={{ fontSize: '0.68rem', color: '#666666', display: 'block', letterSpacing: '0.1em' }}>ENGINE</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5F5F2' }}>
                    {currentHero.cc}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#9B9B9B', marginLeft: '4px' }}>CC</span>
                </div>

                <div style={{ width: '1px', height: '32px', background: 'rgba(255, 255, 255, 0.08)' }} />

                <div>
                  <span style={{ fontSize: '0.68rem', color: '#666666', display: 'block', letterSpacing: '0.1em' }}>WEIGHT</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F5F5F2' }}>
                    {currentHero.kg}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#9B9B9B', marginLeft: '4px' }}>KG</span>
                </div>
              </div>

              {/* Bottom Carousel Controls & Number (01 / 05) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={prevHeroSlide}
                    className="btn-carousel-circle"
                    title="Previous machine"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={nextHeroSlide}
                    className="btn-carousel-circle"
                    title="Next machine"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                {/* Big Slide Number Indicator */}
                <div
                  style={{
                    fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#F5F5F2',
                  }}
                >
                  <span>0{currentSlide + 1}</span>
                  <span style={{ color: '#666666' }}> / 05</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 02 — TRANSITION (LARGE TYPOGRAPHY)
         ================================================== */}
      <section
        id="section-transition"
        style={{
          padding: 'clamp(5.5rem, 10vw, 9.5rem) 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '980px', margin: '0 auto' }}>
            <span
              className="telemetry-badge accent"
              style={{ marginBottom: '1.5rem' }}
            >
              <span className="dot" /> EXPLORE BY STYLE
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: '#F5F5F2',
              }}
            >
              YOUR <br />
              KIND OF <br />
              <span style={{ color: '#9B9B9B' }}>MACHINE.</span>
            </h2>

            <p
              style={{
                color: '#9B9B9B',
                fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
                lineHeight: 1.6,
                maxWidth: '620px',
                margin: '2rem auto 0',
              }}
            >
              Whether you crave track-bred supersport apex hunting, transcontinental mountain crossings, or unbridled street fighting.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 03 — CATEGORY EXPERIENCE (EDITORIAL PANELS)
         ================================================== */}
      <section id="categories-section" style={{ padding: 'clamp(4.5rem, 8vw, 8rem) 0', position: 'relative' }}>
        <div className="container-wide">
          {/* Header & Clean Progress Indicator (01 ━━━━━━━ 07) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '3rem',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span className="telemetry-badge accent">
                  <span className="dot" /> DISCOVERY MATRIX
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666666', letterSpacing: '0.08em' }}>
                  07 DISTINCT DISCIPLINES
                </span>
              </div>

              <h2 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.2rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: '#F5F5F2' }}>
                CATEGORY <span style={{ color: '#9B9B9B' }}>EXPERIENCE.</span>
              </h2>
            </div>

            {/* Clean Progress Indicator: 01 ━━━━━━━ 07 & Arrows */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="category-progress-bar hide-on-mobile">
                <span>01</span>
                <div className="category-progress-track">
                  <div className="category-progress-fill" style={{ width: '28%' }} />
                </div>
                <span>07</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  onClick={() => scrollCategories('left')}
                  className="btn-carousel-circle"
                  title="Scroll left"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() => scrollCategories('right')}
                  className="btn-carousel-circle"
                  title="Scroll right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Track for 7 Categories */}
          <div
            ref={categoryTrackRef}
            className="carousel-track"
            style={{ paddingBottom: '2rem' }}
          >
            {CATEGORY_ITEMS.map((cat) => (
              <div
                key={cat.number}
                onClick={() => onNavigate('collection', { category: cat.name })}
                className="category-editorial-card"
                data-cursor="EXPLORE"
              >
                {/* Background Image */}
                <div
                  className="card-bg-img"
                  style={{
                    backgroundImage: `url(${cat.image})`,
                  }}
                />

                {/* Gradient Scrim */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.1) 40%, rgba(5,5,5,0.95) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                  }}
                />

                {/* Top: Category Number & Interactive Arrow Circle */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: 'rgba(255,255,255,0.4)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {cat.number}
                  </span>

                  <div className="card-arrow-bubble">
                    <ArrowUpRight size={18} />
                  </div>
                </div>

                {/* Bottom: Title & Short Description */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <h3
                    style={{
                      fontSize: '2rem',
                      fontWeight: 900,
                      letterSpacing: '-0.02em',
                      lineHeight: 1.1,
                      marginBottom: '0.45rem',
                      color: '#F5F5F2',
                    }}
                  >
                    {cat.name}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.88rem',
                      color: '#9B9B9B',
                      lineHeight: 1.45,
                      maxWidth: '90%',
                      marginBottom: '1rem',
                    }}
                  >
                    {cat.tagline}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: '#F5F5F2',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                    }}
                  >
                    <span>EXPLORE STYLES</span>
                    <ArrowRight size={12} color="var(--accent-orange)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 04 — JUST IN (HORIZONTAL INVENTORY CAROUSEL)
         ================================================== */}
      <section
        style={{
          padding: 'clamp(4.5rem, 8vw, 8rem) 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2.75rem',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  letterSpacing: '0.14em',
                  color: '#9B9B9B',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                FRESH MACHINES / HANDPICKED FOR YOU
              </span>

              <h2
                style={{
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.8rem)',
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  color: '#F5F5F2',
                }}
              >
                JUST <br />
                <span style={{ color: '#9B9B9B' }}>IN.</span>
              </h2>
            </div>

            {/* Carousel Navigation: ← 01 / 06 → */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button
                onClick={() => scrollJustIn('left')}
                className="btn-carousel-circle"
                title="Previous machine"
              >
                <ChevronLeft size={18} />
              </button>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: '#F5F5F2',
                  letterSpacing: '0.05em',
                }}
              >
                <span>0{justInIndex}</span>
                <span style={{ color: '#666666' }}> / 06</span>
              </div>

              <button
                onClick={() => scrollJustIn('right')}
                className="btn-carousel-circle"
                title="Next machine"
              >
                <ChevronRight size={18} />
              </button>

              <button
                onClick={() => onNavigate('collection')}
                className="btn-secondary"
                style={{ marginLeft: '0.5rem', padding: '10px 20px', fontSize: '0.76rem' }}
              >
                ALL INVENTORY
              </button>
            </div>
          </div>

          {/* 5-6 Large Motorcycle Cards with Generous Spacing */}
          <div ref={justInTrackRef} className="carousel-track">
            {justInMachines.map((bike) => (
              <MotorcycleCard
                key={bike.id}
                motorcycle={bike}
                onSelect={(id) => onNavigate('detail', { machineId: id })}
                isFavorite={favorites.includes(bike.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION — EXCLUSIVE VIP NUMBERS TEASER BANNER
         ================================================== */}
      <section
        style={{
          position: 'relative',
          padding: '2rem 0',
          background: 'linear-gradient(180deg, var(--bg-deep) 0%, #0F0E0C 50%, var(--bg-secondary) 100%)',
          borderTop: '1px solid rgba(255, 90, 31, 0.2)',
          borderBottom: '1px solid rgba(255, 90, 31, 0.2)',
        }}
      >
        <div className="container-wide">
          <div
            style={{
              background: 'radial-gradient(ellipse at 80% 50%, rgba(255, 90, 31, 0.12) 0%, rgba(12, 12, 12, 0.95) 75%)',
              border: '1px solid rgba(255, 90, 31, 0.35)',
              borderRadius: '24px',
              padding: 'clamp(2rem, 4vw, 3rem)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '2rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 90, 31, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
                <span className="telemetry-badge accent">
                  <span className="dot" /> VIP REGISTRATION PLATES
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#B5B5B0' }}>
                  DL · HR · PB · CH · UP
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: '#F5F5F2',
                  lineHeight: 1.1,
                  margin: '0 0 0.85rem',
                }}
              >
                CRAFTING ROAD SUPREMACY WITH <br />
                <span style={{ color: 'var(--accent-orange)' }}>SOVEREIGN VIP NUMBERS.</span>
              </h3>

              <p style={{ color: '#C0C0B8', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                Looking for iconic plates like <strong>0001</strong>, <strong>0007</strong>, <strong>9999</strong>, or <strong>8055 (BOSS)</strong> for your superbike or luxury garage? Explore our certified inventory with verified RTO NOC clearance.
              </p>
            </div>

            {/* Plates Graphic & CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  color: '#0A0A0A',
                  borderRadius: '10px',
                  padding: '10px 18px',
                  border: '2px solid #222',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                }}
              >
                <div style={{ background: '#0B3B95', color: '#fff', fontSize: '0.65rem', fontWeight: 900, padding: '3px 6px', borderRadius: '4px' }}>
                  IND
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.12em' }}>
                  DL 01 AA 0001
                </span>
              </div>

              <button
                onClick={() => onNavigate('fancy-numbers')}
                className="btn-special-cta"
                style={{ padding: '12px 24px', fontSize: '0.84rem' }}
              >
                <span>EXPLORE ALL VIP NUMBERS</span>
                <span className="cta-icon-bubble">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 05 — BRANDS (EDITORIAL INTERACTIVE ROSTER)
         ================================================== */}
      <section
        id="brands-section"
        style={{
          position: 'relative',
          padding: 'clamp(5rem, 9vw, 9rem) 0',
          overflow: 'hidden',
          minHeight: '720px',
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-secondary)',
        }}
      >
        {/* Dynamic Background Image per Hovered Brand */}
        {BRAND_DATA.map((brand, idx) => (
          <div
            key={brand.name}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${brand.bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.85) contrast(108%)',
              opacity: activeBrandIndex === idx ? 1 : 0,
              transform: activeBrandIndex === idx ? 'scale(1)' : 'scale(1.035)',
              transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s ease-out',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(6,6,6,0.96) 0%, rgba(6,6,6,0.82) 38%, rgba(6,6,6,0.3) 72%, rgba(6,6,6,0.65) 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div className="container-wide" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div className="grid-12" style={{ alignItems: 'center' }}>
            {/* Left Header */}
            <div style={{ gridColumn: 'span 5' }}>
              <span className="telemetry-badge accent" style={{ marginBottom: '1rem' }}>
                <span className="dot" /> REVERED MARQUES
              </span>

              <h2
                style={{
                  fontSize: 'clamp(2.6rem, 5vw, 4.4rem)',
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  marginBottom: '1.5rem',
                  color: '#F5F5F2',
                }}
              >
                THE BRANDS <br />
                BEHIND THE <br />
                <span style={{ color: '#9B9B9B' }}>MACHINES.</span>
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6, maxWidth: '420px', marginBottom: '2rem' }}>
                We maintain direct relationships with master technicians and premier certified collectors for each distinguished manufacturer.
              </p>

              {/* Active Brand Telemetry Indicator */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.45rem',
                  fontFamily: 'var(--font-mono)',
                  maxWidth: '380px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>ACTIVE MARQUE:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{BRAND_DATA[activeBrandIndex].origin}</span>
                </div>
                <strong style={{ fontSize: '1.2rem', color: '#F5F5F2' }}>
                  {BRAND_DATA[activeBrandIndex].name}
                </strong>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  {BRAND_DATA[activeBrandIndex].tag}
                </span>
              </div>
            </div>

            {/* Right: Large Interactive Brand List */}
            <div
              style={{
                gridColumn: 'span 7',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
              }}
            >
              {BRAND_DATA.map((brand, idx) => {
                const isActive = activeBrandIndex === idx;
                return (
                  <div
                    key={brand.name}
                    onMouseEnter={() => setActiveBrandIndex(idx)}
                    onClick={() => onNavigate('collection')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.5rem',
                      background: isActive ? 'rgba(12, 12, 12, 0.72)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--accent-orange)' : '3px solid transparent',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      backdropFilter: isActive ? 'blur(10px)' : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.8rem, 3.6vw, 3rem)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        color: isActive ? '#F5F5F2' : '#888888',
                        textShadow: '0 2px 10px rgba(0,0,0,0.85)',
                        transition: 'color 0.2s ease, transform 0.2s ease',
                        transform: isActive ? 'translateX(6px)' : 'none',
                      }}
                    >
                      {brand.name}
                    </span>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: isActive ? 'var(--text-primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        letterSpacing: '0.1em',
                        transition: 'color 0.2s',
                      }}
                    >
                      <span>VIEW INVENTORY</span>
                      <ArrowRight size={13} color="var(--accent-orange)" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 06 — PERFORMANCE STATS (EDITORIAL SPECIFICATIONS)
         ================================================== */}
      <section
        ref={statsSectionRef}
        style={{
          padding: 'clamp(5rem, 8vw, 7.5rem) 0',
          background: 'var(--bg-primary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        <div className="container-wide">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="telemetry-badge accent" style={{ marginBottom: '0.75rem' }}>
              <span className="dot" /> BY THE NUMBERS
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#F5F5F2' }}>
              PROVENANCE & SCALE.
            </h2>
          </div>

          {/* Editorial Specification Layout (No Clunky Boxes) */}
          <div className="editorial-specs-grid">
            <div className="editorial-spec-item">
              <div className="num-value">{animatedStats.machines}+</div>
              <div className="num-unit">MACHINES CERTIFIED</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Forensically curated
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{animatedStats.brands}+</div>
              <div className="num-unit">ELITE GLOBAL MARQUES</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Direct factory heritage
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{animatedStats.styles}</div>
              <div className="num-unit">DISTINCT DISCIPLINES</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Liter-class to dual-sport
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{animatedStats.passion}%</div>
              <div className="num-unit">AUTHENTICITY RATE</div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Zero compromise protocol
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 07 — WHY FANCY RIDES INDIA (4 EDITORIAL FEATURE CARDS)
         ================================================== */}
      <section style={{ padding: 'clamp(5rem, 9vw, 9rem) 0', position: 'relative' }}>
        <div className="container-wide">
          <div style={{ marginBottom: '3.5rem' }}>
            <span className="telemetry-badge accent" style={{ marginBottom: '1rem' }}>
              <span className="dot" /> THE STANDARD OF DISTINCTION
            </span>

            <h2
              style={{
                fontSize: 'clamp(2.8rem, 6vw, 5rem)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: '#F5F5F2',
              }}
            >
              NOT JUST <br />
              <span style={{ color: '#9B9B9B' }}>PRE-OWNED.</span>
            </h2>
          </div>

          {/* 4 Cards: 20px radius, #101010 surface, subtle orange edge on hover */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                num: '01',
                title: 'INSPECTED',
                desc: 'Every machine undergoes a detailed 150+ point forensic evaluation covering powertrain, chassis, and electronic ECUs.',
              },
              {
                num: '02',
                title: 'VERIFIED',
                desc: 'Ownership and documentation verified. Zero hypothecation, forensic title validation, and authentic dealer service logs.',
              },
              {
                num: '03',
                title: 'CURATED',
                desc: 'Only selected motorcycles enter the collection. Less than 8% of evaluated machines pass our acquisition standard.',
              },
              {
                num: '04',
                title: 'READY',
                desc: 'Prepared for their next rider. Fully detailed, serviced, warrantied, and ready for nationwide enclosed flatbed handover.',
              },
            ].map((feature) => (
              <div
                key={feature.num}
                style={{
                  background: 'var(--bg-surface-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-card)',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '280px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform var(--transition-smooth), border-color var(--transition-smooth), box-shadow var(--transition-smooth)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5), 0 0 20px var(--accent-orange-glow)';
                  const edge = e.currentTarget.querySelector('.card-hover-edge') as HTMLElement;
                  if (edge) edge.style.width = '100%';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-card)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  const edge = e.currentTarget.querySelector('.card-hover-edge') as HTMLElement;
                  if (edge) edge.style.width = '0%';
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: '#666666',
                  }}
                >
                  {feature.num}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.65rem', letterSpacing: '-0.02em', color: '#F5F5F2' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.55 }}>
                    {feature.desc}
                  </p>
                </div>

                {/* Subtle Orange Edge Effect on Bottom */}
                <div
                  className="card-hover-edge"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '2px',
                    width: '0%',
                    background: 'var(--accent-orange)',
                    boxShadow: '0 0 8px var(--accent-orange)',
                    transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 08 — INSPECTION VISUAL (NEUTRAL INDICATORS)
         ================================================== */}
      <section
        id="trust-section"
        style={{
          padding: 'clamp(5rem, 9vw, 9rem) 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '3rem',
              gap: '1.5rem',
            }}
          >
            <div>
              <span className="telemetry-badge accent" style={{ marginBottom: '0.75rem' }}>
                <span className="dot" /> CLINICAL DIAGNOSTIC SCAN
              </span>

              <h2
                style={{
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)',
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  color: '#F5F5F2',
                }}
              >
                150+ POINT <br />
                <span style={{ color: '#9B9B9B' }}>INSPECTION.</span>
              </h2>
            </div>

            {/* Neutral Filter / Telemetry Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {INSPECTION_PINS.map((pin) => {
                const isActive = activeInspectionPin === pin.id;
                return (
                  <button
                    key={pin.id}
                    onClick={() => setActiveInspectionPin(activeInspectionPin === pin.id ? null : pin.id)}
                    className="filter-pill-btn"
                    style={{
                      borderColor: isActive ? 'var(--accent-orange)' : undefined,
                      background: isActive ? 'var(--bg-surface-elevated)' : undefined,
                      color: isActive ? '#F5F5F2' : undefined,
                    }}
                  >
                    {isActive && <span className="active-dot" />}
                    <span>{pin.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: isActive ? 'var(--accent-orange)' : '#666666' }}>
                      {pin.score.split('·')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Large Motorcycle Visual with Clean Target Dots & Interactive Specs Card */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              maxHeight: '640px',
              minHeight: '440px',
              background: '#080808',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-container)',
              overflow: 'hidden',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?q=80&w=2000&auto=format&fit=crop"
              alt="150+ Point Certified Superbike"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.9) contrast(108%)',
              }}
            />

            {/* Gradient Scrim */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(5,5,5,0.42) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Top Right Instruction Pill */}
            <div
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(8, 8, 8, 0.78)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '999px',
                padding: '0.35rem 0.85rem',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-secondary)',
                zIndex: 20,
              }}
            >
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-orange)' }} />
              <span>INTERACTIVE INSPECTION STAGE</span>
            </div>

            {/* Clean Pulsing Interactive Target Dots */}
            {INSPECTION_PINS.map((pin) => {
              const isSelected = activeInspectionPin === pin.id;
              return (
                <div
                  key={pin.id}
                  style={{
                    position: 'absolute',
                    top: `${pin.y}%`,
                    left: `${pin.x}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 25 : 15,
                  }}
                >
                  {/* Expanding Radar Ping Ripple */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: isSelected ? '1.5px solid var(--accent-orange)' : '1px solid rgba(255, 255, 255, 0.25)',
                      animation: 'radarPing 2.4s infinite cubic-bezier(0.25, 1, 0.5, 1)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Core Interactive Dot Button */}
                  <button
                    onClick={() => setActiveInspectionPin(activeInspectionPin === pin.id ? null : pin.id)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isSelected ? 'var(--accent-orange)' : 'rgba(12, 12, 12, 0.9)',
                      border: isSelected ? '2px solid #FFFFFF' : '1.5px solid rgba(255, 255, 255, 0.38)',
                      boxShadow: isSelected
                        ? '0 0 25px var(--accent-orange), 0 0 10px #FFFFFF'
                        : '0 4px 14px rgba(0, 0, 0, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isSelected ? 'scale(1.18)' : 'scale(1)',
                      padding: 0,
                    }}
                    title={`Click to inspect ${pin.label} specs`}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: isSelected ? '#000000' : '#FFFFFF',
                        transition: 'background 0.2s',
                      }}
                    />
                  </button>

                  {/* Micro-Label Badge (Clean, non-intrusive) */}
                  <div
                    onClick={() => setActiveInspectionPin(activeInspectionPin === pin.id ? null : pin.id)}
                    style={{
                      position: 'absolute',
                      left: '34px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: isSelected ? '#161616' : 'rgba(10, 10, 10, 0.78)',
                      border: isSelected ? '1px solid var(--accent-orange)' : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '999px',
                      padding: '0.22rem 0.65rem',
                      backdropFilter: 'blur(8px)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        color: isSelected ? '#F5F5F2' : 'var(--text-secondary)',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {pin.label}
                    </span>
                    {isSelected && (
                      <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-orange)' }} />
                    )}
                  </div>
                </div>
              );
            })}

            {/* When A Dot Is Clicked: High-Tech Forensic Specs HUD Card */}
            {(() => {
              const activePin = INSPECTION_PINS.find((p) => p.id === activeInspectionPin);
              const activePinIndex = INSPECTION_PINS.findIndex((p) => p.id === activeInspectionPin);

              if (activePin) {
                return (
                  <div
                    className="inspection-spec-hud-card"
                    style={{
                      position: 'absolute',
                      bottom: '1.5rem',
                      right: '1.5rem',
                      maxWidth: '440px',
                      width: 'calc(100% - 3rem)',
                      background: 'rgba(10, 10, 10, 0.94)',
                      border: '1px solid rgba(255, 90, 31, 0.45)',
                      borderRadius: '20px',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      padding: '1.5rem 1.65rem',
                      boxShadow: '0 24px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 90, 31, 0.12)',
                      zIndex: 35,
                      animation: 'fadeIn 0.25s ease',
                    }}
                  >
                    {/* Header Row: Checkpoint Number & Close Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <ShieldCheck size={13} color="var(--accent-orange)" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent-orange)' }}>
                          DIAGNOSTIC CHECKPOINT 0{activePinIndex + 1} / 06
                        </span>
                      </div>

                      <button
                        onClick={() => setActiveInspectionPin(null)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#F5F5F2';
                          e.currentTarget.style.borderColor = 'var(--accent-orange)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        }}
                        title="Close specs"
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {/* System Title */}
                    <h4
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        lineHeight: 1.15,
                        color: '#F5F5F2',
                        letterSpacing: '-0.02em',
                        marginBottom: '0.45rem',
                      }}
                    >
                      {activePin.systemTitle}
                    </h4>

                    {/* Score / Status Pill & Tolerance */}
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '0.85rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#F5F5F2',
                          background: '#161616',
                          border: '1px solid rgba(255, 90, 31, 0.4)',
                          borderRadius: '999px',
                          padding: '0.2rem 0.65rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-orange)' }} />
                        {activePin.score}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#9B9B9B', fontFamily: 'var(--font-mono)' }}>
                        {activePin.tolerance}
                      </span>
                    </div>

                    {/* Forensic Summary */}
                    <p
                      style={{
                        fontSize: '0.82rem',
                        lineHeight: 1.5,
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                        paddingBottom: '0.85rem',
                      }}
                    >
                      {activePin.summary}
                    </p>

                    {/* 4 Technical Verified Specs */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.15rem' }}>
                      {activePin.specs.map((spec, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.76rem',
                            padding: '0.25rem 0',
                            borderBottom: i < activePin.specs.length - 1 ? '1px solid rgba(255, 255, 255, 0.04)' : 'none',
                          }}
                        >
                          <span style={{ color: 'var(--text-secondary)' }}>{spec.label}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#F5F5F2' }}>
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Navigation Actions Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
                      <button
                        onClick={() => {
                          const prevIdx = (activePinIndex - 1 + INSPECTION_PINS.length) % INSPECTION_PINS.length;
                          setActiveInspectionPin(INSPECTION_PINS[prevIdx].id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F2')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                      >
                        <ChevronLeft size={13} /> PREV POINT
                      </button>

                      <button
                        onClick={() => {
                          const nextIdx = (activePinIndex + 1) % INSPECTION_PINS.length;
                          setActiveInspectionPin(INSPECTION_PINS[nextIdx].id);
                        }}
                        style={{
                          background: '#161616',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '999px',
                          color: '#F5F5F2',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.35rem 0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-orange)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                      >
                        <span>NEXT POINT</span>
                        <ArrowRight size={12} color="var(--accent-orange)" />
                      </button>
                    </div>
                  </div>
                );
              }

              // Default state when no dot is selected: sleek helper prompt
              return (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.5rem',
                    left: '1.5rem',
                    background: 'rgba(10, 10, 10, 0.88)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '999px',
                    padding: '0.55rem 1.15rem',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: '#F5F5F2',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                    zIndex: 20,
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-orange)' }} />
                  <span>CLICK ANY TARGET DOT TO REVEAL FORENSIC DIAGNOSTIC SPECS</span>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 09 — FEATURED MACHINE (FULL-WIDTH SPOTLIGHT)
         ================================================== */}
      <section
        style={{
          padding: 'clamp(5rem, 9vw, 9rem) 0',
          position: 'relative',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-primary)',
        }}
      >
        <div className="container-wide">
          <div className="grid-12" style={{ alignItems: 'center' }}>
            
            {/* Left Column: Machine Telemetry, Specs & Special CTA */}
            <div style={{ gridColumn: 'span 5', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.85rem' }}>
                <span className="telemetry-badge accent">
                  <span className="dot" /> HALLMARK SELECTION
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  STOCK NO. FR-001
                </span>
              </div>

              {/* Brand & Model */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.14em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  marginBottom: '0.2rem',
                }}
              >
                ROYAL ENFIELD
              </div>

              <h2
                style={{
                  fontSize: 'clamp(2.8rem, 5vw, 4.4rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.5rem',
                  color: '#F5F5F2',
                }}
              >
                INTERCEPTOR 650
              </h2>

              {/* Editorial Specification Numbers (Without Clunky Boxes) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  padding: '1.35rem 0',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: '#F5F5F2' }}>
                    47
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#9B9B9B', letterSpacing: '0.1em' }}>
                    HP
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: '#F5F5F2' }}>
                    648
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#9B9B9B', letterSpacing: '0.1em' }}>
                    CC
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: 800, color: '#F5F5F2' }}>
                    52
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#9B9B9B', letterSpacing: '0.1em' }}>
                    NM
                  </div>
                </div>
              </div>

              {/* Metadata: 2021 · 7,000 KM · 1ST OWNER */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.75rem',
                }}
              >
                <span>2021</span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span>7,000 KM</span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span style={{ color: '#F5F5F2' }}>1ST OWNER</span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span>PUNJAB</span>
              </div>

              {/* Price: ₹2.39 L & Special CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block' }}>
                    ACQUISITION PRICE
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      color: '#F5F5F2',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      marginTop: '0.2rem',
                    }}
                  >
                    ₹2,39,000
                  </div>
                </div>

                {/* Special CTA Button: Dark charcoal with small orange circular icon area on the right */}
                <button
                  onClick={() => onNavigate('detail', { machineId: 're-interceptor-650-2021' })}
                  className="btn-special-cta"
                  data-cursor="INSPECT"
                >
                  <span>EXPLORE MACHINE</span>
                  <span className="cta-icon-bubble">
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </span>
                </button>
              </div>
            </div>

            {/* Right Column: Full-Width Prominent Image with 20px Radius */}
            <div style={{ gridColumn: 'span 7', position: 'relative' }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  background: 'radial-gradient(ellipse at center, #181818 0%, #060606 100%)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/images/IMG_0195.JPG"
                  alt="Royal Enfield Interceptor 650 Featured Machine"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    right: '1.25rem',
                    background: 'rgba(8, 8, 8, 0.85)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '999px',
                    padding: '0.45rem 0.95rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: '#9B9B9B',
                  }}
                >
                  [TELEMETRY: RED ROOSTER EXHAUST / HOLLYWOOD BARS]
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 10 — FINAL CTA (CINEMATIC CLOSING HERO)
         ================================================== */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(6rem, 11vw, 12rem) 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        {/* Full Cinematic Motorcycle Backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2200&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 60%',
            filter: 'brightness(0.72) contrast(110%)',
            zIndex: 0,
          }}
        />

        {/* Gradient Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.85) 90%)',
            zIndex: 1,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '960px' }}>
          <span className="telemetry-badge accent" style={{ marginBottom: '1.5rem' }}>
            <span className="dot" /> YOUR CHAPTER BEGINS
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(3.2rem, 7.5vw, 6.8rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: '2.5rem',
              color: '#F5F5F2',
            }}
          >
            FIND THE <br />
            MACHINE <br />
            <span style={{ color: '#9B9B9B' }}>THAT FITS YOU.</span>
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center' }}>
            <button
              onClick={() => onNavigate('collection')}
              className="btn-primary"
              style={{ padding: '14px 32px' }}
            >
              <span>EXPLORE COLLECTION</span>
              <span className="btn-arrow">→</span>
            </button>

            <button
              onClick={onOpenSellModal}
              className="btn-secondary"
              style={{ padding: '14px 32px' }}
            >
              SELL YOUR RIDE →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

