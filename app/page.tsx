'use client';

import { useState } from 'react';
import BirthdayCard from './components/BirthdayCard';
import { toast } from 'sonner';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    church: '',
    title: 'ESTEEMED SISTER',
    photo: null as string | null,
    secondPhoto: null as string | null,
    colorScheme: 'purple-pink' as 'purple-pink' | 'blue-teal' | 'rose-gold' | 'coral-peach' | 'lavender-mint',
    logo: 'lmm-logo.png' as string,
  });

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
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
        toast.success('Main photo uploaded successfully!', {
          id: loadingToast,
        });
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
        setFormData(prev => ({ ...prev, secondPhoto: reader.result as string }));
        toast.success('Second photo uploaded successfully!', {
          id: loadingToast,
        });
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
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 py-4 sm:py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 text-gray-800">
          Birthday E-Card Generator
        </h1>
        <p className="text-sm sm:text-base text-center text-gray-600 mb-6 sm:mb-8">Create beautiful personalized birthday cards</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Card Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="First Name and Last Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-yellow-700 placeholder:text-gray-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={formData.birthDate ? formData.birthDate.split('-')[2] : ''}
                    onChange={(e) => {
                      const month = formData.birthDate ? formData.birthDate.split('-')[1] : '01';
                      setFormData(prev => ({ ...prev, birthDate: `2000-${month}-${e.target.value.padStart(2, '0')}` }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Church Name *
                </label>
                <input
                  type="text"
                  value={formData.church}
                  onChange={(e) => setFormData(prev => ({ ...prev, church: e.target.value }))}
                  placeholder="Enter church name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <select
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium"
                >
                  <option value="ESTEEMED SISTER">Esteemed Sister</option>
                  <option value="ESTEEMED BROTHER">Esteemed Brother</option>
                  <option value="ESTEEMED PASTOR">Esteemed Pastor</option>
                  <option value="DEAR FRIEND">Dear Friend</option>
                  <option value="CHERISHED MEMBER">Cherished Member</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Scheme
                </label>
                <select
                  value={formData.colorScheme}
                  onChange={(e) => setFormData(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium"
                >
                  <option value="purple-pink">Purple & Pink</option>
                  <option value="blue-teal">Blue & Teal</option>
                  <option value="rose-gold">Rose & Gold</option>
                  <option value="coral-peach">Coral & Peach</option>
                  <option value="lavender-mint">Lavender & Mint</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo
                </label>
                <select
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-900 font-medium"
                >
                  <option value="lmm-logo.png">LMM LSZA</option>
                  <option value="church-ministry-logo.png">Church Ministry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Main Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Second Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSecondImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <p className="text-sm text-gray-500 mt-4">
                * Required fields
              </p>
            </div>
          </div>

          {/* Card Preview Section */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">Preview</h2>
            <BirthdayCard 
              name={formData.name}
              birthDate={formData.birthDate}
              church={formData.church}
              title={formData.title}
              photo={formData.photo}
              secondPhoto={formData.secondPhoto}
              colorScheme={formData.colorScheme}
              logo={formData.logo}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
