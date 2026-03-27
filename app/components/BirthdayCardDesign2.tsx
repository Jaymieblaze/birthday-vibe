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
          {/* Design 2: Square Profile Image Layout */}
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6">
            {/* Logo at top */}
            {logo && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <img 
                  src={`/${logo}`} 
                  alt="Logo" 
                  className="h-12 w-auto object-contain drop-shadow-lg"
                />
              </div>
            )}

            {/* Main Content - Centered Vertical Layout */}
            <div className="flex flex-col items-center justify-center gap-4 w-full">
              {/* Photo Section */}
              {photo && (
                <div className="shrink-0">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-6 border-white shadow-2xl">
                    <img 
                      src={photo} 
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Text Section */}
              <div className="text-center w-full px-4">
                <h2 className="text-3xl font-extrabold text-white drop-shadow-lg mb-3" 
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                  HAPPY BIRTHDAY
                </h2>
                
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl mx-auto max-w-sm">
                  <p className="text-xs font-semibold text-gray-600 mb-1">{title}</p>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-600 mb-2"
                      style={{ fontFamily: "'Great Vibes', cursive" }}>
                    {name || 'Name'}
                  </h1>
                  <div className="text-xl font-bold text-gray-800 mb-1">
                    {formatDate(birthDate) || 'Birth Date'}
                  </div>
                  {church && (
                    <p className="text-xs text-gray-600 mt-2 italic">
                      {church}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Photos at Bottom */}
              {(secondPhoto || thirdPhoto) && (
                <div className="flex gap-3 mt-2">
                  {secondPhoto && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-3 border-white shadow-xl">
                      <img 
                        src={secondPhoto} 
                        alt="Second"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {thirdPhoto && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-3 border-white shadow-xl">
                      <img 
                        src={thirdPhoto} 
                        alt="Third"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
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
