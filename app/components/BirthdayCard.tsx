'use client';

import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

interface BirthdayCardProps {
  name: string;
  birthDate: string;
  church: string;
  title: string;
  photo: string | null;
  secondPhoto: string | null;
  colorScheme: 'purple-pink' | 'blue-teal' | 'rose-gold' | 'coral-peach' | 'lavender-mint';
}

export default function BirthdayCard({ name, birthDate, church, title, photo, secondPhoto, colorScheme }: BirthdayCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(Math.min(1, containerWidth / 768));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Color scheme configurations
  const colorSchemes = {
    'purple-pink': {
      gradient: 'linear-gradient(135deg, #ff6ec7 0%, #e056fd 20%, #c65df9 40%, #a855f7 60%, #9333ea 80%, #7c3aed 100%)',
      decorations: ['bg-yellow-400', 'bg-pink-400', 'bg-purple-400'],
    },
    'blue-teal': {
      gradient: 'linear-gradient(135deg, #4fd1c5 0%, #38b2ac 20%, #3182ce 40%, #2c5282 60%, #2b6cb0 80%, #1e40af 100%)',
      decorations: ['bg-cyan-400', 'bg-teal-400', 'bg-blue-400'],
    },
    'rose-gold': {
      gradient: 'linear-gradient(135deg, #fecaca 0%, #fca5a5 20%, #f87171 40%, #ef4444 60%, #dc2626 80%, #b91c1c 100%)',
      decorations: ['bg-orange-300', 'bg-rose-400', 'bg-pink-300'],
    },
    'coral-peach': {
      gradient: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 20%, #fb923c 40%, #f97316 60%, #ea580c 80%, #dc2626 100%)',
      decorations: ['bg-yellow-300', 'bg-orange-300', 'bg-red-300'],
    },
    'lavender-mint': {
      gradient: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 20%, #a78bfa 40%, #8b5cf6 60%, #7c3aed 80%, #6d28d9 100%)',
      decorations: ['bg-green-300', 'bg-purple-300', 'bg-indigo-300'],
    },
  };

  const currentScheme = colorSchemes[colorScheme];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    
    // Add ordinal suffix
    const ordinal = (n: number) => {
      const s = ['TH', 'ST', 'ND', 'RD'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    
    return `${ordinal(day)} ${month}`;
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      // Card is already at 768px, just capture it directly
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        width: 768,
        height: 1152,
      });

      const link = document.createElement('a');
      link.download = `birthday-card-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Failed to download card. Please try again.');
    }
  };

  const splitName = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(' ');
    return { firstName, lastName };
  };

  const { firstName, lastName } = splitName(name);

  return (
    <div className="flex flex-col items-center w-full" style={{ gap: '2rem' }}>
      {/* Card Preview Container with Transform Scale */}
      <div ref={containerRef} className="w-full max-w-[768px] overflow-visible flex justify-center">
        <div style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '768px',
          height: `${1152 * scale}px`,
        }}>
          <div 
            ref={cardRef}
            className="relative aspect-2/3 overflow-hidden rounded-lg shadow-2xl"
            style={{
              background: currentScheme.gradient,
              width: '768px',
            }}
          >
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute top-0 left-0 w-32 h-32 ${currentScheme.decorations[0]} rounded-full blur-3xl`}></div>
          <div className={`absolute top-20 right-0 w-40 h-40 ${currentScheme.decorations[1]} rounded-full blur-3xl`}></div>
          <div className={`absolute bottom-20 left-10 w-36 h-36 ${currentScheme.decorations[2]} rounded-full blur-3xl`}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Top Section */}
          <div className="flex justify-between items-start p-6">
            {/* Happy Birthday Text */}
            <div className="relative ml-8 mt-8">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 px-6 py-2 rounded-md shadow-lg">
                <div className="text-yellow-100 font-semibold tracking-wider" style={{ fontSize: '20px' }}>HAPPY</div>
              </div>
              <div className="mt-2">
                <h1 className="text-8xl font-black tracking-tight leading-none" style={{
                  background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}>
                  BIRTH
                </h1>
                <h1 className="text-8xl font-black tracking-tight leading-none" style={{
                  background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                }}>
                  DAY
                </h1>
              </div>
            </div>

            {/* Church Logo and Name */}
            <div className="flex flex-col items-center gap-1 mr-8 mt-8">
              <div className="w-36 h-36 flex items-center justify-center">
                <img 
                  src="/lmm-logo.png" 
                  alt="Church Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-white text-xl font-bold text-center leading-tight">
                LMM LSZA
              </div>
              <div className="text-white text-base font-semibold text-center leading-tight px-2">
                {church}
              </div>
            </div>
          </div>

          {/* Center Section - Photo Frame */}
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="relative w-full max-w-[85%]">
              {/* Decorative Flowers - Left */}
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 space-y-2 z-0">
                <div className="w-10 h-10 rounded-full bg-pink-400 opacity-80 blur-sm"></div>
                <div className="w-8 h-8 rounded-full bg-purple-400 opacity-80 blur-sm"></div>
                <div className="w-6 h-6 rounded-full bg-pink-300 opacity-80 blur-sm"></div>
              </div>

              {/* Decorative Flowers - Right */}
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 space-y-2 z-0">
                <div className="w-10 h-10 rounded-full bg-pink-400 opacity-80 blur-sm"></div>
                <div className="w-8 h-8 rounded-full bg-purple-400 opacity-80 blur-sm"></div>
                <div className="w-6 h-6 rounded-full bg-pink-300 opacity-80 blur-sm"></div>
              </div>

              {/* Gold Frame */}
              <div className="relative w-full aspect-square">
                {/* Outer gold border */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                  padding: '8px',
                }}>
                  {/* Inner frame */}
                  <div className="w-full h-full rounded-full bg-linear-to-br from-yellow-600 to-yellow-700 p-1">
                    {/* Photo container */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-4 border-white">
                      {photo ? (
                        <img 
                          src={photo} 
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pink-200 to-purple-200">
                          <div className="text-center text-gray-500 text-sm px-4">
                            Upload photo
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Crown decoration on top */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-12 h-8 bg-linear-to-b from-yellow-400 to-yellow-600 rounded-t-full shadow-lg"></div>
                </div>

                {/* Second Photo - Bottom Left Overlap */}
                {secondPhoto && (
                  <div className="absolute bottom-0 left-0 w-[35%] aspect-square z-10">
                    <div className="w-full h-full rounded-full" style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                      padding: '4px',
                    }}>
                      <div className="w-full h-full rounded-full bg-linear-to-br from-yellow-600 to-yellow-700 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-2 border-white">
                          <img 
                            src={secondPhoto} 
                            alt="Second photo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Badge - Right Side Overlap */}
                <div className="absolute top-[60%] -right-12 -translate-y-1/2 z-10">
                  <div className="bg-linear-to-br from-yellow-500 to-yellow-700 rounded-full w-32 h-32 flex items-center justify-center border-4 border-yellow-300 shadow-lg">
                    <div className="text-white text-center">
                      <div className="text-lg font-bold">{formatDate(birthDate).split(' ')[0]}</div>
                      <div className="text-sm font-semibold leading-tight">{formatDate(birthDate).split(' ')[1]}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Name */}
          <div className="pb-8 px-6 text-center space-y-2">

            {/* Title */}
            <div className="text-gray-800 text-sm font-semibold tracking-widest">
              {title}
            </div>

            {/* Name */}
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-wide leading-none" style={{
                background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                fontFamily: 'serif',
              }}>
                {firstName}
              </h2>
              {lastName && (
                <h3 className="text-2xl font-bold tracking-widest text-gray-800">
                  {lastName.toUpperCase()}
                </h3>
              )}
            </div>
          </div>

          {/* Footer Message */}
          <div className="bg-white py-4">
            <p className="text-center text-gray-800 text-xl font-bold tracking-[0.3em]">
              WE LOVE YOU DEARLY!
            </p>
          </div>
        </div>
        </div>
      </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={!name || !birthDate || !photo}
        className="w-full bg-linear-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
      >
        <Download size={20} />
        Download E-Card
      </button>

      {(!name || !birthDate || !photo) && (
        <p className="text-sm text-center text-gray-500">
          Please fill in all required fields to download
        </p>
      )}
    </div>
  );
}
