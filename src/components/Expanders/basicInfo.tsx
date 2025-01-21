import React, { useState, useEffect } from 'react';
import { 
  FaRoute, 
  FaHiking, 
  FaMapSigns, 
  FaInfoCircle, 
  FaLandmark, 
  FaHistory, 
  FaMapMarked 
} from 'react-icons/fa';

interface BasicInfoProps {
  mainInfo: { [key: string]: any };
  routeDetails: { [key: string]: any };
  locationInfo: { [key: string]: any };
  additionalInfo: { [key: string]: any };
  capitalizeWords: (str: string) => string;
  type: 'route' | 'resource';
  locale: { [key: string]: string };
  isDropdownOpen: boolean;
  setIsDropdownOpen: (value: boolean) => void;
}

interface Section {
  title: string;
  icon: React.ReactNode;
  color: string;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  mainInfo,
  routeDetails,
  locationInfo,
  additionalInfo,
  capitalizeWords,
  locale,
  type,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    details: false,
    location: false,
    additional: false,
  });

  useEffect(() => {
    if (!isDropdownOpen) {
      setOpenSections({
        details: false,
        location: false,
        additional: false,
      });
    }
  }, [isDropdownOpen]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
    setIsDropdownOpen(true); // Asegurarse de que isDropdownOpen esté en true cuando se abre una sección
  };

  const sections: { [key: string]: Section } = type === 'route' ? {
    main: {
      title: locale["Route information"],
      icon: <FaRoute className="w-5 h-5 text-blue-500" />,
      color: 'text-blue-500'
    },
    details: {
      title: locale["Characteristics"],
      icon: <FaHiking className="w-5 h-5 text-green-500" />,
      color: 'text-green-500'
    },
    location: {
      title: locale["Access and location"],
      icon: <FaMapSigns className="w-5 h-5 text-red-500" />,
      color: 'text-red-500'
    },
    additional: {
      title: locale["Activities and recommendations"],
      icon: <FaInfoCircle className="w-5 h-5 text-purple-500" />,
      color: 'text-purple-500'
    }
  } : {
    main: {
      title: locale["General information"],
      icon: <FaLandmark className="w-5 h-5 text-blue-500" />,
      color: 'text-blue-500'
    },
    details: {
      title: locale["Description"],
      icon: <FaHistory className="w-5 h-5 text-green-500" />,
      color: 'text-green-500'
    },
    location: {
      title: locale["Location"],
      icon: <FaMapMarked className="w-5 h-5 text-red-500" />,
      color: 'text-red-500'
    },
    additional: {
      title: locale["Services"],
      icon: <FaInfoCircle className="w-5 h-5 text-purple-500" />,
      color: 'text-purple-500'
    }
  };

  const renderSection = (
    key: string,
    title: string,
    data: { [key: string]: any },
    icon: React.ReactNode,
    color: string,
    isMain: boolean = false
  ) => (
    <div className="space-y-3" key={key}>
      <button
        onClick={() => !isMain && toggleSection(key)}
        className="w-full flex items-center justify-between gap-2 border-b pb-2"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className={`text-lg font-semibold`}>{title}</h3>
        </div>
        {!isMain && <span className="transform transition-transform duration-200">
          {openSections[key] ? '▼' : '▶'}
        </span>}
      </button>
      <div className={`grid grid-cols-1 gap-3 transition-all duration-200 ${!isMain && !openSections[key] ? 'hidden' : ''}`}>
        {Object.entries(data).map(([dataKey, value]) =>
          value && (
            <div key={dataKey} className="bg-white/60 backdrop-blur-sm p-4 rounded-lg shadow-sm">
              <h4 className={`text-sm font-medium ${color}`}>{capitalizeWords(dataKey)}</h4>
              <p className="text-gray-800 mt-1 preserve-whitespace">{String(value)}</p>
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderSection('main', sections.main.title, mainInfo, sections.main.icon, sections.main.color, true)}
      {renderSection('details', sections.details.title, routeDetails, sections.details.icon, sections.details.color)}
      {renderSection('location', sections.location.title, locationInfo, sections.location.icon, sections.location.color)}
      {renderSection('additional', sections.additional.title, additionalInfo, sections.additional.icon, sections.additional.color)}
    </div>
  );
};

export default BasicInfo;