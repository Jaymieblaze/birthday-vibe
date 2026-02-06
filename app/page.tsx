'use client';

import { useState } from 'react';
import BirthdayCard from './components/BirthdayCard';

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    church: '',
    title: 'ESTEEMED SISTER',
    photo: null as string | null,
    secondPhoto: null as string | null,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSecondImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, secondPhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Birthday E-Card Generator
        </h1>
        <p className="text-center text-gray-600 mb-8">Create beautiful personalized birthday cards</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Card Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-yellow-700 placeholder:text-gray-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-gray-700 font-medium"
                  style={{ colorScheme: 'light' }}
                />
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Preview</h2>
            <BirthdayCard 
              name={formData.name}
              birthDate={formData.birthDate}
              church={formData.church}
              title={formData.title}
              photo={formData.photo}
              secondPhoto={formData.secondPhoto}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
