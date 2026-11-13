export interface Motorcycle {
  id: string;
  brand: string;
  brandOrigin: string;
  model: string;
  variant: string;
  category: 'SUPERBIKE' | 'ADVENTURE' | 'ROADSTER' | 'CRUISER' | 'TOURING' | 'SPORT' | 'CLASSIC' | 'NAKED';
  price: number;
  priceDisplay: string;
  year: number;
  kilometres: number;
  kmDisplay: string;
  owners: number;
  ownerDisplay: string;
  location: string;
  city: string;
  engineCC: number;
  horsepower: number;
  torque: number;
  weight: number;
  topSpeed: number;
  zeroToHundred: number;
  fuelType: string;
  transmission: string;
  registration: string;
  condition: 'MINT / CONCOURS' | 'EXCELLENT' | 'PRISTINE';
  serviceHistory: 'FULL AUTHORIZED DEALER' | 'CERTIFIED PERFORMANCE SPECIALIST';
  inspectionStatus: '150+ POINT CERTIFIED' | 'VIP VERIFIED';
  featured: boolean;
  newArrival: boolean;
  tagline: string;
  description: string;
  images: string[];
  specs: {
    engineType: string;
    compressionRatio: string;
    cooling: string;
    brakesFront: string;
    suspensionFront: string;
    tyresFront: string;
    tyresRear: string;
    fuelTank: string;
    exhaust: string;
  };
  inspectionScore: {
    overall: number;
    powertrain: number;
    chassis: number;
    electronics: number;
    tyresBrakes: number;
    cosmetics: number;
    chassisNumberVerified: boolean;
    serviceLogbookVerified: boolean;
    dynoTested: boolean;
    accidentFreeGuarantee: boolean;
  };
  features: string[];
}

export const MOTORCYCLE_CATEGORIES = [
  {
    id: '01',
    name: 'CRUISER',
    tagline: 'Raw American torque & timeless bobber attitude.',
    count: 2,
    image: '/images/hd48/IMG_0035.jpg',
  },
  {
    id: '02',
    name: 'CLASSIC',
    tagline: 'Some machines never age.',
    count: 1,
    image: '/images/IMG_0211.JPG',
  },
  {
    id: '03',
    name: 'SUPERBIKE',
    tagline: 'The ultimate hyperbike — speed, aerodynamics & adrenaline.',
    count: 1,
    image: '/images/hayabusa/IMG_0001.jpg',
  },
];

