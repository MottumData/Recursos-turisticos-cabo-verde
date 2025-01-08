import React, { useState, useEffect, useRef } from 'react';

interface TouristResource {
  [key: string]: any;
}

interface ExpanderProps {
  visible: boolean;
  onClose: () => void;
  resource?: TouristResource;
  language: 'pt' | 'en' | 'es';
  locale: { [key: string]: string };
}

const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str.toString().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export default function Expander({ visible, onClose, resource, locale }: ExpanderProps) {
  const [activeImage, setActiveImage] = useState(0);
  const expanderRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (expanderRef.current && !expanderRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

  if (!resource) return null;

  // Image collection
  const images = [
    resource[locale['feature images']],
    resource[locale['feature 1 images']],
    resource[locale['feature 2 images']],
    resource[locale['feature 3 images']],
    resource[locale['feature 4 images']],
  ].filter(Boolean);

  // Organize data into sections
  const basicInfo = {
    [locale['nome do recurso turístico']]: resource[locale['nome do recurso turístico']],
    [locale['island']]: resource[locale['island']],
    [locale['council']]: resource[locale['council']],
    [locale['parish']]: resource[locale['parish']],
    [locale['vila']]: resource[locale['vila']],
    [locale['neighborhood']]: resource[locale['neighborhood']]
  };

  const classification = {
      [locale['classification']]: resource[locale['classification']],
      [locale['cara']]: resource[locale['cara']]
  };

  const description = {
      [locale['descrição do produto']]: resource[locale['descrição do produto']],
      [locale['associated material elements']]: resource[locale['associated material elements']],
      [locale['associated natural elements']]: resource[locale['associated natural elements']],
      [locale['uniqueness that sets it apart from others in the region']]: resource[locale['uniqueness that sets it apart from others in the region']]
  };

  const accessInfo = {
      [locale['resource access [public or private domain]']]: resource[locale['resource access [public or private domain]']],
      [locale['means of travel']]: resource[locale['means of travel']],
      [locale['conservation status']]: resource[locale['conservation status']],
      [locale['type of income']]: resource[locale['type of income']]
  };

  const services = {
      [locale['basic services (within the tourist resort)']]: resource[locale['basic services (within the tourist resort)']],
      [locale['emergency services (within the tourist resort)']]: resource[locale['emergency services (within the tourist resort)']],
      [locale['other tourist services (within the tourist resource)']]: resource[locale['other tourist services (within the tourist resource)']]
  };
  return (
    <div ref={expanderRef} className={`fixed bottom-0 left-0 w-full bg-gradient-to-t from-white to-gray-50
        transform transition-transform duration-300 rounded-t-3xl z-[10000]
        shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.2)] backdrop-blur-sm
        ${visible ? 'translate-y-0' : 'translate-y-full'}`}
      style={{ height: '80vh' }}>
      
      {/* Header */}
      <div className="sticky top-0 bg-white/70 backdrop-blur-sm border-b border-gray-200 rounded-t-3xl">
        <div className="flex justify-center items-center p-6 relative">
          <h2 className="text-4xl font-bold text-center px-6 py-4
                      bg-gradient-to-r from-gray-800 to-gray-600 
                      bg-clip-text text-transparent">
            {capitalizeWords(resource[locale['nome do recurso turístico']])}
          </h2>
          <button onClick={onClose} className="absolute right-4 p-2 hover:bg-gray-100/80 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto space-y-8" style={{ height: 'calc(80vh - 90px)' }}>
        {/* Image Gallery */}
        {images.length > 0 && (
        <div className="mb-8">
          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-4">
            <div className="aspect-ratio-container" style={{ aspectRatio: '16/9', minHeight: '300px', maxHeight: '600px' }}>
              <img src={images[activeImage]} 
                  alt={`Image ${activeImage + 1}`} 
                  loading="eager"
                  decoding="sync"
                  className="w-full h-full object-contain object-center transform transition-transform duration-300 hover:scale-105" 
                  style={{
                    imageRendering: 'crisp-edges',
                    WebkitFontSmoothing: 'antialiased',
                    backfaceVisibility: 'hidden',
                    filter: 'contrast(1.05) brightness(1.05)',
                  }}
              />
            </div>
          </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button key={idx} 
                        onClick={() => setActiveImage(idx)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden 
                                  transition-all duration-300 hover:scale-105
                                  ${activeImage === idx ? 'ring-2 ring-gray-700 opacity-100' : 'opacity-70'}`}>
                  <img src={img} 
                       alt={`Thumbnail ${idx + 1}`} 
                       className="w-full h-full object-cover object-center"
                       loading="lazy"
                       style={{
                         imageRendering: 'crisp-edges',
                         WebkitFontSmoothing: 'antialiased'
                       }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">{locale['Basic_information']}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(basicInfo).map(([key, value]) => value && (
              <div key={key} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                <h4 className="font-medium text-gray-700">{capitalizeWords(key)}</h4>
                <p className="text-gray-600">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Description */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">{locale['Description']}</h3>
          {Object.entries(description).map(([key, value]) => value && (
            <div key={key} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm">
              <h4 className="font-medium text-gray-700 mb-2">{capitalizeWords(key)}</h4>
              <p className="text-gray-600 whitespace-pre-line">{String(value)}</p>
            </div>
          ))}
        </section>

        {/* Access and Services */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">{locale['Service_and_Access']}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Object.entries(accessInfo), ...Object.entries(services)].map(([key, value]) => value && (
              <div key={key} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                <h4 className="font-medium text-gray-700">{capitalizeWords(key)}</h4>
                <p className="text-gray-600">{String(value)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}