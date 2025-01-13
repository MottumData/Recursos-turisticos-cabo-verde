import React, { useEffect, useRef, useState } from 'react';
import CategoryFilter from './filter';
import { useLanguage } from '../components/languageContext'; // Asegúrate de que la ruta sea correcta
import { Route, loadRoutesCSV} from '../components/loadCsv';
import Image from 'next/image';

type Language = 'pt' | 'en' | 'es';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  content: React.ReactNode;
  language: Language;
  setFilteredCategories: (categories: string[]) => void;
  locale: { [key: string]: string };
  onRouteSelect: (route: Route | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, setFilteredCategories, locale, onRouteSelect}) => {
  const { language, setLanguage } = useLanguage() as { language: Language; setLanguage: (lang: Language) => void };
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    console.log('Loading routes...');
    const csvFilePath = `/data/rutas_cabo_verde_${language}.csv`;
    loadRoutesCSV(csvFilePath, language).then(data => {
      console.log('Loaded routes:', data); // Log the dataset of routes
      setRoutes(data);
    }).catch(error => {
      console.error('Error loading routes:', error);
    });
  }, [language]);

  const handleRouteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const routeName = event.target.value;
    setSelectedRoute(routeName);
    const route = routes.find(r => r.name === routeName) || null;
    onRouteSelect(route);
    onClose();
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-white shadow-2xl 
        transform transition-transform duration-300 ease-in-out z-[10000] overflow-y-auto
        w-[60vw] sm:w-[40vw] md:max-w-[400px]
        flex flex-col
        ${visible ? 'translate-x-0' : '-translate-x-full'}`}
    >

      {/* Header Section */}
      <div className="p-3 sm:p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <Image 
              src="/Logo_cabo_verde.png"
              alt="Logo Cabo Verde"
              width={90} // Reducido en móvil
              height={90}
              className="object-contain sm:w-[130px] sm:h-[130px]"
              priority
            />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center">
              {locale['Santiago Resources map']}
            </h2>
          </div>
        </div>
      </div>

      {/* Filtros Section */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
          {locale['Categories'] || 'Categories'}
        </h3>
        <CategoryFilter 
          language={language}
          onFilterChange={setFilteredCategories}
        />
      </div>
    
      {/* Rutas Section */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
          {locale['Select_Route'] || 'Select Route'}
        </h3>
        <select
          value={selectedRoute}
          onChange={handleRouteChange}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg 
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 text-sm sm:text-base"
        >
          <option value="">{locale['Select_Route'] || 'Select Route'}</option>
          {routes.map(route => (
            <option key={route.name} value={route.name}>{route.name}</option>
          ))}
        </select>
      </div>

      {/* Idiomas Section */}
      <div className="mt-auto px-2 py-2 sm:px-4 sm:py-3 border-t border-gray-100">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">
          {locale['Select_Language'] || 'Select Language'}
        </h3>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-600 py-1.5 px-2 rounded 
                     text-xs sm:text-sm
                     focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent
                     transition-all duration-200"
        >
          <option value="pt">Português</option>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
    </div>
  );
}

export default Sidebar;