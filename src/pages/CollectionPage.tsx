import React, { useState, useMemo } from 'react';
import { MOTORCYCLES } from '../data/motorcycles';
import {
  Search,
  ArrowRight,
  ChevronDown,
  X,
  RotateCcw,
  Heart,
  ShieldCheck,
  Check,
  ArrowUpDown,
} from 'lucide-react';

interface CollectionPageProps {
  onSelectMachine: (id: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  initialCategory?: string;
}

const CATEGORY_SHORTCUTS = [
  'ALL',
  'ADVENTURE',
  'ROADSTER',
  'SUPERBIKE',
  'CRUISER',
  'TOURING',
  'SPORT',
  'CLASSIC',
];

const BRAND_OPTIONS = [
  'ALL',
  'BMW MOTORRAD',
  'DUCATI',
  'TRIUMPH',
  'KAWASAKI',
  'HARLEY-DAVIDSON',
  'INDIAN MOTORCYCLE',
  'APRILIA',
  'SUZUKI',
  'HONDA',
];

const YEAR_OPTIONS = ['ALL', '2024', '2023', '2022', '2021'];

const KM_OPTIONS = [
  { label: 'ALL ODOMETERS', value: 999999 },
  { label: 'UNDER 5,000 KM', value: 5000 },
  { label: 'UNDER 8,000 KM', value: 8000 },
  { label: 'UNDER 10,000 KM', value: 10000 },
];

const SORT_OPTIONS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price — Low to High', value: 'price-asc' },
  { label: 'Price — High to Low', value: 'price-desc' },
  { label: 'Year — Most Recent', value: 'year-desc' },
  { label: 'Kilometres — Lowest First', value: 'km-asc' },
];

