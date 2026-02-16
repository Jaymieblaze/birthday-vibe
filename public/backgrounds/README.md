# Birthday Card Background Images

This folder contains background images for birthday cards.

## Image Specifications

- **Dimensions**: 768px × 1152px (2:3 aspect ratio for portrait)
- **Format**: JPG (optimized for web)
- **File size**: Target under 300KB for optimal loading
- **Style**: Birthday-themed, celebratory, colorful

## 🚀 Quick Start - Optimizing Images

### Automatic Optimization (Recommended)

1. **Download** high-quality images from Unsplash, Pexels, or Pixabay
2. **Place** them in this folder (`public/backgrounds/`)
3. **Run** the optimization script:
   ```bash
   npm run optimize-backgrounds
   ```
4. **Review** optimized images in `public/backgrounds/optimized/`
5. **Move** the optimized images back to this folder (replace originals)

The script will:
- ✅ Resize to exactly 768×1152px
- ✅ Convert to optimized JPEG
- ✅ Reduce file size (typically 70-90% smaller!)
- ✅ Maintain high visual quality

### Manual Optimization

If you prefer to optimize images yourself:

#### Online Tools (No Installation):
- **TinyJPG** (https://tinyjpg.com/) - Drag & drop compression
- **Squoosh** (https://squoosh.app/) - Advanced web app by Google
- **iLoveIMG** (https://www.iloveimg.com/) - Resize + compress

#### Steps:
1. Resize to 768×1152px
2. Convert to JPEG
3. Compress to 85% quality
4. Ensure file size < 300KB

## Naming Convention

Images should be named descriptively:
- `bg-1.jpg` to `bg-20.jpg` (numbered backgrounds)
- Or descriptive names like: `balloons.jpg`, `confetti.jpg`, `celebration.jpg`, etc.

## 📥 Image Sources (Free & High Quality)

- **Unsplash** (https://unsplash.com/s/photos/birthday-celebration)
  - Search: "birthday", "celebration", "party", "confetti", "balloons"
  - High resolution, free to use
  
- **Pexels** (https://www.pexels.com/search/birthday/)
  - Excellent birthday collections
  - Free for commercial use
  
- **Pixabay** (https://pixabay.com/images/search/birthday/)
  - Large variety
  - Public domain

## 💡 Tips for Good Backgrounds

### Visual Quality
- Choose high-resolution images (at least 1024px wide)
- Look for sharp, well-lit photos
- Prefer vibrant, celebratory colors

### Composition
- Images with space at the top for "HAPPY BIRTHDAY" text
- Good contrast areas for white/yellow text
- Avoid overly busy images that might distract from content
- Center focus works well with our card layout

### Theme Ideas
- 🎈 Colorful balloons
- 🎊 Confetti and streamers
- 🎂 Birthday cakes (as background element)
- 🎉 Party decorations
- ✨ Sparkles and glitter
- 🌸 Floral arrangements
- 🎨 Abstract colorful patterns
- 🌅 Sunset/sunrise (warm tones)

## 📊 Performance Guidelines

| Metric | Target | Why |
|--------|--------|-----|
| **File Size** | < 300KB | Fast loading, better UX |
| **Dimensions** | 768×1152px | Exact card size, no scaling |
| **Format** | JPEG | Best compression for photos |
| **Quality** | 85% | Sweet spot: quality vs size |

### File Size Impact:
- 2MB image = 2-5 seconds load time (slow)
- 300KB image = 0.3-0.5 seconds load time (fast!)

## 🔧 Troubleshooting

**Q: Images look blurry after optimization?**  
A: Increase quality setting in the script (line 22: change QUALITY to 90)

**Q: File size still too large?**  
A: Try lower quality (75-80) or use more compression

**Q: Colors look different?**  
A: This is normal with JPEG compression. Adjust quality if needed.

## 📝 Adding Backgrounds to the App

After optimizing, update `app/page.tsx`:

```typescript
const BACKGROUNDS: Background[] = [
  // ... existing gradients ...
  {
    id: 'bg-balloons',
    name: 'Colorful Balloons',
    type: 'image',
    value: '/backgrounds/balloons.jpg'
  },
  // Add more here
];
```

## 🎯 Next Steps

1. ✅ Download birthday-themed images
2. ✅ Run `npm run optimize-backgrounds`
3. ✅ Review optimized images
4. ✅ Move to this folder
5. ✅ Update BACKGROUNDS array in code
6. ✅ Test in the app!
