import React from 'react';
import { X, Trash2, ArrowRight, Heart } from 'lucide-react';
import { MOTORCYCLES } from '../data/motorcycles';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onRemoveFavorite: (id: string) => void;
  onSelectMachine: (id: string) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectMachine,
}) => {
  if (!isOpen) return null;

  const savedBikes = MOTORCYCLES.filter((b) => favorites.includes(b.id));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '460px',
          background: '#0B0B0B',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10001,
          animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.9)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Heart size={18} color="var(--accent-orange)" fill="var(--accent-orange)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F5F5F2', letterSpacing: '-0.02em' }}>MY GARAGE</h3>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#F5F5F2',
                background: '#161616',
                border: '1px solid rgba(255, 90, 31, 0.4)',
                borderRadius: '999px',
                padding: '0.2rem 0.65rem',
              }}
            >
              {savedBikes.length} SAVED
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.25rem' }}>
          {savedBikes.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto 0', color: 'var(--text-secondary)' }}>
              <Heart size={44} strokeWidth={1} style={{ margin: '0 auto 1rem', opacity: 0.25 }} />
              <p style={{ fontWeight: 700, color: '#F5F5F2', marginBottom: '0.35rem' }}>Your Garage is Empty</p>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '280px', margin: '0 auto' }}>
                Click the heart icon on any machine to bookmark it for private consultation.
              </p>
            </div>
          ) : (
            savedBikes.map((bike) => (
              <div
                key={bike.id}
                style={{
                  background: '#101010',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '16px',
                  padding: '0.9rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  position: 'relative',
                  transition: 'border-color 0.2s',
                }}
              >
                <img
                  src={bike.images[0]}
                  alt={bike.model}
                  style={{ width: '85px', height: '65px', objectFit: 'cover', borderRadius: '10px' }}
                />

                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {bike.brand}
                  </span>
                  <h4
                    onClick={() => {
                      onSelectMachine(bike.id);
                      onClose();
                    }}
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      color: '#F5F5F2',
                      lineHeight: 1.2,
                      marginTop: '0.1rem',
                    }}
                  >
                    {bike.model}
                  </h4>
                  <span style={{ color: '#F5F5F2', fontWeight: 800, fontSize: '0.9rem' }}>
                    {bike.priceDisplay}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <button
                    onClick={() => {
                      onSelectMachine(bike.id);
                      onClose();
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      color: '#F5F5F2',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s',
                    }}
                    title="View Machine"
                  >
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={() => onRemoveFavorite(bike.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    title="Remove from garage"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
