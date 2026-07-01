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
    price: "9,999",
    desc: "Complete coverage of pre-wedding, wedding rituals, and reception. Combines traditional coverage with premium candid photography.",
    image: "/pic/wedding-service.jpg",
    video: "/wedding-bgm.m4a",
    features: ["1 Senior Photographer", "High-Resolution Edited Digital Files", "Luxury Glass/Acrylic Album", "Full Event Coverages"]
  },
  {
    id: "candid",
    name: "Candid Photography",
    price: "25,000",
    desc: "Focuses strictly on natural, unposed expressions, capturing laughter, emotional tears, and quick raw gestures invisibly.",
    image: "/pic/services/candid_v2.png",
    video: "/candid-bgm.m4a",
    features: ["1 Dedicated Candid Artist", "Emotion-first grading style", "Edited digital deliverables", "Timeline consultations"]
  },
  {
    id: "traditional",
    name: "Traditional Photography",
    price: "18,000",
    desc: "Structured stage photography, group portrait shots, and formal coverage focusing on ceremony events and guests.",
    image: "/pic/services/traditional_v2.jpg",
    video: "/traditional-bgm.m4a",
    features: ["1 Senior Traditional Expert", "Complete stage guest archive", "Standard glossy print book", "Full ceremony focus"]
  },
  {
    id: "cinematic",
    name: "Cinematic Video",
    price: "35,000",
    desc: "Stunning filmic video capturing wedding reels, cinematic teasers (2-3 mins), and a full wedding film (15-20 mins) with high-end audio recording.",
    image: "/pic/70235.jpg",
    video: "/cinematic-bgm.m4a",
    features: ["2 Videographers with Gimbal systems", "Custom cinematic color grading", "High-fidelity audio recording", "Instagram teaser reels"]
  },
  {
    id: "drone",
    name: "Drone Coverage",
    price: "15,000",
    desc: "High-definition aerial views, dramatic landscape setups, and bird's-eye footage of wedding entryways and outdoor events.",
    image: "/pic/70181.jpg",
    video: "/drone-bgm.m4a",
    features: ["1 Licensed Drone Pilot", "4K Ultra-HD footage", "Aerial group layouts", "Stunning venue panorama shots"]
  },
  {
    id: "pre-wedding",
    name: "Pre Wedding Shoot",
    price: "20,000",
    desc: "Romantic, conceptual photoshoots at premium locations. Ideal for save-the-date cards, visual invitations, and banner images.",
    image: "/pic/services/pre-wedding_v2.png",
    video: "/pre-wedding-bgm.m4a",
    features: ["Half-day outdoor session", "2 Costume changes supported", "30 Fine-art edited frames", "Digital Invitation slide design"]
  },
  {
    id: "post-wedding",
    name: "Post Wedding Shoot",
    price: "15,000",
    desc: "Beautiful, romantic couple photoshoot after the wedding ceremony at scenic outdoor locations.",
    image: "/pic/services/post-wedding_v2.png",
    features: ["2 Costume changes supported", "30 Fine-art edited frames", "Scenic outdoor location", "Digital download link"]
  },
  {
    id: "maternity",
    name: "Maternity Shoot",
    price: "15,000",
    desc: "A warm, gentle photoshoot capturing the joy of motherhood in a comfortable indoor studio or a beautiful outdoor setting.",
    image: "/maternity-vinoth/dpg_vinoth_maternity_17.jpg",
    features: ["Comfortable, slow-paced session", "Outfit styling consultation", "20 Retouched portraits", "Indoor/outdoor choice"]
  },
  {
    id: "baby",
    name: "Baby Shoot",
    price: "12,000",
    desc: "Fun, adorable, and safe toddler portraiture. We use cute props, thematic backdrops, and creative lighting tailored for kids.",
    image: "/pic/services/baby_v3.png",
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
  },
  {
    id: "dpg_vinoth_maternity",
    eventCode: "VINOTH01",
    clientName: "Vinoth Family",
    mobile: "9876543215",
    eventName: "Vinoth 5 Month Maternity Shoot",
    eventDate: "June 20, 2026",
    location: "Theni",
    category: "Maternity",
    photos: [
      { id: 17, title: "Vinoth Maternity - 17", url: "/maternity-vinoth/dpg_vinoth_maternity_17.jpg" },
      { id: 1, title: "Vinoth Maternity - 01", url: "/maternity-vinoth/dpg_vinoth_maternity_01.jpg" },
      { id: 2, title: "Vinoth Maternity - 02", url: "/maternity-vinoth/dpg_vinoth_maternity_02.jpg" },
      { id: 3, title: "Vinoth Maternity - 03", url: "/maternity-vinoth/dpg_vinoth_maternity_03.jpg" },
      { id: 4, title: "Vinoth Maternity - 04", url: "/maternity-vinoth/dpg_vinoth_maternity_04.jpg" },
      { id: 5, title: "Vinoth Maternity - 05", url: "/maternity-vinoth/dpg_vinoth_maternity_05.jpg" },
      { id: 6, title: "Vinoth Maternity - 06", url: "/maternity-vinoth/dpg_vinoth_maternity_06.jpg" },
      { id: 7, title: "Vinoth Maternity - 07", url: "/maternity-vinoth/dpg_vinoth_maternity_07.jpg" },
      { id: 8, title: "Vinoth Maternity - 08", url: "/maternity-vinoth/dpg_vinoth_maternity_08.jpg" },
      { id: 9, title: "Vinoth Maternity - 09", url: "/maternity-vinoth/dpg_vinoth_maternity_09.jpg" },
      { id: 10, title: "Vinoth Maternity - 10", url: "/maternity-vinoth/dpg_vinoth_maternity_10.jpg" },
      { id: 11, title: "Vinoth Maternity - 11", url: "/maternity-vinoth/dpg_vinoth_maternity_11.jpg" },
      { id: 12, title: "Vinoth Maternity - 12", url: "/maternity-vinoth/dpg_vinoth_maternity_12.jpg" },
      { id: 13, title: "Vinoth Maternity - 13", url: "/maternity-vinoth/dpg_vinoth_maternity_13.jpg" },
      { id: 14, title: "Vinoth Maternity - 14", url: "/maternity-vinoth/dpg_vinoth_maternity_14.jpg" },
      { id: 15, title: "Vinoth Maternity - 15", url: "/maternity-vinoth/dpg_vinoth_maternity_15.jpg" },
      { id: 16, title: "Vinoth Maternity - 16", url: "/maternity-vinoth/dpg_vinoth_maternity_16.jpg" },
      { id: 18, title: "Vinoth Maternity - 18", url: "/maternity-vinoth/dpg_vinoth_maternity_18.jpg" },
      { id: 19, title: "Vinoth Maternity - 19", url: "/maternity-vinoth/dpg_vinoth_maternity_19.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_madhan_son",
    eventCode: "MADHAN01",
    clientName: "Madhan & Family",
    mobile: "9876543216",
    eventName: "Madhan Son Baby Shoot",
    eventDate: "June 21, 2026",
    location: "Theni",
    category: "Baby Photography",
    photos: [
      { id: 1, title: "Madhan Son Baby - 01", url: "/baby-madhan/dpg_madhan_son_01.jpg" },
      { id: 2, title: "Madhan Son Baby - 02", url: "/baby-madhan/dpg_madhan_son_02.jpg" },
      { id: 3, title: "Madhan Son Baby - 03", url: "/baby-madhan/dpg_madhan_son_03.jpg" },
      { id: 4, title: "Madhan Son Baby - 04", url: "/baby-madhan/dpg_madhan_son_04.jpg" },
      { id: 5, title: "Madhan Son Baby - 05", url: "/baby-madhan/dpg_madhan_son_05.jpg" },
      { id: 6, title: "Madhan Son Baby - 06", url: "/baby-madhan/dpg_madhan_son_06.jpg" },
      { id: 7, title: "Madhan Son Baby - 07", url: "/baby-madhan/dpg_madhan_son_07.jpg" },
      { id: 8, title: "Madhan Son Baby - 08", url: "/baby-madhan/dpg_madhan_son_08.jpg" },
      { id: 9, title: "Madhan Son Baby - 09", url: "/baby-madhan/dpg_madhan_son_09.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_manoj_karthika",
    eventCode: "MANOJ01",
    clientName: "Manoj & Karthika",
    mobile: "9876543217",
    eventName: "Manoj & Karthika Wedding Ceremony",
    eventDate: "June 21, 2026",
    location: "Theni",
    category: "Wedding",
    photos: [
      { id: 1, title: "Manoj & Karthika - 01", url: "/wedding-manoj-karthika/dpg_manoj_karthika_01.jpg" },
      { id: 2, title: "Manoj & Karthika - 02", url: "/wedding-manoj-karthika/dpg_manoj_karthika_02.jpg" },
      { id: 3, title: "Manoj & Karthika - 03", url: "/wedding-manoj-karthika/dpg_manoj_karthika_03.jpg" },
      { id: 4, title: "Manoj & Karthika - 04", url: "/wedding-manoj-karthika/dpg_manoj_karthika_04.jpg" },
      { id: 5, title: "Manoj & Karthika - 05", url: "/wedding-manoj-karthika/dpg_manoj_karthika_05.jpg" },
      { id: 6, title: "Manoj & Karthika - 06", url: "/wedding-manoj-karthika/dpg_manoj_karthika_06.jpg" },
      { id: 7, title: "Manoj & Karthika - 07", url: "/wedding-manoj-karthika/dpg_manoj_karthika_07.jpg" },
      { id: 8, title: "Manoj & Karthika - 08", url: "/wedding-manoj-karthika/dpg_manoj_karthika_08.jpg" },
      { id: 9, title: "Manoj & Karthika - 09", url: "/wedding-manoj-karthika/dpg_manoj_karthika_09.jpg" },
      { id: 10, title: "Manoj & Karthika - 10", url: "/wedding-manoj-karthika/dpg_manoj_karthika_10.jpg" },
      { id: 11, title: "Manoj & Karthika - 11", url: "/wedding-manoj-karthika/dpg_manoj_karthika_11.jpg" },
      { id: 12, title: "Manoj & Karthika - 12", url: "/wedding-manoj-karthika/dpg_manoj_karthika_12.jpg" },
      { id: 13, title: "Manoj & Karthika - 13", url: "/wedding-manoj-karthika/dpg_manoj_karthika_13.jpg" },
      { id: 14, title: "Manoj & Karthika - 14", url: "/wedding-manoj-karthika/dpg_manoj_karthika_14.jpg" },
      { id: 15, title: "Manoj & Karthika - 15", url: "/wedding-manoj-karthika/dpg_manoj_karthika_15.jpg" },
      { id: 16, title: "Manoj & Karthika - 16", url: "/wedding-manoj-karthika/dpg_manoj_karthika_16.jpg" },
      { id: 17, title: "Manoj & Karthika - 17", url: "/wedding-manoj-karthika/dpg_manoj_karthika_17.jpg" },
      { id: 18, title: "Manoj & Karthika - 18", url: "/wedding-manoj-karthika/dpg_manoj_karthika_18.jpg" },
      { id: 19, title: "Manoj & Karthika - 19", url: "/wedding-manoj-karthika/dpg_manoj_karthika_19.jpg" },
      { id: 20, title: "Manoj & Karthika - 20", url: "/wedding-manoj-karthika/dpg_manoj_karthika_20.jpg" },
      { id: 21, title: "Manoj & Karthika - 21", url: "/wedding-manoj-karthika/dpg_manoj_karthika_21.jpg" },
      { id: 22, title: "Manoj & Karthika - 22", url: "/wedding-manoj-karthika/dpg_manoj_karthika_22.jpg" },
      { id: 23, title: "Manoj & Karthika - 23", url: "/wedding-manoj-karthika/dpg_manoj_karthika_23.jpg" },
      { id: 24, title: "Manoj & Karthika - 24", url: "/wedding-manoj-karthika/dpg_manoj_karthika_24.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_mathan_uma",
    eventCode: "MATHAN02",
    clientName: "Mathan & Uma",
    mobile: "9876543218",
    eventName: "Mathan & Uma Pre Wedding Shoot",
    eventDate: "June 23, 2026",
    location: "Theni Dream Palace",
    category: "Pre Wedding",
    photos: [
      { id: 1, title: "Mathan & Uma - 02", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 02.jpg" },
      { id: 2, title: "Mathan & Uma - 05", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 05.jpg" },
      { id: 3, title: "Mathan & Uma - 06", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 06.jpg" },
      { id: 4, title: "Mathan & Uma - 08", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 08.jpg" },
      { id: 5, title: "Mathan & Uma - 09", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 09.jpg" },
      { id: 6, title: "Mathan & Uma - 10", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 10.jpg" },
      { id: 7, title: "Mathan & Uma - 11", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 11.jpg" },
      { id: 8, title: "Mathan & Uma - 12", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 12.jpg" },
      { id: 9, title: "Mathan & Uma - 16", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 16.jpg" },
      { id: 10, title: "Mathan & Uma - 17", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 17.jpg" },
      { id: 11, title: "Mathan & Uma - 19", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 19.jpg" },
      { id: 12, title: "Mathan & Uma - 20", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 20.jpg" },
      { id: 13, title: "Mathan & Uma - 21", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 21.jpg" },
      { id: 14, title: "Mathan & Uma - 22", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 22.jpg" },
      { id: 15, title: "Mathan & Uma - 23", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 23.jpg" },
      { id: 16, title: "Mathan & Uma - 25", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 25.jpg" },
      { id: 17, title: "Mathan & Uma - 28", url: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 28.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_vicky_gowsi_maternity",
    eventCode: "VICKY01",
    clientName: "Vicky & Gowsi",
    mobile: "9876543219",
    eventName: "Vicky & Gowsi Maternity Shoot",
    eventDate: "June 22, 2026",
    location: "Theni",
    category: "Maternity",
    photos: [
      { id: 1, title: "Vicky & Gowsi - 01", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 01.jpg" },
      { id: 2, title: "Vicky & Gowsi - 02", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 02.jpg" },
      { id: 3, title: "Vicky & Gowsi - 04", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 04.jpg" },
      { id: 4, title: "Vicky & Gowsi - 05", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 05.jpg" },
      { id: 5, title: "Vicky & Gowsi - 06", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 06.jpg" },
      { id: 6, title: "Vicky & Gowsi - 09", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 09.jpg" },
      { id: 7, title: "Vicky & Gowsi - 11", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 11.jpg" },
      { id: 8, title: "Vicky & Gowsi - 12", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 12.jpg" },
      { id: 9, title: "Vicky & Gowsi - 13", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 13.jpg" },
      { id: 10, title: "Vicky & Gowsi - 14", url: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 14.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_prasanth_gayathri_maternity",
    eventCode: "PRASANTH01",
    clientName: "Prasanth & Gayathri",
    mobile: "9876543220",
    eventName: "Prasanth & Gayathri Maternity Shoot",
    eventDate: "June 25, 2026",
    location: "Theni",
    category: "Maternity",
    photos: [
      { id: 1, title: "Prasanth & Gayathri - 01", url: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 01.jpg" },
      { id: 2, title: "Prasanth & Gayathri - 02", url: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 02.jpg" },
      { id: 3, title: "Prasanth & Gayathri - 03", url: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 03.jpg" },
      { id: 4, title: "Prasanth & Gayathri - 04", url: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 04.jpg" },
      { id: 5, title: "Prasanth & Gayathri - 05", url: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 05.jpg" },
      { id: 6, title: "Prasanth & Gayathri - 07", url: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 07.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_deepz_beauty_05",
    eventCode: "DEEPZ05",
    clientName: "Deepz (Collection 05)",
    mobile: "9876543221",
    eventName: "Deepz Fashion Model Shoot - Vol 5",
    eventDate: "June 24, 2026",
    location: "Theni Studio",
    category: "Model",
    photos: [
      { id: 1, title: "Deepz Beauty - 05", url: "/dpg-deepz-beauty-05/DPG Deepz Beauty 05.jpg" },
      { id: 2, title: "Deepz Beauty - 06", url: "/dpg-deepz-beauty-05/DPG Deepz Beauty 06.jpg" },
      { id: 3, title: "Deepz Beauty - 07", url: "/dpg-deepz-beauty-05/DPG Deepz Beauty 07.jpg" },
      { id: 4, title: "Deepz Beauty - 08", url: "/dpg-deepz-beauty-05/DPG Deepz Beauty 08.jpg" },
      { id: 5, title: "Deepz Beauty - 09", url: "/dpg-deepz-beauty-05/DPG Deepz Beauty 09.jpg" },
      { id: 6, title: "Deepz Beauty - 10", url: "/dpg-deepz-beauty-05/DPG Deepz Beauty 10.jpg" },
      { id: 7, title: "Deepz Beauty - 11", url: "/dpg-deepz-beauty-05/DPG Deepz Beauty 11.JPG" }
    ],
    videos: []
  },
  {
    id: "dpg_deepz_beauty_01",
    eventCode: "DEEPZ01",
    clientName: "Deepz (Collection 01)",
    mobile: "9876543222",
    eventName: "Deepz Fashion Model Shoot - Vol 1",
    eventDate: "June 26, 2026",
    location: "Theni Studio",
    category: "Model",
    photos: [
      { id: 1, title: "Deepz Beauty - 01", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 01.jpg" },
      { id: 2, title: "Deepz Beauty - 02", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 02.jpg" },
      { id: 3, title: "Deepz Beauty - 04", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 04.jpg" },
      { id: 4, title: "Deepz Beauty - 13", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 13.jpg" },
      { id: 5, title: "Deepz Beauty - 17", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 17.jpg" },
      { id: 6, title: "Deepz Beauty - 18", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 18.jpg" },
      { id: 7, title: "Deepz Beauty - 20", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 20.jpg" },
      { id: 8, title: "Deepz Beauty - 22", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 22.jpg" },
      { id: 9, title: "Deepz Beauty - 23", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 23.jpg" },
      { id: 10, title: "Deepz Beauty - 25", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 25.jpg" },
      { id: 11, title: "Deepz Beauty - 27", url: "/dpg-deepz-beauty-01/DPG Deepz Beauty 27.jpg" }
    ],
    videos: []
  },
  {
    id: "dpg_diya_model_og",
    eventCode: "DIYA01",
    clientName: "Diya",
    mobile: "9876543223",
    eventName: "Diya Glamour Model Portfolio",
    eventDate: "June 27, 2026",
    location: "Theni Outdoor",
    category: "Model",
    photos: [
      { id: 1, title: "Diya Model - 01", url: "/dpg-diya-model-og/DPG Diya Model 01.jpg" },
      { id: 2, title: "Diya Model - 02", url: "/dpg-diya-model-og/DPG Diya Model 02.jpg" },
      { id: 3, title: "Diya Model - 03", url: "/dpg-diya-model-og/DPG Diya Model 03.jpg" },
      { id: 4, title: "Diya Model - 04", url: "/dpg-diya-model-og/DPG Diya Model 04.jpg" },
      { id: 5, title: "Diya Model - 05", url: "/dpg-diya-model-og/DPG Diya Model 05.jpg" },
      { id: 6, title: "Diya Model - 06", url: "/dpg-diya-model-og/DPG Diya Model 06.jpg" },
      { id: 7, title: "Diya Model - 07", url: "/dpg-diya-model-og/DPG Diya Model 07.jpg" }
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
  { id: 25, category: "Pre Wedding", title: "Mani & Sharmi - Lakeside Magic", image: "/dpg-mani-sharmi/DPG Mani Sharmi Pre 03.jpg", albumId: "dpg_mani_sharmi" },
  { id: 26, category: "Maternity", title: "Vinoth Maternity - 01", image: "/maternity-vinoth/dpg_vinoth_maternity_01.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 27, category: "Maternity", title: "Vinoth Maternity - 02", image: "/maternity-vinoth/dpg_vinoth_maternity_02.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 28, category: "Maternity", title: "Vinoth Maternity - 03", image: "/maternity-vinoth/dpg_vinoth_maternity_03.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 29, category: "Maternity", title: "Vinoth Maternity - 04", image: "/maternity-vinoth/dpg_vinoth_maternity_04.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 30, category: "Maternity", title: "Vinoth Maternity - 05", image: "/maternity-vinoth/dpg_vinoth_maternity_05.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 31, category: "Maternity", title: "Vinoth Maternity - 06", image: "/maternity-vinoth/dpg_vinoth_maternity_06.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 32, category: "Maternity", title: "Vinoth Maternity - 07", image: "/maternity-vinoth/dpg_vinoth_maternity_07.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 33, category: "Maternity", title: "Vinoth Maternity - 08", image: "/maternity-vinoth/dpg_vinoth_maternity_08.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 34, category: "Maternity", title: "Vinoth Maternity - 09", image: "/maternity-vinoth/dpg_vinoth_maternity_09.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 35, category: "Maternity", title: "Vinoth Maternity - 10", image: "/maternity-vinoth/dpg_vinoth_maternity_10.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 36, category: "Maternity", title: "Vinoth Maternity - 11", image: "/maternity-vinoth/dpg_vinoth_maternity_11.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 37, category: "Maternity", title: "Vinoth Maternity - 12", image: "/maternity-vinoth/dpg_vinoth_maternity_12.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 38, category: "Maternity", title: "Vinoth Maternity - 13", image: "/maternity-vinoth/dpg_vinoth_maternity_13.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 39, category: "Maternity", title: "Vinoth Maternity - 14", image: "/maternity-vinoth/dpg_vinoth_maternity_14.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 40, category: "Maternity", title: "Vinoth Maternity - 15", image: "/maternity-vinoth/dpg_vinoth_maternity_15.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 41, category: "Maternity", title: "Vinoth Maternity - 16", image: "/maternity-vinoth/dpg_vinoth_maternity_16.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 42, category: "Maternity", title: "Vinoth Maternity - 17", image: "/maternity-vinoth/dpg_vinoth_maternity_17.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 43, category: "Maternity", title: "Vinoth Maternity - 18", image: "/maternity-vinoth/dpg_vinoth_maternity_18.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 44, category: "Maternity", title: "Vinoth Maternity - 19", image: "/maternity-vinoth/dpg_vinoth_maternity_19.jpg", albumId: "dpg_vinoth_maternity" },
  { id: 45, category: "Baby Photography", title: "Madhan Son Baby - 01", image: "/baby-madhan/dpg_madhan_son_01.jpg", albumId: "dpg_madhan_son" },
  { id: 46, category: "Baby Photography", title: "Madhan Son Baby - 02", image: "/baby-madhan/dpg_madhan_son_02.jpg", albumId: "dpg_madhan_son" },
  { id: 47, category: "Baby Photography", title: "Madhan Son Baby - 03", image: "/baby-madhan/dpg_madhan_son_03.jpg", albumId: "dpg_madhan_son" },
  { id: 48, category: "Baby Photography", title: "Madhan Son Baby - 04", image: "/baby-madhan/dpg_madhan_son_04.jpg", albumId: "dpg_madhan_son" },
  { id: 49, category: "Baby Photography", title: "Madhan Son Baby - 05", image: "/baby-madhan/dpg_madhan_son_05.jpg", albumId: "dpg_madhan_son" },
  { id: 50, category: "Baby Photography", title: "Madhan Son Baby - 06", image: "/baby-madhan/dpg_madhan_son_06.jpg", albumId: "dpg_madhan_son" },
  { id: 51, category: "Baby Photography", title: "Madhan Son Baby - 07", image: "/baby-madhan/dpg_madhan_son_07.jpg", albumId: "dpg_madhan_son" },
  { id: 52, category: "Baby Photography", title: "Madhan Son Baby - 08", image: "/baby-madhan/dpg_madhan_son_08.jpg", albumId: "dpg_madhan_son" },
  { id: 53, category: "Baby Photography", title: "Madhan Son Baby - 09", image: "/baby-madhan/dpg_madhan_son_09.jpg", albumId: "dpg_madhan_son" },
  { id: 54, category: "Wedding", title: "Manoj & Karthika - 01", image: "/wedding-manoj-karthika/dpg_manoj_karthika_01.jpg", albumId: "dpg_manoj_karthika" },
  { id: 55, category: "Wedding", title: "Manoj & Karthika - 02", image: "/wedding-manoj-karthika/dpg_manoj_karthika_02.jpg", albumId: "dpg_manoj_karthika" },
  { id: 56, category: "Wedding", title: "Manoj & Karthika - 03", image: "/wedding-manoj-karthika/dpg_manoj_karthika_03.jpg", albumId: "dpg_manoj_karthika" },
  { id: 57, category: "Wedding", title: "Manoj & Karthika - 04", image: "/wedding-manoj-karthika/dpg_manoj_karthika_04.jpg", albumId: "dpg_manoj_karthika" },
  { id: 58, category: "Wedding", title: "Manoj & Karthika - 05", image: "/wedding-manoj-karthika/dpg_manoj_karthika_05.jpg", albumId: "dpg_manoj_karthika" },
  { id: 59, category: "Wedding", title: "Manoj & Karthika - 06", image: "/wedding-manoj-karthika/dpg_manoj_karthika_06.jpg", albumId: "dpg_manoj_karthika" },
  { id: 60, category: "Wedding", title: "Manoj & Karthika - 07", image: "/wedding-manoj-karthika/dpg_manoj_karthika_07.jpg", albumId: "dpg_manoj_karthika" },
  { id: 61, category: "Wedding", title: "Manoj & Karthika - 08", image: "/wedding-manoj-karthika/dpg_manoj_karthika_08.jpg", albumId: "dpg_manoj_karthika" },
  { id: 62, category: "Wedding", title: "Manoj & Karthika - 09", image: "/wedding-manoj-karthika/dpg_manoj_karthika_09.jpg", albumId: "dpg_manoj_karthika" },
  { id: 63, category: "Wedding", title: "Manoj & Karthika - 10", image: "/wedding-manoj-karthika/dpg_manoj_karthika_10.jpg", albumId: "dpg_manoj_karthika" },
  { id: 64, category: "Wedding", title: "Manoj & Karthika - 11", image: "/wedding-manoj-karthika/dpg_manoj_karthika_11.jpg", albumId: "dpg_manoj_karthika" },
  { id: 65, category: "Wedding", title: "Manoj & Karthika - 12", image: "/wedding-manoj-karthika/dpg_manoj_karthika_12.jpg", albumId: "dpg_manoj_karthika" },
  { id: 66, category: "Wedding", title: "Manoj & Karthika - 13", image: "/wedding-manoj-karthika/dpg_manoj_karthika_13.jpg", albumId: "dpg_manoj_karthika" },
  { id: 67, category: "Wedding", title: "Manoj & Karthika - 14", image: "/wedding-manoj-karthika/dpg_manoj_karthika_14.jpg", albumId: "dpg_manoj_karthika" },
  { id: 68, category: "Wedding", title: "Manoj & Karthika - 15", image: "/wedding-manoj-karthika/dpg_manoj_karthika_15.jpg", albumId: "dpg_manoj_karthika" },
  { id: 69, category: "Wedding", title: "Manoj & Karthika - 16", image: "/wedding-manoj-karthika/dpg_manoj_karthika_16.jpg", albumId: "dpg_manoj_karthika" },
  { id: 70, category: "Wedding", title: "Manoj & Karthika - 17", image: "/wedding-manoj-karthika/dpg_manoj_karthika_17.jpg", albumId: "dpg_manoj_karthika" },
  { id: 71, category: "Wedding", title: "Manoj & Karthika - 18", image: "/wedding-manoj-karthika/dpg_manoj_karthika_18.jpg", albumId: "dpg_manoj_karthika" },
  { id: 72, category: "Wedding", title: "Manoj & Karthika - 19", image: "/wedding-manoj-karthika/dpg_manoj_karthika_19.jpg", albumId: "dpg_manoj_karthika" },
  { id: 73, category: "Wedding", title: "Manoj & Karthika - 20", image: "/wedding-manoj-karthika/dpg_manoj_karthika_20.jpg", albumId: "dpg_manoj_karthika" },
  { id: 74, category: "Wedding", title: "Manoj & Karthika - 21", image: "/wedding-manoj-karthika/dpg_manoj_karthika_21.jpg", albumId: "dpg_manoj_karthika" },
  { id: 75, category: "Wedding", title: "Manoj & Karthika - 22", image: "/wedding-manoj-karthika/dpg_manoj_karthika_22.jpg", albumId: "dpg_manoj_karthika" },
  { id: 76, category: "Wedding", title: "Manoj & Karthika - 23", image: "/wedding-manoj-karthika/dpg_manoj_karthika_23.jpg", albumId: "dpg_manoj_karthika" },
  { id: 77, category: "Wedding", title: "Manoj & Karthika - 24", image: "/wedding-manoj-karthika/dpg_manoj_karthika_24.jpg", albumId: "dpg_manoj_karthika" },
  { id: 78, category: "Pre Wedding", title: "Mathan & Uma - Romantic Light", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 02.jpg", albumId: "dpg_mathan_uma" },
  { id: 79, category: "Pre Wedding", title: "Mathan & Uma - Golden Sunset", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 05.jpg", albumId: "dpg_mathan_uma" },
  { id: 80, category: "Pre Wedding", title: "Mathan & Uma - Warm Embrace", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 06.jpg", albumId: "dpg_mathan_uma" },
  { id: 81, category: "Pre Wedding", title: "Mathan & Uma - Pure Happiness", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 08.jpg", albumId: "dpg_mathan_uma" },
  { id: 82, category: "Pre Wedding", title: "Mathan & Uma - Serene Valley", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 09.jpg", albumId: "dpg_mathan_uma" },
  { id: 83, category: "Pre Wedding", title: "Mathan & Uma - Tender Glance", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 10.jpg", albumId: "dpg_mathan_uma" },
  { id: 84, category: "Pre Wedding", title: "Mathan & Uma - Walk of Love", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 11.jpg", albumId: "dpg_mathan_uma" },
  { id: 85, category: "Pre Wedding", title: "Mathan & Uma - Lakeside Charm", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 12.jpg", albumId: "dpg_mathan_uma" },
  { id: 86, category: "Pre Wedding", title: "Mathan & Uma - Joyful Hearts", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 16.jpg", albumId: "dpg_mathan_uma" },
  { id: 87, category: "Pre Wedding", title: "Mathan & Uma - Elegant Poses", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 17.jpg", albumId: "dpg_mathan_uma" },
  { id: 88, category: "Pre Wedding", title: "Mathan & Uma - Together Forever", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 19.jpg", albumId: "dpg_mathan_uma" },
  { id: 89, category: "Pre Wedding", title: "Mathan & Uma - Gentle Smile", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 20.jpg", albumId: "dpg_mathan_uma" },
  { id: 90, category: "Pre Wedding", title: "Mathan & Uma - Sacred Connection", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 21.jpg", albumId: "dpg_mathan_uma" },
  { id: 91, category: "Pre Wedding", title: "Mathan & Uma - Dreamy Portrait", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 22.jpg", albumId: "dpg_mathan_uma" },
  { id: 92, category: "Pre Wedding", title: "Mathan & Uma - Majestic Forest", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 23.jpg", albumId: "dpg_mathan_uma" },
  { id: 93, category: "Pre Wedding", title: "Mathan & Uma - Eternal Vows", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 25.jpg", albumId: "dpg_mathan_uma" },
  { id: 94, category: "Pre Wedding", title: "Mathan & Uma - Scenic View", image: "/dpg-mathan-uma-prewedding/DPG Mathan Uma Prewedding 28.jpg", albumId: "dpg_mathan_uma" },
  { id: 95, category: "Maternity", title: "Vicky & Gowsi - Sweet Expectation", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 01.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 96, category: "Maternity", title: "Vicky & Gowsi - Cherished Walk", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 02.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 97, category: "Maternity", title: "Vicky & Gowsi - Warm Embrace", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 04.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 98, category: "Maternity", title: "Vicky & Gowsi - Loving Hand", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 05.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 99, category: "Maternity", title: "Vicky & Gowsi - Radiant Mother", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 06.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 100, category: "Maternity", title: "Vicky & Gowsi - Golden Portrait", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 09.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 101, category: "Maternity", title: "Vicky & Gowsi - Joyful Anticipation", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 11.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 102, category: "Maternity", title: "Vicky & Gowsi - Together Forever", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 12.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 103, category: "Maternity", title: "Vicky & Gowsi - Tender Moments", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 13.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 104, category: "Maternity", title: "Vicky & Gowsi - Beautiful Grace", image: "/dpg-vicky-gowsi-m2/DPG Vicky Gowsi 14.jpg", albumId: "dpg_vicky_gowsi_maternity" },
  { id: 105, category: "Maternity", title: "Prasanth & Gayathri - Motherhood Joy", image: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 01.jpg", albumId: "dpg_prasanth_gayathri_maternity" },
  { id: 106, category: "Maternity", title: "Prasanth & Gayathri - Elegant Pose", image: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 02.jpg", albumId: "dpg_prasanth_gayathri_maternity" },
  { id: 107, category: "Maternity", title: "Prasanth & Gayathri - Loving Touch", image: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 03.jpg", albumId: "dpg_prasanth_gayathri_maternity" },
  { id: 108, category: "Maternity", title: "Prasanth & Gayathri - Sacred Glow", image: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 04.jpg", albumId: "dpg_prasanth_gayathri_maternity" },
  { id: 109, category: "Maternity", title: "Prasanth & Gayathri - Golden Promise", image: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 05.jpg", albumId: "dpg_prasanth_gayathri_maternity" },
  { id: 110, category: "Maternity", title: "Prasanth & Gayathri - Serene Nature", image: "/dpg-prasanth-gayathri-maternity-05/DPG Prasanth Gayathri Maternity 07.jpg", albumId: "dpg_prasanth_gayathri_maternity" },
  // Deepz 05 Model portfolio items
  { id: 111, category: "Model", title: "Deepz Beauty - Portrait 05", image: "/dpg-deepz-beauty-05/DPG Deepz Beauty 05.jpg", albumId: "dpg_deepz_beauty_05" },
  { id: 112, category: "Model", title: "Deepz Beauty - Glamour 06", image: "/dpg-deepz-beauty-05/DPG Deepz Beauty 06.jpg", albumId: "dpg_deepz_beauty_05" },
  { id: 113, category: "Model", title: "Deepz Beauty - Elegance 07", image: "/dpg-deepz-beauty-05/DPG Deepz Beauty 07.jpg", albumId: "dpg_deepz_beauty_05" },
  { id: 114, category: "Model", title: "Deepz Beauty - Charm 08", image: "/dpg-deepz-beauty-05/DPG Deepz Beauty 08.jpg", albumId: "dpg_deepz_beauty_05" },
  { id: 115, category: "Model", title: "Deepz Beauty - Grace 09", image: "/dpg-deepz-beauty-05/DPG Deepz Beauty 09.jpg", albumId: "dpg_deepz_beauty_05" },
  { id: 116, category: "Model", title: "Deepz Beauty - Close-up 10", image: "/dpg-deepz-beauty-05/DPG Deepz Beauty 10.jpg", albumId: "dpg_deepz_beauty_05" },
  { id: 117, category: "Model", title: "Deepz Beauty - Style 11", image: "/dpg-deepz-beauty-05/DPG Deepz Beauty 11.JPG", albumId: "dpg_deepz_beauty_05" },
  // Deepz 01 Model portfolio items
  { id: 118, category: "Model", title: "Deepz Beauty - Studio 01", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 01.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 119, category: "Model", title: "Deepz Beauty - Posing 02", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 02.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 120, category: "Model", title: "Deepz Beauty - Modern 04", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 04.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 121, category: "Model", title: "Deepz Beauty - Vogue 13", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 13.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 122, category: "Model", title: "Deepz Beauty - Runway 17", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 17.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 123, category: "Model", title: "Deepz Beauty - Chic 18", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 18.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 124, category: "Model", title: "Deepz Beauty - Retro 20", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 20.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 125, category: "Model", title: "Deepz Beauty - Bold 22", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 22.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 126, category: "Model", title: "Deepz Beauty - Urban 23", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 23.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 127, category: "Model", title: "Deepz Beauty - Creative 25", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 25.jpg", albumId: "dpg_deepz_beauty_01" },
  { id: 128, category: "Model", title: "Deepz Beauty - Spark 27", image: "/dpg-deepz-beauty-01/DPG Deepz Beauty 27.jpg", albumId: "dpg_deepz_beauty_01" },
  // Diya Model portfolio items
  { id: 129, category: "Model", title: "Diya Model - Close-up 01", image: "/dpg-diya-model-og/DPG Diya Model 01.jpg", albumId: "dpg_diya_model_og" },
  { id: 130, category: "Model", title: "Diya Model - Fashion 02", image: "/dpg-diya-model-og/DPG Diya Model 02.jpg", albumId: "dpg_diya_model_og" },
  { id: 131, category: "Model", title: "Diya Model - Outdoor 03", image: "/dpg-diya-model-og/DPG Diya Model 03.jpg", albumId: "dpg_diya_model_og" },
  { id: 132, category: "Model", title: "Diya Model - Elegant 04", image: "/dpg-diya-model-og/DPG Diya Model 04.jpg", albumId: "dpg_diya_model_og" },
  { id: 133, category: "Model", title: "Diya Model - Portrait 05", image: "/dpg-diya-model-og/DPG Diya Model 05.jpg", albumId: "dpg_diya_model_og" },
  { id: 134, category: "Model", title: "Diya Model - Vogue 06", image: "/dpg-diya-model-og/DPG Diya Model 06.jpg", albumId: "dpg_diya_model_og" },
  { id: 135, category: "Model", title: "Diya Model - Radiant 07", image: "/dpg-diya-model-og/DPG Diya Model 07.jpg", albumId: "dpg_diya_model_og" }
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
  getPackages: () => {
    const packages = getStoredData('td_packages_v4', DEFAULT_PACKAGES);
    let updated = false;
    packages.forEach(pkg => {
      if (!pkg.id) {
        pkg.id = pkg.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        updated = true;
      }
    });
    if (updated) {
      setStoredData('td_packages_v4', packages);
    }
    return packages;
  },
  setPackages: (packages) => setStoredData('td_packages_v4', packages),

  getServices: () => {
    const stored = getStoredData('td_services_v3', DEFAULT_SERVICES);
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
        // Migrate cached .mp4 URLs to .m4a
        if (s.video && s.video.endsWith('.mp4') && def.video) {
          s.video = def.video;
          updated = true;
        }
        if (s.name !== def.name) {
          s.name = def.name;
          updated = true;
        }
        // Migrate legacy couple images to correct photography images
        if (s.image === "/pic/69498.jpg" || s.image === "/pic/69502.jpg" || s.image === "/pic/69503.jpg" || s.image === "/pic/69504.jpg" || s.image === "/pic/services/baby.png" || s.image === "/pic/services/baby_v2.png" || s.image === "/pic/services/maternity.png" || s.image === "/pic/services/maternity_v2.png" || s.image === "/pic/69496.jpg" || s.image === "/pic/services/post-wedding.png" || s.image === "/pic/70231.jpg" || s.image === "/pic/services/traditional.png" || s.image === "/pic/services/traditional_v2.png" || s.image === "/pic/69493.jpg" || s.image === "/pic/services/candid.png") {
          s.image = def.image;
          updated = true;
        }
      }
      return s;
    });

    if (updated) {
      setStoredData('td_services_v3', merged);
    }
    return merged;
  },
  setServices: (services) => setStoredData('td_services_v3', services),

  // Client Albums
  getAlbums: () => {
    let stored = getStoredData('td_albums_v4', DEFAULT_ALBUMS);
    let updated = false;

    // Explicitly clean up the deleted Sanjay & Kavitha (id: "dream2026") album from storage
    if (stored.some(a => a.id === 'dream2026')) {
      stored = stored.filter(a => a.id !== 'dream2026');
      updated = true;
    }

    // Explicitly update dpg_diya_model_og album in localStorage to remove misplaced photos and ensure exactly 7 photos
    const diyaAlbumIdx = stored.findIndex(a => a.id === 'dpg_diya_model_og');
    if (diyaAlbumIdx !== -1) {
      const diyaAlbum = stored[diyaAlbumIdx];
      if (diyaAlbum.photos && (diyaAlbum.photos.length !== 7 || diyaAlbum.photos.some(p => p.url.includes('048') || p.url.includes('Karthi')))) {
        console.log("Migrating dpg_diya_model_og album in localStorage...");
        const correctDiya = DEFAULT_ALBUMS.find(a => a.id === 'dpg_diya_model_og');
        if (correctDiya) {
          stored[diyaAlbumIdx] = { ...diyaAlbum, photos: correctDiya.photos };
          updated = true;
        }
      }
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
      setStoredData('td_albums_v4', stored);
    }
    return stored;
  },
  setAlbums: (albums) => setStoredData('td_albums_v4', albums),


  // Portfolio
  getPortfolio: () => {
    let stored = getStoredData('td_portfolio_v3', DEFAULT_PORTFOLIO);
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

    // Explicitly remove legacy misplaced Diya portfolio items (like 048, Karthi or items with id > 135)
    if (stored.some(p => p.albumId === 'dpg_diya_model_og' && (p.image.includes('048') || p.image.includes('Karthi') || p.id > 135))) {
      console.log("Migrating dpg_diya_model_og portfolio items in localStorage...");
      stored = stored.filter(p => !(p.albumId === 'dpg_diya_model_og' && (p.image.includes('048') || p.image.includes('Karthi') || p.id > 135)));
      updated = true;
    }

    DEFAULT_PORTFOLIO.forEach(defPort => {
      if (!stored.some(p => p.id === defPort.id)) {
        stored.push(defPort);
        updated = true;
      }
    });
    if (updated) {
      setStoredData('td_portfolio_v3', stored);
    }
    return stored;
  },
  setPortfolio: (portfolio) => setStoredData('td_portfolio_v3', portfolio),

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
  setTeam: (team) => setStoredData('td_team', team),

  // Admin credentials management
  getAdminCredentials: () => getStoredData('td_admin_creds_v1', { email: 'admin@thenidream.com', password: 'admin' }),
  setAdminCredentials: (creds) => setStoredData('td_admin_creds_v1', creds)
};
