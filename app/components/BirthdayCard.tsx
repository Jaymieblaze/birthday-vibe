'use client';

import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import Moveable from 'react-moveable';

interface BackgroundConfig {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
}

interface BirthdayCardProps {
  name: string;
  birthDate: string;
  church: string;
  title: string;
  photo: string | null;
  secondPhoto: string | null;
  thirdPhoto: string | null;
  colorScheme: 'purple-pink' | 'blue-teal' | 'rose-gold' | 'coral-peach' | 'lavender-mint';
  background?: BackgroundConfig;
  logo: string;
}

export default function BirthdayCard({ name, birthDate, church, title, photo, secondPhoto, thirdPhoto, colorScheme, background, logo }: BirthdayCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  
  // Refs for moveable targets
  const photoRef = useRef<HTMLDivElement>(null);
  const secondPhotoRef = useRef<HTMLDivElement>(null);
  const thirdPhotoRef = useRef<HTMLDivElement>(null);
  
  // Transform states for each photo
  const [photoTransform, setPhotoTransform] = useState({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0 });
  const [secondPhotoTransform, setSecondPhotoTransform] = useState({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0 });
  const [thirdPhotoTransform, setThirdPhotoTransform] = useState({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0 });

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

  // Determine background style
  const getBackgroundStyle = () => {
    if (background) {
      if (background.type === 'image') {
        return {
          backgroundImage: `url(${background.value})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      } else {
        return { background: background.value };
      }
    }
    // Fallback to color scheme gradient
    return { background: currentScheme.gradient };
  };

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

    // Check for missing required fields
    const missingFields = [];
    if (!name) missingFields.push('Name');
    if (!birthDate) missingFields.push('Birth Date');
    if (!photo) missingFields.push('Photo');

    if (missingFields.length > 0) {
      toast.error('Required fields missing', {
        description: `Please provide: ${missingFields.join(', ')}`,
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading('Preparing your birthday card...');

    try {
      // Ensure all fonts are loaded before capturing
      await document.fonts.ready;
      
      // Fetch the local Allura font and convert to data URL for embedding
      const fontResponse = await fetch('/fonts/Allura-Regular.ttf');
      const fontBlob = await fontResponse.blob();
      const fontBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(fontBlob);
      });
      
      // Fetch the Remix Icon font
      const remixFontResponse = await fetch('/fonts/remixicon/remixicon.woff2');
      const remixFontBlob = await remixFontResponse.blob();
      const remixFontBase64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(remixFontBlob);
      });
      
      // Create font CSS with embedded font data
      const fontCSS = `
        @font-face {
          font-family: 'Allura';
          font-style: normal;
          font-weight: 400;
          src: url('${fontBase64}') format('truetype');
        }
        @font-face {
          font-family: 'remixicon';
          src: url('${remixFontBase64}') format('woff2');
          font-display: swap;
        }
      `;
      
      // Wait for fonts to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 500));

      // Card is already at 768px, just capture it directly
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3,
        cacheBust: true,
        width: 768,
        height: 1152,
        fontEmbedCSS: fontCSS,
        skipFonts: true, // Skip external fonts, use our embedded one
      });

      const link = document.createElement('a');
      link.download = `birthday-card-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();

      // Success toast
      toast.success('Birthday card downloaded successfully!', {
        id: loadingToast,
        description: `Saved as birthday-card-${name.replace(/\s+/g, '-').toLowerCase()}.png`,
      });
    } catch (err) {
      console.error('Error generating image:', err);
      
      // Error toast
      toast.error('Failed to download card', {
        id: loadingToast,
        description: 'Please try again or check your browser settings.',
      });
    }
  };

  const splitName = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return { firstName: parts[0], lastName: '' };
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(' ');
    return { firstName, lastName };
  };

  // Check if the first name has descenders (letters that extend below baseline)
  const hasDescenders = (text: string) => {
    return /[gjpqy]/i.test(text);
  };

  const { firstName, lastName } = splitName(name);
  const firstNameHasDescenders = hasDescenders(firstName);

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
            className="relative aspect-2/3 overflow-hidden rounded-lg"
            style={{
              ...getBackgroundStyle(),
              width: '768px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 80px -10px rgba(0, 0, 0, 0.15)',
            }}
          >
        {/* Dark overlay for image backgrounds to ensure text readability */}
        {background?.type === 'image' && background.id === 'bg-5' ? (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(124, 58, 237, 1) 0%, rgba(124, 58, 237, 1) 25%, rgba(124, 58, 237, 0.6) 60%, rgba(124, 58, 237, 0.2) 85%)'
            }}
          ></div>
        ) : background?.type === 'image' ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30 pointer-events-none"></div>
        ) : null}
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px),
            repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)
          `,
        }}></div>

        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className={`absolute top-0 left-0 w-32 h-32 ${currentScheme.decorations[0]} rounded-full blur-3xl`}></div>
          <div className={`absolute top-20 right-0 w-40 h-40 ${currentScheme.decorations[1]} rounded-full blur-3xl`}></div>
          <div className={`absolute bottom-20 left-10 w-36 h-36 ${currentScheme.decorations[2]} rounded-full blur-3xl`}></div>
        </div>

        {/* Scattered Stars Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <i className="ri-star-line absolute text-yellow-300 text-4xl blur-[1px]" style={{ top: '8%', left: '8%', transform: 'rotate(-25deg)' }}></i>
          <i className="ri-star-fill absolute text-yellow-400 text-2xl blur-[1px]" style={{ top: '12%', right: '12%', transform: 'rotate(45deg)' }}></i>
          <i className="ri-star-line absolute text-yellow-200 text-3xl blur-[1px]" style={{ top: '75%', left: '6%', transform: 'rotate(15deg)' }}></i>
          <i className="ri-star-fill absolute text-yellow-300 text-xl blur-[1px]" style={{ top: '82%', right: '10%', transform: 'rotate(-30deg)' }}></i>
          <i className="ri-star-line absolute text-yellow-400 text-2xl blur-[1px]" style={{ top: '82%', left: '18%', transform: 'rotate(20deg)' }}></i>
          <i className="ri-star-fill absolute text-yellow-200 text-3xl blur-[1px]" style={{ top: '18%', left: '50%', transform: 'rotate(-15deg)' }}></i>
          <i className="ri-star-line absolute text-yellow-300 text-xl blur-[1px]" style={{ top: '25%', right: '5%', transform: 'rotate(35deg)' }}></i>
          <i className="ri-star-fill absolute text-yellow-400 text-2xl blur-[1px]" style={{ top: '85%', right: '25%', transform: 'rotate(-40deg)' }}></i>
          <i className="ri-star-line absolute text-yellow-300 text-5xl blur-[1px]" style={{ top: '70%', right: '8%', transform: 'rotate(28deg)' }}></i>
          <i className="ri-star-line absolute text-yellow-300 text-5xl blur-[1px]" style={{ top: '10%', right: '30%', transform: 'rotate(28deg)' }}></i>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Top Section */}
          <div className="flex justify-between items-start p-6">
            {/* Happy Birthday Text with Glow */}
            <div className="relative ml-8 mt-8">
              {/* Star decorations */}
              <i className="ri-star-line absolute -top-5 -left-3 text-yellow-300 text-[30px]" style={{
                textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                transform: 'rotate(-15deg)',
              }}></i>
              <i className="ri-star-line absolute -top-2 -right-3 text-yellow-200 text-xl" style={{
                textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                transform: 'rotate(20deg)',
              }}></i>
              <i className="ri-star-line absolute -top-[-8px] -right-[-40px] text-yellow-200 text-xl" style={{
                textShadow: '0 0 8px rgba(255, 215, 0, 0.6)',
                transform: 'rotate(20deg)',
              }}></i>
              <i className="ri-star-fill absolute -bottom-3 -left-5 text-yellow-400 text-lg" style={{
                textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
                transform: 'rotate(12deg)',
              }}></i>
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 px-6 py-2 rounded-md" style={{
                boxShadow: '0 4px 14px rgba(0,0,0,0.3), 0 0 8px rgba(255, 215, 0, 0.3)',
              }}>
                <div className="text-yellow-100 font-semibold tracking-wider" style={{ 
                  fontSize: '20px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}>HAPPY</div>
              </div>
              <div className="mt-2">
                <h1 className="text-8xl font-black tracking-tight leading-none" style={{
                  background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.4)) drop-shadow(2px 4px 6px rgba(0,0,0,0.4))',
                }}>
                  BIRTH
                </h1>
                <h1 className="text-8xl font-black tracking-tight leading-none" style={{
                  background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.4)) drop-shadow(2px 4px 6px rgba(0,0,0,0.4))',
                }}>
                  DAY
                </h1>
              </div>
            </div>

            {/* Church Logo and Name */}
            <div className="flex flex-col items-center gap-1 mr-8 mt-8">
              <div className="w-36 h-36 flex items-center justify-center">
                <img 
                  src={`/${logo === 'lmm-ceamc-logo.png' ? 'lmm-logo.png' : logo}`}
                  alt="Church Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              {(logo === 'lmm-logo.png' || logo === 'lmm-ceamc-logo.png') && (
                <div className="text-white text-center" style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '22px',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                }}>
                  {logo === 'lmm-logo.png' ? 'LMM LSZA' : 'LMM CEAMC'}
                </div>
              )}
              <div className="text-white text-center px-2" style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '17px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textShadow: '0 2px 6px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
                lineHeight: '1.3',
                textTransform: 'uppercase',
                maxWidth: '180px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
              }}>
                {church}
              </div>
            </div>
          </div>

          {/* Center Section - Photo Frame */}
          <div className="flex-1 flex items-start justify-center px-6 relative" style={{ marginTop: '-20px' }}>
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

              {/* Gold Frame with Glow */}
              <div className="relative w-full aspect-square">
                {/* Outer gold border with glow effect */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                  padding: '8px',
                  boxShadow: '0 0 25px rgba(255, 215, 0, 0.6), 0 0 50px rgba(255, 165, 0, 0.4), 0 0 75px rgba(255, 215, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.3)',
                }}>
                  {/* Inner frame */}
                  <div className="w-full h-full rounded-full bg-linear-to-br from-yellow-600 to-yellow-700 p-1" style={{
                    boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
                  }}>
                    {/* Photo container */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-4 border-white" style={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.25), inset 0 2px 4px rgba(0,0,0,0.1)',
                    }}>
                      {photo ? (
                        <div 
                          ref={photoRef}
                          className="w-full h-full"
                          style={{
                            transform: `translate(${photoTransform.x}px, ${photoTransform.y}px) rotate(${photoTransform.rotate}deg) scale(${photoTransform.scaleX}, ${photoTransform.scaleY})`,
                          }}
                        >
                          <img 
                            key={photo}
                            src={photo} 
                            alt={name}
                            className="w-full h-full object-contain"
                            style={{ pointerEvents: editMode ? 'none' : 'auto' }}
                            loading="eager"
                            decoding="sync"
                          />
                        </div>
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
                  <div className="w-12 h-8 bg-linear-to-b from-yellow-400 to-yellow-600 rounded-t-full" style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3), 0 0 20px rgba(255, 215, 0, 0.5)',
                    filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
                  }}></div>
                </div>

                {/* Third Photo - Top Left Overlap */}
                {thirdPhoto && (
                  <div className="absolute top-20 w-[30%] aspect-square z-10" style={{ left: '-45px' }}>
                    <div className="w-full h-full rounded-full" style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                      padding: '4px',
                      boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}>
                      <div className="w-full h-full rounded-full bg-linear-to-br from-yellow-600 to-yellow-700 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-2 border-white">
                          <div 
                            ref={thirdPhotoRef}
                            className="w-full h-full"
                            style={{
                              transform: `translate(${thirdPhotoTransform.x}px, ${thirdPhotoTransform.y}px) rotate(${thirdPhotoTransform.rotate}deg) scale(${thirdPhotoTransform.scaleX}, ${thirdPhotoTransform.scaleY})`,
                            }}
                          >
                            <img 
                              key={thirdPhoto}
                              src={thirdPhoto} 
                              alt="Third photo"
                              className="w-full h-full object-contain"
                              style={{ pointerEvents: editMode ? 'none' : 'auto' }}
                              loading="eager"
                              decoding="sync"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Second Photo - Bottom Left Overlap */}
                {secondPhoto && (
                  <div className="absolute bottom-0 w-[40%] aspect-square z-10" style={{ left: '-25px' }}>
                    <div className="w-full h-full rounded-full" style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                      padding: '4px',
                      boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 4px 20px rgba(0, 0, 0, 0.3)',
                    }}>
                      <div className="w-full h-full rounded-full bg-linear-to-br from-yellow-600 to-yellow-700 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-2 border-white">
                          <div 
                            ref={secondPhotoRef}
                            className="w-full h-full"
                            style={{
                              transform: `translate(${secondPhotoTransform.x}px, ${secondPhotoTransform.y}px) rotate(${secondPhotoTransform.rotate}deg) scale(${secondPhotoTransform.scaleX}, ${secondPhotoTransform.scaleY})`,
                            }}
                          >
                            <img 
                              key={secondPhoto}
                              src={secondPhoto} 
                              alt="Second photo"
                              className="w-full h-full object-contain"
                              style={{ pointerEvents: editMode ? 'none' : 'auto' }}
                              loading="eager"
                              decoding="sync"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Badge - Right Side Overlap */}
                <div className="absolute top-[60%] -right-12 -translate-y-1/2 z-10">
                  <div className="bg-linear-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center border-yellow-300" style={{
                    width: '147px',
                    height: '147px',
                    borderWidth: '5px',
                    boxShadow: '0 0 15px rgba(255, 215, 0, 0.4), 0 4px 15px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 165, 0, 0.2)',
                  }}>
                    <div className="text-white text-center" style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)',
                    }}>
                      <div style={{ 
                        fontFamily: 'Cinzel, serif',
                        fontSize: '26px',
                        fontWeight: 800,
                        letterSpacing: '0.02em',
                      }}>{formatDate(birthDate).split(' ')[0]}</div>
                      <div style={{ 
                        fontFamily: 'Montserrat, sans-serif',
                        fontSize: '15px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        lineHeight: '1.2',
                        marginTop: '2px',
                      }}>{formatDate(birthDate).split(' ')[1]}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Name */}
          <div className="pb-2 px-6 pt-4 text-center space-y-2 relative z-20">

            {/* Title */}
            <div className="text-base font-semibold tracking-widest" style={{
              color: background?.type === 'image' ? '#f3f4f6' : '#1f2937',
            }}>
              {title}
            </div>

            {/* Name */}
            <div className="space-y-0">
              <h2 className="font-black tracking-wide" style={{
                ...(background?.id === 'bg-5' 
                  ? { color: '#ffffff' }
                  : {
                    background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }
                ),
                fontFamily: 'Allura, cursive',
                fontSize: '70px',
                lineHeight: '1.2',
                paddingBottom: '8px',
                filter: background?.id === 'bg-5'
                  ? 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.8)) drop-shadow(3px 6px 12px rgba(0,0,0,0.6)) drop-shadow(6px 12px 24px rgba(0,0,0,0.4))'
                  : 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.6)) drop-shadow(2px 4px 8px rgba(0,0,0,0.4)) drop-shadow(4px 8px 16px rgba(0,0,0,0.3))',
              }}>
                {firstName}
              </h2>
              {lastName && (
                <h3 className="text-2xl font-bold tracking-widest" style={{
                  color: background?.type === 'image' ? '#ffffff' : '#1f2937',
                  textShadow: '0 1px 3px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.3)',
                  marginTop: firstNameHasDescenders ? '0' : '-12px',
                }}>
                  {lastName.toUpperCase()}
                </h3>
              )}
            </div>
          </div>

          {/* Footer Message */}
          <div className="bg-white py-3" style={{
            boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          }}>
            <p className="text-center text-gray-800 text-xl font-bold tracking-[0.3em]" style={{
              textShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}>
              WE LOVE YOU DEARLY!
            </p>
          </div>
        </div>
        </div>
      </div>
      </div>

      {/* Moveable Components - Only active in edit mode */}
      {editMode && photo && photoRef.current && (
        <Moveable
          target={photoRef.current}
          draggable={true}
          resizable={true}
          rotatable={true}
          keepRatio={true}
          origin={false}
          onDrag={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onDragEnd={({ target }) => {
            const matrix = new DOMMatrix(target.style.transform);
            setPhotoTransform(prev => ({ ...prev, x: matrix.m41, y: matrix.m42 }));
          }}
          onResize={({ target, width, height, drag }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
            target.style.transform = drag.transform;
          }}
          onResizeEnd={({ target }) => {
            const matrix = new DOMMatrix(target.style.transform);
            setPhotoTransform(prev => ({
              ...prev,
              x: matrix.m41,
              y: matrix.m42,
              scaleX: matrix.a,
              scaleY: matrix.d,
            }));
          }}
          onRotate={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onRotateEnd={({ target }) => {
            const matrix = new DOMMatrix(target.style.transform);
            const angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
            setPhotoTransform(prev => ({ ...prev, rotate: angle }));
          }}
        />
      )}
      
      {editMode && secondPhoto && secondPhotoRef.current && (
        <Moveable
          target={secondPhotoRef.current}
          draggable={true}
          resizable={true}
          rotatable={true}
          keepRatio={true}
          origin={false}
          onDrag={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onDragEnd={({ target }) => {
            const matrix = new DOMMatrix(target.style.transform);
            setSecondPhotoTransform(prev => ({ ...prev, x: matrix.m41, y: matrix.m42 }));
          }}
          onResize={({ target, width, height, drag }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
            target.style.transform = drag.transform;
          }}
          onResizeEnd={({ target }) => {
            const matrix = new DOMMatrix(target.style.transform);
            setSecondPhotoTransform(prev => ({
              ...prev,
              x: matrix.m41,
              y: matrix.m42,
              scaleX: matrix.a,
              scaleY: matrix.d,
            }));
          }}
          onRotate={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onRotateEnd={({ target }) => {
            const matrix = new DOMMatrix(target.style.transform);
            const angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
            setSecondPhotoTransform(prev => ({ ...prev, rotate: angle }));
          }}
        />
      )}
      
      {editMode && thirdPhoto && thirdPhotoRef.current && (
        <Moveable
          target={thirdPhotoRef.current}
          draggable={true}
          resizable={true}
          rotatable={true}
          keepRatio={true}
          origin={false}
          onDrag={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onDragEnd={({ target }) => {
            const matrix = new DOMMatrix(target.style.transform);
            setThirdPhotoTransform(prev => ({ ...prev, x: matrix.m41, y: matrix.m42 }));
          }}
          onResize={({ target, width, height, drag }) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;
            target.style.transform = drag.transform;
          }}
          onResizeEnd={({ target }) => {
            const matrix = new DOMMatrix(target.style.transform);
            setThirdPhotoTransform(prev => ({
              ...prev,
              x: matrix.m41,
              y: matrix.m42,
              scaleX: matrix.a,
              scaleY: matrix.d,
            }));
          }}
          onRotate={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onRotateEnd={({ target }) => {
            const matrix = new DOMMatrix(target.style.transform);
            const angle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
            setThirdPhotoTransform(prev => ({ ...prev, rotate: angle }));
          }}
        />
      )}

      {/* Action Buttons */}
      <div className="w-full flex gap-3">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
            editMode 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-700 hover:bg-gray-800 text-white'
          }`}
        >
          <Edit3 size={20} />
          {editMode ? 'Done Editing' : 'Edit Images'}
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 bg-linear-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
        >
          <Download size={20} />
          Download E-Card
        </button>
      </div>
    </div>
  );
}
