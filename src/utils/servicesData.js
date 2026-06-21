const DEFAULT_CATEGORIES = [
  {
    id: "wedding-event",
    name: "Wedding Event",
    desc: "Grand cinematic and traditional coverages for your wedding celebrations.",
    price: "40,000",
    image: "/pic/services/wedding.png",
    services: [
      { id: "traditional-photo", name: "Traditional Photography", price: "18,000", image: "/pic/services/traditional_v2.jpg" },
      { id: "traditional-video", name: "Traditional Videography", price: "18,000", image: "/pic/services/cinematic.png" },
      { id: "candid-photo", name: "Candid Photography", price: "25,000", image: "/pic/services/candid_v2.png" },
      { id: "candid-video", name: "Candid Videography", price: "25,000", image: "/pic/services/cinematic.png" },
      { id: "drone", name: "Drone Coverage", price: "15,000", image: "/pic/services/drone.png" },
      { id: "cinematic-videos", name: "Cinematic Videos", price: "35,000", image: "/pic/services/cinematic.png" },
      { id: "360-booth", name: "360 Selfie Booth", price: "10,000", image: "/pic/services/outdoor.png" },
      { id: "instant-booth", name: "Instant Photo Booth", price: "8,000", image: "/pic/services/outdoor.png" },
      { id: "led-wall", name: "LED Wall Setup", price: "12,000", image: "/pic/services/corporate.png" }
    ]
  },
  {
    id: "outdoor",
    name: "Outdoor Shoots",
    desc: "Pre-wedding and post-wedding outdoor couple shoots in scenic spots.",
    price: "15,000",
    image: "/pic/services/outdoor.png",
    services: [
      { id: "pre-wedding", name: "Pre - Wedding Shoots", price: "20,000", image: "/pic/services/pre-wedding_v2.png" },
      { id: "post-wedding", name: "Post - Wedding Shoots", price: "15,000", image: "/pic/services/post-wedding_v2.png" }
    ]
  },
  {
    id: "other-events",
    name: "Other Events",
    desc: "Maternity, Baby, Puberty, Model, and Event coverages for all your milestones.",
    price: "10,000",
    image: "/pic/services/events.png",
    services: [
      { id: "maternity", name: "Maternity Photography", price: "15,000", image: "/maternity-vinoth/dpg_vinoth_maternity_17.jpg" },
      { id: "puberty", name: "Puberty Photography", price: "12,000", image: "/pic/services/puberty.png" },
      { id: "baby", name: "Baby Photography", price: "12,000", image: "/pic/services/baby_v3.png" },
      { id: "ear-piercing", name: "Ear Piercing Photography", price: "10,000", image: "/pic/services/ear-piercing.png" },
      { id: "model-shoot", name: "Model Photography", price: "10,000", image: "/pic/services/model_v2.png" },
      { 
        id: "general-events", 
        name: "Events", 
        price: "12,000", 
        image: "/pic/services/events.png",
        subServices: [
          "Corporate Events",
          "Birthday Events",
          "Fashion Events",
          "All Types of Events"
        ]
      }
    ]
  }
];

export const getServiceCategories = () => {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const data = localStorage.getItem('td_service_categories_v3');
    if (!data) {
      localStorage.setItem('td_service_categories_v3', JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    let parsed = JSON.parse(data);
    let migrated = false;
    parsed = parsed.map(cat => {
      if (cat.services) {
        cat.services = cat.services.map(svc => {
          if (svc.id === 'baby' && (svc.image === '/pic/services/baby.png' || svc.image === '/pic/services/baby_v2.png')) {
            svc.image = '/pic/services/baby_v3.png';
            migrated = true;
          }
          if (svc.id === 'maternity' && (svc.image === '/pic/services/maternity.png' || svc.image === '/pic/services/maternity_v2.png')) {
            svc.image = '/maternity-vinoth/dpg_vinoth_maternity_17.jpg';
            migrated = true;
          }
          if (svc.id === 'model-shoot' && svc.image === '/pic/services/model.png') {
            svc.image = '/pic/services/model_v2.png';
            migrated = true;
          }
          if (svc.id === 'pre-wedding' && svc.image === '/pic/services/pre-wedding.png') {
            svc.image = '/pic/services/pre-wedding_v2.png';
            migrated = true;
          }
          if (svc.id === 'post-wedding' && svc.image === '/pic/services/post-wedding.png') {
            svc.image = '/pic/services/post-wedding_v2.png';
            migrated = true;
          }
          if (svc.id === 'traditional-photo' && (svc.image === '/pic/services/traditional.png' || svc.image === '/pic/services/traditional_v2.png')) {
            svc.image = '/pic/services/traditional_v2.jpg';
            migrated = true;
          }
          if (svc.id === 'candid-photo' && svc.image === '/pic/services/candid.png') {
            svc.image = '/pic/services/candid_v2.png';
            migrated = true;
          }
          return svc;
        });
      }
      return cat;
    });
    if (migrated) {
      localStorage.setItem('td_service_categories_v3', JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return DEFAULT_CATEGORIES;
  }
};

export const setServiceCategories = (categories) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('td_service_categories_v3', JSON.stringify(categories));
  } catch (e) {}
};

// Helper to get a flat list of all selectable events for the contact form dropdown
export const getFlattenedServices = (categories) => {
  return categories.reduce((acc, cat) => {
    cat.services.forEach(svc => {
      acc.push({ id: svc.id, name: svc.name });
      if (svc.subServices) {
        svc.subServices.forEach(sub => {
          acc.push({ id: `${svc.id}-${sub.toLowerCase().replace(/\s+/g, '-')}`, name: sub });
        });
      }
    });
    return acc;
  }, []);
};
