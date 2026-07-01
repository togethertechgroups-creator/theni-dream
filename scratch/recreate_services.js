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

const DEFAULT_SERVICES = [
  {
    id: "wedding",
    name: "Wedding Photography",
    price: "9,999",
    desc: "Complete coverage of pre-wedding, wedding rituals, and reception. Combines traditional coverage with premium candid photography.",
    image: "https://pub-813548e1748445df89bb392c16d942ec.r2.dev/user_uploaded_1782890277645_spec_2ckjgder6.jpg",
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
    desc: "Standard pose-based photography focusing on high-quality coverage of the couple, family stages, and group framing.",
    image: "/pic/services/traditional_v2.jpg",
    video: "/traditional-bgm.m4a",
    features: ["1 Traditional Photographer", "Standard color grading", "High-res print-ready digital images", "Full stage coverage"]
  },
  {
    id: "cinematic",
    name: "Cinematic Video",
    price: "35,000",
    desc: "High-end cinematic video capture using high-dynamic-range mirrorless systems, premium audio sync, and drone storytelling.",
    image: "/pic/services/cinematic.png",
    video: "/cinematic-bgm.m4a",
    features: ["1 Cinematic Videographer", "Premium gimbal stabilized shots", "3-5 min highlight cinematic film", "Full event coverage"]
  },
  {
    id: "drone",
    name: "Drone Coverage",
    price: "15,000",
    desc: "Stunning aerial views of your venue and processions. Brings a grand, cinematic perspective to your wedding highlights.",
    image: "/pic/services/drone.png",
    video: "/drone-bgm.m4a",
    features: ["1 Licensed Drone Pilot", "4K Aerial footage", "Integrated into cinematic highlight video", "Safe operational guidelines"]
  },
  {
    id: "pre-wedding",
    name: "Pre-Wedding Shoot",
    price: "20,000",
    desc: "Romantic, tailored couple portraiture sessions at scenic outdoor locations, complete with styling assistance.",
    image: "/pic/services/pre-wedding_v2.png",
    video: "/prewedding-bgm.m4a",
    features: ["1 Creative Photographer", "Scenic location guidance", "Styling and posing direction", "20 edited digital highlights"]
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
  console.log("Dropping old services table...");
  const dropRes = await runQuery("DROP TABLE IF EXISTS services");
  console.log("Drop result:", JSON.stringify(dropRes));

  console.log("Creating new services table with video column...");
  const createRes = await runQuery(`
    CREATE TABLE services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price TEXT,
      desc TEXT,
      image TEXT,
      video TEXT,
      features TEXT
    )
  `);
  console.log("Create result:", JSON.stringify(createRes));

  console.log("Seeding services...");
  for (const svc of DEFAULT_SERVICES) {
    const sql = `
      INSERT OR REPLACE INTO services (id, name, price, desc, image, video, features)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      svc.id,
      svc.name,
      svc.price,
      svc.desc,
      svc.image,
      svc.video,
      JSON.stringify(svc.features)
    ];
    const seedRes = await runQuery(sql, params);
    console.log(`Seeded ${svc.id}:`, seedRes.success ? 'SUCCESS' : JSON.stringify(seedRes));
  }
}

main();
