import React from 'react';
import {useRef, useEffect} from 'react';

interface LegendProps {
  locale: { [key: string]: string };
  onClose: () => void;
}

const Legend: React.FC<LegendProps> = ({ locale, onClose }) => {
  const legendRef = useRef<HTMLDivElement>(null);
  const categories = [
    { icon: "playa.png", alt: "Playas", key: 'Cara_Beaches_and_Coastal_Locations' },
    { icon: "arqueologia_1.png", alt: "Ruinas", key: 'Cara_Archaeological Legacy' },
    { icon: "arqueologia.png", alt: "Edificio", key: 'Cara_Folclore Materials' },
    { icon: "arte.png", alt: "Arte", key: 'Cara_Representative Works of Art' },
    { icon: "ingenieria.png", alt: "Ingeniería", key: 'Cara_Engineering Works' },
    { icon: "museo-de-arte.png", alt: "Museo", key: 'Cara_Museums and Exhibition Halls' },
    { icon: "espiritual.png", alt: "Espiritual", key: 'Cara_Spiritual Folklore' },
    { icon: "pradera.png", alt: "Valle", key: 'Cara_Vales' },
    { icon: "montana.png", alt: "Montaña", key: 'Cara_Mountains and Mountains' },
    { icon: "binoculares.png", alt: "Naturaleza", key: 'Cara_Flora and Fauna Observation Sites' },
    { icon: "geologia.png", alt: "Geología", key: 'Cara_Geological and Paleontological Formations' },
    { icon: "gestion-de-equipos.png", alt: "Personas", key: 'Cara_Ethnic Groups' },
    { icon: "clasicos.png", alt: "Casa", key: 'Cara_Human Settlements and Living Architecture' },
    { icon: "segador.png", alt: "Agricultura", key: 'Cara_Agricultural Exploration' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (legendRef.current && !legendRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
        ref={legendRef}
        className="absolute bottom-16 right-4 z-[1000] bg-white p-4 sm:p-6 border border-gray-200 rounded-lg shadow-lg 
                        w-64 sm:w-56 md:w-64 lg:w-72 max-h-[40vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">{locale['Legend'] || 'Legend'}</h2>
      <ul>
        {categories.map((item, index) => (
          <li 
            key={index} 
            className="flex items-center text-gray-900 hover:bg-gray-50 p-2 rounded-md transition-colors"
          >
            <img 
              src={`/icons/${item.icon}`} 
              alt={item.alt} 
              className="w-5 h-5 mr-3 object-contain" 
            /> 
            <span className="text-sm">{locale[item.key] || item.alt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;