const fs = require('fs');
const path = require('path');

const query = (process.argv[2] || '').toLowerCase();
console.log(`Searching all files in src/ for: "${query}"`);

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes(query)) {
        const lines = content.split('\n');
        lines.forEach((line, index) => {
          if (line.toLowerCase().includes(query)) {
            console.log(`${path.relative('v:/Togethertech/THNENI DREAM (GITHUB)/theni-dream', fullPath)} [L${index+1}]: ${line.trim()}`);
          }
        });
      }
    }
  });
}

walk('v:/Togethertech/THNENI DREAM (GITHUB)/theni-dream/src');
