import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Eye, Sliders } from 'lucide-react';

interface HeadlightAtmosphereBackdropProps {
  title?: string;
  subtitle?: string;
  image?: string;
  className?: string;
  showControls?: boolean;
  telemetryLeft?: {
    status?: string;
    flux?: string;
    beam?: string;
  };
  telemetryRight?: {
    label?: string;
    value?: string;
  };
}

export const HeadlightAtmosphereBackdrop: React.FC<HeadlightAtmosphereBackdropProps> = ({
  title = "THE CLASSIC TWIN",
  subtitle = "ROYAL ENFIELD INTERCEPTOR 650 // RETRO BEAM & 4-WAY HAZARD FLASHER",
  image = "/images/IMG_0196.JPG",
  className = "",
  showControls = true,
  telemetryLeft,
  telemetryRight,
}) => {
  // Lighting state: 'drl' | 'highbeam' | 'strobe'
  const [lightMode, setLightMode] = useState<'drl' | 'highbeam' | 'strobe'>('highbeam');
  const [isStrobeActive, setIsStrobeActive] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Strobe pulse timer if strobe mode selected
  useEffect(() => {
    if (lightMode !== 'strobe') return;
    const interval = setInterval(() => {
      setIsStrobeActive((prev) => !prev);
    }, 120);
    return () => clearInterval(interval);
  }, [lightMode]);

  // Track mouse for volumetric beam flare parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const isHighBeam = lightMode === 'highbeam';
  const isDrl = lightMode === 'drl';
  const isStrobe = lightMode === 'strobe' && isStrobeActive;

  return (
    <div
      className={`relative w-full overflow-hidden bg-[#050505] select-none ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '560px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Deep Atmosphere Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      {/* The Shadowed BMW S1000RR Front Image Silhouette */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="relative w-full max-w-[960px] h-[520px]"
          style={{
            transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 3}deg)`,
            transition: 'transform 0.25s ease-out',
          }}
        >
          {/* Front Headlight Silhouette Image */}
          <img
            src={image}
            alt="Royal Enfield Interceptor Front Headlight"
            className="w-full h-full object-contain"
            style={{
              filter: isHighBeam
                ? 'brightness(0.95) contrast(125%) drop-shadow(0 0 45px rgba(255,90,31,0.25))'
                : isDrl
                ? 'brightness(0.55) contrast(135%)'
                : isStrobe
                ? 'brightness(1.1) contrast(140%)'
                : 'brightness(0.35) contrast(140%)',
              transition: 'filter 0.4s ease',
              maskImage: 'radial-gradient(ellipse at 50% 46%, black 42%, rgba(0,0,0,0.6) 62%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 46%, black 42%, rgba(0,0,0,0.6) 62%, transparent 80%)',
            }}
          />

          {/* Left Headlight Projector Flare & Volumetric Cone */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '41.5%',
              left: '43.2%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Core LED bulb glow */}
            <motion.div
              animate={{
                scale: isHighBeam ? [1, 1.15, 1] : isDrl ? 0.8 : isStrobe ? 1.4 : 0.6,
                opacity: isHighBeam ? 1 : isDrl ? 0.7 : isStrobe ? 1 : 0.3,
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              style={{
                width: '32px',
                height: '18px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, #FFFFFF 0%, #BFE7FF 40%, #FF5A1F 80%, transparent 100%)',
                boxShadow: isHighBeam
                  ? '0 0 35px 12px rgba(255, 255, 255, 0.95), 0 0 70px 25px rgba(0, 162, 255, 0.6), 0 0 100px 40px rgba(255, 90, 31, 0.4)'
                  : '0 0 20px 6px rgba(255, 255, 255, 0.7), 0 0 40px 10px rgba(0, 162, 255, 0.3)',
              }}
            />

            {/* Volumetric angled light beam casting across left floor */}
            <AnimatePresence>
              {(isHighBeam || isStrobe) && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.8 }}
                  animate={{ opacity: isStrobe ? 0.9 : 0.75, scaleY: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '480px',
                    height: '240px',
                    transform: `translate(-85%, 20%) rotate(28deg) skewX(-15deg)`,
                    background: 'radial-gradient(ellipse at 80% 10%, rgba(255, 255, 255, 0.5) 0%, rgba(160, 220, 255, 0.25) 30%, rgba(255, 90, 31, 0.08) 60%, transparent 85%)',
                    filter: 'blur(16px)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Headlight Projector Flare & Volumetric Cone */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: '41.5%',
              left: '56.8%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Core LED bulb glow */}
            <motion.div
              animate={{
                scale: isHighBeam ? [1, 1.15, 1] : isDrl ? 0.8 : isStrobe ? 1.4 : 0.6,
                opacity: isHighBeam ? 1 : isDrl ? 0.7 : isStrobe ? 1 : 0.3,
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.1 }}
              style={{
                width: '32px',
                height: '18px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, #FFFFFF 0%, #BFE7FF 40%, #FF5A1F 80%, transparent 100%)',
                boxShadow: isHighBeam
                  ? '0 0 35px 12px rgba(255, 255, 255, 0.95), 0 0 70px 25px rgba(0, 162, 255, 0.6), 0 0 100px 40px rgba(255, 90, 31, 0.4)'
                  : '0 0 20px 6px rgba(255, 255, 255, 0.7), 0 0 40px 10px rgba(0, 162, 255, 0.3)',
              }}
            />

            {/* Volumetric angled light beam casting across right floor */}
            <AnimatePresence>
              {(isHighBeam || isStrobe) && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0.8 }}
                  animate={{ opacity: isStrobe ? 0.9 : 0.75, scaleY: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '480px',
                    height: '240px',
                    transform: `translate(-15%, 20%) rotate(-28deg) skewX(15deg)`,
                    background: 'radial-gradient(ellipse at 20% 10%, rgba(255, 255, 255, 0.5) 0%, rgba(160, 220, 255, 0.25) 30%, rgba(255, 90, 31, 0.08) 60%, transparent 85%)',
                    filter: 'blur(16px)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Central Ground Beam Flood Illusion */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[700px] h-[140px] pointer-events-none"
            style={{
              background: isHighBeam
                ? 'radial-gradient(ellipse at 50% 100%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 90, 31, 0.18) 40%, transparent 75%)'
                : 'radial-gradient(ellipse at 50% 100%, rgba(255, 90, 31, 0.08) 0%, transparent 60%)',
              filter: 'blur(20px)',
              transition: 'all 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* Atmospheric Overlays & Edge Gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, #050505 0%, transparent 20%, transparent 80%, #050505 100%),
            linear-gradient(90deg, #050505 0%, transparent 25%, transparent 75%, #050505 100%)
          `,
        }}
      />

      {/* Telemetry Header & Interactive Lighting Controls Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col justify-between h-full min-h-[560px]">
        {/* Top Header Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[rgba(255,90,31,0.4)] text-[0.72rem] font-mono tracking-widest text-[#FF5A1F] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
              OPTIC ILLUMINATION MATRIX
            </div>
            <h3 className="font-heading text-2xl md:text-3xl font-black tracking-tight text-[#F5F5F2] uppercase">
              {title}
            </h3>
            <p className="font-mono text-xs text-[#9B9B9B] tracking-wider mt-1">
              {subtitle}
            </p>
          </div>

          {/* Interactive Lighting Console */}
          {showControls && (
            <div className="flex items-center gap-2 bg-[#0E0E0E]/90 border border-[rgba(255,255,255,0.1)] backdrop-blur-md px-3 py-2 rounded-2xl">
              <span className="text-[0.7rem] font-mono text-[#666] flex items-center gap-1.5 mr-2">
                <Sliders size={12} className="text-[#FF5A1F]" /> MODE:
              </span>

              <button
                type="button"
                onClick={() => setLightMode('drl')}
                className={`px-3 py-1.5 rounded-xl font-mono text-[0.7rem] font-bold tracking-wider transition-all cursor-pointer ${
                  lightMode === 'drl'
                    ? 'bg-[#FF5A1F] text-black shadow-[0_0_15px_rgba(255,90,31,0.5)]'
                    : 'bg-[#181818] text-[#999] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Eye size={12} /> DRL
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLightMode('highbeam')}
                className={`px-3 py-1.5 rounded-xl font-mono text-[0.7rem] font-bold tracking-wider transition-all cursor-pointer ${
                  lightMode === 'highbeam'
                    ? 'bg-[#FF5A1F] text-black shadow-[0_0_15px_rgba(255,90,31,0.5)]'
                    : 'bg-[#181818] text-[#999] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Zap size={12} /> HIGH BEAM
                </span>
              </button>

              <button
                type="button"
                onClick={() => setLightMode('strobe')}
                className={`px-3 py-1.5 rounded-xl font-mono text-[0.7rem] font-bold tracking-wider transition-all cursor-pointer ${
                  lightMode === 'strobe'
                    ? 'bg-[#FF5A1F] text-black shadow-[0_0_15px_rgba(255,90,31,0.5)]'
                    : 'bg-[#181818] text-[#999] hover:text-white'
                }`}
              >
                STROBE
              </button>
            </div>
          )}
        </div>

        {/* Bottom Telemetry HUD */}
        <div className="flex flex-wrap items-end justify-between gap-6 pt-16">
          <div className="font-mono text-[0.72rem] text-[#888] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{telemetryLeft?.status || 'HEADLIGHT SENSORS: ACTIVE'}</span>
            </div>
            <div>VOLUMETRIC FLUX: <span className="text-[#FF5A1F]">{telemetryLeft?.flux || '2,450 LUMENS // RETRO BEAM'}</span></div>
            <div>BEAM ANGLE DYNAMICS: <span className="text-white">{telemetryLeft?.beam || 'HIGH CLARITY ROAD ILLUMINATION'}</span></div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right font-mono text-[0.72rem]">
              <span className="text-[#666] block">{telemetryRight?.label || 'FRONT SUSPENSION'}</span>
              <span className="text-white font-bold tracking-wider">{telemetryRight?.value || 'PRECISION BALANCED STANCE'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HeadlightAtmosphereBackdrop;
