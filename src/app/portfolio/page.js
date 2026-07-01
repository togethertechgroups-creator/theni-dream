'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, X, Lock, ChevronLeft, ChevronRight, AlertCircle, ChevronDown, Play, Pause } from 'lucide-react';
import { mockStore } from '@/utils/mockStore';
import { getServiceCategories } from '@/utils/servicesData';
import { useResolvedImage, useResponsiveResolvedImages } from '@/utils/indexedDBStore';
import { fetchAlbumsSync, fetchPortfolioSync, saveAlbumSync, savePortfolioSync, deleteAlbumSync } from '@/utils/dbSync';
import NextImage from 'next/image';

function SafeImage({ src, alt, className, style, onDragStart, isThumbnail = false }) {
  const { isResponsive, desktop, mobile } = useResponsiveResolvedImages(src, isThumbnail);

  if (isResponsive) {
    return (
      <picture style={{ display: 'contents' }}>
        <source media="(max-width: 768px)" srcSet={mobile} />
        <img
          src={desktop}
          alt={alt}
          className={className}
          style={style}
          onDragStart={onDragStart}
          loading="lazy"
          decoding="async"
        />
      </picture>
    );
  }

  // Optimize large static JPG/PNG image files to target 15KB compressed size
  if (desktop && desktop.startsWith('/') && !desktop.startsWith('data:')) {
    if (isThumbnail) {
      return (
        <NextImage
          src={desktop}
          alt={alt}
          className={className}
          style={{ ...style, objectFit: 'cover' }}
          width={400}
          height={300}
          onDragStart={onDragStart}
          loading="lazy"
        />
      );
    } else {
      return (
        <NextImage
          src={desktop}
          alt={alt}
          className={className}
          style={{ ...style, objectFit: 'contain' }}
          width={1200}
          height={900}
          onDragStart={onDragStart}
          priority
        />
      );
    }
  }

  return (
    <img
      src={desktop}
      alt={alt}
      className={className}
      style={style}
      onDragStart={onDragStart}
      loading="lazy"
      decoding="async"
    />
  );
}

// Dedicated responsive video player that handles play overlays and R2 / indexeddb sources
function SafeVideoPlayer({ src, thumbnail, alt, className, style }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const resolvedVideo = useResolvedImage(src, false);
  const resolvedThumb = useResolvedImage(thumbnail, true);
  // Detect mobile (touch) devices
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;

  const handlePlayToggle = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      // Pause all other video elements in the document
      document.querySelectorAll('video').forEach(vid => {
        if (vid !== videoRef.current) {
          vid.pause();
        }
      });
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Play failed:", err);
      });
    }
  };

  return (
    <div className={`video-player-container ${className}`} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {/* Thumbnail overlay — hidden when playing */}
      {!isPlaying && (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 2, cursor: 'pointer' }}
          onClick={handlePlayToggle}
          onTouchEnd={(e) => { e.preventDefault(); handlePlayToggle(e); }}
        >
          <SafeImage src={thumbnail || '/pic/pic-6.jpeg'} alt={alt} className="portfolio-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} isThumbnail={true} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', transition: 'background-color 0.2s' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(249, 115, 22, 0.4)' }} className="play-button-circle">
              <Play size={22} style={{ marginLeft: '4px', fill: 'white' }} />
            </div>
          </div>
        </div>
      )}

      {/* Video element — always rendered so it preloads; hidden visually when thumbnail is shown */}
      <video
        ref={videoRef}
        src={resolvedVideo}
        poster={resolvedThumb}
        className="portfolio-video"
        playsInline
        loop
        controls={isPlaying}
        onClick={handlePlayToggle}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          visibility: isPlaying ? 'visible' : 'hidden',
          position: 'absolute',
          inset: 0,
          zIndex: 1,
        }}
      />
    </div>
  );
}

// Full screen responsive video player inside lightbox modal
function LightboxVideoPlayer({ src, thumbnail, alt }) {
  const resolvedVideo = useResolvedImage(src, false);
  const resolvedThumb = useResolvedImage(thumbnail, true);
  return (
    <video
      src={resolvedVideo}
      poster={resolvedThumb}
      className="lightbox-img"
      controls
      autoPlay
      playsInline
      style={{ maxHeight: '80vh', maxWidth: '90vw', objectFit: 'contain' }}
    />
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay, Pagination, Navigation } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Framer Motion variants for gallery grid reveal
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 15
    }
  }
};

