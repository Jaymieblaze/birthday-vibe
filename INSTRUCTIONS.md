# Birthday E-Card Generator

A beautiful web application that allows users to create personalized birthday e-cards with custom photos, names, birth dates, and church information.

## Features

✨ **User-Friendly Interface**: Simple form to input all necessary details
📸 **Photo Upload**: Upload any image to be featured in the card
🎨 **Beautiful Design**: Elegant purple and pink gradient background with gold accents
📅 **Date Formatting**: Automatically formats birth dates (e.g., "25TH JANUARY")
💾 **Download Function**: Export your card as a high-quality PNG image
🎭 **Customizable Titles**: Choose from preset titles like "Esteemed Sister", "Esteemed Brother", etc.

## How to Use

1. **Fill in the Form**:
   - Enter the full name of the birthday person
   - Select their birth date
   - Enter your church name
   - Choose an appropriate title
   - Upload a photo

2. **Preview**: The card updates in real-time as you fill in the information

3. **Download**: Once all fields are complete, click the "Download E-Card" button to save your personalized card

## Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Build for Production
```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **html-to-image** - Card download functionality
- **Lucide React** - Icons

## Customization

You can customize the card design by editing the [BirthdayCard.tsx](app/components/BirthdayCard.tsx) component:

- Change colors in the gradient backgrounds
- Modify text styles and fonts
- Adjust the layout and spacing
- Add or remove decorative elements

## Tips for Best Results

- Use high-quality photos (at least 500x500px)
- Photos with good lighting and clear faces work best
- Square or portrait-oriented photos fit better in the circular frame
- Ensure good contrast between the subject and background

## License

This project is free to use and modify for personal or commercial purposes.
