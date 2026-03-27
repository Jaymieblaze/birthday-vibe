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

export default function BirthdayCardDesign2({ name, birthDate, church, title, photo, secondPhoto, thirdPhoto, colorScheme, background, logo }: BirthdayCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  
  // iOS modal state
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');
  
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

    const loadingToast = toast.loading('Preparing your birthday card...');

    try {
      await document.fonts.ready;
      
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        cacheBust: true,
      });

      // Detect iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isIOS) {
        setModalImageUrl(dataUrl);
        setShowIOSModal(true);
        toast.success('Image ready!', {
          id: loadingToast,
          description: 'Long press the image to save it',
        });
      } else {
        const link = document.createElement('a');
        link.download = `birthday-card-${name.replace(/\s+/g, '-').toLowerCase()}-design-2.png`;
        link.href = dataUrl;
        link.click();
        toast.success('Download complete!', {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error('Download failed', {
        id: loadingToast,
        description: 'Please try again',
      });
    }
  };

  return (
    <>
      <div ref={containerRef} className="w-full">
        <div 
          ref={cardRef} 
          className="relative w-full aspect-square mx-auto overflow-hidden rounded-lg shadow-xl"
          style={{
            maxWidth: '600px',
            ...getBackgroundStyle(),
          }}
        >
          {/* Scattered Stars Background */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <i className="ri-star-line absolute text-yellow-300 text-3xl blur-[1px]" style={{ top: '8%', left: '8%', transform: 'rotate(-25deg)' }}></i>
            <i className="ri-star-fill absolute text-yellow-400 text-xl blur-[1px]" style={{ top: '12%', right: '12%', transform: 'rotate(45deg)' }}></i>
            <i className="ri-star-line absolute text-yellow-200 text-2xl blur-[1px]" style={{ top: '75%', left: '6%', transform: 'rotate(15deg)' }}></i>
            <i className="ri-star-fill absolute text-yellow-300 text-lg blur-[1px]" style={{ top: '82%', right: '10%', transform: 'rotate(-30deg)' }}></i>
            <i className="ri-star-line absolute text-yellow-400 text-xl blur-[1px]" style={{ top: '82%', left: '18%', transform: 'rotate(20deg)' }}></i>
            <i className="ri-star-fill absolute text-yellow-200 text-2xl blur-[1px]" style={{ top: '18%', left: '50%', transform: 'rotate(-15deg)' }}></i>
            <i className="ri-star-line absolute text-yellow-300 text-lg blur-[1px]" style={{ top: '25%', right: '5%', transform: 'rotate(35deg)' }}></i>
            <i className="ri-star-fill absolute text-yellow-400 text-xl blur-[1px]" style={{ top: '85%', right: '25%', transform: 'rotate(-40deg)' }}></i>
            <i className="ri-star-line absolute text-yellow-300 text-4xl blur-[1px]" style={{ top: '70%', right: '8%', transform: 'rotate(28deg)' }}></i>
            <i className="ri-star-line absolute text-yellow-300 text-4xl blur-[1px]" style={{ top: '10%', right: '30%', transform: 'rotate(28deg)' }}></i>
          </div>

          {/* Design 2: Square Profile Image Layout with Photos on Left */}
          <div className="relative w-full h-full flex items-center justify-between p-8 gap-6">
            {/* Left Side - Photos Section */}
            <div className="relative shrink-0" style={{ width: '45%' }}>
              {/* Main Photo Frame with Gold Border */}
              <div className="relative w-full aspect-square">
                {/* Outer gold border with glow effect */}
                <div className="absolute inset-0 rounded-full" style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                  padding: '6px',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 165, 0, 0.3), 0 0 60px rgba(255, 215, 0, 0.15), 0 6px 25px rgba(0, 0, 0, 0.3)',
                }}>
                  {/* Inner frame */}
                  <div className="w-full h-full rounded-full bg-linear-to-br from-yellow-600 to-yellow-700 p-1" style={{
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
                  }}>
                    {/* Photo container */}
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-3 border-white" style={{
                      boxShadow: '0 3px 15px rgba(0,0,0,0.25), inset 0 2px 4px rgba(0,0,0,0.1)',
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
                            className="w-full h-full object-cover"
                            loading="eager"
                            decoding="sync"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-pink-200 to-purple-200">
                          <div className="text-center text-gray-500 text-xs px-2">
                            Upload photo
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Crown decoration on top */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="w-10 h-6 bg-linear-to-b from-yellow-400 to-yellow-600 rounded-t-full" style={{
                    boxShadow: '0 3px 10px rgba(0,0,0,0.3), 0 0 15px rgba(255, 215, 0, 0.5)',
                    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
                  }}></div>
                </div>

                {/* Third Photo - Top Left Overlap */}
                {thirdPhoto && (
                  <div className="absolute top-12 w-[30%] aspect-square z-10" style={{ left: '-30px' }}>
                    <div className="w-full h-full rounded-full" style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                      padding: '3px',
                      boxShadow: '0 0 15px rgba(255, 215, 0, 0.5), 0 3px 15px rgba(0, 0, 0, 0.3)',
                    }}>
                      <div className="w-full h-full rounded-full bg-linear-to-br from-yellow-600 to-yellow-700 p-0.5">
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
                              className="w-full h-full object-cover"
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
                  <div className="absolute bottom-0 w-[40%] aspect-square z-10" style={{ left: '-20px' }}>
                    <div className="w-full h-full rounded-full" style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                      padding: '3px',
                      boxShadow: '0 0 15px rgba(255, 215, 0, 0.5), 0 3px 15px rgba(0, 0, 0, 0.3)',
                    }}>
                      <div className="w-full h-full rounded-full bg-linear-to-br from-yellow-600 to-yellow-700 p-0.5">
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
                              className="w-full h-full object-cover"
                              loading="eager"
                              decoding="sync"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
              {/* Logo at top */}
              {logo && (
                <div className="mb-2">
                  <img 
                    src={`/${logo}`} 
                    alt="Logo" 
                    className="h-12 w-auto object-contain drop-shadow-lg mx-auto"
                  />
                </div>
              )}

              {/* Happy Birthday */}
              <h2 className="text-4xl font-extrabold text-white drop-shadow-lg leading-tight" 
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                HAPPY<br/>BIRTHDAY
              </h2>
              
              {/* Name Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl w-full">
                <p className="text-xs font-semibold text-gray-600 mb-1">{title}</p>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-600 mb-2 leading-tight"
                    style={{ fontFamily: "'Great Vibes', cursive" }}>
                  {name || 'Name'}
                </h1>
                <div className="text-xl font-bold text-gray-800 mb-1">
                  {formatDate(birthDate) || 'Birth Date'}
                </div>
                {church && (
                  <p className="text-xs text-gray-600 mt-2 italic leading-tight">
                    {church}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full mt-4 bg-linear-to-r from-purple-500 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Download size={20} />
          Download Card (Square)
        </button>
      </div>

      {/* iOS Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setShowIOSModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-center">Your Birthday Card</h3>
            <p className="text-sm text-gray-600 mb-4 text-center">
              Long press the image below and select &quot;Save Image&quot; or &quot;Add to Photos&quot;
            </p>
            <img src={modalImageUrl} alt="Birthday Card" className="w-full rounded-lg shadow-xl" />
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-4 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
