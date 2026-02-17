# Birthday Vibe - Digital Birthday Card Generator

A beautiful, customizable birthday card generator built with Next.js. Create stunning personalized birthday cards with photos, custom text, and various background options.

## Features

- **Photo Management**: Add up to 3 photos with drag-and-drop repositioning, rotation, and scaling
- **Customizable Text**: Personalize with names, church names, titles, and birth dates
- **Background Options**:
  - 5 vibrant gradient color schemes
  - 6 image backgrounds including balloons, glitter, galaxy, and gold wall
  - Special purple gradient overlay for gold_wall background
- **Edit Mode**: Adjust and position photos directly on the card
- **High-Quality Export**: Download as high-resolution PNG (2304x3456px at 3x pixel ratio)
- **iOS Support**: Native Web Share API integration for seamless iPhone/iPad downloads
- **Smart Image Embedding**: Automatic conversion of all assets to data URLs for reliable cross-platform downloads
- **Responsive Design**: Scales beautifully on all screen sizes

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. **Fill in Details**: Enter the person's name, birth date, church name, and title
2. **Upload Photos**: Add 1-3 photos (main photo is required)
3. **Choose Background**: Select from gradient color schemes or image backgrounds
4. **Select Logo**: Choose between church logos or use a custom one
5. **Edit Photos** (optional): Click "Edit Images" to reposition, rotate, or resize photos
6. **Download**: Click "Download E-Card" to save your creation

## iOS & Mobile Support

The application provides optimized download experiences across all devices:

### iOS Devices (iPhone/iPad)
- **Web Share API**: On iOS 12.2+, uses native share functionality
- **Long-press Save**: Fallback option displays the image for manual save
- **Image Embedding**: All assets (logos, backgrounds, photos) are automatically converted to data URLs to ensure they appear correctly in the downloaded file

### Desktop Browsers
- Direct PNG download with automatic filename generation

### Technical Implementation
- All external images are embedded as base64 data URLs before export
- CORS-enabled image loading with `crossOrigin="anonymous"` attribute
- Fonts (Allura, Remixicon) are embedded in the exported image
- 800ms rendering delay ensures all assets are fully loaded before capture

## Background Images

The application includes several background options:

- **Gradients**: Purple-Pink, Blue-Teal, Rose-Gold, Coral-Peach, Lavender-Mint
- **Images**: Balloons, Glitter, Glitter 2, Galaxy, Gold Wall, Sparks

The gold_wall background features a special purple gradient overlay that:
- Maintains solid purple coverage for the top 25%
- Gradually transitions to translucent at 60%
- Adds subtle purple tint at the bottom (85%)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Image Export**: html-to-image
- **Font**: Allura (cursive), Cinzel, Montserrat
- **Icons**: Remix Icon, Lucide React
- **Photo Manipulation**: react-moveable
- **Notifications**: Sonner (toast notifications)

## Project Structure

```
birthday-vibe/
├── app/
│   ├── components/
│   │   └── BirthdayCard.tsx    # Main card component
│   ├── page.tsx                # Home page with form
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── public/
│   ├── backgrounds/            # Background images
│   └── fonts/                  # Custom fonts
└── scripts/
    └── optimize-backgrounds.mjs # Image optimization script
```

## Customization

### Adding New Backgrounds

1. Add image to `/public/backgrounds/`
2. Update `/app/page.tsx` with new background entry:

```typescript
{
  id: 'bg-new',
  name: 'Your Background Name',
  type: 'image',
  value: '/backgrounds/your-image.jpg'
}
```

### Adding Color Schemes

Update the `colorSchemes` object in `BirthdayCard.tsx` with your custom gradient and decoration colors.

## Troubleshooting

### Images not appearing in downloaded card
- Ensure all images are hosted on the same domain or have CORS enabled
- Check browser console for CORS or network errors
- Try using a different background or re-uploading photos

### iOS Share not working
- Ensure you're using iOS 12.2 or later
- If Share API fails, the app will automatically fall back to the long-press save method
- Make sure Safari has permission to access photos (Settings > Safari > Photos)

### Low quality export
- The app exports at 3x pixel ratio (2304x3456px) by default
- Ensure source photos are high resolution for best results
- Wait for the "Preparing your birthday card..." loading message to complete

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

