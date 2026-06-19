const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

// Override Jimp's JPEG decoder to allow large files (up to 2048MB)
const jpegjs = require('jpeg-js');
Jimp.decoders['image/jpeg'] = (data) =>
  jpegjs.decode(data, { maxMemoryUsageInMB: 2048, maxResolutionInMP: 400 });

const TARGET_DIRS = [
  'public/ajith-lavanaya',
  'public/ajith-lavanya',
  'public/dpg-karthi-sasi',
  'public/dpg-mani-sharmi'
];

async function compressImage(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const initialSizeKB = Math.round(stats.size / 1024);

    // Only compress if larger than 200KB
    if (initialSizeKB <= 200) {
      console.log(`Skipping: ${path.basename(filePath)} (already small: ${initialSizeKB}KB)`);
      return;
    }

    console.log(`Processing: ${path.basename(filePath)} (${initialSizeKB}KB)`);

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
    console.log(`  ✔ ${path.basename(filePath)}: ${initialSizeKB}KB → ${finalSizeKB}KB (saved ${Math.round((1 - finalSizeKB/initialSizeKB)*100)}%)`);
  } catch (err) {
    console.error(`  ✗ Error processing ${path.basename(filePath)}:`, err.message);
  }
}

async function run() {
  console.log('Starting image compression...\n');
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
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        await compressImage(path.join(dirPath, file));
      }
    }
    console.log('');
  }
  console.log('✅ Image compression complete!');
}

run();
