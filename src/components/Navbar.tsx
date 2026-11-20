import React, { useState, useEffect, useRef } from 'react';
import { Search, Heart, Menu, X, ArrowUpRight, Lock } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

interface NavbarProps {
  activePage: 'home' | 'collection' | 'detail' | 'fancy-numbers' | 'admin';
  onNavigate: (page: 'home' | 'collection' | 'detail' | 'fancy-numbers' | 'admin', params?: { category?: string; machineId?: string }) => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenSellModal: () => void;
  onOpenSearch: () => void;
  onOpenAdminPrompt?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  favoritesCount,
  onOpenFavorites,
  onOpenSellModal,
  onOpenSearch,
  onOpenAdminPrompt,
}) => {
  const { isAdmin } = useInventory();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Secret Key Sequences for Admin:
  // 1. Typing "admin" anywhere on keyboard
  // 2. Ctrl + Shift + A (or Cmd + Shift + A)
  const typedSequenceRef = useRef<string[]>([]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Keyboard shortcut: Ctrl + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (onOpenAdminPrompt) onOpenAdminPrompt();
        else onNavigate('admin');
        return;
      }

      // 2. Typing "admin" in sequence
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        typedSequenceRef.current.push(e.key.toLowerCase());
        if (typedSequenceRef.current.length > 5) {
          typedSequenceRef.current.shift();
        }
        if (typedSequenceRef.current.join('') === 'admin') {
          typedSequenceRef.current = [];
          if (onOpenAdminPrompt) onOpenAdminPrompt();
          else onNavigate('admin');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdminPrompt, onNavigate]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: isScrolled ? '0.75rem 1.25rem' : '1.25rem 1.5rem',
          transition: 'padding 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
      >
        {/* Floating Pill Navigation Container */}
        <div
          className={`nav-floating-pill ${isScrolled ? 'scrolled' : ''}`}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Brand Monogram & Title */}
          <div
            onClick={() => onNavigate('home')}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              userSelect: 'none',
            }}
            title="Fancy Rides India"
          >
            <div
              style={{
                width: '34px',
                height: '32px',
                background: isAdmin ? 'rgba(255, 90, 31, 0.2)' : '#161616',
                border: `1px solid ${isAdmin ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.12)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: isAdmin ? 'var(--accent-orange)' : '#F5F5F2',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                borderRadius: '8px',
                letterSpacing: '-0.02em',
                transition: 'all 0.25s ease',
                boxShadow: isAdmin ? '0 0 12px rgba(255, 90, 31, 0.3)' : 'none',
              }}
            >
              FRI
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  letterSpacing: '0.06em',
                  color: '#F5F5F2',
                }}
              >
                FANCY
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.14em',
                  color: '#9B9B9B',
                }}
              >
                RIDES
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  letterSpacing: '0.14em',
                  color: 'var(--accent-orange)',
                }}
              >
                INDIA
              </span>
            </div>
          </div>

          {/* Desktop Center Links with Animated Thin Underline */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
            }}
            className="desktop-nav-links"
          >
            <button
              onClick={() => onNavigate('home')}
              className={`nav-link-item ${activePage === 'home' ? 'active' : ''}`}
            >
              HOME
            </button>

            <button
              onClick={() => onNavigate('collection')}
              className={`nav-link-item ${activePage === 'collection' ? 'active' : ''}`}
            >
              COLLECTION
            </button>

            <button
              onClick={() => onNavigate('fancy-numbers')}
              className={`nav-link-item ${activePage === 'fancy-numbers' ? 'active' : ''}`}
              style={{
                color: activePage === 'fancy-numbers' ? 'var(--accent-orange)' : undefined,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>VIP NUMBERS</span>
              <span
                style={{
                  background: 'rgba(255, 90, 31, 0.15)',
                  color: 'var(--accent-orange)',
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 90, 31, 0.3)',
                }}
              >
                0001
              </span>
            </button>

            <button
              onClick={() => {
                if (activePage !== 'home') {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                } else {
                  document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="nav-link-item"
            >
              STYLES
            </button>

            <button
              onClick={() => {
                if (activePage !== 'home') {
                  onNavigate('home');
                  setTimeout(() => {
                    document.getElementById('brands-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 150);
                } else {
                  document.getElementById('brands-section')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="nav-link-item"
            >
              BRANDS
            </button>

            <button
              onClick={() => {
                if (isAdmin) {
                  onNavigate('admin');
                } else if (onOpenAdminPrompt) {
                  onOpenAdminPrompt();
                } else {
                  onNavigate('admin');
                }
              }}
              className={`nav-link-item ${activePage === 'admin' ? 'active' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: activePage === 'admin' ? 'var(--accent-orange)' : undefined,
              }}
              title="Client Inventory Portal (Passcode Required)"
            >
              <Lock size={12} color="var(--accent-orange)" />
              <span>PORTAL</span>
            </button>
          </nav>

          {/* Right Action Icons & Sell Ride CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={onOpenSearch}
              style={{
                background: 'none',
                border: 'none',
                color: '#9B9B9B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                padding: '0.35rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#F5F5F2')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
              title="Search"
            >
              <Search size={17} />
              <span className="hide-on-mobile">SEARCH</span>
            </button>

            <button
              onClick={onOpenFavorites}
              style={{
                background: 'none',
                border: 'none',
                color: favoritesCount > 0 ? 'var(--text-primary)' : '#9B9B9B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                padding: '0.35rem',
                position: 'relative',
                transition: 'color 0.2s ease',
              }}
              title="Saved Garage"
            >
              <div style={{ position: 'relative', display: 'flex' }}>
                <Heart size={17} fill={favoritesCount > 0 ? 'var(--accent-orange)' : 'none'} color={favoritesCount > 0 ? 'var(--accent-orange)' : 'currentColor'} />
                {favoritesCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -7,
                      background: 'var(--accent-orange)',
                      color: '#050505',
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className="hide-on-mobile">GARAGE</span>
            </button>

            <button
              onClick={() => {
                if (isAdmin) {
                  onNavigate('admin');
                } else if (onOpenAdminPrompt) {
                  onOpenAdminPrompt();
                } else {
                  onNavigate('admin');
                }
              }}
              style={{
                background: isAdmin ? 'rgba(255, 90, 31, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${isAdmin ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '999px',
                color: isAdmin ? 'var(--accent-orange)' : '#F5F5F2',
                padding: '5px 12px',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: isAdmin ? '0 0 12px rgba(255, 90, 31, 0.25)' : 'none',
                transition: 'all 0.2s ease',
              }}
              title="Client Inventory Portal (Passcode: 1234)"
            >
              <Lock size={12} color="var(--accent-orange)" />
              <span>{isAdmin ? 'CONSOLE' : 'PORTAL'}</span>
            </button>

            <button
              onClick={onOpenSellModal}
              className="btn-special-cta hide-on-mobile"
              style={{ padding: '7px 10px 7px 18px', fontSize: '0.76rem' }}
            >
              <span>SELL RIDE</span>
              <span className="cta-icon-bubble" style={{ width: '26px', height: '26px' }}>
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#F5F5F2',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                transition: 'all 0.2s ease',
              }}
              title="Menu"
            >
              <Menu size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Slide Drawer / Menu Modal */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(5, 5, 5, 0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'clamp(1.5rem, 4vw, 3rem)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.78rem', letterSpacing: '0.1em' }}>
                [ FANCY RIDES INDIA ARCHIVE ]
              </span>
              <span className="telemetry-badge accent">
                <span className="dot" /> LIVE SHOWROOM
              </span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.14)',
                color: '#F5F5F2',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', margin: 'auto 0' }}>
            <div
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                cursor: 'pointer',
                color: activePage === 'home' ? '#F5F5F2' : '#666666',
                transition: 'all 0.2s ease',
              }}
            >
              01 / HOME
            </div>

            <div
              onClick={() => {
                onNavigate('collection');
                setMobileMenuOpen(false);
              }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                cursor: 'pointer',
                color: activePage === 'collection' ? '#F5F5F2' : '#666666',
                transition: 'all 0.2s ease',
              }}
            >
              02 / THE COLLECTION
            </div>

            <div
              onClick={() => {
                onNavigate('fancy-numbers');
                setMobileMenuOpen(false);
              }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                cursor: 'pointer',
                color: activePage === 'fancy-numbers' ? 'var(--accent-orange)' : '#666666',
                transition: 'all 0.2s ease',
              }}
            >
              03 / VIP NUMBERS (0001)
            </div>

            <div
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 200);
              }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                cursor: 'pointer',
                color: '#666666',
                transition: 'all 0.2s ease',
              }}
            >
              03 / CATEGORIES & STYLES
            </div>

            <div
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 200);
              }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                cursor: 'pointer',
                color: '#666666',
                transition: 'all 0.2s ease',
              }}
            >
              04 / 150+ PT INSPECTION
            </div>

            <div
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellModal();
              }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                cursor: 'pointer',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              05 / SELL YOUR RIDE <ArrowUpRight size={32} color="var(--accent-orange)" />
            </div>

            <div
              onClick={() => {
                setMobileMenuOpen(false);
                setTimeout(() => {
                  if (isAdmin) {
                    onNavigate('admin');
                  } else if (onOpenAdminPrompt) {
                    onOpenAdminPrompt();
                  } else {
                    onNavigate('admin');
                  }
                }, 50);
              }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                cursor: 'pointer',
                color: activePage === 'admin' ? 'var(--accent-orange)' : '#C5C5C0',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-orange)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = activePage === 'admin' ? 'var(--accent-orange)' : '#C5C5C0')}
            >
              <span>06 / CLIENT PORTAL</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  background: 'rgba(255, 90, 31, 0.15)',
                  border: '1px solid rgba(255, 90, 31, 0.4)',
                  color: 'var(--accent-orange)',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}
              >
                <Lock size={12} /> PIN
              </span>
            </div>
          </div>

          {/* Bottom Footer Details */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '1.5rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#9B9B9B',
            }}
          >
            <div>
              <span style={{ color: '#F5F5F2', display: 'block', marginBottom: '0.25rem' }}>
                SHOWROOM LOCATIONS:
              </span>
              <span>DELHI AEROCITY · MUMBAI BKC · BENGALURU</span>
            </div>
            <div>
              <span style={{ color: '#F5F5F2', display: 'block', marginBottom: '0.25rem' }}>
                PRIVATE CONCIERGE:
              </span>
              <span style={{ color: '#F5F5F2' }}>+91 98110 50000 · VIP@FANCYRIDES.IN</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
