import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, FileCheck, Cpu, Gauge, Disc, Award } from 'lucide-react';

export const InspectionMatrix: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'powertrain' | 'chassis' | 'electronics' | 'provenance'>('powertrain');

  const inspectionModules = [
    {
      id: 'powertrain',
      title: 'POWERTRAIN & ENGINE',
      score: '99.4%',
      icon: Gauge,
      checks: [
        'Dyno-verified BHP & torque delivery within ±2% factory tolerance',
        'Endoscopic combustion chamber & cylinder bore wall inspection',
        'Cold/hot oil pressure & compression test across all cylinders',
        'Clutch friction plate thickness & bi-directional quickshifter calibration',
        'Coolant chemical test & radiator core integrity audit',
        'Exhaust manifold oxygen sensors & lambda calibration',
      ],
    },
    {
      id: 'chassis',
      title: 'CHASSIS & SUSPENSION',
      score: '98.8%',
      icon: Disc,
      checks: [
        'Laser-guided optical chassis alignment and swingarm geometry check',
        'Öhlins / Showa / WP damping dyno resistance verification',
        'Headstock steering bearing free-play & drag torque audit',
        'Wheel runout inspection (lateral & radial within 0.3mm)',
        'Brembo / Stylema caliper piston seal test & brake fluid boiling point check',
        'Tyre compound hardness (Durometer test) & manufacturing date codes',
      ],
    },
    {
      id: 'electronics',
      title: 'ELECTRONICS & TELEMETRY',
      score: '100%',
      icon: Cpu,
      checks: [
        'Full factory OEM diagnostic scan (BMW ISTA, Ducati DDS, Triumph ODB)',
        '6-axis IMU pitch/roll/yaw telemetry sensor zero-point recalibration',
        'Cornering ABS, Traction Control, and Wheelie Control ECU actuation',
        'Battery load-test & stator alternator charging curve graph',
        'Full harness loom resistance check for zero aftermarket splice taps',
        'Instrument cluster TFT pixel & keyless transponder frequency audit',
      ],
    },
    {
      id: 'provenance',
      title: 'PROVENANCE & DOCUMENTATION',
      score: '100%',
      icon: FileCheck,
      checks: [
        'Laser etching check on VIN and engine casting serial numbers',
        'Ministry of Transport (Vahan) clear title verification (Zero hypothecation)',
        'Insurance claim history registry audit (Accident-free certificate)',
        'Full authorized dealership service history & genuine logbook trail',
        'Original duplicate smart keys, manual suite & factory tool kit',
        'High-security registration plate (HSRP) valid status confirmation',
      ],
    },
  ];

  return (
    <section id="trust-section" style={{ position: 'relative', padding: 'clamp(4rem, 8vw, 8rem) 0', background: 'var(--bg-secondary)' }}>
      <div className="container-wide">
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span className="telemetry-badge accent">
              <span className="dot" /> THE FANCY RIDES INDIA PROTOCOL
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              150+ POINT CERTIFICATION
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'flex-end' }}>
            <h2 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', lineHeight: 0.95, fontWeight: 900, letterSpacing: '-0.03em' }}>
              PRECISION <br />
              <span style={{ color: 'var(--accent-orange)' }}>TRANSPARENCY.</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6 }}>
              We do not sell bikes with secrets. Every machine undergoes our uncompromising 150+ point forensic evaluation protocol before joining the collection.
            </p>
          </div>
        </div>

        {/* 4 Diagnostic Modules */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {inspectionModules.map((mod) => {
            const Icon = mod.icon;
            const isSelected = activeTab === mod.id;

            return (
              <div
                key={mod.id}
                onClick={() => setActiveTab(mod.id as any)}
                style={{
                  background: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                  border: isSelected ? '1px solid var(--accent-orange)' : '1px solid var(--border-hairline)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      background: isSelected ? 'var(--accent-orange)' : 'rgba(255,255,255,0.05)',
                      color: isSelected ? '#000' : 'var(--text-primary)',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: isSelected ? 'var(--accent-orange)' : 'var(--text-primary)',
                    }}
                  >
                    {mod.score}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '0.25rem' }}>
                    {mod.title}
                  </h4>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {mod.checks.length} CLINICAL CHECKS
                  </span>
                </div>

                {/* Checks preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--border-hairline)', paddingTop: '1rem' }}>
                  {mod.checks.slice(0, 3).map((chk, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      <CheckCircle2 size={15} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{chk}</span>
                    </div>
                  ))}
                  {mod.checks.length > 3 && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-orange)', marginTop: '0.25rem' }}>
                      + {mod.checks.length - 3} MORE FORENSIC AUDITS
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Forensic Quality Guarantee Banner */}
        <div
          style={{
            marginTop: '2.5rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-medium)',
            padding: ' clamp(1.5rem, 3vw, 2.5rem)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: '2px solid var(--accent-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-orange)',
                boxShadow: '0 0 20px var(--accent-orange-glow)',
                flexShrink: 0,
              }}
            >
              <Award size={28} />
            </div>

            <div>
              <h4 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.2rem' }}>
                THE FANCY RIDES INDIA TITLE & CONDITION GUARANTEE
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '650px' }}>
                Every machine comes with verified clear title, 6-month comprehensive powertrain warranty, 7-day money-back guarantee, and buyback assurance program.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="telemetry-badge">
              <ShieldCheck size={14} color="var(--accent-orange)" />
              ACCIDENT-FREE SEAL
            </span>
            <span className="telemetry-badge">
              <CheckCircle2 size={14} color="var(--accent-orange)" />
              ZERO ODOMETER TAMPER
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
