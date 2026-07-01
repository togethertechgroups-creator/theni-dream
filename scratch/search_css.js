const fs = require('fs');
const content = fs.readFileSync('v:/Togethertech/THNENI DREAM (GITHUB)/theni-dream/src/app/globals.css', 'utf8');
const lines = content.split('\n');
const query = process.argv[2] || '.hero-section';

console.log(`Searching for: ${query}`);
lines.forEach((line, index) => {
  if (line.toLowerCase().includes(query.toLowerCase())) {
    console.log(`Line ${index + 1}: ${line.trim()}`);
  }
});
