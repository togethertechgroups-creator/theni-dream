const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

// Override Jimp's JPEG decoder to allow very large files (up to 2048MB)
const jpegjs = require('jpeg-js');
Jimp.decoders['image/jpeg'] = (data) =>
  jpegjs.decode(data, { maxMemoryUsageInMB: 2048, maxResolutionInMP: 600 });

const TARGET_DIRS = [
  'public/pic',
  'public'        // root-level jpgs like hero-bg.jpg
];

// Extensions to process
const VALID_EXTS = ['.jpg', '.jpeg'];
// Files to skip (non-photo assets)
const SKIP_FILES = new Set([
  'hero-bg.jpg' // kept intentionally small already
]);

async function compressImage(filePath) {
  try {
    const filename = path.basename(filePath);
    if (SKIP_FILES.has(filename)) {
      console.log(`  Skipping (allowlisted): ${filename}`);
      return;
    }

    const stats = fs.statSync(filePath);
    const initialSizeKB = Math.round(stats.size / 1024);

    // Only compress if larger than 200KB
    if (initialSizeKB <= 200) {
      console.log(`  Skipping: ${filename} (already small: ${initialSizeKB}KB)`);
      return;
    }

    console.log(`  Processing: ${filename} (${initialSizeKB}KB)...`);

    const image = await Jimp.read(filePath);

    // Resize to max 1200px dimension while maintaining aspect ratio
    const width = image.getWidth();
    const height = image.getHeight();
    const maxDim = 1200;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        image.resize(maxDim, Jimp.AUTO);
      } else {
        image.resize(Jimp.AUTO, maxDim);
      }
    }

    // Write back with quality 65
    await image.quality(65).writeAsync(filePath);

    const newStats = fs.statSync(filePath);
    const finalSizeKB = Math.round(newStats.size / 1024);
    console.log(`  ✔ ${filename}: ${initialSizeKB}KB → ${finalSizeKB}KB (saved ${Math.round((1 - finalSizeKB/initialSizeKB)*100)}%)`);
  } catch (err) {
    console.error(`  ✗ Error processing ${path.basename(filePath)}:`, err.message);
  }
}

async function run() {
  console.log('Starting image compression for admin/service images...\n');
  for (const dirRelative of TARGET_DIRS) {
    const dirPath = path.join(__dirname, dirRelative);
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory not found, skipping: ${dirPath}`);
      continue;
    }

    console.log(`📁 Scanning: ${dirRelative}`);
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const fullPath = path.join(dirPath, file);
      // Only process files (not subdirectories) with valid extensions
      if (VALID_EXTS.includes(ext) && fs.statSync(fullPath).isFile()) {
        await compressImage(fullPath);
      }
    }
    console.log('');
  }
  console.log('✅ Admin image compression complete!');
}

run();