const matchCategory = (itemCat, activeCat) => {
  if (!itemCat || !activeCat) return false;
  const item = itemCat.trim().toLowerCase();
  const active = activeCat.trim().toLowerCase();

  if (active === 'all') return true;

  if (active === 'baby photography') {
    return item === 'baby photography' || item === 'baby shoot';
  }
  if (active === 'maternity') {
    return item === 'maternity' || item === 'maternity photography';
  }
  if (active === 'model') {
    return item === 'model' || item === 'model photography';
  }

  return item === active;
};

export default function PortfolioPage() {
  const WEDDING_CATEGORIES = [
    "Wedding", "Wedding Event", "Traditional Photography", "Traditional Videography",
    "Candid Photography", "Candid Videography", "Drone Coverage", "Cinematic Videos",
    "360 Selfie Booth", "Instant Photo Booth", "LED Wall Setup", "Outdoor Shoots",
    "Pre - Wedding Shoots", "Post - Wedding Shoots", "Pre-Wedding Shoots", "Post-Wedding Shoots",
    "Pre Wedding"
  ];
  const MAIN_BUTTONS = ["All", "Reception", "Engagement", "Maternity", "Model", "Baby Photography"];

  const [categories, setCategories] = useState([
    "All",
    "Wedding",
    "Reception",
    "Engagement",
    "Pre Wedding",
    "Events"
  ]);
  const [weddingDropdownOpen, setWeddingDropdownOpen] = useState(false);
  const [othersDropdownOpen, setOthersDropdownOpen] = useState(false);

  const [galleryItems, setGalleryItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);
  const [lightboxActiveIndex, setLightboxActiveIndex] = useState(-1);
  const [lightboxImagesList, setLightboxImagesList] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // default is "grid" albums view
  const [albums, setAlbums] = useState([]);
  const [portfolioView, setPortfolioView] = useState("showcase"); // "showcase" or "albums"
  const [selectedAlbum, setSelectedAlbum] = useState(null);



  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch albums
      const albumSync = await fetchAlbumsSync();
      let allAlbums;
      if (albumSync.configured) {
        allAlbums = albumSync.albums || [];

        // If legacy Sanjay & Kavitha album (dream2026) exists in D1 database, delete it
        if (allAlbums.some(a => a.id === 'dream2026')) {
          console.log("Removing legacy 'dream2026' album from D1 database...");
          await deleteAlbumSync('dream2026');
          const updatedAlbums = await fetchAlbumsSync();
          allAlbums = updatedAlbums.albums || [];
        }

        // Clean up legacy/misplaced photos in dpg_diya_model_og in D1 database
        const d1DiyaAlbum = allAlbums.find(a => a.id === 'dpg_diya_model_og');
        if (d1DiyaAlbum && d1DiyaAlbum.photos && (d1DiyaAlbum.photos.length !== 7 || d1DiyaAlbum.photos.some(p => p.url.includes('048') || p.url.includes('Karthi')))) {
          console.log("Migrating 'dpg_diya_model_og' album in D1 database...");
          const correctDiya = mockStore.getAlbums().find(a => a.id === 'dpg_diya_model_og');
          if (correctDiya) {
            await saveAlbumSync(correctDiya);
            const updatedAlbums = await fetchAlbumsSync();
            allAlbums = updatedAlbums.albums || [];
          }
        }

        // Seed any missing default albums
        const defaults = mockStore.getAlbums();
        let seededNew = false;
        for (const alb of defaults) {
          if (!allAlbums.some(a => a.id === alb.id)) {
            console.log(`Seeding missing album ${alb.id} to D1 database...`);
            await saveAlbumSync(alb);
            seededNew = true;
          }
        }
        if (seededNew) {
          const updatedAlbums = await fetchAlbumsSync();
          allAlbums = updatedAlbums.albums || [];
        }
        mockStore.setAlbums(allAlbums);
      } else {
        allAlbums = mockStore.getAlbums();
      }
      setAlbums(allAlbums);

      // 2. Fetch portfolio
      const portfolioSync = await fetchPortfolioSync();
      let items;
      if (portfolioSync.configured) {
        items = portfolioSync.portfolio || [];

        // If legacy duplicate portfolio item 17 exists in D1 database, update it
        const item17 = items.find(p => p.id === 17);
        if (item17 && item17.image === "/dpg-karthi-sasi/DPG Karthi Sasi 09.jpg") {
          console.log("Updating duplicate portfolio item 17 in D1 database...");
          const updatedItem = {
            id: 17,
            category: "Wedding",
            title: "Karthi & Sasi - Cherished Moments",
            image: "/dpg-karthi-sasi/DPG Karthi Sasi 08.jpg",
            albumId: "dpg_karthi_sasi"
          };
          await savePortfolioSync(updatedItem);
          const updatedPort = await fetchPortfolioSync();
          items = updatedPort.portfolio || [];
        }

        // Clean up legacy misplaced Diya model portfolio items in D1 database
        const diyaMisplaced = items.filter(p => p.albumId === 'dpg_diya_model_og' && (p.image.includes('048') || p.image.includes('Karthi') || p.id > 135));
        if (diyaMisplaced.length > 0) {
          console.log("Cleaning misplaced Diya model portfolio items from D1...");
          for (const item of diyaMisplaced) {
            await deletePortfolioSync(item.id);
          }
          const updatedPort = await fetchPortfolioSync();
          items = updatedPort.portfolio || [];
        }

        // Seed any missing default portfolio items
        const defaults = mockStore.getPortfolio();
        let seededNew = false;
        for (const portItem of defaults) {
          if (!items.some(p => p.id === portItem.id)) {
            console.log(`Seeding missing portfolio item ${portItem.id} to D1 database...`);
            await savePortfolioSync(portItem);
            seededNew = true;
          }
        }
        if (seededNew) {
          const updatedPort = await fetchPortfolioSync();
          items = updatedPort.portfolio || [];
        }
        mockStore.setPortfolio(items);
      } else {
        items = mockStore.getPortfolio();
      }

      const generalItems = items;
      setGalleryItems(generalItems);
      setFilteredItems(generalItems);

      // Dynamically compute unique categories for the filters
      const baseCategories = ["Wedding", "Reception", "Engagement", "Pre Wedding", "Events"];
      const svcCats = getServiceCategories();

      const rawCategories = [...baseCategories];
      svcCats.forEach(cat => {
        if (cat.name) rawCategories.push(cat.name);
        if (cat.services) {
          cat.services.forEach(svc => {
            if (svc.name) rawCategories.push(svc.name);
            if (svc.subServices) {
              svc.subServices.forEach(sub => {
                if (sub) rawCategories.push(sub);
              });
            }
          });
        }
      });

      allAlbums.forEach(alb => {
        if (alb.category) rawCategories.push(alb.category);
      });
      generalItems.forEach(item => {
        if (item.category) rawCategories.push(item.category);
      });

      const unique = ["All"];
      rawCategories.forEach(cat => {
        const trimmed = cat.trim();
        if (trimmed && !unique.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
          unique.push(trimmed);
        }
      });
      setCategories(unique);
    };

    loadData();
  }, []);



  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredItems(galleryItems);
    } else {
      setFilteredItems(galleryItems.filter(item => matchCategory(item.category, activeCategory)));
    }
  }, [activeCategory, galleryItems]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (selectedAlbum || lightboxActiveIndex >= 0) {
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('lenis-stopped');
    } else {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('lenis-stopped');
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('lenis-stopped');
    };
  }, [selectedAlbum, lightboxActiveIndex]);

  // Lightbox handlers
  const openLightbox = (list, index) => {
    setLightboxImagesList(list);
    setLightboxActiveIndex(index);
  };

  const closeLightbox = () => {
    setLightboxActiveIndex(-1);
    setLightboxImagesList([]);
  };

  const nextLightboxImage = (e) => {
    if (e) e.stopPropagation();
    if (lightboxImagesList.length === 0) return;
    setLightboxActiveIndex((prev) => (prev + 1) % lightboxImagesList.length);
  };

  const prevLightboxImage = (e) => {
    if (e) e.stopPropagation();
    if (lightboxImagesList.length === 0) return;
    setLightboxActiveIndex((prev) => (prev - 1 + lightboxImagesList.length) % lightboxImagesList.length);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxActiveIndex === -1) return;
      if (e.key === 'ArrowRight') {
        nextLightboxImage();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxActiveIndex, lightboxImagesList]);

  // Prevent right-click download
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // Prevent drag
  const handleDragStart = (e) => {
    e.preventDefault();
  };

  // Close dropdowns on click outside
  useEffect(() => {
    if (!weddingDropdownOpen && !othersDropdownOpen) return;
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.filter-dropdown-container')) {
        setWeddingDropdownOpen(false);
        setOthersDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [weddingDropdownOpen, othersDropdownOpen]);

  // Compute Wedding dropdown categories (dynamically matched from all available categories)
  const weddingDropdownCategories = categories.filter(
    cat => WEDDING_CATEGORIES.some(w => w.toLowerCase() === cat.trim().toLowerCase())
  );

  // Compute Others dropdown categories (anything not All, Reception, Engagement, Pre Wedding, Events, and not a Wedding sub-category)
  const othersDropdownCategories = categories.filter(
    cat => {
      const trimmed = cat.trim().toLowerCase();
      const EXCLUDED_OTHERS = ["baby shoot", "maternity photography", "model photography"];
      return (
        trimmed !== 'all' &&
        !MAIN_BUTTONS.some(m => m.toLowerCase() === trimmed) &&
        !WEDDING_CATEGORIES.some(w => w.toLowerCase() === trimmed) &&
        !EXCLUDED_OTHERS.includes(trimmed)
      );
    }
  );

  const isWeddingActive = WEDDING_CATEGORIES.some(
    cat => cat.toLowerCase() === activeCategory.trim().toLowerCase()
  );

  const isOthersActive = othersDropdownCategories.some(
    cat => cat.toLowerCase() === activeCategory.trim().toLowerCase()
  );

  const IS_VIDEO_CATEGORY = ["traditional videography", "candid videography", "cinematic videos"].includes(activeCategory.trim().toLowerCase());

  return (
    <div className="portfolio-page-wrapper" onContextMenu={handleContextMenu}>
      {/* 1. Portfolio Header */}
      <section className="portfolio-hero section-padding page-hero-bg">
        <div className="container text-center">
          <span className="section-tag">Gallery</span>
          <h1 className="section-title mitshuka-title-font" style={{ letterSpacing: '0.15em' }}>Our Portfolio</h1>
          <p className="section-subtitle max-w-xl">
            A curated showcase of love stories, grand receptions, details, and aerial coverage. Hover to view details. Images are copy-protected.
          </p>
        </div>
      </section>

      {/* 2. Portfolio Grid, Carousel, & Filters */}
      <section className="portfolio-content-section section-padding">
        <div className="container">

          <>
            {/* Categories Selector */}
            <div className="category-filter-bar">
              {/* 1. All Button */}
              <button
                className={`filter-btn ${activeCategory.toLowerCase() === 'all' ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory('All');
                  setWeddingDropdownOpen(false);
                  setOthersDropdownOpen(false);
                }}
              >
                All
              </button>

              {/* 2. Wedding Dropdown */}
              {weddingDropdownCategories.length > 0 && (
                <div className="filter-dropdown-container">
                  <button
                    className={`filter-btn dropdown-toggle ${isWeddingActive ? 'active' : ''}`}
                    onClick={() => {
                      setWeddingDropdownOpen(!weddingDropdownOpen);
                      setOthersDropdownOpen(false);
                    }}
                  >
                    <span>{isWeddingActive ? activeCategory : 'Wedding'}</span>
                    <ChevronDown size={14} className="dropdown-arrow" style={{ transform: weddingDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                  </button>
                  <AnimatePresence>
                    {weddingDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
                        transition={{ duration: 0.15 }}
                        className="filter-dropdown-menu glass-card"
                      >
                        {weddingDropdownCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setActiveCategory(cat);
                              setWeddingDropdownOpen(false);
                            }}
                            className={`dropdown-item-btn ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* 3. Main Buttons (Reception, Engagement, Pre Wedding, Events) */}
              {MAIN_BUTTONS.filter(btn => btn.toLowerCase() !== 'all').map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    setWeddingDropdownOpen(false);
                    setOthersDropdownOpen(false);
                  }}
                >
                  {cat}
                </button>
              ))}

              {/* 4. Others Dropdown */}
              {othersDropdownCategories.length > 0 && (
                <div className="filter-dropdown-container">
                  <button
                    className={`filter-btn dropdown-toggle ${isOthersActive ? 'active' : ''}`}
                    onClick={() => {
                      setOthersDropdownOpen(!othersDropdownOpen);
                      setWeddingDropdownOpen(false);
                    }}
                  >
                    <span>{isOthersActive ? activeCategory : 'Others'}</span>
                    <ChevronDown size={14} className="dropdown-arrow" style={{ transform: othersDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                  </button>
                  <AnimatePresence>
                    {othersDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, y: -10, x: '-50%' }}
                        transition={{ duration: 0.15 }}
                        className="filter-dropdown-menu glass-card"
                      >
                        {othersDropdownCategories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setActiveCategory(cat);
                              setOthersDropdownOpen(false);
                            }}
                            className={`dropdown-item-btn ${activeCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Layout Mode Switcher */}
            <div className="view-toggle-bar" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px' }}>
              <button
                className={`filter-btn ${viewMode === 'carousel' ? 'active' : ''}`}
                onClick={() => setViewMode('carousel')}
              >
                Carousel Showcase
              </button>
              <button
                className={`filter-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid Gallery
              </button>
            </div>

            {/* Copy protection alert bar */}
            <div className="protection-bar glass-card">
              <Lock size={14} className="lock-icon" />
              <span>Copy Protection Enabled: Image dragging, right-click savings, and downloads are disabled in the gallery.</span>
            </div>

            {/* Content rendering based on viewMode */}
            {viewMode === 'carousel' ? (
              filteredItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--fg-muted)' }}>
                  <p>No showcase items found in this category.</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="swiper-outer-container"
                >
                  <Swiper
                    spaceBetween={40}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                    }}
                    effect="coverflow"
                    grabCursor={true}
                    centeredSlides={true}
                    loop={filteredItems.length >= 4}
                    slidesPerView="auto"
                    coverflowEffect={{
                      rotate: 0,
                      slideShadows: false,
                      stretch: 0,
                      depth: 100,
                      modifier: 1.2,
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    navigation={{
                      nextEl: ".swiper-nav-btn-next",
                      prevEl: ".swiper-nav-btn-prev",
                    }}
                    className="Carousal_001"
                    modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
                  >
                    {filteredItems.map((item) => (
                      <SwiperSlide
                        key={item.id}
                        className="portfolio-card etech-curve swiper-custom-card"
                        onClick={() => {
                          if (item.albumId) {
                            const album = albums.find(a => a.id === item.albumId);
                            if (album) {
                              setSelectedAlbum(album);
                              return;
                            }
                          }
                          const idx = filteredItems.findIndex(i => i.id === item.id);
                          openLightbox(filteredItems, idx !== -1 ? idx : 0);
                        }}
                      >
                        {/* Blurred background glow */}
                        <div
                          className="card-blur-bg"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />

                        {/* Visual Protective Overlay */}
                        <div className="protective-overlay" onDragStart={handleDragStart} />

                        {item.video ? (
                          <SafeVideoPlayer
                            src={item.video}
                            thumbnail={item.image}
                            alt={item.title}
                            className="portfolio-image"
                            style={{ width: '100%', height: '100%' }}
                          />
                        ) : (
                          <SafeImage
                            src={item.image}
                            alt={item.title}
                            className="portfolio-image"
                            onDragStart={handleDragStart}
                            isThumbnail={true}
                          />
                        )}

                        {/* Info Card on Hover */}
                        <div className="portfolio-info-overlay">
                          <span className="portfolio-category-tag">{item.category}</span>
                          <h3 className="portfolio-item-title serif-font">{item.title}</h3>
                          <div className="preview-eye-box">
                            <Eye size={20} />
                            <span>Quick Preview</span>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom navigation buttons */}
                  <div className="swiper-nav-btn swiper-nav-btn-prev">
                    <ChevronLeft size={24} />
                  </div>
                  <div className="swiper-nav-btn swiper-nav-btn-next">
                    <ChevronRight size={24} />
                  </div>
                </motion.div>
              )
            ) : (
              IS_VIDEO_CATEGORY ? (
                filteredItems.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--fg-muted)', width: '100%' }}>
                    <p>No video showcase items found in this category.</p>
                  </div>
                ) : (
                  <motion.div
                    className="grid-3 portfolio-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    key={activeCategory}
                  >
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={itemVariants}
                        className="video-showcase-card etech-curve glass-card"
                        style={{ overflow: 'hidden', position: 'relative' }}
                      >
                        <SafeVideoPlayer
                          src={item.video}
                          thumbnail={item.image}
                          alt={item.title}
                          className="video-player-box"
                          style={{ width: '100%', height: '100%' }}
                        />
                        <div className="portfolio-info-overlay-static" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)', color: 'white', pointerEvents: 'none', zIndex: 3 }}>
                          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 'bold' }}>{item.category}</span>
                          <h3 className="serif-font" style={{ fontSize: '1.1rem', margin: '4px 0 0 0', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', color: 'white' }}>{item.title}</h3>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )
              ) : (
                <motion.div
                  className="grid-3 portfolio-grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  key={activeCategory} // Force stagger transition on category change
                >
                  {albums.filter(album => {
                    if (album.albumType === 'client') return false;
                    const cat = album.category || "Wedding";
                    return matchCategory(cat, activeCategory);
                  }).length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--fg-muted)' }}>
                    <p>No album collections found in this category.</p>
                  </div>
                ) : (
                  albums
                    .filter(album => {
                      if (album.albumType === 'client') return false;
                      const cat = album.category || "Wedding";
                      return matchCategory(cat, activeCategory);
                    })
                    .map((album) => {
                      const coverImage = album.photos && album.photos.length > 0 ? album.photos[0].url : '/pic/pic-6.jpeg';
                      return (
                        <motion.div
                          key={album.id}
                          variants={itemVariants}
                          className="album-card etech-curve"
                          onClick={() => setSelectedAlbum(album)}
                        >
                          {/* Visual Protective Overlay */}
                          <div className="protective-overlay" onDragStart={handleDragStart} />

                          <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                            <SafeImage
                              src={coverImage}
                              alt={album.eventName}
                              className="album-cover-image"
                              onDragStart={handleDragStart}
                              isThumbnail={true}
                            />
                            <div className="album-photos-count-badge">
                              {album.photos ? album.photos.length : 0} Photos
                            </div>
                          </div>

                          <div className="album-card-details">
                            <span className="album-card-date">
                              {album.eventDate}
                            </span>
                            <h3 className="album-card-title serif-font">
                              {album.clientName}
                            </h3>
                            <p className="album-card-location">
                              <span>📍 {album.location || 'Theni'}</span>
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                )}
              </motion.div>
            )
          )}
        </>

        </div>
      </section>


      {/* 3. Full Screen Lightbox Modal */}
      <AnimatePresence>
        {lightboxActiveIndex >= 0 && lightboxImagesList[lightboxActiveIndex] && (
          <motion.div
            className="lightbox-modal"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            onContextMenu={handleContextMenu}
          >
            {/* Close Button */}
            <div className="lightbox-close-btn" onClick={closeLightbox}>
              <X size={32} />
            </div>

            {/* Navigation controls */}
            {lightboxImagesList.length > 1 && (
              <>
                <div className="lightbox-nav-btn lightbox-nav-prev" onClick={prevLightboxImage}>
                  <ChevronLeft size={32} />
                </div>
                <div className="lightbox-nav-btn lightbox-nav-next" onClick={nextLightboxImage}>
                  <ChevronRight size={32} />
                </div>
              </>
            )}

            <motion.div
              className="lightbox-content-box"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              key={lightboxActiveIndex} // Key change triggers layout transition on page update
            >
              {/* Protective Overlay in Lightbox */}
              <div className="protective-overlay" onDragStart={handleDragStart} />

              {lightboxImagesList[lightboxActiveIndex].video ? (
                <LightboxVideoPlayer
                  src={lightboxImagesList[lightboxActiveIndex].video}
                  thumbnail={lightboxImagesList[lightboxActiveIndex].image}
                  alt={lightboxImagesList[lightboxActiveIndex].title}
                />
              ) : (
                <SafeImage
                  src={lightboxImagesList[lightboxActiveIndex].image}
                  alt={lightboxImagesList[lightboxActiveIndex].title}
                  className="lightbox-img"
                  onDragStart={handleDragStart}
                />
              )}

              <div className="lightbox-caption glass-card">
                <span className="caption-category">{lightboxImagesList[lightboxActiveIndex].category}</span>
                <h3 className="caption-title serif-font">{lightboxImagesList[lightboxActiveIndex].title}</h3>
                <p className="caption-desc">Right-click & downloads are disabled. Copy protection active.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Sub-Album Detail Overlay Modal */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            className="album-detail-modal"
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedAlbum(null)}
            onContextMenu={handleContextMenu}
          >
            <motion.div
              className="album-detail-content glass-card"
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="album-modal-close" onClick={() => setSelectedAlbum(null)}>
                <X size={24} />
              </div>

              {/* Album Header */}
              <div className="album-modal-header text-center" style={{ paddingRight: '40px' }}>
                <span className="album-modal-tag">Featured Wedding Album</span>
                <h2 className="album-modal-title serif-font">{selectedAlbum.eventName}</h2>
                <div className="album-modal-meta" style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', color: 'var(--fg-muted)', fontSize: '14px' }}>
                  <span>📅 {selectedAlbum.eventDate}</span>
                  <span>📍 {selectedAlbum.location}</span>
                </div>
              </div>

              <hr style={{ margin: '24px 0', borderColor: 'var(--border-color)', opacity: 0.3 }} />

              {/* Photo Grid */}
              <div className="album-modal-grid">
                {selectedAlbum.photos && selectedAlbum.photos.length > 0 ? (
                  selectedAlbum.photos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="album-modal-photo-card etech-curve"
                      onClick={() => {
                        const lightboxList = selectedAlbum.photos.map(p => ({
                          id: p.id,
                          title: p.title,
                          category: selectedAlbum.clientName,
                          image: p.url
                        }));
                        openLightbox(lightboxList, idx);
                      }}
                    >
                      <div className="protective-overlay" onDragStart={handleDragStart} />
                      <SafeImage
                        src={photo.url}
                        alt={photo.title}
                        className="album-modal-photo"
                        onDragStart={handleDragStart}
                        isThumbnail={true}
                      />
                      <div className="album-photo-hover-overlay">
                        <Eye size={20} />
                        <span>View Larger</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--fg-muted)', padding: '40px 0' }}>
                    No photos in this album.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Global CSS style block for Swiper and Custom Albums */}
      <style jsx global>{`
        .swiper-outer-container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          padding: 20px 0 60px 0;
        }
        .Carousal_001 {
          padding-bottom: 60px !important;
          padding-top: 10px !important;
        }
        .swiper-custom-card {
          position: relative;
          background: #121214;
          width: 75% !important;
          max-width: 320px;
          height: 300px !important;
          border-radius: var(--radius-md) !important;
          box-shadow: var(--shadow-lg);
          overflow: hidden !important;
          transition: opacity var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
        }
        @media (min-width: 768px) {
          .swiper-custom-card {
            width: 32% !important;
            max-width: 360px;
            height: 380px !important;
          }
        }
        .card-blur-bg {
          position: absolute;
          inset: -20px;
          background-size: cover;
          background-position: center;
          filter: blur(25px) brightness(0.4);
          opacity: 0.75;
          z-index: 1;
          pointer-events: none;
        }
        .swiper-custom-card .portfolio-image {
          position: relative;
          z-index: 2;
          height: 100% !important;
          width: 100% !important;
          object-fit: cover !important;
          object-position: center center !important;
        }
        .protective-overlay {
          z-index: 3 !important;
        }
        .portfolio-info-overlay {
          z-index: 4 !important;
        }
        .swiper-pagination-bullet {
          background: var(--fg-muted) !important;
          opacity: 0.4;
          width: 10px !important;
          height: 10px !important;
          transition: all var(--transition-fast) !important;
        }
        .swiper-pagination-bullet-active {
          background: var(--primary) !important;
          opacity: 1 !important;
          width: 28px !important;
          border-radius: 5px !important;
        }
        .swiper-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 50px;
          height: 50px;
          border-radius: var(--radius-pill);
          background: var(--bg-glass);
          backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-md);
        }
        .swiper-nav-btn:hover {
          background: var(--primary);
          color: #ffffff;
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }
        .swiper-nav-btn-prev {
          left: -25px;
        }
        .swiper-nav-btn-next {
          right: -25px;
        }
        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        @media (max-width: 1200px) {
          .swiper-nav-btn-prev {
            left: -10px;
          }
          .swiper-nav-btn-next {
            right: -10px;
          }
        }
        @media (max-width: 768px) {
          .swiper-nav-btn {
            width: 40px;
            height: 40px;
          }
          .swiper-nav-btn-prev {
            left: 5px;
          }
          .swiper-nav-btn-next {
            right: 5px;
          }
        }

        /* ── Couple Albums View Toggle Styles ── */
        .portfolio-view-toggle {
          background: rgba(255, 255, 255, 0.8) !important;
          border: 1px solid rgba(249, 115, 22, 0.1) !important;
          padding: 6px;
          border-radius: var(--radius-pill);
          display: flex;
          gap: 4px;
          width: fit-content;
          margin: 0 auto 40px auto;
          box-shadow: var(--shadow-sm);
        }
        
        /* ── Album Card Styles ── */
        .album-card {
          position: relative;
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-md);
        }
        .album-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          border-color: rgba(249, 115, 22, 0.4);
        }
        .album-card-details {
          padding: 24px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(0, 0, 0, 0.03);
        }
        .album-cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 25%;
          transition: transform var(--transition-normal);
        }
        .album-card:hover .album-cover-image {
          transform: scale(1.06);
        }
        .album-photos-count-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(249, 115, 22, 0.95);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: var(--radius-pill);
          font-size: 12px;
          font-weight: 700;
          z-index: 10;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        .album-card-date {
          font-size: 12px;
          color: var(--primary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .album-card-title {
          font-size: 22px;
          margin: 6px 0 8px 0;
          color: var(--fg-main);
        }
        .album-card-location {
          font-size: 14px;
          color: var(--fg-muted);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        /* ── Album Detail Modal Styles ── */
        .album-detail-modal {
          position: fixed;
          inset: 0;
          z-index: 1500;
          background: rgba(9, 9, 11, 0.85);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
          padding: 40px 20px;
        }
        .album-detail-content {
          position: relative;
          width: 100%;
          max-width: 1100px;
          background: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          padding: 40px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
          margin-top: 20px;
        }
        .album-modal-close {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #f4f4f5;
          color: #000000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          z-index: 10;
        }
        .album-modal-close:hover {
          background: var(--primary);
          color: #ffffff;
          transform: rotate(90deg);
        }
        .album-modal-tag {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--primary);
          font-weight: 700;
          display: block;
          margin-bottom: 8px;
        }
        .album-modal-title {
          font-size: 32px;
          color: var(--fg-main);
        }
        .album-modal-grid {
          column-count: 3;
          column-gap: 20px;
          margin-top: 30px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .album-modal-grid {
            column-count: 2;
          }
        }
        @media (max-width: 600px) {
          .album-modal-grid {
            column-count: 1;
          }
        }
        .album-modal-photo-card {
          break-inside: avoid;
          margin-bottom: 20px;
          height: auto !important;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: all var(--transition-normal);
          border: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
        }
        .album-modal-photo {
          width: 100% !important;
          height: auto !important;
          display: block;
          transition: transform var(--transition-normal);
        }
        .album-modal-photo-card:hover .album-modal-photo {
          transform: scale(1.08);
        }
        .album-photo-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(249, 115, 22, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          color: #ffffff;
          transition: all var(--transition-fast);
          gap: 8px;
          z-index: 5;
        }
        .album-modal-photo-card:hover .album-photo-hover-overlay {
          opacity: 1;
        }
        .album-photo-hover-overlay span {
          font-size: 14px;
          font-weight: 600;
        }
        
        /* ── Lightbox Custom Navigation Buttons ── */
        .lightbox-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
          z-index: 1600;
        }
        .lightbox-nav-btn:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: #ffffff;
          box-shadow: var(--shadow-glow);
        }
        .lightbox-nav-prev {
          left: 30px;
        }
        .lightbox-nav-next {
          right: 30px;
        }
        
        /* ── Lightbox Layout & Image Overrides ── */
        .lightbox-content-box {
          max-width: 95vw !important;
          max-height: 95vh !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .lightbox-img {
          max-width: 90vw !important;
          max-height: 82vh !important;
          object-fit: contain !important;
          border-radius: var(--radius-sm);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 768px) {
          .lightbox-nav-btn {
            width: 44px;
            height: 44px;
          }
          .lightbox-nav-prev {
            left: 10px;
          }
          .lightbox-nav-next {
            right: 10px;
          }
          .album-detail-content {
            padding: 24px 16px;
          }
          .album-modal-title {
            font-size: 24px;
          }
        }

        /* ── Dropdown Category Filter Styles ── */
        .filter-dropdown-container {
          position: relative;
          display: inline-block;
        }
        .dropdown-toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .dropdown-arrow {
          display: inline-block;
          opacity: 0.7;
        }
        .filter-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          min-width: 240px;
          max-width: 280px;
          max-height: 280px;
          overflow-y: auto;
          background-color: #ffffff;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03);
          z-index: 1000;
          padding: 6px 0;
          display: flex;
          flex-direction: column;
          scrollbar-width: thin;
        }
        .dropdown-item-btn {
          width: 100%;
          text-align: left;
          padding: 10px 16px;
          background: none;
          border: none;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--fg-muted);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .dropdown-item-btn:hover {
          color: var(--primary);
          background-color: var(--primary-bg-light);
        }
        .dropdown-item-btn.active {
          color: var(--primary);
          background-color: var(--primary-bg-light);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
