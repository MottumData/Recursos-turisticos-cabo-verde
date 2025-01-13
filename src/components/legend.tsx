import React from 'react';
import {useRef, useEffect, JSX} from 'react';
import { 
  FaUmbrellaBeach, FaMonument, FaGuitar, FaPalette, 
  FaWrench, FaPaintBrush, FaPrayingHands, FaSeedling,
  FaMountain, FaBinoculars, FaGem, FaUsers,
  FaUniversity, FaTractor 
} from 'react-icons/fa';


interface LegendProps {
  locale: { [key: string]: string };
  onClose: () => void;
}

interface Category {
  icon: JSX.Element;
  color: string;
  key: string;
}

const Legend: React.FC<LegendProps> = ({ locale, onClose }) => {
  const legendRef = useRef<HTMLDivElement>(null);
  const categories: Category[] = [
    { icon: <FaUmbrellaBeach size={20} />, color: '#F4D03F', key: 'Cara_Beaches_and_Coastal_Locations' },
    { icon: <FaMonument size={20} />, color: '#d2b48c', key: 'Cara_Archaeological Legacy' },
    { icon: <FaGuitar size={20} />, color: '#cd5c5c', key: 'Cara_Folclore Materials' },
    { icon: <FaPalette size={20} />, color: '#9370db', key: 'Cara_Representative Works of Art' },
    { icon: <FaWrench size={20} />, color: '#DC143C', key: 'Cara_Engineering Works' },
    { icon: <FaPaintBrush size={20} />, color: '#800020', key: 'Cara_Museums and Exhibition Halls' },
    { icon: <FaPrayingHands size={20} />, color: '#4b0082', key: 'Cara_Spiritual Folklore' },
    { icon: <FaSeedling size={20} />, color: '#90ee90', key: 'Cara_Vales' },
    { icon: <FaMountain size={20} />, color: '#708090', key: 'Cara_Mountains and Mountains' },
    { icon: <FaBinoculars size={20} />, color: '#228b22', key: 'Cara_Flora and Fauna Observation Sites' },
    { icon: <FaGem size={20} />, color: '#8b4513', key: 'Cara_Geological and Paleontological Formations' },
    { icon: <FaUsers size={20} />, color: '#e27d60', key: 'Cara_Ethnic Groups' },
    { icon: <FaUniversity size={20} />, color: '#b22222', key: 'Cara_Human Settlements and Living Architecture' },
    { icon: <FaTractor size={20} />, color: '#daa520', key: 'Cara_Agricultural Exploration' },
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
    <div ref={legendRef} className="absolute bottom-16 right-4 z-[1000] bg-white p-3 sm:p-6 
        border border-gray-200 rounded-lg shadow-lg w-[20rem] sm:w-[28rem] max-h-[40vh] overflow-y-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
        {locale['Legend'] || 'Legend'}
      </h2>
      <ul>
        {categories.map((item, index) => (
          <li key={index} className="flex items-center text-gray-900 hover:bg-gray-50 p-1.5 sm:p-2 
              rounded-md transition-colors space-y-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex items-center justify-center rounded-full" 
                style={{ backgroundColor: item.color }}>
              <div className="text-white text-sm sm:text-base">
                {item.icon}
              </div>
            </div>
            <span className="text-xs sm:text-sm">{locale[item.key] || item.key}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;