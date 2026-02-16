#!/usr/bin/env node

/**
 * Background Image Optimization Script
 * 
 * This script optimizes images in the /public/backgrounds folder by:
 * - Resizing to exactly 768×1152px (2:3 portrait aspect ratio)
 * - Converting to optimized JPEG format
 * - Reducing file size to under 300KB
 * - Maintaining good visual quality
 * 
 * Usage: npm run optimize-backgrounds
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const TARGET_WIDTH = 768;
const TARGET_HEIGHT = 1152;
const QUALITY = 85; // JPEG quality (0-100)
const INPUT_DIR = join(__dirname, '../public/backgrounds');
const OUTPUT_DIR = join(__dirname, '../public/backgrounds/optimized');

// Supported input formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tiff', '.bmp'];

async function ensureDirectory(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function getImageFiles(dirPath) {
  try {
    const files = await readdir(dirPath);
    return files.filter(file => 
      SUPPORTED_FORMATS.includes(extname(file).toLowerCase())
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`❌ Directory not found: ${dirPath}`);
      console.log('💡 Please create the backgrounds folder first.');
      return [];
    }
    throw error;
  }
}

async function getFileSize(filePath) {
  const stats = await stat(filePath);
  return stats.size;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function optimizeImage(inputPath, outputPath) {
  const originalSize = await getFileSize(inputPath);
  
  await sharp(inputPath)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: 'cover',
      position: 'center',
    })
    .jpeg({
      quality: QUALITY,
      mozjpeg: true, // Use mozjpeg for better compression
    })
    .toFile(outputPath);
  
  const optimizedSize = await getFileSize(outputPath);
  const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
  
  return {
    originalSize,
    optimizedSize,
    reduction,
  };
}

async function main() {
  console.log('🎨 Background Image Optimizer\n');
  console.log(`📁 Input directory:  ${INPUT_DIR}`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`📐 Target size:      ${TARGET_WIDTH}×${TARGET_HEIGHT}px`);
  console.log(`🎯 JPEG quality:     ${QUALITY}%\n`);

  // Ensure output directory exists
  await ensureDirectory(OUTPUT_DIR);

  // Get all image files
  const imageFiles = await getImageFiles(INPUT_DIR);
  
  if (imageFiles.length === 0) {
    console.log('📭 No images found to optimize.');
    console.log('\n💡 Tips:');
    console.log('   1. Add images to: public/backgrounds/');
    console.log('   2. Supported formats: JPG, PNG, WebP, GIF, TIFF, BMP');
    console.log('   3. Download from: Unsplash, Pexels, or Pixabay\n');
    return;
  }

  console.log(`📸 Found ${imageFiles.length} image(s) to optimize:\n`);

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;

  for (const file of imageFiles) {
    const inputPath = join(INPUT_DIR, file);
    const nameWithoutExt = basename(file, extname(file));
    const outputPath = join(OUTPUT_DIR, `${nameWithoutExt}.jpg`);

    try {
      console.log(`⚙️  Processing: ${file}`);
      
      const result = await optimizeImage(inputPath, outputPath);
      
      totalOriginalSize += result.originalSize;
      totalOptimizedSize += result.optimizedSize;
      successCount++;

      console.log(`   ✅ Optimized: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.optimizedSize)} (${result.reduction}% reduction)`);
      console.log(`   📝 Saved as: ${nameWithoutExt}.jpg\n`);
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}\n`);
    }
  }

  // Summary
  console.log('─'.repeat(60));
  console.log('\n📊 Optimization Summary:\n');
  console.log(`   ✅ Successfully optimized: ${successCount}/${imageFiles.length} images`);
  console.log(`   📏 Total original size:    ${formatFileSize(totalOriginalSize)}`);
  console.log(`   📦 Total optimized size:   ${formatFileSize(totalOptimizedSize)}`);
  console.log(`   💾 Total space saved:      ${formatFileSize(totalOriginalSize - totalOptimizedSize)}`);
  console.log(`   📉 Overall reduction:      ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%\n`);
  
  if (successCount > 0) {
    console.log('✨ Done! Your optimized images are in: public/backgrounds/optimized/\n');
    console.log('📝 Next steps:');
    console.log('   1. Review the optimized images');
    console.log('   2. Move them to public/backgrounds/ (replace if needed)');
    console.log('   3. Update the BACKGROUNDS array in app/page.tsx\n');
  }
}

main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});
