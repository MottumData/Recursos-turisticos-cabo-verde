import React, { useEffect, useRef, useState } from 'react';
import CategoryFilter from './filter';
import { useLanguage } from '../components/languageContext'; // Asegúrate de que la ruta sea correcta
import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';
import { Route, loadRoutesCSV} from '../components/loadCsv';

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

const locales = { pt, en, es };

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, content, setFilteredCategories, locale, onRouteSelect}) => {
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
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-white shadow-2xl 
        transform transition-transform duration-300 ease-in-out z-[10000] overflow-y-auto
        ${visible ? 'translate-x-0' : '-translate-x-full'}`}
      style={{ width: '90vw', maxWidth: '400px' }}
    >
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {locale['Santiago Resources map']}
          </h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 transform hover:scale-105"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
  
      {/* Language and Filters Section */}
      <div className="px-6 py-8 space-y-6 border-b border-gray-200">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {locale['Select_Language'] || 'Select Language'}
          </label>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value as keyof typeof locales)} 
            className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg 
                      shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200"
          >
            <option value="pt">Português</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {locale['Select_Route'] || 'Select Route'}
          </label>
          <select 
            value={selectedRoute} 
            onChange={handleRouteChange} 
            className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg 
                      shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      transition-all duration-200"
          >
            <option value="">{locale['Select_Route'] || 'Select Route'}</option>
            {routes.map(route => (
              <option key={route.name} value={route.name}>{route.name}</option>
            ))}
          </select>
        </div>
  
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">
            {locale['Categories'] || 'Categories'}
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <CategoryFilter 
              language={language}
              onFilterChange={setFilteredCategories}
            />
          </div>
        </div>
      </div>
  
      {/* Content Section */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 280px)' }}>
        {content}
      </div>
    </div>
  );
}

export default Sidebar;
