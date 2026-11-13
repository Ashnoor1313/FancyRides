import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MOTORCYCLES } from '../data/motorcycles';
import type { Motorcycle } from '../data/motorcycles';
import { MotorcycleCard } from '../components/MotorcycleCard';
import { Machine360Viewer } from '../components/Machine360Viewer';
import { EMICalculator } from '../components/EMICalculator';
import {
  ArrowLeft,
  Heart,
  ShieldCheck,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Share2,
  FileCheck,
  Activity,
  Calendar,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface MachineDetailPageProps {
  machineId: string;
  onBack: () => void;
  onSelectMachine: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenBooking: (motorcycle: Motorcycle) => void;
}

export const MachineDetailPage: React.FC<MachineDetailPageProps> = ({
  machineId,
  onBack,
  onSelectMachine,
  favorites,
  onToggleFavorite,
  onOpenBooking,
}) => {
  // Always resolve machine, default to first available
  const motorcycle =
    MOTORCYCLES.find((m) => m.id === machineId) ||
    MOTORCYCLES[0];

  const galleryViews = useMemo(() => {
    if (motorcycle.images && motorcycle.images.length > 0) {
      const interceptorCaptions: Record<number, string> = {
        0: 'Front 3/4 Stance',
        1: 'Right Profile & Red Rooster Exhaust',
        2: 'Direct Front Stance & Hollywood Bars',
        3: 'Red Rooster Performance Exhaust Pipe',
        4: 'Polished Dual Chrome Exhaust Canisters',
        5: '648cc Parallel-Twin Engine Architecture',
        6: 'Hollywood Custom Wide Handlebars',
        7: 'Classic Twin Dial Cockpit & Switchgear',
        8: 'Front Brembo/ByBre Disc & Fork Stance',
        9: 'Rear 3/4 Angle & 4-Way Hazard Flasher',
        10: 'Fresh Rear Tyre Tread Profile',
        11: 'Orange & Black Teardrop Fuel Tank',
      };
      const hd48Captions: Record<number, string> = {
        0: 'Front 3/4 Stance & Vivid Yellow Peanut Tank',
        1: 'Low Ground Stance & Fat Front Shinko Tyre',
        2: 'Full Side Profile & Vance & Hines Pipes',
        3: 'Rear Stance, Pillion Seat & Side Mount Plate',
        4: 'Direct Front View & Custom Headlamp Grill',
        5: 'Bobber Cockpit & Aftermarket Hand Grips',
        6: 'Rear Wheel & Vance & Hines Exhaust Detail',
        7: '1202cc Evolution Engine & Chrome Guard',
        8: 'Peanut Fuel Tank Detail',
        9: 'Powertrain Close-Up & Oil Tank',
        10: 'Road Presence & Low Slung Stance',
      };
      const fatbobCaptions: Record<number, string> = {
        0: 'Hero Three-Quarter Stance & Signature Dual Headlamps',
        1: 'Direct Front View with Fancy Rides India Plaque',
        2: 'Muscular Rear 3/4 Profile & Vance & Hines Shortshots',
        3: 'Side Profile, Dual Shocks & Black Slotted Wheels',
        4: 'Cockpit View, Drag Bar & Dual Fuel Tank Console',
        5: 'Vance & Hines Badge & Slash-Cut Performance Exhaust',
      };
      const hayabusaCaptions: Record<number, string> = {
        0: 'Hero Three-Quarter Stance & Carbon Hydrodipped Front Aero',
        1: 'Full Aerodynamic Side Profile & US-Imported M4 Full System',
        2: 'Rear Three-Quarter Stance with Illuminated LED Taillights',
        3: 'Aggressive Front Fascia with Ram-Air Ducts & Fancy Rides Plaque',
        4: 'M4 US-Imported Performance Full System Exhaust Canister (₹3L)',
        5: 'Brembo Stylema Radial Monobloc Caliper & 320mm Floating Disc',
        6: 'Cockpit View, Clip-Ons, S.I.R.S. TFT Display & 3D Tank Pad',
        7: 'Aerodynamic Tail Cowl, Swingarm & Battlax S22 Rear Tyre',
        8: 'Side Fairing Profile, R&G Frame Slider & Kanji Aerodynamics',
        9: 'Rear High Perspective, Aerodynamic Single-Seat Cowl & Tank Grips',
        10: 'Overhead Birdseye View of Sculpted 20L Fuel Tank & Cockpit',
        11: 'Signature Hayabusa Kanji Graphic & Carbon-Weave Fairing Intake',
        12: 'High Three-Quarter Stance Showing Factory Untouched Condition',
      };
      const angleCaptions = motorcycle.id.includes('hayabusa')
        ? hayabusaCaptions
        : motorcycle.id.includes('fat-bob')
        ? fatbobCaptions
        : motorcycle.id.includes('forty-eight')
        ? hd48Captions
        : interceptorCaptions;
      return motorcycle.images.map((src, i) => ({
        id: String(i + 1).padStart(2, '0'),
        label: `${String(i + 1).padStart(2, '0')} — ${angleCaptions[i] || 'Inspection View'}`,
        caption: angleCaptions[i] || `Forensic Archive Image #${i + 1}`,
        src,
      }));
    }
    return [
      { id: '01', label: '01 — Hero Stance', caption: 'Front Three Quarter Profile', src: '/images/IMG_0195.JPG' }
    ];
  }, [motorcycle]);

  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const isFav = favorites.includes(motorcycle.id);

  // Performance numbers animation on viewport entry
  const [numbersVisible, setNumbersVisible] = useState<boolean>(false);
  const numbersSectionRef = useRef<HTMLDivElement>(null);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    hp: 0,
    cc: 0,
    nm: 0,
    kg: 0,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNumbersVisible(true);
        }
      },
      { threshold: 0.25 }
    );

    if (numbersSectionRef.current) {
      observer.observe(numbersSectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!numbersVisible) return;
    const duration = 1400;
    const startTime = performance.now();

    const targetHP = motorcycle.horsepower || 193;
    const targetCC = motorcycle.engineCC || 999;
    const targetNM = motorcycle.torque || 110;
    const targetKG = motorcycle.weight || 197;

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setAnimatedNumbers({
        hp: Math.floor(ease * targetHP),
        cc: Math.floor(ease * targetCC),
        nm: Math.floor(ease * targetNM),
        kg: Math.floor(ease * targetKG),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [numbersVisible, motorcycle]);

  // Gallery Navigation controls
  const nextGalleryImage = () => {
    setActiveGalleryIndex((prev) => (prev + 1) % galleryViews.length);
  };

  const prevGalleryImage = () => {
    setActiveGalleryIndex((prev) => (prev - 1 + galleryViews.length) % galleryViews.length);
  };

  // Related machines (3 machines)
  const relatedBikes = MOTORCYCLES.filter(
    (b) => b.id !== motorcycle.id
  ).slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${motorcycle.brand} ${motorcycle.model} | Fancy Rides`,
          text: `Explore this verified ${motorcycle.year} ${motorcycle.brand} ${motorcycle.model} on Fancy Rides.`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Showroom link copied to clipboard.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '110px',
        paddingBottom: '8rem',
        background: 'var(--bg-primary)',
        position: 'relative',
        color: 'var(--text-primary)',
      }}
    >
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5,5,5,0.96)',
            backdropFilter: 'blur(20px)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
          onClick={() => setLightboxOpen(false)}
        >
          <img
            src={galleryViews[activeGalleryIndex]?.src || motorcycle.images[0]}
            alt={galleryViews[activeGalleryIndex]?.caption || motorcycle.model}
            style={{ maxWidth: '92vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}
          />
          <div style={{ marginTop: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {galleryViews[activeGalleryIndex]?.label} — {galleryViews[activeGalleryIndex]?.caption}
          </div>
          <button
            onClick={() => setLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2.5rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Breadcrumb & Navigation Bar */}
      <div className="container-wide" style={{ marginBottom: '2.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <button
            onClick={onBack}
            className="btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.74rem' }}
          >
            <ArrowLeft size={14} /> BACK TO COLLECTION
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <span className="telemetry-badge accent">
              <span className="dot" /> STOCK ID: {motorcycle.id.includes('hayabusa') ? 'FR-004-SZ' : motorcycle.id.includes('fat-bob') ? 'FR-003-HD' : motorcycle.id.includes('forty-eight') ? 'FR-002-HD' : 'FR-001-RE'}
            </span>
            <button
              onClick={handleShare}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F2')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              title="Share dossier"
            >
              <Share2 size={14} /> SHARE
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          SECTION 01: HERO (IMMERSIVE SPLIT-SCREEN)
         ================================================== */}
      <section style={{ marginBottom: 'clamp(5rem, 8vw, 8rem)' }}>
        <div className="container-wide">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: 'clamp(2rem, 4vw, 4rem)',
              alignItems: 'center',
            }}
          >
            {/* LEFT: Large Motorcycle Image Gallery View with 20px Radius */}
            <div
              style={{
                gridColumn: 'span 7',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  maxHeight: '620px',
                  background: 'radial-gradient(ellipse at center, #181818 0%, #060606 100%)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={galleryViews[0]?.src || motorcycle.images[0]}
                  alt={`${motorcycle.brand} ${motorcycle.model}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    padding: '8px',
                    filter: 'contrast(104%) brightness(1)',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Scrim Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 65%, rgba(5,5,5,0.4) 100%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Badges on Hero Image */}
                <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 2, display: 'flex', gap: '0.5rem' }}>
                  <span
                    style={{
                      background: '#161616',
                      border: '1px solid rgba(255, 90, 31, 0.4)',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.64rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      padding: '0.28rem 0.65rem',
                      textTransform: 'uppercase',
                      borderRadius: '999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-orange)' }} />
                    150+ PT CERTIFIED
                  </span>
                  <span
                    style={{
                      background: 'rgba(10, 10, 10, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(8px)',
                      color: '#9B9B9B',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.64rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      padding: '0.28rem 0.65rem',
                      textTransform: 'uppercase',
                      borderRadius: '999px',
                    }}
                  >
                    {motorcycle.ownerDisplay} · {motorcycle.condition}
                  </span>
                </div>

                {/* Zoom Inspection Button */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  style={{
                    position: 'absolute',
                    bottom: '1.25rem',
                    right: '1.25rem',
                    background: 'rgba(10, 10, 10, 0.85)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    padding: '0.45rem 0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    zIndex: 2,
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-orange)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-medium)')}
                >
                  <Maximize2 size={12} color="var(--accent-orange)" />
                  INSPECT HIGH-RES
                </button>
              </div>
            </div>

            {/* RIGHT: Machine Information Panel */}
            <div style={{ gridColumn: 'span 5' }}>
              
              {/* Brand */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '0.16em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                {motorcycle.brand}
              </div>

              {/* Model */}
              <h1
                style={{
                  fontSize: 'clamp(2.8rem, 5vw, 4.6rem)',
                  lineHeight: 0.95,
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '0.85rem',
                  color: '#F5F5F2',
                }}
              >
                {motorcycle.model}
              </h1>

              {/* Tagline / Subtitle */}
              <p
                style={{
                  color: '#9B9B9B',
                  fontSize: 'clamp(0.95rem, 1.25vw, 1.05rem)',
                  lineHeight: 1.55,
                  maxWidth: '480px',
                  marginBottom: '1.5rem',
                }}
              >
                {motorcycle.tagline || motorcycle.description}
              </p>

              {/* Price Display (Restrained Typography, Not In A Coloured Badge) */}
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                  CERTIFIED ACQUISITION PRICE
                </span>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(2.4rem, 3.8vw, 3.4rem)',
                    fontWeight: 900,
                    color: '#F5F5F2',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginTop: '0.2rem',
                  }}
                >
                  {motorcycle.priceDisplay}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                  INCLUSIVE OF 150+ POINT AUDIT · 12-MONTH WARRANTY · TITLE TRANSFER
                </span>
              </div>

              {/* Provenance Strip: 2023 · 8,400 KM · 1ST OWNER */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  padding: '1.15rem 0',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '2rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                <span>{motorcycle.year}</span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span>{motorcycle.kmDisplay}</span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span style={{ color: '#F5F5F2' }}>{motorcycle.ownerDisplay}</span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span>{motorcycle.location}</span>
              </div>

              {/* Buttons: ENQUIRE NOW (Special CTA with Orange Circle) & BOOK A VIEWING */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem' }}>
                  {/* Special CTA Button: Dark charcoal background with small orange circular icon area on the right */}
                  <button
                    onClick={() => onOpenBooking(motorcycle)}
                    className="btn-special-cta"
                    style={{ flex: 1 }}
                  >
                    <span>ENQUIRE ABOUT THIS MACHINE</span>
                    <span className="cta-icon-bubble">
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </span>
                  </button>

                  <button
                    onClick={(e) => onToggleFavorite(motorcycle.id, e)}
                    style={{
                      width: '52px',
                      height: '52px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: '50%',
                      color: isFav ? 'var(--accent-orange)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    title="Save to Garage"
                  >
                    <Heart size={18} fill={isFav ? 'var(--accent-orange)' : 'none'} />
                  </button>
                </div>

                <button
                  onClick={() => onOpenBooking(motorcycle)}
                  className="btn-secondary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  BOOK A VIEWING
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 02: IMAGE GALLERY (6 VIEWS + THUMBNAILS)
         ================================================== */}
      <section
        style={{
          padding: 'clamp(4rem, 7vw, 6.5rem) 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 'clamp(5rem, 8vw, 8rem)',
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="telemetry-badge accent" style={{ marginBottom: '0.5rem' }}>
                <span className="dot" /> FORENSIC VISUAL ARCHIVE
              </span>
              <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#F5F5F2' }}>
                IMAGE <span style={{ color: '#9B9B9B' }}>GALLERY.</span>
              </h2>
            </div>

            {/* Next / Previous Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={prevGalleryImage}
                className="btn-carousel-circle"
                title="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 800, color: '#F5F5F2' }}>
                <span>{String(activeGalleryIndex + 1).padStart(2, '0')}</span> / {String(galleryViews.length).padStart(2, '0')}
              </span>

              <button
                onClick={nextGalleryImage}
                className="btn-carousel-circle"
                title="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Main Stage Gallery Image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 3',
              maxHeight: '640px',
              background: 'radial-gradient(ellipse at center, #181818 0%, #060606 100%)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={galleryViews[activeGalleryIndex]?.src || motorcycle.images[0]}
              alt={galleryViews[activeGalleryIndex]?.caption || motorcycle.model}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                padding: '12px',
                filter: 'brightness(1) contrast(104%)',
                transition: 'transform 0.4s ease, opacity 0.3s ease',
              }}
            />

            {/* Bottom Caption Pill */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                background: 'rgba(8, 8, 8, 0.88)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px',
                padding: '0.5rem 1.1rem',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#F5F5F2', fontWeight: 700 }}>
                {galleryViews[activeGalleryIndex]?.label}
              </span>
              <span style={{ width: '1px', height: '12px', background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {galleryViews[activeGalleryIndex]?.caption}
              </span>
            </div>
          </div>

          {/* Thumbnail Navigation Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '0.75rem',
            }}
          >
            {galleryViews.map((view, idx) => {
              const isActive = activeGalleryIndex === idx;
              return (
                <div
                  key={view.id}
                  onClick={() => setActiveGalleryIndex(idx)}
                  style={{
                    position: 'relative',
                    aspectRatio: '16 / 10',
                    background: '#090909',
                    border: isActive ? '1.5px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  <img
                    src={view.src}
                    alt={view.label}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#090909' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'rgba(0,0,0,0.85)',
                      padding: '2px 4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      color: isActive ? '#F5F5F2' : 'var(--text-secondary)',
                      textAlign: 'center',
                    }}
                  >
                    {view.id}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 03: PERFORMANCE SECTION (EDITORIAL THE NUMBERS)
         ================================================== */}
      <section
        ref={numbersSectionRef}
        style={{
          padding: 'clamp(5rem, 8vw, 7.5rem) 0',
          position: 'relative',
          marginBottom: 'clamp(5rem, 8vw, 8rem)',
        }}
      >
        <div className="container-wide">
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
              <span className="telemetry-badge accent" style={{ marginBottom: '0.75rem' }}>
                <span className="dot" /> DYNAMOMETER TELEMETRY
              </span>
              <h2
                style={{
                  fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
                  fontWeight: 900,
                  lineHeight: 0.95,
                  letterSpacing: '-0.04em',
                  color: '#F5F5F2',
                }}
              >
                THE <br />
                <span style={{ color: '#9B9B9B' }}>NUMBERS.</span>
              </h2>
            </div>

            <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Benchmarked on our calibrated Mustang Dyno. All output verified to meet or exceed factory manufacturer tolerances.
            </p>
          </div>

          {/* Editorial Specification Layout (No Clunky Boxes, Thin Divider Lines) */}
          <div className="editorial-specs-grid">
            <div className="editorial-spec-item">
              <div className="num-value">{animatedNumbers.hp}</div>
              <div className="num-unit">HORSEPOWER (HP)</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                {motorcycle.id.includes('hayabusa') ? '@ 9,700 RPM' : motorcycle.id.includes('fat-bob') ? '@ 5,010 RPM' : motorcycle.id.includes('forty-eight') ? '@ 6,000 RPM' : '@ 7,150 RPM'}
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{animatedNumbers.cc}</div>
              <div className="num-unit">DISPLACEMENT (CC)</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                {motorcycle.id.includes('hayabusa') ? 'Inline-Four DOHC 16V' : motorcycle.id.includes('fat-bob') ? 'Twin Cam 96 V-Twin' : motorcycle.id.includes('forty-eight') ? 'Evolution V-Twin' : 'Parallel-Twin'}
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{animatedNumbers.nm}</div>
              <div className="num-unit">TORQUE (NM)</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                {motorcycle.id.includes('hayabusa') ? '@ 7,000 RPM Peak' : motorcycle.id.includes('fat-bob') ? '@ 3,500 RPM Peak' : motorcycle.id.includes('forty-eight') ? '@ 3,500 RPM Peak' : '@ 5,150 RPM Peak'}
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{animatedNumbers.kg}</div>
              <div className="num-unit">KERB WEIGHT (KG)</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                {motorcycle.id.includes('hayabusa') ? 'Hyperbike Aero Stance' : motorcycle.id.includes('fat-bob') ? 'Muscle Cruiser Stance' : motorcycle.id.includes('forty-eight') ? 'Low Bobber Stance' : 'Roadster Stance'}
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{motorcycle.id.includes('forty-eight') ? '5-SPD' : '6-SPD'}</div>
              <div className="num-unit">TRANSMISSION</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                {motorcycle.id.includes('hayabusa') ? 'Bi-Directional Quickshifter' : motorcycle.id.includes('fat-bob') ? '6-Speed Cruise Drive' : motorcycle.id.includes('forty-eight') ? 'Belt Drive' : 'Slipper & Assist Clutch'}
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{motorcycle.specs.fuelTank}</div>
              <div className="num-unit">FUEL CAPACITY</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                {motorcycle.id.includes('hayabusa') ? '20.0L Sculpted Aero Tank' : motorcycle.id.includes('fat-bob') ? '5.0-Gal Dual Fat Bob Tank' : motorcycle.id.includes('forty-eight') ? 'Iconic 2.1-Gal Peanut Tank' : 'Classic Teardrop Tank'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 04: MACHINE STORY (EDITORIAL)
         ================================================== */}
      <section
        style={{
          padding: 'clamp(5rem, 8vw, 8rem) 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 'clamp(5rem, 8vw, 8rem)',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
            <span className="telemetry-badge accent" style={{ marginBottom: '1.5rem' }}>
              <span className="dot" /> EDITORIAL PERSPECTIVE
            </span>

            <h2
              style={{
                fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                marginBottom: '2rem',
                color: '#F5F5F2',
              }}
            >
              BUILT FOR <br />
              THE <br />
              <span style={{ color: '#9B9B9B' }}>OPEN ROAD.</span>
            </h2>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
                lineHeight: 1.7,
                color: '#F5F5F2',
                marginBottom: '1.75rem',
              }}
            >
              {motorcycle.description}
            </p>

            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: '#9B9B9B',
                letterSpacing: '0.08em',
              }}
            >
              SOURCED FROM PRIVATE COLLECTOR GARAGE · ZERO TRACK CRASHES · DEALER AUDITED
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 05: MACHINE DETAILS (TECHNICAL SPECIFICATION BLUEPRINT)
         ================================================== */}
      {/* ==================================================
          SECTION 05: MACHINE DETAILS (TECHNICAL SPECIFICATIONS)
         ================================================== */}
      <section style={{ marginBottom: 'clamp(5rem, 8vw, 8rem)' }}>
        <div className="container-wide">
          {/* Header */}
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="telemetry-badge accent" style={{ marginBottom: '0.6rem' }}>
              <span className="dot" /> SPECIFICATION BLUEPRINT
            </span>
            <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#F5F5F2' }}>
              MACHINE <span style={{ color: '#9B9B9B' }}>DETAILS.</span>
            </h2>
          </div>

          {/* Clean, Spacious 4-Column Specification Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            {[
              { label: 'BRAND', val: motorcycle.brand },
              { label: 'MODEL', val: motorcycle.model },
              { label: 'VARIANT', val: motorcycle.variant },
              { label: 'YEAR', val: `${motorcycle.year}` },
              { label: 'REGISTRATION', val: motorcycle.registration },
              { label: 'KILOMETRES', val: motorcycle.kmDisplay || `${motorcycle.kilometres.toLocaleString()} KM` },
              { label: 'OWNERS', val: motorcycle.ownerDisplay || `${motorcycle.owners} Owner` },
              { label: 'FUEL', val: motorcycle.fuelType || 'Petrol' },
              { label: 'TRANSMISSION', val: motorcycle.transmission },
              { label: 'ENGINE', val: motorcycle.specs.engineType },
              {
                label: 'LOCATION',
                val: motorcycle.location ? `${motorcycle.location} Vault` : 'Certified Vault',
              },
              {
                label: 'EXHAUST SYSTEM',
                val: motorcycle.specs.exhaust || (motorcycle.id.includes('forty-eight') ? 'Vance & Hines Performance Exhaust System' : 'Red Rooster Performance Original Exhaust'),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="spec-blueprint-cell"
                style={{
                  background: '#0B0B0B',
                  padding: '2.4rem 2.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: '115px',
                  transition: 'background 0.25s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#666666',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: '0.65rem',
                    display: 'block',
                  }}
                >
                  {item.label}
                </span>
                <span
                  className="spec-val-text"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.12rem',
                    fontWeight: 700,
                    color: '#F5F5F2',
                    lineHeight: 1.35,
                    letterSpacing: '-0.01em',
                    transition: 'color 0.25s ease',
                  }}
                >
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 06: CONDITION / INSPECTION (NEUTRAL INDICATORS)
         ================================================== */}
      <section
        style={{
          padding: 'clamp(5rem, 8vw, 8rem) 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 'clamp(5rem, 8vw, 8rem)',
        }}
      >
        <div className="container-wide">
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
              <span className="telemetry-badge accent" style={{ marginBottom: '0.6rem' }}>
                <span className="dot" /> CLINICAL VERIFICATION
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
                MACHINE <br />
                <span style={{ color: '#9B9B9B' }}>REPORT.</span>
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="health-score-pill">
                OVERALL HEALTH SCORE: <span style={{ color: 'var(--accent-orange)' }}>98/100</span>
              </div>
            </div>
          </div>

          {/* Condition Indicators: Interactive Diagnostics Matrix */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* ENGINE EXCELLENT */}
            <div className="machine-report-card" data-cursor="INSPECT">
              <div className="report-card-top">
                <span className="report-card-label">POWERTRAIN AUDIT</span>
                <span className="report-card-status">EXCELLENT</span>
              </div>
              <h3 className="report-card-title">ENGINE</h3>
              <div className="report-card-bar-track">
                <div className="report-card-bar-fill" style={{ width: `${motorcycle.inspectionScore.powertrain}%` }} />
              </div>
              <p className="report-card-desc">
                {motorcycle.id.includes('hayabusa')
                  ? '1340cc In-line 4 DOHC with 12.5:1 compression. M4 US Full System, pristine factory cylinder balancing with only 3,700 genuine KM.'
                  : motorcycle.id.includes('fat-bob')
                  ? '1585cc (96 cu in) Twin Cam V-Twin with 9.2:1 compression. ESPFI fuel injection balanced with zero oil seepage.'
                  : motorcycle.id.includes('forty-eight')
                  ? '1202cc Evolution V-Twin with 10.0:1 compression. Valvetrain and pushrods factory-balanced with zero oil seepage.'
                  : '648cc Parallel-Twin with 9.5:1 compression. Balanced compression across both cylinders with zero oil seepage.'}
              </p>
            </div>

            {/* BRAKES */}
            <div className="machine-report-card" data-cursor="INSPECT">
              <div className="report-card-top">
                <span className="report-card-label">STOPPING POWER</span>
                <span className="report-card-status">{motorcycle.inspectionScore.tyresBrakes}% INTEGRITY</span>
              </div>
              <h3 className="report-card-title">BRAKES</h3>
              <div className="report-card-bar-track">
                <div className="report-card-bar-fill" style={{ width: `${motorcycle.inspectionScore.tyresBrakes}%` }} />
              </div>
              <p className="report-card-desc">
                {motorcycle.id.includes('hayabusa')
                  ? 'Dual Brembo Stylema 4-piston radial monobloc calipers with 320mm floating discs & Motion Track ABS. Benchmark stopping power with 98% life.'
                  : motorcycle.id.includes('fat-bob')
                  ? 'Dual 300mm front discs with 4-piston calipers & ABS. Both rotors within factory runout tolerance with 95% pad life.'
                  : motorcycle.id.includes('forty-eight')
                  ? 'Dual-piston 300mm front disc with ABS. Calipers degreased, lines flushed, and pads inspected at 96% life.'
                  : '320mm ByBre front disc with dual-channel ABS. Floating rotor true with 97% pad integrity.'}
              </p>
            </div>

            {/* TYRES */}
            <div className="machine-report-card" data-cursor="INSPECT">
              <div className="report-card-top">
                <span className="report-card-label">RUBBER HEALTH</span>
                <span className="report-card-status">OPTIMAL TREAD</span>
              </div>
              <h3 className="report-card-title">TYRES</h3>
              <div className="report-card-bar-track">
                <div className="report-card-bar-fill" style={{ width: '92%' }} />
              </div>
              <p className="report-card-desc">
                {motorcycle.id.includes('hayabusa')
                  ? 'Bridgestone Battlax Hypersport S22 (120/70ZR17 front & 190/50ZR17 rear). Deep original factory tread depth with minimal wear.'
                  : motorcycle.id.includes('fat-bob')
                  ? 'Muscular 130/90B16 front and massive 180/70B16 rear Dunlop Harley-Davidson tyres on black slotted aluminium wheels.'
                  : motorcycle.id.includes('forty-eight')
                  ? 'Fat front 130/90B16 tyre with white lettering & rear 150/80B16. Deep tread depth with zero flat spotting.'
                  : 'Brand new rear tyre recently fitted. Pirelli Phantom front tyre with 90%+ healthy road tread.'}
              </p>
            </div>

            {/* SERVICE HISTORY VERIFIED */}
            <div className="machine-report-card" data-cursor="INSPECT">
              <div className="report-card-top">
                <span className="report-card-label">OFFICIAL LOGS</span>
                <span className="report-card-status">VERIFIED</span>
              </div>
              <h3 className="report-card-title">SERVICE HISTORY</h3>
              <div className="report-card-bar-track">
                <div className="report-card-bar-fill" style={{ width: '100%' }} />
              </div>
              <p className="report-card-desc">
                Serviced exclusively at {motorcycle.brand} Authorized Service Center. Full digital logbook verified.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 07: OWNERSHIP HISTORY (VERIFIED HISTORY.)
         ================================================== */}
      <section style={{ marginBottom: 'clamp(5rem, 8vw, 8rem)' }}>
        <div className="container-wide">
          <div style={{ marginBottom: '2.5rem' }}>
            <span className="telemetry-badge accent" style={{ marginBottom: '0.6rem' }}>
              <span className="dot" /> PROVENANCE RECORD
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
              VERIFIED <br />
              <span style={{ color: '#9B9B9B' }}>HISTORY.</span>
            </h2>
          </div>

          {/* Visual Display Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            {/* REGISTRATION YEAR */}
            <div className="provenance-card" data-cursor="RECORD">
              <Calendar size={26} color="var(--accent-orange)" className="provenance-icon" />
              <div className="provenance-val">
                {motorcycle.year}
              </div>
              <div className="provenance-label">
                {motorcycle.id.includes('forty-eight') ? 'REGISTRATION YEAR (2017 MFG)' : 'REGISTRATION YEAR'}
              </div>
            </div>

            {/* OWNERSHIP */}
            <div className="provenance-card" data-cursor="RECORD">
              <ShieldCheck size={26} color="var(--accent-orange)" className="provenance-icon" />
              <div className="provenance-val">
                {String(motorcycle.owners).padStart(2, '0')}
              </div>
              <div className="provenance-label">
                {motorcycle.ownerDisplay}
              </div>
            </div>

            {/* ODOMETER / KM DISTANCE */}
            <div className="provenance-card" data-cursor="RECORD">
              <Activity size={26} color="var(--accent-orange)" className="provenance-icon" />
              <div className="provenance-val">
                {motorcycle.kilometres.toLocaleString()}
              </div>
              <div className="provenance-label">
                KM DISTANCE RUN ({motorcycle.kmDisplay})
              </div>
            </div>

            {/* LOCATION / RTO */}
            <div className="provenance-card" data-cursor="RECORD">
              <Compass size={26} color="var(--accent-orange)" className="provenance-icon" />
              <div className="provenance-val">
                {motorcycle.location}
              </div>
              <div className="provenance-label">
                LOCATION / RTO ({motorcycle.registration})
              </div>
            </div>
          </div>

          {/* DOCUMENTATION VERIFIED SEAL */}
          <div className="documentation-seal-bar" data-cursor="LEGAL">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <FileCheck size={28} color="var(--accent-orange)" className="doc-icon" />
              <div>
                <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', display: 'block', color: '#F5F5F2' }}>
                  DOCUMENTATION VERIFIED & GUARANTEED
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Original Smartcard RC verified via Parivahan Vahan database. Zero commercial misuse, non-accidental affidavit signed.
                </span>
              </div>
            </div>

            <span className="doc-pass-badge">
              LEGAL TITLE PASS ✓
            </span>
          </div>
        </div>
      </section>


      {/* ==================================================
          360° INTERACTIVE TURNTABLE & FINANCING CALCULATOR
         ================================================== */}
      <section style={{ marginBottom: 'clamp(5rem, 8vw, 8rem)' }}>
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem' }}>
            <div style={{ gridColumn: 'span 7' }}>
              <Machine360Viewer
                modelName={motorcycle.model}
                brand={motorcycle.brand}
              />
            </div>
            <div style={{ gridColumn: 'span 5' }}>
              <EMICalculator price={motorcycle.price} modelName={motorcycle.model} />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 08: FINANCIAL / ACQUISITION BLOCK
         ================================================== */}
      <section style={{ marginBottom: 'clamp(5rem, 8vw, 8rem)' }}>
        <div className="container-wide">
          <div
            style={{
              background: 'var(--bg-surface-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-container)',
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2.5rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                <span className="telemetry-badge accent">
                  <span className="dot" /> PRE-OWNED
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  MODEL YEAR {motorcycle.year}
                </span>
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  fontWeight: 900,
                  color: '#F5F5F2',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {motorcycle.priceDisplay}
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '480px' }}>
                All-inclusive acquisition price. Includes comprehensive warranty, concierge RC transfer, pre-handover service, and enclosed flatbed delivery.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '280px' }}>
              <button
                onClick={() => onOpenBooking(motorcycle)}
                className="btn-special-cta"
              >
                <span>ENQUIRE NOW</span>
                <span className="cta-icon-bubble">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </span>
              </button>

              <button
                onClick={() => onOpenBooking(motorcycle)}
                className="btn-secondary"
                style={{ textAlign: 'center', padding: '14px 28px' }}
              >
                SCHEDULE PRIVATE TEST RIDE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 09: RELATED MACHINES (YOU MAY ALSO LIKE.)
         ================================================== */}
      <section
        style={{
          padding: 'clamp(5rem, 8vw, 8rem) 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 'clamp(5rem, 8vw, 8rem)',
        }}
      >
        <div className="container-wide">
          <div style={{ marginBottom: '3rem' }}>
            <span className="telemetry-badge accent" style={{ marginBottom: '0.6rem' }}>
              <span className="dot" /> CURATED ALTERNATIVES
            </span>
            <h2
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: '-0.04em',
                color: '#F5F5F2',
              }}
            >
              YOU MAY <br />
              <span style={{ color: '#9B9B9B' }}>ALSO LIKE.</span>
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {relatedBikes.map((bike) => (
              <MotorcycleCard
                key={bike.id}
                motorcycle={bike}
                onSelect={(id) => onSelectMachine(id)}
                isFavorite={favorites.includes(bike.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          SECTION 10: FINAL CTA (FULL-WIDTH CINEMATIC)
         ================================================== */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(6rem, 10vw, 11rem) 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background Backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${galleryViews[0]?.src || motorcycle.images[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.72) contrast(110%)',
            zIndex: 0,
          }}
        />

        {/* Gradient Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.85) 85%)',
            zIndex: 1,
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '820px' }}>
          <span className="telemetry-badge accent" style={{ marginBottom: '1.25rem' }}>
            <span className="dot" /> IMMEDIATE RESERVATION
          </span>

          <h2
            style={{
              fontSize: 'clamp(3rem, 6.8vw, 6rem)',
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              marginBottom: '2.5rem',
              color: '#F5F5F2',
            }}
          >
            READY TO <br />
            MAKE IT <br />
            <span style={{ color: '#9B9B9B' }}>YOURS?</span>
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', justifyContent: 'center' }}>
            <button
              onClick={() => onOpenBooking(motorcycle)}
              className="btn-special-cta"
            >
              <span>ENQUIRE NOW</span>
              <span className="cta-icon-bubble">
                <ArrowRight size={15} strokeWidth={2.5} />
              </span>
            </button>

            <button
              onClick={() => onOpenBooking(motorcycle)}
              className="btn-secondary"
              style={{ padding: '14px 32px' }}
            >
              BOOK A VIEWING →
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Mobile/Desktop Purchase/Enquiry Dock */}
      <div
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: 'rgba(12, 12, 12, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '999px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(20px)',
          padding: '0.65rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: '92vw',
        }}
      >
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>
            {motorcycle.brand} {motorcycle.model}
          </span>
          <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#F5F5F2' }}>
            {motorcycle.priceDisplay}
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => onOpenBooking(motorcycle)}
            className="btn-special-cta"
            style={{ padding: '8px 10px 8px 18px', fontSize: '0.76rem' }}
          >
            <span>ENQUIRE</span>
            <span className="cta-icon-bubble" style={{ width: '28px', height: '28px' }}>
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </button>

          <button
            onClick={(e) => onToggleFavorite(motorcycle.id, e)}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              color: isFav ? 'var(--accent-orange)' : 'var(--text-primary)',
              width: '38px',
              height: '38px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Save"
          >
            <Heart size={16} fill={isFav ? 'var(--accent-orange)' : 'none'} />
          </button>
        </div>
      </div>

    </div>
  );
};
