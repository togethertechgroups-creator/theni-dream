const fs = require('fs');

const envPath = "v:/Togethertech/THNENI DREAM (GITHUB)/theni-dream/.env.local";
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value;
  }
});

const accountId = env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = env.CLOUDFLARE_D1_DATABASE_ID;
const apiToken = env.CLOUDFLARE_API_TOKEN;

const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;

// Default Data Arrays
const DEFAULT_PACKAGES = [
  {
    id: "silver-dream-package",
    name: "Silver Dream Package",
    price: "40,000",
    type: "Standard",
    desc: "A solid traditional photo & video coverage package covering core deliverables and compliments.",
    features: [
      { text: "01 COVERAGE: Traditional Photography", include: true },
      { text: "01 COVERAGE: Traditional Videography", include: true },
      { text: "01 COVERAGE: Candid Photography ( OR ) Candid Videography", include: false },
      { text: "01 COVERAGE: Candid Photography", include: false },
      { text: "01 COVERAGE: Candid Videography", include: false },
      { text: "01 COVERAGE: 1 Drone Camera", include: false },
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
    id: "gold-dream-package",
    name: "Gold Dream Package",
    price: "59,999",
    type: "Most Popular",
    desc: "Our highly recommended package featuring candid coverage, mini photobooks, and customized compliments.",
    features: [
      { text: "01 COVERAGE: Traditional Photography", include: true },
      { text: "01 COVERAGE: Traditional Videography", include: true },
      { text: "01 COVERAGE: Candid Photography ( OR ) Candid Videography", include: true },
      { text: "01 COVERAGE: Candid Photography", include: false },
      { text: "01 COVERAGE: Candid Videography", include: false },
      { text: "01 COVERAGE: 1 Drone Camera", include: false },
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
    id: "platinum-dream-package",
    name: "Platinum Dream Package",
    price: "79,999",
    type: "Ultimate Cinematic",
    desc: "The premier all-inclusive visual package with full candid video coverage, custom couple albums, and luxury gift items.",
    features: [
      { text: "01 COVERAGE: Traditional Photography", include: true },
      { text: "01 COVERAGE: Traditional Videography", include: true },
      { text: "01 COVERAGE: Candid Photography ( OR ) Candid Videography", include: false },
      { text: "01 COVERAGE: Candid Photography", include: true },
      { text: "01 COVERAGE: Candid Videography", include: true },
      { text: "01 COVERAGE: 1 Drone Camera", include: false },
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
    id: "diamond-dream-package",
    name: "Diamond Dream Package",
    price: "1,19,999",
    type: "All-Inclusive Elite",
    desc: "Our most exclusive top-tier package covering Wedding, Pre-Wedding, Events & Portraits with Drone, full Candid & Cinematic coverage plus the most premium deliverables and compliments.",
    features: [
      { text: "01 COVERAGE: Traditional Photography", include: true },
      { text: "01 COVERAGE: Traditional Videography", include: true },
      { text: "01 COVERAGE: Candid Photography ( OR ) Candid Videography", include: false },
      { text: "01 COVERAGE: 1 Candid Photography", include: true },
      { text: "01 COVERAGE: 1 Candid Videography", include: true },
      { text: "01 COVERAGE: 1 Drone Camera", include: true },
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

const DEFAULT_TEAM = [
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
    bio: "Passionately capturing authentic, fleeting emotions and intimate expressions that standard frames miss.",
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

async function runQuery(sql, params = []) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  return res.json();
}

async function main() {
  console.log("Seeding packages...");
  // Clear packages first to ensure fresh seed
  await runQuery("DELETE FROM packages");
  for (const pkg of DEFAULT_PACKAGES) {
    const sql = `
      INSERT INTO packages (id, name, price, type, desc, popular, features)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      pkg.id,
      pkg.name,
      pkg.price,
      pkg.type,
      pkg.desc,
      pkg.popular ? 1 : 0,
      JSON.stringify(pkg.features)
    ];
    const res = await runQuery(sql, params);
    console.log(`Package ${pkg.id}:`, res.success ? 'SUCCESS' : JSON.stringify(res));
  }

  console.log("Seeding team members...");
  await runQuery("DELETE FROM team");
  for (const t of DEFAULT_TEAM) {
    const sql = `
      INSERT INTO team (id, name, role, bio, image)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      t.id,
      t.name,
      t.role,
      t.bio,
      t.image
    ];
    const res = await runQuery(sql, params);
    console.log(`Team member ${t.id}:`, res.success ? 'SUCCESS' : JSON.stringify(res));
  }

  console.log("Seeding completed!");
}

main();
