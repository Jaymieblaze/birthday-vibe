# Birthday Vibe - Digital Birthday Card Generator

A beautiful, customizable birthday card generator built with Next.js. Create stunning personalized birthday cards with photos, custom text, and various background options.

## Features

- **Photo Management**: Add up to 3 photos with drag-and-drop repositioning, rotation, and scaling
- **Customizable Text**: Personalize with names, church names, titles, and birth dates
- **Background Options**:
  - 5 vibrant gradient color schemes
  - 5 image backgrounds including glitter, galaxy, and gold wall
  - Special purple gradient overlay for gold_wall background
- **Edit Mode**: Adjust and position photos directly on the card
- **High-Quality Export**: Download as high-resolution PNG (2304x3456px at 3x pixel ratio)
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

## Background Images

The application includes several background options:

- **Gradients**: Purple-Pink, Blue-Teal, Rose-Gold, Coral-Peach, Lavender-Mint
- **Images**: Glitter, Glitter 2, Galaxy, Gold Wall, and more

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

