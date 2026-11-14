import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'collection' | 'detail', params?: { category?: string }) => void;
  onOpenSellModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSellModal }) => {
  return (
    <footer
      style={{
        background: '#0B0B0B',
        borderTop: '1px solid rgba(255, 255, 255, 0.07)',
        paddingTop: 'clamp(4.5rem, 8vw, 7.5rem)',
        paddingBottom: '3.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-wide">
        {/* Massive Closing Statement */}
        <div style={{ marginBottom: '5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span className="telemetry-badge accent">
              <span className="dot" /> THE ETHOS
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666666', letterSpacing: '0.1em' }}>
              FANCY RIDES INDIA AUTOMOTIVE
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 7.5rem)',
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              maxWidth: '1200px',
              color: '#F5F5F2',
            }}
          >
            MACHINES <br />
            THAT <span style={{ color: '#9B9B9B' }}>MOVE YOU.</span>
          </h2>
        </div>

        {/* Links & Information Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '3.5rem 2.5rem',
            paddingBottom: '4rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          {/* Col 1: Brand & Philosophy */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#161616',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  color: '#F5F5F2',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  borderRadius: '8px',
                }}
              >
                FRI
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.04em', color: '#F5F5F2' }}>
                FANCY RIDES <span style={{ color: 'var(--accent-orange)' }}>INDIA</span>
              </span>
            </div>

            <p style={{ color: '#9B9B9B', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              A curated collection of certified premium pre-owned motorcycles. Sourced with surgical discernment, verified across 150+ forensic inspection checkpoints.
            </p>

            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#666666', letterSpacing: '0.08em' }}>
              PRE-OWNED. PREMIUM. UNFORGETTABLE.
            </span>
          </div>

          {/* Col 2: The Collection */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: '#F5F5F2', marginBottom: '1.25rem', fontWeight: 700 }}>
              COLLECTION & GENRES
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
              <button
                onClick={() => onNavigate('collection', { category: 'SUPERBIKE' })}
                style={{ background: 'none', border: 'none', color: '#9B9B9B', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
              >
                Superbikes (Liter-Class)
              </button>
              <button
                onClick={() => onNavigate('collection', { category: 'ADVENTURE' })}
                style={{ background: 'none', border: 'none', color: '#9B9B9B', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
              >
                Adventure & Dual-Sport
              </button>
              <button
                onClick={() => onNavigate('collection', { category: 'ROADSTER' })}
                style={{ background: 'none', border: 'none', color: '#9B9B9B', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
              >
                Roadsters & Hyper-Nakeds
              </button>
              <button
                onClick={() => onNavigate('collection', { category: 'CRUISER' })}
                style={{ background: 'none', border: 'none', color: '#9B9B9B', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
              >
                Cruisers & Power Muscle
              </button>
              <button
                onClick={() => onNavigate('collection', { category: 'CLASSIC' })}
                style={{ background: 'none', border: 'none', color: '#9B9B9B', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
              >
                Modern Classics & Heritage
              </button>
            </div>
          </div>

          {/* Col 3: Services & Concierge */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: '#F5F5F2', marginBottom: '1.25rem', fontWeight: 700 }}>
              SERVICES & TRUST
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
              <button
                onClick={onOpenSellModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F5F5F2',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                Sell Your Ride (VIP Acquisition) <ArrowUpRight size={14} color="var(--accent-orange)" />
              </button>
              <button
                onClick={() => {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                }}
                style={{ background: 'none', border: 'none', color: '#9B9B9B', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
              >
                150+ Point Forensic Protocol
              </button>
              <span style={{ color: '#9B9B9B' }}>
                Pan-India Enclosed Transport
              </span>
              <span style={{ color: '#9B9B9B' }}>
                Bespoke Luxury Superbike Finance
              </span>
              <span style={{ color: '#9B9B9B' }}>
                Comprehensive 6-Month Warranty
              </span>
            </div>
          </div>

          {/* Col 4: Showrooms & Private Lounges */}
          <div>
            <h4 style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: '#F5F5F2', marginBottom: '1.25rem', fontWeight: 700 }}>
              SIGNATURE GALLERIES
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: '#9B9B9B' }}>
              <div>
                <strong style={{ color: '#F5F5F2', display: 'block' }}>DELHI NCR SHOWROOM</strong>
                <span>Aerocity Hospitality District, New Delhi</span>
              </div>

              <div>
                <strong style={{ color: '#F5F5F2', display: 'block' }}>MUMBAI PAVILION</strong>
                <span>Bandra Kurla Complex (BKC), Mumbai</span>
              </div>

              <div>
                <strong style={{ color: '#F5F5F2', display: 'block' }}>BENGALURU GALLERY</strong>
                <span>100ft Road, Indiranagar, Bengaluru</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                <span style={{ color: '#F5F5F2', cursor: 'pointer' }}>INSTAGRAM</span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span style={{ color: '#F5F5F2', cursor: 'pointer' }}>YOUTUBE</span>
                <span style={{ opacity: 0.35 }}>·</span>
                <span style={{ color: '#F5F5F2', cursor: 'pointer' }}>TWITTER / X</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Telemetry Bar */}
        <div
          style={{
            paddingTop: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: '#666666',
          }}
        >
          <div>
            © 2026 FANCY RIDES INDIA AUTOMOTIVE PVT. LTD. ALL RIGHTS RESERVED.
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ cursor: 'pointer' }}>PRIVACY PROTOCOL</span>
            <span style={{ cursor: 'pointer' }}>TERMS OF ENGAGEMENT</span>
            <span style={{ cursor: 'pointer' }}>DISCLAIMER</span>
            <span style={{ color: '#9B9B9B' }}>EST. 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
