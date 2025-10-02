const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebP() {
  const imagesDir = path.join(__dirname, 'public', 'images');
  const files = fs.readdirSync(imagesDir);

  for (const file of files) {
    if (file.endsWith('.png') && file !== 'BAM-FullLogo.webp') {
      const inputPath = path.join(imagesDir, file);
      const outputPath = path.join(imagesDir, file.replace('.png', '.webp'));

      try {
        await sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(outputPath);

        console.log(`Converted ${file} to WebP`);
      } catch (error) {
        console.error(`Error converting ${file}:`, error);
      }
    }
  }
}

convertToWebP();