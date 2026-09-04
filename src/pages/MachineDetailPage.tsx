import React, { useState, useEffect, useRef } from 'react';
import { MOTORCYCLES } from '../data/motorcycles';
import type { Motorcycle } from '../data/motorcycles';
import { MotorcycleCard } from '../components/MotorcycleCard';
import { Machine360Viewer } from '../components/Machine360Viewer';
import { EMICalculator } from '../components/EMICalculator';
import { HeadlightAtmosphereBackdrop } from '../components/HeadlightAtmosphereBackdrop';
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

// 6 Curated Image Views
const GALLERY_VIEWS = [
  {
    id: '01',
    label: '01 — M Performance',
    caption: 'Official BMW Motorsport M Performance Package & Track Stance',
    src: '/images/bmw-s1000rr-hero.jpg',
  },
  {
    id: '02',
    label: '02 — Pit Lane High-Res',
    caption: 'Official BMW Group Paddock Stand Architecture (2094×1500)',
    src: '/images/bmw-s1000rr-press.jpg',
  },
  {
    id: '03',
    label: '03 — Dark Studio',
    caption: 'Cinematic Dark Showroom Stance',
    src: '/images/bmw-s1000rr-studio.jpg',
  },
  {
    id: '04',
    label: '04 — Cockpit',
    caption: '6.5-Inch Full TFT Display & M Billet Levers',
    src: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '05',
    label: '05 — Engine',
    caption: 'BMW ShiftCam 999cc Powertrain Architecture',
    src: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '06',
    label: '06 — Detail',
    caption: 'Laser-Etched Chassis Identification & Brembo Calipers',
    src: 'https://images.unsplash.com/photo-1558980394-4c7c9299fe96?q=80&w=2000&auto=format&fit=crop',
  },
];

