// TEST COMMENT
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, Aperture, Calendar, MessageCircle, Sparkles, Award, Users, Heart, Star, Shield, ArrowUpRight, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockStore } from '@/utils/mockStore';
import ServicesSection from '@/components/ServicesSection';
import { getOptimizedServiceImage } from '@/utils/servicesImagesConfig';
import { fetchServicesSync } from '@/utils/dbSync';
import { useResolvedImage } from '@/utils/indexedDBStore';

// Resolves indexeddb:// and blob: URLs for service images in modal
function ServiceModalImage({ src, alt, className, style, width, height }) {
  const resolved = useResolvedImage(src, false);
  if (
    resolved && (
      resolved.startsWith('blob:') ||
      resolved.startsWith('data:') ||
      resolved.startsWith('indexeddb://') ||
      resolved.startsWith('http://') ||
      resolved.startsWith('https://')
    )
  ) {
    return (
      <img
        src={resolved}
        alt={alt}
        className={className}
        style={{ objectFit: 'cover', width: '100%', height: '100%', ...style }}
        loading="lazy"
      />
    );
  }
  return (
    <Image
      src={resolved || '/pic/service-wedding.png'}
      alt={alt}
      className={className}
      style={style}
      width={width}
      height={height}
    />
  );
}

export default function Home() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      const res = await fetchServicesSync();
      if (res.configured && res.services) {
        setServices(res.services);
        mockStore.setServices(res.services);
      } else {
        setServices(mockStore.getServices());
      }
    };
    loadServices();
  }, []);

  // Synthesize camera shutter sound using Web Audio API
  const playShutterSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const playClick = (time, duration, volume) => {
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2500, time);
        filter.Q.setValueAtTime(3, time);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(time);
        noise.stop(time + duration);
      };

      const now = ctx.currentTime;
      playClick(now, 0.04, 0.4);
      playClick(now + 0.07, 0.05, 0.35);

    } catch (e) {
      console.error("Failed to play shutter sound: ", e);
    }
  };

  const handleCardClick = (service) => {
    playShutterSound();
    setSelectedService(service);
  };

  const getCategoryName = (id) => {
    const categories = {
      'wedding': 'Ceremony',
      'candid': 'Emotion',
      'traditional': 'Rituals',
      'cinematic': 'Cinema',
      'drone': 'Aerial',
      'pre-wedding': 'Romance',
      'maternity': 'Motherhood',
      'baby': 'Toddler',
      'birthday': 'Celebration',
      'corporate': 'Corporate',
      'outdoor': 'Outdoor'
    };
    return categories[id] || 'Photography';
  };

  // Real client photo gallery data from 4 shoots
  const galleryPhotos = {
    ajithLavanaya: [
      { id: 'al-01', src: '/ajith-lavanaya/DPG Ajith Lavanaya 01.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
      { id: 'al-02', src: '/ajith-lavanaya/DPG Ajith Lavanaya 02.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
      { id: 'al-03', src: '/ajith-lavanaya/DPG Ajith Lavanaya 03.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
      { id: 'al-04', src: '/ajith-lavanaya/DPG Ajith Lavanaya 04.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
      { id: 'al-05', src: '/ajith-lavanaya/DPG Ajith Lavanaya 05.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
      { id: 'al-06', src: '/ajith-lavanaya/DPG Ajith Lavanaya 006.jpg', label: 'Ajith & Lavanaya', tag: 'Candid' },
      { id: 'al-07', src: '/ajith-lavanaya/DPG Ajith Lavanaya 07.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
      { id: 'al-08', src: '/ajith-lavanaya/DPG Ajith Lavanaya 08.jpg', label: 'Ajith & Lavanaya', tag: 'Candid' },
      { id: 'al-09', src: '/ajith-lavanaya/DPG Ajith Lavanaya 009.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
      { id: 'al-11', src: '/ajith-lavanaya/DPG Ajith Lavanaya 11.jpg', label: 'Ajith & Lavanaya', tag: 'Candid' },
      { id: 'al-13', src: '/ajith-lavanaya/DPG Ajith Lavanaya 13.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
      { id: 'al-14', src: '/ajith-lavanaya/DPG Ajith Lavanaya 14.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
      { id: 'al-15', src: '/ajith-lavanaya/DPG Ajith Lavanaya 15.jpg', label: 'Ajith & Lavanaya', tag: 'Candid' },
      { id: 'al-16', src: '/ajith-lavanaya/DPG Ajith Lavanaya 16.jpg', label: 'Ajith & Lavanaya', tag: 'Wedding' },
    ],
    ajithLavanya: [
      { id: 'av-01', src: '/ajith-lavanya/Ajith Lavanya 01.jpg', label: 'Ajith & Lavanya', tag: 'Pre Wedding' },
      { id: 'av-02', src: '/ajith-lavanya/Ajith Lavanya 02.jpg', label: 'Ajith & Lavanya', tag: 'Pre Wedding' },
      { id: 'av-03', src: '/ajith-lavanya/Ajith Lavanya 03.jpg', label: 'Ajith & Lavanya', tag: 'Pre Wedding' },
      { id: 'av-04', src: '/ajith-lavanya/Ajith Lavanya 04.jpg', label: 'Ajith & Lavanya', tag: 'Pre Wedding' },
      { id: 'av-05', src: '/ajith-lavanya/Ajith Lavanya 05.jpg', label: 'Ajith & Lavanya', tag: 'Pre Wedding' },
      { id: 'av-06', src: '/ajith-lavanya/Ajith Lavanya 06.jpg', label: 'Ajith & Lavanya', tag: 'Pre Wedding' },
    ],
    karthiSasi: [
      { id: 'ks-01', src: '/dpg-karthi-sasi/DPG Karthi Sasi 01.jpg', label: 'Karthi & Sasi', tag: 'Wedding' },
      { id: 'ks-03', src: '/dpg-karthi-sasi/DPG Karthi Sasi 03.jpg', label: 'Karthi & Sasi', tag: 'Wedding' },
      { id: 'ks-04', src: '/dpg-karthi-sasi/DPG Karthi Sasi 04.jpg', label: 'Karthi & Sasi', tag: 'Wedding' },
      { id: 'ks-05', src: '/dpg-karthi-sasi/DPG Karthi Sasi 05.jpg', label: 'Karthi & Sasi', tag: 'Candid' },
      { id: 'ks-06', src: '/dpg-karthi-sasi/DPG Karthi Sasi 06.jpg', label: 'Karthi & Sasi', tag: 'Wedding' },
      { id: 'ks-08', src: '/dpg-karthi-sasi/DPG Karthi Sasi 08.jpg', label: 'Karthi & Sasi', tag: 'Candid' },
      { id: 'ks-09', src: '/dpg-karthi-sasi/DPG Karthi Sasi 09.jpg', label: 'Karthi & Sasi', tag: 'Wedding' },
    ],
    maniSharmi: [
      { id: 'ms-01', src: '/dpg-mani-sharmi/DPG Mani Sharmi Pre 01.jpg', label: 'Mani & Sharmi', tag: 'Pre Wedding' },
      { id: 'ms-02', src: '/dpg-mani-sharmi/DPG Mani Sharmi Pre 02.jpg', label: 'Mani & Sharmi', tag: 'Pre Wedding' },
      { id: 'ms-03', src: '/dpg-mani-sharmi/DPG Mani Sharmi Pre 03.jpg', label: 'Mani & Sharmi', tag: 'Pre Wedding' },
      { id: 'ms-04', src: '/dpg-mani-sharmi/DPG Mani Sharmi Pre 04.jpg', label: 'Mani & Sharmi', tag: 'Pre Wedding' },
      { id: 'ms-05', src: '/dpg-mani-sharmi/DPG Mani Sharmi Pre 05.jpg', label: 'Mani & Sharmi', tag: 'Pre Wedding' },
      { id: 'ms-06', src: '/dpg-mani-sharmi/DPG Mani Sharmi Pre 06.jpg', label: 'Mani & Sharmi', tag: 'Pre Wedding' },
    ],
  };

  // Distribute photos across 3 marquee rows
  const marqueeRow1 = [
    ...galleryPhotos.ajithLavanaya.slice(0, 5),
    ...galleryPhotos.karthiSasi.slice(0, 4),
    ...galleryPhotos.maniSharmi.slice(0, 3),
  ];
  const marqueeRow2 = [
    ...galleryPhotos.ajithLavanya,
    ...galleryPhotos.maniSharmi.slice(3),
    ...galleryPhotos.karthiSasi.slice(4),
  ];
  const marqueeRow3 = [
    ...galleryPhotos.ajithLavanaya.slice(5),
    ...galleryPhotos.ajithLavanya.slice(0, 3),
    ...galleryPhotos.karthiSasi.slice(0, 3),
  ];

  // Helper to dynamically repeat array elements to ensure the track width is larger than screen width
  const fillMarqueeItems = (items, minCount = 10) => {
    if (!items || items.length === 0) return [];
    let result = [];
    while (result.length < minCount) {
      result = [...result, ...items];
    }
    return result;
  };

  const renderPhotoMarqueeCard = (photo, suffix = '') => {
    return (
      <div
        key={`${photo.id}-marquee${suffix}`}
        className="marquee-card"
      >
        <Image src={photo.src} alt={photo.label} width={260} height={180} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
        <div className="marquee-card-overlay">
          <span className="marquee-card-category">{photo.tag}</span>
          <h4 className="marquee-card-title">{photo.label}</h4>
        </div>
      </div>
    );
  };

  const renderPhotoMarqueeRow = (photos, directionClass) => {
    const filled = fillMarqueeItems(photos, 10);
    if (filled.length === 0) return null;

    return (
      <div className="marquee-row">
        <div className={`marquee-track ${directionClass}`}>
          <div className="marquee-group">
            {filled.map((photo, index) => renderPhotoMarqueeCard(photo, `-g1-${index}`))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {filled.map((photo, index) => renderPhotoMarqueeCard(photo, `-g2-${index}`))}
          </div>
        </div>
      </div>
    );
  };

  // Keep old marquee helpers for backward compatibility (unused now)
  const renderMarqueeCard = (service, suffix = '') => null;
  const renderMarqueeRow = (rowServices, directionClass) => null;

  // Stagger reveal animation variants for services grid
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 16,
        stiffness: 100
      }
    }
  };

  return (
    <div className="home-page-container">
      {/* 1. Flatlay Orange Hero Section */}
      <section className="hero-section" id="hero">
        <div className="container hero-content animate-fade-in">
          {/* Left Column: Cursive Title & Features */}
          <div className="hero-left-col">
            <h1 className="hero-mockup-title">
              <span className="signature-font">We're Theni</span>
              <span className="voltage-font">
                Dream <br /> Photography,
              </span>
              <span className="signature-font">Creative Storytellers.</span>
            </h1>

            {/* Separator Line */}
            <div className="title-separator" />

            {/* Features Row */}
            <div className="hero-features-row">
              <div className="feature-col">
                <div className="feature-icon-circle">
                  <Camera size={22} />
                </div>
                <h3 className="feature-col-title">Candid Stories</h3>
                <p className="feature-col-desc">Capturing real emotions and timeless moments.</p>
              </div>

              <div className="feature-col">
                <div className="feature-icon-circle">
                  <Aperture size={22} />
                </div>
                <h3 className="feature-col-title">Creative Vision</h3>
                <p className="feature-col-desc">Artistic compositions that speak your story.</p>
              </div>

              <div className="feature-col">
                <div className="feature-icon-circle">
                  <Heart size={22} />
                </div>
                <h3 className="feature-col-title">Timeless Memories</h3>
                <p className="feature-col-desc">Preserving your special moments forever.</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hero-cta-row">
              <Link href="/portfolio" className="btn btn-hero-primary">
                View Portfolio <ArrowUpRight size={16} />
              </Link>
              <Link href="/contact" className="btn btn-hero-secondary">
                Book a Shoot
              </Link>
            </div>
          </div>

          {/* Right Column: Empty to allow the background image camera flatlay to showcase */}
          <div className="hero-right-col" />
        </div>
      </section>



      {/* 3. Why Choose Us (Outlined Grid) */}
      <section className="why-us-section section-padding">
        <div className="container grid-2 align-center">
          <motion.div
            className="why-us-images relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="image-stack-wrapper">
              <div className="shape-bg" />
              <div className="main-stack-img etech-curve shadow-lg">
                <Image
                  src="/pic/70678.jpg"
                  alt="Wedding Couple Shoot"
                  className="stack-image"
                  width={500}
                  height={600}
                  priority
                />
              </div>
              <div className="secondary-stack-img glass-card etech-curve animate-float">
                <Image
                  src="/pic/69503.jpg"
                  alt="Photography lens details"
                  className="stack-image-small"
                  width={200}
                  height={250}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="why-us-content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="section-tag">Benefits</span>
            <h2 className="section-title neogen-black-font">
              Why Couples & Families <br />
              <span className="gradient-text mitshuka-font" style={{ whiteSpace: 'nowrap' }}>Choose Theni Dream Photography</span>
            </h2>
            <ul className="benefit-list">
              <li className="benefit-item">
                <div className="benefit-icon bg-purple-tint">
                  <Camera size={22} className="c-purple" />
                </div>
                <div>
                  <h4 className="benefit-item-title">Elite Equipment & Lenses</h4>
                  <p className="benefit-item-desc">High-resolution mirrorless systems (Sony A7R V) providing ultra-sharp photos that look stunning in print.</p>
                </div>
              </li>

              <li className="benefit-item">
                <div className="benefit-icon bg-pink-tint">
                  <Sparkles size={22} className="c-pink" />
                </div>
                <div>
                  <h4 className="benefit-item-title">Candid & Artistic Direction</h4>
                  <p className="benefit-item-desc">Zero awkward poses. We capture the laughter, teary eyes, and natural chemistry as they unfold.</p>
                </div>
              </li>

              <li className="benefit-item">
                <div className="benefit-icon bg-gold-tint">
                  <Shield size={22} className="c-gold" />
                </div>
                <div>
                  <h4 className="benefit-item-title">Watermark & Secure Delivery</h4>
                  <p className="benefit-item-desc">All client galleries are securely managed, backed up, and protected by professional watermarks.</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Services List Section (GSAP Stack Reveal & Responsive Grid) */}
      <ServicesSection services={services} />

      {/* 5. Concentric Horizontal 3-Row Infinite Marquee Section */}
      <section className="marquee-section section-padding">
        <div className="container" style={{ maxWidth: '100%', padding: '0' }}>
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            style={{ padding: '0 24px' }}
          >
            <span className="section-tag">Our Recent Work</span>
            <h2 className="section-title mitshuka-title-font">Real Stories. Real Moments.</h2>
            <p className="section-subtitle">
              A glimpse of the beautiful weddings and pre-wedding shoots we've captured — each frame a timeless memory.
            </p>
          </motion.div>

          <div className="marquee-container">
            {/* Row 1: Left to Right — Ajith & Lavanaya + Karthi & Sasi + Mani & Sharmi */}
            {renderPhotoMarqueeRow(marqueeRow1, 'marquee-ltr-anim')}

            {/* Row 2: Right to Left — Ajith & Lavanya + Mani & Sharmi + Karthi & Sasi */}
            {renderPhotoMarqueeRow(marqueeRow2, 'marquee-rtl-anim')}

            {/* Row 3: Left to Right — Ajith & Lavanaya + Ajith & Lavanya + Karthi & Sasi */}
            {renderPhotoMarqueeRow(marqueeRow3, 'marquee-ltr-anim')}
          </div>
        </div>
      </section>


      {/* 6. Detailed Service Popup Modal */}
      {selectedService && (
        <div className="marquee-modal-backdrop" onClick={() => setSelectedService(null)}>
          <div
            className="marquee-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="marquee-modal-close-btn" onClick={() => setSelectedService(null)}>
              <X size={18} />
            </button>
            <div className="marquee-modal-content">
              {/* Left Column: Image/Video */}
              <div className="marquee-modal-image-col">
                {selectedService.video ? (
                  <video
                    src={selectedService.video}
                    className="marquee-modal-image"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                  />
                ) : (
                  <ServiceModalImage
                    src={getOptimizedServiceImage(selectedService, selectedService.image)}
                    alt={selectedService.name}
                    className="marquee-modal-image"
                    style={selectedService.id === 'baby' ? { objectPosition: 'center 30%' } : {}}
                    width={400}
                    height={500}
                  />
                )}
              </div>

              {/* Right Column: Details */}
              <div className="marquee-modal-details-col">
                <span className="marquee-modal-category">{getCategoryName(selectedService.id)}</span>
                <h3 className="marquee-modal-title">{selectedService.name}</h3>
                <div className="marquee-modal-price-tag">₹{selectedService.price} onwards</div>
                <p className="marquee-modal-desc">{selectedService.desc}</p>

                {selectedService.features && selectedService.features.length > 0 && (
                  <>
                    <h4 className="marquee-modal-features-title">What's Included:</h4>
                    <ul className="marquee-modal-features-list">
                      {selectedService.features.map((feat, idx) => (
                        <li key={idx} className="marquee-modal-feature-item">
                          <Check size={14} className="marquee-modal-feature-check" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <Link
                  href="/contact"
                  className="btn btn-primary marquee-modal-cta-btn"
                  onClick={() => setSelectedService(null)}
                >
                  Book this Specialty
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
