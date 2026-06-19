'use client';

// Helper to check if window/localStorage is available (Client-side only)
const isClient = typeof window !== 'undefined';

// Initial default data
const DEFAULT_PACKAGES = [
  {
    name: "Silver Dream Package",
    price: "40,000",
    type: "Standard",
    desc: "A solid traditional photo & video coverage package covering core deliverables and compliments.",
    features: [
      // 01 PACKAGE (Coverage)
      { text: "01 COVERAGE: Traditional Photography", include: true },
      { text: "01 COVERAGE: Traditional Videography", include: true },
      { text: "01 COVERAGE: Candid Photography ( OR ) Candid Videography", include: false },
      { text: "01 COVERAGE: Candid Photography", include: false },
      { text: "01 COVERAGE: Candid Videography", include: false },
      { text: "01 COVERAGE: 1 Drone Camera", include: false },

      // 02 DELIVERABLES
      { text: "02 DELIVERABLES: One Wedding Album 12 X 36", include: true },
      { text: "02 DELIVERABLES: One Wedding Album 12 X 36 ( 40 to 50 Pages )", include: false },
      { text: "02 DELIVERABLES: One Wedding Album 8 X 24 ( 40 to 50 Pages )", include: false },
      { text: "02 DELIVERABLES: Two Wedding Album 12 X 36 ( 40 to 50 Pages )", include: false },
      { text: "02 DELIVERABLES: Mini Album Photobook", include: false },
      { text: "02 DELIVERABLES: HD Video Output in Pendrive", include: true },
      { text: "02 DELIVERABLES: 3 Min Wedding Highlights Video", include: true },
      { text: "02 DELIVERABLES: 5 Min Wedding Highlights Video", include: false },
      { text: "02 DELIVERABLES: Wedding Teaser and Reels", include: false },
      { text: "02 DELIVERABLES: Traditional Video Edited", include: false },
      { text: "02 DELIVERABLES: Raw Footages Will Given", include: true },

      // 03 COMPLIMENTS
      { text: "03 COMPLIMENTS: Whats App E-Invitation", include: true },
      { text: "03 COMPLIMENTS: Save the Date Video", include: true },
      { text: "03 COMPLIMENTS: Pre or Post Wedding", include: true },
      { text: "03 COMPLIMENTS: One Photo Frame 12 X 18", include: true },
      { text: "03 COMPLIMENTS: Two Photo Frame 12 X 18", include: false },
      { text: "03 COMPLIMENTS: Pendrive", include: true },
      { text: "03 COMPLIMENTS: 2 Pendrive", include: false },
      { text: "03 COMPLIMENTS: Couple Photo Calendar", include: true },
      { text: "03 COMPLIMENTS: Printed Cup 1 Nos", include: false },
      { text: "03 COMPLIMENTS: Printed Cup 2 Nos", include: false },
      { text: "03 COMPLIMENTS: 2 Pillow", include: false }
    ],
    popular: false
  },
  {
    name: "Gold Dream Package",
    price: "59,999",
    type: "Most Popular",
    desc: "Our highly recommended package featuring candid coverage, mini photobooks, and customized compliments.",
    features: [
      // 01 PACKAGE (Coverage)
      { text: "01 COVERAGE: Traditional Photography", include: true },
      { text: "01 COVERAGE: Traditional Videography", include: true },
      { text: "01 COVERAGE: Candid Photography ( OR ) Candid Videography", include: true },
      { text: "01 COVERAGE: Candid Photography", include: false },
      { text: "01 COVERAGE: Candid Videography", include: false },
      { text: "01 COVERAGE: 1 Drone Camera", include: false },

      // 02 DELIVERABLES
      { text: "02 DELIVERABLES: One Wedding Album 12 X 36", include: false },
      { text: "02 DELIVERABLES: One Wedding Album (40-50 Pages)", include: true },
      { text: "02 DELIVERABLES: One Wedding Album 12 X 36 ( 40 to 50 Pages )", include: false },
      { text: "02 DELIVERABLES: One Wedding Album 8 X 24 ( 40 to 50 Pages )", include: false },
      { text: "02 DELIVERABLES: Two Wedding Album 12 X 36 ( 40 to 50 Pages )", include: false },
      { text: "02 DELIVERABLES: Mini Album Photobook", include: true },
      { text: "02 DELIVERABLES: HD Video Output in Pendrive", include: true },
      { text: "02 DELIVERABLES: 3 Min Wedding Highlights Video", include: false },
      { text: "02 DELIVERABLES: 5 Min Wedding Highlights Video", include: true },
      { text: "02 DELIVERABLES: Wedding Teaser and Reels", include: false },
      { text: "02 DELIVERABLES: Traditional Video Edited", include: true },
      { text: "02 DELIVERABLES: Raw Footages Will Given", include: true },

      // 03 COMPLIMENTS
      { text: "03 COMPLIMENTS: Whats App E-Invitation", include: true },
      { text: "03 COMPLIMENTS: Save the Date Video", include: true },
      { text: "03 COMPLIMENTS: Pre or Post Wedding", include: true },
      { text: "03 COMPLIMENTS: One Photo Frame 12 X 18", include: false },
      { text: "03 COMPLIMENTS: Two Photo Frame 12 X 18", include: true },
      { text: "03 COMPLIMENTS: Pendrive", include: true },
      { text: "03 COMPLIMENTS: 2 Pendrive", include: false },
      { text: "03 COMPLIMENTS: Couple Photo Calendar", include: true },
      { text: "03 COMPLIMENTS: Printed Cup 1 Nos", include: true },
      { text: "03 COMPLIMENTS: Printed Cup 2 Nos", include: false },
      { text: "03 COMPLIMENTS: 2 Pillow", include: false }
    ],
    popular: true
  },
  {
    name: "Platinum Dream Package",
    price: "79,999",
    type: "Ultimate Cinematic",
    desc: "The premier all-inclusive visual package with full candid video coverage, custom couple albums, and luxury gift items.",
    features: [
      // 01 PACKAGE (Coverage)
      { text: "01 COVERAGE: Traditional Photography", include: true },
      { text: "01 COVERAGE: Traditional Videography", include: true },
      { text: "01 COVERAGE: Candid Photography ( OR ) Candid Videography", include: false },
      { text: "01 COVERAGE: Candid Photography", include: true },
      { text: "01 COVERAGE: Candid Videography", include: true },
      { text: "01 COVERAGE: 1 Drone Camera", include: false },

      // 02 DELIVERABLES
      { text: "02 DELIVERABLES: One Wedding Album 12 X 36", include: false },
      { text: "02 DELIVERABLES: One Wedding Album 12 X 36 ( 40 to 50 Pages )", include: true },
      { text: "02 DELIVERABLES: One Wedding Album 8 X 24 ( 40 to 50 Pages )", include: true },
      { text: "02 DELIVERABLES: Two Wedding Album 12 X 36 ( 40 to 50 Pages )", include: false },
      { text: "02 DELIVERABLES: Mini Album Photobook", include: true },
      { text: "02 DELIVERABLES: HD Video Output in Pendrive", include: true },
      { text: "02 DELIVERABLES: 3 Min Wedding Highlights Video", include: false },
      { text: "02 DELIVERABLES: 5 Min Wedding Highlights Video", include: true },
      { text: "02 DELIVERABLES: Wedding Teaser and Reels", include: true },
      { text: "02 DELIVERABLES: Traditional Video Edited", include: false },
      { text: "02 DELIVERABLES: Raw Footages Will Given", include: true },

      // 03 COMPLIMENTS
      { text: "03 COMPLIMENTS: Whats App E-Invitation", include: true },
      { text: "03 COMPLIMENTS: Save the Date Video", include: true },
      { text: "03 COMPLIMENTS: Pre or Post Wedding", include: true },
      { text: "03 COMPLIMENTS: One Photo Frame 12 X 18", include: false },
      { text: "03 COMPLIMENTS: Two Photo Frame 12 X 18", include: true },
      { text: "03 COMPLIMENTS: Pendrive", include: true },
      { text: "03 COMPLIMENTS: 2 Pendrive", include: false },
      { text: "03 COMPLIMENTS: Couple Photo Calendar", include: true },
      { text: "03 COMPLIMENTS: Printed Cup 1 Nos", include: false },
      { text: "03 COMPLIMENTS: Printed Cup 2 Nos", include: true },
      { text: "03 COMPLIMENTS: 2 Pillow", include: true }
    ],
    popular: false
  },
  {
    name: "Diamond Dream Package",
    price: "1,19,999",
    type: "All-Inclusive Elite",
    desc: "Our most exclusive top-tier package covering Wedding, Pre-Wedding, Events & Portraits with Drone, full Candid & Cinematic coverage plus the most premium deliverables and compliments.",
    features: [
      // 01 PACKAGE (Coverage)
      { text: "01 COVERAGE: Traditional Photography", include: true },
      { text: "01 COVERAGE: Traditional Videography", include: true },
      { text: "01 COVERAGE: Candid Photography ( OR ) Candid Videography", include: false },
      { text: "01 COVERAGE: 1 Candid Photography", include: true },
      { text: "01 COVERAGE: 1 Candid Videography", include: true },
      { text: "01 COVERAGE: 1 Drone Camera", include: true },

      // 02 DELIVERABLES
      { text: "02 DELIVERABLES: One Wedding Album 12 X 36", include: false },
      { text: "02 DELIVERABLES: One Wedding Album 12 X 36 ( 40 to 50 Pages )", include: false },
      { text: "02 DELIVERABLES: One Wedding Album 8 X 24 ( 40 to 50 Pages )", include: false },
      { text: "02 DELIVERABLES: Two Wedding Album 12 X 36 ( 40 to 50 Pages )", include: true },
      { text: "02 DELIVERABLES: Mini Album Photobook", include: true },
      { text: "02 DELIVERABLES: HD Video Output in Pendrive", include: true },
      { text: "02 DELIVERABLES: 3 Min Wedding Highlights Video", include: false },
      { text: "02 DELIVERABLES: 5 Min Wedding Highlights Video", include: true },
      { text: "02 DELIVERABLES: Wedding Teaser and Reels", include: true },
      { text: "02 DELIVERABLES: Traditional Video Edited", include: false },
      { text: "02 DELIVERABLES: Raw Footages Will Given", include: true },

      // 03 COMPLIMENTS
      { text: "03 COMPLIMENTS: Whats App E-Invitation", include: true },
      { text: "03 COMPLIMENTS: Save the Date Video", include: true },
      { text: "03 COMPLIMENTS: Pre or Post Wedding", include: true },
      { text: "03 COMPLIMENTS: One Photo Frame 12 X 18", include: false },
      { text: "03 COMPLIMENTS: Two Photo Frame 12 X 18", include: true },
      { text: "03 COMPLIMENTS: Pendrive", include: false },
      { text: "03 COMPLIMENTS: 2 Pendrive", include: true },
      { text: "03 COMPLIMENTS: Couple Photo Calendar", include: true },
      { text: "03 COMPLIMENTS: Printed Cup 1 Nos", include: false },
      { text: "03 COMPLIMENTS: Printed Cup 2 Nos", include: true },
      { text: "03 COMPLIMENTS: 2 Pillow", include: true }
    ],
    popular: false
  }
];

