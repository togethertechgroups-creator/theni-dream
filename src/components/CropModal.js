'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * CropModal — Smart image cropping with face detection
 *
 * Props:
 *   file        – File object to crop
 *   aspectRatio – e.g. 16/9, 4/3, 1 (default: free / null)
 *   onSave      – async (croppedBlob: Blob, mobileBlob: Blob) => void
 *   onCancel    – () => void
 *   title       – optional modal title string
 */
export default function CropModal({ file, aspectRatio = null, onSave, onCancel, title = 'Crop Image' }) {
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const cropperRef = useRef(null);

  const [imageSrc, setImageSrc] = useState(null);
  const [cropperReady, setCropperReady] = useState(false);
  const [faceDetecting, setFaceDetecting] = useState(false);
  const [faceMsg, setFaceMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);

  // Load Cropper.js from CDN once
  const loadCropperJS = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Cropper) { resolve(window.Cropper); return; }
      if (!document.getElementById('cropper-css')) {
        const link = document.createElement('link');
        link.id = 'cropper-css';
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css';
        document.head.appendChild(link);
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js';
      script.onload = () => resolve(window.Cropper);
      document.head.appendChild(script);
    });
  }, []);

  // Read file as data URL
  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setImageSrc(e.target.result);
    reader.readAsDataURL(file);
  }, [file]);

  // Update desktop + mobile preview canvases
  const updatePreviews = useCallback((cropper) => {
    if (!cropper) return;
    try {
      const dCanvas = cropper.getCroppedCanvas({ maxWidth: 1200, maxHeight: 900, imageSmoothingQuality: 'high' });
      if (dCanvas) setDesktopPreview(dCanvas.toDataURL('image/jpeg', 0.85));
      const mCanvas = cropper.getCroppedCanvas({ maxWidth: 600, maxHeight: 800, imageSmoothingQuality: 'high' });
      if (mCanvas) setMobilePreview(mCanvas.toDataURL('image/jpeg', 0.80));
    } catch (e) { /* ignore */ }
  }, []);

  // Face detection
  const handleFaceDetect = useCallback(async (cropper) => {
    if (!cropper || !imgRef.current) return;
    setFaceDetecting(true);
    setFaceMsg('Detecting face...');

    try {
      let faceBox = null;
      if ('FaceDetector' in window) {
        try {
          const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
          const faces = await detector.detect(imgRef.current);
          if (faces && faces.length > 0) faceBox = faces[0].boundingBox;
        } catch (e) {
          console.warn('FaceDetector failed:', e);
        }
      }

      const naturalWidth = imgRef.current.naturalWidth;
      const naturalHeight = imgRef.current.naturalHeight;
      const canvasData = cropper.getCanvasData();
      const scaleX = canvasData.width / naturalWidth;
      const scaleY = canvasData.height / naturalHeight;

      let cx, cy, cw, ch;

      if (faceBox) {
        const padX = faceBox.width * 0.6;
        const padY = faceBox.height * 0.8;
        cx = Math.max(0, faceBox.x - padX);
        cy = Math.max(0, faceBox.y - padY);
        cw = Math.min(naturalWidth - cx, faceBox.width + padX * 2);
        ch = Math.min(naturalHeight - cy, faceBox.height + padY * 2 + faceBox.height * 0.3);

        if (aspectRatio) {
          const currentAR = cw / ch;
          if (currentAR > aspectRatio) {
            const newH = cw / aspectRatio;
            cy = Math.max(0, cy - (newH - ch) / 2);
            ch = Math.min(naturalHeight - cy, newH);
          } else {
            const newW = ch * aspectRatio;
            cx = Math.max(0, cx - (newW - cw) / 2);
            cw = Math.min(naturalWidth - cx, newW);
          }
        }
        setFaceMsg('Face detected and centered');
      } else {
        const targetAR = aspectRatio || (naturalWidth / naturalHeight);
        if (naturalWidth / naturalHeight > targetAR) {
          ch = naturalHeight; cw = ch * targetAR;
        } else {
          cw = naturalWidth; ch = cw / targetAR;
        }
        cx = (naturalWidth - cw) / 2;
        cy = (naturalHeight - ch) / 2;
        setFaceMsg('No face detected — smart center crop applied');
      }

      cropper.setCropBoxData({
        left: canvasData.left + cx * scaleX,
        top: canvasData.top + cy * scaleY,
        width: cw * scaleX,
        height: ch * scaleY
      });

    } catch (e) {
      console.error('Face detection error:', e);
      setFaceMsg('Auto-detect failed — manual crop active');
    } finally {
      setFaceDetecting(false);
      updatePreviews(cropper);
    }
  }, [aspectRatio, updatePreviews]);

  // Init Cropper when image src is ready
  useEffect(() => {
    if (!imageSrc || !imgRef.current) return;
    let cropperInstance = null;

    loadCropperJS().then((Cropper) => {
      if (cropperRef.current) { cropperRef.current.destroy(); cropperRef.current = null; }

      cropperInstance = new Cropper(imgRef.current, {
        aspectRatio: aspectRatio || NaN,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.85,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        ready() {
          setCropperReady(true);
          handleFaceDetect(cropperInstance);
        },
        cropend() {
          updatePreviews(cropperInstance);
        },
        zoom() {
          updatePreviews(cropperInstance);
        }
      });
      cropperRef.current = cropperInstance;
    });

    return () => { if (cropperInstance) cropperInstance.destroy(); };
  }, [imageSrc, aspectRatio, handleFaceDetect, updatePreviews, loadCropperJS]);

  // Save final cropped blobs
  const handleSave = async () => {
    if (!cropperRef.current || saving) return;
    setSaving(true);
    try {
      const dCanvas = cropperRef.current.getCroppedCanvas({ maxWidth: 1920, maxHeight: 1440, imageSmoothingQuality: 'high' });
      const mCanvas = cropperRef.current.getCroppedCanvas({ maxWidth: 800, maxHeight: 1067, imageSmoothingQuality: 'high' });
      const toBlob = (canvas, quality) => new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
      const [desktopBlob, mobileBlob] = await Promise.all([toBlob(dCanvas, 0.85), toBlob(mCanvas, 0.80)]);
      await onSave(desktopBlob, mobileBlob);
    } catch (e) {
      console.error('Save crop error:', e);
    } finally {
      setSaving(false);
    }
  };

  const zoomIn = () => cropperRef.current?.zoom(0.1);
  const zoomOut = () => cropperRef.current?.zoom(-0.1);
  const resetCrop = () => {
    cropperRef.current?.reset();
    setTimeout(() => handleFaceDetect(cropperRef.current), 200);
  };
  const rotateLeft = () => cropperRef.current?.rotate(-90);
  const rotateRight = () => cropperRef.current?.rotate(90);
  const setAR = (ar) => {
    cropperRef.current?.setAspectRatio(ar);
    setTimeout(() => updatePreviews(cropperRef.current), 100);
  };

  const faceMsgColor = faceMsg.startsWith('Face detected')
    ? { bg: '#dcfce7', color: '#166534', border: '#86efac' }
    : faceMsg.startsWith('No face')
    ? { bg: '#eff6ff', color: '#1e40af', border: '#93c5fd' }
    : { bg: '#fef9c3', color: '#854d0e', border: '#fde047' };

  if (!file) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 99999, backdropFilter: 'blur(4px)', padding: '16px',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '960px',
        maxHeight: '92vh', overflow: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#1a1a1a' }}>✂️ {title}</h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#888' }}>Smart crop with face detection</p>
          </div>
          <button onClick={onCancel} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '0.9rem', color: '#666', fontWeight: 700 }}>✕</button>
        </div>

        {/* Face detection message */}
        {faceMsg && (
          <div style={{ margin: '12px 24px 0', padding: '10px 16px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 600, border: `1px solid ${faceMsgColor.border}`, background: faceMsgColor.bg, color: faceMsgColor.color, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {faceDetecting && <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'cmSpin 0.6s linear infinite', flexShrink: 0 }} />}
            {faceDetecting ? 'Detecting face...' : faceMsg}
          </div>
        )}

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexWrap: 'wrap' }}>
          {/* Cropper area */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', padding: '16px 12px 12px 24px', minWidth: 0 }}>
            <div style={{ flex: 1, overflow: 'hidden', borderRadius: '12px', background: '#111', maxHeight: '380px' }}>
              {imageSrc && <img ref={imgRef} src={imageSrc} alt="Crop" style={{ maxWidth: '100%', display: 'block' }} />}
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px', alignItems: 'center' }}>
              {[
                { label: '🔍+', action: zoomIn, title: 'Zoom In' },
                { label: '🔍−', action: zoomOut, title: 'Zoom Out' },
                { label: '↺', action: rotateLeft, title: 'Rotate Left' },
                { label: '↻', action: rotateRight, title: 'Rotate Right' },
                { label: '↺ Reset', action: resetCrop, title: 'Reset' },
              ].map((b) => (
                <button key={b.label} onClick={b.action} title={b.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>
                  {b.label}
                </button>
              ))}

              <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Ratio:</span>
              {[
                { label: 'Free', ar: NaN },
                { label: '16:9', ar: 16/9 },
                { label: '4:3', ar: 4/3 },
                { label: '3:4', ar: 3/4 },
                { label: '1:1', ar: 1 },
              ].map((b) => (
                <button key={b.label} onClick={() => setAR(b.ar)} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '6px 10px', fontSize: '0.78rem', cursor: 'pointer' }}>
                  {b.label}
                </button>
              ))}

              <button
                onClick={() => handleFaceDetect(cropperRef.current)}
                disabled={faceDetecting}
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', opacity: faceDetecting ? 0.7 : 1 }}
              >
                {faceDetecting ? 'Detecting...' : '👤 Detect Face'}
              </button>
            </div>
          </div>

          {/* Preview panel */}
          <div style={{ width: '220px', flexShrink: 0, padding: '16px 24px 12px 12px', display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: '1px solid #f0f0f0' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>Live Preview</h3>

            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '10px', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.72rem', fontWeight: 600, color: '#6b7280' }}>🖥 Desktop</p>
              {desktopPreview
                ? <img src={desktopPreview} alt="Desktop preview" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                : <div style={{ width: '100%', height: '100px', background: '#e5e7eb', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>Cropping...</div>
              }
            </div>

            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '10px', border: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.72rem', fontWeight: 600, color: '#6b7280' }}>📱 Mobile</p>
              {mobilePreview
                ? <img src={mobilePreview} alt="Mobile preview" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px' }} />
                : <div style={{ width: '100%', height: '120px', background: '#e5e7eb', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#9ca3af' }}>Cropping...</div>
              }
            </div>

            <div style={{ fontSize: '0.72rem', color: '#9ca3af', lineHeight: 1.6, background: '#f9fafb', borderRadius: '8px', padding: '8px 10px' }}>
              Two versions saved:<br />
              <b>Desktop</b> max 1920px<br />
              <b>Mobile</b> max 800px
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
          <button onClick={onCancel} disabled={saving} style={{ background: '#f3f4f6', border: 'none', borderRadius: '10px', padding: '10px 24px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', color: '#374151' }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !cropperReady}
            style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', borderRadius: '10px', padding: '10px 28px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', color: '#fff', boxShadow: '0 4px 14px rgba(22,163,74,0.35)', opacity: (saving || !cropperReady) ? 0.7 : 1 }}
          >
            {saving ? 'Saving...' : 'Save Cropped Image'}
          </button>
        </div>
      </div>
      <style>{`@keyframes cmSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
