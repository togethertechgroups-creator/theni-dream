// Config file for managing high-quality service image assets on both homepage and services page.
export const SERVICES_IMAGES_CONFIG = {
  maternity: '/pic/services/maternity.png',
  baby: '/pic/services/baby.png',
  birthday: '/pic/services/birthday.png',
  corporate: '/pic/services/corporate.png'
};

/**
 * Resolves the optimized image path for a service based on its ID or Name.
 * Falls back to the original image path if not configured.
 */
export function getOptimizedServiceImage(service, originalImage) {
  if (!service) return originalImage;
  
  const id = (service.id || '').toLowerCase().trim();
  const name = (service.name || '').toLowerCase().trim();

  // 1. Match by exact ID
  if (SERVICES_IMAGES_CONFIG[id]) {
    return SERVICES_IMAGES_CONFIG[id];
  }

  // 2. Match by Name mapping (normalized)
  if (name.includes('maternity shoot') || name.includes('maternity photography') || name === 'maternity') {
    return SERVICES_IMAGES_CONFIG['maternity'];
  }
  if (name.includes('baby shoot') || name.includes('baby photography') || name === 'baby') {
    return SERVICES_IMAGES_CONFIG['baby'];
  }
  if (name.includes('birthday events') || name.includes('birthday shoot') || name === 'birthday') {
    return SERVICES_IMAGES_CONFIG['birthday'];
  }
  if (name.includes('corporate events') || name.includes('corporate shoot') || name === 'corporate') {
    return SERVICES_IMAGES_CONFIG['corporate'];
  }

  return originalImage;
}
