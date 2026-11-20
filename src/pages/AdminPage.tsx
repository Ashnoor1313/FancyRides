import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Upload,
  Download,
  RotateCcw,
  Star,
  ExternalLink,
  Lock,
  Search,
  Sparkles,
  Eye,
  Sliders,
  Hash,
  Key,
} from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import type { Motorcycle } from '../data/motorcycles';
import type { FancyNumber } from '../data/fancyNumbers';

interface AdminPageProps {
  onNavigate: (page: 'home' | 'collection' | 'detail' | 'fancy-numbers' | 'admin', params?: { machineId?: string }) => void;
}

// Helper to compress uploaded images via HTML5 Canvas
const compressImageFile = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(img.src);
        }
      };
      img.onerror = (e) => reject(e);
    };
    reader.onerror = (e) => reject(e);
  });
};

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const {
    motorcycles,
    addMotorcycle,
    updateMotorcycle,
    deleteMotorcycle,
    resetMotorcycles,
    fancyNumbers,
    addFancyNumber,
    updateFancyNumber,
    deleteFancyNumber,
    resetFancyNumbers,
    logoutAdmin,
    adminPin,
    changeAdminPin,
    exportAllData,
    importAllData,
  } = useInventory();

  const [activeTab, setActiveTab] = useState<'bikes' | 'numbers' | 'settings'>('bikes');

  // Search & Filter in Admin
  const [bikeSearch, setBikeSearch] = useState('');
  const [numberSearch, setNumberSearch] = useState('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Bike Modal States
  const [bikeModalOpen, setBikeModalOpen] = useState(false);
  const [editingBikeId, setEditingBikeId] = useState<string | null>(null);
  const [bikeFormData, setBikeFormData] = useState<Partial<Motorcycle>>({
    brand: 'SUZUKI',
    brandOrigin: 'JAPAN',
    model: '',
    variant: '',
    category: 'SUPERBIKE',
    price: 520000,
    priceDisplay: '₹5,20,000',
    year: 2023,
    kilometres: 12000,
    kmDisplay: '12,000 KM',
    owners: 1,
    ownerDisplay: '1ST OWNER',
    location: 'DELHI NCR',
    city: 'NEW DELHI',
    engineCC: 1000,
    horsepower: 150,
    torque: 105,
    weight: 200,
    topSpeed: 299,
    zeroToHundred: 3.2,
    fuelType: 'PETROL',
    transmission: '6-SPEED MANUAL',
    registration: 'DL',
    condition: 'EXCELLENT',
    serviceHistory: 'FULL AUTHORIZED DEALER',
    inspectionStatus: '150+ POINT CERTIFIED',
    featured: true,
    newArrival: true,
    tagline: 'High-performance showroom acquisition.',
    description: 'Forensically verified, inspected across 150 checkpoints, full service history.',
    images: [],
    features: ['150+ Point Certified', 'Verified Ownership', 'Accident Free Guarantee'],
  });

  // Bike Image Upload handler
  const [imageInputUrl, setImageInputUrl] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fancy Number Modal States
  const [numberModalOpen, setNumberModalOpen] = useState(false);
  const [editingNumberId, setEditingNumberId] = useState<string | null>(null);
  const [numberFormData, setNumberFormData] = useState<Partial<FancyNumber>>({
    number: '0001',
    plateDisplay: 'DL 01 AA 0001',
    state: 'DELHI',
    stateCode: 'DL 01',
    category: 'SINGLE DIGIT',
    price: 1500000,
    priceDisplay: '₹15.00 L',
    status: 'AVAILABLE',
    featured: true,
    description: 'Ultra-exclusive VIP registration number ready for assignment.',
    suitableFor: 'Superbikes & Luxury Machines',
    transferStatus: 'Delhi RTO Clear Title · Immediate NOC Available',
  });

  // Settings State
  const [newPinInput, setNewPinInput] = useState('');
  const fileImportRef = useRef<HTMLInputElement>(null);

  // Filtered bikes
  const filteredBikes = motorcycles.filter((b) => {
    const q = bikeSearch.toLowerCase();
    return (
      b.brand.toLowerCase().includes(q) ||
      b.model.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      b.registration.toLowerCase().includes(q)
    );
  });

  // Filtered VIP numbers
  const filteredNumbers = fancyNumbers.filter((fn) => {
    const q = numberSearch.toLowerCase();
    return (
      fn.number.toLowerCase().includes(q) ||
      fn.plateDisplay.toLowerCase().includes(q) ||
      fn.state.toLowerCase().includes(q) ||
      fn.category.toLowerCase().includes(q)
    );
  });

  // Handle open Add/Edit Bike Modal
  const handleOpenAddBike = () => {
    setEditingBikeId(null);
    setBikeFormData({
      id: `bike-${Date.now()}`,
      brand: 'DUCATI',
      brandOrigin: 'ITALY',
      model: '',
      variant: 'Custom Spec Edition',
      category: 'SUPERBIKE',
      price: 520000,
      priceDisplay: '₹5,20,000',
      year: 2023,
      kilometres: 15000,
      kmDisplay: '15,000 KM',
      owners: 1,
      ownerDisplay: '1ST OWNER',
      location: 'DELHI NCR',
      city: 'NEW DELHI',
      engineCC: 821,
      horsepower: 112,
      torque: 89,
      weight: 205,
      topSpeed: 280,
      zeroToHundred: 3.5,
      fuelType: 'PETROL',
      transmission: '6-SPEED MANUAL',
      registration: 'DL',
      condition: 'EXCELLENT',
      serviceHistory: 'FULL AUTHORIZED DEALER',
      inspectionStatus: '150+ POINT CERTIFIED',
      featured: true,
      newArrival: true,
      tagline: 'Exceptional showroom condition, verified documentation.',
      description: 'Fully serviced, complete service record, 1st desmo done, new tires.',
      images: ['/images/ducati/IMG_0019.jpg'],
      specs: {
        engineType: 'Liquid-cooled Testastretta 11° Twin / V4',
        compressionRatio: '12.8:1',
        cooling: 'Liquid Cooled Dual Radiators',
        brakesFront: 'Dual 320mm Semi-Floating Brembo Monobloc',
        suspensionFront: '43mm Upside Down Telescopic Fork',
        tyresFront: '120/70 ZR17 High Performance Radial',
        tyresRear: '180/55 ZR17 High Performance Radial',
        fuelTank: '17.5 Litres',
        exhaust: 'Performance Sports System',
      },
      inspectionScore: {
        overall: 98,
        powertrain: 99,
        chassis: 98,
        electronics: 97,
        tyresBrakes: 98,
        cosmetics: 98,
        chassisNumberVerified: true,
        serviceLogbookVerified: true,
        dynoTested: true,
        accidentFreeGuarantee: true,
      },
      features: ['Full Service Record', 'Recently Serviced', 'Brand New Front Tire', '150+ Point Inspected'],
    });
    setImageInputUrl('');
    setBikeModalOpen(true);
  };

  const handleOpenEditBike = (bike: Motorcycle) => {
    setEditingBikeId(bike.id);
    setBikeFormData({ ...bike });
    setImageInputUrl('');
    setBikeModalOpen(true);
  };

  const handleSaveBike = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bikeFormData.brand || !bikeFormData.model) {
      alert('Please enter Brand and Model.');
      return;
    }

    const bikeId = editingBikeId || bikeFormData.id || `bike-${Date.now()}`;
    const cleanImages = (bikeFormData.images && bikeFormData.images.length > 0)
      ? bikeFormData.images
      : ['/images/hayabusa/IMG_0001.jpg'];

    const fullBike: Motorcycle = {
      id: bikeId,
      brand: bikeFormData.brand.toUpperCase(),
      brandOrigin: bikeFormData.brandOrigin || 'GLOBAL',
      model: bikeFormData.model.toUpperCase(),
      variant: bikeFormData.variant || 'Certified Edition',
      category: (bikeFormData.category as any) || 'SUPERBIKE',
      price: Number(bikeFormData.price) || 500000,
      priceDisplay: bikeFormData.priceDisplay || `₹${(Number(bikeFormData.price) || 500000).toLocaleString('en-IN')}`,
      year: Number(bikeFormData.year) || 2022,
      kilometres: Number(bikeFormData.kilometres) || 10000,
      kmDisplay: bikeFormData.kmDisplay || `${Number(bikeFormData.kilometres || 10000).toLocaleString('en-IN')} KM`,
      owners: Number(bikeFormData.owners) || 1,
      ownerDisplay: bikeFormData.ownerDisplay || `${bikeFormData.owners || 1}ST OWNER`,
      location: bikeFormData.location || 'DELHI NCR',
      city: bikeFormData.city || 'NEW DELHI',
      engineCC: Number(bikeFormData.engineCC) || 1000,
      horsepower: Number(bikeFormData.horsepower) || 100,
      torque: Number(bikeFormData.torque) || 90,
      weight: Number(bikeFormData.weight) || 210,
      topSpeed: Number(bikeFormData.topSpeed) || 280,
      zeroToHundred: Number(bikeFormData.zeroToHundred) || 3.5,
      fuelType: 'PETROL',
      transmission: '6-SPEED MANUAL',
      registration: bikeFormData.registration || 'DL',
      condition: bikeFormData.condition || 'EXCELLENT',
      serviceHistory: bikeFormData.serviceHistory || 'FULL AUTHORIZED DEALER',
      inspectionStatus: bikeFormData.inspectionStatus || '150+ POINT CERTIFIED',
      featured: bikeFormData.featured !== false,
      newArrival: bikeFormData.newArrival !== false,
      tagline: bikeFormData.tagline || 'Curated pre-owned performance motorcycle.',
      description: bikeFormData.description || 'Verified ownership and full dealer service history.',
      images: cleanImages,
      specs: bikeFormData.specs || {
        engineType: 'High-Output Performance Powertrain',
        compressionRatio: '12.5:1',
        cooling: 'Liquid Cooled',
        brakesFront: 'Dual Disc Performance Calipers',
        suspensionFront: 'Telescopic Upside Down Fork',
        tyresFront: '120/70 R17',
        tyresRear: '180/55 R17',
        fuelTank: '16.5 L',
        exhaust: 'Performance Sports Exhaust',
      },
      inspectionScore: bikeFormData.inspectionScore || {
        overall: 98,
        powertrain: 99,
        chassis: 98,
        electronics: 98,
        tyresBrakes: 98,
        cosmetics: 98,
        chassisNumberVerified: true,
        serviceLogbookVerified: true,
        dynoTested: true,
        accidentFreeGuarantee: true,
      },
      features: bikeFormData.features || ['150+ Point Inspected', 'Clean Title Record'],
    };

    if (editingBikeId) {
      updateMotorcycle(editingBikeId, fullBike);
      showToast(`Updated "${fullBike.brand} ${fullBike.model}"`);
    } else {
      addMotorcycle(fullBike);
      showToast(`Added "${fullBike.brand} ${fullBike.model}" to inventory!`);
    }

    setBikeModalOpen(false);
  };

  // Image Upload Trigger
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImage(true);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const compressedBase64 = await compressImageFile(files[i], 1200, 0.82);
        newUrls.push(compressedBase64);
      }
      setBikeFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls],
      }));
      showToast(`Processed & attached ${files.length} image(s)!`);
    } catch (err) {
      alert('Error compressing image. Try a smaller file.');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Image by URL
  const handleAddImageUrl = () => {
    if (!imageInputUrl.trim()) return;
    setBikeFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), imageInputUrl.trim()],
    }));
    setImageInputUrl('');
    showToast('Image URL added to gallery!');
  };

  // Remove single image from form
  const handleRemoveImage = (idx: number) => {
    setBikeFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== idx),
    }));
  };

  // Handle open Add/Edit Fancy Number
  const handleOpenAddNumber = () => {
    setEditingNumberId(null);
    setNumberFormData({
      id: `fn-${Date.now()}`,
      number: '0001',
      plateDisplay: 'DL 01 AA 0001',
      state: 'DELHI',
      stateCode: 'DL 01',
      category: 'SINGLE DIGIT',
      price: 1500000,
      priceDisplay: '₹15.00 L',
      status: 'AVAILABLE',
      featured: true,
      description: 'Exclusive VIP single-digit registration number.',
      suitableFor: 'Superbikes & Hypercars',
      transferStatus: 'Full RTO Clearance · Immediate Handover',
    });
    setNumberModalOpen(true);
  };

  const handleOpenEditNumber = (fn: FancyNumber) => {
    setEditingNumberId(fn.id);
    setNumberFormData({ ...fn });
    setNumberModalOpen(true);
  };

  const handleSaveNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numberFormData.number || !numberFormData.plateDisplay) {
      alert('Please fill out Number and Plate text.');
      return;
    }

    const id = editingNumberId || numberFormData.id || `fn-${Date.now()}`;
    const priceNum = Number(numberFormData.price) || 500000;
    const priceDisp = numberFormData.priceDisplay || `₹${(priceNum / 100000).toFixed(2)} L`;

    const fullNumber: FancyNumber = {
      id,
      number: numberFormData.number.trim(),
      plateDisplay: numberFormData.plateDisplay.toUpperCase().trim(),
      state: (numberFormData.state as any) || 'DELHI',
      stateCode: numberFormData.stateCode || 'DL 01',
      category: (numberFormData.category as any) || 'SINGLE DIGIT',
      price: priceNum,
      priceDisplay: priceDisp,
      status: (numberFormData.status as any) || 'AVAILABLE',
      featured: numberFormData.featured !== false,
      description: numberFormData.description || 'Exclusive VIP plate available for immediate transfer.',
      suitableFor: numberFormData.suitableFor || 'Superbikes & Luxury Vehicles',
      transferStatus: numberFormData.transferStatus || 'Pan-India RTO NOC Ready',
    };

    if (editingNumberId) {
      updateFancyNumber(editingNumberId, fullNumber);
      showToast(`Updated VIP Number ${fullNumber.number}`);
    } else {
      addFancyNumber(fullNumber);
      showToast(`Added VIP Number ${fullNumber.number} to catalog!`);
    }

    setNumberModalOpen(false);
  };

  // Export Backup File
  const handleDownloadBackup = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fancy_rides_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Vault backup file downloaded!');
  };

  // Import Backup File
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importAllData(content);
      if (res.success) {
        showToast(res.message);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
    if (fileImportRef.current) fileImportRef.current.value = '';
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080808',
        color: '#F5F5F2',
        paddingTop: '6rem',
        paddingBottom: '6rem',
        position: 'relative',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '5rem',
            right: '2rem',
            zIndex: 99999,
            background: 'rgba(20, 18, 16, 0.95)',
            border: '1px solid var(--accent-orange)',
            borderRadius: '12px',
            padding: '0.85rem 1.4rem',
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(255,90,31,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          <Sparkles size={16} color="var(--accent-orange)" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="container-wide">
        {/* Top Header Bar */}
        <div
          style={{
            background: 'linear-gradient(180deg, #121212 0%, #0D0D0D 100%)',
            border: '1px solid rgba(255, 90, 31, 0.35)',
            borderRadius: '20px',
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 90, 31, 0.08)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  background: 'rgba(255, 90, 31, 0.15)',
                  border: '1px solid rgba(255, 90, 31, 0.4)',
                  color: 'var(--accent-orange)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  padding: '3px 8px',
                  borderRadius: '6px',
                }}
              >
                RESTRICTED // DEALER CONSOLE
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#888884' }}>
                SESSION AUTHENTICATED
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                margin: 0,
                color: '#F5F5F2',
              }}
            >
              Showroom Inventory & VIP Numbers Manager
            </h1>
          </div>

          {/* Quick Header Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('home')}
              className="btn-secondary"
              style={{ padding: '9px 18px', fontSize: '0.78rem' }}
            >
              <Eye size={14} style={{ marginRight: '6px' }} />
              VIEW LIVE SHOWROOM
            </button>

            <button
              onClick={handleDownloadBackup}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '999px',
                color: '#F5F5F2',
                padding: '9px 18px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
              title="Download full JSON backup of inventory and VIP numbers"
            >
              <Download size={14} />
              BACKUP DATA
            </button>

            <button
              onClick={() => {
                logoutAdmin();
                onNavigate('home');
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '999px',
                color: '#EF4444',
                padding: '9px 18px',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
              }}
            >
              <Lock size={14} />
              LOCK CONSOLE
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: '#121212',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9B9B9B', display: 'block' }}>
              TOTAL SHOWROOM BIKES
            </span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: '#F5F5F2' }}>
              {motorcycles.length}
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--accent-orange)' }}>
              Active in live catalog
            </span>
          </div>

          <div
            style={{
              background: '#121212',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9B9B9B', display: 'block' }}>
              VIP FANCY NUMBERS
            </span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: '#F5F5F2' }}>
              {fancyNumbers.length}
            </div>
            <span style={{ fontSize: '0.76rem', color: '#10B981' }}>
              {fancyNumbers.filter((n) => n.status === 'AVAILABLE').length} Available for booking
            </span>
          </div>

          <div
            style={{
              background: '#121212',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9B9B9B', display: 'block' }}>
              SHOWROOM ESTIMATED VALUATION
            </span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 900, color: '#F5F5F2' }}>
              ₹{(motorcycles.reduce((acc, b) => acc + (b.price || 0), 0) / 100000).toFixed(1)} L
            </div>
            <span style={{ fontSize: '0.76rem', color: '#9B9B9B' }}>
              Combined inventory value
            </span>
          </div>

          <div
            style={{
              background: '#121212',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#9B9B9B', display: 'block' }}>
              ACTIVE MASTER PASSCODE
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-orange)' }}>
              {adminPin}
            </div>
            <span style={{ fontSize: '0.76rem', color: '#9B9B9B' }}>
              Client Secret PIN
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '2rem',
            paddingBottom: '0.75rem',
          }}
        >
          <button
            onClick={() => setActiveTab('bikes')}
            style={{
              background: activeTab === 'bikes' ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '10px',
              color: activeTab === 'bikes' ? '#000000' : '#E0E0DC',
              padding: '10px 22px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.86rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <Sliders size={15} />
            MOTORCYCLE INVENTORY ({motorcycles.length})
          </button>

          <button
            onClick={() => setActiveTab('numbers')}
            style={{
              background: activeTab === 'numbers' ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '10px',
              color: activeTab === 'numbers' ? '#000000' : '#E0E0DC',
              padding: '10px 22px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.86rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <Hash size={15} />
            VIP FANCY NUMBERS ({fancyNumbers.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            style={{
              background: activeTab === 'settings' ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '10px',
              color: activeTab === 'settings' ? '#000000' : '#E0E0DC',
              padding: '10px 22px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.86rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
            }}
          >
            <Key size={15} />
            VAULT BACKUP & PIN
          </button>
        </div>

        {/* ==================================================
            TAB 1: MOTORCYCLES INVENTORY
           ================================================== */}
        {activeTab === 'bikes' && (
          <div>
            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Search Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: '#121212',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  minWidth: '280px',
                }}
              >
                <Search size={16} color="#888884" />
                <input
                  type="text"
                  placeholder="Search bike, model, category..."
                  value={bikeSearch}
                  onChange={(e) => setBikeSearch(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F5F5F2',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: '100%',
                  }}
                />
              </div>

              {/* Add Bike Button */}
              <button
                onClick={handleOpenAddBike}
                className="btn-special-cta"
                style={{ padding: '12px 24px', fontSize: '0.84rem' }}
              >
                <span>+ ADD NEW MOTORCYCLE</span>
                <span className="cta-icon-bubble">
                  <Plus size={16} strokeWidth={3} />
                </span>
              </button>
            </div>

            {/* Bikes Table / List */}
            <div
              style={{
                background: '#101010',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 120px 140px',
                  padding: '1rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: '#9B9B9B',
                  letterSpacing: '0.08em',
                }}
                className="hide-on-mobile"
              >
                <span>PHOTO</span>
                <span>MOTORCYCLE</span>
                <span>CATEGORY</span>
                <span>PRICE</span>
                <span>METRICS</span>
                <span>FEATURED</span>
                <span style={{ textAlign: 'right' }}>ACTIONS</span>
              </div>

              {filteredBikes.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#9B9B9B' }}>
                  No motorcycles match your search query.
                </div>
              ) : (
                filteredBikes.map((bike) => (
                  <div
                    key={bike.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 120px 140px',
                      alignItems: 'center',
                      padding: '1rem 1.5rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: '64px',
                        height: '48px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#1A1A1A',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <img
                        src={bike.images?.[0] || '/images/hayabusa/IMG_0001.jpg'}
                        alt={bike.model}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Motorcycle Info */}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#F5F5F2', letterSpacing: '-0.01em' }}>
                        {bike.brand} {bike.model}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#9B9B9B', fontFamily: 'var(--font-mono)' }}>
                        {bike.year} · {bike.variant}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--accent-orange)',
                        }}
                      >
                        {bike.category}
                      </span>
                    </div>

                    {/* Price */}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F5F5F2' }}>
                        {bike.priceDisplay}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#888884', fontFamily: 'var(--font-mono)' }}>
                        ₹{Number(bike.price).toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div style={{ fontSize: '0.78rem', color: '#D4D4CE', fontFamily: 'var(--font-mono)' }}>
                      <div>{bike.kmDisplay}</div>
                      <div style={{ color: '#888884' }}>{bike.ownerDisplay} · {bike.registration}</div>
                    </div>

                    {/* Featured Toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          updateMotorcycle(bike.id, { featured: !bike.featured });
                          showToast(`${bike.model} featured status: ${!bike.featured ? 'ACTIVE' : 'OFF'}`);
                        }}
                        style={{
                          background: bike.featured ? 'rgba(255, 90, 31, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${bike.featured ? 'var(--accent-orange)' : 'rgba(255, 255, 255, 0.1)'}`,
                          borderRadius: '20px',
                          padding: '4px 10px',
                          color: bike.featured ? 'var(--accent-orange)' : '#888884',
                          fontSize: '0.7rem',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Star size={12} fill={bike.featured ? 'var(--accent-orange)' : 'none'} />
                        {bike.featured ? 'FEATURED' : 'NORMAL'}
                      </button>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        onClick={() => onNavigate('detail', { machineId: bike.id })}
                        title="View Public Detail Page"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: '#F5F5F2',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <ExternalLink size={14} />
                      </button>

                      <button
                        onClick={() => handleOpenEditBike(bike)}
                        title="Edit Motorcycle"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          color: 'var(--accent-orange)',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${bike.brand} ${bike.model} from inventory?`)) {
                            deleteMotorcycle(bike.id);
                            showToast(`Deleted ${bike.brand} ${bike.model}`);
                          }
                        }}
                        title="Delete from Inventory"
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          borderRadius: '8px',
                          color: '#EF4444',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 2: VIP FANCY NUMBERS
           ================================================== */}
        {activeTab === 'numbers' && (
          <div>
            {/* Action Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Search Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: '#121212',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  minWidth: '280px',
                }}
              >
                <Search size={16} color="#888884" />
                <input
                  type="text"
                  placeholder="Search number (0001, 8055, DL, HR)..."
                  value={numberSearch}
                  onChange={(e) => setNumberSearch(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#F5F5F2',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: '100%',
                  }}
                />
              </div>

              {/* Add Number Button */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => onNavigate('fancy-numbers')}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.8rem' }}
                >
                  <Eye size={14} style={{ marginRight: '6px' }} />
                  VIEW PUBLIC VIP NUMBERS PAGE
                </button>

                <button
                  onClick={handleOpenAddNumber}
                  className="btn-special-cta"
                  style={{ padding: '12px 24px', fontSize: '0.84rem' }}
                >
                  <span>+ ADD NEW VIP NUMBER</span>
                  <span className="cta-icon-bubble">
                    <Plus size={16} strokeWidth={3} />
                  </span>
                </button>
              </div>
            </div>

            {/* Fancy Numbers Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {filteredNumbers.map((fn) => (
                <div
                  key={fn.id}
                  style={{
                    background: '#111111',
                    border: `1px solid ${fn.status === 'AVAILABLE' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'}`,
                    borderRadius: '18px',
                    padding: '1.5rem',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Top status & category */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 90, 31, 0.1)',
                          border: '1px solid rgba(255, 90, 31, 0.3)',
                          color: 'var(--accent-orange)',
                          fontWeight: 700,
                        }}
                      >
                        {fn.category}
                      </span>

                      {/* Status Toggle Button */}
                      <button
                        onClick={() => {
                          const nextStatus = fn.status === 'AVAILABLE' ? 'RESERVED' : fn.status === 'RESERVED' ? 'SOLD' : 'AVAILABLE';
                          updateFancyNumber(fn.id, { status: nextStatus });
                          showToast(`Plate ${fn.plateDisplay} marked as ${nextStatus}`);
                        }}
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          border: 'none',
                          cursor: 'pointer',
                          background:
                            fn.status === 'AVAILABLE'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : fn.status === 'RESERVED'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          color:
                            fn.status === 'AVAILABLE'
                              ? '#10B981'
                              : fn.status === 'RESERVED'
                              ? '#F59E0B'
                              : '#EF4444',
                        }}
                      >
                        ● {fn.status}
                      </button>
                    </div>

                    {/* Realistic Indian Number Plate Display */}
                    <div
                      style={{
                        background: '#ECECE8',
                        color: '#0A0A0A',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        border: '2px solid #222222',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '1rem',
                        position: 'relative',
                      }}
                    >
                      {/* Left IND Blue Band */}
                      <div
                        style={{
                          background: '#0B3B95',
                          borderRadius: '6px',
                          padding: '4px 6px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
                        <span style={{ color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 900, fontFamily: 'sans-serif' }}>
                          IND
                        </span>
                      </div>

                      {/* Plate Text */}
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.55rem',
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                          color: '#0D0D0D',
                          textAlign: 'center',
                          flex: 1,
                        }}
                      >
                        {fn.plateDisplay}
                      </div>
                    </div>

                    {/* Price and Details */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F5F5F2' }}>
                        {fn.priceDisplay}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: '#888884' }}>
                        {fn.stateCode} · {fn.state}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: '#9B9B9B', margin: '0 0 1rem', lineHeight: 1.4 }}>
                      {fn.description}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '0.85rem',
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '0.65rem',
                    }}
                  >
                    <button
                      onClick={() => handleOpenEditNumber(fn)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        color: 'var(--accent-orange)',
                        padding: '6px 12px',
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Edit3 size={13} />
                      EDIT
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete VIP number ${fn.number} (${fn.plateDisplay})?`)) {
                          deleteFancyNumber(fn.id);
                          showToast(`Deleted ${fn.plateDisplay}`);
                        }
                      }}
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '8px',
                        color: '#EF4444',
                        padding: '6px 12px',
                        fontSize: '0.74rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Trash2 size={13} />
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================
            TAB 3: DATA & SETTINGS
           ================================================== */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '800px' }}>
            {/* Passcode Security Card */}
            <div
              style={{
                background: '#121212',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '18px',
                padding: '2rem',
                marginBottom: '2rem',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  margin: '0 0 0.5rem',
                  color: '#F5F5F2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Key size={18} color="var(--accent-orange)" />
                Dealer Access Passcode
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#9B9B9B', marginBottom: '1.25rem' }}>
                Your current master passcode is{' '}
                <strong style={{ color: 'var(--accent-orange)', fontFamily: 'var(--font-mono)' }}>{adminPin}</strong>.
                You can change it to any 4-8 digit number of your choice.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Enter new PIN (e.g. 1234)"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  style={{
                    background: '#080808',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    color: '#F5F5F2',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1rem',
                    width: '240px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newPinInput.length >= 4) {
                      changeAdminPin(newPinInput);
                      setNewPinInput('');
                      showToast(`Dealer Passcode updated to: ${newPinInput}`);
                    } else {
                      alert('Please enter at least 4 digits for the passcode.');
                    }
                  }}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.82rem' }}
                >
                  SAVE NEW PIN
                </button>
              </div>
            </div>

            {/* Backup & Restore Card */}
            <div
              style={{
                background: '#121212',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '18px',
                padding: '2rem',
                marginBottom: '2rem',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  margin: '0 0 0.5rem',
                  color: '#F5F5F2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Download size={18} color="var(--accent-orange)" />
                Backup & Restore Showroom Vault
              </h3>
              <p style={{ fontSize: '0.84rem', color: '#9B9B9B', marginBottom: '1.25rem' }}>
                Export all your added motorcycles and VIP fancy numbers into a single JSON file. You can restore it at any time.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleDownloadBackup}
                  className="btn-secondary"
                  style={{ padding: '12px 22px', fontSize: '0.82rem' }}
                >
                  <Download size={15} style={{ marginRight: '6px' }} />
                  DOWNLOAD JSON BACKUP
                </button>

                <label
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: '999px',
                    color: '#F5F5F2',
                    padding: '12px 22px',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Upload size={15} />
                  RESTORE BACKUP FILE
                  <input
                    ref={fileImportRef}
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            </div>

            {/* Factory Reset Card */}
            <div
              style={{
                background: '#121212',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '18px',
                padding: '2rem',
                marginBottom: '2rem',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  margin: '0 0 0.5rem',
                  color: '#EF4444',
                }}
              >
                Factory Data Defaults
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#888884', marginBottom: '1.25rem' }}>
                Reset live motorcycles or VIP fancy numbers back to the default original catalog. Any custom modifications will be cleared from local storage.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to restore original motorcycles? Any newly created bikes will be removed.')) {
                      resetMotorcycles();
                      showToast('Motorcycles reset to factory catalog defaults');
                    }
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '999px',
                    color: '#EF4444',
                    padding: '10px 20px',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <RotateCcw size={14} />
                  RESET MOTORCYCLES
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to restore original VIP numbers? Any newly created plates will be removed.')) {
                      resetFancyNumbers();
                      showToast('VIP Fancy Numbers reset to factory defaults');
                    }
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: '999px',
                    color: '#EF4444',
                    padding: '10px 20px',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <RotateCcw size={14} />
                  RESET VIP NUMBERS
                </button>
              </div>
            </div>

            {/* Secret Access Instructions Card */}
            <div
              style={{
                background: 'linear-gradient(165deg, rgba(255, 90, 31, 0.08) 0%, #121212 100%)',
                border: '1px solid rgba(255, 90, 31, 0.3)',
                borderRadius: '18px',
                padding: '2rem',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  margin: '0 0 0.5rem',
                  color: 'var(--accent-orange)',
                }}
              >
                How to Re-Enter This Hidden Admin Console
              </h3>
              <ul style={{ fontSize: '0.84rem', color: '#D4D4CE', lineHeight: 1.8, paddingLeft: '1.25rem' }}>
                <li>
                  <strong>URL Shortcut:</strong> Add <code style={{ color: 'var(--accent-orange)' }}>#admin</code> to your website address (e.g. <code>fancyrides.in/#admin</code>).
                </li>
                <li>
                  <strong>Quick Keyboard:</strong> Simply type <code style={{ color: 'var(--accent-orange)' }}>admin</code> anywhere on the site, or press <code style={{ color: 'var(--accent-orange)' }}>Ctrl + Shift + A</code>.
                </li>
                <li>
                  <strong>Menu Option:</strong> Open the top-right menu drawer and click <code style={{ color: 'var(--accent-orange)' }}>CLIENT PORTAL</code>.
                </li>
                <li>
                  <strong>Footer Link:</strong> Click <code style={{ color: 'var(--accent-orange)' }}>DEALER CONSOLE</code> in the footer.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ==================================================
          ADD / EDIT MOTORCYCLE MODAL STUDIO
         ================================================== */}
      {bikeModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setBikeModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '850px',
              maxHeight: '90vh',
              background: '#121212',
              border: '1px solid rgba(255, 90, 31, 0.4)',
              borderRadius: '24px',
              overflowY: 'auto',
              boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.75rem 2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                background: '#121212',
                zIndex: 10,
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--accent-orange)',
                    fontWeight: 700,
                  }}
                >
                  SHOWROOM INVENTORY // {editingBikeId ? 'EDIT MACHINE' : 'ADD NEW MACHINE'}
                </span>
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.45rem',
                    fontWeight: 900,
                    margin: 0,
                    color: '#F5F5F2',
                  }}
                >
                  {editingBikeId ? `Edit ${bikeFormData.brand} ${bikeFormData.model}` : 'Add Motorcycle to Live Catalog'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setBikeModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: '#A0A09C',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSaveBike} style={{ padding: '2rem' }}>
              {/* Row 1: Brand & Model */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    BRAND *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DUCATI, HARLEY-DAVIDSON, SUZUKI"
                    value={bikeFormData.brand || ''}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, brand: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    MODEL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MONSTER 821, HAYABUSA, FAT BOB"
                    value={bikeFormData.model || ''}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, model: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    YEAR *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="2023"
                    value={bikeFormData.year || 2023}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, year: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Category, Variant & Registration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    CATEGORY
                  </label>
                  <select
                    value={bikeFormData.category || 'SUPERBIKE'}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, category: e.target.value as any })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    <option value="SUPERBIKE">SUPERBIKE</option>
                    <option value="CRUISER">CRUISER</option>
                    <option value="ROADSTER">ROADSTER</option>
                    <option value="ADVENTURE">ADVENTURE</option>
                    <option value="CLASSIC">CLASSIC</option>
                    <option value="TOURING">TOURING</option>
                    <option value="SPORT">SPORT</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    VARIANT / SUBTITLE
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Testastretta 11° · Vance & Hines"
                    value={bikeFormData.variant || ''}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, variant: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    REGISTRATION
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DL, HR 26, PB"
                    value={bikeFormData.registration || ''}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, registration: e.target.value.toUpperCase() })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>
              </div>

              {/* Row 3: Price, Kilometres, Owners */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    PRICE (₹ NUMBER)
                  </label>
                  <input
                    type="number"
                    placeholder="520000"
                    value={bikeFormData.price || ''}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      const display = num ? `₹${num.toLocaleString('en-IN')}` : '';
                      setBikeFormData({ ...bikeFormData, price: num, priceDisplay: display });
                    }}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    PRICE DISPLAY TEXT
                  </label>
                  <input
                    type="text"
                    placeholder="₹5,20,000"
                    value={bikeFormData.priceDisplay || ''}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, priceDisplay: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--accent-orange)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    KM DRIVEN
                  </label>
                  <input
                    type="number"
                    placeholder="24000"
                    value={bikeFormData.kilometres || ''}
                    onChange={(e) => {
                      const km = Number(e.target.value);
                      setBikeFormData({ ...bikeFormData, kilometres: km, kmDisplay: `${km.toLocaleString('en-IN')} KM` });
                    }}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    OWNERS
                  </label>
                  <select
                    value={bikeFormData.owners || 1}
                    onChange={(e) => {
                      const o = Number(e.target.value);
                      setBikeFormData({ ...bikeFormData, owners: o, ownerDisplay: `${o}ST OWNER` });
                    }}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                    }}
                  >
                    <option value={1}>1st Owner</option>
                    <option value={2}>2nd Owner</option>
                    <option value={3}>3rd Owner</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Power, CC, Weight, Top Speed */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    POWER (HP)
                  </label>
                  <input
                    type="number"
                    placeholder="112"
                    value={bikeFormData.horsepower || ''}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, horsepower: Number(e.target.value) })}
                    style={{ width: '100%', background: '#090909', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '10px', padding: '10px 14px', color: '#F5F5F2', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    DISPLACEMENT (CC)
                  </label>
                  <input
                    type="number"
                    placeholder="821"
                    value={bikeFormData.engineCC || ''}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, engineCC: Number(e.target.value) })}
                    style={{ width: '100%', background: '#090909', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '10px', padding: '10px 14px', color: '#F5F5F2', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    WEIGHT (KG)
                  </label>
                  <input
                    type="number"
                    placeholder="205"
                    value={bikeFormData.weight || ''}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, weight: Number(e.target.value) })}
                    style={{ width: '100%', background: '#090909', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '10px', padding: '10px 14px', color: '#F5F5F2', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    TOP SPEED (KM/H)
                  </label>
                  <input
                    type="number"
                    placeholder="280"
                    value={bikeFormData.topSpeed || ''}
                    onChange={(e) => setBikeFormData({ ...bikeFormData, topSpeed: Number(e.target.value) })}
                    style={{ width: '100%', background: '#090909', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '10px', padding: '10px 14px', color: '#F5F5F2', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              {/* Description & Key Highlights */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                  KEY SHOWROOM HIGHLIGHTS / NOTES
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Brand New Front Tire · Recently Serviced · 1st Desmo Done · Full Service Record · 300km/hr Top Speed"
                  value={bikeFormData.description || ''}
                  onChange={(e) => setBikeFormData({ ...bikeFormData, description: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#090909',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#F5F5F2',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              {/* Image Studio Section */}
              <div
                style={{
                  background: '#0A0A0A',
                  border: '1px solid rgba(255, 90, 31, 0.25)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-orange)', fontWeight: 700 }}>
                      MACHINE PHOTO GALLERY
                    </span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#888884' }}>
                      Upload images from your phone/computer (auto-optimized) or paste image URLs.
                    </p>
                  </div>

                  {/* Upload from Device Button */}
                  <label
                    style={{
                      background: 'rgba(255, 90, 31, 0.15)',
                      border: '1px solid rgba(255, 90, 31, 0.4)',
                      borderRadius: '999px',
                      color: 'var(--accent-orange)',
                      padding: '8px 18px',
                      fontSize: '0.76rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Upload size={14} />
                    {isProcessingImage ? 'OPTIMIZING...' : 'UPLOAD PHOTOS FROM DEVICE'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      disabled={isProcessingImage}
                    />
                  </label>
                </div>

                {/* Paste URL input */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Or paste image URL (e.g. /images/ducati/IMG_0019.jpg or https://...)"
                    value={imageInputUrl}
                    onChange={(e) => setImageInputUrl(e.target.value)}
                    style={{
                      flex: 1,
                      background: '#141414',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#F5F5F2',
                      fontSize: '0.82rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      fontSize: '0.76rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    + ADD URL
                  </button>
                </div>

                {/* Current Image Thumbnails */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  {(bikeFormData.images || []).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        width: '90px',
                        height: '70px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: idx === 0 ? '2px solid var(--accent-orange)' : '1px solid rgba(255, 255, 255, 0.15)',
                      }}
                    >
                      <img src={imgUrl} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {idx === 0 && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.75)',
                            color: 'var(--accent-orange)',
                            fontSize: '0.62rem',
                            fontFamily: 'var(--font-mono)',
                            textAlign: 'center',
                          }}
                        >
                          HERO
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          background: 'rgba(0,0,0,0.8)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          color: '#EF4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setBikeModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '12px 24px', fontSize: '0.84rem' }}
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="btn-special-cta"
                  style={{ padding: '12px 28px', fontSize: '0.84rem' }}
                >
                  <span>{editingBikeId ? 'SAVE MOTORCYCLE CHANGES' : 'PUBLISH MOTORCYCLE TO CATALOG'}</span>
                  <span className="cta-icon-bubble">
                    <Check size={16} strokeWidth={3} />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================
          ADD / EDIT VIP FANCY NUMBER MODAL
         ================================================== */}
      {numberModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setNumberModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '650px',
              maxHeight: '90vh',
              background: '#121212',
              border: '1px solid rgba(255, 90, 31, 0.4)',
              borderRadius: '24px',
              overflowY: 'auto',
              boxShadow: '0 30px 80px rgba(0,0,0,0.95)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '1.75rem 2rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-orange)', fontWeight: 700 }}>
                  VIP REGISTRATION // {editingNumberId ? 'EDIT NUMBER' : 'ADD NEW NUMBER'}
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 900, margin: 0, color: '#F5F5F2' }}>
                  {editingNumberId ? `Edit VIP Plate ${numberFormData.plateDisplay}` : 'Add Fancy VIP Number'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setNumberModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: '#A0A09C',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveNumber} style={{ padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    FANCY NUMBER (DIGITS ONLY) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 0001, 0007, 9999, 8055"
                    value={numberFormData.number || ''}
                    onChange={(e) => setNumberFormData({ ...numberFormData, number: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--accent-orange)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    FULL PLATE TEXT (WITH SERIES) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL 01 AA 0001 or HR 26 DQ 0007"
                    value={numberFormData.plateDisplay || ''}
                    onChange={(e) => setNumberFormData({ ...numberFormData, plateDisplay: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 800,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    STATE / RTO
                  </label>
                  <select
                    value={numberFormData.state || 'DELHI'}
                    onChange={(e) => {
                      const st = e.target.value;
                      const code = st === 'DELHI' ? 'DL 01' : st === 'HARYANA' ? 'HR 26' : st === 'PUNJAB' ? 'PB 65' : st === 'CHANDIGARH' ? 'CH 01' : 'UP 16';
                      setNumberFormData({ ...numberFormData, state: st as any, stateCode: code });
                    }}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                    }}
                  >
                    <option value="DELHI">DELHI (DL)</option>
                    <option value="HARYANA">HARYANA (HR)</option>
                    <option value="PUNJAB">PUNJAB (PB)</option>
                    <option value="CHANDIGARH">CHANDIGARH (CH)</option>
                    <option value="UP">UTTAR PRADESH (UP)</option>
                    <option value="MAHARASHTRA">MAHARASHTRA (MH)</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    CATEGORY
                  </label>
                  <select
                    value={numberFormData.category || 'SINGLE DIGIT'}
                    onChange={(e) => setNumberFormData({ ...numberFormData, category: e.target.value as any })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                    }}
                  >
                    <option value="SINGLE DIGIT">SINGLE DIGIT (0001 - 0009)</option>
                    <option value="QUAD / REPEATING">QUAD / REPEATING (9999, 1111...)</option>
                    <option value="ICONIC / BOSS">ICONIC / BOSS (8055...)</option>
                    <option value="ROYAL HERITAGE">ROYAL HERITAGE (0786, 1313...)</option>
                    <option value="MIRROR & RADAR">MIRROR & RADAR (0055, 2121...)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    STATUS
                  </label>
                  <select
                    value={numberFormData.status || 'AVAILABLE'}
                    onChange={(e) => setNumberFormData({ ...numberFormData, status: e.target.value as any })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                    }}
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="RESERVED">RESERVED</option>
                    <option value="SOLD">SOLD</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    PRICE IN ₹
                  </label>
                  <input
                    type="number"
                    placeholder="1500000"
                    value={numberFormData.price || ''}
                    onChange={(e) => {
                      const p = Number(e.target.value);
                      const disp = p >= 100000 ? `₹${(p / 100000).toFixed(2)} L` : `₹${p.toLocaleString('en-IN')}`;
                      setNumberFormData({ ...numberFormData, price: p, priceDisplay: disp });
                    }}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: '#F5F5F2',
                      fontFamily: 'var(--font-mono)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                    PRICE DISPLAY TEXT
                  </label>
                  <input
                    type="text"
                    placeholder="₹15.00 L"
                    value={numberFormData.priceDisplay || ''}
                    onChange={(e) => setNumberFormData({ ...numberFormData, priceDisplay: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#090909',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      color: 'var(--accent-orange)',
                      fontWeight: 800,
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#9B9B9B', marginBottom: '6px' }}>
                  DESCRIPTION & NOTE
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ultra high-demand DL plate. First owner NOC ready for pan-India assignment."
                  value={numberFormData.description || ''}
                  onChange={(e) => setNumberFormData({ ...numberFormData, description: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#090909',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    color: '#F5F5F2',
                  }}
                />
              </div>

              {/* Submit */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setNumberModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '12px 24px', fontSize: '0.84rem' }}
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="btn-special-cta"
                  style={{ padding: '12px 28px', fontSize: '0.84rem' }}
                >
                  <span>{editingNumberId ? 'SAVE VIP NUMBER' : 'PUBLISH VIP NUMBER'}</span>
                  <span className="cta-icon-bubble">
                    <Check size={16} strokeWidth={3} />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
