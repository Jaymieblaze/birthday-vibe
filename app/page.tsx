'use client';

import { useState, useEffect, useRef } from 'react';
import BirthdayCard from './components/BirthdayCard';
import { toast } from 'sonner';

const STORAGE_KEY = 'birthday-card-form-data';

// Available backgrounds
type BackgroundType = 'gradient' | 'image';

interface Background {
  id: string;
  name: string;
  type: BackgroundType;
  value: string;
}

const BACKGROUNDS: Background[] = [
  {
    id: 'bg-1',
    name: 'Balloons',
    type: 'image',
    value: '/backgrounds/balloons.jpg'
  },
  {
    id: 'bg-2',
    name: 'Glitter',
    type: 'image',
    value: '/backgrounds/glitter.jpg'
  },
  {
    id: 'bg-3',
    name: 'Glitter 2',
    type: 'image',
    value: '/backgrounds/glitter_2.jpg'
  },
  {
    id: 'bg-4',
    name: 'Galaxy',
    type: 'image',
    value: '/backgrounds/galaxy_1.jpg'
  },
  {
    id: 'bg-5',
    name: 'Gold Wall',
    type: 'image',
    value: '/backgrounds/gold_wall.jpg'
  },
  {
    id: 'bg-6',
    name: 'Sparks',
    type: 'image',
    value: '/backgrounds/sparks.jpg'
  },
  {
    id: 'bg-7',
    name: 'Balloons 2',
    type: 'image',
    value: '/backgrounds/balloons_2.jpg'
  },
  {
    id: 'bg-8',
    name: 'Balloons 3',
    type: 'image',
    value: '/backgrounds/balloons_3.jpg'
  },
  {
    id: 'bg-9',
    name: 'Balloons 4',
    type: 'image',
    value: '/backgrounds/balloons_4.jpg'
  },
  {
    id: 'bg-10',
    name: 'Gold Leaves',
    type: 'image',
    value: '/backgrounds/gold_leaves.jpg'
  },
  {
    id: 'bg-11',
    name: 'Gold Fabric',
    type: 'image',
    value: '/backgrounds/gold_fabric.jpg'
  },
  {
    id: 'bg-12',
    name: 'Bokeh',
    type: 'image',
    value: '/backgrounds/bokeh.jpg'
  },
];

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    church: '',
    title: 'ESTEEMED SISTER',
    photo: null as string | null,
    secondPhoto: null as string | null,
    thirdPhoto: null as string | null,
    colorScheme: 'purple-pink' as 'purple-pink' | 'blue-teal' | 'rose-gold' | 'coral-peach' | 'lavender-mint',
    logo: 'lmm-logo.png' as string,
    backgroundId: 'bg-1' as string,
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const secondPhotoInputRef = useRef<HTMLInputElement>(null);
  const thirdPhotoInputRef = useRef<HTMLInputElement>(null);

  // Load saved data from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedData = JSON.parse(saved);
        if (parsedData.name) {
          parsedData.name = parsedData.name
            .split(' ')
            .map((word: string) => word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word)
            .join(' ');
        }
        setFormData(parsedData);
        toast.success('Previous data restored!', {
          description: 'Your form data has been recovered',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }, [formData, isLoaded]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: 'Please upload an image file (JPG, PNG, etc.)'
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please upload an image smaller than 5MB'
        });
        return;
      }

      const loadingToast = toast.loading('Uploading main photo...');
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        
        // Preload the image to ensure it's decoded before showing in preview
        const img = new Image();
        img.onload = () => {
          setFormData(prev => ({ ...prev, photo: dataUrl }));
          toast.success('Main photo uploaded successfully!', {
            id: loadingToast,
          });
        };
        img.onerror = () => {
          toast.error('Failed to load photo', {
            id: loadingToast,
            description: 'Please try again with a different image'
          });
        };
        img.src = dataUrl;
      };
      
      reader.onerror = () => {
        toast.error('Failed to upload photo', {
          id: loadingToast,
          description: 'Please try again'
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleSecondImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: 'Please upload an image file (JPG, PNG, etc.)'
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please upload an image smaller than 5MB'
        });
        return;
      }

      const loadingToast = toast.loading('Uploading second photo...');
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        
        // Preload the image to ensure it's decoded before showing in preview
        const img = new Image();
        img.onload = () => {
          setFormData(prev => ({ ...prev, secondPhoto: dataUrl }));
          toast.success('Second photo uploaded successfully!', {
            id: loadingToast,
          });
        };
        img.onerror = () => {
          toast.error('Failed to load photo', {
            id: loadingToast,
            description: 'Please try again with a different image'
          });
        };
        img.src = dataUrl;
      };
      
      reader.onerror = () => {
        toast.error('Failed to upload photo', {
          id: loadingToast,
          description: 'Please try again'
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleThirdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type', {
          description: 'Please upload an image file (JPG, PNG, etc.)'
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Please upload an image smaller than 5MB'
        });
        return;
      }

      const loadingToast = toast.loading('Uploading third photo...');
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        
        // Preload the image to ensure it's decoded before showing in preview
        const img = new Image();
        img.onload = () => {
          setFormData(prev => ({ ...prev, thirdPhoto: dataUrl }));
          toast.success('Third photo uploaded successfully!', {
            id: loadingToast,
          });
        };
        img.onerror = () => {
          toast.error('Failed to load photo', {
            id: loadingToast,
            description: 'Please try again with a different image'
          });
        };
        img.src = dataUrl;
      };
      
      reader.onerror = () => {
        toast.error('Failed to upload photo', {
          id: loadingToast,
          description: 'Please try again'
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 py-3 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-2 text-gray-800">
          Birthday E-Card Generator
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-center text-gray-600 mb-4 sm:mb-6 md:mb-8">Create beautiful personalized birthday cards</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 text-gray-800">Card Details</h2>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const titled = e.target.value
                      .split(' ')
                      .map(word => word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word)
                      .join(' ');
                    setFormData(prev => ({ ...prev, name: titled }));
                  }}
                  placeholder="First Name and Last Name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-yellow-700 placeholder:text-gray-600 font-medium text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Birth Date *
                </label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <select
                    value={formData.birthDate ? formData.birthDate.split('-')[2] : ''}
                    onChange={(e) => {
                      const month = formData.birthDate ? formData.birthDate.split('-')[1] : '01';
                      setFormData(prev => ({ ...prev, birthDate: `2000-${month}-${e.target.value.padStart(2, '0')}` }));
                    }}
                    className="w-full px-2 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium text-sm sm:text-base"
                  >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day.toString().padStart(2, '0')}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={formData.birthDate ? formData.birthDate.split('-')[1] : ''}
                    onChange={(e) => {
                      const day = formData.birthDate ? formData.birthDate.split('-')[2] : '01';
                      setFormData(prev => ({ ...prev, birthDate: `2000-${e.target.value}-${day}` }));
                    }}
                    className="w-full px-2 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium text-sm sm:text-base"
                  >
                    <option value="">Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Church Name *
                </label>
                <input
                  type="text"
                  value={formData.church}
                  onChange={(e) => setFormData(prev => ({ ...prev, church: e.target.value }))}
                  placeholder="Enter church name"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-600 font-medium text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Title
                </label>
                <select
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium text-sm sm:text-base"
                >
                  <option value="ESTEEMED SISTER">Esteemed Sister</option>
                  <option value="ESTEEMED BROTHER">Esteemed Brother</option>
                  <option value="ESTEEMED PASTOR">Esteemed Pastor</option>
                  <option value="ESTEEMED DEACON">Esteemed Deacon</option>
                  <option value="ESTEEMED DEACONESS">Esteemed Deaconess</option>
                  <option value="ESTEEMED ELDER">Esteemed Elder</option>
                  <option value="ESTEEMED EVANGELIST">Esteemed Evangelist</option>
                  <option value="ESTEEMED REVEREND">Esteemed Reverend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Background
                </label>
                <select
                  value={formData.backgroundId}
                  onChange={(e) => setFormData(prev => ({ ...prev, backgroundId: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium text-sm sm:text-base"
                >
                  {BACKGROUNDS.map(bg => (
                    <option key={bg.id} value={bg.id}>
                      {bg.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Logo
                </label>
                <select
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium text-sm sm:text-base"
                >
                  <option value="lmm-logo.png">LMM LSZA</option>
                  <option value="lmm-ceamc-logo.png">LMM CEAMC</option>
                  <option value="church-ministry-logo.png">Church Ministry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Upload Main Photo *
                </label>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Upload Second Photo (Optional)
                </label>
                <input
                  ref={secondPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSecondImageUpload}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                  Upload Third Photo (Optional)
                </label>
                <input
                  ref={thirdPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThirdImageUpload}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
                * Required fields
              </p>

              {/* Clear Data Button */}
              <button
                onClick={() => setShowClearDialog(true)}
                className="w-full mt-3 sm:mt-4 bg-gray-100 text-gray-700 py-2.5 sm:py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-300 text-sm sm:text-base min-h-[44px]"
              >
                Clear All Data
              </button>
            </div>
          </div>

          {/* Card Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 md:mb-6 text-gray-800">Preview</h2>
            <BirthdayCard 
              name={formData.name}
              birthDate={formData.birthDate}
              church={formData.church}
              title={formData.title}
              photo={formData.photo}
              secondPhoto={formData.secondPhoto}
              thirdPhoto={formData.thirdPhoto}
              colorScheme={formData.colorScheme}
              logo={formData.logo}
              background={BACKGROUNDS.find(bg => bg.id === formData.backgroundId)}
            />
          </div>
        </div>
      </div>

      {/* Clear Data Dialog */}
      {showClearDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md bg-white/30">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 transform transition-all">
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Clear All Data?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              Are you sure you want to clear all form data? This action cannot be undone.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowClearDialog(false)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm sm:text-base min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const defaultData = {
                    name: '',
                    birthDate: '',
                    church: '',
                    title: 'ESTEEMED SISTER',
                    photo: null,
                    secondPhoto: null,
                    thirdPhoto: null,
                    colorScheme: 'purple-pink' as const,
                    logo: 'lmm-logo.png',
                    backgroundId: 'bg-1',
                  };
                  setFormData(defaultData);
                  localStorage.removeItem(STORAGE_KEY);
                  // Clear file input fields
                  if (photoInputRef.current) photoInputRef.current.value = '';
                  if (secondPhotoInputRef.current) secondPhotoInputRef.current.value = '';
                  if (thirdPhotoInputRef.current) thirdPhotoInputRef.current.value = '';
                  setShowClearDialog(false);
                  toast.success('Form data cleared!', {
                    description: 'All fields have been reset',
                  });
                }}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg text-sm sm:text-base min-h-[44px]"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
