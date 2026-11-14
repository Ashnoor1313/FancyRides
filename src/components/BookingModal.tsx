import React, { useState } from 'react';
import { X, Calendar, Video, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Motorcycle } from '../data/motorcycles';

interface BookingModalProps {
  motorcycle: Motorcycle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ motorcycle, isOpen, onClose }) => {
  const [mode, setMode] = useState<'showroom' | 'video'>('showroom');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [city, setCity] = useState('Delhi NCR (Aerocity Lounge)');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !motorcycle) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
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
                <span className="dot" /> PRIVATE APPOINTMENT
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                REF: {motorcycle.id.toUpperCase()}
              </span>
            </div>

            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '0.35rem', color: '#F5F5F2' }}>
              EXPERIENCE THE MACHINE
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
              Reserve an uninterrupted private VIP consultation for the <strong style={{ color: '#F5F5F2' }}>{motorcycle.brand} {motorcycle.model}</strong>.
            </p>

            {/* Mode selection */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setMode('showroom')}
                style={{
                  padding: '1.15rem',
                  borderRadius: '14px',
                  background: mode === 'showroom' ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                  border: mode === 'showroom' ? '1px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: mode === 'showroom' ? 'var(--accent-orange)' : '#F5F5F2' }}>
                  <Calendar size={17} />
                  <span style={{ fontWeight: 700, fontSize: '0.84rem', letterSpacing: '0.04em' }}>PRIVATE SHOWROOM</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>In-person lounge inspection & start-up</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('video')}
                style={{
                  padding: '1.15rem',
                  borderRadius: '14px',
                  background: mode === 'video' ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                  border: mode === 'video' ? '1px solid var(--accent-orange)' : '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: mode === 'video' ? 'var(--accent-orange)' : '#F5F5F2' }}>
                  <Video size={17} />
                  <span style={{ fontWeight: 700, fontSize: '0.84rem', letterSpacing: '0.04em' }}>LIVE 4K WALKTHROUGH</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Dedicated video call with technician</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                  FULL NAME
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Vikramaditya Rathore"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                    PHONE NUMBER
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98765 43210"
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

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                    PREFERRED DATE
                  </label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
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

              {mode === 'showroom' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '0.4rem', letterSpacing: '0.08em' }}>
                    SELECT SHOWROOM LOUNGE
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
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
                    <option value="Delhi NCR (Aerocity Lounge)">Delhi NCR — Aerocity Signature Suite</option>
                    <option value="Mumbai (BKC Pavilion)">Mumbai — Bandra Kurla Complex (BKC)</option>
                    <option value="Bengaluru (Indiranagar Gallery)">Bengaluru — 100ft Road, Indiranagar</option>
                  </select>
                </div>
              )}

              <button type="submit" className="btn-special-cta" style={{ marginTop: '0.75rem', width: '100%' }}>
                <span>CONFIRM VIP RESERVATION</span>
                <span className="cta-icon-bubble">
                  <ArrowRight size={15} strokeWidth={2.5} />
                </span>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
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
              APPOINTMENT SECURED
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '420px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
              Thank you, {name}. A dedicated Fancy Rides India Private Client Concierge has been assigned to prepare the {motorcycle.brand} {motorcycle.model} for your session.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="btn-secondary"
            >
              RETURN TO MACHINE
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
