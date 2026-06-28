'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Camera, Check, ArrowRight, Play, X } from 'lucide-react';
import { useResolvedImage, useResolvedVideo } from '@/utils/indexedDBStore';
import ScrollReveal from '@/components/ScrollReveal';
import { getOptimizedServiceImage } from '@/utils/servicesImagesConfig';
import { getServiceCategories } from '@/utils/servicesData';

function SafeImage({ src, alt, className, style, isThumbnail = false }) {
  const resolved = useResolvedImage(src, isThumbnail);

  if (resolved && resolved.startsWith('/') && !resolved.startsWith('data:')) {
    return (
      <NextImage
        src={resolved}
        alt={alt}
        className={className}
        style={{ ...style, objectFit: 'cover' }}
        width={400}
        height={300}
        loading="lazy"
      />
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}

function VideoPlayOverlay({ videoUrl, onPlay }) {
  const resolvedVideo = useResolvedVideo(videoUrl);

  if (!resolvedVideo) return null;

  return (
    <div 
      className="video-play-overlay"
      onClick={(e) => {
        e.stopPropagation();
        onPlay(resolvedVideo);
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        zIndex: 2
      }}
    >
      <div 
        className="play-icon-circle"
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.15)';
          e.currentTarget.style.background = 'var(--primary)';
          e.currentTarget.style.borderColor = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        }}
      >
        <Play size={22} fill="currentColor" style={{ marginLeft: '3px' }} />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);

  const urlSearch = typeof window !== 'undefined' ? window.location.search : '';

  useEffect(() => {
    setCategories(getServiceCategories());
    
    const params = new URLSearchParams(urlSearch);
    const cat = params.get('cat');
    if (cat) {
      setActiveCategory(cat);
    } else {
      setActiveCategory('all');
    }
  }, [urlSearch]);

  if (categories.length === 0) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--fg-muted)', fontSize: '15px' }}>Loading Services...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    // Push the state to browser history without full page reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      if (catId === 'all') {
        url.searchParams.delete('cat');
      } else {
        url.searchParams.set('cat', catId);
      }
      window.history.pushState({}, '', url);
    }
    
    // Smooth scroll down to the services section if not choosing 'all'
    if (catId !== 'all') {
      setTimeout(() => {
        const el = document.getElementById(`cat-section-${catId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="services-page-wrapper">
      {/* 1. Services Banner */}
      <section className="services-hero section-padding page-hero-bg">
        <div className="container text-center">
          <ScrollReveal animation="fade-down" delay={100}>
            <span className="section-tag">Explore Specialties</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <h1 className="section-title mitshuka-title-font">Our Photography Services</h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={350}>
            <p className="section-subtitle max-w-xl">
              Click on a category card below to filter the services list or view all specialties.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. Top Categories Grid */}
      <section className="services-categories-section">
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '30px'
          }}>
            {/* All Services Card */}
            <ScrollReveal animation="fade-up" delay={0}>
              <div 
                className="category-selector-card glass-card etech-curve"
                onClick={() => setIsAllServicesModalOpen(true)}
                style={{ cursor: 'pointer', height: '100%' }}
              >
                <div className="category-img-box" style={{ 
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(249, 115, 22, 0.2) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)'
                  }}>
                    <Camera size={34} strokeWidth={1.5} />
                  </div>
                  <div className="price-tag" style={{ background: 'rgba(0, 0, 0, 0.55)', backdropFilter: 'blur(4px)' }}>
                    Full List
                  </div>
                </div>
                <div className="category-body">
                  <h3 className="category-name">All Services</h3>
                  <p className="category-desc">Browse our complete collection of photography & videography specialties.</p>
                  <div className="category-explore-btn">
                    <span>Explore All</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {categories.map((cat, idx) => {
              const isActive = cat.id === activeCategory;
              return (
                <ScrollReveal key={cat.id} animation="fade-up" delay={(idx + 1) * 120}>
                  <div 
                    className={`category-selector-card glass-card etech-curve ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                    style={{ cursor: 'pointer', height: '100%' }}
                  >
                    <div className="category-img-box">
                      <SafeImage src={cat.image} alt={cat.name} className="category-img" isThumbnail={true} />
                      <div className="price-tag">
                        <span className="price-start">Starts from </span>₹{cat.price}
                      </div>
                    </div>
                    <div className="category-body">
                      <h3 className="category-name">{cat.name}</h3>
                      <p className="category-desc">{cat.desc}</p>
                      <div className="category-explore-btn">
                        <span>{isActive ? 'Viewing Category' : 'Explore Category'}</span>
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Sub-services List Section */}
      <section className="services-list-section section-padding">
        <div className="container">
          {categories
            .filter(cat => activeCategory === 'all' || cat.id === activeCategory)
            .map((cat, catIdx) => (
              <div 
                key={cat.id} 
                id={`cat-section-${cat.id}`} 
                className="category-services-group"
                style={{ marginBottom: '80px', scrollMarginTop: '100px' }}
              >
                <div className="category-subservices-header text-center">
                  <span className="section-tag">{cat.name}</span>
                  <h2 className="serif-font active-category-heading">
                    Services inside <span className="gradient-text">{cat.name}</span>
                  </h2>
                  <p style={{ color: 'var(--fg-muted)', fontSize: '15px', marginTop: '10px', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                    {cat.desc}
                  </p>
                  <div className="category-heading-separator"></div>
                </div>

                <div className="grid-3" style={{ justifyContent: 'center' }}>
                  {cat.services && cat.services.map((service, idx) => {
                    const imageUrl = getOptimizedServiceImage(service, service.image);
                    return (
                      <ScrollReveal key={service.id} animation="fade-up" delay={idx * 100}>
                        <div className="service-card glass-card etech-curve" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <div className="service-img-box">
                            <SafeImage 
                              src={imageUrl} 
                              alt={service.name} 
                              className="service-img" 
                              style={service.id === 'baby' ? { objectPosition: 'center 30%' } : {}}
                              isThumbnail={true} 
                            />
                            {service.video && (
                              <VideoPlayOverlay videoUrl={service.video} onPlay={setActiveVideoUrl} />
                            )}
                            {service.price && (
                              <div className="price-tag">
                                <span className="price-start">Starts from </span>₹{service.price}
                              </div>
                            )}
                          </div>
                          <div className="service-body" style={{ textAlign: 'center', padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <div className="service-header-row" style={{ justifyContent: 'center', marginBottom: '15px' }}>
                              <h3 className="service-name" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--fg-main)', margin: 0 }}>{service.name}</h3>
                            </div>
                            
                            {service.desc && (
                              <p className="service-description" style={{ fontSize: '13.5px', color: 'var(--fg-muted)', marginBottom: '15px', marginTop: '-5px', lineHeight: '1.5' }}>
                                {service.desc}
                              </p>
                            )}
                            
                            {service.subServices && service.subServices.length > 0 && (
                              <ul className="service-sublist" style={{ listStyle: 'none', padding: 0, margin: '5px 0 20px 0', textAlign: 'left', flexGrow: 1 }}>
                                {service.subServices.map((sub, sIdx) => (
                                  <li key={sIdx} style={{ fontSize: '14px', color: 'var(--fg-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Check size={14} className="text-primary" style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                    <span>{sub}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            
                            {!service.subServices && <div style={{ flexGrow: 1 }}></div>}
                            
                            <Link
                              href="/contact"
                              className="btn btn-primary btn-sm service-book-btn"
                              style={{ width: '100%', borderRadius: 'var(--radius-pill)', marginTop: '15px' }}
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </section>

      {activeVideoUrl && (
        <div 
          className="video-modal-backdrop"
          onClick={() => setActiveVideoUrl(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '800px',
              backgroundColor: '#000',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <button 
              onClick={() => setActiveVideoUrl(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(0, 0, 0, 0.5)',
                border: 'none',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
            >
              <X size={20} />
            </button>
            <video 
              src={activeVideoUrl}
              controls
              autoPlay
              style={{
                width: '100%',
                display: 'block',
                maxHeight: '75vh',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>
      )}

      {isAllServicesModalOpen && (
        <div 
          className="all-services-modal-backdrop"
          onClick={() => setIsAllServicesModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            className="all-services-modal-content glass-card etech-curve"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '650px',
              maxHeight: '85vh',
              backgroundColor: '#121212',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'modalFadeIn 0.3s ease-out'
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '25px 30px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div>
                <span className="section-tag" style={{ margin: 0, fontSize: '11px', padding: '3px 8px' }}>Complete Menu</span>
                <h2 className="serif-font" style={{ fontSize: '24px', fontWeight: '700', color: 'var(--fg-main)', margin: '5px 0 0 0' }}>
                  Our <span className="gradient-text">Specialty Services</span>
                </h2>
              </div>
              <button 
                onClick={() => setIsAllServicesModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--fg-main)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--primary)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = 'var(--fg-main)';
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="custom-scrollbar" style={{
              padding: '30px',
              overflowY: 'auto',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              {categories.map((cat) => (
                <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 className="serif-font" style={{ 
                    fontSize: '17px', 
                    fontWeight: '700', 
                    color: 'var(--primary)', 
                    borderBottom: '1px solid rgba(249, 115, 22, 0.2)',
                    paddingBottom: '6px',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Camera size={16} />
                    {cat.name}
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px 20px'
                  }}>
                    {cat.services && cat.services.map((svc) => (
                      <div key={svc.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '6px 10px',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.04)'
                      }}>
                        <span style={{ fontSize: '13.5px', color: 'var(--fg-main)', fontWeight: '500' }}>
                          {svc.name}
                        </span>
                        <span style={{ fontSize: '12.5px', color: 'var(--fg-muted)', fontWeight: '600' }}>
                          ₹{svc.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Modal Footer */}
            <div style={{
              padding: '20px 30px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.2)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <Link 
                href="/contact" 
                onClick={() => setIsAllServicesModalOpen(false)}
                className="btn btn-primary"
                style={{ borderRadius: '30px', padding: '10px 24px' }}
              >
                Book a Session
              </Link>
            </div>
          </div>
          
          <style jsx>{`
            @keyframes modalFadeIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.02);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