export const CollectionPage: React.FC<CollectionPageProps> = ({
  onSelectMachine,
  favorites,
  onToggleFavorite,
  initialCategory = 'ALL',
}) => {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [maxKm, setMaxKm] = useState<number>(999999);
  const [maxPrice, setMaxPrice] = useState<number>(3000000);
  const [sortBy, setSortBy] = useState<string>('newest');

  // Active dropdown drawer popover
  const [openDropdown, setOpenDropdown] = useState<'style' | 'brand' | 'price' | 'year' | 'km' | 'sort' | null>(null);

  // Pagination state: "LOAD MORE MACHINES →"
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Filtered & Sorted inventory
  const filteredBikes = useMemo(() => {
    return MOTORCYCLES.filter((bike) => {
      // Category filter
      if (selectedCategory !== 'ALL' && bike.category !== selectedCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'ALL' && bike.brand !== selectedBrand) {
        return false;
      }
      // Year filter
      if (selectedYear !== 'ALL' && bike.year.toString() !== selectedYear) {
        return false;
      }
      // KM filter
      if (bike.kilometres > maxKm) {
        return false;
      }
      // Price filter
      if (bike.price > maxPrice) {
        return false;
      }
      // Search query (make, model, or style/category)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const haystack = `${bike.brand} ${bike.model} ${bike.category} ${bike.location} ${bike.variant}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'km-asc') return a.kilometres - b.kilometres;
      // Default: Newest arrivals / featured first
      return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
    });
  }, [selectedCategory, selectedBrand, selectedYear, maxKm, maxPrice, sortBy, searchQuery]);

  // Featured motorcycle at top of grid (Ducati Panigale V2 Bayliss or first matching bike)
  const featuredBike = useMemo(() => {
    return filteredBikes.find((b) => b.id === 'ducati-panigale-v2-bayliss-2022') || filteredBikes[0];
  }, [filteredBikes]);

  // Remaining grid bikes (excluding featured if it exists)
  const gridBikes = useMemo(() => {
    if (!featuredBike) return [];
    return filteredBikes.filter((b) => b.id !== featuredBike.id);
  }, [filteredBikes, featuredBike]);

  const displayedGridBikes = gridBikes.slice(0, visibleCount);
  const hasMore = visibleCount < gridBikes.length;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setSelectedYear('ALL');
    setMaxKm(999999);
    setMaxPrice(3000000);
    setSortBy('newest');
    setOpenDropdown(null);
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== 'ALL' ||
    selectedBrand !== 'ALL' ||
    selectedYear !== 'ALL' ||
    maxKm < 999999 ||
    maxPrice < 3000000;

  const toggleDropdown = (name: 'style' | 'brand' | 'price' | 'year' | 'km' | 'sort') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        paddingTop: '130px',
        paddingBottom: '8rem',
        background: 'var(--bg-primary)',
        position: 'relative',
      }}
      onClick={() => setOpenDropdown(null)}
    >
      <div className="container-wide">
        
        {/* ==================================================
            HEADER: THE COLLECTION.
           ================================================== */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <span className="telemetry-badge accent">
              <span className="dot" /> FANCY RIDES / SHOWROOM CATALOGUE
            </span>

            {/* Total count display */}
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                letterSpacing: '0.12em',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
              }}
            >
              <span style={{ color: '#F5F5F2' }}>34 MACHINES</span>
              <span style={{ opacity: 0.35 }}>·</span>
              <span>{filteredBikes.length} CURRENTLY MATCHED</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem' }}>
            <div>
              <h1
                style={{
                  fontSize: 'clamp(3.2rem, 7vw, 6.2rem)',
                  lineHeight: 0.9,
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  color: '#F5F5F2',
                }}
              >
                THE <br />
                <span style={{ color: '#9B9B9B' }}>COLLECTION.</span>
              </h1>

              {/* Supporting Line */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(0.82rem, 1.2vw, 0.98rem)',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  color: '#9B9B9B',
                  textTransform: 'uppercase',
                  lineHeight: 1.5,
                }}
              >
                CURATED MACHINES. <br />
                READY FOR THEIR NEXT RIDER.
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="btn-secondary"
                style={{ padding: '10px 20px', fontSize: '0.76rem' }}
              >
                <RotateCcw size={13} /> RESET ALL FILTERS
              </button>
            )}
          </div>
        </div>

        {/* ==================================================
            SEARCH BAR (22PX RADIUS, DARK SURFACE, SUBTLE FOCUS)
           ================================================== */}
        <div
          className="search-input-container"
          style={{ marginBottom: '2rem' }}
          onClick={(e) => e.stopPropagation()}
        >
          <span
            style={{
              fontSize: '1.25rem',
              color: 'var(--accent-orange)',
              marginRight: '1rem',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1,
            }}
          >
            ⌕
          </span>

          <input
            type="text"
            placeholder="SEARCH MAKE, MODEL OR STYLE (E.G. PANIGALE, BMW, SUPERBIKE, DELHI)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.4rem',
              }}
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* ==================================================
            ROUNDED FILTER PILLS [ STYLE ↓ ] [ BRAND ↓ ] ETC.
           ================================================== */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Filter Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
            
            {/* STYLE DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => toggleDropdown('style')}
                className={`filter-pill-btn ${selectedCategory !== 'ALL' ? 'active' : ''}`}
              >
                {selectedCategory !== 'ALL' && <span className="active-dot" />}
                <span>STYLE: {selectedCategory}</span>
                <ChevronDown size={13} />
              </button>

              {openDropdown === 'style' && (
                <div className="filter-dropdown-menu">
                  {CATEGORY_SHORTCUTS.map((cat) => (
                    <div
                      key={cat}
                      className="filter-dropdown-item"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <Check size={13} color="var(--accent-orange)" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BRAND DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => toggleDropdown('brand')}
                className={`filter-pill-btn ${selectedBrand !== 'ALL' ? 'active' : ''}`}
              >
                {selectedBrand !== 'ALL' && <span className="active-dot" />}
                <span>BRAND: {selectedBrand}</span>
                <ChevronDown size={13} />
              </button>

              {openDropdown === 'brand' && (
                <div className="filter-dropdown-menu">
                  {BRAND_OPTIONS.map((b) => (
                    <div
                      key={b}
                      className="filter-dropdown-item"
                      onClick={() => {
                        setSelectedBrand(b);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{b}</span>
                      {selectedBrand === b && <Check size={13} color="var(--accent-orange)" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PRICE DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => toggleDropdown('price')}
                className={`filter-pill-btn ${maxPrice < 3000000 ? 'active' : ''}`}
              >
                {maxPrice < 3000000 && <span className="active-dot" />}
                <span>PRICE: UP TO ₹{(maxPrice / 100000).toFixed(0)} L</span>
                <ChevronDown size={13} />
              </button>

              {openDropdown === 'price' && (
                <div className="filter-dropdown-menu" style={{ width: '280px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>MAX VALUATION</span>
                    <span style={{ color: '#F5F5F2', fontWeight: 800 }}>₹{(maxPrice / 100000).toFixed(2)} L</span>
                  </div>
                  <input
                    type="range"
                    min={1000000}
                    max={3000000}
                    step={100000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-orange)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    <span>₹10 L</span>
                    <span>₹30 L+</span>
                  </div>
                </div>
              )}
            </div>

            {/* YEAR DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => toggleDropdown('year')}
                className={`filter-pill-btn ${selectedYear !== 'ALL' ? 'active' : ''}`}
              >
                {selectedYear !== 'ALL' && <span className="active-dot" />}
                <span>YEAR: {selectedYear}</span>
                <ChevronDown size={13} />
              </button>

              {openDropdown === 'year' && (
                <div className="filter-dropdown-menu">
                  {YEAR_OPTIONS.map((yr) => (
                    <div
                      key={yr}
                      className="filter-dropdown-item"
                      onClick={() => {
                        setSelectedYear(yr);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{yr}</span>
                      {selectedYear === yr && <Check size={13} color="var(--accent-orange)" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* KM DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => toggleDropdown('km')}
                className={`filter-pill-btn ${maxKm < 999999 ? 'active' : ''}`}
              >
                {maxKm < 999999 && <span className="active-dot" />}
                <span>ODOMETER: {maxKm === 999999 ? 'ALL' : `< ${maxKm.toLocaleString()} KM`}</span>
                <ChevronDown size={13} />
              </button>

              {openDropdown === 'km' && (
                <div className="filter-dropdown-menu">
                  {KM_OPTIONS.map((opt) => (
                    <div
                      key={opt.label}
                      className="filter-dropdown-item"
                      onClick={() => {
                        setMaxKm(opt.value);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>{opt.label}</span>
                      {maxKm === opt.value && <Check size={13} color="var(--accent-orange)" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: SORT BY DROPDOWN */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => toggleDropdown('sort')}
              className="filter-pill-btn"
            >
              <ArrowUpDown size={13} color="var(--accent-orange)" />
              <span>SORT: {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}</span>
              <ChevronDown size={13} />
            </button>

            {openDropdown === 'sort' && (
              <div className="filter-dropdown-menu" style={{ right: 0, left: 'auto', width: '240px' }}>
                {SORT_OPTIONS.map((s) => (
                  <div
                    key={s.value}
                    className="filter-dropdown-item"
                    onClick={() => {
                      setSortBy(s.value);
                      setOpenDropdown(null);
                    }}
                  >
                    <span>{s.label}</span>
                    {sortBy === s.value && <Check size={13} color="var(--accent-orange)" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            CATEGORY SHORTCUTS: ROUNDED PILLS
           ================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '3rem',
            scrollbarWidth: 'none',
          }}
        >
          {CATEGORY_SHORTCUTS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-pill-btn ${isActive ? 'active' : ''}`}
                style={{ flexShrink: 0 }}
              >
                {isActive && <span className="active-dot" />}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* ==================================================
            INVENTORY EMPTY STATE OR GRID
           ================================================== */}
        {filteredBikes.length === 0 ? (
          <div
            style={{
              background: 'var(--bg-surface-card)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-container)',
              padding: '5rem 2rem',
              textAlign: 'center',
            }}
          >
            <Search size={44} strokeWidth={1.5} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem', color: '#F5F5F2' }}>
              NO MACHINES FOUND
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 1.75rem' }}>
              No machines match your current query or filter criteria. Try resetting the filters to view the full collection.
            </p>
            <button onClick={resetAllFilters} className="btn-primary">
              <span>RESET ALL FILTERS</span>
              <span className="btn-arrow">→</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* ==================================================
                FEATURED INVENTORY: WIDER 2-COLUMN SHOWCASE
               ================================================== */}
            {featuredBike && (
              <div
                className="featured-wide-card"
                data-cursor="VIEW"
                onClick={() => onSelectMachine(featuredBike.id)}
                style={{
                  position: 'relative',
                  background: 'var(--bg-surface-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-card)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(12, 1fr)',
                  transition: 'border-color var(--transition-smooth), transform var(--transition-smooth), box-shadow var(--transition-smooth)',
                }}
              >
                {/* Visual Image Section (7 Cols) */}
                <div
                  className="image-wrapper"
                  style={{
                    gridColumn: 'span 7',
                    position: 'relative',
                    aspectRatio: '16 / 10',
                    minHeight: '380px',
                    overflow: 'hidden',
                    background: '#090909',
                    borderRadius: '20px 0 0 20px',
                  }}
                >
                  <img
                    src={featuredBike.images[0]}
                    alt={`${featuredBike.brand} ${featuredBike.model}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />

                  {/* Scrim */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, transparent 70%, rgba(16,16,16,0.9) 100%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Top Badge */}
                  <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 2, display: 'flex', gap: '0.5rem' }}>
                    <span
                      style={{
                        background: '#161616',
                        border: '1px solid rgba(255, 90, 31, 0.4)',
                        color: '#F5F5F2',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.64rem',
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
                      FEATURED SHOWCASE
                    </span>
                    <span
                      style={{
                        background: 'rgba(10, 10, 10, 0.75)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(8px)',
                        color: '#9B9B9B',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.64rem',
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
                      150+ PT CERTIFIED
                    </span>
                  </div>
                </div>

                {/* Information Section (5 Cols) */}
                <div
                  className="card-content"
                  style={{
                    gridColumn: 'span 5',
                    padding: 'clamp(1.75rem, 3.5vw, 3rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    zIndex: 2,
                    background: 'var(--bg-surface-card)',
                  }}
                >
                  <div>
                    {/* Tiny Category Label Above Brand */}
                    <div className="category-pill-label" style={{ marginBottom: '0.4rem' }}>
                      {featuredBike.category}
                    </div>

                    {/* Brand */}
                    <div className="brand-label">
                      {featuredBike.brand}
                    </div>

                    {/* Model */}
                    <h2
                      style={{
                        fontSize: 'clamp(2rem, 3.2vw, 3rem)',
                        fontWeight: 800,
                        lineHeight: 1.05,
                        letterSpacing: '-0.03em',
                        marginBottom: '0.65rem',
                        color: '#F5F5F2',
                      }}
                    >
                      {featuredBike.model}
                    </h2>

                    {/* Price: Restrained typography */}
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.8rem, 2.5vw, 2.2rem)',
                        fontWeight: 800,
                        color: '#F5F5F2',
                        letterSpacing: '-0.02em',
                        marginBottom: '1.25rem',
                      }}
                    >
                      {featuredBike.priceDisplay}
                    </div>

                    {/* Metadata: Year · KM · Owners · Location */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.45rem 0.85rem',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.76rem',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        paddingTop: '0.85rem',
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                    >
                      <span>{featuredBike.year}</span>
                      <span style={{ opacity: 0.35 }}>·</span>
                      <span>{featuredBike.kmDisplay}</span>
                      <span style={{ opacity: 0.35 }}>·</span>
                      <span>{featuredBike.ownerDisplay}</span>
                      <span style={{ opacity: 0.35 }}>·</span>
                      <span style={{ color: '#F5F5F2' }}>{featuredBike.location}</span>
                    </div>
                  </div>

                  {/* Action & Favorite */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '1.75rem',
                      paddingTop: '0.85rem',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span className="view-link">
                      <span>VIEW MACHINE</span>
                      <span className="view-link-arrow">
                        <ArrowRight size={14} strokeWidth={2} />
                      </span>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(featuredBike.id, e);
                      }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-medium)',
                        color: favorites.includes(featuredBike.id) ? 'var(--accent-orange)' : '#9B9B9B',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      aria-label="Save to garage"
                    >
                      <Heart size={15} fill={favorites.includes(featuredBike.id) ? 'var(--accent-orange)' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Orange Edge Effect on Bottom */}
                <div
                  className="card-hover-edge"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '2px',
                    width: '0%',
                    background: 'var(--accent-orange)',
                    boxShadow: '0 0 10px var(--accent-orange)',
                    transition: 'width 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />
              </div>
            )}

            {/* ==================================================
                INVENTORY GRID: SPACIOUS 2-COLUMN LAYOUT
               ================================================== */}
            <div
              className="collection-2col-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2.25rem',
              }}
            >
              {displayedGridBikes.map((bike) => {
                const isFav = favorites.includes(bike.id);
                return (
                  <div
                    key={bike.id}
                    className="machine-card"
                    data-cursor="VIEW"
                    onClick={() => onSelectMachine(bike.id)}
                  >
                    {/* Large Image */}
                    <div className="image-wrapper">
                      <img
                        src={bike.images[0]}
                        alt={`${bike.brand} ${bike.model}`}
                        loading="lazy"
                      />

                      {/* Top Badges */}
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 2, display: 'flex', gap: '0.45rem' }}>
                        {bike.newArrival && (
                          <span
                            style={{
                              background: '#161616',
                              border: '1px solid rgba(255, 90, 31, 0.4)',
                              color: '#F5F5F2',
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
                            backdropFilter: 'blur(8px)',
                            color: '#9B9B9B',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            padding: '0.28rem 0.65rem',
                            textTransform: 'uppercase',
                            borderRadius: '999px',
                          }}
                        >
                          {bike.category}
                        </span>
                      </div>

                      {/* Top Right Wishlist */}
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(bike.id, e);
                          }}
                          style={{
                            background: 'rgba(10, 10, 10, 0.75)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            backdropFilter: 'blur(8px)',
                            color: isFav ? 'var(--accent-orange)' : '#9B9B9B',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          aria-label="Save to garage"
                        >
                          <Heart size={15} fill={isFav ? 'var(--accent-orange)' : 'none'} />
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
                        <span>{bike.horsepower} HP</span>
                        <span style={{ opacity: 0.3 }}>·</span>
                        <span>{bike.engineCC} CC</span>
                        <span style={{ opacity: 0.3 }}>·</span>
                        <span>{bike.zeroToHundred}s</span>
                      </div>
                    </div>

                    {/* Card Content with Hierarchy */}
                    <div className="card-content">
                      {/* Tiny Category Label Above Brand */}
                      <div className="category-pill-label">
                        {bike.category}
                      </div>

                      {/* Brand */}
                      <div className="brand-label">
                        {bike.brand}
                      </div>

                      {/* Model */}
                      <h3 className="model-title">
                        {bike.model}
                      </h3>

                      {/* Restrained Price Typography */}
                      <div className="price-tag">
                        {bike.priceDisplay}
                      </div>

                      {/* Specs Meta: 2023 · 8,400 KM · 1ST OWNER */}
                      <div className="specs-meta">
                        <span>{bike.year}</span>
                        <span style={{ opacity: 0.35 }}>·</span>
                        <span>{bike.kmDisplay}</span>
                        <span style={{ opacity: 0.35 }}>·</span>
                        <span>{bike.ownerDisplay}</span>
                        <span style={{ opacity: 0.35 }}>·</span>
                        <span>{bike.location}</span>
                      </div>

                      {/* Action Row */}
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
              })}
            </div>

            {/* ==================================================
                BOTTOM: LOAD MORE MACHINES →
               ================================================== */}
            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  SHOWING {displayedGridBikes.length + 1} OF {filteredBikes.length} CERTIFIED MACHINES
                </div>

                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="btn-primary"
                  style={{ padding: '14px 36px' }}
                >
                  <span>LOAD MORE MACHINES</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Scoped CSS for Dropdown Menus and Responsiveness */}
      <style>{`
        .filter-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          background: #141414;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.9);
          z-index: 50;
          min-width: 210px;
          max-height: 280px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          padding: 0.5rem 0;
        }
        .filter-dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1.25rem;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .filter-dropdown-item:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #F5F5F2;
        }
        
        .featured-wide-card:hover {
          border-color: rgba(255, 255, 255, 0.18) !important;
          transform: translateY(-5px);
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.7), 0 0 25px var(--accent-orange-glow);
        }
        .featured-wide-card:hover .image-wrapper img {
          transform: scale(1.035);
        }
        .featured-wide-card:hover .card-hover-edge {
          width: 100% !important;
        }

        @media (max-width: 960px) {
          .featured-wide-card {
            grid-template-columns: 1fr !important;
          }
          .featured-wide-card .image-wrapper {
            grid-column: span 12 !important;
            border-radius: 20px 20px 0 0 !important;
          }
          .featured-wide-card .card-content {
            grid-column: span 12 !important;
          }
          .collection-2col-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
