import React, { useState, useEffect } from 'react';
import { Shield, Lock, X, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin } = useInventory();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(false);
      setErrorMessage('');
      setSuccess(false);
    }
  }, [isOpen]);

  // Handle keyboard typing
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        handleUnlock();
      } else if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
        setError(false);
      } else if (/^[0-9]$/.test(e.key) && pin.length < 8) {
        setPin((prev) => prev + e.key);
        setError(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pin]);

  if (!isOpen) return null;

  const handleUnlock = () => {
    if (!pin) {
      setError(true);
      setErrorMessage('Please enter the dealer passcode');
      return;
    }

    const isValid = loginAdmin(pin);
    if (isValid) {
      setSuccess(true);
      setError(false);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } else {
      setError(true);
      setErrorMessage('Invalid Passcode. Access Restricted.');
      setPin('');
    }
  };

  const handleKeyPadClick = (val: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + val);
      setError(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(5, 5, 5, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(165deg, #141414 0%, #0A0A0A 100%)',
          border: '1px solid rgba(255, 90, 31, 0.4)',
          borderRadius: '24px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(255, 90, 31, 0.15)',
          overflow: 'hidden',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Glowing Line */}
        <div
          style={{
            height: '3px',
            width: '100%',
            background: 'linear-gradient(90deg, transparent, var(--accent-orange), transparent)',
          }}
        />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#A0A09C',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF';
            e.currentTarget.style.borderColor = 'rgba(255, 90, 31, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#A0A09C';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div style={{ padding: '2rem 2rem 1.25rem', textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255, 90, 31, 0.1)',
              border: '1px solid rgba(255, 90, 31, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-orange)',
              marginBottom: '1rem',
              boxShadow: '0 0 25px rgba(255, 90, 31, 0.2)',
            }}
          >
            {success ? <CheckCircle2 size={28} /> : <Shield size={28} />}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              color: 'var(--accent-orange)',
              marginBottom: '0.35rem',
              fontWeight: 700,
            }}
          >
            DEALER CONSOLE // RESTRICTED
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F5F5F2',
              margin: '0 0 0.4rem',
            }}
          >
            Showroom Vault Access
          </h2>

          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Enter your secret master passcode to manage motorcycle inventory and VIP fancy numbers.
          </p>
        </div>

        {/* PIN Display Field */}
        <div style={{ padding: '0 2rem' }}>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              border: `1.5px solid ${error ? '#EF4444' : success ? '#10B981' : 'rgba(255, 255, 255, 0.15)'}`,
              borderRadius: '14px',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              minHeight: '56px',
              transition: 'all 0.25s ease',
            }}
          >
            <Lock size={16} color={error ? '#EF4444' : 'var(--accent-orange)'} />

            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              {[0, 1, 2, 3].map((idx) => {
                const isFilled = pin.length > idx;
                return (
                  <div
                    key={idx}
                    style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: isFilled
                        ? error
                          ? '#EF4444'
                          : 'var(--accent-orange)'
                        : 'rgba(255, 255, 255, 0.12)',
                      boxShadow: isFilled
                        ? `0 0 10px ${error ? '#EF4444' : 'var(--accent-orange)'}`
                        : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  />
                );
              })}
              {pin.length > 4 && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-orange)' }}>
                  +{pin.length - 4}
                </span>
              )}
            </div>
          </div>

          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                color: '#EF4444',
                fontSize: '0.76rem',
                fontFamily: 'var(--font-mono)',
                marginTop: '0.65rem',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Digital Numeric Keypad */}
        <div
          style={{
            padding: '1.5rem 2rem 1.75rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
          }}
        >
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', '⌫'].map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                if (k === 'CLR') setPin('');
                else if (k === '⌫') setPin((prev) => prev.slice(0, -1));
                else handleKeyPadClick(k);
              }}
              style={{
                height: '48px',
                background:
                  k === 'CLR' || k === '⌫'
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: k === 'CLR' ? '#EF4444' : '#F5F5F2',
                fontFamily: 'var(--font-heading)',
                fontSize: k === 'CLR' ? '0.78rem' : '1.15rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 90, 31, 0.18)';
                e.currentTarget.style.borderColor = 'rgba(255, 90, 31, 0.45)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  k === 'CLR' || k === '⌫'
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(255, 255, 255, 0.07)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Actions Bottom Bar */}
        <div
          style={{
            padding: '1.25rem 2rem 1.75rem',
            background: 'rgba(0, 0, 0, 0.4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <button
            onClick={handleUnlock}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, var(--accent-orange) 0%, #E04E15 100%)',
              border: 'none',
              color: '#000000',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.88rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px rgba(255, 90, 31, 0.35)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.1)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <KeyRound size={16} strokeWidth={2.5} />
            <span>UNLOCK DEALER CONSOLE</span>
          </button>

          <div
            style={{
              textAlign: 'center',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              color: '#71716D',
            }}
          >
            Showroom Master Key Hint: <span style={{ color: 'var(--accent-orange)' }}>1234</span>
          </div>
        </div>
      </div>
    </div>
  );
};
