'use client';

import { useState, useEffect } from 'react';

const DB_NAME = 'thenidream_db';
const DB_VERSION = 1;
const STORE_NAME = 'media_store';

const initDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

export const saveMediaBlob = async (id, blob) => {
  const db = await initDB();
  if (!db) return;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ id, blob });
    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
};

export const getMediaBlob = async (id) => {
  const db = await initDB();
  if (!db) return null;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = (e) => resolve(e.target.result?.blob || null);
    request.onerror = (e) => reject(e.target.error);
  });
};

export const deleteMediaBlob = async (id) => {
  const db = await initDB();
  if (!db) return;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = (e) => reject(e.target.error);
  });
};

// Global cache for object URLs to prevent garbage collection issues
const objectUrlCache = {};

export const createThumbnailBlob = (file, maxWidth = 800, maxHeight = 800, quality = 0.75) => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(file);
      return;
    }
    if (!file || !file.type || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    const img = new Image();
    const objUrl = URL.createObjectURL(file);
    img.src = objUrl;
    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          resolve(blob || file);
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      resolve(file);
    };
  });
};

export const resolveImageUrl = async (url, isThumbnail = false) => {
  if (!url) return '/pic/70231.jpg';
  if (url.startsWith('indexeddb://')) {
    let id = url.replace('indexeddb://', '');
    if (isThumbnail) {
      id = `${id}_thumb`;
    }
    if (objectUrlCache[id]) {
      return objectUrlCache[id];
    }
    try {
      let blob = await getMediaBlob(id);
      if (!blob && isThumbnail) {
        // Fallback to original if thumbnail is not found
        const originalId = url.replace('indexeddb://', '');
        blob = await getMediaBlob(originalId);
      }
      if (blob) {
        const objUrl = URL.createObjectURL(blob);
        objectUrlCache[id] = objUrl;
        return objUrl;
      }
    } catch (e) {
      console.error('Failed to load blob from IndexedDB', e);
    }
    return '/pic/70231.jpg';
  }
  return url;
};

export function useResolvedImage(url, isThumbnail = false) {
  const [resolvedUrl, setResolvedUrl] = useState(url);

  useEffect(() => {
    let active = true;
    if (url && url.startsWith('indexeddb://')) {
      resolveImageUrl(url, isThumbnail).then(resolved => {
        if (active) {
          setResolvedUrl(resolved);
        }
      });
    } else {
      setResolvedUrl(url || '/pic/70231.jpg');
    }
    return () => {
      active = false;
    };
  }, [url, isThumbnail]);

  return resolvedUrl;
}

export function useResolvedVideo(url) {
  const [resolvedUrl, setResolvedUrl] = useState('');

  useEffect(() => {
    let active = true;
    if (url && url.startsWith('indexeddb://')) {
      resolveImageUrl(url, false).then(resolved => {
        if (active) {
          if (resolved === '/pic/70231.jpg') {
            setResolvedUrl('');
          } else {
            setResolvedUrl(resolved);
          }
        }
      });
    } else {
      setResolvedUrl(url || '');
    }
    return () => {
      active = false;
    };
  }, [url]);

  return resolvedUrl;
}

