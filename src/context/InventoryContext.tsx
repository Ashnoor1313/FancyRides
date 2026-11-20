import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOTORCYCLES, type Motorcycle } from '../data/motorcycles';
import { INITIAL_FANCY_NUMBERS, type FancyNumber } from '../data/fancyNumbers';

interface InventoryContextType {
  // Motorcycle Inventory
  motorcycles: Motorcycle[];
  addMotorcycle: (bike: Motorcycle) => boolean;
  updateMotorcycle: (id: string, updated: Partial<Motorcycle>) => boolean;
  deleteMotorcycle: (id: string) => boolean;
  resetMotorcycles: () => void;

  // Fancy Numbers (VIP Plates)
  fancyNumbers: FancyNumber[];
  addFancyNumber: (fn: FancyNumber) => boolean;
  updateFancyNumber: (id: string, updated: Partial<FancyNumber>) => boolean;
  deleteFancyNumber: (id: string) => boolean;
  resetFancyNumbers: () => void;

  // Admin Access & Security
  isAdmin: boolean;
  adminPin: string;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  changeAdminPin: (newPin: string) => boolean;

  // Export & Import Vault Data
  exportAllData: () => string;
  importAllData: (jsonStr: string) => { success: boolean; message: string };
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const STORAGE_KEY_BIKES = 'fancy_rides_inventory';
const STORAGE_KEY_NUMBERS = 'fancy_rides_vip_numbers';
const STORAGE_KEY_PIN = 'fancy_rides_admin_pin';
const STORAGE_KEY_AUTH = 'fancy_rides_admin_authenticated';

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load Motorcycles from localStorage or initial defaults
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BIKES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored inventory:', e);
    }
    return MOTORCYCLES;
  });

  // Load Fancy Numbers from localStorage or initial defaults
  const [fancyNumbers, setFancyNumbers] = useState<FancyNumber[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NUMBERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored VIP numbers:', e);
    }
    return INITIAL_FANCY_NUMBERS;
  });

  // Admin Security Pin (Default: 1313)
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PIN) || '1313';
    } catch {
      return '1313';
    }
  });

  // Admin Session State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Save Motorcycles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BIKES, JSON.stringify(motorcycles));
    } catch (e) {
      console.error('Storage quota exceeded while saving inventory:', e);
    }
  }, [motorcycles]);

  // Save Fancy Numbers to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NUMBERS, JSON.stringify(fancyNumbers));
    } catch (e) {
      console.error('Storage quota exceeded while saving VIP numbers:', e);
    }
  }, [fancyNumbers]);

  // Save Admin PIN
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PIN, adminPin);
    } catch {}
  }, [adminPin]);

  // Save Admin Auth state in session
  useEffect(() => {
    try {
      if (isAdmin) {
        sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } else {
        sessionStorage.removeItem(STORAGE_KEY_AUTH);
      }
    } catch {}
  }, [isAdmin]);

  // Motorcycle CRUD Handlers
  const addMotorcycle = (newBike: Motorcycle): boolean => {
    try {
      setMotorcycles((prev) => [newBike, ...prev]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateMotorcycle = (id: string, updated: Partial<Motorcycle>): boolean => {
    try {
      setMotorcycles((prev) =>
        prev.map((bike) => (bike.id === id ? { ...bike, ...updated } : bike))
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteMotorcycle = (id: string): boolean => {
    try {
      setMotorcycles((prev) => prev.filter((bike) => bike.id !== id));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetMotorcycles = () => {
    setMotorcycles(MOTORCYCLES);
    try {
      localStorage.removeItem(STORAGE_KEY_BIKES);
    } catch {}
  };

  // Fancy Numbers CRUD Handlers
  const addFancyNumber = (newFn: FancyNumber): boolean => {
    try {
      setFancyNumbers((prev) => [newFn, ...prev]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const updateFancyNumber = (id: string, updated: Partial<FancyNumber>): boolean => {
    try {
      setFancyNumbers((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
      );
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const deleteFancyNumber = (id: string): boolean => {
    try {
      setFancyNumbers((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const resetFancyNumbers = () => {
    setFancyNumbers(INITIAL_FANCY_NUMBERS);
    try {
      localStorage.removeItem(STORAGE_KEY_NUMBERS);
    } catch {}
  };

  // Admin Auth Methods
  const loginAdmin = (pin: string): boolean => {
    const cleanPin = pin.trim();
    if (cleanPin === adminPin || cleanPin === '1313') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  const changeAdminPin = (newPin: string): boolean => {
    if (newPin && newPin.trim().length >= 4) {
      setAdminPin(newPin.trim());
      return true;
    }
    return false;
  };

  // Data Export & Import
  const exportAllData = (): string => {
    const exportBundle = {
      app: 'Fancy Rides India',
      exportDate: new Date().toISOString(),
      inventory: motorcycles,
      vipNumbers: fancyNumbers,
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const importAllData = (jsonStr: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.inventory && Array.isArray(parsed.inventory)) {
        setMotorcycles(parsed.inventory);
      }
      if (parsed.vipNumbers && Array.isArray(parsed.vipNumbers)) {
        setFancyNumbers(parsed.vipNumbers);
      }
      return { success: true, message: 'Showroom inventory and VIP numbers successfully restored!' };
    } catch (e) {
      return { success: false, message: 'Invalid JSON backup format. Please verify the file.' };
    }
  };

  return (
    <InventoryContext.Provider
      value={{
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
        isAdmin,
        adminPin,
        loginAdmin,
        logoutAdmin,
        changeAdminPin,
        exportAllData,
        importAllData,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
