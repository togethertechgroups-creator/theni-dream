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

async function main() {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql: "SELECT * FROM packages" })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

main();
