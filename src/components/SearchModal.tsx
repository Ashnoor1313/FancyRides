import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { MOTORCYCLES } from '../data/motorcycles';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMachine: (id: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectMachine }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? MOTORCYCLES.filter((b) =>
        `${b.brand} ${b.model} ${b.category} ${b.location} ${b.tagline}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
    : MOTORCYCLES.slice(0, 4);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px', padding: '2rem', borderRadius: '24px', background: '#101010', border: '1px solid rgba(255, 255, 255, 0.1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <span className="telemetry-badge accent">
            <span className="dot" /> SEARCH THE REPOSITORY
          </span>
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

        {/* Search input (22px radius, subtle focus) */}
        <div
          className="search-input-container"
          style={{ marginBottom: '1.5rem' }}
        >
          <Search size={18} color="var(--accent-orange)" style={{ marginRight: '0.85rem' }} />
          <input
            autoFocus
            type="text"
            placeholder="Search make, model, style or city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
          <span>{query ? `SEARCH RESULTS (${results.length})` : 'TRENDING SUPERBIKES'}</span>
          <span>ENTER TO OPEN</span>
        </div>

        {/* Results list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '50vh', overflowY: 'auto' }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
              No machines match your criteria. Try searching for "Ducati", "BMW", or "Superbike".
            </div>
          ) : (
            results.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  onSelectMachine(b.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  background: '#141414',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 90, 31, 0.5)';
                  e.currentTarget.style.background = '#181818';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                  e.currentTarget.style.background = '#141414';
                }}
              >
                <img
                  src={b.images[0]}
                  alt={b.model}
                  style={{ width: '68px', height: '52px', objectFit: 'cover', borderRadius: '10px' }}
                />

                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {b.brand} · {b.category}
                  </span>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F5F5F2' }}>
                    {b.model}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {b.horsepower} HP · {b.kmDisplay} · {b.location}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#F5F5F2', fontWeight: 800, fontSize: '0.92rem' }}>
                    {b.priceDisplay}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-orange)', fontSize: '0.72rem', marginTop: '0.2rem' }}>
                    <span>VIEW</span>
                    <ArrowRight size={11} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
