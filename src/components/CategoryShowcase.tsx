import React from 'react';
import { MOTORCYCLE_CATEGORIES } from '../data/motorcycles';
import { ArrowUpRight } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onSelectCategory }) => {
  return (
    <section id="categories-section" style={{ position: 'relative', padding: 'clamp(4rem, 8vw, 8rem) 0' }}>
      <div className="container-wide">
        {/* Section Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="telemetry-badge accent">
              <span className="dot" /> DISCOVERY MATRIX
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              08 DISTINCT GENRES
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '1.5rem',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 0.95,
                fontWeight: 900,
                letterSpacing: '-0.03em',
              }}
            >
              FIND YOUR <br />
              <span style={{ color: 'var(--text-secondary)' }}>MACHINE.</span>
            </h2>

            <p
              style={{
                maxWidth: '440px',
                color: 'var(--text-secondary)',
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              From 200+ horsepower liter-class track weapons to mile-crushing transcontinental tourers. Explore machines categorized by riding philosophy.
            </p>
          </div>
        </div>

        {/* 8 Categories Grid / Editorial Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(280px, 22vw, 380px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {MOTORCYCLE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="category-tile"
              data-cursor="EXPLORE"
              style={{
                position: 'relative',
                height: '420px',
                background: '#0d0d0d',
                overflow: 'hidden',
                border: '1px solid var(--border-hairline)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
              }}
            >
              {/* Background Image with Dark Vignette */}
              <div
                className="category-bg-image"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${cat.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'contrast(106%) brightness(0.85)',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
                  zIndex: 0,
                }}
              />

              {/* Gradient Scrim */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(5,5,5,0.2) 0%, transparent 40%, rgba(5,5,5,0.85) 100%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              {/* Top: Category Number & Count */}
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
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {cat.id}
                </span>

                <div
                  className="arrow-circle"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <ArrowUpRight size={18} />
                </div>
              </div>

              {/* Bottom: Title & Emotional Description */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h3
                  className="category-title"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {cat.name}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.4,
                    maxWidth: '90%',
                  }}
                >
                  {cat.tagline}
                </p>

                <div
                  style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--accent-orange)',
                    letterSpacing: '0.08em',
                  }}
                >
                  <span>BROWSE INVENTORY</span>
                  <span>→</span>
                </div>
              </div>

              {/* Bottom Accent Bar on Hover */}
              <div
                className="category-accent-bar"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'var(--accent-orange)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 3,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .category-tile:hover {
          border-color: var(--border-accent) !important;
          transform: translateY(-4px);
        }
        .category-tile:hover .category-bg-image {
          transform: scale(1.08);
          filter: contrast(110%) brightness(0.95) !important;
        }
        .category-tile:hover .arrow-circle {
          background: var(--accent-orange) !important;
          color: #000 !important;
          border-color: var(--accent-orange) !important;
          transform: rotate(45deg);
        }
        .category-tile:hover .category-title {
          color: var(--text-primary) !important;
        }
        .category-tile:hover .category-accent-bar {
          transform: scaleX(1) !important;
        }
      `}</style>
    </section>
  );
};
