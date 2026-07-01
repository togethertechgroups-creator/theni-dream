'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Calendar, Gem, Sparkles, Star, Award, Phone, Camera, Video, Gift } from 'lucide-react';
import { mockStore } from '@/utils/mockStore';
import ScrollReveal from '@/components/ScrollReveal';
import { fetchPackagesSync } from '@/utils/dbSync';

const TIERS = [
  {
    gradient: 'linear-gradient(145deg, #667eea 0%, #764ba2 100%)',
    accentColor: '#667eea',
    lightBg: 'rgba(102,126,234,0.06)',
    checkBg: 'rgba(102,126,234,0.12)',
    checkColor: '#667eea',
    Icon: Award,
    badgeLabel: null,
    ribbon: '#667eea',
  },
  {
    gradient: 'linear-gradient(145deg, #f7971e 0%, #ffd200 100%)',
    accentColor: '#f7971e',
    lightBg: 'rgba(247,151,30,0.06)',
    checkBg: 'rgba(247,151,30,0.12)',
    checkColor: '#e07b00',
    Icon: Star,
    badgeLabel: '⭐ MOST POPULAR',
    ribbon: '#f7971e',
  },
  {
    gradient: 'linear-gradient(145deg, #4facfe 0%, #00f2fe 100%)',
    accentColor: '#4facfe',
    lightBg: 'rgba(79,172,254,0.06)',
    checkBg: 'rgba(79,172,254,0.12)',
    checkColor: '#0ea5e9',
    Icon: Sparkles,
    badgeLabel: null,
    ribbon: '#4facfe',
  },
  {
    gradient: 'linear-gradient(145deg, #a18cd1 0%, #fbc2eb 50%, #a1c4fd 100%)',
    accentColor: '#a855f7',
    lightBg: 'rgba(168,85,247,0.06)',
    checkBg: 'rgba(168,85,247,0.12)',
    checkColor: '#a855f7',
    Icon: Gem,
    badgeLabel: '💎 ELITE',
    ribbon: '#a855f7',
    isElite: true,
  },
];

