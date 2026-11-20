import React, { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

interface EMICalculatorProps {
  price: number;
  modelName: string;
}

export const EMICalculator: React.FC<EMICalculatorProps> = ({ price, modelName }) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [interestRate, setInterestRate] = useState<number>(9.75);

  const downPaymentAmount = Math.round((price * downPaymentPercent) / 100);
  const principal = price - downPaymentAmount;
  const monthlyRate = interestRate / 12 / 100;
  
  // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;

  const formatLakhs = (val: number) => {
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-hairline)',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="telemetry-badge accent">
              <Calculator size={12} /> BESPOKE FINANCIAL TAILORING
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              INSTANT PRE-APPROVAL
            </span>
          </div>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            STRUCTURE YOUR OWNERSHIP
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Flexible financing through our luxury automotive banking partners: HDFC, ICICI, Kotak Wealth, & Standard Chartered.
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ESTIMATED MONTHLY INSTALLMENT
          </span>
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.4rem',
              fontWeight: 900,
              color: 'var(--accent-orange)',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              marginTop: '0.25rem',
            }}
          >
            {formatINR(emi)}
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}> / MO</span>
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
        {/* Down payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>DOWN PAYMENT ({downPaymentPercent}%)</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{formatLakhs(downPaymentAmount)}</span>
          </div>
          <input
            type="range"
            min={15}
            max={70}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Min 15% · Recommended 25%</span>
        </div>

        {/* Tenure */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>LOAN TENURE</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{tenureMonths} MONTHS ({tenureMonths / 12} YRS)</span>
          </div>
          <input
            type="range"
            min={12}
            max={60}
            step={12}
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>12 to 60 Months flexible tenure</span>
        </div>

        {/* Interest Rate */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>INTEREST RATE (P.A.)</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{interestRate}%</span>
          </div>
          <input
            type="range"
            min={8.5}
            max={14.0}
            step={0.25}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Preferred rates for premier credit profiles</span>
        </div>
      </div>

      {/* Summary Row */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-hairline)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          fontSize: '0.82rem',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>PRINCIPAL LOAN AMOUNT:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>{formatLakhs(principal)}</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>TOTAL INTEREST PAYABLE:</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem' }}>{formatLakhs(totalInterest)}</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)', display: 'block' }}>DOCUMENTATION FEE:</span>
          <span style={{ color: 'var(--accent-orange)', fontWeight: 700, fontSize: '0.95rem' }}>ZERO / WAIVED</span>
        </div>

        <button
          onClick={() => alert(`Pre-Approval Request initiated for ${modelName} at ${formatINR(emi)}/mo. Our Wealth Desk will reach out within 30 minutes.`)}
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.78rem' }}
        >
          APPLY FOR INSTANT APPROVAL <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
