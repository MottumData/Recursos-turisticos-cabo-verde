import React, { useState, useEffect, useRef } from 'react';
import { FaFilter, FaClock, FaHiking } from 'react-icons/fa';
import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';

interface LocaleType {
  [key: string]: string;
  Filter_Routes: string;
  Filter_Duration: string;
  Filter_Activity: string;
}

const iconMap: { [key in keyof LocaleType]?: React.ComponentType } = {
  Filter_Routes: FaFilter,
  Filter_Duration: FaClock,
  Filter_Activity: FaHiking,
};

const locales: { [key in 'pt' | 'en' | 'es']: LocaleType } = { pt, en, es };

type Language = 'pt' | 'en' | 'es';

interface CategoryFilterProps {
  language: Language;
  onFilterChange: (selectedFilters: string[]) => void;
  options?: { key: string; label: string }[];
  localeKey?: keyof LocaleType;
}

export default function CategoryFilter({
  language,
  onFilterChange,
  options,
  localeKey = 'Filter_Categories',
}: CategoryFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const locale = locales[language];
  const IconComponent = iconMap[localeKey] || FaFilter;
  const chipColors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-orange-200", "bg-gray-200"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
  }, [options, localeKey]);


  const toggleFilterOption = (filterKey: string) => {
    const newFilters = selectedFilters.includes(filterKey)
      ? selectedFilters.filter(f => f !== filterKey)
      : [...selectedFilters, filterKey];

    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleFilterPanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative max-w-xs mx-auto" ref={filterRef}>
      <button
        onClick={toggleFilterPanel}
        className="flex justify-center items-center p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-lg w-full"
        title={locale[localeKey] || 'Filter'}
      >
        <IconComponent className="w-5 h-5 text-gray-600" />
      <span className="text-black-700 font-medium ml-3 text-[10px] sm:text-base">
        {localeKey === 'Filter_Categories' ? locale['Select resource types'] : 
         localeKey === 'Filter_Duration' ? locale['Select durations'] : 
         localeKey === 'Filter_Activity' ? locale['Select activities'] : 'Seleccionar filtro'}
      </span>
      </button>

      {isOpen && (
        <div
        className="absolute mt-2 
          left-0 sm:left-auto sm:right-0  
          w-40 sm:w-80 
          bg-white border border-gray-200 rounded-lg shadow-lg z-50 
          p-4"
        >
          <div className="space-y-2 overflow-y-auto max-h-60">
            {options ? (
              options.map(option => (
                <label
                  key={option.key}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 
                          transition-colors duration-200 cursor-pointer group"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(option.key)}
                      onChange={() => toggleFilterOption(option.key)}
                      className="appearance-none h-1 w-1 sm:h-4 sm:w-4 border-2 border-gray-300 rounded-md 
                              checked:bg-blue-500 checked:border-blue-500 
                              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                              transition-colors duration-200"
                    />
                    <span className="ml-3 text-[8px] sm:text-sm text-gray-700 font-medium
                          group-hover:text-gray-900 transition-colors duration-200">
                      {option.label}
                    </span>
                  </div>
                </label>
              ))
            ) : (
              Object.keys(locale)
                .filter(key => key.startsWith('Cara_'))
                .map(category => (
                  <label
                    key={category}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 
                            transition-colors duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFilters.includes(locale[category])}
                        onChange={() => toggleFilterOption(locale[category])}
                        className="appearance-none h-1 w-1 sm:h-4 sm:w-4 border-2 border-gray-300 rounded-md 
                                checked:bg-blue-500 checked:border-blue-500 
                                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                                transition-colors duration-200"
                      />
                      <span className="ml-3 text-[8px] sm:text-sm text-gray-700 font-medium
                                  group-hover:text-gray-900 transition-colors duration-200">
                        {locale[category]}
                      </span>
                    </div>
                  </label>
                ))
            )}
          </div>
        </div>
      )}
      {/* Nuevo contenedor de filtros seleccionados */}
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedFilters.map((filterKey, index) => (
          <div
            key={filterKey}
            className={`inline-flex items-center px-2 py-1 text-[8px] sm:text-xs font-medium rounded ${chipColors[index % chipColors.length]} text-gray-800`}
          >
            {filterKey}
            <button
              className="ml-1 font-bold text-gray-600 hover:text-black"
              onClick={() => toggleFilterOption(filterKey)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}