export const MOTORCYCLES: Motorcycle[] = [
  {
    id: 'harley-davidson-forty-eight-2018',
    brand: 'HARLEY-DAVIDSON',
    brandOrigin: 'USA',
    model: 'FORTY-EIGHT',
    variant: '1200 Evolution · Vance & Hines Stage Custom',
    category: 'CRUISER',
    price: 1025000,
    priceDisplay: '₹10.25 L',
    year: 2018,
    kilometres: 18000,
    kmDisplay: '18,000 KM',
    owners: 2,
    ownerDisplay: '2ND OWNER',
    location: 'TAMIL NADU',
    city: 'Tamil Nadu',
    engineCC: 1202,
    horsepower: 66,
    torque: 96,
    weight: 247,
    topSpeed: 175,
    zeroToHundred: 4.8,
    fuelType: 'Petrol',
    transmission: '5-Speed Manual with Belt Drive',
    registration: 'TN (Tamil Nadu Registered)',
    condition: 'PRISTINE',
    serviceHistory: 'FULL AUTHORIZED DEALER',
    inspectionStatus: '150+ POINT CERTIFIED',
    featured: true,
    newArrival: true,
    tagline: 'Raw American Muscle — Vance & Hines Sound & Iconic Peanut Tank.',
    description: 'A head-turning 2018 registered (2017 manufactured) Harley-Davidson Forty-Eight in signature Vivid Yellow. Second owner, covered 18,000 km with full authorized service documentation. Fitted with premium Vance & Hines performance exhausts, chrome engine guard, pillion seat, side mount number plate, aftermarket diamond hand grips, and custom front indicator with headlamp grill. The 1202cc Evolution V-Twin delivers thunderous torque and classic American rumble.',
    images: [
      '/images/hd48/IMG_0035.jpg',
      '/images/hd48/IMG_0036.jpg',
      '/images/hd48/IMG_0045.jpg',
      '/images/hd48/IMG_0041.jpg',
      '/images/hd48/IMG_0037.jpg',
      '/images/hd48/IMG_0038.jpg',
      '/images/hd48/IMG_0043.jpg',
      '/images/hd48/IMG_0044.jpg',
      '/images/hd48/IMG_0048.jpg',
      '/images/hd48/IMG_0049.jpg',
      '/images/hd48/IMG_0051.jpg',
    ],
    specs: {
      engineType: '1202cc Air-Cooled Evolution V-Twin, Pushrod SOHC',
      compressionRatio: '10.0:1',
      cooling: 'Air Cooled',
      brakesFront: 'Dual-piston caliper, 300mm floating disc with ABS',
      suspensionFront: '49mm Cartridge-style telescopic forks',
      tyresFront: '130/90B16 (Shinko Forty-Eight Lettering)',
      tyresRear: '150/80B16 (High Traction)',
      fuelTank: '7.9 Litres (2.1 gal Peanut Tank)',
      exhaust: 'Vance & Hines Performance Exhaust System',
    },
    inspectionScore: {
      overall: 94,
      powertrain: 95,
      chassis: 94,
      electronics: 93,
      tyresBrakes: 96,
      cosmetics: 92,
      chassisNumberVerified: true,
      serviceLogbookVerified: true,
      dynoTested: true,
      accidentFreeGuarantee: true,
    },
    features: [
      'Vance & Hines Performance Exhaust',
      'Heavy-Duty Chrome Engine Guard',
      'Pillion Seat with Footpegs',
      'Side Mount Number Plate Bracket',
      'Aftermarket Hand Grips',
      'Aftermarket Front Indicator & Headlamp Grill',
      '2018 Registered (2017 Manufactured)',
      'Tamil Nadu (TN) Registered',
      'Second Owner · 18,000 KM Genuine Odometer',
      '1202cc Evolution V-Twin Engine',
      'Under-Mounted Bobber Rearview Mirrors',
      'Iconic 2.1-Gallon Peanut Fuel Tank',
    ],
  },
  {
    id: 're-interceptor-650-2021',
    brand: 'ROYAL ENFIELD',
    brandOrigin: 'INDIA',
    model: 'INTERCEPTOR 650',
    variant: 'Hollywood Edition — Red Rooster Exhaust',
    category: 'CLASSIC',
    price: 239000,
    priceDisplay: '₹2.39 L',
    year: 2021,
    kilometres: 7000,
    kmDisplay: '7,000 KM',
    owners: 1,
    ownerDisplay: '1ST OWNER',
    location: 'PUNJAB',
    city: 'Punjab',
    engineCC: 648,
    horsepower: 47,
    torque: 52,
    weight: 202,
    topSpeed: 160,
    zeroToHundred: 5.8,
    fuelType: 'Petrol',
    transmission: '6-Speed Gearbox with Slipper & Assist Clutch',
    registration: 'PB (Punjab Private)',
    condition: 'EXCELLENT',
    serviceHistory: 'FULL AUTHORIZED DEALER',
    inspectionStatus: '150+ POINT CERTIFIED',
    featured: true,
    newArrival: true,
    tagline: 'The Classic British Twin — Reimagined for Indian Roads.',
    description: 'A meticulously maintained 2021 Royal Enfield Interceptor 650 in the stunning Orange/Black colour. This one-owner machine has covered only 7,000 kms and is in excellent condition throughout. Fitted with the iconic Hollywood handlebar for a classic cafe racer stance, a Red Rooster Performance original exhaust for a throatier twin note, fresh rear tyre, and a 4-way hazard flasher for added safety. The parallel twin engine remains factory-fresh with full authorized dealer service history. A rare opportunity to own a lightly used, tastefully modified classic twin.',
    images: [
      '/images/IMG_0195.JPG',
      '/images/IMG_0211.JPG',
      '/images/IMG_0196.JPG',
      '/images/IMG_0201.JPG',
      '/images/IMG_0202.JPG',
      '/images/IMG_0197.JPG',
      '/images/IMG_0204.JPG',
      '/images/IMG_0198.JPG',
      '/images/IMG_0205.JPG',
      '/images/IMG_0200.JPG',
      '/images/IMG_0206.JPG',
      '/images/IMG_0207.JPG',
      '/images/IMG_0208.JPG',
      '/images/IMG_0209.JPG',
      '/images/IMG_0210.JPG',
      '/images/IMG_0212.JPG',
      '/images/IMG_0213.JPG',
    ],
    specs: {
      engineType: '648cc Air-Oil Cooled Parallel Twin, SOHC, 4 Valves per Cylinder',
      compressionRatio: '9.5:1',
      cooling: 'Air & Oil Cooled',
      brakesFront: '320mm disc, ByBre 2-piston caliper, Dual-Channel ABS',
      suspensionFront: '41mm Telescopic Forks with 110mm travel',
      tyresFront: '100/90-18 (Pirelli Phantom)',
      tyresRear: '130/70-18 (New Tyre — Recently Replaced)',
      fuelTank: '13.7 Litres',
      exhaust: 'Red Rooster Performance Original Exhaust',
    },
    inspectionScore: {
      overall: 93,
      powertrain: 96,
      chassis: 94,
      electronics: 92,
      tyresBrakes: 97,
      cosmetics: 90,
      chassisNumberVerified: true,
      serviceLogbookVerified: true,
      dynoTested: true,
      accidentFreeGuarantee: true,
    },
    features: [
      'Red Rooster Performance Original Exhaust',
      'Hollywood Handlebar (Cafe Racer Stance)',
      'New Rear Tyre (Just Replaced)',
      '4-Way Hazard Flasher',
      'Slipper & Assist Clutch',
      'Dual-Channel ABS',
      '648cc Parallel Twin — 47 BHP @ 7,150 RPM',
      '52 Nm Torque @ 5,150 RPM',
      '6-Speed Gearbox',
      'Only 7,000 KM Driven',
    ],
  },
  {
    id: 'harley-davidson-fat-bob-dyna-2017',
    brand: 'HARLEY-DAVIDSON',
    brandOrigin: 'USA',
    model: 'FAT BOB DYNA',
    variant: 'Twin Cam 96 · Vance & Hines Shortshots Custom',
    category: 'CRUISER',
    price: 789000,
    priceDisplay: '₹7.89 L',
    year: 2017,
    kilometres: 19000,
    kmDisplay: '19,000 KM',
    owners: 2,
    ownerDisplay: '2ND OWNER',
    location: 'JHARKHAND',
    city: 'Jharkhand',
    engineCC: 1585,
    horsepower: 79,
    torque: 132,
    weight: 320,
    topSpeed: 190,
    zeroToHundred: 4.5,
    fuelType: 'Petrol',
    transmission: '6-Speed Cruise Drive Manual with Belt Drive',
    registration: 'JH (Jharkhand Registered)',
    condition: 'EXCELLENT',
    serviceHistory: 'FULL AUTHORIZED DEALER',
    inspectionStatus: '150+ POINT CERTIFIED',
    featured: true,
    newArrival: true,
    tagline: 'Dark Custom Muscle — Twin Cam 96 Power, Vance & Hines Shortshots & Dual Headlamps.',
    description: 'An imposing and meticulously kept 2017 Harley-Davidson Fat Bob Dyna (FXDF) in menacing Vivid Black with signature red Harley-Davidson tank script. Jharkhand (JH) registered, second owner with 19,000 km genuine reading, maintained in excellent condition throughout. Powered by the iconic 1585cc (96 cu in) Twin Cam air-cooled V-Twin motor paired with a 6-speed Cruise Drive transmission. Fitted with authentic Vance & Hines Shortshots staggered performance exhaust pipes with slash-cut tips for an unmistakable thunderous roar, heavy-duty Harley-Davidson black crash guard / leg guard, aftermarket custom grips, and factory smart keyless proximity security fob. Featuring the signature dual bullet headlights, fat front tyre, and dual disc front brakes for legendary cruising muscle.',
    images: [
      '/images/fatbob/IMG_0065.jpg',
      '/images/fatbob/IMG_0055.jpg',
      '/images/fatbob/IMG_0052.jpg',
      '/images/fatbob/IMG_0062.jpg',
      '/images/fatbob/IMG_0058.jpg',
      '/images/fatbob/IMG_0060.jpg',
    ],
    specs: {
      engineType: '1585cc (96 cu in) Air-Cooled Twin Cam 96 V-Twin, Pushrod SOHC',
      compressionRatio: '9.2:1',
      cooling: 'Air Cooled',
      brakesFront: 'Dual 300mm floating discs, 4-piston calipers with ABS',
      suspensionFront: '43mm Telescopic forks with beefy triple clamps',
      tyresFront: '130/90B16 (Dunlop Harley-Davidson)',
      tyresRear: '180/70B16 (Dunlop Harley-Davidson)',
      fuelTank: '18.8 Litres (5.0 US Gallons)',
      exhaust: 'Vance & Hines Shortshots Staggered Performance Exhaust',
    },
    inspectionScore: {
      overall: 94,
      powertrain: 96,
      chassis: 95,
      electronics: 94,
      tyresBrakes: 95,
      cosmetics: 93,
      chassisNumberVerified: true,
      serviceLogbookVerified: true,
      dynoTested: true,
      accidentFreeGuarantee: true,
    },
    features: [
      'Vance & Hines Shortshots Exhaust System',
      'Heavy-Duty Harley-Davidson Leg Guard',
      'Smart Keyless Operating System with Fob',
      'Aftermarket Custom Hand Grips',
      'Signature Dual Chrome Bullet Headlights',
      '1585cc Twin Cam 96 V-Twin Engine',
      '6-Speed Cruise Drive Transmission',
      'Jharkhand (JH) Registered',
      '2nd Owner · 19,000 KM Genuine Reading',
      'Dual Front Disc Brakes with ABS',
      'Solid Slotted Black Aluminium Wheels',
      'Excellent Showroom Condition',
    ],
  },
  {
    id: 'suzuki-hayabusa-gen-3-2023',
    brand: 'SUZUKI',
    brandOrigin: 'JAPAN',
    model: 'HAYABUSA GEN 3',
    variant: 'GSX1300R · M4 US Full System & Carbon Hydrodipped',
    category: 'SUPERBIKE',
    price: 1800000,
    priceDisplay: '₹18.00 L',
    year: 2023,
    kilometres: 3700,
    kmDisplay: '3,700 KM',
    owners: 1,
    ownerDisplay: '1ST OWNER',
    location: 'SHOWROOM STOCK',
    city: 'Showroom Certified',
    engineCC: 1340,
    horsepower: 190,
    torque: 150,
    weight: 260,
    topSpeed: 299,
    zeroToHundred: 2.8,
    fuelType: 'Petrol',
    transmission: '6-Speed with Bi-Directional Quickshifter & Slipper Clutch',
    registration: 'Brand New Condition (Clear Title)',
    condition: 'MINT / CONCOURS',
    serviceHistory: 'FULL AUTHORIZED DEALER',
    inspectionStatus: '150+ POINT CERTIFIED',
    featured: true,
    newArrival: true,
    tagline: 'The Hyperbike Legend — M4 US Full System, Carbon Hydrodipped Aero & 3,700 Genuine KMs.',
    description: 'An immaculate, untouched 2023 Suzuki Hayabusa Gen 3 (GSX1300R) in Pearl Brilliant White. Covered only 3,700 kms from new and presenting in brand new untouched condition with factory duplicate 2nd key. Upgraded with an authentic US-imported M4 Performance Full System exhaust worth ₹3 Lakhs that unleashes a spine-tingling inline-4 howl while shedding crucial mass. Features over ₹1.5 Lakhs worth of premium carbon-weave hydrodipped components across the aerodynamic front fender, ram-air intake ducts, fairing gills, and frame covers. Factory equipped with flagship Brembo Stylema 4-piston radial monobloc calipers, R&G aerodynamic leg guards/frame sliders, 6-axis IMU Suzuki Intelligent Ride System (S.I.R.S.), bi-directional quickshifter, launch control, and single-seat aerodynamic rear cowl.',
    images: [
      '/images/hayabusa/IMG_0001.jpg',
      '/images/hayabusa/IMG_0003.jpg',
      '/images/hayabusa/IMG_0006.jpg',
      '/images/hayabusa/IMG_0010.jpg',
      '/images/hayabusa/IMG_0013.jpg',
      '/images/hayabusa/IMG_0014.jpg',
      '/images/hayabusa/IMG_0012.jpg',
      '/images/hayabusa/IMG_0005.jpg',
      '/images/hayabusa/IMG_0004.jpg',
      '/images/hayabusa/IMG_0007.jpg',
      '/images/hayabusa/IMG_0011.jpg',
      '/images/hayabusa/IMG_0015.jpg',
      '/images/hayabusa/IMG_0002.jpg',
    ],
    specs: {
      engineType: '1340cc 4-Stroke DOHC 16-Valve Liquid-Cooled Inline-Four, SDTV Injection',
      compressionRatio: '12.5:1',
      cooling: 'Liquid Cooled with Curved High-Flow Radiator & Dual Fans',
      brakesFront: 'Dual Brembo Stylema 4-Piston Radial Calipers, 320mm Floating Discs with Motion Track ABS',
      suspensionFront: 'KYB 43mm Inverted Cartridge Forks, DLC Coated, Fully Adjustable',
      tyresFront: '120/70ZR17 (Bridgestone Battlax Hypersport S22)',
      tyresRear: '190/50ZR17 (Bridgestone Battlax Hypersport S22)',
      fuelTank: '20.0 Litres (Aerodynamic Sculpted Tank)',
      exhaust: 'M4 US-Imported Full System Performance Exhaust (₹3 Lakh Value)',
    },
    inspectionScore: {
      overall: 99,
      powertrain: 99,
      chassis: 99,
      electronics: 100,
      tyresBrakes: 98,
      cosmetics: 99,
      chassisNumberVerified: true,
      serviceLogbookVerified: true,
      dynoTested: true,
      accidentFreeGuarantee: true,
    },
    features: [
      'M4 US-Imported Full System Exhaust (₹3 Lakh Value)',
      'Hydrodipped Carbon-Weave Fairing & Frame Parts (₹1.5 Lakh Value)',
      'Brembo Stylema Radial Monobloc Brake Calipers',
      'R&G Performance Leg Guard / Aero Frame Sliders',
      'Only 3,700 KM Genuine Reading — Untouched Condition',
      'Brand New Machine with Factory Duplicate 2nd Key',
      'Suzuki Intelligent Ride System (S.I.R.S.) with 6-Axis IMU',
      'Bi-Directional Quickshifter (Clutchless Shifts)',
      'Aerodynamic Single-Seat Tail Cowl Included',
      'Motion Track Cornering ABS & Traction Control (10 Modes)',
      'Launch Control (3 Modes) & Active Speed Limiter',
      'Bridgestone Battlax Hypersport S22 Tyres',
    ],
  },
];
