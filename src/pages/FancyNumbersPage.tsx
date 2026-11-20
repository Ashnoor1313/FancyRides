import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  Send,
  X,
  FileCheck,
  Crown,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import type { FancyNumber } from '../data/fancyNumbers';

interface FancyNumbersPageProps {
  onNavigate: (page: 'home' | 'collection' | 'detail' | 'fancy-numbers' | 'admin') => void;
}

export const FancyNumbersPage: React.FC<FancyNumbersPageProps> = ({ onNavigate }) => {
  const { fancyNumbers } = useInventory();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-desc' | 'price-asc'>('featured');

  // Enquiry Modal
  const [selectedNumberForEnquiry, setSelectedNumberForEnquiry] = useState<FancyNumber | null>(null);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryCity, setEnquiryCity] = useState('');
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  // Custom Number Request Form State
  const [customNumber, setCustomNumber] = useState('');
  const [customState, setCustomState] = useState('DELHI');
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customRequestSent, setCustomRequestSent] = useState(false);

  // Filter Logic
  const filteredNumbers = fancyNumbers
    .filter((fn) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        fn.number.toLowerCase().includes(q) ||
        fn.plateDisplay.toLowerCase().includes(q) ||
        fn.state.toLowerCase().includes(q) ||
        fn.category.toLowerCase().includes(q) ||
        fn.description.toLowerCase().includes(q);

      // State
      const matchState = selectedState === 'ALL' || fn.state === selectedState;

      // Category
      const matchCategory = selectedCategory === 'ALL' || fn.category === selectedCategory;

      return matchSearch && matchState && matchCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'price-desc') return b.price - a.price;
      if (sortOrder === 'price-asc') return a.price - b.price;
      // Default: featured first, then available, then price
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.price - a.price;
    });

  const handleOpenEnquiry = (fn: FancyNumber) => {
    setSelectedNumberForEnquiry(fn);
    setEnquirySuccess(false);
  };

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNumberForEnquiry) return;

    // Build WhatsApp URL
    const message = `Hello Fancy Rides India, I am interested in reserving VIP Registration Number: ${selectedNumberForEnquiry.plateDisplay} (${selectedNumberForEnquiry.number}).\nPrice: ${selectedNumberForEnquiry.priceDisplay}.\nMy Name: ${enquiryName}, Phone: ${enquiryPhone}, City: ${enquiryCity}. Please share procurement and transfer details.`;
    const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;

    setEnquirySuccess(true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 600);
  };

  const handleCustomRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello Fancy Rides India, I want to submit a Custom VIP Number Procurement Request:\nRequested Number: ${customNumber}\nPreferred State: ${customState}\nName: ${customName}, Phone: ${customPhone}. Please check availability across RTO allocations.`;
    const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(msg)}`;

    setCustomRequestSent(true);
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        color: '#F5F5F2',
        paddingTop: '6rem',
        paddingBottom: '8rem',
      }}
    >
      <div className="container-wide">
        {/* ==================================================
            HERO HEADER SECTION
           ================================================== */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 4rem', paddingTop: '2rem' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
            <span
              className="telemetry-badge accent"
              style={{
                background: 'rgba(255, 90, 31, 0.1)',
                border: '1px solid rgba(255, 90, 31, 0.4)',
                color: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.65), 0 0 16px rgba(255, 90, 31, 0.18)',
              }}
            >
              <Crown size={14} color="var(--accent-orange)" />
              FANCY RIDES INDIA // VIP REGISTRATION VAULT
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)',
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: '#F5F5F2',
              marginBottom: '1.5rem',
            }}
          >
            SOVEREIGN NUMBERS <br />
            FOR EXTRAORDINARY <br />
            <span style={{ color: 'var(--accent-orange)' }}>MACHINES.</span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              color: '#C7C7C2',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 2.25rem',
            }}
          >
            Curated prestigious registration numbers for India's most discerning collectors. Single digits, quad repeating, and iconic plates. Verified legal provenance, clean RTO clearance, and white-glove transfer.
          </p>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'inline-flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1.5rem',
              background: 'rgba(16, 16, 16, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              padding: '0.65rem 1.75rem',
              backdropFilter: 'blur(16px)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.76rem',
              color: '#9B9B9B',
            }}
          >
            <div>
              <span style={{ color: '#F5F5F2', fontWeight: 800 }}>{fancyNumbers.length}</span> VIP PLATES LISTED
            </div>
            <span>·</span>
            <div>
              <span style={{ color: 'var(--accent-orange)', fontWeight: 800 }}>PAN-INDIA</span> RTO TRANSFER
            </div>
            <span>·</span>
            <div>
              <span style={{ color: '#10B981', fontWeight: 800 }}>100% VERIFIED</span> CLEAN TITLE
            </div>
          </div>

          <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('collection')}
              className="btn-secondary"
              style={{ padding: '10px 22px', fontSize: '0.8rem' }}
            >
              EXPLORE MOTORCYCLE COLLECTION →
            </button>
          </div>
        </div>

        {/* ==================================================
            SEARCH & CATEGORY FILTERS
           ================================================== */}
        <div
          style={{
            background: 'linear-gradient(180deg, #121212 0%, #0B0B0B 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.75rem 2rem',
            marginBottom: '3rem',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Top Row: Search Input & Sort */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1.25rem',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            {/* Search */}
            <div
              style={{
                flex: '1 1 340px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: '#090909',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '10px 16px',
              }}
            >
              <Search size={18} color="var(--accent-orange)" />
              <input
                type="text"
                placeholder="Search number (e.g. 0001, 0007, 9999, 8055, 0786, DL, HR)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#F5F5F2',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  width: '100%',
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#888884' }}>
                SORT:
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                style={{
                  background: '#090909',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#F5F5F2',
                  padding: '9px 14px',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer',
                }}
              >
                <option value="featured">FEATURED FIRST</option>
                <option value="price-desc">PRICE: HIGH TO LOW</option>
                <option value="price-asc">PRICE: LOW TO HIGH</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category Filter Pills */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#888884', marginBottom: '0.65rem' }}>
              FILTER BY NUMBER STYLE:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {[
                { id: 'ALL', label: 'ALL NUMBERS' },
                { id: 'SINGLE DIGIT', label: 'SINGLE DIGIT (0001 - 0009)' },
                { id: 'QUAD / REPEATING', label: 'QUAD / REPEATING (9999, 1111...)' },
                { id: 'ICONIC / BOSS', label: 'ICONIC / BOSS (8055)' },
                { id: 'ROYAL HERITAGE', label: 'ROYAL HERITAGE (0786, 1313)' },
                { id: 'MIRROR & RADAR', label: 'MIRROR & RADAR (0055, 2121)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    background: selectedCategory === cat.id ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedCategory === cat.id ? '#000000' : '#D0D0CC',
                    border: `1px solid ${selectedCategory === cat.id ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '999px',
                    padding: '7px 16px',
                    fontSize: '0.76rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: State Filter Pills */}
          <div>
            <span style={{ display: 'block', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#888884', marginBottom: '0.65rem' }}>
              FILTER BY STATE / RTO JURISDICTION:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {[
                { id: 'ALL', label: 'ALL STATES' },
                { id: 'DELHI', label: 'DELHI (DL)' },
                { id: 'HARYANA', label: 'HARYANA (HR)' },
                { id: 'PUNJAB', label: 'PUNJAB (PB)' },
                { id: 'CHANDIGARH', label: 'CHANDIGARH (CH)' },
                { id: 'UP', label: 'UTTAR PRADESH (UP)' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedState(st.id)}
                  style={{
                    background: selectedState === st.id ? 'rgba(255, 90, 31, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                    color: selectedState === st.id ? 'var(--accent-orange)' : '#A0A09C',
                    border: `1px solid ${selectedState === st.id ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '8px',
                    padding: '5px 14px',
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================
            VIP NUMBERS GRID
           ================================================== */}
        {filteredNumbers.length === 0 ? (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              background: '#101010',
              borderRadius: '20px',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F5F5F2', marginBottom: '0.5rem' }}>
              No VIP numbers matched your criteria.
            </div>
            <p style={{ color: '#888884', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Looking for a custom lucky number or specific birthdate series? We can source it directly.
            </p>
            <button
              onClick={() => {
                setSelectedState('ALL');
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="btn-secondary"
              style={{ padding: '10px 22px', fontSize: '0.82rem' }}
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '2rem',
              marginBottom: '5rem',
            }}
          >
            {filteredNumbers.map((fn) => (
              <div
                key={fn.id}
                style={{
                  background: 'linear-gradient(165deg, #131313 0%, #0A0A0A 100%)',
                  border: `1px solid ${fn.featured ? 'rgba(255, 90, 31, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '22px',
                  padding: '2rem 1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: fn.featured
                    ? '0 16px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 90, 31, 0.1)'
                    : '0 12px 35px rgba(0, 0, 0, 0.6)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = 'var(--accent-orange)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(255, 90, 31, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = fn.featured ? 'rgba(255, 90, 31, 0.4)' : 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.boxShadow = fn.featured
                    ? '0 16px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(255, 90, 31, 0.1)'
                    : '0 12px 35px rgba(0, 0, 0, 0.6)';
                }}
              >
                {/* Top Corner Ribbon / Badge */}
                {fn.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: 'linear-gradient(135deg, var(--accent-orange) 0%, #D4440F 100%)',
                      color: '#000000',
                      fontSize: '0.64rem',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 900,
                      letterSpacing: '0.12em',
                      padding: '4px 14px',
                      borderRadius: '0 0 0 12px',
                    }}
                  >
                    ★ PREMIER ALLOCATION
                  </div>
                )}

                <div>
                  {/* Category & Status */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <span
                      style={{
                        background: 'rgba(255, 90, 31, 0.1)',
                        border: '1px solid rgba(255, 90, 31, 0.3)',
                        borderRadius: '6px',
                        padding: '3px 9px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: 'var(--accent-orange)',
                      }}
                    >
                      {fn.category}
                    </span>

                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: fn.status === 'AVAILABLE' ? '#10B981' : fn.status === 'RESERVED' ? '#F59E0B' : '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: fn.status === 'AVAILABLE' ? '#10B981' : fn.status === 'RESERVED' ? '#F59E0B' : '#EF4444',
                          boxShadow: `0 0 8px ${fn.status === 'AVAILABLE' ? '#10B981' : '#F59E0B'}`,
                        }}
                      />
                      {fn.status}
                    </span>
                  </div>

                  {/* ==================================================
                      REALISTIC HIGH-SECURITY INDIAN REGISTRATION PLATE
                     ================================================== */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '14px 20px',
                      border: '3px solid #202020',
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1), 0 10px 25px rgba(0,0,0,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.4rem',
                      position: 'relative',
                    }}
                  >
                    {/* Left IND Blue Band */}
                    <div
                      style={{
                        background: '#0B3B95',
                        borderRadius: '6px',
                        padding: '6px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        minWidth: '38px',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#F59E0B',
                          boxShadow: '0 0 4px #F59E0B',
                        }}
                      />
                      <span
                        style={{
                          color: '#FFFFFF',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          fontFamily: 'sans-serif',
                          letterSpacing: '0.05em',
                        }}
                      >
                        IND
                      </span>
                    </div>

                    {/* Registration Text (Bold German FE-Schrift Look) */}
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.5rem, 2.8vw, 1.9rem)',
                        fontWeight: 900,
                        letterSpacing: '0.14em',
                        color: '#080808',
                        textTransform: 'uppercase',
                        paddingLeft: '0.5rem',
                      }}
                    >
                      {fn.plateDisplay}
                    </div>
                  </div>

                  {/* Price Tag & State Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#888884', display: 'block' }}>
                        ACQUISITION PRICE
                      </span>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.75rem',
                          fontWeight: 900,
                          color: '#F5F5F2',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {fn.priceDisplay}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem',
                          color: '#D0D0CA',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        {fn.stateCode} · {fn.state}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.86rem',
                      color: '#9B9B9B',
                      lineHeight: 1.5,
                      marginBottom: '1rem',
                    }}
                  >
                    {fn.description}
                  </p>

                  {/* Transfer Status Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: '#10B981',
                      background: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '8px',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <FileCheck size={14} />
                    <span>{fn.transferStatus}</span>
                  </div>
                </div>

                {/* Reserve / Enquire CTA Button */}
                <button
                  onClick={() => handleOpenEnquiry(fn)}
                  disabled={fn.status === 'SOLD'}
                  className="btn-special-cta"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '12px 20px',
                    opacity: fn.status === 'SOLD' ? 0.5 : 1,
                    cursor: fn.status === 'SOLD' ? 'not-allowed' : 'pointer',
                  }}
                >
                  <span>
                    {fn.status === 'SOLD'
                      ? 'PLATE ACQUIRED (SOLD)'
                      : fn.status === 'RESERVED'
                      ? 'RESERVED · INQUIRE FOR QUEUE'
                      : 'RESERVE THIS NUMBER →'}
                  </span>
                  {fn.status !== 'SOLD' && (
                    <span className="cta-icon-bubble">
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ==================================================
            CUSTOM NUMBER PROCUREMENT REQUEST CARD
           ================================================== */}
        <div
          style={{
            background: 'linear-gradient(170deg, #161412 0%, #0D0D0C 100%)',
            border: '1px solid rgba(255, 90, 31, 0.4)',
            borderRadius: '26px',
            padding: ' clamp(2rem, 5vw, 3.5rem)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 90, 31, 0.12)',
            marginBottom: '4rem',
          }}
        >
          {/* Subtle Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 90, 31, 0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '780px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                color: 'var(--accent-orange)',
                fontWeight: 800,
                letterSpacing: '0.12em',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              BESPOKE RTO PROCUREMENT SERVICE
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#F5F5F2',
                lineHeight: 1.05,
                marginBottom: '1rem',
              }}
            >
              Seeking A Specific Lucky Number Or Birthdate Series?
            </h2>

            <p style={{ color: '#C4C4BD', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              If your desired combination (such as 0003, 5555, birth years like 1998, or unique numerology figures) is not currently displayed, our dealership concierge interfaces directly with RTO authorities across Delhi, Haryana, Punjab, and Chandigarh for custom assignment.
            </p>

            {customRequestSent ? (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid #10B981',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <CheckCircle size={28} color="#10B981" />
                <div>
                  <strong style={{ display: 'block', fontSize: '1.05rem', color: '#F5F5F2', marginBottom: '2px' }}>
                    VIP Procurement Inquiry Dispatched!
                  </strong>
                  <span style={{ fontSize: '0.84rem', color: '#A0A09C' }}>
                    Opening WhatsApp concierge with your target digits: {customNumber} ({customState}).
                  </span>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleCustomRequestSubmit}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    DESIRED NUMBER *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0003, 5555, 1998"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    STATE / JURISDICTION
                  </label>
                  <select
                    value={customState}
                    onChange={(e) => setCustomState(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    <option value="DELHI">DELHI (DL)</option>
                    <option value="HARYANA">HARYANA (HR)</option>
                    <option value="PUNJAB">PUNJAB (PB)</option>
                    <option value="CHANDIGARH">CHANDIGARH (CH)</option>
                    <option value="UP">UTTAR PRADESH (UP)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    PHONE / WHATSAPP *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="btn-special-cta"
                    style={{ width: '100%', padding: '12px 18px', fontSize: '0.82rem' }}
                  >
                    <span>SUBMIT INQUIRY</span>
                    <span className="cta-icon-bubble">
                      <Send size={14} />
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ==================================================
            4-STEP RTO LEGAL & TRANSFER PROCESS
           ================================================== */}
        <div style={{ marginTop: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-orange)', fontWeight: 800 }}>
              VERIFIED CONCIERGE WORKFLOW
            </span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: '#F5F5F2' }}>
              How Fancy Number Allocation Works
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                step: '01',
                title: 'SELECT & LOCK NUMBER',
                desc: 'Choose your desired sovereign plate or request a custom combination. Lock the allocation with a nominal holding token.',
              },
              {
                step: '02',
                title: 'FORENSIC TITLE AUDIT',
                desc: 'Our legal and RTO specialists verify authentic registration series, zero hypothecation, and clean national crime records.',
              },
              {
                step: '03',
                title: 'NOC & AUTHORITY ENDORSEMENT',
                desc: 'Official RTO No Objection Certificate (NOC) and transfer dossier prepared for your designated state jurisdiction.',
              },
              {
                step: '04',
                title: 'WHITE-GLOVE PLATE HANDOVER',
                desc: 'Original documents, HSRP laser-embossed plate set, and endorsement receipt delivered directly to your doorstep.',
              },
            ].map((st) => (
              <div
                key={st.step}
                style={{
                  background: '#111111',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '2rem 1.75rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: 'var(--accent-orange)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {st.step}
                </div>
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F5F5F2', marginBottom: '0.65rem' }}>
                  {st.title}
                </h4>
                <p style={{ color: '#9B9B9B', fontSize: '0.84rem', lineHeight: 1.6, margin: 0 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ==================================================
          RESERVE / ENQUIRE MODAL
         ================================================== */}
      {selectedNumberForEnquiry && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setSelectedNumberForEnquiry(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#121212',
              border: '1px solid rgba(255, 90, 31, 0.45)',
              borderRadius: '24px',
              padding: '2.5rem',
              position: 'relative',
              boxShadow: '0 30px 80px rgba(0,0,0,0.95), 0 0 40px rgba(255,90,31,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNumberForEnquiry(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                color: '#888',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>

            {/* Modal Title */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--accent-orange)',
                fontWeight: 800,
                letterSpacing: '0.12em',
                display: 'block',
                marginBottom: '0.35rem',
              }}
            >
              VIP ALLOCATION CONCIERGE
            </span>

            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 900,
                color: '#F5F5F2',
                margin: '0 0 1rem',
              }}
            >
              Reserve Plate: {selectedNumberForEnquiry.plateDisplay}
            </h3>

            {/* Plate Highlight Box */}
            <div
              style={{
                background: '#FFFFFF',
                color: '#000000',
                borderRadius: '10px',
                padding: '10px 16px',
                border: '2px solid #202020',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900 }}>
                {selectedNumberForEnquiry.plateDisplay}
              </span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#D4440F' }}>
                {selectedNumberForEnquiry.priceDisplay}
              </span>
            </div>

            {enquirySuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F5F5F2', marginBottom: '0.5rem' }}>
                  Connecting to Showroom Concierge...
                </h4>
                <p style={{ fontSize: '0.86rem', color: '#9B9B9B', lineHeight: 1.5 }}>
                  Redirecting to Fancy Rides India VIP Desk via WhatsApp to lock in your allocation and discuss transfer documents.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    YOUR FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={enquiryName}
                    onChange={(e) => setEnquiryName(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#080808',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    PHONE / WHATSAPP NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={enquiryPhone}
                    onChange={(e) => setEnquiryPhone(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#080808',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    YOUR CITY / STATE (FOR RTO ASSIGNMENT) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Delhi, Gurugram, Ludhiana, Chandigarh"
                    value={enquiryCity}
                    onChange={(e) => setEnquiryCity(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#080808',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-special-cta"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.88rem' }}
                >
                  <MessageSquare size={16} />
                  <span>PROCEED WITH WHATSAPP CONCIERGE</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
