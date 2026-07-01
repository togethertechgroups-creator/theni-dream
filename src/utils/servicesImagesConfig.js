// Config file for managing high-quality service image assets on both homepage and services page.
export const SERVICES_IMAGES_CONFIG = {
  maternity: '/maternity-vinoth/dpg_vinoth_maternity_17.jpg',
  baby: '/pic/services/baby_v3.png',
  birthday: '/pic/services/birthday.png',
  corporate: '/pic/services/corporate.png',
  model: '/pic/services/model_v2.png',
  'pre-wedding': '/pic/services/pre-wedding_v2.png',
  'post-wedding': '/pic/services/post-wedding_v2.png',
  'traditional': '/pic/services/traditional_v2.jpg',
  'traditional-photo': '/pic/services/traditional_v2.jpg',
  'candid': '/pic/services/candid_v2.png',
  'candid-photo': '/pic/services/candid_v2.png'
};

/**
 * Resolves the optimized image path for a service based on its ID or Name.
 * Falls back to the original image path if not configured.
 */
export function getOptimizedServiceImage(service, originalImage) {
  if (!originalImage) return originalImage;

  // If the image is customized (e.g. uploaded file in indexeddb, data URI, or custom/external URL), return it directly
  if (
    originalImage.startsWith('indexeddb://') ||
    originalImage.startsWith('data:') ||
    originalImage.includes('user_uploaded') ||
    originalImage.startsWith('http://') ||
    originalImage.startsWith('https://')
  ) {
    return originalImage;
  }

  if (!service) return originalImage;
  
  const id = (service.id || '').toLowerCase().trim();
  const name = (service.name || '').toLowerCase().trim();

  // If the originalImage differs from the default hardcoded path, it has been customized, so return it
  if (id && SERVICES_IMAGES_CONFIG[id] && originalImage !== SERVICES_IMAGES_CONFIG[id]) {
    return originalImage;
  }

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
  if (name.includes('model shoot') || name.includes('model photography') || name === 'model' || name === 'model-shoot') {
    return SERVICES_IMAGES_CONFIG['model'];
  }
  if (name.includes('pre wedding') || name.includes('pre-wedding') || name === 'pre-wedding') {
    return SERVICES_IMAGES_CONFIG['pre-wedding'];
  }
  if (name.includes('post wedding') || name.includes('post-wedding') || name === 'post-wedding') {
    return SERVICES_IMAGES_CONFIG['post-wedding'];
  }
  if (name.includes('traditional photography') || name.includes('traditional photo') || name === 'traditional' || name === 'traditional-photo') {
    return SERVICES_IMAGES_CONFIG['traditional'];
  }
  if (name.includes('candid photography') || name.includes('candid photo') || name === 'candid' || name === 'candid-photo') {
    return SERVICES_IMAGES_CONFIG['candid'];
  }
  
  return originalImage;
}
