'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Camera, Check, ArrowRight } from 'lucide-react';
import { useResolvedImage } from '@/utils/indexedDBStore';
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

export default function ServicesPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

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
                className={`category-selector-card glass-card etech-curve ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('all')}
                style={{ cursor: 'pointer', height: '100%' }}
              >
                <div className="category-img-box">
                  <SafeImage src="/pic/services/events.png" alt="All Services" className="category-img" isThumbnail={true} />
                  <div className="price-tag">
                    Full Showcase
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
                            <SafeImage src={imageUrl} alt={service.name} className="service-img" isThumbnail={true} />
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
    </div>
  );
}
