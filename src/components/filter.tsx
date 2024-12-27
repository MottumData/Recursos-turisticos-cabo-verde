import { useState } from 'react';
import pt from '../../public/locale/pt';
import en from '../../public/locale/en';
import es from '../../public/locale/es';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef } from 'react';

interface LocaleType {
    [key: string]: string;
    Filter_Categories: string;
  }
  
  const locales: { [key in 'pt' | 'en' | 'es']: LocaleType } = { pt, en, es };
  
  type Language = 'pt' | 'en' | 'es';

interface CategoryFilterProps {
  language: Language;
  onFilterChange: (selectedCategories: string[]) => void;
}

export default function CategoryFilter({ language, onFilterChange }: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const locale = locales[language];

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

  const toggleCategory = (categoryKey: string) => {
    const newCategories = selectedCategories.includes(categoryKey)
      ? selectedCategories.filter(cat => cat !== categoryKey)
      : [...selectedCategories, categoryKey];
    
    setSelectedCategories(newCategories);
    onFilterChange(newCategories); // This will send the category keys to parent
  };

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={filterRef} className="relative">
      <button 
        onClick={toggleFilter} 
        className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
      >
        <FontAwesomeIcon icon={faFilter} className="text-gray-800" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 sm:w-56 md:w-64 lg:w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[40vh] overflow-y-auto">
          {Object.keys(locale)
            .filter(key => key.startsWith('Cara_'))
            .map(category => (
              <label 
                key={category} 
                className="flex items-center space-x-3 px-3 sm:px-4 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(locale[category])}
                  onChange={() => toggleCategory(locale[category])}
                  className="w-4 h-4 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-800 font-medium text-sm sm:text-base">{locale[category]}</span>
              </label>
            ))}
        </div>
      )}
    </div>
);
}