const DEFAULT_SERVICES = [
  {
    id: "wedding",
    name: "Wedding Photography",
    price: "45,000",
    desc: "Complete coverage of pre-wedding, wedding rituals, and reception. Combines traditional coverage with premium candid photography.",
    image: "/pic/70678.jpg",
    video: "/wedding-bgm.mp4",
    features: ["2 Senior Photographers", "High-Resolution Edited Digital Files", "Luxury Glass/Acrylic Album", "Full Day Coverage"]
  },
  {
    id: "candid",
    name: "Candid Photography",
    price: "25,000",
    desc: "Focuses strictly on natural, unposed expressions, capturing laughter, emotional tears, and quick raw gestures invisibly.",
    image: "/pic/69493.jpg",
    video: "/candid-bgm.mp4",
    features: ["1 Dedicated Candid Artist", "Emotion-first grading style", "Edited digital deliverables", "Timeline consultations"]
  },
  {
    id: "traditional",
    name: "Traditional Photography",
    price: "18,000",
    desc: "Structured stage photography, group portrait shots, and formal coverage focusing on ceremony events and guests.",
    image: "/pic/70231.jpg",
    video: "/traditional-bgm.mp4",
    features: ["1 Senior Traditional Expert", "Complete stage guest archive", "Standard glossy print book", "Full ceremony focus"]
  },
  {
    id: "cinematic",
    name: "Cinematic Video",
    price: "35,000",
    desc: "Stunning filmic video capturing wedding reels, cinematic teasers (2-3 mins), and a full wedding film (15-20 mins) with high-end audio recording.",
    image: "/pic/70235.jpg",
    video: "/cinematic-bgm.mp4",
    features: ["2 Videographers with Gimbal systems", "Custom cinematic color grading", "High-fidelity audio recording", "Instagram teaser reels"]
  },
  {
    id: "drone",
    name: "Drone Coverage",
    price: "15,000",
    desc: "High-definition aerial views, dramatic landscape setups, and bird's-eye footage of wedding entryways and outdoor events.",
    image: "/pic/70181.jpg",
    video: "/drone-bgm.mp4",
    features: ["1 Licensed Drone Pilot", "4K Ultra-HD footage", "Aerial group layouts", "Stunning venue panorama shots"]
  },
  {
    id: "pre-wedding",
    name: "Pre Wedding Shoot",
    price: "20,000",
    desc: "Romantic, conceptual photoshoots at premium locations. Ideal for save-the-date cards, visual invitations, and banner images.",
    image: "/pic/69496.jpg",
    video: "/pre-wedding-bgm.mp4",
    features: ["Half-day outdoor session", "2 Costume changes supported", "30 Fine-art edited frames", "Digital Invitation slide design"]
  },
  {
    id: "post-wedding",
    name: "Post Wedding Shoot",
    price: "15,000",
    desc: "Beautiful, romantic couple photoshoot after the wedding ceremony at scenic outdoor locations.",
    image: "/pic/services/post-wedding.png",
    features: ["2 Costume changes supported", "30 Fine-art edited frames", "Scenic outdoor location", "Digital download link"]
  },
  {
    id: "maternity",
    name: "Maternity Shoot",
    price: "15,000",
    desc: "A warm, gentle photoshoot capturing the joy of motherhood in a comfortable indoor studio or a beautiful outdoor setting.",
    image: "/pic/services/maternity.png",
    features: ["Comfortable, slow-paced session", "Outfit styling consultation", "20 Retouched portraits", "Indoor/outdoor choice"]
  },
  {
    id: "baby",
    name: "Baby Shoot",
    price: "12,000",
    desc: "Fun, adorable, and safe toddler portraiture. We use cute props, thematic backdrops, and creative lighting tailored for kids.",
    image: "/pic/services/baby.png",
    features: ["Kid-safe props & sanitization", "Thematic setups & costumes", "Soft flashing lights utilized", "Patience-driven timing"]
  },
  {
    id: "birthday",
    name: "Birthday Shoot",
    price: "12,000",
    desc: "Vibrant and energetic coverage of cake-cutting, decor details, games, family arrivals, and candidate children moments.",
    image: "/pic/services/birthday.png",
    features: ["1 Dedicated event shooter", "Fast delivery timeline", "Complete event coverage", "Digital download link"]
  },
  {
    id: "corporate",
    name: "Corporate Events",
    price: "20,000",
    desc: "Formal coverage of keynotes, awards, handshake ceremonies, team headshots, and event panels with clean composition.",
    image: "/pic/services/corporate.png",
    features: ["Professional business attire crew", "Formal stage flash setups", "Press release quality files", "Fast-turnaround options"]
  },
  {
    id: "outdoor",
    name: "Outdoor Photoshoot",
    price: "10,000",
    desc: "Casual, energetic portrait sessions in scenic natural spots (hills, lakes, fields) using sunrise or sunset golden hours.",
    image: "/pic/69610.jpg",
    features: ["2 Hours Golden-hour session", "Casual posing directions", "15 High-end edited portraits", "Digital delivery"]
  }
];