function FeatureSection({ label, icon: Icon, items, accent, checkBg, checkColor }) {
  if (!items || items.length === 0) return null;
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        marginBottom: '10px', paddingBottom: '7px',
        borderBottom: `1.5px solid ${checkBg.replace('0.12', '0.25')}`,
      }}>
        <Icon size={13} color={accent} strokeWidth={2.5} />
        <span style={{ fontSize: '10px', fontWeight: '800', color: accent, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
            <div style={{
              width: '17px', height: '17px', borderRadius: '50%',
              background: checkBg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexShrink: 0, marginTop: '1px',
            }}>
              <Check size={9} color={checkColor} strokeWidth={3} />
            </div>
            <span style={{ fontSize: '12.5px', color: '#4b5563', lineHeight: 1.45 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const loadPackages = async () => {
      const res = await fetchPackagesSync();
      if (res.configured && res.packages) {
        setPackages(res.packages);
        mockStore.setPackages(res.packages);
      } else {
        setPackages(mockStore.getPackages());
      }
    };
    loadPackages();
  }, []);

  const extract = (pkg, prefix) =>
    pkg.features
      .filter(f => f.text.toLowerCase().includes(prefix) && f.include)
      .map(f => f.text.replace(new RegExp(`^${prefix}\\s*`, 'i'), ''));

  return (
    <div style={{ minHeight: '100vh', background: '#f5f4fb' }}>

      {/* 1. Packages Hero Banner */}
      <section className="packages-hero section-padding page-hero-bg">
        <div className="container text-center">
          <ScrollReveal animation="fade-down" delay={100}>
            <span className="section-tag">Pricing Plans</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <h1 className="section-title mitshuka-title-font">
              Wedding &amp; Event{' '}
              <span style={{ color: '#ffffff' }}>
                Photography Packages
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={350}>
            <p className="section-subtitle max-w-xl" style={{ margin: '0 auto' }}>
              Tailored packages for every love story — from intimate ceremonies to grand celebrations.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Packages Tier Grid */}
      <section style={{ padding: '60px 20px 80px' }}>
        <div className="container">
          <div className="pkgs-grid">
            {packages.map((pkg, idx) => {
              const tier = TIERS[idx] || TIERS[0];
              const { Icon } = tier;
              const coverage = extract(pkg, '01 coverage:');
              const deliverables = extract(pkg, '02 deliverables:');
              const compliments = extract(pkg, '03 compliments:');
              const isActive = active === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActive(idx)}
                  onMouseLeave={() => setActive(null)}
                  style={{
                    background: '#ffffff',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    boxShadow: isActive
                      ? `0 20px 50px -8px ${tier.accentColor}55, 0 0 0 2.5px ${tier.accentColor}88`
                      : '0 2px 16px rgba(0,0,0,0.07)',
                    transform: isActive ? 'translateY(-10px) scale(1.01)' : 'none',
                    transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
                    cursor: 'pointer',
                  }}
                >
                  {/* Elite shimmer overlay */}
                  {tier.isElite && (
                    <div style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                      background: 'linear-gradient(135deg, transparent 40%, rgba(168,85,247,0.04) 50%, transparent 60%)',
                      animation: 'pkg-shimmer 4s infinite',
                    }} />
                  )}

                  {/* TOP GRADIENT HEADER */}
                  <div style={{
                    background: tier.gradient,
                    padding: '26px 22px 22px',
                    position: 'relative',
                    zIndex: 1,
                    overflow: 'hidden',
                  }}>
                    {/* Decorative circle */}
                    <div style={{ position: 'absolute', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', top: '-40px', right: '-30px', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', bottom: '-20px', left: '20px', pointerEvents: 'none' }} />

                    {/* Badge */}
                    {tier.badgeLabel && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)',
                        padding: '4px 12px', borderRadius: '100px', fontSize: '9px',
                        fontWeight: '800', color: '#fff', letterSpacing: '1.5px',
                        textTransform: 'uppercase', marginBottom: '14px',
                      }}>
                        {tier.badgeLabel}
                      </div>
                    )}

                    {/* Icon box */}
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '14px',
                      background: 'rgba(255,255,255,0.22)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '12px',
                    }}>
                      <Icon size={22} color="#fff" strokeWidth={2} />
                    </div>

                    {/* Type label */}
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.75)', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {pkg.type}
                    </div>

                    {/* Package name */}
                    <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '14px', lineHeight: 1.2 }}>
                      {pkg.name}
                    </h3>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>₹</span>
                      <span style={{ fontSize: '30px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' }}>{pkg.price}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginLeft: '2px' }}>/ event</span>
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', zIndex: 1 }}>

                    {/* Desc */}
                    <p style={{ fontSize: '12.5px', color: '#6b7280', lineHeight: 1.65, marginBottom: '18px' }}>
                      {pkg.desc}
                    </p>

                    <FeatureSection
                      label="Coverage"
                      icon={Camera}
                      items={coverage}
                      accent={tier.accentColor}
                      checkBg={tier.checkBg}
                      checkColor={tier.checkColor}
                    />
                    <FeatureSection
                      label="Deliverables"
                      icon={Video}
                      items={deliverables}
                      accent={tier.accentColor}
                      checkBg={tier.checkBg}
                      checkColor={tier.checkColor}
                    />
                    <FeatureSection
                      label="Compliments"
                      icon={Gift}
                      items={compliments}
                      accent={tier.accentColor}
                      checkBg={tier.checkBg}
                      checkColor={tier.checkColor}
                    />

                    {/* CTA */}
                    <div style={{ marginTop: 'auto', paddingTop: '18px' }}>
                      <Link
                        href="/contact"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                          padding: '13px 16px', borderRadius: '14px', textDecoration: 'none',
                          background: tier.gradient,
                          color: '#fff', fontWeight: '700', fontSize: '13px',
                          boxShadow: `0 6px 20px ${tier.accentColor}44`,
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          width: '100%',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <Calendar size={14} />
                        Book This Package
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Contact bar ── */}
          <div style={{
            marginTop: '52px',
            padding: '26px 32px',
            background: 'linear-gradient(135deg, #12082a 0%, #0a1628 100%)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={18} color="#f97316" />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>Need a custom package?</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>📞 98540 02628</div>
              </div>
            </div>
            <Link href="/contact" style={{
              padding: '12px 28px', background: 'linear-gradient(135deg, #f97316, #ea580c)',
              color: '#fff', fontWeight: '700', fontSize: '14px', borderRadius: '14px',
              textDecoration: 'none', boxShadow: '0 4px 18px rgba(249,115,22,0.35)',
              whiteSpace: 'nowrap',
            }}>
              Get Custom Quote →
            </Link>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style jsx global>{`
        .pkgs-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          align-items: start;
        }
        @media (max-width: 1100px) {
          .pkgs-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
          .pkgs-grid { grid-template-columns: 1fr; }
        }
        @keyframes pkg-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
