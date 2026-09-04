import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface SellRideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellRideModal: React.FC<SellRideModalProps> = ({ isOpen, onClose }) => {
  const [brand, setBrand] = useState('BMW Motorrad');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2023');
  const [km, setKm] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
        >
          <X size={22} />
        </button>

        {!submitted ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span className="telemetry-badge accent">
                <span className="dot" /> CONCIERGE ACQUISITION
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                VIP OUTRIGHT PURCHASE OR CONSIGNMENT
              </span>
            </div>

            <h3 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.35rem', color: '#F5F5F2' }}>
              PASS THE TORCH TO A TRUE ENTHUSIAST
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.55 }}>
              We buy exceptional pre-owned motorcycles outright or offer curated private consignment to India's most vetted community of collectors.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                    MAKE / BRAND
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  >
                    <option value="BMW Motorrad">BMW Motorrad</option>
                    <option value="Ducati">Ducati</option>
                    <option value="Triumph">Triumph</option>
                    <option value="Harley-Davidson">Harley-Davidson</option>
                    <option value="Indian Motorcycle">Indian Motorcycle</option>
                    <option value="Kawasaki">Kawasaki</option>
                    <option value="Aprilia">Aprilia</option>
                    <option value="MV Agusta">MV Agusta</option>
                    <option value="Other Exotic">Other Exotic</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                    MODEL & VARIANT
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. S 1000 RR M Package"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                    REGISTRATION YEAR
                  </label>
                  <input
                    required
                    type="number"
                    min="2012"
                    max="2025"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                    ODOMETER (KM)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 6500"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.15rem',
                      borderRadius: '12px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                  WHATSAPP / MOBILE NUMBER
                </label>
                <input
                  required
                  type="tel"
                  placeholder="+91 98110 50000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.88rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Guarantees Box */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <ShieldCheck size={22} color="var(--accent-orange)" />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Same-day valuation quote. Instant escrow clearance and doorstep flatbed pickup across all Tier-1 Indian metros.
                </span>
              </div>

              <button type="submit" className="btn-special-cta" style={{ width: '100%', marginTop: '0.5rem' }}>
                <span>REQUEST VIP VALUATION DOSSIER</span>
                <span className="cta-icon-bubble">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </span>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#161616',
                border: '1px solid var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-orange)',
                margin: '0 auto 1.5rem',
                boxShadow: '0 0 20px var(--accent-orange-glow)',
              }}
            >
              <CheckCircle2 size={30} />
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: '#F5F5F2' }}>
              DOSSIER REQUEST SUBMITTED
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '440px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
              Our Head of Acquisitions is reviewing your {year} {brand} {model}. You will receive a preliminary acquisition valuation on WhatsApp within 4 operational hours.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="btn-secondary"
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