const DEFAULT_ALBUMS = [
  {
    id: "ajith_lavanya",
    eventCode: "AJITH01",
    clientName: "Ajith & Lavanya",
    mobile: "9876543211",
    eventName: "Ajith & Lavanya Wedding Ceremony",
    eventDate: "June 05, 2026",
    location: "Theni Dream Palace",
    category: "Wedding",
    photos: [
      { id: 1, title: "Ajith & Lavanya - Golden Glow", url: "/ajith-lavanya/Ajith Lavanya 01.jpg" },
      { id: 2, title: "Ajith & Lavanya - Happy Steps", url: "/ajith-lavanya/Ajith Lavanya 02.jpg" },
      { id: 3, title: "Ajith & Lavanya - Candid Moments", url: "/ajith-lavanya/Ajith Lavanya 03.jpg" },
      { id: 4, title: "Ajith & Lavanya - Elegant Attire", url: "/ajith-lavanya/Ajith Lavanya 04.jpg" },
      { id: 5, title: "Ajith & Lavanya - Visual Vows", url: "/ajith-lavanya/Ajith Lavanya 05.jpg" },
      { id: 6, title: "Ajith & Lavanya - Eternal Smile", url: "/ajith-lavanya/Ajith Lavanya 06.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_karthi_sasi",
    eventCode: "KARTHI09",
    clientName: "Karthi & Sasi",
    mobile: "9876543212",
    eventName: "Karthi & Sasi Wedding Ceremony",
    eventDate: "June 09, 2026",
    location: "Theni Wedding Hall",
    category: "Wedding",
    photos: [
      { id: 1, title: "Karthi & Sasi - Golden Smile", url: "/dpg-karthi-sasi/DPG Karthi Sasi 01.jpg" },
      { id: 2, title: "Karthi & Sasi - Happy Hearts", url: "/dpg-karthi-sasi/DPG Karthi Sasi 03.jpg" },
      { id: 3, title: "Karthi & Sasi - Divine Vows", url: "/dpg-karthi-sasi/DPG Karthi Sasi 04.jpg" },
      { id: 4, title: "Karthi & Sasi - Together Forever", url: "/dpg-karthi-sasi/DPG Karthi Sasi 05.jpg" },
      { id: 5, title: "Karthi & Sasi - Elegant Attire", url: "/dpg-karthi-sasi/DPG Karthi Sasi 06.jpg" },
      { id: 6, title: "Karthi & Sasi - Cherished Moments", url: "/dpg-karthi-sasi/DPG Karthi Sasi 08.jpg" },
      { id: 7, title: "Karthi & Sasi - Dream Portrait", url: "/dpg-karthi-sasi/DPG Karthi Sasi 09.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_mani_sharmi",
    eventCode: "MANI02",
    clientName: "Mani & Sharmi",
    mobile: "9876543213",
    eventName: "Mani & Sharmi Pre Wedding Shoot",
    eventDate: "June 02, 2026",
    location: "Theni Hills",
    category: "Pre Wedding",
    photos: [
      { id: 1, title: "Mani & Sharmi - Scenic Hills", url: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 01.jpg" },
      { id: 2, title: "Mani & Sharmi - Golden Embrace", url: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 02.jpg" },
      { id: 3, title: "Mani & Sharmi - Warm Smile", url: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 03.jpg" },
      { id: 4, title: "Mani & Sharmi - Joyful Walking", url: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 04.jpg" },
      { id: 5, title: "Mani & Sharmi - Serene Valley", url: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 05.jpg" },
      { id: 6, title: "Mani & Sharmi - Elegant Pose", url: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 06.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_ajith_lavanaya",
    eventCode: "AJITH02",
    clientName: "Ajith & Lavanaya",
    mobile: "9876543214",
    eventName: "Ajith & Lavanaya Grand Wedding",
    eventDate: "June 12, 2026",
    location: "Theni Dream Palace",
    category: "Wedding",
    photos: [
      { id: 1, title: "Ajith & Lavanaya - Bridal Entrance", url: "/ajith-lavanaya/DPG Ajith Lavanaya 01.jpg" },
      { id: 2, title: "Ajith & Lavanaya - Happy Walk", url: "/ajith-lavanaya/DPG Ajith Lavanaya 02.jpg" },
      { id: 3, title: "Ajith & Lavanaya - Golden Moments", url: "/ajith-lavanaya/DPG Ajith Lavanaya 03.jpg" },
      { id: 4, title: "Ajith & Lavanaya - Romantic Embrace", url: "/ajith-lavanaya/DPG Ajith Lavanaya 04.jpg" },
      { id: 5, title: "Ajith & Lavanaya - Sacred Vows", url: "/ajith-lavanaya/DPG Ajith Lavanaya 05.jpg" },
      { id: 6, title: "Ajith & Lavanaya - Joyous Smile", url: "/ajith-lavanaya/DPG Ajith Lavanaya 006.jpg" },
      { id: 7, title: "Ajith & Lavanaya - Elegant Poses", url: "/ajith-lavanaya/DPG Ajith Lavanaya 07.jpg" },
      { id: 8, title: "Ajith & Lavanaya - Cherished Portrait", url: "/ajith-lavanaya/DPG Ajith Lavanaya 08.jpg" },
      { id: 9, title: "Ajith & Lavanaya - Beautiful Vows", url: "/ajith-lavanaya/DPG Ajith Lavanaya 009.jpg" },
      { id: 10, title: "Ajith & Lavanaya - Candid Laughs", url: "/ajith-lavanaya/DPG Ajith Lavanaya 11.jpg" },
      { id: 11, title: "Ajith & Lavanaya - Traditional Walk", url: "/ajith-lavanaya/DPG Ajith Lavanaya 13.jpg" },
      { id: 12, title: "Ajith & Lavanaya - Sweet Stare", url: "/ajith-lavanaya/DPG Ajith Lavanaya 14.jpg" },
      { id: 13, title: "Ajith & Lavanaya - Royal Attire", url: "/ajith-lavanaya/DPG Ajith Lavanaya 15.jpg" },
      { id: 14, title: "Ajith & Lavanaya - Together Forever", url: "/ajith-lavanaya/DPG Ajith Lavanaya 16.jpg" }
    ],
    videos: []
  }
];

const DEFAULT_PORTFOLIO = [
  { id: 1, category: "Wedding", title: "Royal Crimson Vows", image: "/pic/70678.jpg" },
  { id: 2, category: "Reception", title: "Fairytale Ballroom Entry", image: "/pic/70235.jpg" },
  { id: 3, category: "Engagement", title: "Golden Hour Promise", image: "/pic/70242.jpg" },
  { id: 4, category: "Pre Wedding", title: "Mist & Mountain Love", image: "/pic/69493.jpg" },
  { id: 5, category: "Baby Shoot", title: "Little Dreamer Portrait", image: "/pic/69502.jpg" },
  { id: 6, category: "Maternity", title: "Motherhood Radiance", image: "/pic/69498.jpg" },
  { id: 7, category: "Events", title: "Sufi Night Celebration", image: "/pic/69503.jpg" },
  { id: 8, category: "Drone Shots", title: "Palace Canopy View", image: "/pic/70181.jpg" },
  { id: 9, category: "Wedding", title: "Sacred Fire Circular", image: "/pic/70191.jpg" },
  { id: 10, category: "Reception", title: "Neon Stardust Dance", image: "/pic/69504.jpg" },
  { id: 11, category: "Engagement", title: "Bridal Henna Details", image: "/pic/69496.jpg" },
  { id: 12, category: "Drone Shots", title: "Forest Pathways Shoot", image: "/pic/69610.jpg" },
  { id: 13, category: "Wedding", title: "Ajith & Lavanya - Golden Glow", image: "/ajith-lavanya/Ajith Lavanya 01.jpg", albumId: "ajith_lavanya" },
  { id: 14, category: "Wedding", title: "Ajith & Lavanya - Elegant Ceremony", image: "/ajith-lavanya/Ajith Lavanya 04.jpg", albumId: "ajith_lavanya" },
  { id: 15, category: "Pre Wedding", title: "Ajith & Lavanya - Visual Vows", image: "/ajith-lavanya/Ajith Lavanya 05.jpg", albumId: "ajith_lavanya" },
  { id: 16, category: "Wedding", title: "Karthi & Sasi - Golden Smile", image: "/dpg-karthi-sasi/DPG Karthi Sasi 01.jpg", albumId: "dpg_karthi_sasi" },
  { id: 17, category: "Wedding", title: "Karthi & Sasi - Cherished Moments", image: "/dpg-karthi-sasi/DPG Karthi Sasi 08.jpg", albumId: "dpg_karthi_sasi" },
  { id: 18, category: "Pre Wedding", title: "Mani & Sharmi - Scenic Hills", image: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 01.jpg", albumId: "dpg_mani_sharmi" },
  { id: 19, category: "Pre Wedding", title: "Mani & Sharmi - Golden Embrace", image: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 02.jpg", albumId: "dpg_mani_sharmi" },
  { id: 20, category: "Wedding", title: "Ajith & Lavanaya - Grand Wedding", image: "/ajith-lavanaya/DPG Ajith Lavanaya 01.jpg", albumId: "dpg_ajith_lavanaya" },
  { id: 21, category: "Wedding", title: "Ajith & Lavanaya - Sweet Stare", image: "/ajith-lavanaya/DPG Ajith Lavanaya 14.jpg", albumId: "dpg_ajith_lavanaya" },
  { id: 22, category: "Pre Wedding", title: "Ajith & Lavanaya - Mountain Sunset", image: "/ajith-lavanaya/DPG Ajith Lavanaya 05.jpg", albumId: "dpg_ajith_lavanaya" },
  { id: 23, category: "Pre Wedding", title: "Ajith & Lavanya - Forest Walk", image: "/ajith-lavanya/Ajith Lavanya 02.jpg", albumId: "ajith_lavanya" },
  { id: 24, category: "Pre Wedding", title: "Karthi & Sasi - Scenic View", image: "/dpg-karthi-sasi/DPG Karthi Sasi 04.jpg", albumId: "dpg_karthi_sasi" },
  { id: 25, category: "Pre Wedding", title: "Mani & Sharmi - Lakeside Magic", image: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 03.jpg", albumId: "dpg_mani_sharmi" }
];

// Initialize helper
const getStoredData = (key, defaultValue) => {
  if (!isClient) return defaultValue;
  try {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error("Error loading localStorage key: " + key, e);
    return defaultValue;
  }
};

const setStoredData = (key, data) => {
  if (!isClient) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error setting localStorage key: " + key, e);
  }
};

// Main API Export
export const mockStore = {
  // Packages
  getPackages: () => getStoredData('td_packages_v4', DEFAULT_PACKAGES),
  setPackages: (packages) => setStoredData('td_packages_v4', packages),

  getServices: () => {
    const stored = getStoredData('td_services_v2', DEFAULT_SERVICES);
    let updated = false;

    // 1. Add any missing default services (e.g. post-wedding if it doesn't exist in local storage)
    DEFAULT_SERVICES.forEach(defSvc => {
      if (!stored.some(s => s.id === defSvc.id)) {
        stored.push(defSvc);
        updated = true;
      }
    });

    // 2. Merge details like video, or check if name has changed (e.g. Birthday Events -> Birthday Shoot)
    // Also migrate old default couple images to new correct pictures
    const merged = stored.map(s => {
      const def = DEFAULT_SERVICES.find(d => d.id === s.id);
      if (def) {
        if (def.video && !s.video) {
          s.video = def.video;
          updated = true;
        }
        if (s.name !== def.name) {
          s.name = def.name;
          updated = true;
        }
        // Migrate legacy couple images to correct photography images
        if (s.image === "/pic/69498.jpg" || s.image === "/pic/69502.jpg" || s.image === "/pic/69503.jpg" || s.image === "/pic/69504.jpg") {
          s.image = def.image;
          updated = true;
        }
      }
      return s;
    });

    if (updated) {
      setStoredData('td_services_v2', merged);
    }
    return merged;
  },
  setServices: (services) => setStoredData('td_services_v2', services),

  // Client Albums
  getAlbums: () => {
    let stored = getStoredData('td_albums', DEFAULT_ALBUMS);
    let updated = false;

    // Explicitly clean up the deleted Sanjay & Kavitha (id: "dream2026") album from storage
    if (stored.some(a => a.id === 'dream2026')) {
      stored = stored.filter(a => a.id !== 'dream2026');
      updated = true;
    }

    DEFAULT_ALBUMS.forEach(defAlbum => {
      if (!stored.some(a => a.id === defAlbum.id)) {
        stored.push(defAlbum);
        updated = true;
      }
    });
    // Ensure all stored albums have a category field (migrate existing ones)
    stored.forEach(album => {
      if (!album.category) {
        album.category = 'Wedding';
        updated = true;
      }
    });
    if (updated) {
      setStoredData('td_albums', stored);
    }
    return stored;
  },
  setAlbums: (albums) => setStoredData('td_albums', albums),


  // Portfolio
  getPortfolio: () => {
    let stored = getStoredData('td_portfolio', DEFAULT_PORTFOLIO);
    let updated = false;

    // Explicitly update portfolio item 17 to remove duplicate image in localStorage
    stored = stored.map(p => {
      if (p.id === 17 && p.image === "/dpg-karthi-sasi/DPG Karthi Sasi 09.jpg") {
        p.image = "/dpg-karthi-sasi/DPG Karthi Sasi 08.jpg";
        p.title = "Karthi & Sasi - Cherished Moments";
        updated = true;
      }
      return p;
    });

    DEFAULT_PORTFOLIO.forEach(defPort => {
      if (!stored.some(p => p.id === defPort.id)) {
        stored.push(defPort);
        updated = true;
      }
    });
    if (updated) {
      setStoredData('td_portfolio', stored);
    }
    return stored;
  },
  setPortfolio: (portfolio) => setStoredData('td_portfolio', portfolio),

  // Team members
  getTeam: () => {
    const defaultTeam = [
      {
        id: "jp_ganesan",
        name: "J.P. Ganesan",
        role: "Founder & Lead Photographer",
        bio: "6+ years of experience capturing candid luxury weddings. Specialized in visual storytelling and lighting geometry.",
        image: "/pic/pic-5.png"
      },
      {
        id: "priya_dharshini",
        name: "Priya Dharshini",
        role: "Creative Director & Candid Specialist",
        bio: "Passionate about capturing authentic, fleeting emotions and intimate expressions that standard frames miss.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "naveen_kumar",
        name: "Naveen Kumar",
        role: "Lead Cinematographer",
        bio: "Crafts cinematic highlight films and visual compositions with a strong focus on timing and emotion.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: "vignesh",
        name: "Vignesh",
        role: "Drone Specialist & Editor",
        bio: "Licensed aerial cinematographer capturing dramatic bird's-eye views and stunning landscape integrations.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop"
      }
    ];
    
    let stored = getStoredData('td_team', defaultTeam);
    let updated = false;

    stored = stored.map(member => {
      if (member.id === 'jp_ganesan') {
        if (member.bio.includes('12+ years') || member.bio.includes('12 + years') || member.bio.includes('6 + years')) {
          member.bio = defaultTeam[0].bio;
          updated = true;
        }
      }
      return member;
    });

    if (updated) {
      setStoredData('td_team', stored);
    }

    return stored;
  },
  setTeam: (team) => setStoredData('td_team', team)
};
