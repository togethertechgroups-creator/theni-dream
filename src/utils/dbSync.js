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

export async function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.75) {
  if (typeof window === 'undefined' || !file || !file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Downscale maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export async function uploadImageSync(file, fileName) {
  try {
    // Automatically compress the image to KB size before uploading to Cloudflare R2
    const compressed = await compressImage(file);
    const formData = new FormData();
    formData.append('file', compressed);
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

export async function fetchPackagesSync() {
  try {
    const res = await fetch('/api/packages');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, packages?: Array }
  } catch (err) {
    console.warn('Fallback to local packages: failed to fetch from D1 API.', err);
    return { configured: false };
  }
}

export async function savePackageSync(pkg) {
  try {
    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pkg)
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, success?: boolean }
  } catch (err) {
    console.error('Failed to save package to D1 API:', err);
    return { configured: false };
  }
}

export async function deletePackageSync(id) {
  try {
    const res = await fetch(`/api/packages?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to delete package from D1 API:', err);
    return { configured: false };
  }
}

export async function fetchTeamSync() {
  try {
    const res = await fetch('/api/team');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, team?: Array }
  } catch (err) {
    console.warn('Fallback to local team: failed to fetch from D1 API.', err);
    return { configured: false };
  }
}

export async function saveTeamSync(member) {
  try {
    const res = await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, success?: boolean }
  } catch (err) {
    console.error('Failed to save team member to D1 API:', err);
    return { configured: false };
  }
}

export async function deleteTeamSync(id) {
  try {
    const res = await fetch(`/api/team?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to delete team member from D1 API:', err);
    return { configured: false };
  }
}

export async function fetchServiceCategoriesSync() {
  try {
    const res = await fetch('/api/service-categories');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, categories?: Array }
  } catch (err) {
    console.warn('Fallback to local service categories: failed to fetch from D1 API.', err);
    return { configured: false };
  }
}

export async function saveServiceCategorySync(cat) {
  try {
    const res = await fetch('/api/service-categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cat)
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, success?: boolean }
  } catch (err) {
    console.error('Failed to save service category to D1 API:', err);
    return { configured: false };
  }
}

export async function deleteServiceCategorySync(id) {
  try {
    const res = await fetch(`/api/service-categories?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to delete service category from D1 API:', err);
    return { configured: false };
  }
}

export async function fetchServicesSync() {
  try {
    const res = await fetch('/api/services');
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, services?: Array }
  } catch (err) {
    console.warn('Fallback to local services: failed to fetch from D1 API.', err);
    return { configured: false };
  }
}

export async function saveServiceSync(svc) {
  try {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(svc)
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data; // { configured: boolean, success?: boolean }
  } catch (err) {
    console.error('Failed to save service to D1 API:', err);
    return { configured: false };
  }
}

export async function deleteServiceSync(id) {
  try {
    const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Failed to delete service from D1 API:', err);
    return { configured: false };
  }
}
