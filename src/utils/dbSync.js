// Client-side Database and Storage Sync Helper
// Transparently handles Cloudflare Cloud Storage vs Local Storage fallback logic

export async function fetchAlbumsSync() {
  try {
    const res = await fetch('/api/albums');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, albums?: Array }
  } catch (err) {
    console.warn('Fallback to local albums: failed to fetch from D1 API.', err);
    return { configured: false };
  }
}

export async function saveAlbumSync(album) {
  try {
    const res = await fetch('/api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(album)
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, success?: boolean }
  } catch (err) {
    console.error('Failed to save album to D1 API:', err);
    return { configured: false };
  }
}

export async function deleteAlbumSync(id) {
  try {
    const res = await fetch(`/api/albums?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to delete album from D1 API:', err);
    return { configured: false };
  }
}

export async function fetchPortfolioSync() {
  try {
    const res = await fetch('/api/portfolio');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, portfolio?: Array }
  } catch (err) {
    console.warn('Fallback to local portfolio: failed to fetch from D1 API.', err);
    return { configured: false };
  }
}

export async function savePortfolioSync(item) {
  try {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, success?: boolean }
  } catch (err) {
    console.error('Failed to save portfolio item to D1 API:', err);
    return { configured: false };
  }
}

export async function deletePortfolioSync(id) {
  try {
    const res = await fetch(`/api/portfolio?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to delete portfolio item from D1 API:', err);
    return { configured: false };
  }
}

export async function uploadImageSync(file, fileName) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, success?: boolean, url?: string }
  } catch (err) {
    console.error('Failed to upload image to R2 API:', err);
    return { configured: false };
  }
}
