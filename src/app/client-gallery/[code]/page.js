'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAlbumsSync } from '@/utils/dbSync';
import { mockStore } from '@/utils/mockStore';
import { Download, CheckCircle2, ChevronLeft, ChevronRight, X, AlertCircle, Home, Loader2, Archive } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import JSZip from 'jszip';
import { useResolvedImage } from '@/utils/indexedDBStore';

function SafeImage({ src, alt, className, style, onDragStart, isThumbnail = false }) {
  const resolved = useResolvedImage(src, isThumbnail);
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

export default function ClientGalleryPage() {
  const params = useParams();
  const router = useRouter();
  const code = params?.code;

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedPhotos, setSelectedPhotos] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [lightboxActiveIndex, setLightboxActiveIndex] = useState(-1);
  const [lightboxImagesList, setLightboxImagesList] = useState([]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (!code) return;

    const loadData = async () => {
      try {
        const albumSync = await fetchAlbumsSync();
        let allAlbums;
        if (albumSync.configured) {
          allAlbums = albumSync.albums;
          mockStore.setAlbums(allAlbums);
        } else {
          allAlbums = mockStore.getAlbums();
        }

        const matchedAlbum = allAlbums.find(
          a => a.albumType === 'client' && a.eventCode && a.eventCode.toLowerCase() === String(code).toLowerCase()
        );

        if (matchedAlbum) {
          setAlbum(matchedAlbum);
        } else {
          setError('Album not found or invalid access code.');
        }
      } catch (err) {
        setError('Failed to load gallery data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [code]);

  // Lock scroll for lightbox
  useEffect(() => {
    if (lightboxActiveIndex >= 0) {
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
  }, [lightboxActiveIndex]);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedPhotos(new Set());
  };

  const togglePhotoSelection = (photoId) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
  };

  const selectAllPhotos = () => {
    if (selectedPhotos.size === album?.photos?.length) {
      setSelectedPhotos(new Set());
    } else {
      const allIds = album?.photos?.map(p => p.id) || [];
      setSelectedPhotos(new Set(allIds));
    }
  };

  // Download Individual Image
  const downloadImage = async (url, title) => {
    try {
      const proxyUrl = `/api/download?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${title || 'photo'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download image. Please try again.');
    }
  };

  // Batch Download as ZIP
  const downloadZip = async (photosToDownload, zipName) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const zip = new JSZip();
      
      let completed = 0;
      const total = photosToDownload.length;

      const promises = photosToDownload.map(async (photo, idx) => {
        try {
          const proxyUrl = `/api/download?url=${encodeURIComponent(photo.url)}`;
          const response = await fetch(proxyUrl);
          const blob = await response.blob();
          const filename = `${photo.title || `photo_${idx + 1}`}.jpg`;
          zip.file(filename, blob);
          
          completed++;
          setDownloadProgress(Math.round((completed / total) * 100));
        } catch (err) {
          console.error(`Failed to fetch ${photo.url}`, err);
        }
      });

      await Promise.all(promises);

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const blobUrl = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${zipName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      if (isSelectionMode) {
        setIsSelectionMode(false);
        setSelectedPhotos(new Set());
      }
    } catch (err) {
      console.error('ZIP creation failed:', err);
      alert('Failed to create ZIP file. Please try again.');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleDownloadSelected = () => {
    if (selectedPhotos.size === 0) return;
    const photosToDownload = album.photos.filter(p => selectedPhotos.has(p.id));
    downloadZip(photosToDownload, `${album.clientName.replace(/\s+/g, '_')}_selected`);
  };

  const handleDownloadFullAlbum = () => {
    if (!album?.photos || album.photos.length === 0) return;
    downloadZip(album.photos, `${album.clientName.replace(/\s+/g, '_')}_full_album`);
  };

  // Lightbox handlers
  const openLightbox = (index) => {
    if (isSelectionMode) {
      togglePhotoSelection(album.photos[index].id);
      return;
    }
    setLightboxImagesList(album.photos);
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

  // Prevent right-click unless they really want to, but we provide secure download buttons
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin text-primary" size={48} style={{ color: 'var(--primary)' }} />
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <AlertCircle size={64} style={{ color: '#ef4444' }} />
        <h2 className="serif-font" style={{ fontSize: '2rem' }}>{error || 'Album not found'}</h2>
        <Link href="/login" className="btn btn-primary" style={{ padding: '12px 24px', borderRadius: '8px', background: 'var(--primary)', color: '#fff', textDecoration: 'none' }}>
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="client-gallery-wrapper" style={{ padding: '80px 0 40px 0', minHeight: '100vh', background: '#f9fafb' }}>
      <div className="container">
        
        {/* Header Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span className="section-tag">Client Gallery</span>
            <h1 className="mitshuka-title-font" style={{ fontSize: '3rem', margin: '10px 0', letterSpacing: '0.05em' }}>
              {album.clientName}
            </h1>
            <p style={{ color: 'var(--fg-muted)', fontSize: '1.1rem' }}>
              {album.eventName} • {album.eventDate}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            {album.photos && album.photos.length > 0 && (
              <>
                <button
                  onClick={toggleSelectionMode}
                  className={`btn ${isSelectionMode ? 'btn-primary' : 'btn-outline'}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--primary)', background: isSelectionMode ? 'var(--primary)' : 'transparent', color: isSelectionMode ? '#fff' : 'var(--primary)' }}
                >
                  <CheckCircle2 size={18} />
                  {isSelectionMode ? 'Cancel Selection' : 'Select Photos'}
                </button>
                
                <button
                  onClick={handleDownloadFullAlbum}
                  className="btn btn-primary"
                  disabled={isDownloading}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', background: 'linear-gradient(135deg, var(--primary) 0%, #ff8a50 100%)', color: '#fff', border: 'none', boxShadow: '0 4px 12px rgba(255, 122, 0, 0.2)' }}
                >
                  {isDownloading && !isSelectionMode ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Archive size={18} />
                  )}
                  {isDownloading && !isSelectionMode ? `Zipping (${downloadProgress}%)` : 'Download Full Album'}
                </button>
              </>
            )}
            <Link href="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', background: '#e5e7eb', color: '#374151', fontWeight: '500' }}>
              Exit
            </Link>
          </div>
        </div>

        {/* Selection Action Bar */}
        <AnimatePresence>
          {isSelectionMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ background: '#fff', padding: '15px 25px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '90px', zIndex: 100 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{selectedPhotos.size} Photos Selected</span>
                <button onClick={selectAllPhotos} style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
                  {selectedPhotos.size === album.photos?.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              
              <button
                onClick={handleDownloadSelected}
                disabled={selectedPhotos.size === 0 || isDownloading}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '8px', cursor: selectedPhotos.size === 0 ? 'not-allowed' : 'pointer', background: selectedPhotos.size === 0 ? '#d1d5db' : 'var(--primary)', color: '#fff', border: 'none', opacity: selectedPhotos.size === 0 ? 0.7 : 1 }}
              >
                {isDownloading && isSelectionMode ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                {isDownloading && isSelectionMode ? `Zipping (${downloadProgress}%)` : 'Download Selected'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photos Grid */}
        {album.photos && album.photos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {album.photos.map((photo, idx) => {
              const isSelected = selectedPhotos.has(photo.id);
              return (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                  style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '3/2', cursor: isSelectionMode ? 'pointer' : 'zoom-in', boxShadow: isSelected ? '0 0 0 4px var(--primary)' : '0 4px 15px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s' }}
                  onClick={() => openLightbox(idx)}
                  onContextMenu={handleContextMenu}
                >
                  <SafeImage
                    src={photo.url}
                    alt={photo.title || `Photo ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onDragStart={handleDragStart}
                    isThumbnail={true}
                  />
                  
                  {/* Selection Overlay */}
                  {isSelectionMode && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: isSelected ? 'rgba(249, 115, 22, 0.2)' : 'rgba(0,0,0,0.1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '15px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isSelected ? 'var(--primary)' : 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: isSelected ? 'none' : '2px solid #ccc' }}>
                        {isSelected && <CheckCircle2 size={18} />}
                      </div>
                    </div>
                  )}

                  {/* Quick Download Button (only in normal mode) */}
                  {!isSelectionMode && (
                    <div className="photo-hover-actions opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ position: 'absolute', bottom: '15px', right: '15px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadImage(photo.url, photo.title || `photo_${idx+1}`); }}
                        style={{ background: 'rgba(255,255,255,0.9)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                        title="Download Image"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px', color: '#6b7280', background: '#fff', borderRadius: '16px', border: '1px dashed #d1d5db' }}>
            <AlertCircle size={48} style={{ margin: '0 auto 15px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#374151' }}>No Photos Yet</h3>
            <p>Your gallery is currently empty. Please check back later.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxActiveIndex >= 0 && lightboxImagesList[lightboxActiveIndex] && (
          <motion.div
            className="lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            onContextMenu={handleContextMenu}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Close Button */}
            <div className="lightbox-close-btn" onClick={closeLightbox} style={{ position: 'absolute', top: '20px', right: '20px', color: '#fff', cursor: 'pointer', zIndex: 10 }}>
              <X size={32} />
            </div>

            {/* Navigation controls */}
            {lightboxImagesList.length > 1 && (
              <>
                <div onClick={prevLightboxImage} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#fff', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '50%', zIndex: 10 }}>
                  <ChevronLeft size={32} />
                </div>
                <div onClick={nextLightboxImage} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: '#fff', cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '50%', zIndex: 10 }}>
                  <ChevronRight size={32} />
                </div>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              key={lightboxActiveIndex}
              style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
            >
              <SafeImage
                src={lightboxImagesList[lightboxActiveIndex].url}
                alt={lightboxImagesList[lightboxActiveIndex].title || 'Photo'}
                style={{ maxWidth: '100%', maxHeight: '90vh', objectFit: 'contain', userSelect: 'none' }}
                onDragStart={handleDragStart}
                isThumbnail={false}
              />
              
              <div style={{ position: 'absolute', bottom: '-50px', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(lightboxImagesList[lightboxActiveIndex].url, lightboxImagesList[lightboxActiveIndex].title || `photo_${lightboxActiveIndex+1}`);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', transition: 'background 0.2s' }}
                >
                  <Download size={18} />
                  Download High-Res
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
