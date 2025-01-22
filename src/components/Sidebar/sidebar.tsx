import React, { useRef, useState, useEffect } from 'react';
import Header from './header';
import Filters from './filters';
import LanguageSelector from './languageSelector';
import CategoryFilter from '../filter';
import pt from '../../../public/locale/pt';
import en from '../../../public/locale/en';
import es from '../../../public/locale/es';
import { useLanguage } from '../Utils/languageContext';
import { Route } from '../Utils/loadCsv';
import useSidebarHooks from './sidebarUtils';
import { FaInfoCircle } from 'react-icons/fa';
import RouteModal from './modal';

type Language = 'pt' | 'en' | 'es';

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
  content: React.ReactNode;
  language: Language;
  setFilteredCategories: (categories: string[]) => void;
  locale: { [key: string]: string };
  onRouteSelect: (route: Route | null) => void;
  openModal: () => void;
}

const locales = { pt, en, es };

const Sidebar: React.FC<SidebarProps> = ({ visible, onClose, onOpen ,content, setFilteredCategories, locale, onRouteSelect, openModal }) => {
  const { language, setLanguage } = useLanguage() as { language: Language; setLanguage: (lang: Language) => void };
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('');

  const [filteredDurations, setFilteredDurations] = useState<string[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<string[]>([]);

  const [durationOptions, setDurationOptions] = useState<{ key: string; label: string }[]>([]);
  const [activityOptions, setActivityOptions] = useState<{ key: string; label: string }[]>([]);

  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);

  // Use the custom hook to handle useEffects
  useSidebarHooks({
    sidebarRef,
    onClose,
    language,
    locale,
    setRoutes,
    setDurationOptions,
    setActivityOptions,
    routes,
    filteredDurations,
    filteredActivities,
    setFilteredRoutes
  });

  const handleRouteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const routeName = event.target.value;
    setSelectedRoute(routeName);
    const route = routes.find(r => r.name === routeName) || null;
    onRouteSelect(route);
    onClose();
  };

  useEffect(() => {
    setFilteredCategories([]);
    setFilteredDurations([]);
    setFilteredActivities([]);
    setSelectedRoute('');
  }, [language]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-white shadow-2xl 
        transform transition-transform duration-300 ease-in-out z-[10000] overflow-y-auto
        w-[60vw] sm:w-[40vw] md:max-w-[400px]
        flex flex-col
        ${visible ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="h-full overflow-y-auto">
      <Header locale={locale} />

      <div className="px-4 py-4 sm:px-6 sm:py-6 border-b border-gray-200">
        <h3 className="text-xs sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
          {locale['Categories'] || 'Categories'}
        </h3>
        <CategoryFilter 
          language={language}
          onFilterChange={setFilteredCategories}
        />
      </div>

      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex gap-2 items-center mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-lg font-semibold text-gray-700">
            {locale['Select_Route'] || 'Select Route'}
          </h3>
          <button 
              onClick={openModal}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaInfoCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
        </div>
    
      <Filters
        language={language}
        setFilteredDurations={setFilteredDurations}
        setFilteredActivities={setFilteredActivities}
        durationOptions={durationOptions}
        activityOptions={activityOptions}
        locale={locale}
        filteredRoutesCount={filteredRoutes.length}
      />

        <select
          value={selectedRoute}
          onChange={handleRouteChange}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg 
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 text-sm sm:text-base"
        >
          <option value="">{locale['Select_Route'] || 'Select Route'}</option>
          {filteredRoutes.map(route => (
            <option key={route.name} value={route.name}>{route.name}</option>
          ))}
        </select>
      </div>

      <LanguageSelector
        language={language}
        setLanguage={setLanguage}
        locale={locale}
      />
      </div>
    </div>
  
  );
}

export default Sidebar;