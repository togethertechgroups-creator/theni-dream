'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedServiceImage } from '@/utils/servicesImagesConfig';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ServicesSection({ services }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [activeMobileAudioId, setActiveMobileAudioId] = useState(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const activeIdxRef = useRef(0);
  const activeMobileAudioIdRef = useRef(null);

  const containerRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const requestRef = useRef();
  const globalAudioRef = useRef(null);

  // Sync mobile active audio ID ref
  useEffect(() => {
    activeMobileAudioIdRef.current = activeMobileAudioId;
  }, [activeMobileAudioId]);

  // Viewport visibility observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger if 10% visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const playAudio = (url) => {
    const audio = globalAudioRef.current;
    if (!audio) return;
    try {
      // Pause and reset previous audio
      audio.pause();
      audio.currentTime = 0;

      // Load new source and play
      audio.src = url;
      audio.load();
      audio.play().catch((err) => {
        console.warn("Audio playback blocked or interrupted:", err);
      });
    } catch (e) {
      console.error("Error playing audio:", e);
    }
  };

  const stopAudio = () => {
    const audio = globalAudioRef.current;
    if (!audio) return;
    try {
      audio.pause();
      audio.currentTime = 0;
    } catch (e) {
      console.error("Error stopping audio:", e);
    }
  };

  // When the section leaves the viewport, stop and reset, and clear states
  useEffect(() => {
    if (!isSectionVisible) {
      stopAudio();
      setIsSoundOn(false);
      setActiveMobileAudioId(null);
    }
  }, [isSectionVisible]);

  // Toggle sound: play/pause audio for the active card
  const toggleSound = () => {
    const newSoundOn = !isSoundOn;
    setIsSoundOn(newSoundOn);

    // Reset mobile sound toggle state
    setActiveMobileAudioId(null);

    const displayServices = services.slice(0, 6);

    if (newSoundOn && isSectionVisible) {
      const activeService = displayServices[activeIdxRef.current];
      if (activeService && activeService.video) {
        playAudio(activeService.video);
      }
    } else {
      stopAudio();
    }
  };

  // When active card changes, stop old audio and start new one if sound is on
  useEffect(() => {
    const displayServices = services.slice(0, 6);
    if (isSoundOn && isSectionVisible) {
      const activeService = displayServices[activeIdx];
      if (activeService && activeService.video) {
        playAudio(activeService.video);
      } else {
        stopAudio();
      }
    } else {
      // Only stop BGM if we're not playing mobile sound
      if (!activeMobileAudioId) {
        stopAudio();
      }
    }
  }, [activeIdx, isSoundOn, isSectionVisible, activeMobileAudioId, services]);

  const handleMobileSoundToggle = (serviceId, videoUrl) => {
    setIsSoundOn(false); // disable desktop sound

    if (activeMobileAudioId === serviceId) {
      setActiveMobileAudioId(null);
      stopAudio();
    } else {
      setActiveMobileAudioId(serviceId);
      playAudio(videoUrl);
    }
  };

  const handleCardVisibilityChange = (serviceId, isVisible) => {
    if (serviceId === activeMobileAudioIdRef.current && !isVisible) {
      setActiveMobileAudioId(null);
      stopAudio();
    }
  };

  // Auto-scroll logic
  const autoScroll = () => {
    window.scrollBy(0, 3); // Scroll down 3 pixels per frame
    const st = scrollTriggerRef.current;

    // Stop if we reach the end of the pinned section
    if (st && window.scrollY >= st.end) {
      setIsPlaying(false);
      return;
    }

    requestRef.current = requestAnimationFrame(autoScroll);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(autoScroll);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);

  // Use the top 6 main services for the premium desktop sticky scroll showcase
  const displayServices = services.slice(0, 6);

  useGSAP(
    () => {
      if (services.length === 0) return;

      console.log("Initializing GSAP Services Animation. Total services:", services.length);
      gsap.registerPlugin(ScrollTrigger);

      // Robustly query elements within the containerRef scope
      const imageElements = gsap.utils.toArray(".sticky-stacked-image-wrapper");
      const totalCards = imageElements.length;
      console.log("Found image cards for GSAP:", totalCards);

      if (totalCards === 0) return;

      // Initial Setup
      gsap.set(imageElements[0], { y: "0%", scale: 1, rotation: 0 });
      for (let i = 1; i < totalCards; i++) {
        if (!imageElements[i]) continue;
        gsap.set(imageElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      // Timeline for Pinning and Scrubbing
      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".services-desktop-layout", // pin the whole grid layout
          start: "top 90px", // Locks exactly at the position shown in the user's screenshot
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            // Sync text column dynamically with scrub progress
            const newIdx = Math.round(self.progress * (totalCards - 1));
            if (newIdx !== activeIdxRef.current) {
              activeIdxRef.current = newIdx;
              setActiveIdx(newIdx);
            }
          }
        },
      });

      scrollTriggerRef.current = scrollTimeline.scrollTrigger;

      // Animate cards stacking
      for (let i = 0; i < totalCards - 1; i++) {
        const currentImage = imageElements[i];
        const nextImage = imageElements[i + 1];
        const position = i;

        if (!currentImage || !nextImage) continue;

        scrollTimeline.to(
          currentImage,
          {
            scale: 0.85,
            rotation: -2, // slight rotation for premium feel
            duration: 1,
            ease: "none",
          },
          position
        );

        scrollTimeline.to(
          nextImage,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position
        );
      }

      return () => {
        scrollTimeline.kill();
      };
    },
    { scope: containerRef, dependencies: [services] }
  );

  if (services.length === 0) return null;

  return (
    <section className="services-section-wrapper" ref={containerRef}>
      <audio ref={globalAudioRef} loop preload="none" />
      {/* Soft Background Orbs */}
      <div className="services-bg-glow orange"></div>
      <div className="services-bg-glow purple"></div>

      <div className="container services-grid-container">
        {/* Unified Centered Header */}
        <div className="services-main-header">
          <span className="section-tag">Our Services</span>
          <h2 className="section-title neogen-black-font">What We Do Best</h2>
          <p className="section-subtitle">Browse through our professional photography & cinematic video specialties.</p>
        </div>

        {/* Desktop Sticky Split Layout with GSAP Pinning */}
        <div className="services-desktop-layout">
          {/* Left Column: Text Content */}
          <div className="services-text-column">
            <div className="services-text-cards-wrapper">
              <AnimatePresence mode="wait">
                {displayServices[activeIdx] && (
                  <motion.div
                    key={activeIdx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="services-sticky-text-card"
                  >
                    <span className="service-card-number">Specialty 0{activeIdx + 1}</span>
                    <h3 className="service-card-title mitshuka-title-font">
                      {displayServices[activeIdx].name}
                    </h3>
                    <div className="service-card-price">
                      Starting from ₹{displayServices[activeIdx].price} onwards
                    </div>
                    <p className="service-card-desc">{displayServices[activeIdx].desc}</p>

                    {displayServices[activeIdx].features && (
                      <div className="service-card-features">
                        {displayServices[activeIdx].features.map((feat, idx) => (
                          <div key={idx} className="service-feature-item">
                            <Check size={16} className="c-primary" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="service-card-actions">
                      <Link href="/contact" className="btn btn-primary">
                        <span>Book this Specialty</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Indicator dots and Auto Play */}
            <div className="services-controls-wrapper">
              <div className="services-scroll-dots">
                {displayServices.map((_, i) => (
                  <div
                    key={i}
                    className={`scroll-dot ${activeIdx === i ? 'active' : ''}`}
                  ></div>
                ))}
              </div>

              <button
                className={`auto-play-btn ${isPlaying ? 'playing' : ''}`}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
              </button>

              {/* Sound Toggle — only show if active service has a video */}
              {displayServices[activeIdx]?.video && (
                <button
                  className={`auto-play-btn sound-toggle-btn ${isSoundOn ? 'playing' : ''}`}
                  onClick={toggleSound}
                  title={isSoundOn ? 'Mute BGM' : 'Play BGM Sound'}
                >
                  {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>{isSoundOn ? 'Sound On' : 'Sound Off'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: GSAP Stacking Images List */}
          <div className="services-image-column">
            <div className="sticky-image-container">
              {displayServices.map((service, i) => (
                <div
                  key={service.id}
                  className="sticky-stacked-image-wrapper"
                >
                  {/* Show image always, play audio separately for BGM */}
                  <Image
                    src={getOptimizedServiceImage(service, service.image)}
                    alt={service.name}
                    className="sticky-stacked-image"
                    width={500}
                    height={600}
                  />
                  <div className="scroll-image-title-overlay">
                    <span className="overlay-number">0{i + 1}</span>
                    <span className="overlay-title">{service.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Layout: Beautiful Swipeable/Scrollable Cards Grid */}
        <div className="services-mobile-layout">
          <div className="services-mobile-cards-grid">
            {services.map((service, i) => (
              <MobileServiceCard
                key={service.id}
                service={service}
                index={i}
                activeMobileAudioId={activeMobileAudioId}
                handleMobileSoundToggle={handleMobileSoundToggle}
                onCardVisibilityChange={handleCardVisibilityChange}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Mobile Service Card with coordinated sound toggle
// ─────────────────────────────────────────────────────────────
function MobileServiceCard({ service, index, activeMobileAudioId, handleMobileSoundToggle, onCardVisibilityChange }) {
  const cardRef = useRef(null);
  const isCurrentPlaying = activeMobileAudioId === service.id;

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onCardVisibilityChange(service.id, entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when card goes out of viewport
      }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [service.id, onCardVisibilityChange]);

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    handleMobileSoundToggle(service.id, service.video);
  };

  return (
    <div className="services-mobile-card glass-card" ref={cardRef}>
      <div className="mobile-card-image-wrapper">
        {/* Always show the photo; audio plays separately */}
        <Image src={getOptimizedServiceImage(service, service.image)} alt={service.name} className="mobile-card-img" width={340} height={220} />
        {service.video && (
          <button
            className={`mobile-sound-btn ${isCurrentPlaying ? 'sound-on' : ''}`}
            onClick={handleSoundToggle}
            title={isCurrentPlaying ? 'Mute BGM' : 'Play BGM'}
          >
            {isCurrentPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        )}
        <div className="mobile-card-price-badge">Starting from ₹{service.price}</div>
      </div>
      <div className="mobile-card-content">
        <span className="mobile-card-number">Specialty 0{index + 1}</span>
        <h3 className="mobile-card-title mitshuka-title-font">{service.name}</h3>
        <p className="mobile-card-desc">{service.desc}</p>

        {service.features && (
          <div className="mobile-card-features">
            {service.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="mobile-feature-item">
                <Check size={14} className="c-primary" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        )}

        <Link href="/contact" className="btn btn-primary btn-sm mobile-card-btn">
          Book Now
        </Link>
      </div>
    </div>
  );
}