export const MachineDetailPage: React.FC<MachineDetailPageProps> = ({
  machineId,
  onBack,
  onSelectMachine,
  favorites,
  onToggleFavorite,
  onOpenBooking,
}) => {
  // Always resolve machine, default to BMW S 1000 RR
  const motorcycle =
    MOTORCYCLES.find((m) => m.id === machineId) ||
    MOTORCYCLES.find((m) => m.id === 'bmw-s1000rr-m-2023') ||
    MOTORCYCLES[0];

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
    setActiveGalleryIndex((prev) => (prev + 1) % GALLERY_VIEWS.length);
  };

  const prevGalleryImage = () => {
    setActiveGalleryIndex((prev) => (prev - 1 + GALLERY_VIEWS.length) % GALLERY_VIEWS.length);
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
            src={GALLERY_VIEWS[activeGalleryIndex].src}
            alt={GALLERY_VIEWS[activeGalleryIndex].caption}
            style={{ maxWidth: '92vw', maxHeight: '82vh', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.9)' }}
          />
          <div style={{ marginTop: '1.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {GALLERY_VIEWS[activeGalleryIndex].label} — {GALLERY_VIEWS[activeGalleryIndex].caption}
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
              <span className="dot" /> STOCK ID: FR-001-BM
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
                  aspectRatio: '16 / 11',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                }}
              >
                <img
                  src={GALLERY_VIEWS[0].src}
                  alt={`${motorcycle.brand} ${motorcycle.model}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(106%) brightness(1)',
                    transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.035)')}
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
                    FIRST OWNER MINT
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
                A high-performance machine engineered for riders who demand pure precision. Powered by BMW ShiftCam variable valve timing.
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
                <span>0{activeGalleryIndex + 1}</span> / 06
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
              aspectRatio: '16 / 9',
              maxHeight: '620px',
              background: '#090909',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              marginBottom: '1.25rem',
            }}
          >
            <img
              src={GALLERY_VIEWS[activeGalleryIndex].src}
              alt={GALLERY_VIEWS[activeGalleryIndex].caption}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(1) contrast(105%)',
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
                {GALLERY_VIEWS[activeGalleryIndex].label}
              </span>
              <span style={{ width: '1px', height: '12px', background: 'var(--border-subtle)' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {GALLERY_VIEWS[activeGalleryIndex].caption}
              </span>
            </div>
          </div>

          {/* 6 Thumbnail Navigation Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '0.75rem',
            }}
          >
            {GALLERY_VIEWS.map((view, idx) => {
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
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                @ 13,750 RPM
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{animatedNumbers.cc}</div>
              <div className="num-unit">DISPLACEMENT (CC)</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                Inline-4 ShiftCam
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{animatedNumbers.nm}</div>
              <div className="num-unit">TORQUE (NM)</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                Peak Tractable Punch
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">{animatedNumbers.kg}</div>
              <div className="num-unit">KERB WEIGHT (KG)</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                With M Carbon Wheels
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">6-SPD</div>
              <div className="num-unit">TRANSMISSION</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                Quickshift Pro
              </span>
            </div>

            <div className="editorial-spec-item">
              <div className="num-value">95+</div>
              <div className="num-unit">OCTANE</div>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.35rem' }}>
                High Compression
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
              <span style={{ color: '#9B9B9B' }}>UNFORGIVING.</span>
            </h2>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
                lineHeight: 1.7,
                color: '#F5F5F2',
                marginBottom: '1.75rem',
              }}
            >
              The BMW S 1000 RR does not ask for permission; it takes corners with surgical precision. With BMW’s ShiftCam technology altering valve timing seamlessly at 9,000 RPM, the powerband never runs out of breath. Fitted with the optional factory M Package, carbon fiber wheels shave rotating unsprung mass down to razor-sharp agility.
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
              { label: 'REGISTRATION', val: motorcycle.registration || 'DL 08 (Delhi South)' },
              { label: 'KILOMETRES', val: motorcycle.kmDisplay || `${motorcycle.kilometres.toLocaleString()} KM` },
              { label: 'OWNERS', val: motorcycle.ownerDisplay || `${motorcycle.owners}st Owner (Individual)` },
              { label: 'FUEL', val: motorcycle.fuelType || 'Petrol (95+ Octane)' },
              {
                label: 'TRANSMISSION',
                val: motorcycle.transmission.includes('Shift')
                  ? motorcycle.transmission
                  : `${motorcycle.transmission} with Shift Assistant Pro`,
              },
              { label: 'ENGINE', val: `${motorcycle.engineCC}cc ShiftCam Inline-4 Water/Oil Cooled` },
              {
                label: 'LOCATION',
                val: motorcycle.city ? `${motorcycle.city} Lounge, New Delhi` : 'Aerocity Showroom, New Delhi',
              },
              { label: 'EXHAUST SYSTEM', val: 'Full Titanium Akrapovič Factory M' },
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
                <div className="report-card-bar-fill" style={{ width: '98%' }} />
              </div>
              <p className="report-card-desc">
                Cylinder compression 13.5:1 across all 4 bores. Zero oil seepage.
              </p>
            </div>

            {/* BRAKES 92% */}
            <div className="machine-report-card" data-cursor="INSPECT">
              <div className="report-card-top">
                <span className="report-card-label">STOPPING POWER</span>
                <span className="report-card-status">92% REMAINING</span>
              </div>
              <h3 className="report-card-title">BRAKES</h3>
              <div className="report-card-bar-track">
                <div className="report-card-bar-fill" style={{ width: '92%' }} />
              </div>
              <p className="report-card-desc">
                Brembo Stylema sintered pads at 4.2mm thickness. Fluid boiling point 265°C.
              </p>
            </div>

            {/* TYRES 90% */}
            <div className="machine-report-card" data-cursor="INSPECT">
              <div className="report-card-top">
                <span className="report-card-label">RUBBER HEALTH</span>
                <span className="report-card-status">90% TREAD DEPTH</span>
              </div>
              <h3 className="report-card-title">TYRES</h3>
              <div className="report-card-bar-track">
                <div className="report-card-bar-fill" style={{ width: '90%' }} />
              </div>
              <p className="report-card-desc">
                Pirelli Diablo Supercorsa SP V3 with 3.8mm center / 4.1mm shoulder tread.
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
                Serviced exclusively at BMW Motorrad Delhi. Next service due in 6,200 KM.
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
            {/* 2023 REGISTRATION */}
            <div className="provenance-card" data-cursor="RECORD">
              <Calendar size={26} color="var(--accent-orange)" className="provenance-icon" />
              <div className="provenance-val">
                2023
              </div>
              <div className="provenance-label">
                REGISTRATION YEAR
              </div>
            </div>

            {/* 01 PREVIOUS OWNER */}
            <div className="provenance-card" data-cursor="RECORD">
              <ShieldCheck size={26} color="var(--accent-orange)" className="provenance-icon" />
              <div className="provenance-val">
                01
              </div>
              <div className="provenance-label">
                PREVIOUS OWNER
              </div>
            </div>

            {/* 8,400 KM DISTANCE */}
            <div className="provenance-card" data-cursor="RECORD">
              <Activity size={26} color="var(--accent-orange)" className="provenance-icon" />
              <div className="provenance-val">
                8,400
              </div>
              <div className="provenance-label">
                KM DISTANCE RUN
              </div>
            </div>

            {/* DELHI LOCATION */}
            <div className="provenance-card" data-cursor="RECORD">
              <Compass size={26} color="var(--accent-orange)" className="provenance-icon" />
              <div className="provenance-val">
                DELHI
              </div>
              <div className="provenance-label">
                LOCATION / RTO
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
          CINEMATIC S1000RR HEADLIGHT ATMOSPHERE SHOWCASE
         ================================================== */}
      <section style={{ marginBottom: 'clamp(5rem, 8vw, 8rem)' }}>
        <HeadlightAtmosphereBackdrop
          title={`${motorcycle.brand} ${motorcycle.model}`}
          subtitle={`${motorcycle.brand.toUpperCase()} // OPTIC BEAM MATRIX & DUAL LASER HEADLIGHT IGNITION`}
          showControls={true}
        />
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
                ₹18.75 L
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
            backgroundImage: `url(${GALLERY_VIEWS[0].src})`,
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
