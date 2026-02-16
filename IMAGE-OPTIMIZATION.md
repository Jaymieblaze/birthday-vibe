# Image Optimization Guide

## The Problem with Large Images

Downloaded images from Unsplash, Pexels, and similar services are often:
- **Very large file sizes**: 2MB - 8MB per image
- **High resolution**: 4000×6000px or larger
- **Unoptimized**: Not compressed for web use

This causes:
- ❌ Slow page loading (5-10 seconds per image!)
- ❌ Poor user experience
- ❌ Wasted bandwidth
- ❌ Higher hosting costs

## The Solution: Automated Optimization

Our optimization script reduces images to:
- ✅ **Target size**: 768×1152px (perfect for cards)
- ✅ **File size**: Usually 150-300KB (80-95% reduction!)
- ✅ **Format**: Optimized JPEG
- ✅ **Quality**: 85% (great quality, small size)

## How to Use

### Step 1: Download Images

Visit any free image site:
- [Unsplash](https://unsplash.com/s/photos/birthday-celebration)
- [Pexels](https://www.pexels.com/search/birthday/)
- [Pixabay](https://pixabay.com/images/search/birthday/)

Search for: `birthday`, `celebration`, `party`, `confetti`, `balloons`

Download high-quality images (don't worry about size yet!)

### Step 2: Add to Backgrounds Folder

Place downloaded images in:
```
public/backgrounds/
```

The images can be in any format: JPG, PNG, WebP, etc.

### Step 3: Run Optimization

Open terminal and run:
```bash
npm run optimize-backgrounds
```

### Step 4: Review Results

The script will:
1. Show you each image being processed
2. Display before/after file sizes
3. Save optimized images to `public/backgrounds/optimized/`

Example output:
```
⚙️  Processing: birthday-balloons.jpg
   ✅ Optimized: 2.4 MB → 287 KB (88.1% reduction)
   📝 Saved as: birthday-balloons.jpg

📊 Optimization Summary:
   ✅ Successfully optimized: 5/5 images
   📏 Total original size:    12.3 MB
   📦 Total optimized size:   1.2 MB
   💾 Total space saved:      11.1 MB
   📉 Overall reduction:      90.2%
```

### Step 5: Use Optimized Images

1. Move optimized images from `optimized/` folder to `backgrounds/` folder
2. Update `app/page.tsx` with new backgrounds:

```typescript
const BACKGROUNDS: Background[] = [
  // Existing gradients...
  
  // Add your optimized images:
  {
    id: 'bg-balloons',
    name: 'Colorful Balloons',
    type: 'image',
    value: '/backgrounds/birthday-balloons.jpg'
  },
  {
    id: 'bg-confetti',
    name: 'Confetti Party',
    type: 'image',
    value: '/backgrounds/confetti-party.jpg'
  },
  // Add more as needed
];
```

3. Save and the new backgrounds will appear in the dropdown!

## Manual Optimization (Alternative)

If you prefer manual control, use these online tools:

### 1. Squoosh (Recommended)
**Website**: https://squoosh.app/

**Steps**:
1. Upload your image
2. Set resize to: 768 × 1152
3. Choose "MozJPEG" format
4. Set quality to 85%
5. Download

### 2. TinyJPG
**Website**: https://tinyjpg.com/

**Steps**:
1. First resize using another tool to 768×1152
2. Upload to TinyJPG
3. Download compressed version

### 3. iLoveIMG
**Website**: https://www.iloveimg.com/

**Steps**:
1. Use "Resize Image" tool → 768×1152
2. Use "Compress Image" tool → Medium quality
3. Download

## Recommended Image Settings

| Setting | Value | Why |
|---------|-------|-----|
| **Width** | 768px | Matches card width exactly |
| **Height** | 1152px | Matches card height exactly (2:3 ratio) |
| **Format** | JPEG | Best compression for photos |
| **Quality** | 85% | Sweet spot for quality vs file size |
| **Target Size** | < 300KB | Fast loading on all devices |

## Tips for Best Results

### Finding Great Images
- ✅ Search for vertical/portrait orientation
- ✅ Look for images with clear, uncluttered areas
- ✅ Choose bright, celebratory colors
- ✅ Ensure good contrast for text overlay

### Avoiding Common Issues
- ❌ Don't use images with important details at edges (they may be cropped)
- ❌ Avoid very dark images (text won't show well)
- ❌ Skip super busy patterns (distract from card content)
- ❌ Don't use landscape orientation images

## Troubleshooting

### "Images still look large"
- Make sure you moved the files from `/optimized/` folder
- Check file size in file explorer (should be < 500KB)

### "Images look pixelated"
- Increase quality in the script (edit `scripts/optimize-backgrounds.mjs`)
- Change `QUALITY = 85` to `QUALITY = 90`

### "Colors look washed out"
- This can happen with aggressive JPEG compression
- Try quality 90 instead of 85
- Or use the original if file size is acceptable (< 500KB)

### "Script won't run"
- Make sure you're in the project root directory
- Check that Node.js is installed: `node --version`
- Try: `npm install` first to ensure all dependencies are installed

## Performance Impact

### Before Optimization:
- 🐌 5 images × 2MB = 10MB total
- ⏱️ Load time: 10-20 seconds (on average connection)
- 😞 Poor user experience

### After Optimization:
- 🚀 5 images × 250KB = 1.25MB total  
- ⏱️ Load time: 1-2 seconds
- 😊 Excellent user experience!

**That's an 88% reduction in size and 10× faster loading!**

## Questions?

If you have issues with the optimization script or need help:
1. Check the [main README](../README.md)
2. Review the [backgrounds folder README](public/backgrounds/README.md)
3. Ensure sharp is installed: `npm list sharp`

Happy optimizing! 🎉
