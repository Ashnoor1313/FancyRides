import React from 'react';
import type { Motorcycle } from '../data/motorcycles';
import { Heart, ArrowRight, ShieldCheck } from 'lucide-react';

interface MotorcycleCardProps {
  motorcycle: Motorcycle;
  onSelect: (id: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  layout?: 'standard' | 'cinematic-wide';
}

export const MotorcycleCard: React.FC<MotorcycleCardProps> = ({
  motorcycle,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  layout = 'standard',
}) => {
  return (
    <div
      className="machine-card"
      data-cursor="VIEW"
      onClick={() => onSelect(motorcycle.id)}
      style={{
        display: layout === 'cinematic-wide' ? 'grid' : 'flex',
        gridTemplateColumns: layout === 'cinematic-wide' ? '1.2fr 1fr' : undefined,
      }}
    >
      {/* Visual Image Container */}
      <div
        className="image-wrapper"
        style={{
          aspectRatio: layout === 'cinematic-wide' ? '16 / 9' : '16 / 10',
          height: layout === 'cinematic-wide' ? '100%' : undefined,
          borderRadius: layout === 'cinematic-wide' ? '20px 0 0 20px' : '18px 18px 0 0',
        }}
      >
        <img
          src={motorcycle.images[0]}
          alt={`${motorcycle.brand} ${motorcycle.model}`}
          loading="lazy"
        />

        {/* Top Badges (Subtle, Understated) */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2, display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
          {motorcycle.newArrival && (
            <span
              style={{
                background: '#161616',
                border: '1px solid rgba(255, 90, 31, 0.4)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
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
              JUST IN
            </span>
          )}
          <span
            style={{
              background: 'rgba(10, 10, 10, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: '#9B9B9B',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              padding: '0.28rem 0.65rem',
              textTransform: 'uppercase',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <ShieldCheck size={11} color="#9B9B9B" />
            {motorcycle.inspectionStatus}
          </span>
        </div>

        {/* Top Right Wishlist Toggle */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(motorcycle.id, e);
            }}
            style={{
              background: 'rgba(10, 10, 10, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(10px)',
              color: isFavorite ? 'var(--accent-orange)' : '#9B9B9B',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            aria-label="Save to garage"
          >
            <Heart size={15} fill={isFavorite ? 'var(--accent-orange)' : 'none'} strokeWidth={1.8} />
          </button>
        </div>

        {/* Bottom Image Micro Specs Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '1rem',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: '#D1D5DB',
            background: 'rgba(8, 8, 8, 0.75)',
            padding: '0.25rem 0.7rem',
            borderRadius: '999px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <span>{motorcycle.horsepower} HP</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>{motorcycle.engineCC} CC</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>{motorcycle.zeroToHundred}s</span>
        </div>
      </div>

      {/* Card Content Information */}
      <div className="card-content" style={{ justifyContent: layout === 'cinematic-wide' ? 'center' : undefined }}>
        {/* Tiny Category Label Above Brand */}
        <div className="category-pill-label">
          {motorcycle.category}
        </div>

        {/* Brand */}
        <div className="brand-label">
          {motorcycle.brand}
        </div>

        {/* Model */}
        <h3 className="model-title">
          {motorcycle.model}
        </h3>

        {/* Price Presentation: Large restrained typography, NOT inside a coloured badge */}
        <div className="price-tag">
          {motorcycle.priceDisplay}
        </div>

        {/* Metadata: 2023 · 8,400 KM · 1ST OWNER */}
        <div className="specs-meta">
          <span>{motorcycle.year}</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>{motorcycle.kmDisplay}</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>{motorcycle.ownerDisplay}</span>
          <span style={{ opacity: 0.35 }}>·</span>
          <span>{motorcycle.location}</span>
        </div>

        {/* Action Row with VIEW MACHINE -> */}
        <div className="view-action-row">
          <span className="view-link">
            <span>VIEW MACHINE</span>
            <span className="view-link-arrow">
              <ArrowRight size={13} strokeWidth={2} />
            </span>
          </span>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
            }}
          >
            CERTIFIED
          </span>
        </div>
      </div>
    </div>
  );
};
