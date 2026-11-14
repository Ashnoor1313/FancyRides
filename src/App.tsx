import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SignatureCursor } from './components/SignatureCursor';
import { BookingModal } from './components/BookingModal';
import { SellRideModal } from './components/SellRideModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { CollectionPage } from './pages/CollectionPage';
import { MachineDetailPage } from './pages/MachineDetailPage';
import type { Motorcycle } from './data/motorcycles';

export function App() {
  const [activePage, setActivePage] = useState<'home' | 'collection' | 'detail'>('home');
  const [selectedMachineId, setSelectedMachineId] = useState<string>('re-interceptor-650-2021');
  const [collectionCategory, setCollectionCategory] = useState<string>('ALL');

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [bookingMotorcycle, setBookingMotorcycle] = useState<Motorcycle | null>(null);
  const [sellModalOpen, setSellModalOpen] = useState<boolean>(false);
  const [favoritesOpen, setFavoritesOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  // Favorites garage saved in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fancy_rides_garage');
      return saved ? JSON.parse(saved) : ['re-interceptor-650-2021'];
    } catch {
      return ['re-interceptor-650-2021'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fancy_rides_garage', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // URL Hash Sync for fluid routing and sharing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('machine/')) {
        const id = hash.replace('machine/', '');
        setSelectedMachineId(id);
        setActivePage('detail');
      } else if (hash.startsWith('collection')) {
        const parts = hash.split('/');
        if (parts[1]) {
          setCollectionCategory(decodeURIComponent(parts[1]));
        }
        setActivePage('collection');
      } else {
        setActivePage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (
    page: 'home' | 'collection' | 'detail',
    params?: { category?: string; machineId?: string }
  ) => {
    if (page === 'home') {
      window.location.hash = 'home';
      setActivePage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'collection') {
      if (params?.category) {
        setCollectionCategory(params.category);
        window.location.hash = `collection/${encodeURIComponent(params.category)}`;
      } else {
        window.location.hash = 'collection';
      }
      setActivePage('collection');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'detail' && params?.machineId) {
      setSelectedMachineId(params.machineId);
      window.location.hash = `machine/${params.machineId}`;
      setActivePage('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (bike: Motorcycle) => {
    setBookingMotorcycle(bike);
    setBookingModalOpen(true);
  };

  return (
    <div className="app-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Signature Circular Magnetic Cursor */}
      <SignatureCursor />

      {/* Primary Floating / Sticky Navigation */}
      <Navbar
        activePage={activePage}
        onNavigate={navigateTo}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onOpenSellModal={() => setSellModalOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Pages */}
      <main style={{ flex: 1 }}>
        {activePage === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenSellModal={() => setSellModalOpen(true)}
          />
        )}

        {activePage === 'collection' && (
          <CollectionPage
            initialCategory={collectionCategory}
            onSelectMachine={(id) => navigateTo('detail', { machineId: id })}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {activePage === 'detail' && (
          <MachineDetailPage
            machineId={selectedMachineId}
            onBack={() => navigateTo('collection')}
            onSelectMachine={(id) => navigateTo('detail', { machineId: id })}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenBooking={handleOpenBooking}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenSellModal={() => setSellModalOpen(true)}
      />

      {/* Modals & Drawers */}
      <BookingModal
        isOpen={bookingModalOpen}
        motorcycle={bookingMotorcycle}
        onClose={() => setBookingModalOpen(false)}
      />

      <SellRideModal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
      />

      <FavoritesDrawer
        isOpen={favoritesOpen}
        favorites={favorites}
        onClose={() => setFavoritesOpen(false)}
        onRemoveFavorite={toggleFavorite}
        onSelectMachine={(id) => {
          setFavoritesOpen(false);
          navigateTo('detail', { machineId: id });
        }}
      />

      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectMachine={(id) => {
          setSearchOpen(false);
          navigateTo('detail', { machineId: id });
        }}
      />
    </div>
  );
}

export default App;
