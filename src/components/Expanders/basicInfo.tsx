import React, { useState } from 'react';
import { FaClock, FaRoute, FaMapMarked, FaLandmark, FaInfoCircle, FaHiking, FaMapSigns, FaHistory } from 'react-icons/fa';

interface BasicInfoProps {
  mainInfo: { [key: string]: any };
  routeDetails: { [key: string]: any };
  locationInfo: { [key: string]: any };
  additionalInfo: { [key: string]: any };
  capitalizeWords: (str: string) => string;
  type: 'route' | 'resource';
}

const BasicInfo: React.FC<BasicInfoProps> = ({ 
  mainInfo, 
  routeDetails, 
  locationInfo, 
  additionalInfo, 
  capitalizeWords,
  type 
}) => {
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({
    details: false,
    location: false,
    additional: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = type === 'route' ? {
    main: { title: "Información de la Ruta", icon: <FaRoute className="w-5 h-5 text-blue-500"/> },
    details: { title: "Características", icon: <FaHiking className="w-5 h-5 text-green-500"/> },
    location: { title: "Ubicación y Acceso", icon: <FaMapSigns className="w-5 h-5 text-red-500"/> },
    additional: { title: "Actividades y Recomendaciones", icon: <FaInfoCircle className="w-5 h-5 text-purple-500"/> }
  } : {
    main: { title: "Información General", icon: <FaLandmark className="w-5 h-5 text-blue-500"/> },
    details: { title: "Descripción", icon: <FaHistory className="w-5 h-5 text-green-500"/> },
    location: { title: "Ubicación", icon: <FaMapMarked className="w-5 h-5 text-red-500"/> },
    additional: { title: "Servicios", icon: <FaInfoCircle className="w-5 h-5 text-purple-500"/> }
  };

  const renderSection = (key: string, title: string, data: { [key: string]: any }, icon: React.ReactNode, isMain = false) => (
    <div className="space-y-3">
      <button 
        onClick={() => !isMain && toggleSection(key)}
        className="w-full flex items-center justify-between gap-2 border-b pb-2"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {!isMain && <span className="transform transition-transform duration-200">
          {openSections[key] ? '▼' : '▶'}
        </span>}
      </button>
      <div className={`grid grid-cols-1 gap-3 transition-all duration-200 ${!isMain && !openSections[key] ? 'hidden' : ''}`}>
        {Object.entries(data).map(([key, value]) => 
          value && (
            <div key={key} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-600">{capitalizeWords(key)}</h4>
              <p className="text-gray-800 mt-1">{String(value)}</p>
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderSection('main', sections.main.title, mainInfo, sections.main.icon, true)}
      {renderSection('details', sections.details.title, routeDetails, sections.details.icon)}
      {renderSection('location', sections.location.title, locationInfo, sections.location.icon)}
      {renderSection('additional', sections.additional.title, additionalInfo, sections.additional.icon)}
    </div>
  );
};

export default BasicInfo;