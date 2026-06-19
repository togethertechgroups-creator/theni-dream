'use client';

import { useState, useEffect } from 'react';
import { Eye, X, Lock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { mockStore } from '@/utils/mockStore';
import { getServiceCategories } from '@/utils/servicesData';
import { useResolvedImage } from '@/utils/indexedDBStore';
import { fetchAlbumsSync, fetchPortfolioSync, saveAlbumSync, savePortfolioSync, deleteAlbumSync } from '@/utils/dbSync';
import NextImage from 'next/image';

function SafeImage({ src, alt, className, style, onDragStart, isThumbnail = false }) {
  const resolved = useResolvedImage(src, isThumbnail);

  // Optimize large static JPG/PNG image files to target 15KB compressed size
  if (resolved && resolved.startsWith('/') && !resolved.startsWith('data:')) {
    if (isThumbnail) {
      return (
        <NextImage
          src={resolved}
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
          src={resolved}
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
      src={resolved}
      alt={alt}
      className={className}
      style={style}
      onDragStart={onDragStart}
      loading="lazy"
      decoding="async"
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

export default function PortfolioPage() {
  const [categories, setCategories] = useState([
    "All",
    "Wedding",
    "Reception",
    "Engagement",
    "Pre Wedding",
    "Events"
  ]);

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
      setFilteredItems(galleryItems.filter(item => item.category === activeCategory));
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
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
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

                        <SafeImage
                          src={item.image}
                          alt={item.title}
                          className="portfolio-image"
                          onDragStart={handleDragStart}
                          isThumbnail={true}
                        />

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
                  return activeCategory === "All" || cat.toLowerCase() === activeCategory.toLowerCase();
                }).length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: 'var(--fg-muted)' }}>
                    <p>No album collections found in this category.</p>
                  </div>
                ) : (
                  albums
                    .filter(album => {
                      if (album.albumType === 'client') return false;
                      const cat = album.category || "Wedding";
                      return activeCategory === "All" || cat.toLowerCase() === activeCategory.toLowerCase();
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

              <SafeImage
                src={lightboxImagesList[lightboxActiveIndex].image}
                alt={lightboxImagesList[lightboxActiveIndex].title}
                className="lightbox-img"
                onDragStart={handleDragStart}
              />

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
          transition: all var(--transition-normal);
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
      `}</style>
    </div>
  );
}
